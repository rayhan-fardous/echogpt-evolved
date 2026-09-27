"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Menu,
  X,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  LayoutGrid,
  Maximize2,
  Trophy,
  ArrowRight,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav, type ThreadSummary } from "./sidebar-nav";
import { supabase } from "@/integrations/supabase/client";
import { getAllThreadMetadata } from "@/lib/thread-storage";
import { ALL_MODELS, type AIModel } from "@/lib/models-data";
import { ModelIcon } from "./model-icon";
import { toast } from "sonner";

/* ---------------- Types ---------------- */

export type CompareMode = "compare" | "focus";

export interface ModelComparisonResponse {
  modelId: string;
  model: AIModel;
  text: string;
  tokensPerSec: number;
  durationSeconds: number;
  rating?: "up" | "down";
  isBest?: boolean;
}

export interface ComparisonSession {
  id: string;
  query: string;
  timestamp: string;
  responses: ModelComparisonResponse[];
}

// Starter comparison queries
const STARTER_COMPARISON_QUERIES = [
  "Explain quantum computing in simple terms for a 12-year-old.",
  "Write a polite email negotiating a freelance contract rate increase.",
  "Compare Rust and Go for building high-concurrency microservices.",
  "Give me 5 unique startup ideas in climate tech with moat analysis.",
];

/* ---------------- Main CompareWorkspace Component ---------------- */

export function CompareWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Compare mode: "compare" (side-by-side) or "focus" (single model tabbed)
  const [mode, setMode] = useState<CompareMode>("compare");

  // Selected models (default 3 matching screenshot: EchoGPT, DeepSeek V4 Pro, Nemotron 3 Ultra)
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    "echogpt",
    "deepseek-v4-pro",
    "nemotron-3-ultra",
  ]);

  // Model selection modal state
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [modalPendingIds, setModalPendingIds] = useState<string[]>([]);

  // Focus mode active model ID (defaults to first selected model)
  const [focusModelId, setFocusModelId] = useState<string>("echogpt");

  // Query & Submissions
  const [prompt, setPrompt] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const [currentSession, setCurrentSession] = useState<ComparisonSession | null>(null);

  // Auth synchronization
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

  // Local metadata & Supabase threads
  useEffect(() => {
    const all = getAllThreadMetadata();
    const summaries = Object.values(all).map((t) => ({
      id: t.id,
      title: t.title,
      updated_at: t.updated_at,
    }));
    setThreads(summaries);
  }, [user]);

  // Selected model objects
  const selectedModels = useMemo(() => {
    return selectedModelIds
      .map((id) => ALL_MODELS.find((m) => m.id === id))
      .filter((m): m is AIModel => Boolean(m));
  }, [selectedModelIds]);

  // Keep focusModelId valid
  useEffect(() => {
    if (!selectedModelIds.includes(focusModelId)) {
      setFocusModelId(selectedModelIds[0] || "echogpt");
    }
  }, [selectedModelIds, focusModelId]);

  // Open modal handler
  const handleOpenModal = () => {
    setModalPendingIds([...selectedModelIds]);
    setModelModalOpen(true);
  };

  // Toggle model in modal
  const handleToggleModalModel = (id: string) => {
    if (modalPendingIds.includes(id)) {
      if (modalPendingIds.length <= 2) {
        toast.error("Please keep at least 2 models for comparison");
        return;
      }
      setModalPendingIds(modalPendingIds.filter((item) => item !== id));
    } else {
      if (modalPendingIds.length >= 5) {
        toast.error("Maximum 5 models can be compared at once");
        return;
      }
      setModalPendingIds([...modalPendingIds, id]);
    }
  };

  // Apply modal selection
  const handleApplyModels = () => {
    setSelectedModelIds(modalPendingIds);
    setModelModalOpen(false);
    toast.success(`Selected ${modalPendingIds.length} models for comparison`);
  };

  // Generate comparison answers
  const handleRunComparison = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      toast.error("Please enter a question or prompt to compare");
      return;
    }

    setIsComparing(true);

    try {
      // Realistic simulation with distinctive perspectives
      const sessionResponses: ModelComparisonResponse[] = selectedModels.map((m) => ({
        modelId: m.id,
        model: m,
        text: "",
        tokensPerSec: Math.floor(Math.random() * 40) + 65,
        durationSeconds: +(Math.random() * 1.2 + 0.8).toFixed(2),
      }));

      setCurrentSession({
        id: crypto.randomUUID(),
        query: trimmed,
        timestamp: new Date().toISOString(),
        responses: sessionResponses,
      });

      // Stream / synthesize progression
      await new Promise((r) => setTimeout(r, 600));

      const generatedResponses: ModelComparisonResponse[] = selectedModels.map((m) => {
        let answer = "";
        if (m.id === "echogpt") {
          answer = `**Executive Summary & Core Takeaway:**\n\nWhen evaluating "${trimmed}", the foundational concept revolves around balancing clarity, strategic execution, and verifiable output.\n\n1. **Core Principle:** Focus on measurable impacts rather than speculative abstraction.\n2. **Actionable Roadmap:** Break the problem down into isolated modular milestones.\n3. **Recommendation:** Iterate quickly with automated feedback loops to validate edge conditions.\n\n*EchoGPT's synthesis emphasizes rapid clarity and direct execution.*`;
        } else if (m.id === "deepseek-v4-pro") {
          answer = `**Deep Architectural Breakdown:**\n\nAnalyzing "${trimmed}" from first principles and mathematical underpinnings:\n\n- **Theoretical Framework:** Under optimal conditions, efficiency correlates directly with structural cohesion and parameter entropy.\n- **Trade-offs:** High precision requires stricter calibration, whereas generalization requires flexible heuristic weighting.\n- **Algorithmic Path:** Implement a multi-stage pipeline with strict validation checks at each boundary.\n\nDeepSeek V4 Pro recommends an empirical, metric-driven benchmarking methodology.`;
        } else if (m.id === "nemotron-3-ultra") {
          answer = `**NVIDIA High-Performance Synthesis:**\n\nRegarding "${trimmed}", high-throughput performance demands optimization across both system compute and algorithmic pathways:\n\n• **Hardware & Compute Alignment:** Maximize parallel instruction utilization and vectorized cache locality.\n• **Scalability Metrics:** Measure latency percentiles (P95, P99) under concurrent load rather than average throughput.\n• **Conclusion:** Robust engineering and deterministic fault tolerance are paramount for enterprise reliability.`;
        } else {
          answer = `**Analytical Perspective (${m.name}):**\n\nAddressing "${trimmed}" with an emphasis on balanced reasoning and comprehensive nuance.\n\n- Key Observation: Multiple perspectives converge on minimizing friction while preserving accuracy.\n- Strategic Implementation: Deploy phased integration with granular continuous verification.\n- Key Verdict: Effective implementation hinges on clear constraints and disciplined execution.`;
        }

        return {
          modelId: m.id,
          model: m,
          text: answer,
          tokensPerSec: Math.floor(Math.random() * 45) + 70,
          durationSeconds: +(Math.random() * 1.1 + 0.9).toFixed(2),
        };
      });

      setCurrentSession((prev) =>
        prev
          ? {
              ...prev,
              responses: generatedResponses,
            }
          : null
      );
      toast.success(`Completed answers across ${selectedModels.length} models`);
    } catch {
      toast.error("Failed to generate comparison. Please try again.");
    } finally {
      setIsComparing(false);
    }
  };

  const handleCopyText = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success("Response copied to clipboard");
  };

  const handleRateResponse = (modelId: string, rating: "up" | "down") => {
    if (!currentSession) return;
    setCurrentSession({
      ...currentSession,
      responses: currentSession.responses.map((r) =>
        r.modelId === modelId ? { ...r, rating: r.rating === rating ? undefined : rating } : r
      ),
    });
    toast.success(rating === "up" ? "Marked response as helpful" : "Feedback submitted");
  };

  const handleToggleBest = (modelId: string) => {
    if (!currentSession) return;
    setCurrentSession({
      ...currentSession,
      responses: currentSession.responses.map((r) => ({
        ...r,
        isBest: r.modelId === modelId ? !r.isBest : false,
      })),
    });
    toast.success("Best response updated");
  };

  return (
    <div className="soft-grid flex h-dvh min-w-0 bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside className="hidden w-[296px] shrink-0 lg:block">
        <SidebarNav threads={threads} user={user} />
      </aside>

      {/* Main Compare Area */}
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile Navigation Drawer Toggle */}
        <div className="absolute top-3.5 left-3.5 z-30 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                aria-label="Open navigation"
                variant="outline"
                size="icon"
                className="size-9 rounded-xl bg-background/85 backdrop-blur-md border-border/80 shadow-xs hover:bg-accent cursor-pointer"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[85vw] max-w-[320px] sm:max-w-xs p-0 border-r border-border [&>button:last-child]:hidden"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>EchoGPT navigation and model comparison</SheetDescription>
              </SheetHeader>
              <SidebarNav
                threads={threads}
                user={user}
                onSelect={() => setMobileOpen(false)}
                onClose={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl">
            {/* Top Switcher Pill: [Compare | Focus] (Screenshots 1 & 2) */}
            <div className="flex flex-col items-center justify-center pt-2 sm:pt-4">
              <div className="inline-flex items-center rounded-full border border-border/80 p-1 bg-black/[0.02] dark:bg-white/[0.03] shadow-xs">
                {/* Compare Tab */}
                <button
                  type="button"
                  onClick={() => setMode("compare")}
                  className={`flex items-center gap-1.5 rounded-full px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    mode === "compare"
                      ? "bg-[#7C3AED] text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
                  }`}
                >
                  <LayoutGrid className="size-4" />
                  <span>Compare</span>
                </button>

                {/* Focus Tab */}
                <button
                  type="button"
                  onClick={() => setMode("focus")}
                  className={`flex items-center gap-1.5 rounded-full px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    mode === "focus"
                      ? "bg-[#7C3AED] text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
                  }`}
                >
                  <Maximize2 className="size-3.5" />
                  <span>Focus</span>
                </button>
              </div>

              {/* Sub-pills when in Focus Mode (Screenshot 2: EchoGPT, DeepSeek V4 Pro, Nemotron 3 Ultra) */}
              {mode === "focus" && (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  {selectedModels.map((m) => {
                    const isFocus = focusModelId === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setFocusModelId(m.id)}
                        className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                          isFocus
                            ? "border-2 border-[#7C3AED] text-[#7C3AED] bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20 font-semibold shadow-xs"
                            : "border border-border/80 text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
                        }`}
                      >
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Subtitle (Screenshots 1 & 2) */}
              <p className="mt-6 text-center text-sm sm:text-base text-muted-foreground/85 font-normal">
                Ask one question and see how {selectedModels.length} models answer it.
              </p>
            </div>

            {/* Prompt Generator Card (Screenshots 1 & 2) */}
            <div className="relative mt-8 rounded-3xl border border-border/80 bg-background/95 dark:bg-[#151226]/90 p-4 sm:p-6 shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
              {/* Textarea */}
              <div className="relative min-h-[90px] sm:min-h-[100px]">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      handleRunComparison();
                    }
                  }}
                  placeholder={`Message ${selectedModels.length} models...`}
                  rows={3}
                  className="w-full resize-none bg-transparent pr-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Bottom Toolbar */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-2">
                {/* Overlapping model avatars pill (Screenshots 1 & 2) */}
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="flex items-center gap-2 rounded-full border border-border/70 bg-black/[0.02] px-3.5 py-1.5 transition-all hover:border-primary/50 hover:bg-accent dark:bg-white/[0.03] cursor-pointer"
                  title="Choose models to compare"
                >
                  <div className="flex -space-x-1.5 items-center">
                    {selectedModels.slice(0, 3).map((m) => (
                      <div
                        key={m.id}
                        className="ring-2 ring-background rounded-full overflow-hidden bg-background"
                      >
                        <ModelIcon provider={m.provider} className="size-5" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    {selectedModels[0]?.name}
                    {selectedModels.length > 1 && ` +${selectedModels.length - 1} more`}
                  </span>
                </button>

                {/* Compare Button (Screenshots 1 & 2) */}
                <Button
                  onClick={handleRunComparison}
                  disabled={isComparing || !prompt.trim()}
                  className="h-9.5 rounded-xl sm:rounded-2xl bg-[#7C3AED] px-6 text-sm font-semibold text-white shadow-md shadow-[#7C3AED]/20 hover:bg-[#6D28D9] hover:shadow-[#7C3AED]/30 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isComparing ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="size-4 animate-spin" />
                      <span>Comparing...</span>
                    </div>
                  ) : (
                    <span>Compare</span>
                  )}
                </Button>
              </div>
            </div>

            {/* Sub-card Explanatory Caption (Screenshots 1 & 2) */}
            <p className="mt-3 text-xs text-muted-foreground/75">
              Every selected model answers the same prompt.
            </p>

            {/* Inspiration Prompt Chips (if no session active) */}
            {!currentSession && (
              <div className="mt-12 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mb-3">
                  Suggested Prompts
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
                  {STARTER_COMPARISON_QUERIES.map((starter) => (
                    <button
                      key={starter}
                      type="button"
                      onClick={() => setPrompt(starter)}
                      className="rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:bg-accent hover:text-foreground cursor-pointer"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------- Comparison Results ---------------- */}
            {currentSession && (
              <div className="mt-10 sm:mt-12 space-y-4">
                {/* Query Header */}
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      Comparison Query
                    </span>
                    <p className="mt-1 font-heading text-base sm:text-lg font-semibold text-foreground">
                      "{currentSession.query}"
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs shrink-0 cursor-pointer"
                    onClick={() => {
                      setPrompt(currentSession.query);
                      toast.success("Query reloaded into input");
                    }}
                  >
                    Edit & Rerun
                  </Button>
                </div>

                {/* Compare Mode: Multi-Column Side-by-Side */}
                {mode === "compare" && (
                  <div
                    className={`grid gap-4 ${
                      selectedModels.length === 2
                        ? "grid-cols-1 md:grid-cols-2"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {currentSession.responses.map((resp) => (
                      <div
                        key={resp.modelId}
                        className={`flex flex-col rounded-2xl border bg-card p-4 sm:p-5 shadow-xs transition-all ${
                          resp.isBest
                            ? "border-primary ring-2 ring-primary/20 shadow-md"
                            : "border-border/80 hover:border-border"
                        }`}
                      >
                        {/* Model Card Header */}
                        <div className="flex items-center justify-between border-b border-border/50 pb-3">
                          <div className="flex items-center gap-2.5">
                            <ModelIcon provider={resp.model.provider} className="size-6 shrink-0" />
                            <div>
                              <h3 className="font-heading text-sm sm:text-[15px] font-semibold text-foreground leading-tight">
                                {resp.model.name}
                              </h3>
                              <span className="text-[11px] text-muted-foreground">
                                {resp.model.providerName}
                              </span>
                            </div>
                          </div>

                          {/* Best badge button */}
                          <button
                            type="button"
                            onClick={() => handleToggleBest(resp.modelId)}
                            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-all cursor-pointer ${
                              resp.isBest
                                ? "bg-primary text-white shadow-xs"
                                : "text-muted-foreground hover:bg-muted"
                            }`}
                            title="Mark as best response"
                          >
                            <Trophy className="size-3" />
                            <span>{resp.isBest ? "Best Answer" : "Pick Best"}</span>
                          </button>
                        </div>

                        {/* Response Body */}
                        <div className="flex-1 py-4 text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed font-sans">
                          {resp.text || (
                            <div className="flex items-center gap-2 text-muted-foreground animate-pulse py-6">
                              <RefreshCw className="size-4 animate-spin" />
                              <span>Thinking and generating answer...</span>
                            </div>
                          )}
                        </div>

                        {/* Card Footer with Stats & Actions */}
                        <div className="mt-auto border-t border-border/50 pt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {resp.durationSeconds}s
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Zap className="size-3" />
                              {resp.tokensPerSec} t/s
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleRateResponse(resp.modelId, "up")}
                              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                                resp.rating === "up"
                                  ? "text-primary bg-primary/10"
                                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
                              }`}
                              title="Helpful"
                            >
                              <ThumbsUp className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRateResponse(resp.modelId, "down")}
                              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                                resp.rating === "down"
                                  ? "text-destructive bg-destructive/10"
                                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
                              }`}
                              title="Unhelpful"
                            >
                              <ThumbsDown className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleCopyText(resp.text, e)}
                              className="rounded-md p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              title="Copy text"
                            >
                              <Copy className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Focus Mode: Full Width Reader */}
                {mode === "focus" && (
                  (() => {
                    const focusResp = currentSession.responses.find(
                      (r) => r.modelId === focusModelId
                    ) || currentSession.responses[0];

                    if (!focusResp) return null;

                    return (
                      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-border/50 pb-4">
                          <div className="flex items-center gap-3">
                            <ModelIcon provider={focusResp.model.provider} className="size-8 shrink-0" />
                            <div>
                              <h3 className="font-heading text-lg font-bold text-foreground">
                                {focusResp.model.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {focusResp.model.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5 rounded-xl cursor-pointer"
                              onClick={(e) => handleCopyText(focusResp.text, e)}
                            >
                              <Copy className="size-3.5" />
                              <span>Copy Answer</span>
                            </Button>
                          </div>
                        </div>

                        <div className="py-6 text-sm sm:text-base text-foreground/95 whitespace-pre-wrap leading-relaxed">
                          {focusResp.text}
                        </div>

                        <div className="border-t border-border/50 pt-4 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Clock className="size-3.5" /> Generated in {focusResp.durationSeconds}s ({focusResp.tokensPerSec} tokens/sec)
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleBest(focusResp.modelId)}
                              className={`rounded-full px-3 py-1 font-medium transition-colors cursor-pointer ${
                                focusResp.isBest
                                  ? "bg-primary text-white"
                                  : "border border-border/80 hover:bg-muted"
                              }`}
                            >
                              {focusResp.isBest ? "★ Chosen Best Answer" : "Pick as Best"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ---------------- Choose Models Modal (Screenshot 3) ---------------- */}
      <Dialog open={modelModalOpen} onOpenChange={setModelModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-3xl border border-border/80 bg-background text-foreground shadow-2xl">
          {/* Header (Screenshot 3) */}
          <div className="p-6 pb-3 border-b border-border/40">
            <DialogTitle className="font-heading text-xl font-bold tracking-tight">
              Choose models
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              Every model answers the same prompt, side by side.
            </DialogDescription>
            <p className="mt-2 text-xs text-muted-foreground font-medium">
              {modalPendingIds.length}/5 models selected · each column costs one message
            </p>
          </div>

          {/* 2-Column Model Grid (Screenshot 3) */}
          <div className="flex-1 overflow-y-auto p-6 pt-3 scrollbar-thin scrollbar-thumb-border/40">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ALL_MODELS.map((model) => {
                const isSelected = modalPendingIds.includes(model.id);
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => handleToggleModalModel(model.id)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-2 border-[#7C3AED] bg-[#7C3AED]/[0.06] dark:bg-[#7C3AED]/15 shadow-xs"
                        : "border border-border/70 hover:border-border hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <ModelIcon provider={model.provider} className="size-5 shrink-0" />
                      <span className="font-heading text-sm font-medium text-foreground truncate">
                        {model.name}
                      </span>
                      {model.badge && (
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {model.badge}
                        </span>
                      )}
                    </div>

                    {/* Checkmark indicator (Screenshot 3) */}
                    {isSelected && (
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-white shadow-xs">
                        <Check className="size-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Footer with "Apply for this chat" button (Screenshot 3) */}
          <div className="border-t border-border/40 p-4 sm:px-6 flex items-center justify-end bg-background/80 backdrop-blur-sm">
            <Button
              onClick={handleApplyModels}
              className="rounded-xl sm:rounded-2xl bg-[#7C3AED] px-6 text-sm font-semibold text-white shadow-md shadow-[#7C3AED]/20 hover:bg-[#6D28D9] hover:shadow-[#7C3AED]/30 active:scale-95 transition-all cursor-pointer"
            >
              Apply for this chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
