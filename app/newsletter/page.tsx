import { NewsletterWorkspace } from "@/components/echo/newsletter-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elevate Your AI Strategy — EchoGPT Newsletter",
  description:
    "Join 50,000+ professionals receiving curated insights on AI productivity, industry trends, and exclusive EchoGPT features.",
  openGraph: {
    title: "Elevate Your AI Strategy — EchoGPT Newsletter",
    description:
      "Join 50,000+ professionals receiving curated insights on AI productivity, industry trends, and exclusive EchoGPT features.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function NewsletterPage() {
  return <NewsletterWorkspace />;
}
