import Chat from "@/components/Chat";
import ChatClientComp from "@/components/ChatClientComp";
import { useAuth } from "@/utils/AuthContext";
import axios from "axios";

type pageParams = Promise<{ videoId: string }>;

export default async function page(props: { params: pageParams }) {
  const { videoId } = await props.params;

  return <ChatClientComp videoId={videoId} />;
}
