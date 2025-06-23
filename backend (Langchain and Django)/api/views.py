from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from django.shortcuts import get_object_or_404
from httpx import request
from langchain_openai import ChatOpenAI
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from torch import view_copy

from api.langchain.db import get_db
from api.langchain.embedding import get_embedding
from api.langchain.text_loader import load_and_split_text
from api.models import ChatMessage, ChatSession, Video
from api.serializers import ChatMessageSerializer, UserSerializer, VideoSerializer
from api.utils import get_transcript_from_url, get_video_id_from_url, upload_text_to_s3

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate


# user views
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user=user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}


@api_view(["POST"])
def register_user(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not email or not password:
        return Response(
            {"error": "Username, email, and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(username=username, email=email, password=password)
    tokens = get_tokens_for_user(user=user)

    serializer = UserSerializer(user)
    return Response(
        {"message": "User created", "user": serializer.data, "tokens": tokens},
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )

    # Now authenticate with username and password
    user = authenticate(username=user.username, password=password)
    if user is not None:
        tokens = get_tokens_for_user(user)
        return Response(
            {"message": "Login successful", "tokens": tokens},
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_me(request):
    user = request.user
    return Response({"id": user.id, "username": user.username, "email": user.email})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_me(request):
    user = request.user
    user.delete()
    return Response(
        {"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT
    )


# video views
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def process_video(request):
    video_name = request.data.get("name")
    video_url = request.data.get("video_url")

    video_id = get_video_id_from_url(url=video_url)
    video_transcript = get_transcript_from_url(url=video_url)

    # store transcript to S3
    s3_video_name = "-".join(video_name.split())
    s3_transcript_url = upload_text_to_s3(
        filename=s3_video_name, content=video_transcript
    )

    documents = load_and_split_text(
        video_transcript_text=video_transcript,
        video_id=video_id,
        separator=" ",
    )

    index_name = "youtube-rag-app"
    huggingface_embedding = get_embedding()
    vector_store = get_db(embedding=huggingface_embedding, index_name=index_name)
    vector_store.add_documents(documents=documents)

    video = Video.objects.create(
        name=video_name,
        video_id=video_id,
        video_url=video_url,
        video_transcript_url=s3_transcript_url,
        user=request.user,
    )
    serializer = VideoSerializer(video)

    return Response(
        {"message": "Video successfully processed", "video": serializer.data}
    )


llm = ChatOpenAI(
    openai_api_key="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",
    openai_api_base="https://openrouter.ai/api/v1",
    model="deepseek/deepseek-r1-0528-qwen3-8b:free",
)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def ask_question(request):
    user = request.user
    video_id = request.data.get("video_id")
    message = request.data.get("message")

    if not video_id or not message:
        return Response(
            {"error": "Missing video_id or message"}, status=status.HTTP_400_BAD_REQUEST
        )

    videos = Video.objects.filter(video_id=video_id, user=user)
    video = videos.first()

    # create or get an existing session
    session, created_session = ChatSession.objects.get_or_create(user=user, video=video)

    ChatMessage.objects.create(sender="user", message=message, session=session)

    # langchain
    index_name = "youtube-rag-app"
    huggingface_embedding = get_embedding()
    vector_store = get_db(embedding=huggingface_embedding, index_name=index_name)

    top_results = vector_store.similarity_search(
        message, k=4, filter={"video_id": video_id}
    )

    join_context = "\n Content \n".join([doc.page_content for doc in top_results])

    prompt = ChatPromptTemplate.from_template(
        "You are a expirirnced assisstant good at understanding text and answering questions. Based on this:\n\n {context}\n\n Answer this question from the user:\n\n {question}\n\n. These are your instructions:\n\n 1. Be clear, concise and short, do not repeat information or hallucinate anything.\n 2. Even though, you are given text content always mention it as 'video'. Never say anything like text or transcript ever."
    )

    chain = prompt | llm
    res = chain.invoke({"context": join_context, "question": message})

    bot_message = ChatMessage.objects.create(
        sender="bot", message=res.content, session=session
    )
    serializer = ChatMessageSerializer(bot_message)

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_messages_for_user_and_video(request, id):
    user = request.user
    video = Video.objects.get(video_id=id, user=user)

    session = ChatSession.objects.get(user=user, video=video)

    messages = ChatMessage.objects.filter(session=session).order_by("created_at")

    serializer = ChatMessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_video_by_id(request, id):
    user = request.user
    video = Video.objects.get(video_id=id, user=user)
    serializer = VideoSerializer(video)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_videos_for_user(request):
    user = request.user
    videos = Video.objects.filter(user=user)
    serializer = VideoSerializer(videos, many=True)
    return Response(serializer.data)
