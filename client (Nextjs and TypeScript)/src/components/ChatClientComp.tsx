"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Chat from "./Chat";
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "next/navigation";

export default function ChatClientComp({ videoId }: { videoId: string }) {
  const [existingVideo, setExistingVideo] = useState({});
  const [videoDetails, setVideoDetails] = useState({});
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token]);

  useEffect(() => {
    async function fetchVideo() {
      const res1 = await axios.get(
        `http://localhost:8000/api/get-video/${videoId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res1.data);
      setExistingVideo(res1.data);

      const res2 = await axios.get(
        `https://www.youtube.com/oembed?url=${res1.data.video_url}&format=json`
      );
      console.log(res2.data);
      setVideoDetails(res2.data);
    }

    fetchVideo();
  }, []);

  return (
    <div className="p-7 grid grid-cols-[2.2fr_1fr]">
      {videoDetails ? (
        <div className="max-h-[800px] overflow-y-auto">
          <div className="mb-6">
            <img
              src={videoDetails.thumbnail_url}
              alt="youtube thumbnail"
              className="w-[90%] h-[450px]"
            />
          </div>
          <div>
            <p className="text-2xl font-bold mb-4">{videoDetails.title}</p>
            <p className="text-lg mb-4">
              <strong>View the channel here:</strong>
              <a
                href={videoDetails.author_url}
                className="border-b-2 border-b-black hover:border-b-white"
                target="_blank"
              >
                {videoDetails.author_url}
              </a>
            </p>
            <p className="text-lg mb-4">
              <strong>Youtuber name:</strong> {videoDetails.author_name}
            </p>
            <p className="text-lg">
              <strong> Youtube video link:</strong>
              <a
                href={existingVideo.video_url}
                className="border-b-2 border-b-black hover:border-b-white"
                target="_blank"
              >
                {existingVideo.video_url}
              </a>
            </p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {/* Chat sidebar */}
      {existingVideo.video_id ? (
        <Chat videoId={existingVideo.video_id} />
      ) : (
        <p>Loading chat...</p>
      )}
    </div>
  );
}
