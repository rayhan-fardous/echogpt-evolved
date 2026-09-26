"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  ExternalLink,
  Plus,
  SquarePen,
  Search,
  Settings,
  Sun,
  Moon,
  Check,
  Sparkles,
  ChevronDown,
  ChevronRight,
  LogOut,
  FolderOpen,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BrandMark } from "./brand-mark";
import { supabase } from "@/integrations/supabase/client";
import avatar from "@/assets/profile-avatar.jpg";

export type ThreadSummary = { id: string; title: string; updated_at: string };

/* ---------------- Custom SVGs matching the user screenshots exactly ---------------- */

function ImageStudioIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function VideoStudioIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="3.5" />
      <path d="M2.5 8.5h19" />
      <path d="m6 4.5 2 4" />
      <path d="m11 4.5 2 4" />
      <path d="m16 4.5 2 4" />
      <polygon points="10 11.5 15 14 10 16.5 10 11.5" fill="none" />
    </svg>
  );
}

function CompareIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <line x1="8" y1="10" x2="16" y2="10" strokeLinecap="round" />
      <line x1="8" y1="14" x2="16" y2="14" strokeLinecap="round" />
    </svg>
  );
}

function ConnectorsIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="18" cy="5.5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.5" r="2.5" />
      <path d="m8.5 10.7 7-3.7" />
      <path d="m8.5 13.3 7 3.7" />
    </svg>
  );
}

function HistoryBubbleIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.4 0-2.8-.3-4-1l-4.5 1.5 1.5-4.5A8.5 8.5 0 1 1 21 11.5z" />
    </svg>
  );
}

function BasketIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3.5 11h17a1 1 0 0 1 1 1.2l-1.6 7.5A2 2 0 0 1 18 21.5H6a2 2 0 0 1-1.9-1.8L2.5 12.2A1 1 0 0 1 3.5 11z" />
      <path d="m7.5 11 3.5-7.5" strokeLinecap="round" />
      <path d="m16.5 11-3.5-7.5" strokeLinecap="round" />
      <line x1="8.5" y1="14" x2="8.5" y2="18.5" strokeLinecap="round" />
      <line x1="12" y1="14" x2="12" y2="18.5" strokeLinecap="round" />
      <line x1="15.5" y1="14" x2="15.5" y2="18.5" strokeLinecap="round" />
    </svg>
  );
}

function TasksGridIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </svg>
  );
}

function JobAnalysisIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="14" y2="13" strokeLinecap="round" />
      <line x1="8" y1="17" x2="12" y2="17" strokeLinecap="round" />
    </svg>
  );
}

function SopBuilderIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <line x1="8" y1="10" x2="16" y2="10" strokeLinecap="round" />
      <line x1="8" y1="14" x2="16" y2="14" strokeLinecap="round" />
    </svg>
  );
}

function SupportChatIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="4" width="18" height="15" rx="4.5" />
      <line x1="7.5" y1="9.5" x2="16.5" y2="9.5" strokeLinecap="round" />
      <line x1="7.5" y1="13.5" x2="13.5" y2="13.5" strokeLinecap="round" />
    </svg>
  );
}

function NewsletterIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="5" width="18" height="14" rx="3.5" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SubscriptionsIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 3.5h12l4 6.5-10 10.5L2 10l4-6.5z" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function ApiPlatformIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 7.5 17 10v4.5l-5 2.8-5-2.8V10l5-2.5z" />
      <path d="M12 7.5v7.3" />
      <path d="m12 14.8 5-2.5" />
      <path d="m12 14.8-5-2.5" />
      <circle cx="12" cy="3" r="1.5" />
      <circle cx="20.5" cy="16.5" r="1.5" />
      <circle cx="3.5" cy="16.5" r="1.5" />
      <path d="M14.5 4a8 8 0 0 1 5 9.5" strokeDasharray="2 2" strokeWidth="1.3" />
      <path d="M18 18.5a8 8 0 0 1-12 0" strokeDasharray="2 2" strokeWidth="1.3" />
      <path d="M4.5 13.5A8 8 0 0 1 9.5 4" strokeDasharray="2 2" strokeWidth="1.3" />
    </svg>
  );
}

function DiscordIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`text-[#5865F2] ${className}`}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function HomeIconCustom({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3 3 10.5V20a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V10.5L12 3z" />
      <path d="M9 21v-6a3 3 0 0 1 6 0v6" />
    </svg>
  );
}

function HubIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M12 8.5v3.5" />
      <path d="m12 12-4.5 4" />
      <path d="m12 12 4.5 4" />
    </svg>
  );
}

/* ---------------- Main SidebarNav Component ---------------- */

export function SidebarNav({
  threads,
  user,
  onSelect,
  onClose,
  currentThreadId,
}: {
  threads: ThreadSummary[];
  user: User | null;
  onSelect?: () => void;
  onClose?: () => void;
  currentThreadId?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const filteredThreads = search.trim()
    ? threads.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()),
      )
    : threads;

  return (
    <aside className="glass-panel flex h-full flex-col border-r border-border bg-[#FBFBFE]/90 dark:bg-[#120F1D]/90 select-none">
      {/* Top App Header with brand mark and cross close button for smaller screens */}
      <div className="flex h-16 items-center justify-between px-4 sm:px-5">
        <button
          onClick={() => {
            router.push("/");
            onSelect?.();
            onClose?.();
          }}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-85 text-left"
        >
          <BrandMark className="size-8" />
          <span className="font-heading text-lg font-semibold tracking-tight">
            EchoGPT
          </span>
        </button>

        {/* Cross button on the top to close the sidebar */}
        <button
          type="button"
          aria-label="Close sidebar"
          title="Close sidebar"
          onClick={() => {
            onClose?.();
            onSelect?.();
          }}
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08] lg:hidden"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* New Chat button */}
      <div className="px-3.5 pb-2.5">
        <Button
          className="h-10 w-full justify-start gap-2.5 rounded-xl font-medium shadow-sm transition-all"
          onClick={() => {
            router.push(`/chat/${crypto.randomUUID()}`);
            onSelect?.();
            onClose?.();
          }}
        >
          <SquarePen className="size-4" />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="px-3.5 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
          <Input
            aria-label="Search conversations"
            placeholder="Search conversations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-xl bg-background/60 pl-9 text-xs transition-colors focus-visible:bg-background"
          />
        </div>
      </div>

      {/* Main Scrollable Navigation Area */}
      <nav
        aria-label="Sidebar navigation"
        className="flex-1 overflow-y-auto px-2.5 py-1 scrollbar-thin scrollbar-thumb-border/40 hover:scrollbar-thumb-border/80"
      >
        {/* Section 1: ENGAGEMENT */}
        <div className="mb-2">
          <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Engagement
          </p>

          <ul className="space-y-0.5">
            {/* 1. Image Studio */}
            <li>
              <button
                type="button"
                onClick={() => setActiveModal("image-studio")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
              >
                <ImageStudioIcon className="size-5 text-muted-foreground/90 transition-colors group-hover:text-foreground shrink-0" />
                <span className="truncate">Image Studio</span>
                <span className="ml-auto rounded-md bg-[#EDE9FE] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#7C3AED] dark:bg-[#341B5E]/70 dark:text-[#C4B5FD]">
                  PRO
                </span>
              </button>
            </li>

            {/* 2. Video Studio */}
            <li>
              <button
                type="button"
                onClick={() => setActiveModal("video-studio")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
              >
                <VideoStudioIcon className="size-5 text-muted-foreground/90 transition-colors group-hover:text-foreground shrink-0" />
                <span className="truncate">Video Studio</span>
                <span className="ml-auto rounded-md bg-[#EDE9FE] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#7C3AED] dark:bg-[#341B5E]/70 dark:text-[#C4B5FD]">
                  PRO
                </span>
              </button>
            </li>

            {/* 3. Compare */}
            <li>
              <button
                type="button"
                onClick={() => setActiveModal("compare")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
              >
                <CompareIcon className="size-5 text-muted-foreground/90 transition-colors group-hover:text-foreground shrink-0" />
                <span className="truncate">Compare</span>
              </button>
            </li>

            {/* 4. Connectors */}
            <li>
              <button
                type="button"
                onClick={() => setActiveModal("connectors")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
              >
                <ConnectorsIcon className="size-5 text-muted-foreground/90 transition-colors group-hover:text-foreground shrink-0" />
                <span className="truncate">Connectors</span>
              </button>
            </li>

            {/* 5. History (with inline accordion & chat threads) */}
            <li>
              <button
                type="button"
                onClick={() => setHistoryOpen(!historyOpen)}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
              >
                <HistoryBubbleIcon className="size-5 text-muted-foreground/90 transition-colors group-hover:text-foreground shrink-0" />
                <span className="truncate">History</span>
                {filteredThreads.length > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground/70">
                    {historyOpen ? (
                      <ChevronDown className="size-4" />
                    ) : (
                      <ChevronRight className="size-4" />
                    )}
                  </span>
                )}
              </button>

              {/* Collapsible Threads List */}
              {historyOpen && (
                <div className="my-1 space-y-0.5 pl-5 pr-1 border-l-2 border-border/40 ml-4">
                  {filteredThreads.length === 0 ? (
                    <div className="px-2 py-2 text-xs text-muted-foreground">
                      {user
                        ? "No conversations yet."
                        : "Sign in to sync history."}
                    </div>
                  ) : (
                    filteredThreads.map((thread) => {
                      const isActive = thread.id === currentThreadId;
                      return (
                        <button
                          key={thread.id}
                          onClick={() => {
                            router.push(`/chat/${thread.id}`);
                            onSelect?.();
                          }}
                          className={`flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors ${
                            isActive
                              ? "bg-accent font-semibold text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                          }`}
                        >
                          <span className="truncate">{thread.title}</span>
                          <span className="shrink-0 text-[10px] opacity-70">
                            {new Date(thread.updated_at).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </li>

            {/* 6. Store */}
            <li>
              <button
                type="button"
                onClick={() => setActiveModal("store")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
              >
                <BasketIcon className="size-5 text-muted-foreground/90 transition-colors group-hover:text-foreground shrink-0" />
                <span className="truncate">Store</span>
              </button>
            </li>

            {/* 7. AI Tasks */}
            <li>
              <button
                type="button"
                onClick={() => setActiveModal("ai-tasks")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
              >
                <TasksGridIcon className="size-5 text-muted-foreground/90 transition-colors group-hover:text-foreground shrink-0" />
                <span className="truncate">AI Tasks</span>
              </button>
            </li>

            {/* 8. AI Job Analysis */}
            <li>
              <button
                type="button"
                onClick={() => setActiveModal("job-analysis")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
              >
                <JobAnalysisIcon className="size-5 text-muted-foreground/90 transition-colors group-hover:text-foreground shrink-0" />
                <span className="truncate">AI Job Analysis</span>
              </button>
            </li>

            {/* 9. AI SOP Builder */}
            <li>
              <button
                type="button"
                onClick={() => setActiveModal("sop-builder")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
              >
                <SopBuilderIcon className="size-5 text-muted-foreground/90 transition-colors group-hover:text-foreground shrink-0" />
                <span className="truncate">AI SOP Builder</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Divider above HELP & SUPPORT */}
        <div className="my-2 mx-1 border-t border-border/60" />

        {/* Section 2: HELP & SUPPORT */}
        <div className="mb-2">
          <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Help & Support
          </p>

          <ul className="space-y-0.5">
            {/* 1. Support */}
            <li>
              <button
                type="button"
                onClick={() => setActiveModal("support")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
              >
                <SupportChatIcon className="size-5 text-muted-foreground/90 transition-colors group-hover:text-foreground shrink-0" />
                <span className="truncate">Support</span>
              </button>
            </li>

            {/* 2. Newsletter */}
            <li>
              <button
                type="button"
                onClick={() => setActiveModal("newsletter")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
              >
                <NewsletterIcon className="size-5 text-muted-foreground/90 transition-colors group-hover:text-foreground shrink-0" />
                <span className="truncate">Newsletter</span>
              </button>
            </li>

            {/* 3. Subscriptions */}
            <li>
              <button
                type="button"
                onClick={() => setActiveModal("subscriptions")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
              >
                <SubscriptionsIcon className="size-5 text-muted-foreground/90 transition-colors group-hover:text-foreground shrink-0" />
                <span className="truncate">Subscriptions</span>
              </button>
            </li>

            {/* 4. API Platform */}
            <li>
              <button
                type="button"
                onClick={() => setActiveModal("api-platform")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
              >
                <ApiPlatformIcon className="size-5 text-muted-foreground/90 transition-colors group-hover:text-foreground shrink-0" />
                <span className="truncate">API Platform</span>
              </button>
            </li>

            {/* 5. Discord */}
            <li>
              <button
                type="button"
                onClick={() => setActiveModal("discord")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
              >
                <DiscordIcon className="size-5 shrink-0" />
                <span className="truncate">Discord</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Bottom Dock / Footer: 4 action icons evenly distributed */}
      <div className="mt-auto flex items-center justify-around border-t border-border/60 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] bg-background/50 backdrop-blur-sm">
        {/* Home */}
        <button
          type="button"
          aria-label="Home"
          title="Home"
          onClick={() => {
            router.push("/");
            onSelect?.();
          }}
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground/90 transition-colors hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]"
        >
          <HomeIconCustom className="size-5" />
        </button>

        {/* Hub / Connectors */}
        <button
          type="button"
          aria-label="Connectors Hub"
          title="Connectors Hub"
          onClick={() => setActiveModal("connectors")}
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground/90 transition-colors hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]"
        >
          <HubIcon className="size-5" />
        </button>

        {/* Settings / Account */}
        <button
          type="button"
          aria-label="Settings"
          title="Settings"
          onClick={() => setActiveModal("settings")}
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground/90 transition-colors hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]"
        >
          <Settings className="size-5" />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          aria-label="Toggle theme"
          title={dark ? "Light mode" : "Dark mode"}
          onClick={toggleDark}
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground/90 transition-colors hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]"
        >
          {dark ? <Moon className="size-5" /> : <Sun className="size-5" />}
        </button>
      </div>

      {/* ---------------- Modals for all options ---------------- */}

      {/* Image Studio Modal */}
      <Dialog
        open={activeModal === "image-studio"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <ImageStudioIcon className="size-6" />
              <DialogTitle className="font-heading text-xl">
                Image Studio
              </DialogTitle>
              <span className="ml-auto rounded-md bg-[#EDE9FE] px-2 py-0.5 text-[10px] font-bold text-[#7C3AED] dark:bg-[#341B5E]/70 dark:text-[#C4B5FD]">
                PRO
              </span>
            </div>
            <DialogDescription>
              Create photorealistic visuals, artwork, and marketing assets
              powered by Flux and Imagen 3.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Prompt
              </label>
              <Input
                placeholder="A futuristic cyberpunk workspace with soft violet lighting..."
                defaultValue="A modern minimalist workspace with ambient neon glow"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg border border-border/80 bg-accent/40 p-2.5 text-center font-medium">
                1:1 Square
              </div>
              <div className="rounded-lg border border-border/80 bg-background/50 p-2.5 text-center text-muted-foreground">
                16:9 Landscape
              </div>
              <div className="rounded-lg border border-border/80 bg-background/50 p-2.5 text-center text-muted-foreground">
                9:16 Portrait
              </div>
            </div>
            <Button
              className="w-full font-medium"
              onClick={() => setActiveModal(null)}
            >
              <Sparkles className="size-4 mr-2" />
              Generate Image (PRO)
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Studio Modal */}
      <Dialog
        open={activeModal === "video-studio"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <VideoStudioIcon className="size-6" />
              <DialogTitle className="font-heading text-xl">
                Video Studio
              </DialogTitle>
              <span className="ml-auto rounded-md bg-[#EDE9FE] px-2 py-0.5 text-[10px] font-bold text-[#7C3AED] dark:bg-[#341B5E]/70 dark:text-[#C4B5FD]">
                PRO
              </span>
            </div>
            <DialogDescription>
              Turn text prompts and still imagery into cinematic 4K video clips
              with Sora & Runway Gen-3.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 text-xs leading-relaxed text-foreground">
              ⚡ High-speed rendering available with EchoGPT Pro. Generate up to
              60 seconds of HD video per scene.
            </div>
            <Input placeholder="Describe the scene and camera motion..." />
            <Button
              className="w-full font-medium"
              onClick={() => setActiveModal(null)}
            >
              Generate Clip with AI
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Compare Modal */}
      <Dialog
        open={activeModal === "compare"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="glass-panel sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <CompareIcon className="size-6" />
              <DialogTitle className="font-heading text-xl">
                Compare AI Models
              </DialogTitle>
            </div>
            <DialogDescription>
              Benchmark responses across top frontier models side-by-side with
              a single query.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="rounded-xl border border-border/80 bg-background/50 p-3.5 space-y-2">
              <div className="font-semibold text-foreground">Model A</div>
              <div className="text-muted-foreground font-mono">
                GPT-4o (Omni)
              </div>
              <p className="text-[11px] text-muted-foreground/80">
                Optimized for code generation, mathematical analysis and
                reasoning.
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-background/50 p-3.5 space-y-2">
              <div className="font-semibold text-foreground">Model B</div>
              <div className="text-muted-foreground font-mono">
                Claude 3.5 Sonnet
              </div>
              <p className="text-[11px] text-muted-foreground/80">
                Excels in creative nuance, writing eloquence, and deep
                synthesizing.
              </p>
            </div>
          </div>
          <Button
            className="w-full mt-2 font-medium"
            onClick={() => setActiveModal(null)}
          >
            Start Dual Comparison Chat
          </Button>
        </DialogContent>
      </Dialog>

      {/* Connectors Modal */}
      <Dialog
        open={activeModal === "connectors"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <ConnectorsIcon className="size-6" />
              <DialogTitle className="font-heading text-xl">
                Connectors & Integrations
              </DialogTitle>
            </div>
            <DialogDescription>
              Sync data sources directly into your EchoGPT workspace for
              context-aware reasoning.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2.5 pt-2">
            {[
              { name: "Google Drive", desc: "Docs, Sheets & Slides", connected: true },
              { name: "GitHub", desc: "Repositories & Pull Requests", connected: false },
              { name: "Notion", desc: "Workspaces and databases", connected: false },
              { name: "Slack", desc: "Channels and message threads", connected: false },
            ].map((conn) => (
              <div
                key={conn.name}
                className="flex items-center justify-between rounded-xl border border-border/70 bg-background/50 p-3 text-xs"
              >
                <div>
                  <div className="font-medium text-foreground">{conn.name}</div>
                  <div className="text-muted-foreground">{conn.desc}</div>
                </div>
                <Button
                  size="sm"
                  variant={conn.connected ? "outline" : "default"}
                  className="h-8 text-xs font-medium"
                >
                  {conn.connected ? "Connected" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Store Modal */}
      <Dialog
        open={activeModal === "store"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <BasketIcon className="size-6" />
              <DialogTitle className="font-heading text-xl">
                EchoGPT Store
              </DialogTitle>
            </div>
            <DialogDescription>
              Explore community prompt recipes, specialized agents, and custom
              tools.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2.5 pt-2 text-xs">
            {[
              { title: "Full-Stack Architect", downloads: "14.2k", author: "Echo Team" },
              { title: "SEO Content Strategist", downloads: "9.8k", author: "Appify" },
              { title: "Financial Analyst & Forecaster", downloads: "7.1k", author: "Echo Team" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-xl border border-border/70 bg-background/50 p-3"
              >
                <div>
                  <div className="font-medium text-foreground">{item.title}</div>
                  <div className="text-muted-foreground">
                    by {item.author} • {item.downloads} installs
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  Install
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Tasks Modal */}
      <Dialog
        open={activeModal === "ai-tasks"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <TasksGridIcon className="size-6" />
              <DialogTitle className="font-heading text-xl">
                AI Tasks & Automations
              </DialogTitle>
            </div>
            <DialogDescription>
              Run scheduled autonomous tasks, data pipelines, and batch
              synthesizing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-2 text-xs">
            {[
              "Automated Weekly Research Briefing",
              "Customer Feedback Sentiment Aggregation",
              "Daily Competitor Pricing Scan",
              "Repository Code Quality Audit",
            ].map((task) => (
              <div
                key={task}
                className="flex items-center justify-between rounded-lg border border-border/70 bg-background/50 p-2.5"
              >
                <span className="font-medium text-foreground">{task}</span>
                <span className="text-[10px] text-muted-foreground font-mono bg-accent/60 px-2 py-0.5 rounded">
                  Ready
                </span>
              </div>
            ))}
            <Button
              className="w-full mt-2 font-medium"
              onClick={() => setActiveModal(null)}
            >
              <Plus className="size-4 mr-1.5" />
              Create New Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Job Analysis Modal */}
      <Dialog
        open={activeModal === "job-analysis"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <JobAnalysisIcon className="size-6" />
              <DialogTitle className="font-heading text-xl">
                AI Job Analysis
              </DialogTitle>
            </div>
            <DialogDescription>
              Match resumes against job descriptions, generate gap analysis,
              and craft tailored application materials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs">
            <Input placeholder="Paste Job Description URL or text..." />
            <div className="rounded-lg border-2 border-dashed border-border/80 p-5 text-center text-muted-foreground">
              Drop resume PDF or DOCX here to analyze fit score
            </div>
            <Button
              className="w-full font-medium"
              onClick={() => setActiveModal(null)}
            >
              Analyze Job Fit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI SOP Builder Modal */}
      <Dialog
        open={activeModal === "sop-builder"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <SopBuilderIcon className="size-6" />
              <DialogTitle className="font-heading text-xl">
                AI SOP Builder
              </DialogTitle>
            </div>
            <DialogDescription>
              Build comprehensive, audit-ready Standard Operating Procedures in
              seconds.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">
                Process Title
              </label>
              <Input placeholder="e.g., Incident Response Protocol, Employee Onboarding..." />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">
                Target Audience / Role
              </label>
              <Input placeholder="e.g., DevOps Engineers, Support Specialists" />
            </div>
            <Button
              className="w-full font-medium"
              onClick={() => setActiveModal(null)}
            >
              Generate Structured SOP
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Support Modal */}
      <Dialog
        open={activeModal === "support"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <SupportChatIcon className="size-6" />
              <DialogTitle className="font-heading text-xl">
                Help & Support Center
              </DialogTitle>
            </div>
            <DialogDescription>
              Find answers to common questions or reach out to our dedicated
              engineering team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs">
            <div className="rounded-lg border border-border/80 bg-background/50 p-3 space-y-1">
              <div className="font-semibold text-foreground">Documentation</div>
              <div className="text-muted-foreground">
                Guides, tutorials, and API endpoints for EchoGPT.
              </div>
            </div>
            <div className="rounded-lg border border-border/80 bg-background/50 p-3 space-y-1">
              <div className="font-semibold text-foreground">Priority Email</div>
              <div className="text-muted-foreground">support@echogpt.ai</div>
            </div>
            <Button
              className="w-full font-medium"
              onClick={() => setActiveModal(null)}
            >
              Open Ticket
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Newsletter Modal */}
      <Dialog
        open={activeModal === "newsletter"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <NewsletterIcon className="size-6" />
              <DialogTitle className="font-heading text-xl">
                EchoGPT Newsletter
              </DialogTitle>
            </div>
            <DialogDescription>
              Get weekly updates on frontier AI models, prompt engineering, and
              product features.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs">
            <Input
              type="email"
              placeholder="you@example.com"
              defaultValue={user?.email || ""}
            />
            <Button
              className="w-full font-medium"
              onClick={() => setActiveModal(null)}
            >
              Subscribe to Weekly Digest
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscriptions Modal */}
      <Dialog
        open={activeModal === "subscriptions"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <SubscriptionsIcon className="size-6" />
              <DialogTitle className="font-heading text-xl">
                EchoGPT Subscriptions
              </DialogTitle>
            </div>
            <DialogDescription>
              Unlock higher rate limits, Image & Video Studio, and priority frontier
              models.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs">
            <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-heading text-base font-semibold text-foreground">
                  Pro Plan
                </span>
                <span className="font-mono text-base font-bold text-primary">
                  $20<span className="text-xs font-normal text-muted-foreground">/mo</span>
                </span>
              </div>
              <ul className="space-y-1.5 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary shrink-0" />
                  Unlimited Claude 3.5 Sonnet & GPT-4o
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary shrink-0" />
                  Access to Image Studio & Video Studio PRO
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary shrink-0" />
                  Priority API bandwidth & higher context window
                </li>
              </ul>
            </div>
            <Button
              className="w-full font-medium"
              onClick={() => setActiveModal(null)}
            >
              Upgrade to Pro
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* API Platform Modal */}
      <Dialog
        open={activeModal === "api-platform"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <ApiPlatformIcon className="size-6" />
              <DialogTitle className="font-heading text-xl">
                EchoGPT API Platform
              </DialogTitle>
            </div>
            <DialogDescription>
              Build with unified access to all AI models through OpenAI-compatible
              REST endpoints.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs font-mono">
            <div className="rounded-lg bg-black/80 dark:bg-black/90 p-3 text-[11px] text-emerald-400 overflow-x-auto">
              curl https://api.echogpt.ai/v1/chat/completions \<br />
              &nbsp;&nbsp;-H &quot;Authorization: Bearer echo_live_...&quot;
            </div>
            <Button
              className="w-full font-sans font-medium"
              onClick={() => setActiveModal(null)}
            >
              Generate New API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Discord Modal */}
      <Dialog
        open={activeModal === "discord"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DiscordIcon className="size-6" />
              <DialogTitle className="font-heading text-xl">
                Join our Discord Community
              </DialogTitle>
            </div>
            <DialogDescription>
              Connect with 25,000+ builders, prompt engineers, and AI developers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs">
            <p className="text-muted-foreground">
              Share prompts, get community support, and test beta features before
              public release.
            </p>
            <Button
              className="w-full font-medium bg-[#5865F2] hover:bg-[#4752C4] text-white"
              onClick={() => {
                window.open("https://discord.com", "_blank");
                setActiveModal(null);
              }}
            >
              <ExternalLink className="size-4 mr-2" />
              Open Discord Server
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog
        open={activeModal === "settings"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <Settings className="size-6" />
              <DialogTitle className="font-heading text-xl">
                Settings & Preferences
              </DialogTitle>
            </div>
            <DialogDescription>
              Manage your profile, theme, and workspace preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3.5 pt-2 text-xs">
            {user && (
              <div className="flex items-center gap-3 rounded-lg border border-border/80 bg-background/50 p-3">
                <img
                  src={
                    typeof avatar === "string"
                      ? avatar
                      : (avatar as { src?: string })?.src ||
                        "/profile-avatar.jpg"
                  }
                  alt="Avatar"
                  className="size-10 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-foreground">
                    {user.user_metadata["full_name"] ??
                      user.email?.split("@")[0] ??
                      "Your Profile"}
                  </div>
                  <div className="truncate text-muted-foreground">{user.email}</div>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between rounded-lg border border-border/80 bg-background/50 p-3">
              <div>
                <div className="font-medium text-foreground">Dark Appearance</div>
                <div className="text-muted-foreground">
                  Switch between dark and light themes
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDark}
                className="h-8 gap-1.5"
              >
                {dark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
                {dark ? "Dark" : "Light"}
              </Button>
            </div>

            {user ? (
              <Button
                variant="destructive"
                className="w-full gap-2 font-medium"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setActiveModal(null);
                }}
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            ) : (
              <p className="text-center text-muted-foreground">
                Sign in from the header to sync account settings.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
