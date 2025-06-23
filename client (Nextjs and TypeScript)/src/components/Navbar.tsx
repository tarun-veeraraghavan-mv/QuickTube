import { useAuth } from "@/utils/AuthContext";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState({});
  const { token } = useAuth();

  useEffect(() => {
    async function fetchUser() {
      const res = await axios.get("http://localhost:8000/api/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setUser(res.data);
    }
    if (token) {
      fetchUser();
    }
  }, [token]);

  return (
    <div className="py-[14px] px-[32px] flex justify-between items-center border-b-[0.5px] border-b-black sticky top-[0px] z-100 bg-white">
      <div>
        <Link href="/" className="text-2xl font-bold">
          QuickTube
        </Link>
      </div>

      {!token ? (
        <div className="flex gap-5">
          <Link
            href="/login"
            className="px-4 py-2 rounded-full bg-blue-300 hover:bg-blue-400 cursor-pointer"
          >
            Login
          </Link>
          <Link
            href="/signin"
            className="px-4 py-2 rounded-full bg-blue-300 hover:bg-blue-400 cursor-pointer"
          >
            Signin
          </Link>
        </div>
      ) : (
        <div className="px-4 py-2 rounded-full bg-blue-300 hover:bg-blue-400 cursor-pointer">
          {user.username}
        </div>
      )}
    </div>
  );
}
