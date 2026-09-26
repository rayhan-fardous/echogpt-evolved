"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Sparkles } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_MODELS,
  ADVANCED_MODELS,
  type AIModel,
} from "@/lib/models-data";
import { ModelIcon } from "./model-icon";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  selectedModel: AIModel;
  onSelectModel: (model: AIModel) => void;
  className?: string;
}

export function ModelSelector({
  selectedModel,
  onSelectModel,
  className,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (model: AIModel) => {
    onSelectModel(model);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          aria-label={`Select model: current is ${selectedModel.name}`}
          className={cn(
            "min-w-0 max-w-[200px] sm:max-w-[280px] h-9 gap-2 px-3 rounded-xl border border-transparent hover:border-border/60 hover:bg-accent/60 transition-all text-foreground",
            open && "bg-accent/80 border-border/80",
            className,
          )}
        >
          <ModelIcon provider={selectedModel.provider} className="size-5 shrink-0" />
          <span className="truncate font-medium text-xs sm:text-sm">{selectedModel.name}</span>
          <ChevronDown
            className={cn(
              "size-3.5 sm:size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        collisionPadding={12}
        avoidCollisions
        className="w-[calc(100vw-24px)] sm:w-[420px] max-w-[440px] max-h-[min(76vh,560px)] p-0 rounded-2xl sm:rounded-3xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl overflow-hidden flex flex-col z-50 animate-in fade-in-0 zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border/60 bg-muted/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
            <h3 className="font-heading text-sm font-semibold text-foreground">Select AI Model</h3>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent text-muted-foreground">
            {DEFAULT_MODELS.length + ADVANCED_MODELS.length} Models
          </span>
        </div>

        {/* Scrollable Model Lists */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-5 scrollbar-thin">
          {/* Default Model Section */}
          <section aria-labelledby="default-models-heading">
            <div className="pb-1.5 border-b border-border/50 mb-2 px-1 flex items-center justify-between">
              <h4
                id="default-models-heading"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Default Models
              </h4>
              <span className="text-[10px] text-muted-foreground">{DEFAULT_MODELS.length} available</span>
            </div>
            <div className="space-y-1.5">
              {DEFAULT_MODELS.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  isSelected={selectedModel.id === model.id}
                  onSelect={() => handleSelect(model)}
                />
              ))}
            </div>
          </section>

          {/* Advanced Models Section */}
          <section aria-labelledby="advanced-models-heading">
            <div className="pb-1.5 border-b border-border/50 mb-2 px-1 flex items-center justify-between">
              <h4
                id="advanced-models-heading"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Advanced Models
              </h4>
              <span className="text-[10px] text-muted-foreground">{ADVANCED_MODELS.length} available</span>
            </div>
            <div className="space-y-1.5">
              {ADVANCED_MODELS.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  isSelected={selectedModel.id === model.id}
                  onSelect={() => handleSelect(model)}
                />
              ))}
            </div>
          </section>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface ModelCardProps {
  model: AIModel;
  isSelected: boolean;
  onSelect: () => void;
}

function ModelCard({ model, isSelected, onSelect }: ModelCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-150 flex flex-col gap-1 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        isSelected
          ? "border-2 border-primary bg-primary/[0.06] dark:bg-primary/[0.12] shadow-xs"
          : "border border-transparent hover:border-border/60 hover:bg-accent/50",
      )}
    >
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <ModelIcon provider={model.provider} className="size-5 sm:size-5.5 shrink-0" />
          <span
            className={cn(
              "font-semibold text-xs sm:text-sm truncate",
              isSelected ? "text-primary" : "text-foreground",
            )}
          >
            {model.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {model.badge && (
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium tracking-wide",
                model.badge === "Pro"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300"
                  : "bg-[#f2ebff] text-[#7c3aed] dark:bg-purple-950/60 dark:text-purple-300",
              )}
            >
              {model.badge}
            </span>
          )}
          {isSelected && (
            <span className="size-4.5 sm:size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Check className="size-3 sm:size-3.5 stroke-[2.5]" />
            </span>
          )}
        </div>
      </div>

      <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed pl-7 sm:pl-8 line-clamp-2">
        {model.description}
      </p>
    </button>
  );
}
