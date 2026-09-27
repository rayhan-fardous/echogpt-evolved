import { ImageStudioWorkspace } from "@/components/echo/image-studio-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Studio — EchoGPT",
  description: "Create images that stop the scroll with state-of-the-art AI vision and diffusion models.",
  openGraph: {
    title: "Image Studio — EchoGPT",
    description: "Create images that stop the scroll with state-of-the-art AI vision and diffusion models.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function ImageStudioPage() {
  return <ImageStudioWorkspace />;
}
