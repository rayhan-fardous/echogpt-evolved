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
  Play,
  Pause,
  Film,
  Maximize2,
  Volume2,
  VolumeX,
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

/* ---------------- Types & Video Models ---------------- */

export type VideoAspectRatio = "16:9" | "9:16" | "1:1";

export interface VideoModel {
  id: string;
  name: string;
  description: string;
  provider: "GOOGLE" | "OPENAI" | "CINEMATIC";
}

export const VIDEO_MODELS: VideoModel[] = [
  // Google
  {
    id: "veo-3.1-fast",
    name: "Veo 3.1 fast",
    description: "Fast Google video model for quick concept renders and rapid prototyping.",
    provider: "GOOGLE",
  },
  {
    id: "veo-3.1-pro",
    name: "Veo 3.1 Pro",
    description: "Google's premier video model. Highest fidelity 4K and camera physics.",
    provider: "GOOGLE",
  },
  {
    id: "veo-2",
    name: "Veo 2",
    description: "Previous generation Google video foundation. Dependable and fluid.",
    provider: "GOOGLE",
  },
  // OpenAI
  {
    id: "sora-turbo",
    name: "Sora Turbo",
    description: "High-speed cinematic realism with complex motion and physics simulation.",
    provider: "OPENAI",
  },
  {
    id: "sora-2.0",
    name: "Sora 2.0",
    description: "Photorealistic long-form generation with rich narrative and camera control.",
    provider: "OPENAI",
  },
  // Cinematic
  {
    id: "gen-3-alpha",
    name: "Gen-3 Alpha",
    description: "Industry-standard cinematic motion and hyper-consistent character details.",
    provider: "CINEMATIC",
  },
  {
    id: "kling-1.5-pro",
    name: "Kling 1.5 Pro",
    description: "Exceptional physical dynamic simulation and fluid transitions.",
    provider: "CINEMATIC",
  },
  {
    id: "luma-dream-machine",
    name: "Luma Dream Machine",
    description: "Smooth 60fps natural camera movements and photorealistic lighting.",
    provider: "CINEMATIC",
  },
];

export interface VideoCreation {
  id: string;
  prompt: string;
  videoUrl: string;
  thumbnailUrl: string;
  aspectRatio: VideoAspectRatio;
  modelId: string;
  modelName: string;
  createdAt: string;
  referenceImage?: string;
  durationSeconds: number;
}

const STARTER_VIDEO_PROMPTS = [
  "Cinematic drone shot flying through mist-covered pine mountains at sunrise, 4k",
  "Slow motion macro droplet of liquid landing on surface with vibrant colorful ripple caustics",
  "Cyberpunk bustling market alley at night with neon signs reflecting in rain puddles",
  "Time-lapse of northern lights aurora borealis dancing across starry arctic sky",
];

// Curated high quality cinematic sample video clips
const SAMPLE_VIDEOS = [
  {
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&h=675&q=80",
  },
  {
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=675&q=80",
  },
  {
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&h=675&q=80",
  },
];

/* ---------------- Main VideoStudioWorkspace Component ---------------- */

export function VideoStudioWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Form state
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>("16:9");
  const [selectedModelId, setSelectedModelId] = useState<string>("veo-3.1-fast");
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Reference starting frame upload
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generation & Creations
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [creations, setCreations] = useState<VideoCreation[]>([]);
  const [activeLightbox, setActiveLightbox] = useState<VideoCreation | null>(null);

  // Playing preview tracker
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

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
      const saved = localStorage.getItem("echo-video-creations");
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

  const saveCreations = (newCreations: VideoCreation[]) => {
    setCreations(newCreations);
    try {
      localStorage.setItem("echo-video-creations", JSON.stringify(newCreations));
    } catch {
      // ignore
    }
  };

  const selectedModel = useMemo(() => {
    return (
      VIDEO_MODELS.find((m) => m.id === selectedModelId) || VIDEO_MODELS[0]
    );
  }, [selectedModelId]);

  // Group models by provider
  const groupedModels = useMemo(() => {
    const groups: Record<string, VideoModel[]> = {
      GOOGLE: [],
      OPENAI: [],
      CINEMATIC: [],
    };
    for (const m of VIDEO_MODELS) {
      if (!groups[m.provider]) groups[m.provider] = [];
      groups[m.provider].push(m);
    }
    return groups;
  }, []);

  // Reference file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file as reference frame");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReferenceImage(reader.result as string);
      toast.success("Initial keyframe image attached");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Generate video action
  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast.error("Please enter a video description prompt");
      return;
    }

    setIsGenerating(true);
    setGenerationStep("Decomposing scene trajectory & camera path...");

    try {
      await new Promise((r) => setTimeout(r, 800));
      setGenerationStep(`Synthesizing motion with ${selectedModel.name}...`);
      await new Promise((r) => setTimeout(r, 1100));
      setGenerationStep("Interpolating 60fps temporal coherence...");
      await new Promise((r) => setTimeout(r, 900));

      const id = crypto.randomUUID();
      const sample = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];

      const newCreation: VideoCreation = {
        id,
        prompt: trimmedPrompt,
        videoUrl: sample.videoUrl,
        thumbnailUrl: sample.thumbnailUrl,
        aspectRatio,
        modelId: selectedModel.id,
        modelName: selectedModel.name,
        createdAt: new Date().toISOString(),
        referenceImage: referenceImage || undefined,
        durationSeconds: 5,
      };

      const updated = [newCreation, ...creations];
      saveCreations(updated);
      toast.success("Video generated successfully!");
    } catch {
      toast.error("Video synthesis failed. Please try again.");
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
    toast.success("Video removed from creations");
  };

  const handleCopyPrompt = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success("Prompt copied to clipboard");
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
                <SheetDescription>EchoGPT navigation and video studio</SheetDescription>
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

        {/* Scrollable Video Studio Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl">
            {/* Header Block (Screenshot matching) */}
            <div className="mb-8 pt-4 text-center sm:pt-6">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Video Studio
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-muted-foreground/80 font-normal">
                Just type what you imagine, and the video makes itself.
              </p>
            </div>

            {/* Prompt Generator Card */}
            <div className="relative rounded-3xl border border-border/80 bg-background/95 dark:bg-[#151226]/90 p-4 sm:p-6 shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
              {/* Textarea */}
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
                  placeholder="Describe your video..."
                  rows={3}
                  className="w-full resize-none bg-transparent pr-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Reference image thumbnail if attached */}
              {referenceImage && (
                <div className="mb-3.5 flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-1.5 pr-3 w-fit">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={referenceImage}
                    alt="Starting frame preview"
                    className="size-9 rounded-lg object-cover border border-border/40"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-medium text-foreground">Starting Frame</span>
                    <span className="text-[11px] text-muted-foreground">Image-to-video motion guide</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReferenceImage(null)}
                    className="ml-2 rounded-full p-1 text-muted-foreground hover:bg-black/10 hover:text-foreground dark:hover:bg-white/10 cursor-pointer"
                    title="Remove frame"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              {/* Controls Toolbar (Screenshot matching: [+] [16:9, 9:16, 1:1] [Veo 3.1 fast v] [Generate]) */}
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
                    title="Attach starting frame"
                    className="flex size-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-all hover:border-primary/50 hover:bg-accent hover:text-foreground active:scale-95 cursor-pointer"
                  >
                    <Plus className="size-4" />
                  </button>

                  {/* Aspect Ratio Pill Selector (Screenshot: 16:9, 9:16, 1:1) */}
                  <div className="flex items-center rounded-full border border-border/70 p-0.5 bg-black/[0.02] dark:bg-white/[0.03]">
                    {(["16:9", "9:16", "1:1"] as VideoAspectRatio[]).map((ratio) => {
                      const isActive = aspectRatio === ratio;
                      return (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setAspectRatio(ratio)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
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

                  {/* Model Selector Dropdown Trigger (Screenshot: Veo 3.1 fast) */}
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

                {/* Generate Button (Screenshot: Purple Generate button) */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="h-9.5 rounded-xl sm:rounded-2xl bg-[#7C3AED] px-5 sm:px-6 text-sm font-semibold text-white shadow-md shadow-[#7C3AED]/20 hover:bg-[#6D28D9] hover:shadow-[#7C3AED]/30 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="size-4 animate-spin" />
                        <span>Rendering...</span>
                      </div>
                    ) : (
                      <span>Generate</span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Progress status bar */}
              {isGenerating && (
                <div className="mt-3.5 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-primary animate-pulse">
                  <div className="flex items-center gap-2">
                    <Film className="size-3.5" />
                    <span>{generationStep || "Rendering video sequence..."}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">Est: ~45s</span>
                </div>
              )}

              {/* Bottom Card Notice (Screenshot: Video generation is a paid feature...) */}
              <div className="mt-4 border-t border-border/60 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  Video generation is a paid feature — upgrade to start creating videos.
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

            {/* Sub-card Explanatory Caption (Screenshot) */}
            <p className="mt-3 text-center text-xs text-muted-foreground/75">
              Each video uses one message from your plan and takes a few minutes to render.
            </p>

            {/* "Your creations" Section (Screenshot) */}
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
                      if (confirm("Clear all your video creations?")) {
                        saveCreations([]);
                        toast.success("Video creations cleared");
                      }
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Empty state (Screenshot: Nothing here yet — describe a video above to get started.) */}
              {creations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/70 py-16 px-4 text-center">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Nothing here yet — describe a video above to get started.
                  </p>

                  {/* Starter prompt inspirations */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
                    {STARTER_VIDEO_PROMPTS.map((starter) => (
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
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {creations.map((item) => {
                    const isPlaying = playingVideoId === item.id;
                    return (
                      <div
                        key={item.id}
                        className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all hover:shadow-md hover:border-primary/40 cursor-pointer"
                        onClick={() => setActiveLightbox(item)}
                      >
                        {/* Video / Poster Container */}
                        <div
                          className={`relative w-full overflow-hidden bg-black/95 ${
                            item.aspectRatio === "9:16"
                              ? "aspect-[9/16]"
                              : item.aspectRatio === "1:1"
                              ? "aspect-square"
                              : "aspect-video"
                          }`}
                        >
                          {isPlaying ? (
                            <video
                              src={item.videoUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.thumbnailUrl}
                              alt={item.prompt}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          )}

                          {/* Play overlay button if not playing */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlayingVideoId(isPlaying ? null : item.id);
                            }}
                            className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/40 transition-colors"
                            aria-label={isPlaying ? "Pause preview" : "Play preview"}
                          >
                            <div className="flex size-11 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur-md transition-transform group-hover:scale-110">
                              {isPlaying ? (
                                <Pause className="size-5 fill-current" />
                              ) : (
                                <Play className="size-5 fill-current ml-0.5" />
                              )}
                            </div>
                          </button>

                          {/* Top Badges */}
                          <div className="absolute top-2 left-2 flex items-center gap-1.5 opacity-90">
                            <span className="rounded-md bg-black/70 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-medium text-white">
                              {item.aspectRatio}
                            </span>
                            <span className="rounded-md bg-black/70 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-medium text-white">
                              {item.modelName}
                            </span>
                          </div>

                          {/* Top Right Delete */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(item.videoUrl, "_blank");
                                  }}
                                  className="rounded-md bg-white/20 p-1 text-white hover:bg-white/30 transition-colors cursor-pointer"
                                  title="Download video"
                                >
                                  <Download className="size-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ---------------- Choose a Model Modal ---------------- */}
      <Dialog open={modelModalOpen} onOpenChange={setModelModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-3xl border border-border/80 bg-background text-foreground shadow-2xl">
          {/* Header */}
          <div className="p-6 pb-3 border-b border-border/40">
            <DialogTitle className="font-heading text-xl font-bold tracking-tight">
              Choose a model
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              Picks the video foundation model used for your generation.
            </DialogDescription>
          </div>

          {/* Model Groups */}
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
              <Film className="size-5" />
            </div>
            <DialogTitle className="font-heading text-xl font-bold">
              Upgrade to EchoGPT Video Pro
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Unlock the complete Video Studio, Google Veo 3.1 Pro, OpenAI Sora Turbo, and cinematic 4K exports.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 space-y-2.5 rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm">
            <div className="flex items-center gap-2">
              <Check className="size-4 text-[#7C3AED]" />
              <span>Access to Google Veo 3.1 Pro & Sora Turbo</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-[#7C3AED]" />
              <span>Full 1080p and 4K high-frame-rate rendering</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-[#7C3AED]" />
              <span>Image-to-video keyframe continuity</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-[#7C3AED]" />
              <span>Priority GPU rendering queue with zero wait time</span>
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

      {/* ---------------- Fullscreen Video Player Lightbox ---------------- */}
      {activeLightbox && (
        <Dialog
          open={!!activeLightbox}
          onOpenChange={(open) => !open && setActiveLightbox(null)}
        >
          <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border border-border/80 bg-background text-foreground shadow-2xl">
            <div className="relative w-full bg-black flex items-center justify-center">
              <video
                src={activeLightbox.videoUrl}
                controls
                autoPlay
                className="max-h-[70vh] w-full object-contain"
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
                    <span>Copy Prompt</span>
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer"
                    onClick={() => window.open(activeLightbox.videoUrl, "_blank")}
                  >
                    <Download className="size-3.5" />
                    <span>Download MP4</span>
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
