"use client";

import React, { useRef, useState, useEffect } from "react";
import { Link2, Mic, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ModelSelector } from "./model-selector";
import { ConnectorsPopover } from "./connectors-popover";
import type { AIModel } from "@/lib/models-data";
import { cn } from "@/lib/utils";

interface ChatInputBoxProps {
  selectedModel: AIModel;
  onSelectModel: (model: AIModel) => void;
  onSubmit: (data: { text: string }) => void;
  status?: "ready" | "submitted";
  className?: string;
}

export function ChatInputBox({
  selectedModel,
  onSelectModel,
  onSubmit,
  status = "ready",
  className,
}: ChatInputBoxProps) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      // Cap at 180px
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || status === "submitted") return;
    onSubmit({ text: text.trim() });
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleMicToggle = () => {
    setIsRecording((prev) => !prev);
    // Future Web Speech API integration hook
  };

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20 p-3.5 sm:p-4 flex flex-col gap-3 transition-all",
        className
      )}
    >
      {/* Top Controls: Model Selector | Connector */}
      <div className="flex items-center gap-1.5 text-xs sm:text-sm">
        {/* Model Selection Dropdown */}
        <ModelSelector
          selectedModel={selectedModel}
          onSelectModel={onSelectModel}
          className="h-8.5 px-2.5 rounded-xl border border-transparent hover:border-border/60 hover:bg-accent/60 text-foreground font-medium text-xs sm:text-sm"
        />

        {/* Divider */}
        <div className="h-4 w-px bg-border/70 mx-1 shrink-0" aria-hidden="true" />

        {/* Connector Option */}
        <ConnectorsPopover />
      </div>

      {/* Rounded Chat Insert Box */}
      <div
        className={cn(
          "relative flex items-center gap-2 rounded-full border border-border/80 dark:border-border/60 bg-background/90 dark:bg-muted/20 pl-3.5 pr-2 py-1.5 sm:py-2 transition-all shadow-xs",
          "focus-within:border-purple-500/60 focus-within:ring-2 focus-within:ring-purple-500/15"
        )}
      >
        {/* Link / Attachment Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach link or file"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Link2 className="size-4.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6}>
            Attach link or file
          </TooltipContent>
        </Tooltip>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const fileName = e.target.files[0].name;
              setText((prev) => (prev ? `${prev} [Attached: ${fileName}]` : `[Attached: ${fileName}] `));
            }
          }}
        />

        {/* Input Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          aria-label="Ask a question"
          className="w-full flex-1 resize-none bg-transparent py-1 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/75 focus:outline-none focus:ring-0 leading-snug max-h-36 overflow-y-auto"
        />

        {/* Voice Input (Mic) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleMicToggle}
              aria-label="Voice input"
              className={cn(
                "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                isRecording && "text-purple-600 bg-purple-500/15 animate-pulse"
              )}
            >
              <Mic className="size-4.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6}>
            {isRecording ? "Listening..." : "Use voice"}
          </TooltipContent>
        </Tooltip>

        {/* Purple Circular Send Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim() || status === "submitted"}
          aria-label="Send question"
          className={cn(
            "relative inline-flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md shadow-purple-500/25 transition-all",
            "hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40"
          )}
        >
          {status === "submitted" ? (
            <div className="size-4.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 sm:size-4.5 translate-x-px text-white"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
