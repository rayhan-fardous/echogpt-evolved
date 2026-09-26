import { LegalWorkspace } from "@/components/echo/legal-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — EchoGPT",
  description: "Terms and conditions for using the EchoGPT AI conversational platform and workspace.",
  openGraph: {
    title: "Terms of Use — EchoGPT",
    description: "Terms and conditions for using the EchoGPT AI conversational platform and workspace.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function TermsOfUsePage() {
  return <LegalWorkspace activeDocument="terms-of-use" />;
}
