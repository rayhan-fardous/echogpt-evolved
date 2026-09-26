"use client";

import React, { useState } from "react";
import { Copy, Check, Link2, Share2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShareWebsiteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareWebsiteDialog({
  open,
  onOpenChange,
}: ShareWebsiteDialogProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "https://echogpt.ai";
  };

  const shareItems = [
    {
      name: "Facebook",
      icon: (
        <svg className="size-6 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      action: () => {
        const url = getShareUrl();
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
          "noopener,noreferrer"
        );
      },
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="size-6 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.66 1.66 0 1 0-.01 3.32 1.66 1.66 0 0 0 .01-3.32z" />
        </svg>
      ),
      action: () => {
        const url = getShareUrl();
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank",
          "noopener,noreferrer"
        );
      },
    },
    {
      name: "WhatsApp",
      icon: (
        <svg className="size-6 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.18 8.18 0 0 1-5.82 2.41c-1.44 0-2.86-.38-4.11-1.1l-.29-.18-3.06.8.82-2.98-.19-.31A8.2 8.2 0 0 1 3.8 11.91c0-4.54 3.7-8.24 8.25-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8 2.53 1.08 2.53.72 2.98.68.45-.04 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.06-.1-.23-.16-.48-.29z" />
        </svg>
      ),
      action: () => {
        const url = getShareUrl();
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
          "_blank",
          "noopener,noreferrer"
        );
      },
    },
    {
      name: "Telegram",
      icon: (
        <svg className="size-6 text-[#24A1DE]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.61 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.05-.49-.83-.27-1.48-.42-1.42-.88.03-.24.37-.49 1.02-.75 4-1.74 6.67-2.88 8.01-3.44 3.81-1.59 4.6-1.87 5.12-1.88.11 0 .37.03.54.17.14.12.18.28.2.45-.01.07.01.23 0 .33z" />
        </svg>
      ),
      action: () => {
        const url = getShareUrl();
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(url)}`,
          "_blank",
          "noopener,noreferrer"
        );
      },
    },
  ];

  const handleCopy = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px] p-0 overflow-hidden rounded-2xl border border-border/80 bg-background text-foreground shadow-2xl [&>button:last-child]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/50">
          <DialogTitle className="text-base font-semibold text-foreground">
            Share Website
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Social Platforms List */}
        <div className="px-3 py-2 space-y-1">
          {shareItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={item.action}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.name}</span>
              </div>
              <Share2 className="size-4 text-muted-foreground/80 shrink-0" />
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-border/50" />

        {/* Copy Link Row */}
        <div className="px-3 py-2 mb-1">
          <button
            type="button"
            onClick={handleCopy}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
          >
            <div className="flex items-center gap-3">
              <Link2 className="size-5 text-foreground/80" />
              <span>Copy Link</span>
            </div>
            {copied ? (
              <Check className="size-4 text-emerald-500 shrink-0" />
            ) : (
              <Copy className="size-4 text-muted-foreground/80 shrink-0" />
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
