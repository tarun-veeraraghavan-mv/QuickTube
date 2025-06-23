"use client";

import { useAuth } from "@/utils/AuthContext";
import { formatTimestamp } from "@/utils/formatTimestamp";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchUserVideos() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/videos/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data);
        setVideos(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    if (token) {
      fetchUserVideos();
    } else {
      setVideos([]);
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p className="text-2xl font-bold mb-5">Your videos</p>
      {videos.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {videos.map((v) => (
            <li
              key={v.id}
              className="flex justify-between align-middle bg-gray-200 p-3 rounded-md"
            >
              <div>
                <p>{v.id}</p>
                <p>
                  <a href={v.video_url} target="_blank">
                    View on YouTube &rarr;
                  </a>
                </p>
                <Link href={`/chat/${v.video_id}`}>
                  Continue conversation &rarr;
                </Link>
                <p>
                  <a href={v.video_transcript_url} target="_blank">
                    View transcript &rarr;
                  </a>
                </p>
              </div>
              <div>
                <p>{formatTimestamp(v.created_at)}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>👋 Start adding new videos!</p>
      )}
    </div>
  );
}
