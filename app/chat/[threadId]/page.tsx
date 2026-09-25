import { ChatWorkspace } from "@/components/echo/chat-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversation — EchoGPT",
  description: "A focused EchoGPT conversation workspace.",
  openGraph: {
    title: "Conversation — EchoGPT",
    description: "A focused EchoGPT conversation workspace.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

type Props = {
  params: Promise<{ threadId: string }>;
};

export default async function ChatThreadPage({ params }: Props) {
  const { threadId } = await params;
  return <ChatWorkspace threadId={threadId} />;
}
