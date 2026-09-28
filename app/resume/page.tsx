import { ResumeWorkspace } from "@/components/echo/resume-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Job Insight Assistant — EchoGPT",
  description:
    "EchoGPT AI Job Insight Assistant — Analyze job descriptions, tailor your resume for ATS screening, prepare for interviews, and discover critical skill gaps.",
  openGraph: {
    title: "AI Job Insight Assistant — EchoGPT",
    description:
      "EchoGPT AI Job Insight Assistant — Analyze job descriptions, tailor your resume for ATS screening, prepare for interviews, and discover critical skill gaps.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function ResumePage() {
  return <ResumeWorkspace />;
}
