import { SupportWorkspace } from "@/components/echo/support-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talk with Our Team — EchoGPT Support",
  description:
    "Have a question, feedback, or need help with EchoGPT? Our engineering and support team is ready to help.",
  openGraph: {
    title: "Talk with Our Team — EchoGPT Support",
    description:
      "Have a question, feedback, or need help with EchoGPT? Our engineering and support team is ready to help.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function SupportPage() {
  return <SupportWorkspace />;
}
