"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Menu,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Cpu,
  Zap,
  CheckCircle2,
  Calendar,
  Clock,
  ChevronDown,
  ArrowLeft,
  Users,
  Check,
  Star,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
import { SidebarNav, type ThreadSummary } from "./sidebar-nav";
import { supabase } from "@/integrations/supabase/client";
import { getAllThreadMetadata } from "@/lib/thread-storage";
import { toast } from "sonner";

export function NewsletterWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Sync Supabase user
  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (active) {
        setUser(data.user);
        if (data.user?.email) setEmail(data.user.email);
      }
    };
    void loadUser();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) setEmail(session.user.email);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid business email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      toast.success("Welcome aboard! You're now subscribed to EchoGPT Insights.");
    }, 800);
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
          <div className="mx-auto max-w-4xl">
            {/* Top Bar with Back Link */}
            <div className="mb-6 flex items-center justify-between pt-2 sm:pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="gap-2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer rounded-xl -ml-2"
              >
                <ArrowLeft className="size-4" />
                Back to Workspace
              </Button>

              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" />
                <span>Weekly AI Intel</span>
              </div>
            </div>

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 text-center"
            >
              {/* Subtle ambient background glow */}
              <motion.div
                animate={{
                  scale: [1, 1.06, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-gradient-to-tr from-purple-500/15 via-indigo-500/10 to-transparent blur-3xl -z-10"
              />

              <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Elevate Your{" "}
                <span className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] dark:from-[#9333EA] dark:via-[#A855F7] dark:to-[#C084FC] bg-clip-text text-transparent">
                  AI Strategy
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
                Join 50,000+ professionals receiving curated insights on AI
                productivity, industry trends, and exclusive EchoGPT features.
              </p>

              {/* Form Container */}
              <div className="mt-9 mx-auto max-w-md">
                <AnimatePresence mode="wait">
                  {subscribed ? (
                    <motion.div
                      key="subscribed"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center shadow-lg backdrop-blur-sm"
                    >
                      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                        <CheckCircle2 className="size-6" />
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-foreground">
                        You&apos;re Subscribed!
                      </h3>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        We&apos;ve sent the latest edition to{" "}
                        <span className="font-semibold text-foreground">{email}</span>.
                        Check your inbox or spam folder!
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSubscribed(false)}
                        className="mt-4 text-xs rounded-xl cursor-pointer"
                      >
                        Subscribe another email
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-3.5"
                    >
                      {/* Input Field with Mail Icon */}
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground/80">
                        <Mail className="size-5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your business email"
                        className="h-13 sm:h-14 w-full rounded-2xl border border-border/80 bg-background/90 px-4 pl-12 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/70 shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    {/* Join Newsletter Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex h-13 sm:h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.99] text-white font-semibold text-base shadow-[0_10px_25px_-5px_rgba(124,58,237,0.45)] dark:shadow-[0_10px_30px_-5px_rgba(124,58,237,0.3)] transition-all cursor-pointer disabled:opacity-70"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Subscribing...</span>
                        </div>
                      ) : (
                        <>
                          <span>Join the Newsletter</span>
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </motion.form>
                  )}
                </AnimatePresence>

                {/* Trust Badges matching screenshot */}
                <div className="mt-6 flex items-center justify-center gap-6 sm:gap-10 text-[11px] sm:text-xs font-semibold tracking-wider text-muted-foreground uppercase select-none">
                  <div className="flex items-center gap-2">
                    <span className="flex size-4.5 items-center justify-center rounded-full bg-[#7C3AED]/15 text-[#7C3AED] dark:bg-[#7C3AED]/25">
                      <Check className="size-3 stroke-[3]" />
                    </span>
                    <span>NO SPAM POLICY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex size-4.5 items-center justify-center rounded-full bg-[#7C3AED]/15 text-[#7C3AED] dark:bg-[#7C3AED]/25">
                      <Sparkles className="size-3" />
                    </span>
                    <span>PREMIUM INSIGHTS</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Core Feature Pillars Grid matching screenshot */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 pt-2 pb-14">
              {/* Card 1: Industry Trends */}
              <motion.div
                whileHover={{ y: -4, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-7 backdrop-blur-xs transition-colors hover:border-primary/40 hover:shadow-lg dark:hover:shadow-primary/5 cursor-pointer"
              >
                <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <TrendingUp className="size-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Industry Trends
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Deep-dive teardowns of frontier models (GPT-4.5, Claude 3.7,
                  DeepSeek, Gemini 2.0), benchmark shifts, and open-source AI
                  breakthroughs.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-primary">
                  <span>Weekly Analysis</span>
                  <span>•</span>
                  <span>5-min Read</span>
                </div>
              </motion.div>

              {/* Card 2: Power Usage */}
              <motion.div
                whileHover={{ y: -4, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-7 backdrop-blur-xs transition-colors hover:border-primary/40 hover:shadow-lg dark:hover:shadow-primary/5 cursor-pointer"
              >
                <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Cpu className="size-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Power Usage
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  High-leverage prompt engineering frameworks, custom system
                  instruction blueprints, chained agent recipes, and productivity
                  workflows.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-primary">
                  <span>Playbooks & Recipes</span>
                  <span>•</span>
                  <span>Actionable</span>
                </div>
              </motion.div>

              {/* Card 3: Early Access */}
              <motion.div
                whileHover={{ y: -4, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-7 backdrop-blur-xs transition-colors hover:border-primary/40 hover:shadow-lg dark:hover:shadow-primary/5 cursor-pointer"
              >
                <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Zap className="size-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Early Access
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Priority beta invites to experimental EchoGPT studio capabilities,
                  new model integrations, and insider previews before public
                  rollouts.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-primary">
                  <span>VIP Perks</span>
                  <span>•</span>
                  <span>Product Roadmap</span>
                </div>
              </motion.div>
            </div>

            {/* Featured Recent Editions Archive */}
            <div className="border-t border-border/60 pt-12 pb-14">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Curated Archive
                  </div>
                  <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Recent Editions
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                  Sample what our 50,000+ subscribers received in recent weeks.
                </p>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    issue: "Issue #52",
                    date: "September 24, 2026",
                    title: "Reasoning Models at Scale: Architectures, Chain-of-Thought & Autonomous Loops",
                    readTime: "6 min read",
                    tag: "Deep Dive",
                    preview:
                      "How frontier test-time compute is changing code generation, mathematical analysis, and agentic workflows across production environments.",
                  },
                  {
                    issue: "Issue #51",
                    date: "September 17, 2026",
                    title: "The Million-Token Context Frontier: RAG vs Native Needle-in-a-Haystack",
                    readTime: "5 min read",
                    tag: "Architecture",
                    preview:
                      "Comparing vector retrieval pipelines against million-token in-context learning for enterprise codebases and complex regulatory documents.",
                  },
                  {
                    issue: "Issue #50",
                    date: "September 10, 2026",
                    title: "Building Deterministic Agents with Prompt Chaining and Structured Outputs",
                    readTime: "4 min read",
                    tag: "Tutorial",
                    preview:
                      "Step-by-step blueprint for building reliable multi-step workflows that do not hallucinate, complete with production-ready schemas.",
                  },
                ].map((item) => (
                  <div
                    key={item.issue}
                    className="group rounded-2xl border border-border/70 bg-card/50 p-5 sm:p-6 backdrop-blur-xs transition-all hover:border-primary/50 hover:bg-card/90"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary">{item.issue}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium text-[11px]">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="font-heading text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {item.preview}
                    </p>
                    <div className="mt-3.5 flex items-center justify-between border-t border-border/40 pt-3 text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {item.readTime}
                      </span>
                      <span className="font-medium text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Read summary <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Banner */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-purple-500/5 p-6 sm:p-8 backdrop-blur-xs mb-14">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400" />
                ))}
              </div>
              <blockquote className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
                &ldquo;EchoGPT Insights is one of the only AI newsletters I read
                from start to finish every week. The prompt engineering recipes
                alone have saved our engineering team dozens of hours every
                sprint.&rdquo;
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                <div className="size-9 rounded-full bg-purple-600/20 text-purple-600 dark:text-purple-300 font-semibold flex items-center justify-center text-xs">
                  JD
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    Julian Duarte
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    VP of Engineering, Apex Systems
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter FAQs */}
            <div className="border-t border-border/60 pt-12 pb-16">
              <div className="text-center sm:text-left mb-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Got Questions?
                </div>
                <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Frequently Asked Questions
                </h2>
              </div>

              <Accordion type="single" collapsible className="space-y-3">
                <AccordionItem
                  value="frequency"
                  className="rounded-xl border border-border/70 bg-card/40 px-4"
                >
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
                    When is the newsletter delivered?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    We deliver one thoughtfully curated issue every Tuesday morning at
                    8:00 AM EST. On rare occasions when a monumental frontier model
                    breaks, we may send a breaking bulletin.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="cost"
                  className="rounded-xl border border-border/70 bg-card/40 px-4"
                >
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
                    Is the newsletter completely free?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    Yes. The weekly insights newsletter is 100% free for all AI
                    practitioners, engineers, and creators. There are no paywalls or
                    hidden fees.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="spam"
                  className="rounded-xl border border-border/70 bg-card/40 px-4"
                >
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
                    Will you ever sell or share my email?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    Never. We strictly adhere to our zero-spam policy. Your email is
                    only used to deliver the EchoGPT weekly newsletter, and you can
                    unsubscribe at any moment with a single click.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="team"
                  className="rounded-xl border border-border/70 bg-card/40 px-4"
                >
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
                    Can I sign up my entire organization?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    Absolutely. Hundreds of teams use our briefings for internal AI
                    enablement. You can subscribe with your work email or contact our
                    team to set up a group subscription distribution.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
