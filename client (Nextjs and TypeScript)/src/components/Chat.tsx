"use client";

import { useAuth } from "@/utils/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Chat({ videoId }: { videoId: string }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [botThinking, setBothThinking] = useState(false);
  const { token } = useAuth();

  function handleAddMessages(message) {
    setMessages((prev) => [...prev, message]);
  }

  useEffect(() => {
    async function fetchMessages() {
      const res = await axios.get(
        `http://localhost:8000/api/get-messages/${videoId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(res.data);
    }
    fetchMessages();
  }, [token, videoId]);

  async function handleAskQuestion(e) {
    e.preventDefault();

    try {
      handleAddMessages({ id: Date.now(), message: question, sender: "user" });

      setBothThinking(true);
      const res = await axios.post(
        "http://localhost:8000/api/ask-question/",
        {
          video_id: videoId,
          message: question,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleAddMessages(res.data);
      setQuestion("");
    } catch (err) {
      console.log(err);
    } finally {
      setBothThinking(false);
    }
  }

  return (
    <div className="bg-white h-[90vh] rounded-xl flex flex-col shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-300">
        <p className="text-xl font-bold text-gray-800">Ask a question</p>
      </div>

      {/* Messages scrollable area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        <ul className="flex flex-col">
          {messages?.map((m) => (
            <li
              key={m.id}
              className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                m.sender === "user"
                  ? "bg-blue-500 text-white self-end rounded-br-none ml-auto"
                  : "bg-gray-200 text-black self-start rounded-bl-none"
              }`}
            >
              {m.message}
            </li>
          ))}
        </ul>

        {botThinking && (
          <p className="text-sm text-gray-500 italic">Chatbot is typing...</p>
        )}
      </div>

      {/* Input box pinned to bottom */}
      <div className="p-4 border-t border-gray-300 bg-white">
        <form className="flex gap-2" onSubmit={handleAskQuestion}>
          <input
            type="text"
            placeholder="Ask something..."
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-400 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-500 transition cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
