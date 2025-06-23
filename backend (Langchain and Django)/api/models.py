from django.db import models
from django.contrib.auth.models import User


class Video(models.Model):
    name = models.TextField(max_length=15)
    video_id = models.TextField(max_length=15)
    video_url = models.URLField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    video_transcript_url = models.URLField(max_length=300)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class ChatMessage(models.Model):
    sender = models.TextField(max_length=10)
    message = models.TextField(max_length=900)
    created_at = models.DateTimeField(auto_now_add=True)
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE)
