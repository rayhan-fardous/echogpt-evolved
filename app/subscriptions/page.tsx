import { SubscriptionsWorkspace } from "@/components/echo/subscriptions-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affordable Plans for Every Need — EchoGPT Subscriptions",
  description:
    "Want to get more out of EchoGPT Plus? Subscribe to one of our professional plans with access to over 265+ frontier AI models.",
  openGraph: {
    title: "Affordable Plans for Every Need — EchoGPT Subscriptions",
    description:
      "Want to get more out of EchoGPT Plus? Subscribe to one of our professional plans with access to over 265+ frontier AI models.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function SubscriptionsPage() {
  return <SubscriptionsWorkspace />;
}
