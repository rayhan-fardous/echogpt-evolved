import { VideoStudioWorkspace } from "@/components/echo/video-studio-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Studio — EchoGPT",
  description: "Just type what you imagine, and the video makes itself with Google Veo, OpenAI Sora, and cinematic motion models.",
  openGraph: {
    title: "Video Studio — EchoGPT",
    description: "Just type what you imagine, and the video makes itself with Google Veo, OpenAI Sora, and cinematic motion models.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function VideoStudioPage() {
  return <VideoStudioWorkspace />;
}
