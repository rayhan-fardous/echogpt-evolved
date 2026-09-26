"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  LogIn,
  Star,
  Share2,
  X,
  Pin,
  ClipboardList,
  ShieldCheck,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { BrandMark } from "./brand-mark";
import { supabase } from "@/integrations/supabase/client";
import { getAllThreadMetadata, type ThreadMetadata } from "@/lib/thread-storage";
import { AuthDialog } from "./auth-dialog";
import { ShareWebsiteDialog } from "./share-website-dialog";
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
  const pathname = usePathname();
  const isSearchActive = pathname === "/search";
  const [search, setSearch] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const [localThreads, setLocalThreads] = useState<ThreadSummary[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        router.push("/search");
        onSelect?.();
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, onSelect, onClose]);

  const [localMetaMap, setLocalMetaMap] = useState<Record<string, ThreadMetadata>>({});

  useEffect(() => {
    const syncLocal = () => {
      const all = getAllThreadMetadata();
      setLocalMetaMap(all);
      const summaries = Object.values(all).map((t) => ({
        id: t.id,
        title: t.title,
        updated_at: t.updated_at,
      }));
      setLocalThreads(summaries);
    };
    syncLocal();
    window.addEventListener("echo-threads-updated", syncLocal);
    return () => window.removeEventListener("echo-threads-updated", syncLocal);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("echo-theme");
      const isDark = saved === "dark";
      requestAnimationFrame(() => {
        setDark(isDark);
      });
      document.documentElement.classList.toggle("dark", isDark);
    } catch {
      // ignore
    }
  }, []);

  const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : "RayHan Fardous");
  const displayEmail = user?.email || "";
  const userAvatarSrc =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    (typeof avatar === "string"
      ? avatar
      : (avatar as { src?: string })?.src || "/profile-avatar.jpg");

  const toggleDark = (checked?: boolean) => {
    const next = typeof checked === "boolean" ? checked : !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("echo-theme", next ? "dark" : "light");
    } catch {}
  };

  const rawThreads = user ? (threads.length > 0 ? threads : localThreads) : [];
  const effectiveThreads = useMemo(() => {
    return [...rawThreads].sort((a, b) => {
      const pinA = localMetaMap[a.id]?.isPinned ?? false;
      const pinB = localMetaMap[b.id]?.isPinned ?? false;
      if (pinA && !pinB) return -1;
      if (!pinA && pinB) return 1;
      if (pinA && pinB) {
        const timePinA = localMetaMap[a.id]?.pinnedAt ? new Date(localMetaMap[a.id].pinnedAt!).getTime() : 0;
        const timePinB = localMetaMap[b.id]?.pinnedAt ? new Date(localMetaMap[b.id].pinnedAt!).getTime() : 0;
        if (timePinA !== timePinB) return timePinB - timePinA;
      }
      const timeA = a.updated_at ? new Date(a.updated_at).getTime() || 0 : 0;
      const timeB = b.updated_at ? new Date(b.updated_at).getTime() || 0 : 0;
      return timeB - timeA;
    });
  }, [rawThreads, localMetaMap]);

  const filteredThreads = search.trim()
    ? effectiveThreads.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()),
      )
    : effectiveThreads;

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

      {/* Search Chat Button */}
      <div className="px-3.5 pb-2.5">
        <button
          type="button"
          aria-label="Search chat"
          onClick={() => {
            router.push("/search");
            onSelect?.();
            onClose?.();
          }}
          className={`group flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-left text-sm font-medium transition-all ${
            isSearchActive
              ? "bg-accent font-semibold text-accent-foreground shadow-xs border border-border/70"
              : "text-foreground/80 hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
          }`}
        >
          <Search
            className={`size-4 transition-colors shrink-0 ${
              isSearchActive
                ? "text-primary"
                : "text-muted-foreground/90 group-hover:text-foreground"
            }`}
          />
          <span className="truncate">Search chat</span>
          <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border/60 bg-muted/40 px-1.5 font-mono text-[10px] font-medium text-muted-foreground/80 sm:inline-flex">
            ⌘K
          </kbd>
        </button>
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
                      const isPinned = localMetaMap[thread.id]?.isPinned ?? false;
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
                          <div className="flex min-w-0 items-center gap-1.5">
                            {isPinned && (
                              <Pin className="size-3 text-primary rotate-45 shrink-0" />
                            )}
                            <span className="truncate">{thread.title}</span>
                          </div>
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

      {/* Bottom Actions: Settings button (above) & Sign in / Account info (below) */}
      <div className="mt-auto border-t border-border/60 p-3 space-y-2 bg-background/50 backdrop-blur-sm">
        {/* Settings button with Popover */}
        <Popover open={profilePopoverOpen} onOpenChange={setProfilePopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
            >
              <Settings className="size-4 text-muted-foreground shrink-0" />
              <span>Settings</span>
            </button>
          </PopoverTrigger>

          <PopoverContent
            side="top"
            align="start"
            sideOffset={8}
            className="w-64 p-0 overflow-hidden rounded-2xl border border-border/80 bg-background text-foreground shadow-2xl mb-1"
          >
            {/* User Info Header only if authenticated */}
            {user && (
              <div className="px-4 py-3 border-b border-border/50">
                <div className="font-semibold text-sm text-foreground truncate">
                  {displayName}
                </div>
                <div className="text-xs text-muted-foreground truncate mt-0.5">
                  {displayEmail}
                </div>
              </div>
            )}

            {/* Menu options */}
            <div className="p-1.5 space-y-0.5">
              {/* Upgrade */}
              <button
                type="button"
                onClick={() => {
                  setProfilePopoverOpen(false);
                  setActiveModal("subscriptions");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-foreground/90 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
              >
                <Star className="size-4 shrink-0" />
                <span className="font-medium">Upgrade</span>
              </button>

              {/* Preferences */}
              <button
                type="button"
                onClick={() => {
                  setProfilePopoverOpen(false);
                  setActiveModal("settings");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-foreground/90 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
              >
                <Settings className="size-4 shrink-0" />
                <span className="font-medium">Preferences</span>
              </button>

              {/* Share Website */}
              <button
                type="button"
                onClick={() => {
                  setProfilePopoverOpen(false);
                  setShareDialogOpen(true);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-foreground/90 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
              >
                <Share2 className="size-4 shrink-0" />
                <span className="font-medium">Share Website</span>
              </button>
            </div>

            {/* Divider */}
            <div className="mx-2 border-t border-border/50" />

            {/* Dark Mode Row */}
            <div className="p-1.5">
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleDark()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleDark();
                  }
                }}
                className="flex items-center justify-between rounded-xl px-2.5 py-2 text-sm text-foreground/90 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  {dark ? (
                    <Moon className="size-4 shrink-0 text-primary" />
                  ) : (
                    <Sun className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="font-medium">Dark Mode</span>
                </div>
                <Switch
                  checked={dark}
                  onCheckedChange={(val) => toggleDark(val)}
                  aria-label="Toggle dark mode"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="mx-2 border-t border-border/50" />

            {/* TERMS AND CONDITIONS */}
            <div className="p-1.5 space-y-0.5">
              <div className="px-2.5 pt-1.5 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase select-none">
                TERMS AND CONDITIONS
              </div>
              <Link
                href="/terms-of-use"
                onClick={() => setProfilePopoverOpen(false)}
                className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-foreground/90 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
              >
                <ClipboardList className="size-4 shrink-0 text-muted-foreground" />
                <span className="font-medium">Terms of Use</span>
              </Link>
              <Link
                href="/privacy-policy"
                onClick={() => setProfilePopoverOpen(false)}
                className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-foreground/90 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
              >
                <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
                <span className="font-medium">Privacy Policy</span>
              </Link>
            </div>

            {/* Sign out button when authenticated */}
            {user && (
              <>
                <div className="mx-2 border-t border-border/50" />
                <div className="p-1.5">
                  <button
                    type="button"
                    onClick={async () => {
                      setProfilePopoverOpen(false);
                      await supabase.auth.signOut();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-4 shrink-0" />
                    <span>Sign out</span>
                  </button>
                </div>
              </>
            )}
          </PopoverContent>
        </Popover>

        {/* Below Settings: Sign in button if logged out, or Account Info card if logged in */}
        {user ? (
          <div
            onClick={() => setProfilePopoverOpen(true)}
            className="group flex w-full items-center justify-between gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <img
                src={userAvatarSrc}
                alt={displayName}
                className="size-9 rounded-full object-cover shrink-0 ring-1 ring-border/60"
              />
              <div className="min-w-0 flex-1 text-left">
                <div className="truncate text-sm font-medium text-foreground leading-tight">
                  {displayName}
                </div>
                <div className="truncate text-xs text-muted-foreground leading-tight mt-0.5">
                  Free
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal("subscriptions");
              }}
              className="shrink-0 rounded-full bg-[#27272a] hover:bg-[#3f3f46] text-white border border-white/10 px-3.5 py-1 text-xs font-medium transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Upgrade
            </button>
          </div>
        ) : (
          <Button
            className="w-full justify-center gap-2 rounded-xl font-medium cursor-pointer shadow-xs"
            onClick={() => setAuthDialogOpen(true)}
          >
            <LogIn className="size-4" />
            Sign in
          </Button>
        )}
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
                  src={userAvatarSrc}
                  alt="Avatar"
                  className="size-10 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-foreground">
                    {displayName}
                  </div>
                  <div className="truncate text-muted-foreground">{displayEmail}</div>
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
                onClick={() => toggleDark()}
                className="h-8 gap-1.5 cursor-pointer"
              >
                {dark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
                {dark ? "Dark" : "Light"}
              </Button>
            </div>

            <div className="rounded-lg border border-border/80 bg-background/50 p-3 space-y-2">
              <div>
                <div className="font-medium text-foreground">Legal & Policies</div>
                <div className="text-muted-foreground">
                  Review terms of service and data protection policies
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/terms-of-use"
                  onClick={() => setActiveModal(null)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-background/80 hover:bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors cursor-pointer"
                >
                  <ClipboardList className="size-3.5 text-muted-foreground shrink-0" />
                  <span>Terms of Use</span>
                </Link>
                <Link
                  href="/privacy-policy"
                  onClick={() => setActiveModal(null)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-background/80 hover:bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors cursor-pointer"
                >
                  <ShieldCheck className="size-3.5 text-muted-foreground shrink-0" />
                  <span>Privacy Policy</span>
                </Link>
              </div>
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
              <div className="space-y-2 text-center">
                <p className="text-muted-foreground">
                  Sign in to sync account preferences & conversation history.
                </p>
                <Button
                  className="w-full font-medium"
                  onClick={() => {
                    setActiveModal(null);
                    setAuthDialogOpen(true);
                  }}
                >
                  <LogIn className="size-4 mr-2" />
                  Sign In / Create Account
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />

      {/* Share Website Dialog matching Image 3 */}
      <ShareWebsiteDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </aside>
  );
}
