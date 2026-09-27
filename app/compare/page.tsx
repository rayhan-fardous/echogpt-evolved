import { CompareWorkspace } from "@/components/echo/compare-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Models — EchoGPT",
  description: "Ask one question and see how multiple frontier AI models answer side by side.",
  openGraph: {
    title: "Compare Models — EchoGPT",
    description: "Ask one question and see how multiple frontier AI models answer side by side.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function ComparePage() {
  return <CompareWorkspace />;
}
