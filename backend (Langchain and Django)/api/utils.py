from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi
import boto3


def get_transcript_from_url(url: str):
    video_id = get_video_id_from_url(url=url)

    if not video_id:
        print("Could not extract video ID from URL.")
        return

    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        transcript_text = " ".join([entry["text"] for entry in transcript_list])

        return transcript_text
    except Exception as e:
        print(f"Error fetching transcript: {e}")


def get_video_id_from_url(url: str):
    parsed_url = urlparse(url)
    video_id = None

    if parsed_url.hostname in ["www.youtube.com", "youtube.com"]:
        query = parse_qs(parsed_url.query)
        video_id = query.get("v", [None])[0]
    elif parsed_url.hostname == "youtu.be":
        video_id = parsed_url.path[1:]

    return video_id


def upload_text_to_s3(filename, content):
    s3 = boto3.client(
        "s3",
        aws_access_key_id="test123",
        aws_secret_access_key="test123",
        region_name="us-east-2",
        endpoint_url="http://localhost:4566",  # Remove this if you're using real AWS
    )

    s3.put_object(
        Bucket="s3-file-storage",
        Key=filename,
        Body=content,
        ContentType="text/plain",
    )

    return f"http://localhost:4566/s3-file-storage/{filename}"
