"use client";

import { useState } from "react";
import AppHeader from "./ui/AppHeader";
import { useAuth } from "@/utils/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
      }

      const res = await axios.post("http://localhost:8000/api/login/", {
        email,
        password,
      });

      const accessToken = res.data.tokens.access;
      setToken(accessToken);
      toast.success("Logged in successfully");
      router.push("/");
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Something went wrong!");
      }
    }
  }

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <AppHeader>Login to your account</AppHeader>
      <div className="mb-8 flex justify-center">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="text-lg mb-2 block">Email</label>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-[16px] bg-blue-100 px-4 py-2 w-[500px] rounded-md outline-none"
            />
          </div>
          <div className="mb-7">
            <label className="text-lg mb-2 block">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-[16px] bg-blue-100 px-4 py-2 w-[500px] rounded-md outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-[500px] py-2 bg-blue-500 rounded-lg text-white font-bold text-[16px] outline-none"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
