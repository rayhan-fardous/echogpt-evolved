"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Menu,
  Search,
  X,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Flame,
  Layers,
  Code2,
  Brain,
  Zap,
  Eye,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ModelIcon } from "./model-icon";
import { ALL_MODELS, type AIModel } from "@/lib/models-data";
import { toast } from "sonner";

/* ---------------- Types ---------------- */

export type StoreCategory =
  | "all"
  | "featured"
  | "reasoning"
  | "coding"
  | "creative"
  | "multimodal"
  | "fast";

export interface StoreAppItem {
  id: string;
  name: string;
  provider: AIModel["provider"];
  providerName: string;
  description: string;
  category: StoreCategory;
  categoryLabel: string;
  contextWindow: string;
  badge?: "Popular" | "Pro" | "New" | "Free";
  isFeatured?: boolean;
}

/* ---------------- Store Catalogue (Complete from User List) ---------------- */

const STORE_APPS: StoreAppItem[] = [
  {
    id: "echogpt",
    name: "EchoGPT",
    provider: "echogpt",
    providerName: "EchoGPT",
    description:
      "Interact with EchoGPT, an AI that reflects your input for quick ideas, summaries, or feedback. Perfect for brainstorming or rapid dialogue.",
    category: "creative",
    categoryLabel: "Creative & Dialogue",
    contextWindow: "128K context",
    badge: "Popular",
    isFeatured: true,
  },
  {
    id: "nemotron-3-ultra",
    name: "Nemotron 3 Ultra",
    provider: "nvidia",
    providerName: "NVIDIA",
    description: "Llama 3.1 Nemotron 70B Instruct. Highly capable open model tuned by NVIDIA for robust instruction following.",
    category: "reasoning",
    categoryLabel: "Flagship Reasoning",
    contextWindow: "128K context",
    badge: "Popular",
    isFeatured: true,
  },
  {
    id: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    provider: "deepseek",
    providerName: "DeepSeek",
    description:
      "DeepSeek specializes in advanced data exploration, leveraging AI to deliver accurate, insightful, and efficient solutions for complex analysis.",
    category: "reasoning",
    categoryLabel: "Flagship Reasoning",
    contextWindow: "1M context",
    badge: "Popular",
    isFeatured: true,
  },
  {
    id: "gpt-5.6-sol",
    name: "GPT-5.6 Sol",
    provider: "openai",
    providerName: "OpenAI",
    description:
      "GPT-5.6 Sol delivers OpenAI's flagship reasoning with a 1M token context, ideal for long documents and demanding analysis.",
    category: "reasoning",
    categoryLabel: "Flagship Reasoning",
    contextWindow: "1M context",
    badge: "Pro",
    isFeatured: true,
  },
  {
    id: "claude-opus-5.5",
    name: "Claude Opus 5.5",
    provider: "openai",
    providerName: "Anthropic",
    description:
      "Anthropic: Claude Opus 5.5 via OpenRouter. Accepts images as well as text. 1M token context for deep nuanced analysis.",
    category: "reasoning",
    categoryLabel: "Flagship Reasoning",
    contextWindow: "1M context",
    badge: "Pro",
    isFeatured: true,
  },
  {
    id: "grok-4.7",
    name: "Grok 4.7",
    provider: "xai",
    providerName: "xAI",
    description:
      "SpaceXAI: Grok 4.7 via OpenRouter. Accepts images as well as text. 500K token context with current-events awareness.",
    category: "reasoning",
    categoryLabel: "Flagship Reasoning",
    contextWindow: "500K context",
    badge: "New",
    isFeatured: true,
  },
  {
    id: "kimi-k2.7-code",
    name: "Kimi K2.7 Code",
    provider: "kimi",
    providerName: "Moonshot",
    description:
      "Kimi K2.7 Code is built for software work — reading large repositories, writing code, and explaining changes.",
    category: "coding",
    categoryLabel: "Coding & Software",
    contextWindow: "262K context",
    badge: "Popular",
  },
  {
    id: "glm-5.2",
    name: "GLM-5.2",
    provider: "glm",
    providerName: "Zhipu AI",
    description:
      "GLM-5.2 offers strong multilingual reasoning and coding across a 1M token context at a low cost per token.",
    category: "coding",
    categoryLabel: "Coding & Software",
    contextWindow: "1M context",
  },
  {
    id: "qwen-3.8-max",
    name: "Qwen 3.8 Max",
    provider: "qwen",
    providerName: "Alibaba Qwen",
    description:
      "Qwen 3.8 Max is the latest Qwen flagship, strong at multi-step reasoning over very long context.",
    category: "reasoning",
    categoryLabel: "Flagship Reasoning",
    contextWindow: "1M context",
    badge: "Pro",
  },
  {
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    provider: "gemini",
    providerName: "Google",
    description:
      "Gemini 3.8 Flash combines Google's multimodal strengths with fast responses across a 1M token context.",
    category: "multimodal",
    categoryLabel: "Multimodal & Vision",
    contextWindow: "1M context",
    badge: "Popular",
  },
  {
    id: "deepseek-v4-flash-vision",
    name: "DeepSeek V4 Flash Vision",
    provider: "deepseek",
    providerName: "DeepSeek",
    description:
      "DeepSeek V4 Flash Vision is an experimental multimodal tier that reads images alongside text.",
    category: "multimodal",
    categoryLabel: "Multimodal & Vision",
    contextWindow: "1M context",
    badge: "New",
  },
  {
    id: "mimo-v2.5-pro",
    name: "MiMo V2.5 Pro",
    provider: "mimo",
    providerName: "Xiaomi",
    description:
      "MiMo V2.5 Pro adds stronger reasoning to the MiMo line while staying inexpensive over a 1M token context.",
    category: "fast",
    categoryLabel: "Fast & Lightweight",
    contextWindow: "1M context",
  },
  {
    id: "tencent-hy3",
    name: "Tencent Hy3",
    provider: "tencent",
    providerName: "Tencent",
    description:
      "Tencent Hunyuan 3 provides fast, budget-friendly responses for everyday chat, drafting, and summarisation.",
    category: "fast",
    categoryLabel: "Fast & Lightweight",
    contextWindow: "1M context",
    badge: "Pro",
  },
  {
    id: "qwen-3.8-27b",
    name: "Qwen 3.8 27B",
    provider: "qwen",
    providerName: "Alibaba Qwen",
    description:
      "Qwen 3.8 27B balances speed and quality for general assistance, coding help, and structured output.",
    category: "coding",
    categoryLabel: "Coding & Software",
    contextWindow: "262K context",
  },
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    provider: "deepseek",
    providerName: "DeepSeek",
    description:
      "DeepSeek V4 Flash answers quickly over a 1M token context, tuned for rapid iteration at very low cost.",
    category: "fast",
    categoryLabel: "Fast & Lightweight",
    contextWindow: "1M context",
  },
  {
    id: "minimax-m3",
    name: "MiniMax M3",
    provider: "minimax",
    providerName: "MiniMax",
    description:
      "MiniMax M3 handles long-context conversation and reasoning with an efficient price-to-quality balance.",
    category: "fast",
    categoryLabel: "Fast & Lightweight",
    contextWindow: "1M context",
  },
  {
    id: "glm-5.3-flash",
    name: "GLM-5.3 Flash",
    provider: "glm",
    providerName: "Zhipu AI",
    description:
      "GLM-5.3 Flash is the fastest GLM tier, made for high-volume chat where latency matters most.",
    category: "fast",
    categoryLabel: "Fast & Lightweight",
    contextWindow: "1M context",
  },
  {
    id: "qwen-3.7-max",
    name: "Qwen 3.7 Max",
    provider: "qwen",
    providerName: "Alibaba Qwen",
    description:
      "Qwen 3.7 Max is the top Qwen tier for complex reasoning, long-form writing, and detailed technical work.",
    category: "reasoning",
    categoryLabel: "Flagship Reasoning",
    contextWindow: "1M context",
  },
  {
    id: "qwen-3.7-plus",
    name: "Qwen 3.7 Plus",
    provider: "qwen",
    providerName: "Alibaba Qwen",
    description:
      "Qwen 3.7 Plus gives near-flagship quality at a fraction of the cost for daily reasoning and drafting.",
    category: "reasoning",
    categoryLabel: "Flagship Reasoning",
    contextWindow: "1M context",
  },
  {
    id: "qwen-3.6-plus",
    name: "Qwen 3.6 Plus",
    provider: "qwen",
    providerName: "Alibaba Qwen",
    description:
      "Qwen 3.6 Plus is a dependable general-purpose model for conversation, summarisation, and analysis.",
    category: "reasoning",
    categoryLabel: "Flagship Reasoning",
    contextWindow: "1M context",
  },
  {
    id: "mimo-v2.5",
    name: "MiMo V2.5",
    provider: "mimo",
    providerName: "Xiaomi",
    description:
      "MiMo V2.5 from Xiaomi delivers efficient everyday assistance with one of the lowest costs per token.",
    category: "fast",
    categoryLabel: "Fast & Lightweight",
    contextWindow: "1M context",
  },
  {
    id: "gpt-5.6-luna",
    name: "GPT-5.6 Luna",
    provider: "openai",
    providerName: "OpenAI",
    description:
      "GPT-5.6 Luna is the lightweight GPT-5.6 tier — quick, inexpensive, and capable across everyday tasks.",
    category: "fast",
    categoryLabel: "Fast & Lightweight",
    contextWindow: "1.1M context",
  },
  {
    id: "tencent-hy4-preview",
    name: "Tencent Hy4 Preview",
    provider: "tencent",
    providerName: "Tencent",
    description:
      "Tencent Hunyuan 4 Preview is the newest Hunyuan generation, with a 1M token context for long documents.",
    category: "reasoning",
    categoryLabel: "Flagship Reasoning",
    contextWindow: "1M context",
    badge: "New",
  },
  {
    id: "qwen-3.8-flash",
    name: "Qwen 3.8 Flash",
    provider: "qwen",
    providerName: "Alibaba Qwen",
    description:
      "Qwen 3.8 Flash trades a little depth for speed, ideal for quick answers and high-volume chat.",
    category: "fast",
    categoryLabel: "Fast & Lightweight",
    contextWindow: "1M context",
  },
  {
    id: "muse-spark-1.3",
    name: "Muse Spark 1.3",
    provider: "meta",
    providerName: "Meta",
    description:
      "Muse Spark 1.3 is Meta's newest Spark model, tuned for creative writing and open-ended conversation.",
    category: "creative",
    categoryLabel: "Creative & Dialogue",
    contextWindow: "1M context",
    badge: "Popular",
  },
  {
    id: "kimi-k3",
    name: "Kimi K3",
    provider: "kimi",
    providerName: "Moonshot",
    description:
      "Kimi K3 is Moonshot's flagship, built for deep reasoning and agentic work across a 1M token context.",
    category: "reasoning",
    categoryLabel: "Flagship Reasoning",
    contextWindow: "1M context",
    badge: "Pro",
  },
  {
    id: "grok-4.5",
    name: "Grok 4.5",
    provider: "xai",
    providerName: "xAI",
    description:
      "Grok 4.5 brings xAI's conversational style and current-events awareness to a 500K token context.",
    category: "reasoning",
    categoryLabel: "Flagship Reasoning",
    contextWindow: "500K context",
  },
  {
    id: "sonar-pro-search",
    name: "Sonar Pro Search",
    provider: "thinkingmachines",
    providerName: "Perplexity",
    description:
      "Perplexity: Sonar Pro Search via OpenRouter. Accepts images as well as text. 200K token context with live web grounding.",
    category: "multimodal",
    categoryLabel: "Multimodal & Vision",
    contextWindow: "200K context",
    badge: "Pro",
  },
  {
    id: "inkling",
    name: "Inkling",
    provider: "thinkingmachines",
    providerName: "Thinking Machines",
    description:
      "Inkling from Thinking Machines is tuned for careful, well-structured reasoning and clear explanations.",
    category: "reasoning",
    categoryLabel: "Flagship Reasoning",
    contextWindow: "1M context",
  },
  {
    id: "longcat-2.0",
    name: "LongCat 2.0",
    provider: "meituan",
    providerName: "Meituan",
    description:
      "LongCat 2.0 from Meituan is free to use, with a 1M token context for long documents and extended chats.",
    category: "fast",
    categoryLabel: "Fast & Lightweight",
    contextWindow: "1M context",
    badge: "Free",
  },
  {
    id: "step-3.7-flash",
    name: "Step 3.7 Flash",
    provider: "stepfun",
    providerName: "StepFun",
    description:
      "Step 3.7 Flash from StepFun answers quickly and cheaply, suited to short interactive exchanges.",
    category: "fast",
    categoryLabel: "Fast & Lightweight",
    contextWindow: "1M context",
  },
];

/* ---------------- Main StoreWorkspace Component ---------------- */

export function StoreWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory>("all");

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

  // Sync threads for sidebar
  useEffect(() => {
    const all = getAllThreadMetadata();
    const summaries = Object.values(all).map((t) => ({
      id: t.id,
      title: t.title,
      updated_at: t.updated_at,
    }));
    setThreads(summaries);
  }, [user]);

  // "Try App" handler: initializes a new chat with the chosen model
  const handleTryApp = (app: StoreAppItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      localStorage.setItem("echo-selected-model", app.id);
    } catch {
      // ignore
    }
    const newThreadId = crypto.randomUUID();
    toast.success(`Launching chat with ${app.name}`);
    router.push(`/chat/${newThreadId}?model=${encodeURIComponent(app.id)}`);
  };

  // Filtered Apps
  const filteredApps = useMemo(() => {
    return STORE_APPS.filter((app) => {
      // Category filter
      if (selectedCategory === "featured" && !app.isFeatured) {
        return false;
      }
      if (
        selectedCategory !== "all" &&
        selectedCategory !== "featured" &&
        app.category !== selectedCategory
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = app.name.toLowerCase().includes(q);
        const descMatch = app.description.toLowerCase().includes(q);
        const provMatch = app.providerName.toLowerCase().includes(q);
        const catMatch = app.categoryLabel.toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !provMatch && !catMatch) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="soft-grid flex h-dvh min-w-0 bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside className="hidden w-[296px] shrink-0 lg:block">
        <SidebarNav threads={threads} user={user} />
      </aside>

      {/* Main Store Area */}
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
                <SheetDescription>EchoGPT navigation and store</SheetDescription>
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
          <div className="mx-auto max-w-6xl">
            {/* Header Block (Matching Screenshot) */}
            <div className="mb-8 pt-4 text-center sm:pt-6">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                EchoGPT Store
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
                Discover and create custom versions of ChatGPT that combine instructions, extra knowledge, and any combination of skills.
              </p>
            </div>

            {/* Search Input Bar (Matching Screenshot: "Search for the Apps") */}
            <div className="mb-8 w-full max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search for the Apps"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] pl-12 pr-10 text-sm sm:text-[15px] text-foreground border-border/80 shadow-xs focus-visible:bg-background focus-visible:border-primary/50"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full cursor-pointer"
                    title="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                {[
                  { id: "all", label: "All Apps" },
                  { id: "featured", label: "Featured" },
                  { id: "reasoning", label: "Flagship Reasoning" },
                  { id: "coding", label: "Coding & Dev" },
                  { id: "creative", label: "Creative Writing" },
                  { id: "multimodal", label: "Multimodal & Vision" },
                  { id: "fast", label: "Fast & Lightweight" },
                ].map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id as StoreCategory)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#7C3AED] text-white shadow-xs"
                          : "border border-border/70 text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Apps Grid (Matching Screenshot: 3 Columns with Brand Icon on Left and "Try App" on Right) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredApps.map((app) => {
                return (
                  <div
                    key={app.id}
                    onClick={() => handleTryApp(app)}
                    className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-background/95 dark:bg-[#151226]/90 p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md cursor-pointer"
                  >
                    <div>
                      {/* Top Bar (Screenshot): Brand Icon on Left, "Try App" pill button on Right */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] p-1 shadow-xs shrink-0">
                          <ModelIcon provider={app.provider} className="size-7" />
                        </div>

                        {/* "Try App" button (Screenshot) */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleTryApp(app, e)}
                          className="h-8 rounded-full border-border/80 px-4 text-xs font-medium text-foreground hover:bg-[#7C3AED] hover:text-white hover:border-[#7C3AED] transition-all cursor-pointer"
                        >
                          Try App
                        </Button>
                      </div>

                      {/* App Name (Screenshot) */}
                      <div className="mt-4 flex items-center gap-2">
                        <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {app.name}
                        </h3>
                        {app.badge && (
                          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            {app.badge}
                          </span>
                        )}
                      </div>

                      {/* Description (Screenshot) */}
                      <p className="mt-2.5 text-xs sm:text-[13px] text-muted-foreground/90 leading-relaxed line-clamp-3">
                        {app.description}
                      </p>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-5 border-t border-border/50 pt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground/80">{app.providerName}</span>
                      <span className="rounded-full bg-muted/60 px-2.5 py-0.5 font-medium">
                        {app.contextWindow}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty Search Results State */}
            {filteredApps.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border/70 py-16 text-center">
                <Layers className="size-8 mx-auto text-muted-foreground/60 mb-2" />
                <p className="font-heading text-base font-semibold text-foreground">
                  No apps found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search terms or selecting another category.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-xl text-xs cursor-pointer"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Reset Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
