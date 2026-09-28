"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { SidebarNav, type ThreadSummary } from "@/components/echo/sidebar-nav";
import {
  Search,
  X,
  Sparkles,
  Rocket,
  TrendingUp,
  Palette,
  Lightbulb,
  Brain,
  Briefcase,
  FileText,
  Mail,
  Users,
  Gamepad2,
  Film,
  Bike,
  Compass,
  Smile,
  Video,
  Music2,
  Camera,
  ArrowUpRight,
  Flame,
  UserCheck,
  MessagesSquare,
  Clapperboard,
  Mountain,
  PartyPopper,
  Subtitles,
  SquarePlay,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

export type TaskCategory = "ideas" | "work" | "fun" | "online-content";

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  iconName: string;
  iconBgColor?: string;
  iconColor?: string;
  starterPrompt: string;
}

export const AI_TASKS: TaskItem[] = [
  // 1. IDEAS CATEGORY
  {
    id: "think-outside-the-box",
    title: "Think Outside the Box",
    description: "Breakthrough ideas await your discovery",
    category: "ideas",
    iconName: "smile",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Help me think outside the box on this challenge. Give me 5 unconventional, counterintuitive, and high-impact ideas that defy standard industry assumptions: ",
  },
  {
    id: "startup",
    title: "Startup",
    description: "Get a list of ambitious startup ideas based on your area of interest",
    category: "ideas",
    iconName: "rocket",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Generate a curated list of ambitious startup ideas based on my interests. For each idea, detail the problem statement, target audience, unfair advantage, and monetization model: ",
  },
  {
    id: "innovate-and-elevate",
    title: "Innovate and Elevate",
    description: "Your guide to unique and fresh ideas",
    category: "ideas",
    iconName: "trending-up",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Help me innovate and elevate my existing product or concept. Provide strategies to 10x value, modernize user experience, and unlock new distribution channels: ",
  },
  {
    id: "unleashing-creativity",
    title: "Unleashing Creativity",
    description: "Explore a world of brilliant ideas",
    category: "ideas",
    iconName: "palette",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Let's unleash creativity. Brainstorm creative metaphors, visual storytelling concepts, and fresh creative angles for: ",
  },
  {
    id: "idea-sparks",
    title: "Idea Sparks",
    description: "Ignite your creativity for innovative solutions",
    category: "ideas",
    iconName: "lightbulb",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Give me rapid-fire idea sparks and lateral thinking exercises to unblock my team on: ",
  },

  // 2. WORK CATEGORY
  {
    id: "max-productivity",
    title: "Max Productivity",
    description: "Max productivity, achieve more, stress less",
    category: "work",
    iconName: "brain",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Help me maximize my productivity today. Organize my responsibilities into high-leverage priorities using time-boxing and the Eisenhower matrix: ",
  },
  {
    id: "recruiting",
    title: "Recruiting",
    description: "Define the qualifications for any position",
    category: "work",
    iconName: "briefcase",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Write a high-converting, inclusive job specification with clear responsibilities, must-have skills, nice-to-haves, and screening scorecard for the role: ",
  },
  {
    id: "cv-builder",
    title: "CV Builder",
    description: "Generate a creative resume",
    category: "work",
    iconName: "file-text",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Draft a compelling, modern CV / resume tailored for modern ATS scanners. Rephrase my experience into quantifiable impact achievements: ",
  },
  {
    id: "email",
    title: "Email",
    description: "Get help to craft a compelling email",
    category: "work",
    iconName: "mail",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Draft a concise, polished, and persuasive email that commands attention and drives a clear call-to-action for: ",
  },
  {
    id: "interview-tips",
    title: "Interview Tips",
    description: "Receive helpful tips for your interview",
    category: "work",
    iconName: "users",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Provide me with strategic interview preparation tips, high-probability behavioral questions, STAR-method answer outlines, and smart questions to ask the interviewers for: ",
  },

  // 3. FUN CATEGORY
  {
    id: "gaming",
    title: "Gaming",
    description: "Level up your gaming skills and conquer challenges",
    category: "fun",
    iconName: "gamepad",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Give me pro strategies, loadouts, meta analysis, and tips to conquer challenges in: ",
  },
  {
    id: "movie-time",
    title: "Movie Time",
    description: "Cinematic delight, enjoy the latest blockbuster",
    category: "fun",
    iconName: "film",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Recommend curated movie choices based on my mood, favorite directors, and preferred genres. Include spoiler-free summaries and why they are worth watching: ",
  },
  {
    id: "cycling-day",
    title: "Cycling Day",
    description: "Pedal through scenic routes, relish the ride",
    category: "fun",
    iconName: "bike",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Plan a scenic cycling itinerary, including essential gear checklist, fueling/nutrition advice, and tips for an enjoyable long-distance ride: ",
  },
  {
    id: "outdoor-activities",
    title: "Outdoor Activities",
    description: "Embrace nature, engage in thrilling outdoor adventures",
    category: "fun",
    iconName: "compass",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Suggest exciting outdoor adventure plans, weekend hiking trails, and preparation tips for embracing nature: ",
  },
  {
    id: "fun-with-buddies",
    title: "Fun with buddies",
    description: "Create memories with friends, have endless fun",
    category: "fun",
    iconName: "smile",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Give me creative and fun group game ideas, weekend hangout themes, and conversation starters for an unforgettable gathering with friends: ",
  },

  // 4. ONLINE CONTENT CATEGORY
  {
    id: "x-posts",
    title: "X Posts",
    description: "Summarize your text into a post (Tweet)",
    category: "online-content",
    iconName: "share-2",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Convert the following content into an engaging, viral X (Twitter) post and 3-part thread with powerful hooks, crisp takeaways, and relevant hashtags: ",
  },
  {
    id: "youtube-scripts",
    title: "YouTube Scripts",
    description: "Create a script for your video on any topic",
    category: "online-content",
    iconName: "square-play",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Write a high-retention YouTube video script complete with a 5-second hook, visual B-roll directions, concise core sections, and an irresistible call to action on the topic: ",
  },
  {
    id: "tiktok-posts",
    title: "TikTok Posts",
    description: "Craft TikTok posts on any topic",
    category: "online-content",
    iconName: "music-2",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Write a 30-second viral TikTok video concept and script with spoken dialogue, text-on-screen hooks, and audio pacing recommendations for: ",
  },
  {
    id: "tiktok-captions",
    title: "TikTok Captions",
    description: "Boost your TikTok views with appealing captions",
    category: "online-content",
    iconName: "subtitles",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Generate 5 engaging TikTok captions with high-traffic SEO keywords, witty hooks, and trending hashtags for a video about: ",
  },
  {
    id: "insta-content",
    title: "Insta Content",
    description: "Create Instagram posts on any topic",
    category: "online-content",
    iconName: "camera",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Write a visually striking Instagram carousel outline with slide-by-slide copy, caption, and hashtag clusters for: ",
  },
  {
    id: "insta-reels",
    title: "Insta Reels",
    description: "Get creative descriptions for your Instagram Reels",
    category: "online-content",
    iconName: "clapperboard",
    iconBgColor: "bg-purple-100/80 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    starterPrompt:
      "Craft high-converting, aesthetic descriptions and hooks for an Instagram Reel about: ",
  },
];

/* ---------------- Render Task Icon Helper (100% Lucide-React Icons) ---------------- */
function TaskIcon({ name, className = "size-5" }: { name: string; className?: string }) {
  switch (name) {
    case "sparkles":
      return <Sparkles className={className} />;
    case "rocket":
      return <Rocket className={className} />;
    case "trending-up":
      return <TrendingUp className={className} />;
    case "palette":
      return <Palette className={className} />;
    case "lightbulb":
      return <Lightbulb className={className} />;
    case "brain":
      return <Brain className={className} />;
    case "briefcase":
      return <Briefcase className={className} />;
    case "file-text":
      return <FileText className={className} />;
    case "mail":
      return <Mail className={className} />;
    case "users":
      return <Users className={className} />;
    case "gamepad":
      return <Gamepad2 className={className} />;
    case "film":
      return <Film className={className} />;
    case "bike":
      return <Bike className={className} />;
    case "compass":
      return <Compass className={className} />;
    case "smile":
      return <Smile className={className} />;
    case "share-2":
    case "x-brand":
      return <Share2 className={className} />;
    case "square-play":
    case "youtube":
      return <SquarePlay className={className} />;
    case "music-2":
    case "tiktok":
      return <Music2 className={className} />;
    case "subtitles":
      return <Subtitles className={className} />;
    case "camera":
    case "instagram":
      return <Camera className={className} />;
    case "clapperboard":
    case "insta-reels":
      return <Clapperboard className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

/* ---------------- Main TasksWorkspace Component ---------------- */
export function TasksWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Search & Category State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<TaskCategory>("ideas");

  // Auth sync
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
    const raw = localStorage.getItem("echogpt_threads_v1");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setThreads(
            parsed.map((t: any) => ({
              id: t.id,
              title: t.title || "Untitled",
              updated_at: t.updated_at || new Date().toISOString(),
            }))
          );
        }
      } catch {}
    }
  }, []);

  // Filter tasks based on category and search query
  const filteredTasks = useMemo(() => {
    return AI_TASKS.filter((task) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = task.description.toLowerCase().includes(q);
        return matchesTitle || matchesDesc;
      }
      return task.category === activeCategory;
    });
  }, [searchQuery, activeCategory]);

  // Execute Task Action: Pre-fill new chat thread
  const handleLaunchTask = (task: TaskItem) => {
    const newThreadId = crypto.randomUUID();
    try {
      localStorage.setItem(`echogpt_prefill_${newThreadId}`, task.starterPrompt);
    } catch {}
    toast.success(`Launching AI Task: ${task.title}`);
    router.push(`/chat/${newThreadId}`);
  };

  return (
    <div className="soft-grid flex h-dvh min-w-0 bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside className="hidden w-[296px] shrink-0 lg:block">
        <SidebarNav threads={threads} user={user} />
      </aside>

      {/* Main Content Area */}
      <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex h-14 items-center justify-between border-b border-border/40 px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg border border-border/80 bg-background text-foreground shadow-xs"
            aria-label="Open navigation menu"
          >
            <span className="text-lg">☰</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-heading font-semibold text-foreground text-sm">
              EchoGPT AI Tasks
            </span>
          </div>
          <div className="w-9" />
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative z-10 w-[296px] max-w-[85vw] bg-card shadow-2xl">
              <SidebarNav
                threads={threads}
                user={user}
                onClose={() => setMobileOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Content Container */}
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* Header Title Matching Reference */}
          <div className="mb-8 text-center sm:mb-10">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              EchoGPT AI Tasks
            </h1>
            <p className="mx-auto mt-2.5 max-w-2xl text-sm text-muted-foreground/80 sm:text-base leading-relaxed">
              Discover and create custom versions of ChatGPT that combine instructions, extra knowledge, and any combination of skills.
            </p>
          </div>

          {/* Search Bar Matching Reference */}
          <div className="mx-auto mb-8 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 size-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for the Apps"
                className="h-12 w-full rounded-2xl border border-border/80 bg-background/90 pl-11 pr-11 text-sm text-foreground shadow-2xs placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden focus:ring-2 focus:ring-primary/20 dark:bg-card/80 sm:text-base"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs with Underline Indicator (Matching Reference Screenshots) */}
          {!searchQuery && (
            <div className="mb-8 border-b border-border/60">
              <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-px">
                {/* 1. Ideas */}
                <button
                  type="button"
                  onClick={() => setActiveCategory("ideas")}
                  className={`pb-3 text-sm font-semibold transition-colors sm:text-base ${
                    activeCategory === "ideas"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                  }`}
                >
                  Ideas
                </button>

                {/* 2. Work */}
                <button
                  type="button"
                  onClick={() => setActiveCategory("work")}
                  className={`pb-3 text-sm font-semibold transition-colors sm:text-base ${
                    activeCategory === "work"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                  }`}
                >
                  Work
                </button>

                {/* 3. Fun */}
                <button
                  type="button"
                  onClick={() => setActiveCategory("fun")}
                  className={`pb-3 text-sm font-semibold transition-colors sm:text-base ${
                    activeCategory === "fun"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                  }`}
                >
                  Fun
                </button>

                {/* 4. Online Content */}
                <button
                  type="button"
                  onClick={() => setActiveCategory("online-content")}
                  className={`pb-3 text-sm font-semibold transition-colors sm:text-base ${
                    activeCategory === "online-content"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                  }`}
                >
                  Online Content
                </button>
              </div>
            </div>
          )}

          {/* Search Result Summary if searching */}
          {searchQuery && (
            <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Found {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"} for &ldquo;{searchQuery}&rdquo;
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-primary hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Tasks Cards Grid (3 Columns Matching Screenshots) */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleLaunchTask(task)}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md cursor-pointer"
              >
                <div>
                  {/* Icon Badge Container */}
                  <div
                    className={`flex size-11 items-center justify-center rounded-2xl shadow-xs transition-transform duration-200 group-hover:scale-105 ${
                      task.iconBgColor || "bg-accent"
                    } ${task.iconColor || "text-foreground"}`}
                  >
                    <TaskIcon name={task.iconName} className="size-5" />
                  </div>

                  {/* Task Title */}
                  <h3 className="mt-4 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                    {task.title}
                  </h3>

                  {/* Task Description */}
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Subtle Hover Action Pill */}
                <div className="mt-4 flex items-center justify-end pt-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    <span>Use Task</span>
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="my-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-12 text-center">
              <Sparkles className="size-10 text-muted-foreground/40 mb-3" />
              <p className="font-heading font-semibold text-foreground text-base">
                No AI Tasks Found
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                No tasks match &ldquo;{searchQuery}&rdquo;. Try another keyword or browse our categories.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
              >
                View All Tasks
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
