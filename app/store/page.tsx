import { StoreWorkspace } from "@/components/echo/store-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EchoGPT Store — Discover Custom AI Models & Apps",
  description: "Discover and create custom versions of ChatGPT that combine instructions, extra knowledge, and any combination of skills.",
  openGraph: {
    title: "EchoGPT Store — Discover Custom AI Models & Apps",
    description: "Discover and create custom versions of ChatGPT that combine instructions, extra knowledge, and any combination of skills.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function StorePage() {
  return <StoreWorkspace />;
}
