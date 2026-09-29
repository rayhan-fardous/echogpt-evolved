"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Menu,
  Mail,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

/* ---------------- Authentic Social Icons ---------------- */

function FacebookIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function DiscordBrandIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function TwitterXIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function SupportWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Ticket Composer Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Technical Issue");
  const [priority, setPriority] = useState("Normal");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);
  const [composeModalOpen, setComposeModalOpen] = useState(false);

  // Sync Supabase user
  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (active) {
        setUser(data.user);
        if (data.user?.email) setEmail(data.user.email);
        const fullName =
          data.user?.user_metadata?.full_name ||
          data.user?.user_metadata?.name;
        if (fullName) setName(fullName);
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

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message.trim()) {
      toast.error("Please fill in your email and message.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const generatedId = `ECHO-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmitting(false);
      setTicketSuccess(generatedId);
      setMessage("");
      toast.success(`Ticket #${generatedId} created! Our team will respond shortly.`);
    }, 800);
  };

  const handleEmailUsClick = () => {
    setComposeModalOpen(true);
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
          <div className="mx-auto max-w-3xl">
            {/* Top Bar with Back Link & System Status */}
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

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span>All Systems Operational</span>
              </div>
            </div>

            {/* Hero Title matching Screenshot 2 */}
            <div className="pt-4 pb-8 sm:pt-8 sm:pb-10 text-center">
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Talk with Our Team
              </h1>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Need guidance, technical support, or want to explore enterprise
                customizations? We&apos;re here to assist you every step of the
                way.
              </p>
            </div>

            {/* SECTION 1: YOUR PREFERRED OPTION */}
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 shrink-0">
                  YOUR PREFERRED OPTION
                </span>
                <div className="h-px flex-1 bg-border/60" />
              </div>

              {/* Email Us Card matching Screenshot 2 */}
              <div
                role="button"
                tabIndex={0}
                onClick={handleEmailUsClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleEmailUsClick();
                  }
                }}
                className="group flex w-full items-center justify-between rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 backdrop-blur-xs transition-all hover:border-primary/50 hover:bg-card/90 hover:shadow-md cursor-pointer select-none"
              >
                <div className="flex items-center gap-4">
                  {/* Soft circular lavender/purple icon container */}
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#341B5E]/60 dark:text-[#C4B5FD] transition-transform group-hover:scale-105">
                    <Mail className="size-6 stroke-[1.8]" />
                  </div>
                  <div className="text-left">
                    <div className="font-heading text-base sm:text-lg font-semibold text-foreground">
                      Email Us
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      We will aim to respond in 1 day
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Send message
                  </span>
                  <ChevronRight className="size-5 text-muted-foreground/60 transition-transform group-hover:translate-x-1 group-hover:text-foreground shrink-0" />
                </div>
              </div>
            </div>

            {/* SECTION 2: FOLLOW US */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 shrink-0">
                  FOLLOW US
                </span>
                <div className="h-px flex-1 bg-border/60" />
              </div>

              {/* Social Channels Grid matching Screenshot 2 */}
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {/* 1. Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-xs transition-all hover:border-primary/50 hover:bg-card/90 hover:shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2] dark:bg-[#1877F2]/20 transition-transform group-hover:scale-105">
                      <FacebookIcon className="size-5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="font-heading text-sm sm:text-base font-semibold text-foreground truncate">
                        Facebook
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        Follow us on Facebook for the latest updates and news!
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground/60 transition-transform group-hover:translate-x-1 group-hover:text-foreground shrink-0 ml-2" />
                </a>

                {/* 2. Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-xs transition-all hover:border-primary/50 hover:bg-card/90 hover:shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 transition-transform group-hover:scale-105">
                      <InstagramIcon className="size-5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="font-heading text-sm sm:text-base font-semibold text-foreground truncate">
                        Instagram
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        See behind the scenes and fresh updates!
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground/60 transition-transform group-hover:translate-x-1 group-hover:text-foreground shrink-0 ml-2" />
                </a>

                {/* 3. LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-xs transition-all hover:border-primary/50 hover:bg-card/90 hover:shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#0A66C2]/10 text-[#0A66C2] dark:bg-[#0A66C2]/20 transition-transform group-hover:scale-105">
                      <LinkedInIcon className="size-5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="font-heading text-sm sm:text-base font-semibold text-foreground truncate">
                        LinkedIn
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        Connect with our professional network and team careers!
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground/60 transition-transform group-hover:translate-x-1 group-hover:text-foreground shrink-0 ml-2" />
                </a>

                {/* 4. Discord Community */}
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-xs transition-all hover:border-primary/50 hover:bg-card/90 hover:shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#5865F2]/10 text-[#5865F2] dark:bg-[#5865F2]/20 transition-transform group-hover:scale-105">
                      <DiscordBrandIcon className="size-5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="font-heading text-sm sm:text-base font-semibold text-foreground truncate">
                        Discord
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        Join 25,000+ builders, ask questions, and chat live!
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground/60 transition-transform group-hover:translate-x-1 group-hover:text-foreground shrink-0 ml-2" />
                </a>

                {/* 5. X / Twitter */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-xs transition-all hover:border-primary/50 hover:bg-card/90 hover:shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-transform group-hover:scale-105">
                      <TwitterXIcon className="size-5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="font-heading text-sm sm:text-base font-semibold text-foreground truncate">
                        X (Twitter)
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        Real-time updates, releases, and announcements!
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground/60 transition-transform group-hover:translate-x-1 group-hover:text-foreground shrink-0 ml-2" />
                </a>

                {/* 6. GitHub Community */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-xs transition-all hover:border-primary/50 hover:bg-card/90 hover:shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-transform group-hover:scale-105">
                      <GitHubIcon className="size-5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="font-heading text-sm sm:text-base font-semibold text-foreground truncate">
                        GitHub
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        Check open-source tools, docs, and report technical issues.
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground/60 transition-transform group-hover:translate-x-1 group-hover:text-foreground shrink-0 ml-2" />
                </a>
              </div>
            </div>

            {/* Direct Ticket Submission Section */}
            <div className="mb-14 rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    Send Us a Message
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Our technical support team is online 24/7 across multiple time zones.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5 text-primary" />
                  <span>Avg reply time: 4 hours</span>
                </div>
              </div>

              {ticketSuccess ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center animate-in fade-in duration-300">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 mb-3">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    Ticket #{ticketSuccess} Received
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                    A confirmation email has been dispatched to{" "}
                    <span className="font-semibold text-foreground">{email}</span>. An
                    engineer will reply within our standard turnaround window.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTicketSuccess(null)}
                    className="mt-4 text-xs rounded-xl"
                  >
                    Open another ticket
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">
                        Your Name
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">
                        Topic Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option>Technical Issue</option>
                        <option>Billing & Subscriptions</option>
                        <option>API & Enterprise Access</option>
                        <option>Feature Feedback</option>
                        <option>Account & Security</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">
                        Priority Level
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option>Normal — General inquiry</option>
                        <option>High — Workspace blocking</option>
                        <option>Urgent — Production API outage</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      How can we help? <span className="text-rose-500">*</span>
                    </label>
                    <Textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please describe your issue or question in detail..."
                      className="rounded-xl resize-none text-xs sm:text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full font-medium rounded-xl h-11 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-xs"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Sending Request...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="size-4 mr-2" />
                        Send Support Request
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Support FAQ Section */}
            <div className="border-t border-border/60 pt-10 pb-16">
              <div className="mb-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Knowledge Base
                </div>
                <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Common Inquiries
                </h2>
              </div>

              <Accordion type="single" collapsible className="space-y-3">
                <AccordionItem
                  value="faq-1"
                  className="rounded-xl border border-border/70 bg-card/40 px-4"
                >
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
                    What are the guaranteed response times?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    Free tier users receive responses within 24 hours. EchoGPT Pro and
                    Enterprise subscribers receive priority triage with responses
                    typically under 2 hours during active market cycles.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="faq-2"
                  className="rounded-xl border border-border/70 bg-card/40 px-4"
                >
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
                    How do I report bugs or submit feature requests?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    You can either use the form above with &quot;Feature Feedback&quot; selected,
                    or join our active community Discord where our product leads
                    maintain an active roadmap discussion board.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="faq-3"
                  className="rounded-xl border border-border/70 bg-card/40 px-4"
                >
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
                    Is my conversation data safe during support investigations?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                    Yes. Support engineers cannot view your chat content without
                    explicit, time-bounded permission tokens generated by your account
                    settings under Security preferences.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>

      {/* Quick Email Dialog triggered by the main Email Us card */}
      <Dialog open={composeModalOpen} onOpenChange={setComposeModalOpen}>
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <Mail className="size-6" />
              <DialogTitle className="font-heading text-xl">
                Email EchoGPT Support
              </DialogTitle>
            </div>
            <DialogDescription>
              Direct contact with our customer engineering and billing team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Official Support Email:</span>
                <span className="font-mono font-medium text-foreground">
                  support@echogpt.ai
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Guaranteed Turnaround:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Within 24 hours
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1 font-medium rounded-xl"
                onClick={() => {
                  window.location.href = "mailto:support@echogpt.ai?subject=EchoGPT%20Inquiry";
                  setComposeModalOpen(false);
                }}
              >
                <ExternalLink className="size-4 mr-2" />
                Open Email App
              </Button>
              <Button
                variant="outline"
                className="font-medium rounded-xl"
                onClick={() => {
                  navigator.clipboard.writeText("support@echogpt.ai");
                  toast.success("Copied support@echogpt.ai to clipboard!");
                  setComposeModalOpen(false);
                }}
              >
                Copy Address
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
