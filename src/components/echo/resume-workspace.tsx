"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { SidebarNav, type ThreadSummary } from "@/components/echo/sidebar-nav";
import {
  Lightbulb,
  Send,
  Plus,
  Clock,
  FileText,
  X,
  Sparkles,
  Bot,
  Copy,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Target,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type AnalysisMode = "insights" | "resume" | "interview" | "skill-gap";

interface SampleJob {
  title: string;
  company: string;
  category: string;
  description: string;
}

const SAMPLE_JOBS: SampleJob[] = [
  {
    title: "Senior Full Stack Engineer",
    company: "Vercel / Cloud Infrastructure",
    category: "Engineering",
    description: `We are looking for a Senior Full Stack Engineer to lead architecture across our Next.js edge platform.
Responsibilities:
- Build high-scale serverless APIs and real-time collaborative UI components using React, Next.js, and TypeScript.
- Optimize edge network performance, client latency, and caching strategies.
- Collaborate with product designers and platform engineers to deliver intuitive developer tooling.
Requirements:
- 5+ years of production experience with TypeScript, React, and Node.js.
- Strong understanding of edge computing, distributed systems, and web performance metrics (Core Web Vitals).
- Experience with Tailwind CSS, GraphQL, and modern CI/CD pipelines.`,
  },
  {
    title: "AI Product Manager",
    company: "OpenAI Ecosystem Partner",
    category: "Product",
    description: `Seeking an experienced AI Product Manager to define the roadmap for our next-generation conversational agent workspace.
Responsibilities:
- Own the end-to-end product lifecycle for generative AI productivity features.
- Define model evaluation criteria, safety guardrails, and UX feedback loops.
- Partner closely with research engineers to translate cutting-edge foundation models into user-centric experiences.
Requirements:
- 4+ years of product management experience shipping SaaS products.
- Deep familiarity with LLM capabilities, prompting frameworks, and agent workflows.
- Strong analytical skills, SQL proficiency, and customer-first mindset.`,
  },
  {
    title: "Machine Learning Engineer",
    company: "Autonomous AI Lab",
    category: "AI / Data",
    description: `Join our team to fine-tune, deploy, and evaluate open-source reasoning models for enterprise workflows.
Responsibilities:
- Train and evaluate domain-adapted models (Llama, DeepSeek, Qwen) using LoRA and RLHF/DPO.
- Build high-throughput inference serving pipelines using vLLM and TensorRT-LLM.
- Implement automated benchmark evaluations and hallucination detection pipelines.
Requirements:
- Strong Python, PyTorch, and CUDA debugging skills.
- Hands-on experience with transformer architectures and distributed GPU training.
- MS or BS in Computer Science or equivalent practical experience.`,
  },
];

interface AnalysisResult {
  fitScore: number;
  roleOverview: string;
  keyResponsibilities: string[];
  requiredSkills: { skill: string; importance: "high" | "medium" | "bonus" }[];
  skillGaps: string[];
  tailoringAdvice: string[];
  interviewQuestions: string[];
}

export function ResumeWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Form State
  const [jobText, setJobText] = useState("");
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<AnalysisMode>("insights");
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auth sync
  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (active) setUser(data.user);
    };
    void loadUser();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  // Sync threads for sidebar
  useEffect(() => {
    const raw = localStorage.getItem("echogpt_threads_v1");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setThreads(
            parsed.map((t: any) => ({
              id: t.id,
              title: t.title || "Untitled",
              updated_at: t.updated_at || new Date().toISOString(),
            }))
          );
        }
      } catch {}
    }
  }, []);

  // Card click triggers
  const handleCardClick = (
    mode: AnalysisMode,
    templatePrefix: string
  ) => {
    setActiveMode(mode);
    if (!jobText.trim()) {
      setJobText(templatePrefix);
    }
    textareaRef.current?.focus();
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file.name);
      toast.success(`Attached resume: ${file.name}`);
    }
  };

  // Analyze Job Action
  const handleAnalyze = () => {
    const content = jobText.trim() || textareaRef.current?.value.trim() || "";
    if (!content && !attachedFile) {
      toast.error("Please paste a job description or attach a resume first.");
      textareaRef.current?.focus();
      return;
    }

    if (!jobText.trim() && content) {
      setJobText(content);
    }

    setIsAnalyzing(true);
    setResult(null);

    // Simulated robust intelligent analysis based on input
    setTimeout(() => {
      const isTech =
        content.toLowerCase().includes("engineer") ||
        content.toLowerCase().includes("developer") ||
        content.toLowerCase().includes("typescript") ||
        content.toLowerCase().includes("python");
      const isPM =
        content.toLowerCase().includes("product") ||
        content.toLowerCase().includes("manager");

      const analysis: AnalysisResult = {
        fitScore: isTech ? 88 : isPM ? 84 : 82,
        roleOverview:
          "Target position demands strong execution capability, domain proficiency, and cross-functional leadership. High alignment with modern industry best practices.",
        keyResponsibilities: [
          "Lead technical or strategic project execution with cross-functional partners.",
          "Ensure high standards for system reliability, code hygiene, and product intuition.",
          "Translate complex customer requirements into modular, deliverable milestones.",
          "Mentor and elevate junior teammates through rigorous reviews and shared patterns.",
        ],
        requiredSkills: isTech
          ? [
              { skill: "TypeScript & React / Next.js", importance: "high" },
              { skill: "Distributed Systems & Cloud Architecture", importance: "high" },
              { skill: "REST / GraphQL APIs & Database Design", importance: "medium" },
              { skill: "CI/CD & Automated Testing Pipelines", importance: "bonus" },
            ]
          : [
              { skill: "Product Roadmapping & PRDs", importance: "high" },
              { skill: "User Research & Quantitative Metrics (A/B testing)", importance: "high" },
              { skill: "Cross-functional Stakeholder Management", importance: "medium" },
              { skill: "AI / LLM Product Workflows", importance: "bonus" },
            ],
        skillGaps: isTech
          ? [
              "Demonstrated large-scale edge deployment metrics",
              "Production telemetry & OpenTelemetry observability experience",
            ]
          : [
              "Detailed case study showing enterprise ARR growth",
              "Prompt engineering & LLM evaluation benchmarks",
            ],
        tailoringAdvice: [
          "Reframe bullet points using Google XYZ formula: 'Accomplished [X] as measured by [Y] by doing [Z]'.",
          "Highlight concrete metrics (e.g. latency reduced by 35%, throughput increased 2x).",
          "Incorporate primary keywords directly into your summary header to pass ATS filters.",
        ],
        interviewQuestions: [
          "Tell me about a challenging architectural trade-off you had to defend under tight deadlines.",
          "How do you prioritize competing requests from executive stakeholders vs customer bug reports?",
          "Walk through how you debugged a mission-critical production issue with incomplete telemetry.",
          "What questions do you have for our engineering leadership regarding the roadmap?",
        ],
      };

      setResult(analysis);
      setIsAnalyzing(false);
      toast.success("Job insight analysis generated successfully!");
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 1200);
  };

  const handleCopyAnalysis = () => {
    if (!result) return;
    const text = `EchoGPT AI Job Insight Report
Fit Score: ${result.fitScore}%

Overview:
${result.roleOverview}

Key Responsibilities:
${result.keyResponsibilities.map((r) => `- ${r}`).join("\n")}

Skills Breakdown:
${result.requiredSkills.map((s) => `- ${s.skill} (${s.importance})`).join("\n")}

Tailoring Recommendations:
${result.tailoringAdvice.map((a) => `- ${a}`).join("\n")}
`;
    navigator.clipboard.writeText(text);
    toast.success("Analysis report copied to clipboard!");
  };

  const handleOpenChatWithJob = () => {
    const threadId = crypto.randomUUID();
    const prompt = `Here is a job description I want to analyze:\n\n${jobText}\n\nPlease help me tailor my resume, identify skill gaps, and prepare for interviews.`;
    localStorage.setItem(`echogpt_prefill_${threadId}`, prompt);
    router.push(`/chat/${threadId}`);
  };

  return (
    <div className="soft-grid flex h-dvh min-w-0 bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside className="hidden w-[296px] shrink-0 lg:block">
        <SidebarNav threads={threads} user={user} />
      </aside>

      {/* Main Workspace Area */}
      <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex h-14 items-center justify-between border-b border-border/40 px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg border border-border/80 bg-background text-foreground shadow-xs"
            aria-label="Open navigation menu"
          >
            <span className="text-lg">☰</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-heading font-semibold text-foreground text-sm">
              AI Job Insight
            </span>
            <span className="rounded-md bg-[#7c3aed] px-2 py-0.5 text-[11px] font-bold text-white">
              Assistant
            </span>
          </div>
          <div className="w-9" />
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative z-10 w-[296px] max-w-[85vw] bg-card shadow-2xl">
              <SidebarNav
                threads={threads}
                user={user}
                onClose={() => setMobileOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Center Content Container */}
        <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* Header Title Matching Reference */}
          <div className="mb-8 text-center sm:mb-10">
            <h1 className="flex flex-wrap items-center justify-center gap-2 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              <span>EchoGPT – AI Job Insight</span>
              <span className="inline-flex items-center rounded-2xl bg-[#7c3aed] px-3 py-0.5 text-xl font-bold text-white shadow-md sm:text-2xl">
                Assistant
              </span>
            </h1>
            <p className="mx-auto mt-2.5 max-w-xl text-sm text-muted-foreground/80 sm:text-base leading-relaxed">
              Analyze job descriptions, optimize your resume for ATS algorithms, and practice tailored interview questions in seconds.
            </p>
          </div>

          {/* 4 Quick Action Cards (2x2 Grid Matching Screenshot) */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Card 1: Analyze Job Description */}
            <button
              type="button"
              onClick={() =>
                handleCardClick(
                  "insights",
                  "Analyze this job description and break down core responsibilities, key qualifications, and red flags:\n\n"
                )
              }
              className={`group flex flex-col items-center justify-center rounded-2xl border p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                activeMode === "insights"
                  ? "border-[#8b5cf6] bg-card ring-1 ring-[#8b5cf6]/30 shadow-xs"
                  : "border-border/70 bg-card/60 hover:border-border hover:bg-card/90"
              }`}
            >
              <span className="text-base font-semibold text-[#8b5cf6] dark:text-[#a78bfa] transition-colors group-hover:text-[#7c3aed]">
                Analyze Job Description
              </span>
              <span className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Instantly get AI-powered insights for any job posting.
              </span>
            </button>

            {/* Card 2: Tailor Your Resume */}
            <button
              type="button"
              onClick={() =>
                handleCardClick(
                  "resume",
                  "Suggest specific improvements, keyword optimizations, and bullet point revisions to match my resume to this job:\n\n"
                )
              }
              className={`group flex flex-col items-center justify-center rounded-2xl border p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                activeMode === "resume"
                  ? "border-[#8b5cf6] bg-card ring-1 ring-[#8b5cf6]/30 shadow-xs"
                  : "border-border/70 bg-card/60 hover:border-border hover:bg-card/90"
              }`}
            >
              <span className="text-base font-semibold text-[#8b5cf6] dark:text-[#a78bfa] transition-colors group-hover:text-[#7c3aed]">
                Tailor Your Resume
              </span>
              <span className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Get suggestions to match your CV to the job requirements.
              </span>
            </button>

            {/* Card 3: Prepare for Interviews */}
            <button
              type="button"
              onClick={() =>
                handleCardClick(
                  "interview",
                  "Generate the top 5 behavioral and technical interview questions for this position with model answers and questions to ask:\n\n"
                )
              }
              className={`group flex flex-col items-center justify-center rounded-2xl border p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                activeMode === "interview"
                  ? "border-[#8b5cf6] bg-card ring-1 ring-[#8b5cf6]/30 shadow-xs"
                  : "border-border/70 bg-card/60 hover:border-border hover:bg-card/90"
              }`}
            >
              <span className="text-base font-semibold text-[#8b5cf6] dark:text-[#a78bfa] transition-colors group-hover:text-[#7c3aed]">
                Prepare for Interviews
              </span>
              <span className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Practice with AI-generated interview questions and tips.
              </span>
            </button>

            {/* Card 4: Skill Gap Analysis */}
            <button
              type="button"
              onClick={() =>
                handleCardClick(
                  "skill-gap",
                  "Perform a skill gap analysis for this role, identifying missing technical skills, credentials, and high-impact learning steps:\n\n"
                )
              }
              className={`group flex flex-col items-center justify-center rounded-2xl border p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                activeMode === "skill-gap"
                  ? "border-[#8b5cf6] bg-card ring-1 ring-[#8b5cf6]/30 shadow-xs"
                  : "border-border/70 bg-card/60 hover:border-border hover:bg-card/90"
              }`}
            >
              <span className="text-base font-semibold text-[#8b5cf6] dark:text-[#a78bfa] transition-colors group-hover:text-[#7c3aed]">
                Skill Gap Analysis
              </span>
              <span className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Discover key skills to focus on for your target role.
              </span>
            </button>
          </div>

          {/* Job Input Composer Box Matching Screenshot */}
          <div className="relative rounded-2xl border border-border/80 bg-background/95 p-4 shadow-sm backdrop-blur-xs transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 dark:bg-card/80">
            {/* Hidden File Upload Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Textarea */}
            <textarea
              id="job-description-textarea"
              ref={textareaRef}
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Paste job title & description here..."
              rows={4}
              className="w-full resize-none border-none bg-transparent pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-0 sm:text-base"
            />

            {/* Floating green AI assistant icon matching screenshot */}
            <div className="flex justify-end pr-1 pb-2">
              <div
                title="EchoGPT AI Job Engine Active"
                className="flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs"
              >
                <Bot className="size-3.5" />
              </div>
            </div>

            {/* Bottom Bar: Left Actions (Mode + Upload Resume) & Right Submit Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3">
              {/* Left Actions: Mode Picker & Resume Upload */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* 1. Mode Picker Pill */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-purple-300 bg-purple-50 px-3.5 py-1.5 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-100 dark:border-purple-800/60 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/50"
                  >
                    <Lightbulb className="size-3.5 text-purple-600 dark:text-purple-400" />
                    <span>
                      {activeMode === "insights"
                        ? "Job Insights"
                        : activeMode === "resume"
                        ? "Resume Match"
                        : activeMode === "interview"
                        ? "Interview Prep"
                        : "Skill Gap"}
                    </span>
                  </button>

                {/* Mode Menu Dropdown */}
                {isModeMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 rounded-xl border border-border/80 bg-popover p-1.5 shadow-lg z-30">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode("insights");
                        setIsModeMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                        activeMode === "insights"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 font-semibold"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <Lightbulb className="size-3.5 text-purple-600" />
                      <span>Job Insights</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode("resume");
                        setIsModeMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                        activeMode === "resume"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 font-semibold"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <FileText className="size-3.5 text-purple-600" />
                      <span>Resume Match</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode("interview");
                        setIsModeMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                        activeMode === "interview"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 font-semibold"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <Briefcase className="size-3.5 text-purple-600" />
                      <span>Interview Prep</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode("skill-gap");
                        setIsModeMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                        activeMode === "skill-gap"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 font-semibold"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <Target className="size-3.5 text-purple-600" />
                      <span>Skill Gap</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Professional Resume Upload Button / Active Chip */}
              {!attachedFile ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs font-medium text-foreground/80 shadow-2xs transition-all hover:border-primary/50 hover:bg-accent hover:text-foreground"
                  title="Upload Resume (PDF, DOCX, TXT)"
                >
                  <Paperclip className="size-3.5 text-muted-foreground" />
                  <span>Upload Resume</span>
                  <span className="hidden text-[10px] text-muted-foreground/70 sm:inline">
                    (PDF, DOCX)
                  </span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-300/80 bg-purple-50/90 px-3 py-1 text-xs font-medium text-purple-700 shadow-2xs dark:border-purple-800/60 dark:bg-purple-950/40 dark:text-purple-300">
                  <FileText className="size-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="max-w-[150px] truncate sm:max-w-[200px]">
                    {attachedFile}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    title="Remove attached resume"
                    className="ml-0.5 rounded-full p-0.5 hover:bg-purple-200/60 dark:hover:bg-purple-800/60"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Submit Button */}
            <button
              id="analyze-job-button"
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-2 rounded-xl bg-[#a78bfa] px-4 py-2 text-xs font-medium text-white shadow-xs transition-all hover:bg-[#8b5cf6] disabled:opacity-50 dark:bg-[#8b5cf6] dark:hover:bg-[#7c3aed] sm:text-sm"
            >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="size-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Job</span>
                    <Send className="size-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Display Area */}
          {result && (
            <div
              ref={resultsRef}
              className="mt-8 space-y-6 rounded-2xl border border-border/80 bg-card p-6 shadow-md"
            >
              {/* Header with Fit Score & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <TrendingUp className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Analysis Results
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      AI Job insight & resume compatibility breakdown
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Fit Score Badge */}
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5">
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      Match Score:
                    </span>
                    <span className="font-heading text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                      {result.fitScore}%
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAnalysis}
                    title="Copy Report"
                    className="flex size-9 items-center justify-center rounded-lg border border-border/70 hover:bg-accent text-foreground"
                  >
                    <Copy className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenChatWithJob}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                  >
                    <span>Discuss in Chat</span>
                    <ArrowUpRight className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Grid of Findings */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* 1. Key Responsibilities */}
                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <h4 className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <CheckCircle2 className="size-3.5 text-purple-500" />
                    <span>Key Responsibilities</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-foreground/90">
                    {result.keyResponsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 rounded-full bg-purple-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Skills & Match Analysis */}
                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <h4 className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <Target className="size-3.5 text-purple-500" />
                    <span>Skills Breakdown</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.requiredSkills.map((req, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${
                          req.importance === "high"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {req.skill}
                      </span>
                    ))}
                  </div>

                  <h5 className="mt-4 mb-2 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="size-3.5" />
                    <span>Identified Skill Gaps to Bridge</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {result.skillGaps.map((gap, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="size-1 rounded-full bg-amber-500 shrink-0" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Resume Tailoring Tips */}
                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <h4 className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <FileText className="size-3.5 text-purple-500" />
                    <span>Resume Tailoring Advice</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-foreground/90">
                    {result.tailoringAdvice.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Interview Questions */}
                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <h4 className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <MessageSquare className="size-3.5 text-purple-500" />
                    <span>Targeted Interview Questions</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-foreground/90">
                    {result.interviewQuestions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sample Jobs Dialog */}
      <Dialog open={isSampleModalOpen} onOpenChange={setIsSampleModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">
              Load Sample Job Posting
            </DialogTitle>
            <DialogDescription>
              Select an industry job description to instantly test insights, tailoring, and interview prep.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            {SAMPLE_JOBS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setJobText(sample.description);
                  setIsSampleModalOpen(false);
                  toast.success(`Loaded sample: ${sample.title}`);
                }}
                className="flex w-full flex-col items-start rounded-xl border border-border/70 p-3.5 text-left transition-colors hover:border-primary/50 hover:bg-accent"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-semibold text-sm text-foreground">
                    {sample.title}
                  </span>
                  <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[11px] font-medium text-purple-600 dark:text-purple-400">
                    {sample.category}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {sample.company}
                </span>
                <p className="mt-2 line-clamp-2 text-xs text-foreground/70">
                  {sample.description}
                </p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
