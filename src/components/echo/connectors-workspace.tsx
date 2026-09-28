"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Menu,
  Search,
  X,
  Check,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Code2,
  FileText,
  MessageSquare,
  Lock,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Settings,
  SlidersHorizontal,
  FolderSync,
  Radio,
  FileCheck,
  Building,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { toast } from "sonner";

/* ---------------- Types ---------------- */

export type ConnectorCategory =
  | "all"
  | "productivity"
  | "developer"
  | "communication"
  | "database"
  | "web";

export interface Connector {
  id: string;
  name: string;
  category: ConnectorCategory;
  categoryLabel: string;
  description: string;
  iconBg: string;
  iconColor: string;
  connected: boolean;
  enabled: boolean;
  badge?: "Popular" | "Pro" | "Enterprise" | "Live";
  lastSync?: string;
  itemsIndexed?: number;
  scopes: string[];
}

/* ---------------- Authentic Brand Icons ---------------- */

function GoogleDriveBrandIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M8.2 3.5h7.6l6.2 10.7-3.8 6.5L8.2 3.5z" fill="#FFC107" />
      <path d="M1.9 14.2l3.8-6.6 7.6 13.1H5.8L1.9 14.2z" fill="#2196F3" />
      <path d="M5.7 20.7h15.4L22 17.4H9.5L5.7 20.7z" fill="#4CAF50" />
    </svg>
  );
}

function GitHubBrandIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function NotionBrandIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.458-.84c1.121-.093 1.214-.56 1.027-1.027L18.411 1.41C18.13.943 17.476.57 16.636.663L3.105 1.69c-.84.093-1.121.56-.84 1.12l2.194 1.398zm-.467 4.106v12.318c0 .933.467 1.306 1.306 1.213l13.532-.933c.84-.093 1.12-.653 1.12-1.493V6.634c0-.84-.373-1.213-1.12-1.12L4.825 6.541c-.653.093-.833.653-.833 1.773zm11.385 1.493c.093.56.093 1.027-.373 1.027-.373 0-.653-.187-.84-.56l-3.08-4.572h-.093v4.292c0 .653-.373.933-.933.933-.56 0-.84-.28-.84-.933V6.821c0-.56.187-.933.653-1.027.467-.093.84.187 1.12.56l3.08 4.48h.093V6.634c0-.653.373-.933.933-.933.56 0 .84.28.84.933v3.173z" />
    </svg>
  );
}

function SlackBrandIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A" />
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0" />
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D" />
      <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E" />
    </svg>
  );
}

function LinearBrandIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M3.1 3.1l17.8 17.8-1.5 1.5L1.6 4.6 3.1 3.1zm1.5 6.2l10.1 10.1-1.5 1.5L3.1 10.8l1.5-1.5zm6.2-6.2l10.1 10.1-1.5 1.5L9.3 4.6l1.5-1.5z" />
    </svg>
  );
}

function SupabaseBrandIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M13.4 22.5L21.3 12.8C22.1 11.8 21.4 10.3 20.1 10.3H12.9V2.5C12.9 1.3 11.4 0.7 10.6 1.7L2.7 11.4C1.9 12.4 2.6 13.9 3.9 13.9H11.1V21.7C11.1 22.9 12.6 23.5 13.4 22.5Z"
        fill="#3ECF8E"
      />
    </svg>
  );
}

function PostgresBrandIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 2C6.5 2 2 6.5 2 12c0 4.1 2.5 7.6 6.1 9.1.5.1.7-.2.7-.5v-1.8c-2.4.5-2.9-1.2-2.9-1.2-.4-1-1-1.3-1-1.3-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.2-1.9-.2-3.9-1-3.9-4.3 0-.9.3-1.7.9-2.3-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.4.9.7-.2 1.4-.3 2.2-.3s1.5.1 2.2.3c1.7-1.1 2.4-.9 2.4-.9.5 1.2.2 2.1.1 2.3.6.6.9 1.4.9 2.3 0 3.3-2 4.1-3.9 4.3.3.3.6.8.6 1.7v2.5c0 .3.2.6.7.5C19.5 19.6 22 16.1 22 12c0-5.5-4.5-10-10-10z"
        fill="#336791"
      />
    </svg>
  );
}

function SnowflakeBrandIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" />
      <circle cx="12" cy="12" r="2.5" fill="#29B5E8" />
    </svg>
  );
}

/* ---------------- Connectors Registry ---------------- */

const INITIAL_CONNECTORS_LIST: Connector[] = [
  {
    id: "gdrive",
    name: "Google Drive",
    category: "productivity",
    categoryLabel: "Productivity",
    description: "Search, ground, and cite Docs, Sheets, and presentations directly in conversations.",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-500",
    connected: true,
    enabled: true,
    badge: "Popular",
    lastSync: "12m ago",
    itemsIndexed: 1420,
    scopes: ["View Google Docs and Sheets", "Search Drive folders", "Read-only access"],
  },
  {
    id: "web-search",
    name: "Live Web Grounding",
    category: "web",
    categoryLabel: "Web & Search",
    description: "Real-time web indexing for current news, up-to-date documentation, and live facts.",
    iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    iconColor: "text-cyan-500",
    connected: true,
    enabled: true,
    badge: "Live",
    lastSync: "Just now",
    itemsIndexed: 98000,
    scopes: ["Live web browsing", "Multi-source synthesis", "URL citation links"],
  },
  {
    id: "github",
    name: "GitHub",
    category: "developer",
    categoryLabel: "Developer",
    description: "Connect repositories, pull requests, issues, and code diffs across organizations.",
    iconBg: "bg-zinc-500/10 dark:bg-zinc-500/20",
    iconColor: "text-zinc-800 dark:text-zinc-200",
    connected: true,
    enabled: true,
    badge: "Popular",
    lastSync: "35m ago",
    itemsIndexed: 864,
    scopes: ["Read repository code", "Index open issues & PRs", "Commit log analysis"],
  },
  {
    id: "notion",
    name: "Notion",
    category: "productivity",
    categoryLabel: "Productivity",
    description: "Index workspace pages, engineering wikis, database tables, and roadmaps.",
    iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    connected: false,
    enabled: false,
    badge: "Popular",
    scopes: ["Search workspace pages", "Index database rows", "Export meeting summaries"],
  },
  {
    id: "slack",
    name: "Slack",
    category: "communication",
    categoryLabel: "Communication",
    description: "Retrieve context from team discussions, announcements, and project channels.",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    connected: false,
    enabled: false,
    badge: "Pro",
    scopes: ["Read public channels", "Thread message indexing", "Team canvas retrieval"],
  },
  {
    id: "linear",
    name: "Linear",
    category: "developer",
    categoryLabel: "Developer",
    description: "Sync sprint cycles, backlog issues, roadmap milestones, and bug triage streams.",
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    connected: false,
    enabled: false,
    badge: "Pro",
    scopes: ["Issue status inspection", "Sprint cycles sync", "Project milestones"],
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "database",
    categoryLabel: "Database",
    description: "Live schema exploration, SQL query generation, and table metadata inspection.",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500",
    connected: true,
    enabled: true,
    badge: "Popular",
    lastSync: "1h ago",
    itemsIndexed: 142,
    scopes: ["Read database schema", "Table column metadata", "Safe read-only execution"],
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    category: "database",
    categoryLabel: "Database",
    description: "Direct connection to self-hosted or cloud Postgres clusters with read-only replicas.",
    iconBg: "bg-blue-600/10 dark:bg-blue-600/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    connected: false,
    enabled: false,
    badge: "Enterprise",
    scopes: ["Read-only schema introspection", "Explain plan verification", "Encrypted SSL tunnel"],
  },
  {
    id: "snowflake",
    name: "Snowflake",
    category: "database",
    categoryLabel: "Database",
    description: "Enterprise warehouse catalog indexing for data-driven analytics and executive KPI reporting.",
    iconBg: "bg-sky-500/10 dark:bg-sky-500/20",
    iconColor: "text-sky-500",
    connected: false,
    enabled: false,
    badge: "Enterprise",
    scopes: ["Warehouse catalog inspection", "Data dictionary sync", "Audit trail logging"],
  },
];

/* ---------------- Main ConnectorsWorkspace Component ---------------- */

export function ConnectorsWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ConnectorCategory>("all");

  // Connectors State
  const [connectors, setConnectors] = useState<Connector[]>(INITIAL_CONNECTORS_LIST);

  // Configuration Modal state
  const [activeConfigConnector, setActiveConfigConnector] = useState<Connector | null>(null);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<boolean | null>(null);
  const [syncFreq, setSyncFreq] = useState<string>("realtime");

  // Interactive Grounding Test Console state
  const [testPrompt, setTestPrompt] = useState("");
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResult, setTestResult] = useState<{
    answer: string;
    citations: Array<{ source: string; title: string; snippet: string }>;
  } | null>(null);

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

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("echo-connectors-state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConnectors(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const saveConnectors = (newList: Connector[]) => {
    setConnectors(newList);
    try {
      localStorage.setItem("echo-connectors-state", JSON.stringify(newList));
    } catch {
      // ignore
    }
  };

  // Toggle enable/disable
  const handleToggleEnable = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = connectors.map((c) =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    );
    saveConnectors(updated);
    const target = updated.find((c) => c.id === id);
    if (target?.enabled) {
      toast.success(`${target.name} enabled for context grounding`);
    } else {
      toast.info(`${target?.name} paused for context grounding`);
    }
  };

  // Connect or open config
  const handleOpenConfig = (conn: Connector) => {
    setActiveConfigConnector(conn);
    setPingSuccess(null);
  };

  // Simulate OAuth connection
  const handleConnectService = async (conn: Connector) => {
    toast.loading(`Authorizing ${conn.name}...`, { id: "oauth-connect" });
    await new Promise((r) => setTimeout(r, 900));
    toast.dismiss("oauth-connect");

    const updated = connectors.map((c) =>
      c.id === conn.id
        ? {
            ...c,
            connected: true,
            enabled: true,
            lastSync: "Just now",
            itemsIndexed: Math.floor(Math.random() * 450) + 120,
          }
        : c
    );
    saveConnectors(updated);
    toast.success(`${conn.name} connected successfully!`);
    setActiveConfigConnector(null);
  };

  // Disconnect service
  const handleDisconnectService = (connId: string) => {
    const updated = connectors.map((c) =>
      c.id === connId
        ? {
            ...c,
            connected: false,
            enabled: false,
            lastSync: undefined,
            itemsIndexed: undefined,
          }
        : c
    );
    saveConnectors(updated);
    toast.success("Integration disconnected and token revoked");
    setActiveConfigConnector(null);
  };

  // Test Ping Health
  const handleTestPing = async () => {
    setIsTestingPing(true);
    setPingSuccess(null);
    await new Promise((r) => setTimeout(r, 700));
    setIsTestingPing(false);
    setPingSuccess(true);
    toast.success("Connection test passed (Latency: 64ms)");
  };

  // Grounding Test Console execution
  const handleRunGroundingTest = async () => {
    const trimmed = testPrompt.trim();
    if (!trimmed) {
      toast.error("Please enter a question to test active connectors");
      return;
    }

    setIsTestRunning(true);
    setTestResult(null);

    await new Promise((r) => setTimeout(r, 1100));

    setIsTestRunning(false);
    setTestResult({
      answer: `Based on your connected data sources (Google Drive, GitHub, Live Web):\n\nWe found relevant technical documentation confirming the latest feature scope and API specs. All systems are operating within nominal latency envelopes, and code reviews for the current release are 100% complete.`,
      citations: [
        {
          source: "Google Drive",
          title: "Q3 System Architecture & Roadmap.gdoc",
          snippet: "...all primary API connectors ground in real-time with zero-retention privacy guarantees...",
        },
        {
          source: "GitHub",
          title: "PR #249: Implement high-throughput indexing worker",
          snippet: "...merged into main with full test suite passes and verified backwards compatibility...",
        },
        {
          source: "Live Web Grounding",
          title: "EchoGPT Documentation v2.4",
          snippet: "...connectors dynamically ground conversational turns with verified source citations...",
        },
      ],
    });
    toast.success("Retrieved grounded answers from 3 active connectors");
  };

  // Filtered connectors
  const filteredConnectors = useMemo(() => {
    return connectors.filter((c) => {
      // Category match
      if (selectedCategory !== "all" && c.category !== selectedCategory) {
        return false;
      }
      // Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = c.name.toLowerCase().includes(q);
        const descMatch = c.description.toLowerCase().includes(q);
        const catMatch = c.categoryLabel.toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !catMatch) return false;
      }
      return true;
    });
  }, [connectors, selectedCategory, searchQuery]);

  // Metrics
  const activeCount = useMemo(() => connectors.filter((c) => c.connected && c.enabled).length, [connectors]);
  const totalIndexed = useMemo(
    () => connectors.reduce((acc, c) => acc + (c.itemsIndexed || 0), 0),
    [connectors]
  );

  // Render appropriate brand icon
  const renderConnectorIcon = (id: string, className = "size-5") => {
    switch (id) {
      case "gdrive":
        return <GoogleDriveBrandIcon className={className} />;
      case "github":
        return <GitHubBrandIcon className={className} />;
      case "notion":
        return <NotionBrandIcon className={className} />;
      case "slack":
        return <SlackBrandIcon className={className} />;
      case "linear":
        return <LinearBrandIcon className={className} />;
      case "supabase":
        return <SupabaseBrandIcon className={className} />;
      case "postgres":
        return <PostgresBrandIcon className={className} />;
      case "snowflake":
        return <SnowflakeBrandIcon className={className} />;
      case "web-search":
        return <Globe className={`${className} text-cyan-500`} />;
      default:
        return <Layers className={className} />;
    }
  };

  return (
    <div className="soft-grid flex h-dvh min-w-0 bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside className="hidden w-[296px] shrink-0 lg:block">
        <SidebarNav threads={threads} user={user} />
      </aside>

      {/* Main Connectors Area */}
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
                <SheetDescription>EchoGPT navigation and connectors directory</SheetDescription>
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
            {/* Header Block */}
            <div className="mb-8 pt-4 text-center sm:pt-6">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Connectors & Integrations
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
                Supercharge EchoGPT with your team's live data sources, files, codebases, and tools for context-aware answers.
              </p>

              {/* Status Metrics Bar */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs text-muted-foreground shadow-xs">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-foreground">{activeCount} Active</span>
                  <span>Connectors</span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs text-muted-foreground shadow-xs">
                  <FolderSync className="size-3.5 text-primary" />
                  <span className="font-semibold text-foreground">{totalIndexed.toLocaleString()}</span>
                  <span>Items Synced</span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs text-muted-foreground shadow-xs">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  <span>Zero Data Retention</span>
                </div>
              </div>
            </div>

            {/* Search and Category Filter Controls */}
            <div className="mb-8 flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative w-full max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search connectors, apps, databases, or documentation tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] pl-10 pr-9 text-sm text-foreground border-border/70 shadow-xs focus-visible:bg-background focus-visible:border-primary/50"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full"
                    title="Clear search"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                {[
                  { id: "all", label: "All Connectors" },
                  { id: "productivity", label: "Productivity & Docs" },
                  { id: "developer", label: "Developer & Code" },
                  { id: "communication", label: "Communication" },
                  { id: "database", label: "Databases & Storage" },
                  { id: "web", label: "Web & Search" },
                ].map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id as ConnectorCategory)}
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

            {/* Connectors Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredConnectors.map((connector) => {
                return (
                  <div
                    key={connector.id}
                    onClick={() => handleOpenConfig(connector)}
                    className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-background/95 dark:bg-[#151226]/90 p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md cursor-pointer"
                  >
                    <div>
                      {/* Top Bar: Icon, Name & Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-11 items-center justify-center rounded-2xl ${connector.iconBg} shadow-xs shrink-0`}
                          >
                            {renderConnectorIcon(connector.id, "size-6")}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-heading text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors">
                                {connector.name}
                              </h3>
                              {connector.badge && (
                                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                  {connector.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {connector.categoryLabel}
                            </span>
                          </div>
                        </div>

                        {/* Connected badge or toggle */}
                        {connector.connected ? (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          </div>
                        ) : (
                          <span className="rounded-full bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                            Available
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="mt-3.5 text-xs sm:text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
                        {connector.description}
                      </p>
                    </div>

                    {/* Footer Info & Action */}
                    <div className="mt-5 border-t border-border/50 pt-3 flex items-center justify-between">
                      <div className="text-[11px] text-muted-foreground">
                        {connector.connected ? (
                          <span className="flex items-center gap-1">
                            <FolderSync className="size-3 text-emerald-500" />
                            {connector.lastSync || "Synced recently"}
                          </span>
                        ) : (
                          <span>1-click setup</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {connector.connected ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-xl text-xs gap-1 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenConfig(connector);
                            }}
                          >
                            <Settings className="size-3.5" />
                            <span>Configure</span>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="h-8 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-xs cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConnectService(connector);
                            }}
                          >
                            <span>Connect</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty Search State */}
            {filteredConnectors.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border/70 py-16 text-center">
                <Layers className="size-8 mx-auto text-muted-foreground/60 mb-2" />
                <p className="font-heading text-base font-semibold text-foreground">
                  No connectors found
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
                  Reset Filters
                </Button>
              </div>
            )}

            {/* ---------------- Interactive Grounding Test Console ---------------- */}
            <div className="mt-14 rounded-3xl border border-border/80 bg-background/95 dark:bg-[#151226]/90 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
                    <Sparkles className="size-3.5" />
                    <span>Grounding Playground</span>
                  </div>
                  <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
                    Test Active Connectors in Action
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    Ask a test question to verify how EchoGPT retrieves and cites knowledge across your active integrations.
                  </p>
                </div>
              </div>

              {/* Sample Quick Questions */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {[
                  "What are the latest action items in our roadmap document?",
                  "Summarize recently merged PRs and engineering updates.",
                  "What is our API authentication protocol architecture?",
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setTestPrompt(sample)}
                    className="rounded-full border border-border/70 bg-black/[0.02] dark:bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-pointer"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div className="mt-4 flex flex-col sm:flex-row items-stretch gap-2.5">
                <Input
                  type="text"
                  placeholder="Ask a question against your active connectors..."
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRunGroundingTest();
                    }
                  }}
                  className="h-11 flex-1 rounded-2xl border-border/70 text-sm"
                />
                <Button
                  onClick={handleRunGroundingTest}
                  disabled={isTestRunning || !testPrompt.trim()}
                  className="h-11 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 font-semibold shadow-md shadow-[#7C3AED]/20 cursor-pointer"
                >
                  {isTestRunning ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="size-4 animate-spin" />
                      <span>Retrieving...</span>
                    </div>
                  ) : (
                    <span>Test Retrieval</span>
                  )}
                </Button>
              </div>

              {/* Grounded Result Display */}
              {testResult && (
                <div className="mt-5 space-y-4 rounded-2xl border border-primary/20 bg-primary/[0.02] p-5 animate-in fade-in duration-200">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      Synthesized Grounded Answer
                    </span>
                    <p className="mt-1.5 text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {testResult.answer}
                    </p>
                  </div>

                  {/* Retrieved Citations */}
                  <div className="border-t border-border/50 pt-3">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Retrieved Citations & Context:
                    </span>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {testResult.citations.map((cite, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-border/70 bg-background/80 p-3 text-xs space-y-1"
                        >
                          <div className="flex items-center gap-1.5 font-semibold text-foreground">
                            <span className="size-1.5 rounded-full bg-primary" />
                            <span className="truncate">{cite.source}</span>
                          </div>
                          <div className="text-[11px] font-medium text-primary truncate">
                            {cite.title}
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {cite.snippet}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ---------------- Enterprise Security & Privacy Architecture ---------------- */}
            <div className="mt-12 rounded-3xl border border-border/80 bg-background/50 p-6 sm:p-8">
              <div className="flex items-center gap-2.5 text-primary mb-3">
                <ShieldCheck className="size-6" />
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Enterprise Security & Privacy Architecture
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
                EchoGPT connects directly to your systems through read-only, OAuth 2.0 scopes with strict zero data retention. Your files, code, and chat histories are never stored or used for model training.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Lock className="size-4 text-emerald-500" />
                    <span>End-to-End Encrypted</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Data is encrypted at rest using AES-256 and in transit via TLS 1.3 protocol.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Building className="size-4 text-blue-500" />
                    <span>SOC-2 & GDPR Ready</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Compliant with international privacy frameworks and audited access governance.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <CheckCircle2 className="size-4 text-purple-500" />
                    <span>Zero Training Guarantee</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Customer data is strictly isolated and never indexed into public foundation models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ---------------- Configuration & Setup Modal ---------------- */}
      {activeConfigConnector && (
        <Dialog
          open={!!activeConfigConnector}
          onOpenChange={(open) => !open && setActiveConfigConnector(null)}
        >
          <DialogContent className="sm:max-w-lg rounded-3xl p-6 border border-border/80 bg-background text-foreground shadow-2xl">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-11 items-center justify-center rounded-2xl ${activeConfigConnector.iconBg} shadow-xs shrink-0`}
                >
                  {renderConnectorIcon(activeConfigConnector.id, "size-6")}
                </div>
                <div>
                  <DialogTitle className="font-heading text-xl font-bold">
                    {activeConfigConnector.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    {activeConfigConnector.categoryLabel} Integration
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="my-4 space-y-4 text-xs">
              {/* Permissions & Scopes */}
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2">
                <span className="font-semibold text-foreground">Requested Permissions:</span>
                <ul className="space-y-1.5 text-muted-foreground">
                  {activeConfigConnector.scopes.map((scope, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-500 shrink-0" />
                      <span>{scope}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sync Settings */}
              {activeConfigConnector.connected && (
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-3">
                  <span className="font-semibold text-foreground">Synchronization Frequency:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "realtime", label: "Realtime" },
                      { id: "hourly", label: "Hourly" },
                      { id: "daily", label: "Daily" },
                    ].map((freq) => (
                      <button
                        key={freq.id}
                        type="button"
                        onClick={() => setSyncFreq(freq.id)}
                        className={`rounded-xl border py-1.5 text-center font-medium transition-all cursor-pointer ${
                          syncFreq === freq.id
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border/70 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>

                  {/* Health Test */}
                  <div className="border-t border-border/40 pt-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-foreground">Connection Health:</span>
                      <p className="text-[11px] text-muted-foreground">
                        {pingSuccess === true ? "Verified (64ms latency)" : "Online and responsive"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTestPing}
                      disabled={isTestingPing}
                      className="h-8 rounded-xl text-xs cursor-pointer"
                    >
                      {isTestingPing ? (
                        <RefreshCw className="size-3 animate-spin mr-1" />
                      ) : null}
                      Test Ping
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
              {activeConfigConnector.connected ? (
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
                    onClick={() => handleDisconnectService(activeConfigConnector.id)}
                  >
                    Disconnect Integration
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 cursor-pointer"
                    onClick={() => {
                      setActiveConfigConnector(null);
                      toast.success("Settings saved successfully");
                    }}
                  >
                    Save & Close
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl cursor-pointer"
                    onClick={() => setActiveConfigConnector(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 font-semibold cursor-pointer"
                    onClick={() => handleConnectService(activeConfigConnector)}
                  >
                    Authorize & Connect
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
