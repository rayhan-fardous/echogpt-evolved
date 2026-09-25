"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DEFAULT_MODELS,
  ADVANCED_MODELS,
  ALL_MODELS,
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDefault = useMemo(() => {
    if (!searchQuery.trim()) return DEFAULT_MODELS;
    const query = searchQuery.toLowerCase();
    return DEFAULT_MODELS.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.providerName.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const filteredAdvanced = useMemo(() => {
    if (!searchQuery.trim()) return ADVANCED_MODELS;
    const query = searchQuery.toLowerCase();
    return ADVANCED_MODELS.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.providerName.toLowerCase().includes(query),
    );
  }, [searchQuery]);

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
            "min-w-0 max-w-[240px] sm:max-w-[320px] h-10 gap-2.5 px-3 rounded-xl border border-transparent hover:border-border/60 hover:bg-accent/60 transition-all text-foreground",
            open && "bg-accent/80 border-border/80",
            className,
          )}
        >
          <ModelIcon provider={selectedModel.provider} className="size-5 shrink-0" />
          <span className="truncate font-medium text-sm">{selectedModel.name}</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[92vw] sm:w-[420px] max-h-[82vh] p-0 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl overflow-hidden flex flex-col z-50 animate-in fade-in-0 zoom-in-95 duration-200"
      >
        {/* Search Header */}
        <div className="p-3 border-b border-border/60 bg-muted/20 shrink-0">
          <div className="relative flex items-center">
            <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search all 41 models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9.5 pl-9 pr-8 text-sm rounded-xl bg-background/80 border-border/70 focus-visible:ring-primary/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Model Lists */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6 scrollbar-thin">
          {filteredDefault.length === 0 && filteredAdvanced.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No models found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            <>
              {/* Default Model Section */}
              {filteredDefault.length > 0 && (
                <section aria-labelledby="default-models-heading">
                  <div className="pb-2 border-b border-border/50 mb-2.5 px-1">
                    <h2
                      id="default-models-heading"
                      className="text-xs font-medium text-muted-foreground tracking-wide"
                    >
                      Default Model
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {filteredDefault.map((model) => (
                      <ModelCard
                        key={model.id}
                        model={model}
                        isSelected={selectedModel.id === model.id}
                        onSelect={() => handleSelect(model)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Advanced Models Section */}
              {filteredAdvanced.length > 0 && (
                <section aria-labelledby="advanced-models-heading">
                  <div className="pb-2 border-b border-border/50 mb-2.5 px-1">
                    <h2
                      id="advanced-models-heading"
                      className="text-xs font-medium text-muted-foreground tracking-wide"
                    >
                      Advanced Models
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {filteredAdvanced.map((model) => (
                      <ModelCard
                        key={model.id}
                        model={model}
                        isSelected={selectedModel.id === model.id}
                        onSelect={() => handleSelect(model)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
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
        "w-full text-left p-3.5 rounded-2xl transition-all duration-150 flex flex-col gap-1.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        isSelected
          ? "border-2 border-primary bg-primary/[0.06] dark:bg-primary/[0.12] shadow-xs"
          : "border border-transparent hover:border-border/60 hover:bg-accent/50",
      )}
    >
      <div className="flex items-center justify-between gap-2.5 w-full">
        <div className="flex items-center gap-2.5 min-w-0">
          <ModelIcon provider={model.provider} className="size-6 shrink-0" />
          <span
            className={cn(
              "font-semibold text-sm truncate",
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
                "px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide",
                model.badge === "Pro"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300"
                  : "bg-[#f2ebff] text-[#7c3aed] dark:bg-purple-950/60 dark:text-purple-300",
              )}
            >
              {model.badge}
            </span>
          )}
          {isSelected && (
            <span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Check className="size-3.5 stroke-[2.5]" />
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed pl-8">
        {model.description}
      </p>
    </button>
  );
}
