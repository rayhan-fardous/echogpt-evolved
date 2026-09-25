import { ChatWorkspace } from "@/components/echo/chat-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EchoGPT — Your focused AI workspace",
  description:
    "Think, write, and analyze in a calm AI workspace with organized conversations.",
  openGraph: {
    title: "EchoGPT — Your focused AI workspace",
    description:
      "Think, write, and analyze in a calm AI workspace with organized conversations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function HomePage() {
  return <ChatWorkspace />;
}
