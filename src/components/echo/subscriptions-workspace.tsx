"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Menu,
  Check,
  Sparkles,
  ArrowLeft,
  Search,
  ShieldCheck,
  Zap,
  Star,
  Cpu,
  Layers,
  HelpCircle,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { motion } from "motion/react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SidebarNav, type ThreadSummary } from "./sidebar-nav";
import { supabase } from "@/integrations/supabase/client";
import { getAllThreadMetadata } from "@/lib/thread-storage";
import { toast } from "sonner";

/* ---------------- Model Lists ---------------- */

const BASIC_MODELS: string[] = [
  "EchoGPT",
  "Nemotron 3 Ultra",
  "LongCat 2.0",
  "Ling 3.0 Flash Sante (free)",
  "Ling 3.0 Flash Fin (free)",
  "Dots3-Note Preview (free)",
  "LFM2.5-2.6B (free)",
  "Nemotron 3.5 Lightning (free)",
  "Laguna XS 2.1 (free)",
  "North Mini Code (free)",
  "Nemotron 3.5 Content Safety (free)",
  "Nemotron 3 Nano Omni (free)",
  "Gemma 4 26B A4B (free)",
  "Gemma 4 31B (free)",
  "Nemotron 3 Super (free)",
];

const ADVANCED_MODELS: string[] = [
  "DeepSeek V4 Pro",
  "GPT-5.4",
  "GPT-5.5",
  "GPT-5.6 Sol",
  "GLM-5.2",
  "Tencent Hy3",
  "Qwen 3.8 27B",
  "DeepSeek V4 Flash",
  "Kimi K2.7 Code",
  "MiniMax M3",
  "GLM-5.3 Flash",
  "Gemini 3.8 Flash",
  "Qwen 3.7 Max",
  "Qwen 3.7 Plus",
  "Qwen 3.6 Plus",
  "MiMo V2.5",
  "GPT-5.6 Luna",
  "Qwen 3.8 Max",
  "MiMo V2.5 Pro",
  "Qwen 3.8 Max 0902",
  "Tencent Hy4 Preview",
  "Qwen 3.8 Flash",
  "DeepSeek V4 Flash Vision",
  "DeepSeek V4 Flash Fast",
  "GLM-5.3",
  "Muse Spark 1.3",
  "Muse Spark 1.3 Contributor",
  "Muse Spark 1.2",
  "Kimi K3",
  "Kimi K2.7 Code HighSpeed",
  "Grok 4.5",
  "Grok 4.6",
  "Gemini 3.7 Flash",
  "GLM-5.2 Fast",
  "Inkling",
  "Inkling Small",
  "Step 3.7 Flash",
  "Step 3.5 Flash",
  "Jev Router",
  "Perceptron Mk1.5",
  "Ember-1",
  "GLM 5.3 Prime",
  "Qwen3.8 Max Prime",
  "Space Bunny Alpha",
  "Aion 3.5 Mini",
  "Aion 3.5",
  "Solar Mini 4",
  "Command A+",
  "GPT-6 Luna Pro",
  "GPT-6 Luna",
  "GPT-6 Sol Pro",
  "GPT-6 Sol",
  "Claude Opus 5.5",
  "MiMo-V2.6-Pro-UltraSpeed",
  "MiMo-V2.6-Flash",
  "MiMo-V2.6-Pro",
  "Grok 4.7",
  "Qwen3.8 Omni Flash",
  "Ternary Bonsai 2 27B",
  "GLM 5.3 FlashX",
  "Pareto",
  "DeepSeek Pro Latest",
  "DeepSeek Flash Latest",
  "Schematron V2 Turbo",
  "Schematron V2 Small",
  "GPT Astra Latest",
  "GPT Sol Latest",
  "GPT Terra Latest",
  "GPT Luna Latest",
  "Fugu Ultra v2",
  "Fugu Max",
  "Ling 3.0 Flash VL",
  "DeepSeek V4.1 Flash",
  "Mercury 2.5",
  "GPT-6 Astra",
  "GPT-6 Astra Pro",
  "Granite 4.2 8B",
  "Ling 3.0 Flash Fin",
  "GLM Flash Latest",
  "Hy-MT2-1.8B",
  "Hy-MT2-30B-A3B",
  "GLM Latest",
  "Hy-MT2-7B",
  "Seed 2.1 Turbo",
  "Qwen3.8 2.4T A95B",
  "Seed-2.0-Code",
  "DeepSeek V4 Pro 0813",
  "Nemotron 3.5 Lightning",
  "Sakana Namazu",
  "Solar Pro 4",
  "Muse Glimmer 30B",
  "DeepSeek V4 Flash 0731",
  "Ling 3.0 Flash",
  "KAT-Coder-Pro V2.5",
  "GPT-5.6 Luna Pro",
  "GPT-5.6 Terra Pro",
  "GPT-5.6 Sol Pro",
  "Grok Latest",
  "Aion-3.0-Mini",
  "Aion-3.0",
  "Laguna XS 2.1",
  "Fusion",
  "Claude Fable Latest",
  "Nemotron 3.5 Content Safety",
  "Grok Build 0.1",
  "Perceptron Mk1",
  "GPT Chat Latest",
  "Mistral Medium 3.5",
  "Claude Haiku Latest",
  "GPT Mini Latest",
  "Kimi Latest",
  "Gemini Flash Latest",
  "Claude Sonnet Latest",
  "Qwen3.5 Plus 2026-04-20",
  "Qwen3.6 Flash",
  "Qwen3.6 35B A3B",
  "Qwen3.6 27B",
  "GPT-5.5 Pro",
  "Claude Opus Latest",
  "Pareto Code Router",
  "Gemma 4 26B A4B",
  "Gemma 4 31B",
  "GLM 5V Turbo",
  "Trinity Large Thinking",
  "Grok 4.20 Multi-Agent",
  "Grok 4.20",
  "Reka Edge",
  "GPT-5.4 Nano",
  "Mistral Small 4",
  "GLM 5 Turbo",
  "Nemotron 3 Super",
  "Seed-2.0-Lite",
  "Qwen3.5-9B",
  "GPT-5.4 Pro",
  "Mercury 2",
  "Seed-2.0-Mini",
  "Qwen3.5-35B-A3B",
  "Qwen3.5-27B",
  "Qwen3.5-122B-A10B",
  "Qwen3.5-Flash",
  "Gemini 3.1 Pro Preview Custom Tools",
  "Aion-2.0",
  "Gemini 3.1 Pro Preview",
  "Qwen3.5 Plus 2026-02-15",
  "Qwen3.5 397B A17B",
  "Qwen3 Max Thinking",
  "Claude Opus 4.6",
  "Qwen3 Coder Next",
  "Free Models Router",
  "Solar Pro 3",
  "MiniMax M2-her",
  "Palmyra X5",
  "GLM 4.7 Flash",
  "GPT-5.2-Codex",
  "Seed 1.6 Flash",
  "Seed 1.6",
  "MiniMax M2.1",
  "GLM 4.7",
  "Gemini 3 Flash Preview",
  "Nemotron 3 Nano 30B A3B",
  "GPT-5.2 Chat",
  "GPT-5.2 Pro",
  "GPT-5.2",
  "Devstral 2 2512",
  "Relace Search",
  "GLM 4.6V",
  "Body Builder (beta)",
  "GPT-5.1-Codex-Max",
  "Nova 2 Lite",
  "Ministral 3 14B 2512",
  "Ministral 3 8B 2512",
  "Ministral 3 3B 2512",
  "Mistral Large 3 2512",
  "DeepSeek V3.2",
  "Claude Opus 4.5",
  "GPT-5.1",
  "GPT-5.1-Codex",
  "GPT-5.1-Codex-Mini",
  "Kimi K2 Thinking",
  "Nova Premier 1.0",
  "Sonar Pro Search",
  "Voxtral Small 24B 2507",
  "gpt-oss-safeguard-20b",
  "MiniMax M2",
  "Qwen3 VL 32B Instruct",
  "Granite 4.0 Micro",
  "Qwen3 VL 8B Thinking",
  "Qwen3 VL 8B Instruct",
  "Qwen3 VL 30B A3B Thinking",
  "Qwen3 VL 30B A3B Instruct",
  "GLM 4.6",
  "Claude Sonnet 4.5",
  "DeepSeek V3.2 Exp",
  "Cydonia 24B V4.1",
  "Relace Apply 3",
  "Qwen3 VL 235B A22B Thinking",
  "Qwen3 VL 235B A22B Instruct",
  "Qwen3 Max",
  "Qwen3 Coder Plus",
  "DeepSeek V3.1 Terminus",
  "Qwen3 Coder Flash",
  "Qwen3 Next 80B A3B Thinking",
  "Qwen3 Next 80B A3B Instruct",
  "Qwen Plus 0728",
  "Kimi K2 0905",
  "Qwen3 30B A3B Thinking 2507",
  "Hermes 4 405B",
  "DeepSeek V3.1",
  "Mistral Medium 3.1",
  "GLM 4.5V",
  "GPT-5 Nano",
  "gpt-oss-120b",
  "gpt-oss-20b",
  "Claude Opus 4.1",
  "Codestral 2508",
  "Qwen3 Coder 30B A3B Instruct",
  "Qwen3 30B A3B Instruct 2507",
  "GLM 4.5",
  "GLM 4.5 Air",
  "Qwen3 235B A22B Thinking 2507",
  "Qwen3 Coder 480B A35B",
  "UI-TARS 7B",
  "Gemini 2.5 Flash Lite",
  "Qwen3 235B A22B Instruct 2507",
  "Kimi K2 0711",
  "Uncensored",
  "Hunyuan A13B Instruct",
  "Morph V3 Large",
  "Morph V3 Fast",
  "ERNIE 4.5 VL 424B A47B",
  "Mistral Small 3.2 24B",
  "MiniMax M1",
  "Gemini 2.5 Pro",
  "o3 Pro",
  "Gemini 2.5 Pro Preview 06-05",
  "R1 0528",
  "Claude Sonnet 4",
  "Mistral Medium 3",
  "Llama Guard 4 12B",
  "Qwen3 30B A3B",
  "Qwen3 8B",
  "Qwen3 14B",
  "Qwen3 32B",
  "Qwen3 235B A22B",
  "o4 Mini High",
  "o3",
  "o4 Mini",
  "GPT-4.1",
  "GPT-4.1 Mini",
  "GPT-4.1 Nano",
  "Llama 4 Maverick",
  "Llama 4 Scout",
  "DeepSeek V3 0324",
  "o1-pro",
  "Mistral Small 3.1 24B",
  "Gemma 3 4B",
  "Gemma 3 12B",
  "Command A",
  "Reka Flash 3",
  "Gemma 3 27B",
  "Skyfall 36B V2",
  "Sonar Reasoning Pro",
  "Sonar Pro",
  "Sonar Deep Research",
  "Saba",
  "o3 Mini High",
  "Aion-RP 1.0 (8B)",
  "Qwen2.5 VL 72B Instruct",
  "Qwen-Plus",
  "o3 Mini",
  "Mistral Small 3",
  "Sonar",
  "R1 Distill Llama 70B",
  "R1",
  "MiniMax-01",
  "Phi 4",
  "Llama 3.3 Euryale 70B",
  "Command R7B (12-2024)",
  "Llama 3.3 70B Instruct",
  "Nova Lite 1.0",
  "Nova Micro 1.0",
  "Nova Pro 1.0",
  "Mistral Large 2407",
  "Qwen2.5 Coder 32B Instruct",
  "UnslopNemo 12B",
  "Magnum v4 72B",
  "Qwen2.5 7B Instruct",
  "Llama 3.2 1B Instruct",
  "Llama 3.2 3B Instruct",
  "Qwen2.5 72B Instruct",
  "Command R (08-2024)",
  "Command R+ (08-2024)",
  "Llama 3.1 Euryale 70B v2.2",
  "Hermes 3 70B Instruct",
  "Hermes 3 405B Instruct",
  "Llama 3 8B Lunaris",
  "Llama 3.1 70B Instruct",
  "Llama 3.1 8B Instruct",
  "Mistral Nemo",
  "Gemma 2 27B",
  "Mixtral 8x22B Instruct",
  "WizardLM-2 8x22B",
  "GPT-3.5 Turbo (older v0613)",
  "GPT-3.5 Turbo Instruct",
  "GPT-3.5 Turbo 16k",
  "Weaver (alpha)",
  "ReMM SLERP 13B",
  "MythoMax 13B",
];

/* ---------------- Plan Definitions ---------------- */

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  billingDetail: string;
  description: string;
  badge?: string;
  isPopular?: boolean;
  savings?: string;
  features: string[];
}

const PLANS: PricingPlan[] = [
  {
    id: "monthly",
    name: "Monthly Plan",
    price: "USD $9.99",
    billingDetail: "USD $9.99/month",
    description:
      "Experience the benefits of Pro membership with unlimited chats for one month.",
    badge: "Recommended",
    isPopular: false,
    features: [
      "Unlimited Pro chats for 1 month",
      "2,000 Advance Credits / month",
      "EchoGPT Membership Benefits",
      "Multi-Code Membership Benefits",
      "Access to all 15 Basic Models",
      "Access to 250+ Advanced Frontier Models",
      "Early access to experimental beta tools",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly Plan",
    price: "USD $29.99",
    billingDetail: "USD $29.99/3 month",
    description:
      "Unlock three months of Pro features and save with quarterly billing.",
    badge: "Recommended",
    isPopular: false,
    savings: "Save with quarterly billing",
    features: [
      "Unlimited Pro chats for 3 months",
      "2,000 Advance Credits / month",
      "EchoGPT Membership Benefits",
      "Multi-Code Membership Benefits",
      "Access to all 15 Basic Models",
      "Access to 250+ Advanced Frontier Models",
      "Priority bandwidth & compute allocation",
    ],
  },
  {
    id: "half-yearly",
    name: "Half-Yearly Plan",
    price: "USD $59.99",
    billingDetail: "USD $59.99/6 month",
    description:
      "Enjoy six months of Pro features at a discounted rate, paid biannually.",
    badge: "Recommended",
    isPopular: false,
    savings: "Discounted biannual rate",
    features: [
      "Unlimited Pro chats for 6 months",
      "2,000 Advance Credits / month",
      "EchoGPT Membership Benefits",
      "Multi-Code Membership Benefits",
      "Access to all 15 Basic Models",
      "Access to 250+ Advanced Frontier Models",
      "Extended context window & high throughput",
    ],
  },
  {
    id: "annual",
    name: "Annual Plan",
    price: "USD $99.99",
    billingDetail: "USD $99.99/12 month",
    description:
      "Access all Pro member features for a full year, with significant savings.",
    badge: "Recommended • Best Value",
    isPopular: true,
    savings: "Save ~17% ($8.33/mo)",
    features: [
      "Unlimited Pro chats for 1 full year",
      "2,000 Advance Credits / month",
      "EchoGPT Membership Benefits",
      "Multi-Code Membership Benefits",
      "Access to all 15 Basic Models",
      "Access to 250+ Advanced Frontier Models",
      "VIP priority queue & premier support",
    ],
  },
];

export function SubscriptionsWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Model catalog search & filter
  const [modelSearch, setModelSearch] = useState("");
  const [modelTab, setModelTab] = useState<"all" | "basic" | "advanced">("all");

  // Checkout modal
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  // Sync Supabase user
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
    let ignore = false;
    if (!user) {
      const local = getAllThreadMetadata();
      const summaries = Object.values(local).map((t) => ({
        id: t.id,
        title: t.title,
        updated_at: t.updated_at,
      }));
      setThreads(summaries);
      return;
    }
    void supabase
      .from("threads")
      .select("id,title,updated_at")
      .order("updated_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!ignore) setThreads(data ?? []);
      });
    return () => {
      ignore = true;
    };
  }, [user]);

  // Filtered models
  const filteredBasic = useMemo(() => {
    if (!modelSearch.trim()) return BASIC_MODELS;
    const q = modelSearch.toLowerCase();
    return BASIC_MODELS.filter((m) => m.toLowerCase().includes(q));
  }, [modelSearch]);

  const filteredAdvanced = useMemo(() => {
    if (!modelSearch.trim()) return ADVANCED_MODELS;
    const q = modelSearch.toLowerCase();
    return ADVANCED_MODELS.filter((m) => m.toLowerCase().includes(q));
  }, [modelSearch]);

  const totalVisibleCount =
    modelTab === "basic"
      ? filteredBasic.length
      : modelTab === "advanced"
      ? filteredAdvanced.length
      : filteredBasic.length + filteredAdvanced.length;

  const handleSubscribeClick = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setCheckoutModalOpen(true);
  };

  const handleConfirmSubscription = () => {
    if (!selectedPlan) return;
    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      setCheckoutModalOpen(false);
      toast.success(
        `Successfully subscribed to ${selectedPlan.name}! Enjoy unlimited Pro features.`
      );
    }, 1000);
  };

  return (
    <div className="soft-grid flex h-dvh min-w-0 bg-background text-foreground">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden w-[296px] shrink-0 lg:block">
        <SidebarNav threads={threads} user={user} />
      </aside>

      {/* Main Content Area */}
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile Navigation Trigger */}
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
                <SheetDescription>Workspace Navigation Menu</SheetDescription>
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
            {/* Top Bar with Back Link */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pt-2 sm:pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="gap-2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer rounded-xl -ml-2"
              >
                <ArrowLeft className="size-4" />
                Back to Workspace
              </Button>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" />
                <span>EchoGPT Plus Membership</span>
              </div>
            </div>

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="relative pt-4 pb-10 sm:pt-8 sm:pb-12 text-center"
            >
              {/* Subtle ambient light glow */}
              <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-gradient-to-tr from-purple-500/15 via-indigo-500/10 to-transparent blur-3xl -z-10" />

              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Affordable plans for{" "}
                <span className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] dark:from-[#9333EA] dark:via-[#A855F7] dark:to-[#C084FC] bg-clip-text text-transparent">
                  every need
                </span>
              </h1>
              <p className="mt-3.5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Want to get more out of EchoGPT Plus? Subscribe to one of our
                professional plans.
              </p>
            </motion.div>

            {/* 4 Plans Pricing Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 pb-14">
              {PLANS.map((plan, idx) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.28,
                    delay: idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className={`group relative flex flex-col justify-between rounded-3xl border p-6 backdrop-blur-xs transition-colors duration-200 cursor-pointer ${
                    plan.isPopular
                      ? "border-primary bg-card/90 shadow-xl shadow-primary/10 ring-1 ring-primary/40 dark:shadow-primary/5"
                      : "border-border/80 bg-card/60 hover:border-primary/40 hover:shadow-lg"
                  }`}
                >
                  {/* Top Badge */}
                  {plan.badge && (
                    <div className="mb-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase ${
                          plan.isPopular
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#341B5E]/70 dark:text-[#C4B5FD]"
                        }`}
                      >
                        <Star className="size-3 fill-current" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Plan Title & Pricing */}
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {plan.name}
                    </h3>
                    <div className="mt-3">
                      <div className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
                        {plan.price}
                      </div>
                      <div className="text-xs font-medium text-muted-foreground mt-0.5">
                        {plan.billingDetail}
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Subscribe Button */}
                    <button
                      type="button"
                      onClick={() => handleSubscribeClick(plan)}
                      className={`mt-6 w-full rounded-2xl py-3 text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
                        plan.isPopular
                          ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-[0_8px_20px_-4px_rgba(124,58,237,0.4)]"
                          : "bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground dark:bg-primary/15"
                      }`}
                    >
                      Subscribe Now
                    </button>

                    {/* Features Checklist */}
                    <div className="mt-6 space-y-2.5 border-t border-border/50 pt-5 text-xs text-foreground/90">
                      <div className="font-semibold text-foreground text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
                        Plan Perks
                      </div>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5">
                          <Check className="size-4 shrink-0 text-primary stroke-[2.5] mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Included Models Summary */}
                  <div className="mt-6 pt-4 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>265+ AI Models</span>
                    <span className="font-semibold text-primary">Included</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Model Access Catalog Explorer */}
            <div className="mb-14 rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-xs">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                    <Cpu className="size-3.5" />
                    <span>Comprehensive Model Directory</span>
                  </div>
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Included Foundation Models
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-xl">
                    All plans include full access to our multi-model gateway
                    featuring over 265 frontier and open-weight models.
                  </p>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/60">
                    <button
                      type="button"
                      onClick={() => setModelTab("all")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        modelTab === "all"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      All ({BASIC_MODELS.length + ADVANCED_MODELS.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setModelTab("basic")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        modelTab === "basic"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Basic ({BASIC_MODELS.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setModelTab("advanced")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        modelTab === "advanced"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Advanced ({ADVANCED_MODELS.length})
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search models..."
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      className="pl-8 text-xs rounded-xl h-9 w-full sm:w-44"
                    />
                  </div>
                </div>
              </div>

              {/* Models Content Container */}
              <div className="space-y-6">
                {/* 1. Basic Models Section */}
                {(modelTab === "all" || modelTab === "basic") &&
                  filteredBasic.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-heading text-sm font-semibold text-foreground">
                          Access to basic models
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          {filteredBasic.length} models
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {filteredBasic.map((model) => (
                          <span
                            key={model}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50"
                          >
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 2. Advanced Models Section */}
                {(modelTab === "all" || modelTab === "advanced") &&
                  filteredAdvanced.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 pt-2">
                        <span className="font-heading text-sm font-semibold text-foreground">
                          Access to advanced models
                        </span>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                          {filteredAdvanced.length} models
                        </span>
                      </div>
                      <div className="max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border/60">
                        <div className="flex flex-wrap gap-2">
                          {filteredAdvanced.map((model) => (
                            <span
                              key={model}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-accent/40"
                            >
                              <span className="size-1.5 rounded-full bg-primary" />
                              {model}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                {totalVisibleCount === 0 && (
                  <div className="p-8 text-center text-xs text-muted-foreground">
                    No models matching &ldquo;{modelSearch}&rdquo;. Try another
                    query.
                  </div>
                )}
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="border-t border-border/60 pt-12 pb-16">
              <div className="text-center sm:text-left mb-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Need Help?
                </div>
                <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Frequently Asked Questions
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                  Cannot find the answer you are looking for? Reach out to our{" "}
                  <Link
                    href="/support"
                    className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                  >
                    customer support
                    <ExternalLink className="size-3" />
                  </Link>{" "}
                  team.
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-3">
                {/* Q1 */}
                <AccordionItem
                  value="faq-1"
                  className="rounded-2xl border border-border/70 bg-card/40 px-5"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold hover:no-underline py-4">
                    What platforms is EchoGPT available on?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    Currently, EchoGPT is available as a web app. We are
                    actively working on expanding our reach to Android, iOS and
                    developing EchoGPT as a plug-in as well.
                  </AccordionContent>
                </AccordionItem>

                {/* Q2 */}
                <AccordionItem
                  value="faq-2"
                  className="rounded-2xl border border-border/70 bg-card/40 px-5"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold hover:no-underline py-4">
                    Is my personal data safe and secure when using EchoGPT?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    Yes, we prioritise your data security with robust
                    organisational and technical measures. For more details, refer
                    to our{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-primary underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </AccordionContent>
                </AccordionItem>

                {/* Q3 */}
                <AccordionItem
                  value="faq-3"
                  className="rounded-2xl border border-border/70 bg-card/40 px-5"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold hover:no-underline py-4">
                    Who do I contact if I have questions or need support?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    For support, email us at{" "}
                    <a
                      href="mailto:appifydevs@gmail.com"
                      className="text-primary font-medium underline"
                    >
                      appifydevs@gmail.com
                    </a>{" "}
                    or{" "}
                    <a
                      href="mailto:support@echogpt.ai"
                      className="text-primary font-medium underline"
                    >
                      support@echogpt.ai
                    </a>
                    . We aim to respond within 48 hours. You can also reach our
                    dedicated team via our{" "}
                    <Link
                      href="/support"
                      className="text-primary font-medium underline"
                    >
                      Support Center
                    </Link>
                    .
                  </AccordionContent>
                </AccordionItem>

                {/* Q4 */}
                <AccordionItem
                  value="faq-4"
                  className="rounded-2xl border border-border/70 bg-card/40 px-5"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold hover:no-underline py-4">
                    How can I cancel my subscription?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    If you subscribe to EchoGPT there is no refund if you cancel
                    subscription. However, you will retain full Pro benefits
                    until the end of your prepaid billing period, and no further
                    renewals will occur.
                  </AccordionContent>
                </AccordionItem>

                {/* Q5 */}
                <AccordionItem
                  value="faq-5"
                  className="rounded-2xl border border-border/70 bg-card/40 px-5"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold hover:no-underline py-4">
                    How can I report a bug to the developer?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    In the app, navigate to Dashboard &gt; Support, and email us
                    with detailed information about the bug, including your device
                    model and browser version.
                  </AccordionContent>
                </AccordionItem>

                {/* Q6 */}
                <AccordionItem
                  value="faq-6"
                  className="rounded-2xl border border-border/70 bg-card/40 px-5"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold hover:no-underline py-4">
                    What can I use EchoGPT for?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    EchoGPT helps with tasks like generating text, summarising
                    articles, brainstorming ideas, coding, document synthesis, and
                    much more, leveraging the power of GPT-4 and frontier models.
                  </AccordionContent>
                </AccordionItem>

                {/* Q7 */}
                <AccordionItem
                  value="faq-7"
                  className="rounded-2xl border border-border/70 bg-card/40 px-5"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold hover:no-underline py-4">
                    What are the different subscription plans available?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    We offer Monthly ($9.99/mo), Quarterly ($29.99/3 mo),
                    Half-Yearly ($59.99/6 mo), and Annual ($99.99/yr) plans with
                    24/7 support and early access to new features.
                  </AccordionContent>
                </AccordionItem>

                {/* Q8 */}
                <AccordionItem
                  value="faq-8"
                  className="rounded-2xl border border-border/70 bg-card/40 px-5"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold hover:no-underline py-4">
                    Can I use EchoGPT on multiple devices simultaneously?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    Yes, you can use your account across multiple devices
                    seamlessly without needing separate licenses.
                  </AccordionContent>
                </AccordionItem>

                {/* Q9 */}
                <AccordionItem
                  value="faq-9"
                  className="rounded-2xl border border-border/70 bg-card/40 px-5"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold hover:no-underline py-4">
                    What is the difference between basic and advanced models?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    Basic models provide general, fast responses, while advanced
                    models like GPT-5, Claude Opus, and DeepSeek V4 offer more
                    accurate, complex reasoning and detailed answers.
                  </AccordionContent>
                </AccordionItem>

                {/* Q10 */}
                <AccordionItem
                  value="faq-10"
                  className="rounded-2xl border border-border/70 bg-card/40 px-5"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold hover:no-underline py-4">
                    Can I share my account with others?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    Accounts are intended for individual use. For team or
                    organization-wide access with centralized billing and shared
                    workspaces, please reach out to our team at{" "}
                    <Link
                      href="/support"
                      className="text-primary font-medium underline"
                    >
                      support
                    </Link>
                    .
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      <Dialog open={checkoutModalOpen} onOpenChange={setCheckoutModalOpen}>
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <CreditCard className="size-6" />
              <DialogTitle className="font-heading text-xl">
                Confirm Subscription
              </DialogTitle>
            </div>
            <DialogDescription>
              Upgrade your EchoGPT workspace to unlock Pro features and models.
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-4 pt-2">
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-base font-bold text-foreground">
                    {selectedPlan.name}
                  </span>
                  <span className="font-mono text-base font-extrabold text-primary">
                    {selectedPlan.price}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedPlan.billingDetail}
                </div>
                <div className="pt-2 border-t border-border/40 text-xs text-foreground/80 space-y-1">
                  <div className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary" />
                    <span>2,000 Advance Credits included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary" />
                    <span>Unlimited Pro chats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary" />
                    <span>265+ Basic & Advanced AI Models</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/50 p-3 text-xs space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="size-3.5 text-emerald-500" />
                  <span>256-bit TLS encrypted secure payment</span>
                </div>
                <div className="text-[11px] text-muted-foreground/80">
                  By clicking Confirm & Subscribe, you agree to EchoGPT&apos;s
                  Terms of Use and authorize recurring billing at the selected
                  interval.
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setCheckoutModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={subscribing}
                  className="flex-1 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold"
                  onClick={handleConfirmSubscription}
                >
                  {subscribing ? (
                    <div className="flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Confirm & Subscribe"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
