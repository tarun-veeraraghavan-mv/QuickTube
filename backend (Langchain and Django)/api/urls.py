from django.urls import include, path

from api.views import (
    ask_question,
    get_me,
    get_messages_for_user_and_video,
    get_video_by_id,
    get_videos_for_user,
    login_user,
    process_video,
    register_user,
)


urlpatterns = [
    path("register/", register_user),
    path("login/", login_user),
    path("me/", get_me),
    path("process-video/", process_video),
    path("ask-question/", ask_question),
    path("get-messages/<str:id>/", get_messages_for_user_and_video),
    path("get-video/<str:id>/", get_video_by_id),
    path("videos/", get_videos_for_user),
]
