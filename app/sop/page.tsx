import { SopWorkspace } from "@/components/echo/sop-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-Powered SOP Builder — EchoGPT",
  description:
    "Create compelling Statements of Purpose with AI assistance, tailored for your dream university and destination country.",
  openGraph: {
    title: "AI-Powered SOP Builder — EchoGPT",
    description:
      "Create compelling Statements of Purpose with AI assistance, tailored for your dream university and destination country.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function SopPage() {
  return <SopWorkspace />;
}
