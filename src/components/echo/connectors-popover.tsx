"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Globe, FileText, Code2, MessageSquare, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConnectorBranchIcon({ className = "size-4.5" }: { className?: string }) {
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
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="9" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M6 8.5v5a3 3 0 0 0 3 3h6.5" />
      <path d="M6 11.5a3 3 0 0 1 3-3h6.5" />
    </svg>
  );
}

interface ConnectorItem {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  connected: boolean;
  color: string;
}

const INITIAL_CONNECTORS: ConnectorItem[] = [
  {
    id: "web",
    name: "Web Search",
    description: "Browse the live web for real-time information",
    icon: Globe,
    connected: true,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    id: "gdrive",
    name: "Google Drive",
    description: "Access Docs, Sheets, and presentations",
    icon: FileText,
    connected: true,
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Code repositories, issues, and pull requests",
    icon: Code2,
    connected: false,
    color: "text-zinc-600 dark:text-zinc-300 bg-zinc-500/10",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Sync workspaces, docs, and team databases",
    icon: Layers,
    connected: false,
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Search messages and public channels",
    icon: MessageSquare,
    connected: false,
    color: "text-emerald-500 bg-emerald-500/10",
  },
];

interface ConnectorsPopoverProps {
  className?: string;
}

export function ConnectorsPopover({ className }: ConnectorsPopoverProps) {
  const [open, setOpen] = useState(false);
  const [connectors, setConnectors] = useState<ConnectorItem[]>(INITIAL_CONNECTORS);

  const toggleConnector = (id: string) => {
    setConnectors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, connected: !c.connected } : c))
    );
  };

  const activeCount = connectors.filter((c) => c.connected).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Connectors and integrations"
          title="Connectors & Data Sources"
          className={cn(
            "relative inline-flex items-center justify-center size-8 rounded-xl text-muted-foreground/80 hover:text-foreground hover:bg-accent/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            open && "text-foreground bg-accent/80",
            className
          )}
        >
          <ConnectorBranchIcon className="size-4.5" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[90vw] sm:w-[340px] p-0 rounded-2xl sm:rounded-3xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-200"
      >
        <div className="p-3.5 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <ConnectorBranchIcon className="size-4" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-semibold leading-none">Connectors</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Ground responses with live data
                </p>
              </div>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
              {activeCount} Active
            </span>
          </div>
        </div>

        <div className="p-2 space-y-1 max-h-[280px] overflow-y-auto">
          {connectors.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleConnector(c.id)}
                className="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-accent/50 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={cn("size-8 rounded-full flex items-center justify-center shrink-0", c.color)}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-xs text-foreground truncate">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{c.description}</div>
                  </div>
                </div>

                <div
                  className={cn(
                    "size-5 rounded-full flex items-center justify-center shrink-0 border transition-all text-xs",
                    c.connected
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "border-border/80 text-transparent group-hover:border-primary/50"
                  )}
                >
                  <Check className="size-3" />
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
