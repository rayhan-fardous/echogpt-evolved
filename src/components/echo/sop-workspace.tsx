"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { SidebarNav, type ThreadSummary } from "@/components/echo/sidebar-nav";
import {
  GraduationCap,
  Sparkles,
  Globe,
  Users,
  Briefcase,
  Microscope,
  Palette,
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  Info,
  Copy,
  Check,
  Download,
  RotateCcw,
  MessageSquare,
  ChevronRight,
  CircleAlert,
  Trash2,
  History,
  Eye,
  RefreshCw,
  Printer,
} from "lucide-react";
import { toast } from "sonner";

/* ---------------- Types & Data ---------------- */
export type SopStep = "template" | "country" | "form" | "result";

export interface SopHistoryItem {
  id: string;
  fullName: string;
  fieldOfStudy: string;
  degreeLevel: string;
  targetUniversity: string;
  templateId: string;
  templateTitle: string;
  countryId: string;
  countryName: string;
  countryFlag: string;
  content: string;
  createdAt: string;
  wordCount: number;
}

export const SAMPLE_SOP_HISTORY: SopHistoryItem[] = [
  {
    id: "sop-sample-1",
    fullName: "Alex Rivera",
    fieldOfStudy: "Artificial Intelligence & Data Science",
    degreeLevel: "Master of Science",
    targetUniversity: "Stanford University",
    templateId: "academic",
    templateTitle: "Academic Excellence",
    countryId: "usa",
    countryName: "United States",
    countryFlag: "🇺🇸",
    content: `STATEMENT OF PURPOSE\n\nApplicant: Alex Rivera\nProposed Program: Master of Science in Artificial Intelligence & Data Science\nInstitution: Stanford University\nDestination: United States (F-1 Student Visa)\nTrack: Academic Excellence\n\n---\n\nI. INTRODUCTION & STATEMENT OF OBJECTIVES\nI am writing to express my focused ambition to pursue the Master of Science in Artificial Intelligence & Data Science at Stanford University...`,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    wordCount: 842,
  },
  {
    id: "sop-sample-2",
    fullName: "Sarah Chen",
    fieldOfStudy: "Quantum Computing & Applied Physics",
    degreeLevel: "Doctor of Philosophy (PhD)",
    targetUniversity: "University of Cambridge",
    templateId: "research",
    templateTitle: "Research Focused",
    countryId: "uk",
    countryName: "United Kingdom",
    countryFlag: "🇬🇧",
    content: `STATEMENT OF PURPOSE\n\nApplicant: Sarah Chen\nProposed Program: Doctor of Philosophy (PhD) in Quantum Computing\nInstitution: University of Cambridge\nDestination: United Kingdom (Student Visa Route)\nTrack: Research Focused\n\n---\n\nI. INTRODUCTION & STATEMENT OF OBJECTIVES\nI am writing to express my focused ambition to pursue doctoral research at Cambridge...`,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    wordCount: 915,
  },
];

export interface SopTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

export interface DestinationCountry {
  id: string;
  name: string;
  flag: string;
  visaType: string;
  wordCount: string;
  processingTime: string;
  keyRequirements: string[];
}

export const SOP_TEMPLATES: SopTemplate[] = [
  {
    id: "academic",
    title: "Academic Excellence",
    description: "Ideal for students with strong academic records applying to graduate programs.",
    icon: GraduationCap,
    tags: ["Academic", "Graduate Studies", "Scholarships"],
  },
  {
    id: "professional",
    title: "Professional Track",
    description: "Designed for applicants with significant work experience seeking advanced degrees.",
    icon: Briefcase,
    tags: ["Career", "Professional Development", "MBA"],
  },
  {
    id: "research",
    title: "Research Focused",
    description: "Perfect for research-oriented applicants targeting PhD or research-intensive programs.",
    icon: Microscope,
    tags: ["Research", "PhD", "Innovation"],
  },
  {
    id: "creative",
    title: "Creative Arts",
    description: "Tailored for applicants to creative programs like fine arts, design, or writing.",
    icon: Palette,
    tags: ["Creative", "Arts", "Portfolio"],
  },
];

export const DESTINATION_COUNTRIES: DestinationCountry[] = [
  {
    id: "us",
    name: "United States",
    flag: "🇺🇸",
    visaType: "F-1 Student Visa",
    wordCount: "500–1000 words",
    processingTime: "3–5 weeks",
    keyRequirements: ["Clear statement of purpose", "Academic and professional trajectory"],
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    visaType: "Student Visa (Tier 4)",
    wordCount: "500–1000 words",
    processingTime: "3 weeks (outside UK)",
    keyRequirements: ["Personal statement focusing on course fit", "Relevant experience and academic rigor"],
  },
  {
    id: "ca",
    name: "Canada",
    flag: "🇨🇦",
    visaType: "Study Permit",
    wordCount: "500–1000 words",
    processingTime: "4–6 weeks",
    keyRequirements: ["Statement of interest in institution", "Academic background and ties to home country"],
  },
  {
    id: "au",
    name: "Australia",
    flag: "🇦🇺",
    visaType: "Student Visa (Subclass 500)",
    wordCount: "300–500 words",
    processingTime: "4–6 weeks",
    keyRequirements: ["Genuine Temporary Entrant (GTE) criteria", "Clear relevance to future career"],
  },
  {
    id: "de",
    name: "Germany",
    flag: "🇩🇪",
    visaType: "Student Visa (National Visa)",
    wordCount: "500–750 words",
    processingTime: "6–8 weeks",
    keyRequirements: ["Structured letter of motivation", "Academic curriculum and prerequisite fit"],
  },
  {
    id: "fr",
    name: "France",
    flag: "🇫🇷",
    visaType: "Student Visa (VLS-TS)",
    wordCount: "500–1000 words",
    processingTime: "3–4 weeks",
    keyRequirements: ["Études en France compliance", "Clear professional project and study motivation"],
  },
];

/* ---------------- Main Component ---------------- */
export function SopWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Workflow State
  const [currentStep, setCurrentStep] = useState<SopStep>("template");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [degreeLevel, setDegreeLevel] = useState("");
  const [targetUniversity, setTargetUniversity] = useState("");
  const [academicBackground, setAcademicBackground] = useState("");
  const [relevantExperience, setRelevantExperience] = useState("");
  const [futureGoals, setFutureGoals] = useState("");

  // Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSop, setGeneratedSop] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // History State
  const [history, setHistory] = useState<SopHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(false);

  // Find active selections
  const currentTemplate =
    SOP_TEMPLATES.find((t) => t.id === selectedTemplateId) || SOP_TEMPLATES[0];
  const currentCountry =
    DESTINATION_COUNTRIES.find((c) => c.id === selectedCountryId) || DESTINATION_COUNTRIES[0];

  // URL Query Sync for direct step navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get("step") as SopStep;
      if (stepParam && ["template", "country", "form", "result"].includes(stepParam)) {
        setCurrentStep(stepParam);
      }
      const tplParam = params.get("template");
      if (tplParam && SOP_TEMPLATES.some((t) => t.id === tplParam)) {
        setSelectedTemplateId(tplParam);
      }
      const countryParam = params.get("country");
      if (countryParam && DESTINATION_COUNTRIES.some((c) => c.id === countryParam)) {
        setSelectedCountryId(countryParam);
      }
    }
  }, []);

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
            parsed.map((item: any) => ({
              id: item.id,
              title: item.title || "Untitled Conversation",
              updated_at: item.updated_at || new Date().toISOString(),
            }))
          );
        }
      } catch (err) {
        console.error("Failed to parse threads:", err);
      }
    }
  }, []);

  // Sync SOP history from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("echogpt_sop_history_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to read SOP history from localStorage:", err);
      setHistoryError(true);
    }
  }, []);

  // Pre-fill sample values for convenient testing
  const handleLoadSample = () => {
    setFullName("Alex Morgan");
    setFieldOfStudy("Computer Science & Artificial Intelligence");
    setDegreeLevel("Master of Science");
    setTargetUniversity("Stanford University");
    setAcademicBackground(
      "Graduated with a Bachelor of Science in Computer Engineering (GPA 3.89/4.00) from University of Michigan. Completed honors capstone on distributed deep learning optimization and published research on edge inference."
    );
    setRelevantExperience(
      "3 years as Senior Machine Learning Engineer at NovaTech Systems. Architected multimodal search systems processing 20M+ queries daily, reduced model inference latency by 42%, and mentored junior engineers on PyTorch pipelines."
    );
    setFutureGoals(
      "To spearhead research in efficient large language model reasoning and trustworthy AI systems, eventually leading an applied AI research laboratory that bridges academia and high-impact industry applications."
    );
    toast.success("Sample application details loaded!");
  };

  // Generation Handler
  const handleGenerate = () => {
    if (!fieldOfStudy.trim() || !targetUniversity.trim()) {
      toast.error("Please fill in your Field of Study and Target University.");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const applicantName = fullName.trim() || "Applicant";
      const programDegree = degreeLevel.trim() || "Graduate Degree";
      const university = targetUniversity.trim() || "Target University";
      const major = fieldOfStudy.trim() || "Computer Science";

      const sopText = `STATEMENT OF PURPOSE

Applicant: ${applicantName}
Proposed Program: ${programDegree} in ${major}
Institution: ${university}
Destination: ${currentCountry.name} (${currentCountry.visaType})
Track: ${currentTemplate.title}

---

I. INTRODUCTION & STATEMENT OF OBJECTIVES
I am writing to express my focused ambition to pursue the ${programDegree} in ${major} at ${university}. As modern computational challenges require deeper technical discernment and ethical responsibility, this program represents the pivotal environment to elevate my technical foundations into breakthrough research and applied innovation. Having evaluated ${currentCountry.name}'s rigorous standards for ${major}, I am committed to dedicating my full academic potential to your vibrant scholar community.

II. ACADEMIC FOUNDATION & INTELLECTUAL TRAJECTORY
${
  academicBackground.trim()
    ? academicBackground.trim()
    : `Throughout my undergraduate curriculum, I rigorously engaged with fundamental theory, computational frameworks, and algorithmic optimization. My academic journey cultivated a keen appreciation for analytical precision and independent problem-solving.`
}
These academic milestones instilled in me the discipline required to formulate rigorous research hypotheses, evaluate empirical results under uncertainty, and design scalable algorithmic solutions.

III. PROFESSIONAL EXCELLENCE & PRACTICAL IMPACT
${
  relevantExperience.trim()
    ? relevantExperience.trim()
    : `In my professional endeavors, I have consistently tackled high-dimensional challenges, collaborating cross-functionally to design production-grade systems that deliver tangible value. My work has refined my leadership capabilities, resilience in debugging complex architectures, and ability to communicate technical complexity clearly.`
}
Operating at the intersection of engineering and strategic execution taught me that genuine technological advancements demand both rigorous mathematical rigor and human-centric empathy.

IV. WHY ${university.toUpperCase()} & ${currentCountry.name.toUpperCase()}
${university} stands out internationally for its pioneering faculty, state-of-the-art laboratory facilities, and interdisciplinary collaboration. Specifically, your department's active initiatives in ${major} perfectly mirror my scholarly objectives. Furthermore, studying in ${currentCountry.name} offers unparalleled access to a global ecosystem of innovators, adhering to the highest global benchmarks of academic freedom, institutional governance, and cross-cultural inquiry.

V. FUTURE TRAJECTORY & LONG-TERM VISION
${
  futureGoals.trim()
    ? futureGoals.trim()
    : `Following completion of this degree, my goal is to lead high-impact initiatives advancing intelligent computational systems that solve critical real-world challenges, ultimately contributing to both academic knowledge and practical community empowerment.`
}

In conclusion, I offer ${university} an unwavering work ethic, intellectual curiosity, and an eagerness to contribute meaningfully to ongoing seminar discussions and research consortia. I respectfully seek admission to your prestigious program.`;

      const newHistoryItem: SopHistoryItem = {
        id: `sop-${Date.now()}`,
        fullName: applicantName,
        fieldOfStudy: major,
        degreeLevel: programDegree,
        targetUniversity: university,
        templateId: currentTemplate.id,
        templateTitle: currentTemplate.title,
        countryId: currentCountry.id,
        countryName: currentCountry.name,
        countryFlag: currentCountry.flag,
        content: sopText,
        createdAt: new Date().toISOString(),
        wordCount: sopText.trim().split(/\s+/).length,
      };

      setHistory((prev) => {
        const next = [newHistoryItem, ...prev];
        try {
          localStorage.setItem("echogpt_sop_history_v1", JSON.stringify(next));
        } catch (e) {
          console.error("Failed to save SOP history to localStorage:", e);
        }
        return next;
      });

      setGeneratedSop(sopText);
      setIsGenerating(false);
      setCurrentStep("result");
      toast.success("Statement of Purpose generated successfully!");
    }, 1500);
  };

  const handleRetryHistory = () => {
    setHistoryLoading(true);
    setHistoryError(false);
    setTimeout(() => {
      try {
        const raw = localStorage.getItem("echogpt_sop_history_v1");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setHistory(parsed);
          }
        }
        setHistoryLoading(false);
        toast.success("SOP history reloaded");
      } catch {
        setHistoryError(true);
        setHistoryLoading(false);
        toast.error("Failed to load SOP history");
      }
    }, 600);
  };

  const handleViewHistoryItem = (item: SopHistoryItem) => {
    setFullName(item.fullName);
    setFieldOfStudy(item.fieldOfStudy);
    setDegreeLevel(item.degreeLevel);
    setTargetUniversity(item.targetUniversity);
    setSelectedTemplateId(item.templateId);
    setSelectedCountryId(item.countryId);
    setGeneratedSop(item.content);
    setCurrentStep("result");
    toast.info(`Viewing SOP for ${item.targetUniversity}`);
  };

  const handleCopyHistoryItem = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("SOP copied to clipboard!");
    } catch {
      toast.error("Failed to copy SOP");
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    const next = history.filter((item) => item.id !== id);
    setHistory(next);
    try {
      localStorage.setItem("echogpt_sop_history_v1", JSON.stringify(next));
      toast.success("SOP removed from history");
    } catch {
      toast.error("Failed to update history");
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("echogpt_sop_history_v1");
      toast.success("SOP history cleared");
    } catch {
      toast.error("Failed to clear history");
    }
  };

  const handleCopy = async () => {
    if (!generatedSop) return;
    try {
      await navigator.clipboard.writeText(generatedSop);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  interface SopPdfOptions {
    applicant: string;
    destination: string;
    targetProgram: string;
    trackTitle: string;
    targetUni: string;
    content: string;
    createdAt?: string | Date;
  }

  // Generates a clean, collision-free, beautifully formatted SOP PDF document
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildSopPdf = (JsPdfConstructor: any, options: SopPdfOptions) => {
    const doc = new JsPdfConstructor({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 54;
    const maxLineWidth = pageWidth - margin * 2;
    let y = margin;

    // Header Accent Bar
    doc.setFillColor(124, 58, 237); // purple-600
    doc.rect(margin, y, 4, 30, "F");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text("STATEMENT OF PURPOSE", margin + 12, y + 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    const dateStr = options.createdAt
      ? new Date(options.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
    doc.text(`Generated via EchoGPT AI SOP Builder • ${dateStr}`, margin + 12, y + 27);

    y += 46;

    // Info Box with collision-free, auto-wrapping layout
    const boxPaddingX = 14;
    const boxPaddingY = 12;
    const contentWidth = maxLineWidth - boxPaddingX * 2;
    const colGap = 16;
    const halfWidth = (contentWidth - colGap) / 2;

    doc.setFontSize(9);

    // Measure labels
    doc.setFont("helvetica", "bold");
    const applicantLabel = "Applicant:";
    const applicantLabelW = doc.getTextWidth(applicantLabel) + 6;
    const trackLabel = "Track:";
    const trackLabelW = doc.getTextWidth(trackLabel) + 6;
    const programLabel = "Target Program:";
    const programLabelW = doc.getTextWidth(programLabel) + 6;
    const uniLabel = "Institution:";
    const uniLabelW = doc.getTextWidth(uniLabel) + 6;
    const destLabel = "Destination:";
    const destLabelW = doc.getTextWidth(destLabel) + 6;

    // Split and wrap values safely within bounded widths
    doc.setFont("helvetica", "normal");
    const applicantLines = doc.splitTextToSize(options.applicant || "Applicant", halfWidth - applicantLabelW);
    const trackLines = doc.splitTextToSize(options.trackTitle || "Standard Track", halfWidth - trackLabelW);
    const programLines = doc.splitTextToSize(options.targetProgram || "Graduate Program", contentWidth - programLabelW);
    const uniLines = doc.splitTextToSize(options.targetUni || "Target University", contentWidth - uniLabelW);
    const destLines = doc.splitTextToSize(options.destination || "Target Destination", contentWidth - destLabelW);

    const lineH = 14;
    const rowSpacing = 5;

    const row1H = Math.max(applicantLines.length, trackLines.length) * lineH;
    const row2H = programLines.length * lineH;
    const row3H = uniLines.length * lineH;
    const row4H = destLines.length * lineH;

    const boxHeight = boxPaddingY * 2 + row1H + rowSpacing + row2H + rowSpacing + row3H + rowSpacing + row4H;

    // Info Box background and border
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, maxLineWidth, boxHeight, 6, 6, "FD");

    let currentBoxY = y + boxPaddingY + 9;

    // Row 1: Applicant (Col 1) & Track (Col 2)
    const col1X = margin + boxPaddingX;
    const col2X = col1X + halfWidth + colGap;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(applicantLabel, col1X, currentBoxY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    for (let i = 0; i < applicantLines.length; i++) {
      doc.text(applicantLines[i], col1X + applicantLabelW, currentBoxY + i * lineH);
    }

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(trackLabel, col2X, currentBoxY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    for (let i = 0; i < trackLines.length; i++) {
      doc.text(trackLines[i], col2X + trackLabelW, currentBoxY + i * lineH);
    }

    currentBoxY += row1H + rowSpacing;

    // Row 2: Target Program (Full width to completely prevent cross-column collision)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(programLabel, col1X, currentBoxY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    for (let i = 0; i < programLines.length; i++) {
      doc.text(programLines[i], col1X + programLabelW, currentBoxY + i * lineH);
    }

    currentBoxY += row2H + rowSpacing;

    // Row 3: Institution (Full width)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(uniLabel, col1X, currentBoxY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    for (let i = 0; i < uniLines.length; i++) {
      doc.text(uniLines[i], col1X + uniLabelW, currentBoxY + i * lineH);
    }

    currentBoxY += row3H + rowSpacing;

    // Row 4: Destination (Full width)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(destLabel, col1X, currentBoxY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    for (let i = 0; i < destLines.length; i++) {
      doc.text(destLines[i], col1X + destLabelW, currentBoxY + i * lineH);
    }

    y += boxHeight + 20;

    // Content parsing: remove any metadata header before '---'
    const rawLines = options.content.split("\n");
    let bodyStartIndex = 0;
    const separatorIdx = rawLines.findIndex((l) => l.trim() === "---");
    if (separatorIdx !== -1) {
      bodyStartIndex = separatorIdx + 1;
    }

    const bodyContent = rawLines.slice(bodyStartIndex).join("\n");
    const paragraphs = bodyContent.split(/\n\s*\n/);
    const bodyLineHeight = 15;

    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) continue;

      const isHeading =
        /^(?:#{1,3}\s*)?(?:[I|V|X]+\.\s+[A-Z\s&]+|[A-Z\s&]{4,}:?)$/.test(trimmed) &&
        trimmed.length < 90;

      if (isHeading) {
        const headingClean = trimmed.replace(/^#{1,3}\s*/, "");
        if (y + 40 > pageHeight - margin) {
          doc.addPage();
          y = margin + 12;
        } else {
          y += 10;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(124, 58, 237);
        doc.text(headingClean, margin, y);
        y += 18;
      } else {
        doc.setFont("times", "normal");
        doc.setFontSize(10.5);
        doc.setTextColor(30, 41, 59);

        const wrappedLines = doc.splitTextToSize(trimmed, maxLineWidth);

        for (const line of wrappedLines) {
          if (y + bodyLineHeight > pageHeight - margin) {
            doc.addPage();
            y = margin + 12;
          }
          doc.text(line, margin, y);
          y += bodyLineHeight;
        }
        y += 8;
      }
    }

    // Footer: Page Numbering
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 24,
        { align: "center" }
      );
    }

    return doc;
  };

  const handleDownloadPdf = async () => {
    if (!generatedSop) {
      toast.error("No Statement of Purpose content to download.");
      return;
    }

    try {
      const { jsPDF } = await import("jspdf");

      const targetCountryName = currentCountry?.name || "Target Country";
      const targetVisa = currentCountry?.visaType ? ` (${currentCountry.visaType})` : "";
      const applicant = fullName.trim() || "Applicant";

      const doc = buildSopPdf(jsPDF, {
        applicant,
        destination: `${targetCountryName}${targetVisa}`,
        targetProgram: `${degreeLevel || "Graduate Degree"} in ${fieldOfStudy || "Field of Study"}`,
        trackTitle: currentTemplate?.title || "Standard Track",
        targetUni: targetUniversity || "Target University",
        content: generatedSop,
      });

      const fileName = `SOP_${applicant.replace(/\s+/g, "_") || "Statement_of_Purpose"}.pdf`;

      // Convert to blob and trigger browser download
      const blob = doc.output("blob");
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(blobUrl);
      }, 1000);

      toast.success("Statement of Purpose PDF downloaded!");
    } catch (err) {
      console.error("PDF generation error, attempting printable fallback:", err);

      // Robust fallback: open clean printable window
      try {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Statement of Purpose - PDF Export</title>
                <style>
                  @page { size: A4; margin: 20mm; }
                  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif; color: #1e293b; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
                  h1 { color: #7c3aed; font-size: 24px; border-bottom: 3px solid #7c3aed; padding-bottom: 8px; margin-bottom: 20px; }
                  .meta { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px; font-size: 14px; }
                  .meta p { margin: 4px 0; }
                  .content { white-space: pre-wrap; font-size: 14px; line-height: 1.8; }
                </style>
              </head>
              <body>
                <h1>STATEMENT OF PURPOSE</h1>
                <div class="meta">
                  <p><strong>Applicant:</strong> ${fullName || "Applicant"}</p>
                  <p><strong>Proposed Program:</strong> ${degreeLevel || ""} in ${fieldOfStudy || ""}</p>
                  <p><strong>Institution:</strong> ${targetUniversity || ""}</p>
                </div>
                <div class="content">${generatedSop}</div>
                <script>
                  window.onload = function() { window.print(); }
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
          toast.info("Opened printable PDF dialog");
          return;
        }
      } catch (fallbackErr) {
        console.error("Fallback failed:", fallbackErr);
      }

      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const handlePrintPdf = () => {
    if (!generatedSop) {
      toast.error("No Statement of Purpose content to print.");
      return;
    }
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Statement of Purpose - ${fullName || "Applicant"}</title>
            <style>
              @page { size: A4; margin: 20mm; }
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif; color: #1e293b; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
              h1 { color: #7c3aed; font-size: 22px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px; margin-bottom: 16px; }
              .meta { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 20px; font-size: 13px; }
              .meta p { margin: 3px 0; }
              .content { white-space: pre-wrap; font-size: 13.5px; line-height: 1.75; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            <h1>STATEMENT OF PURPOSE</h1>
            <div class="meta">
              <p><strong>Applicant:</strong> ${fullName || "Applicant"}</p>
              <p><strong>Proposed Program:</strong> ${degreeLevel || ""} in ${fieldOfStudy || ""}</p>
              <p><strong>Institution:</strong> ${targetUniversity || ""}</p>
              <p><strong>Destination:</strong> ${currentCountry?.name || ""} (${currentCountry?.visaType || ""})</p>
            </div>
            <div class="content">${generatedSop}</div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownloadHistoryItemPdf = async (item: SopHistoryItem) => {
    try {
      const { jsPDF } = await import("jspdf");

      const applicant = item.fullName.trim() || "Applicant";
      const doc = buildSopPdf(jsPDF, {
        applicant,
        destination: item.countryName || "Target Destination",
        targetProgram: `${item.degreeLevel || "Graduate Degree"} in ${item.fieldOfStudy || "Field"}`,
        trackTitle: item.templateTitle || "Standard Track",
        targetUni: item.targetUniversity || "Target University",
        content: item.content,
        createdAt: item.createdAt,
      });

      const fileName = `SOP_${applicant.replace(/\s+/g, "_") || "Statement_of_Purpose"}.pdf`;
      const blob = doc.output("blob");
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        if (document.body.contains(link)) document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 1000);

      toast.success("Statement of Purpose PDF downloaded!");
    } catch (e) {
      console.error("PDF generation error:", e);
      toast.error("Failed to generate PDF");
    }
  };

  const handleStartChatWithSop = () => {
    if (!generatedSop) return;
    const prompt = `Here is my Statement of Purpose for ${targetUniversity} (${fieldOfStudy}):\n\n${generatedSop}\n\nPlease review this SOP and provide sentence-by-sentence editorial refinements, stronger active verbs, and ways to elevate my impact statements.`;
    localStorage.setItem("echogpt_prefill_prompt", prompt);
    const newThreadId = "thread_" + Date.now();
    router.push(`/chat/${newThreadId}`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden h-full w-[260px] shrink-0 border-r border-border/60 bg-card lg:block">
        <SidebarNav threads={threads} user={user} />
      </div>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        {/* Mobile Header Bar */}
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
              AI SOP Builder
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

        {/* Content Container */}
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* ================= STEP 1: TEMPLATE SELECTION (Matching Screenshots 1 & 2) ================= */}
          {currentStep === "template" && (
            <div className="space-y-12">
              {/* Header Matching Screenshot 1 */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 shadow-xs dark:bg-purple-950/60 dark:text-purple-400">
                  <GraduationCap className="size-7" />
                </div>
                <h1 className="font-heading text-3xl font-bold tracking-tight text-purple-600 dark:text-purple-400 sm:text-4xl">
                  AI–Powered SOP Builder
                </h1>
                <p className="mx-auto mt-2.5 max-w-2xl text-sm sm:text-base text-muted-foreground/80 leading-relaxed">
                  Create compelling Statements of Purpose with AI assistance, tailored for your dream university and destination country.
                </p>
              </div>

              {/* 3 Highlight Feature Cards Matching Screenshot 1 */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {/* 1. AI-Enhanced */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-card p-6 text-center shadow-2xs">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-purple-100/80 text-purple-600 shadow-xs dark:bg-purple-950/60 dark:text-purple-400">
                    <Sparkles className="size-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                    AI–Enhanced
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Powered by Google Gemini
                  </p>
                </div>

                {/* 2. 6 Countries */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-card p-6 text-center shadow-2xs">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-purple-100/80 text-purple-600 shadow-xs dark:bg-purple-950/60 dark:text-purple-400">
                    <Globe className="size-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                    6 Countries
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Country-specific guidelines
                  </p>
                </div>

                {/* 3. 4 Templates */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-card p-6 text-center shadow-2xs">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-purple-100/80 text-purple-600 shadow-xs dark:bg-purple-950/60 dark:text-purple-400">
                    <Users className="size-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                    4 Templates
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Academic, Professional, Research, Creative
                  </p>
                </div>
              </div>

              {/* Template Selection Section Matching Screenshot 2 */}
              <div className="space-y-6 pt-4">
                <div className="text-center">
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400 sm:text-3xl">
                    Choose Your SOP Template
                  </h2>
                  <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground/80 leading-relaxed">
                    Select the template that best matches your background and the focus of your application. Each template is optimized for different types of applicants and academic goals.
                  </p>
                </div>

                {/* 4 Template Cards (2x2 Grid Matching Screenshot 2) */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {SOP_TEMPLATES.map((tpl) => {
                    const IconComp = tpl.icon;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => {
                          setSelectedTemplateId(tpl.id);
                          setCurrentStep("country");
                        }}
                        className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-3.5">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-purple-100/80 text-purple-600 shadow-xs transition-transform duration-200 group-hover:scale-105 dark:bg-purple-950/60 dark:text-purple-400">
                              <IconComp className="size-5" />
                            </div>
                            <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                              {tpl.title}
                            </h3>
                          </div>

                          <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {tpl.description}
                          </p>
                        </div>

                        {/* Category Tags Pills Matching Screenshot 2 */}
                        <div className="mt-5 flex flex-wrap gap-2 pt-2 border-t border-border/40">
                          {tpl.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-medium text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ================= GENERATED SOP HISTORY SECTION ================= */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                      <History className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                        Generated SOP History
                      </h2>
                    </div>
                    {history.length > 0 && (
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                        {history.length}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {historyError ? (
                      <button
                        type="button"
                        onClick={handleRetryHistory}
                        className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                      >
                        <RefreshCw className="size-3.5" />
                        <span>Retry</span>
                      </button>
                    ) : history.length > 0 ? (
                      <button
                        type="button"
                        onClick={handleClearHistory}
                        className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Clear All</span>
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* History Card Container Matching Screenshot */}
                <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-2xs sm:p-8">
                  {historyLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="size-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent dark:border-purple-400" />
                      <p className="mt-3 text-sm text-muted-foreground">Loading SOP history...</p>
                    </div>
                  ) : historyError ? (
                    /* Exact match to user screenshot media_1790660160352.png */
                    <div className="flex flex-col items-center justify-center py-8 text-center sm:py-12">
                      <CircleAlert className="size-12 text-red-500 stroke-[1.75]" />
                      <p className="mt-4 text-base font-semibold text-red-600 dark:text-red-400 sm:text-lg">
                        Failed to load SOP history
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                        Please try again later or contact support.
                      </p>
                      <button
                        type="button"
                        onClick={handleRetryHistory}
                        className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-2xs hover:bg-accent"
                      >
                        <RefreshCw className="size-3.5" />
                        <span>Try Again</span>
                      </button>
                    </div>
                  ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-100/80 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                        <FileText className="size-6" />
                      </div>
                      <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                        No Generated SOPs Yet
                      </h3>
                      <p className="mx-auto mt-1.5 max-w-md text-xs text-muted-foreground sm:text-sm">
                        Select a template above to generate your tailored Statement of Purpose.
                        Your generated documents will appear here.
                      </p>
                    </div>
                  ) : (
                    /* Populated History Cards Grid */
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-5 transition-all hover:border-purple-300 hover:shadow-xs dark:hover:border-purple-800"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="font-heading text-sm font-bold text-foreground">
                                  {item.targetUniversity || "Target University"}
                                </h4>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {item.degreeLevel} {item.fieldOfStudy ? `• ${item.fieldOfStudy}` : ""}
                                </p>
                              </div>
                              <span className="shrink-0 rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-medium text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                                {item.templateTitle}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                                <span>{item.countryFlag}</span>
                                <span>{item.countryName}</span>
                              </span>
                              <span>•</span>
                              <span>{item.wordCount} words</span>
                              <span>•</span>
                              <span>
                                {new Date(item.createdAt).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                            <button
                              type="button"
                              onClick={() => handleViewHistoryItem(item)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                            >
                              <Eye className="size-3.5" />
                              <span>View SOP</span>
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleDownloadHistoryItemPdf(item)}
                                className="rounded-lg border border-border/80 bg-background p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                                title="Download PDF"
                              >
                                <Download className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyHistoryItem(item.content)}
                                className="rounded-lg border border-border/80 bg-background p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                                title="Copy SOP text"
                              >
                                <Copy className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteHistoryItem(item.id)}
                                className="rounded-lg border border-border/80 bg-background p-1.5 text-muted-foreground hover:border-destructive/40 hover:bg-accent hover:text-destructive"
                                title="Delete from history"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: DESTINATION COUNTRY SELECTION (Matching Screenshot 4) ================= */}
          {currentStep === "country" && (
            <div className="space-y-8">
              {/* Top Navigation Header Matching Screenshot 4 */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("template")}
                  className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-2xs hover:bg-accent"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back</span>
                </button>
                <div>
                  <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Select Destination Country
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Choose where you plan to study to get country-specific requirements and guidance.
                  </p>
                </div>
              </div>

              {/* 6 Country Cards Grid Matching Screenshot 4 */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {DESTINATION_COUNTRIES.map((country) => {
                  return (
                    <div
                      key={country.id}
                      onClick={() => {
                        setSelectedCountryId(country.id);
                        setCurrentStep("form");
                      }}
                      className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md cursor-pointer"
                    >
                      <div>
                        {/* Country Flag & Title */}
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <div>
                            <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors">
                              {country.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {country.visaType}
                            </p>
                          </div>
                        </div>

                        {/* Key Specs: Word Count & Processing Time */}
                        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <FileText className="size-3.5 text-primary" />
                            <span>{country.wordCount}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="size-3.5 text-primary" />
                            <span>Processing: {country.processingTime}</span>
                          </div>
                        </div>

                        {/* Key Requirements Checklist Pills */}
                        <div className="mt-5 space-y-1.5">
                          <p className="text-[11px] font-semibold text-foreground/80">
                            Key Requirements:
                          </p>
                          <div className="space-y-1">
                            {country.keyRequirements.map((req, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5 rounded-full bg-purple-50/80 px-2.5 py-1 text-[11px] text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 truncate"
                              >
                                <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                                <span className="truncate">{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Select Action Button */}
                      <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between">
                        <span className="text-xs font-semibold text-primary group-hover:underline">
                          Select {country.name}
                        </span>
                        <ChevronRight className="size-4 text-primary" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 3: BUILD YOUR SOP FORM (Matching Screenshots 5 & 3) ================= */}
          {currentStep === "form" && (
            <div className="space-y-8">
              {/* Top Navigation Header Matching Screenshot 5 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("country")}
                    className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-2xs hover:bg-accent"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Back</span>
                  </button>
                  <div>
                    <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      Build Your SOP
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      Fill in your details to create a personalized Statement of Purpose.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <span>Load Sample Data</span>
                </button>
              </div>

              {/* 2 Top Summary Selection Cards Matching Screenshot 5 */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* 1. Selected Template */}
                <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                        <FileText className="size-4" />
                        <span>Selected Template</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep("template")}
                        className="text-[11px] font-semibold text-muted-foreground hover:text-primary hover:underline"
                      >
                        Change
                      </button>
                    </div>

                    <h3 className="mt-2.5 font-heading text-lg font-bold text-foreground">
                      {currentTemplate.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {currentTemplate.description}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {currentTemplate.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Destination Country */}
                <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                        <Globe className="size-4" />
                        <span>Destination Country</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep("country")}
                        className="text-[11px] font-semibold text-muted-foreground hover:text-primary hover:underline"
                      >
                        Change
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-xl">{currentCountry.flag}</span>
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        {currentCountry.name}
                      </h3>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="size-3.5 text-primary" />
                        <span>{currentCountry.wordCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-3.5 text-primary" />
                        <span>{currentCountry.processingTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-[11px] text-muted-foreground">
                    Visa: <span className="font-medium text-foreground">{currentCountry.visaType}</span>
                  </div>
                </div>
              </div>

              {/* Form Card 1: Personal Information Matching Screenshot 5 */}
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-2xs space-y-5">
                <h3 className="font-heading text-base font-bold text-foreground">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/90">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="h-11 w-full rounded-xl border border-border/80 bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Field of Study */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/90">
                      Field of Study *
                    </label>
                    <input
                      type="text"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      placeholder="e.g., Computer Science, Biology"
                      className="h-11 w-full rounded-xl border border-border/80 bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Degree Level */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/90">
                      Degree Level *
                    </label>
                    <input
                      type="text"
                      value={degreeLevel}
                      onChange={(e) => setDegreeLevel(e.target.value)}
                      placeholder="e.g., Master's, PhD"
                      className="h-11 w-full rounded-xl border border-border/80 bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Target University */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/90">
                      Target University *
                    </label>
                    <input
                      type="text"
                      value={targetUniversity}
                      onChange={(e) => setTargetUniversity(e.target.value)}
                      placeholder="Enter university name"
                      className="h-11 w-full rounded-xl border border-border/80 bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Form Card 2: SOP Content Matching Screenshot 3 */}
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-2xs space-y-6">
                <h3 className="font-heading text-base font-bold text-foreground">
                  SOP Content
                </h3>

                {/* Lavender Callout Alert Matching Screenshot 3 */}
                <div className="flex items-start gap-3 rounded-2xl bg-purple-50/90 p-4 text-xs text-purple-900 dark:bg-purple-950/40 dark:text-purple-200">
                  <Info className="size-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Answer these questions thoughtfully. The AI will use your responses to create a compelling, personalized Statement of Purpose that follows the{" "}
                    <span className="font-semibold underline">
                      {currentTemplate.title.toLowerCase()}
                    </span>{" "}
                    template.
                  </p>
                </div>

                {/* Academic Background */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/90">
                    Academic Background *
                  </label>
                  <p className="text-[11px] text-muted-foreground">
                    Summarize your academic background and its relevance to your career.
                  </p>
                  <textarea
                    rows={4}
                    value={academicBackground}
                    onChange={(e) => setAcademicBackground(e.target.value)}
                    placeholder="Describe your academic journey, achievements, and relevant coursework..."
                    className="w-full rounded-xl border border-border/80 bg-background p-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Relevant Experience */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/90">
                    Relevant Experience *
                  </label>
                  <p className="text-[11px] text-muted-foreground">
                    Detail your professional experiences, leadership roles, and achievements.
                  </p>
                  <textarea
                    rows={4}
                    value={relevantExperience}
                    onChange={(e) => setRelevantExperience(e.target.value)}
                    placeholder="Detail your professional, research, or project experience..."
                    className="w-full rounded-xl border border-border/80 bg-background p-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Future Goals & Why University */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/90">
                    Future Goals & Research Alignment
                  </label>
                  <p className="text-[11px] text-muted-foreground">
                    Explain your long-term career aspirations and why this specific program is the right fit.
                  </p>
                  <textarea
                    rows={3}
                    value={futureGoals}
                    onChange={(e) => setFutureGoals(e.target.value)}
                    placeholder="What specific laboratories, faculty mentors, or career trajectories are you targeting?"
                    className="w-full rounded-xl border border-border/80 bg-background p-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Generate Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground">
                    Estimated length: ~{currentCountry.wordCount}
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Crafting Your SOP...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        <span>Generate Statement of Purpose</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: OUTPUT PREVIEW & EXPORT ================= */}
          {currentStep === "result" && generatedSop && (
            <div className="space-y-6">
              {/* Result Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
                <div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep("form")}
                    className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Back to Edit Details</span>
                  </button>
                  <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Your Tailored Statement of Purpose
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Structured for {targetUniversity || "Target University"} ({currentCountry.name} • {currentTemplate.title})
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-semibold text-foreground shadow-2xs hover:bg-accent"
                  >
                    {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    <span>{copied ? "Copied" : "Copy Text"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="flex items-center gap-1.5 rounded-xl border border-purple-200/80 bg-purple-50/60 px-3.5 py-2 text-xs font-semibold text-purple-700 shadow-2xs hover:bg-purple-100/70 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300"
                    title="Download formatted PDF file"
                  >
                    <Download className="size-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintPdf}
                    className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-2xs hover:bg-accent"
                    title="Print or Save as PDF via system dialog"
                  >
                    <Printer className="size-3.5" />
                    <span>Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStartChatWithSop}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700"
                  >
                    <MessageSquare className="size-3.5" />
                    <span>Refine with AI Chat</span>
                  </button>
                </div>
              </div>

              {/* SOP Document Viewer */}
              <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/50 pb-4 text-xs text-muted-foreground">
                  <span className="font-mono">
                    {generatedSop.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-medium text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                    {currentCountry.visaType} Aligned
                  </span>
                </div>

                <div className="mt-6 whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90 selection:bg-purple-200 dark:selection:bg-purple-900">
                  {generatedSop}
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("template")}
                  className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Start New SOP</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartChatWithSop}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Open in EchoGPT Conversation</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
