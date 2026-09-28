import { TasksWorkspace } from "@/components/echo/tasks-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EchoGPT AI Tasks — Explore Custom AI Workflows & Prompts",
  description:
    "Discover and create custom versions of ChatGPT that combine instructions, extra knowledge, and any combination of skills across Ideas, Work, Fun, and Online Content.",
  openGraph: {
    title: "EchoGPT AI Tasks — Explore Custom AI Workflows & Prompts",
    description:
      "Discover and create custom versions of ChatGPT that combine instructions, extra knowledge, and any combination of skills across Ideas, Work, Fun, and Online Content.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function TasksPage() {
  return <TasksWorkspace />;
}
