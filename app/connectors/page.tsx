import { ConnectorsWorkspace } from "@/components/echo/connectors-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connectors & Integrations — EchoGPT",
  description: "Connect your workspace, docs, repositories, and databases to power context-aware AI.",
  openGraph: {
    title: "Connectors & Integrations — EchoGPT",
    description: "Connect your workspace, docs, repositories, and databases to power context-aware AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function ConnectorsPage() {
  return <ConnectorsWorkspace />;
}
