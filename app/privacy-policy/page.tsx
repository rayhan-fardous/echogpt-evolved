import { LegalWorkspace } from "@/components/echo/legal-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — EchoGPT",
  description: "Privacy policy explaining how EchoGPT collects, protects, and handles your personal data.",
  openGraph: {
    title: "Privacy Policy — EchoGPT",
    description: "Privacy policy explaining how EchoGPT collects, protects, and handles your personal data.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function PrivacyPolicyPage() {
  return <LegalWorkspace activeDocument="privacy-policy" />;
}
