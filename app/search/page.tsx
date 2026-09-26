import { SearchWorkspace } from "@/components/echo/search-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search chats — EchoGPT",
  description: "Search your chat history across diverse models, topics, and conversations.",
  openGraph: {
    title: "Search chats — EchoGPT",
    description: "Search your chat history across diverse models, topics, and conversations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function SearchPage() {
  return <SearchWorkspace />;
}
