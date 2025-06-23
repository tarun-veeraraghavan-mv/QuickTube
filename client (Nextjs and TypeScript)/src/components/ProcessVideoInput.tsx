"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/utils/AuthContext";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUwNjE2ODA5LCJpYXQiOjE3NTA2MTMyMDksImp0aSI6IjVhYTA3YzhkNjJjZDRmYjA5MzkwOGQ2NzQ1YzhjYzdjIiwidXNlcl9pZCI6N30.PIOu7VvwpbK151-2t8BA6rWWmgelcV0aUVsgyVQ5grc";

export default function ProcessVideoInput() {
  const [videoName, setVideoName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const { token } = useAuth();
  const router = useRouter();

  async function handleProcessVideo(e) {
    e.preventDefault();

    try {
      if (!videoName || !videoUrl) {
        toast.error("Please fill in all fields");
        return;
      }

      if (!token) {
        toast.error("Log in / Register to access this feature");
        return;
      }

      setLoading(true);
      setStatus("Extracting transcript...");
      const res = await axios.post(
        "http://localhost:8000/api/process-video/",
        {
          name: videoName,
          video_url: videoUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus("Processing video...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      setStatus("Done! Redirecting...");
      router.push(`/chat/${res.data.video.video_id}`);
      toast.success("Video processed successfully");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8">
      <form onSubmit={handleProcessVideo}>
        <div className="grid grid-cols-[1.2fr_2fr] gap-2">
          <input
            type="text"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            placeholder="Video name"
            className="outline-none w-full px-4 py-2.5 bg-gray-300 rounded-md mb-4"
          />
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Youtube link"
            className="outline-none w-full px-4 py-2.5 bg-gray-300 rounded-md mb-4"
          />
        </div>
        <button
          className="px-5 py-1.5 bg-blue-400 rounded-full text-white outline-none cursor-pointer"
          disabled={loading}
        >
          {loading ? status : "Add new video"}
        </button>
      </form>
    </div>
  );
}
