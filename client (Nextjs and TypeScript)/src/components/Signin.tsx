"use client";

import axios from "axios";
import { useState } from "react";
import AppHeader from "./ui/AppHeader";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Signin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const res = await axios.post("http://localhost:8000/api/register/", {
      username: name,
      email,
      password,
    });

    const accessToken = res.data.tokens.access;
    setToken(accessToken);
    toast.success("Successfully created user");
    router.push("/");
  }

  return (
    <div>
      <AppHeader>Signin to your account</AppHeader>
      <div className="mb-8 flex justify-center">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="text-lg mb-2 block">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-[16px] bg-blue-100 px-4 py-2 w-[500px] rounded-md outline-none"
            />
          </div>
          <div className="mb-5">
            <label className="text-lg mb-2 block">Email</label>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-[16px] bg-blue-100  px-4 py-2 w-[500px] rounded-md outline-none"
            />
          </div>
          <div className="mb-7">
            <label className="text-lg mb-2 block">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-[16px] bg-blue-100  px-4 py-2 w-[500px] rounded-md outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-[500px] py-2 bg-blue-500 rounded-lg text-white font-bold text-[16px] outline-none"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="text-center">
        <Link
          href="/login"
          className="border-b-2 border-b-black mb-3 hover:border-b-0 outline-none"
        >
          Don&apos;t have an account. Login
        </Link>
      </div>
    </div>
  );
}
