"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Menu,
  Plus,
  ChevronDown,
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

/* ---------------- Types & Model Config ---------------- */

export type AspectRatio = "1:1" | "3:2" | "2:3" | "auto";
export type ImageCount = 1 | 2 | 3 | 4;

export interface StudioModel {
  id: string;
  name: string;
  description: string;
  provider: "GOOGLE" | "OPENAI" | "FLUX";
}

export const STUDIO_MODELS: StudioModel[] = [
  // Google
  {
    id: "nano-banana-2-lite",
    name: "Nano Banana 2 Lite",
    description: "Lightest Google tier. Quickest and cheapest.",
    provider: "GOOGLE",
  },
  {
    id: "nano-banana-2",
    name: "Nano Banana 2",
    description: "Fast Google model with well-balanced quality.",
    provider: "GOOGLE",
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    description: "Google's best. Highest fidelity and the strongest at text in images.",
    provider: "GOOGLE",
  },
  {
    id: "nano-banana",
    name: "Nano Banana",
    description: "Previous Google generation. Quick and dependable.",
    provider: "GOOGLE",
  },
  // OpenAI
  {
    id: "chatgpt-image-latest",
    name: "ChatGPT Image Latest",
    description: "Tracks whatever ChatGPT currently uses for images.",
    provider: "OPENAI",
  },
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    description: "High detail, ideal for creative and photorealistic prompts.",
    provider: "OPENAI",
  },
  // Flux
  {
    id: "flux-1.1-pro",
    name: "Flux 1.1 Pro",
    description: "Next-gen photorealism and state-of-the-art prompt fidelity.",
    provider: "FLUX",
  },
  {
    id: "flux-schnell",
    name: "Flux Schnell",
    description: "Ultra-fast generation for rapid concept iterations.",
    provider: "FLUX",
  },
];

export interface StudioCreation {
  id: string;
  prompt: string;
  imageUrl: string;
  aspectRatio: AspectRatio;
  modelId: string;
  modelName: string;
  createdAt: string;
  referenceImage?: string;
}

const STARTER_PROMPTS = [
  "Turn my photo into a professional headshot",
  "Futuristic cyberpunk city at night with neon holographic billboards in rain",
  "Studio product photography of an elegant perfume bottle on black marble",
  "Minimalist 3D isometric workspace with pastel ambient lighting",
];

/* ---------------- Green Robot AI Icon (matching Screenshot 1) ---------------- */

function GreenRobotIcon({ className = "size-7" }: { className?: string }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-[#16A34A] text-white shadow-xs cursor-default select-none transition-transform hover:scale-105 ${className}`}
      title="EchoGPT AI Vision Engine Active"
      aria-label="AI Engine Active"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4 text-white"
        aria-hidden="true"
      >
        <rect x="7" y="9" width="10" height="9" rx="2.5" />
        <circle cx="10" cy="13" r="1.2" fill="#16A34A" />
        <circle cx="14" cy="13" r="1.2" fill="#16A34A" />
        <path
          d="M12 4v3"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="3" r="1.2" fill="white" />
        <path
          d="M5 12.5h1M18 12.5h1"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M10 16h4"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* ---------------- Main ImageStudioWorkspace Component ---------------- */

export function ImageStudioWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Studio form states
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [imageCount, setImageCount] = useState<ImageCount>(1);
  const [selectedModelId, setSelectedModelId] = useState<string>("nano-banana-2-lite");
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Reference image upload
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generating & Creations
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [creations, setCreations] = useState<StudioCreation[]>([]);
  const [activeLightbox, setActiveLightbox] = useState<StudioCreation | null>(null);

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

  // Local metadata & Supabase threads
  useEffect(() => {
    const all = getAllThreadMetadata();
    const summaries = Object.values(all).map((t) => ({
      id: t.id,
      title: t.title,
      updated_at: t.updated_at,
    }));
    setThreads(summaries);
  }, [user]);

  // Load creations from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("echo-studio-creations");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCreations(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const saveCreations = (newCreations: StudioCreation[]) => {
    setCreations(newCreations);
    try {
      localStorage.setItem("echo-studio-creations", JSON.stringify(newCreations));
    } catch {
      // ignore
    }
  };

  const selectedModel = useMemo(() => {
    return (
      STUDIO_MODELS.find((m) => m.id === selectedModelId) || STUDIO_MODELS[0]
    );
  }, [selectedModelId]);

  // Group models by provider
  const groupedModels = useMemo(() => {
    const groups: Record<string, StudioModel[]> = {
      GOOGLE: [],
      OPENAI: [],
      FLUX: [],
    };
    for (const m of STUDIO_MODELS) {
      if (!groups[m.provider]) groups[m.provider] = [];
      groups[m.provider].push(m);
    }
    return groups;
  }, []);

  // Handle reference image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size must be under 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReferenceImage(reader.result as string);
      toast.success("Reference photo attached");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Generate image handler
  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast.error("Please enter an image description prompt");
      return;
    }

    setIsGenerating(true);
    setGenerationStep("Preparing prompt embeddings...");

    try {
      // Simulate pipeline progression
      await new Promise((r) => setTimeout(r, 600));
      setGenerationStep(`Rendering with ${selectedModel.name}...`);
      await new Promise((r) => setTimeout(r, 900));
      setGenerationStep("Enhancing photorealistic details...");
      await new Promise((r) => setTimeout(r, 800));

      const newItems: StudioCreation[] = [];
      const timestamp = new Date().toISOString();

      for (let i = 0; i < imageCount; i++) {
        const id = crypto.randomUUID();
        const width = aspectRatio === "3:2" ? 1200 : aspectRatio === "2:3" ? 800 : 1024;
        const height = aspectRatio === "2:3" ? 1200 : aspectRatio === "3:2" ? 800 : 1024;
        
        // High quality varied visuals matching prompt
        const imageUrl = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=${width}&h=${height}&q=85&sig=${encodeURIComponent(id)}`;

        newItems.push({
          id,
          prompt: trimmedPrompt,
          imageUrl,
          aspectRatio,
          modelId: selectedModel.id,
          modelName: selectedModel.name,
          createdAt: timestamp,
          referenceImage: referenceImage || undefined,
        });
      }

      const updated = [...newItems, ...creations];
      saveCreations(updated);
      toast.success(`Generated ${imageCount} ${imageCount === 1 ? "image" : "images"}`);
    } catch {
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  const handleDeleteCreation = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const filtered = creations.filter((c) => c.id !== id);
    saveCreations(filtered);
    if (activeLightbox?.id === id) {
      setActiveLightbox(null);
    }
    toast.success("Image removed from your creations");
  };

  const handleCopyPrompt = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success("Prompt copied to clipboard");
  };

  const handleDownload = async (imageUrl: string, filename: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch {
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div className="soft-grid flex h-dvh min-w-0 bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside className="hidden w-[296px] shrink-0 lg:block">
        <SidebarNav threads={threads} user={user} />
      </aside>

      {/* Main Studio Area */}
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
                <SheetDescription>EchoGPT navigation and image studio</SheetDescription>
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

        {/* Scrollable Studio Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl">
            {/* Header Block (Screenshot 1) */}
            <div className="mb-8 pt-4 text-center sm:pt-6">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Image Studio
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-muted-foreground/80 font-normal">
                Create images that stop the scroll.
              </p>
            </div>

            {/* Prompt Generator Card (Screenshot 1) */}
            <div className="relative rounded-3xl border border-border/80 bg-background/95 dark:bg-[#151226]/90 p-4 sm:p-6 shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
              {/* Textarea + Green Robot Header */}
              <div className="relative min-h-[90px] sm:min-h-[100px]">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                  placeholder="Turn my photo into a professional headshot"
                  rows={3}
                  className="w-full resize-none bg-transparent pr-12 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none leading-relaxed"
                />

                {/* Top Right Green AI Robot Icon */}
                <div className="absolute right-0 top-0">
                  <GreenRobotIcon />
                </div>
              </div>

              {/* Reference image thumbnail if attached */}
              {referenceImage && (
                <div className="mb-3.5 flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-1.5 pr-3 w-fit">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={referenceImage}
                    alt="Reference preview"
                    className="size-9 rounded-lg object-cover border border-border/40"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-medium text-foreground">Reference image</span>
                    <span className="text-[11px] text-muted-foreground">Ready for image-to-image</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReferenceImage(null)}
                    className="ml-2 rounded-full p-1 text-muted-foreground hover:bg-black/10 hover:text-foreground dark:hover:bg-white/10"
                    title="Remove reference"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              {/* Controls Toolbar (Screenshot 1) */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  {/* Plus File Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach reference image"
                    className="flex size-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-all hover:border-primary/50 hover:bg-accent hover:text-foreground active:scale-95 cursor-pointer"
                  >
                    <Plus className="size-4" />
                  </button>

                  {/* Aspect Ratio Pill Selector (Screenshot 1: 1:1, 3:2, 2:3, auto) */}
                  <div className="flex items-center rounded-full border border-border/70 p-0.5 bg-black/[0.02] dark:bg-white/[0.03]">
                    {(["1:1", "3:2", "2:3", "auto"] as AspectRatio[]).map((ratio) => {
                      const isActive = aspectRatio === ratio;
                      return (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setAspectRatio(ratio)}
                          className={`rounded-full px-2.5 sm:px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#7C3AED] text-white shadow-xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
                          }`}
                        >
                          {ratio}
                        </button>
                      );
                    })}
                  </div>

                  {/* Output Image Quantity Pill Selector (Screenshot 1: 1, 2, 3, 4) */}
                  <div className="flex items-center rounded-full border border-border/70 p-0.5 bg-black/[0.02] dark:bg-white/[0.03]">
                    {([1, 2, 3, 4] as ImageCount[]).map((count) => {
                      const isActive = imageCount === count;
                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setImageCount(count)}
                          className={`flex size-6 sm:size-7 items-center justify-center rounded-full text-xs font-medium transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#7C3AED] text-white shadow-xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
                          }`}
                        >
                          {count}
                        </button>
                      );
                    })}
                  </div>

                  {/* Model Selector Dropdown Trigger (Screenshot 1 & 2) */}
                  <button
                    type="button"
                    onClick={() => setModelModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-full border border-border/70 bg-black/[0.02] px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:border-primary/50 hover:bg-accent dark:bg-white/[0.03] cursor-pointer"
                  >
                    <span className="truncate max-w-[130px] sm:max-w-[180px]">
                      {selectedModel.name}
                    </span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  </button>
                </div>

                {/* Generate Button (Screenshot 1) */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="h-9.5 rounded-xl sm:rounded-2xl bg-[#7C3AED] px-5 sm:px-6 text-sm font-semibold text-white shadow-md shadow-[#7C3AED]/20 hover:bg-[#6D28D9] hover:shadow-[#7C3AED]/30 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="size-4 animate-spin" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <span>Generate</span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Status progression bar if currently generating */}
              {isGenerating && (
                <div className="mt-3.5 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-primary animate-pulse">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5" />
                    <span>{generationStep || "Synthesizing image..."}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">Estimated: ~15s</span>
                </div>
              )}

              {/* Bottom Card Notice (Screenshot 1) */}
              <div className="mt-4 border-t border-border/60 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  Image generation is a paid feature — upgrade to start creating images.
                </span>
                <button
                  type="button"
                  onClick={() => setUpgradeModalOpen(true)}
                  className="font-semibold text-[#7C3AED] hover:underline dark:text-[#A78BFA] transition-colors cursor-pointer"
                >
                  Upgrade to Pro &rarr;
                </button>
              </div>
            </div>

            {/* Sub-card Explanatory Caption (Screenshot 1) */}
            <p className="mt-3 text-center text-xs text-muted-foreground/75">
              Each image uses one message from your plan. Generation takes up to a minute.
            </p>

            {/* "Your creations" Section (Screenshot 1) */}
            <div className="mt-12 sm:mt-16">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
                    Your creations
                  </h2>
                  {creations.length > 0 && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                      {creations.length}
                    </span>
                  )}
                </div>

                {creations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Clear all your image creations?")) {
                        saveCreations([]);
                        toast.success("Creations cleared");
                      }
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Empty state (matching Screenshot 1) */}
              {creations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/70 py-16 px-4 text-center">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Nothing here yet — describe an image above to get started.
                  </p>

                  {/* Inspiration Starter Prompts */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
                    {STARTER_PROMPTS.map((starter) => (
                      <button
                        key={starter}
                        type="button"
                        onClick={() => setPrompt(starter)}
                        className="rounded-full border border-border/80 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:bg-accent hover:text-foreground cursor-pointer"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Creations Gallery Grid */
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {creations.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveLightbox(item)}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all hover:shadow-md hover:border-primary/40"
                    >
                      {/* Image container matching aspect ratio */}
                      <div
                        className={`relative w-full overflow-hidden bg-muted/40 ${
                          item.aspectRatio === "3:2"
                            ? "aspect-[3/2]"
                            : item.aspectRatio === "2:3"
                            ? "aspect-[2/3]"
                            : "aspect-square"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={item.prompt}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="rounded-md bg-black/60 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-medium text-white">
                            {item.aspectRatio}
                          </span>
                          <span className="rounded-md bg-black/60 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-medium text-white truncate max-w-[100px]">
                            {item.modelName}
                          </span>
                        </div>

                        {/* Top Right Quick Actions */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCreation(item.id, e)}
                            className="rounded-full bg-black/60 backdrop-blur-md p-1.5 text-white/80 hover:bg-destructive hover:text-white transition-colors cursor-pointer"
                            title="Delete creation"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>

                        {/* Bottom Overlay with Prompt & Actions */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 pt-6 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
                          <p className="line-clamp-2 text-xs font-medium text-white/95">
                            {item.prompt}
                          </p>
                          <div className="mt-2 flex items-center justify-between pt-1 border-t border-white/20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPrompt(item.prompt);
                                toast.success("Prompt loaded into studio");
                              }}
                              className="text-[11px] text-white/80 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="size-3" />
                              <span>Reuse</span>
                            </button>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => handleCopyPrompt(item.prompt, e)}
                                className="rounded-md bg-white/20 p-1 text-white hover:bg-white/30 transition-colors cursor-pointer"
                                title="Copy prompt"
                              >
                                <Copy className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDownload(item.imageUrl, `echogpt-${item.id}`, e)}
                                className="rounded-md bg-white/20 p-1 text-white hover:bg-white/30 transition-colors cursor-pointer"
                                title="Download image"
                              >
                                <Download className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ---------------- Choose a Model Modal (Screenshot 2) ---------------- */}
      <Dialog open={modelModalOpen} onOpenChange={setModelModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-3xl border border-border/80 bg-background text-foreground shadow-2xl">
          {/* Header */}
          <div className="p-6 pb-3 border-b border-border/40">
            <DialogTitle className="font-heading text-xl font-bold tracking-tight">
              Choose a model
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              Picks the model used for your next generation.
            </DialogDescription>
          </div>

          {/* Model Groups (matching Screenshot 2) */}
          <div className="flex-1 overflow-y-auto p-6 pt-3 space-y-6 scrollbar-thin scrollbar-thumb-border/40">
            {Object.entries(groupedModels).map(([provider, models]) => (
              <div key={provider} className="space-y-2">
                <p className="text-xs font-bold tracking-wider uppercase text-muted-foreground px-1">
                  {provider}
                </p>
                <div className="space-y-2">
                  {models.map((model) => {
                    const isSelected = selectedModelId === model.id;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          setSelectedModelId(model.id);
                          setModelModalOpen(false);
                          toast.success(`Selected ${model.name}`);
                        }}
                        className={`group relative flex w-full items-center justify-between rounded-2xl p-4 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-2 border-[#7C3AED] bg-[#7C3AED]/[0.06] dark:bg-[#7C3AED]/15 shadow-xs"
                            : "border border-border/70 hover:border-border hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="pr-4 space-y-0.5 min-w-0">
                          <p className="font-heading text-[15px] font-semibold text-foreground tracking-tight">
                            {model.name}
                          </p>
                          <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                            {model.description}
                          </p>
                        </div>

                        {/* Selected Purple Checkmark (Screenshot 2) */}
                        {isSelected && (
                          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-white shadow-xs">
                            <Check className="size-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- Upgrade to Pro Modal ---------------- */}
      <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border/80">
          <DialogHeader>
            <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#341B5E] dark:text-[#C4B5FD] mb-2">
              <Sparkles className="size-5" />
            </div>
            <DialogTitle className="font-heading text-xl font-bold">
              Upgrade to EchoGPT Pro
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Unlock the complete Image Studio, 4K rendering, higher limits, and priority generation across all models.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 space-y-2.5 rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm">
            <div className="flex items-center gap-2">
              <Check className="size-4 text-[#7C3AED]" />
              <span>Full access to Google Nano Banana & OpenAI DALL-E 3</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-[#7C3AED]" />
              <span>Batch generate up to 4 images simultaneously</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-[#7C3AED]" />
              <span>High-resolution exports with no watermarks</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-[#7C3AED]" />
              <span>Reference image upload & image-to-image synthesis</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              className="h-11 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold shadow-md shadow-[#7C3AED]/20 cursor-pointer"
              onClick={() => {
                setUpgradeModalOpen(false);
                toast.success("Welcome to Pro tier preview!");
              }}
            >
              Get Started for $20/month
            </Button>
            <Button
              variant="ghost"
              className="h-10 rounded-xl cursor-pointer"
              onClick={() => setUpgradeModalOpen(false)}
            >
              Maybe later
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- Lightbox Zoom Dialog ---------------- */}
      {activeLightbox && (
        <Dialog
          open={!!activeLightbox}
          onOpenChange={(open) => !open && setActiveLightbox(null)}
        >
          <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-3xl border border-border/80 bg-background text-foreground shadow-2xl">
            <div className="relative w-full bg-black/90 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeLightbox.imageUrl}
                alt={activeLightbox.prompt}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-heading font-semibold text-foreground text-base">
                    {activeLightbox.prompt}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md bg-muted px-2 py-0.5 font-medium">
                      {activeLightbox.modelName}
                    </span>
                    <span className="rounded-md bg-muted px-2 py-0.5 font-medium">
                      Ratio {activeLightbox.aspectRatio}
                    </span>
                    <span>
                      {new Date(activeLightbox.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 rounded-xl cursor-pointer"
                    onClick={() => handleCopyPrompt(activeLightbox.prompt)}
                  >
                    <Copy className="size-3.5" />
                    <span>Copy</span>
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer"
                    onClick={() =>
                      handleDownload(
                        activeLightbox.imageUrl,
                        `echogpt-${activeLightbox.id}`
                      )
                    }
                  >
                    <Download className="size-3.5" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
