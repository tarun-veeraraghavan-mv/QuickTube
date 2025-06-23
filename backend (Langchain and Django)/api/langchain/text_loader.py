from langchain_text_splitters import CharacterTextSplitter
from langchain_core.documents import Document
from urllib.parse import urlparse, parse_qs


def load_and_split_text(
    video_transcript_text, video_id, separator, chunk_size=550, chunk_overlap=100
):
    docs = [Document(page_content=video_transcript_text)]

    splitter = CharacterTextSplitter(
        separator=separator, chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )

    documents = splitter.split_documents(documents=docs)

    for doc in documents:
        doc.metadata["video_id"] = video_id

    return documents
