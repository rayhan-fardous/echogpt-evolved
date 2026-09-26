"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Search,
  X,
  ChevronDown,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  MoreVertical,
  Menu,
  SquarePen,
  MessageSquare,
  Sparkles,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { AuthDialog } from "./auth-dialog";
import { supabase } from "@/integrations/supabase/client";
import {
  getAllThreadMetadata,
  togglePinThread,
  renameThread,
  deleteThread,
  getDistinctModelTags,
  type ThreadMetadata,
} from "@/lib/thread-storage";
import { toast } from "sonner";

export function SearchWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModelFilter, setSelectedModelFilter] = useState("All");

  // Local metadata index
  const [metaMap, setMetaMap] = useState<Record<string, ThreadMetadata>>(() => getAllThreadMetadata());

  // Rename modal state
  const [renameTarget, setRenameTarget] = useState<ThreadMetadata | null>(null);
  const [renameTitle, setRenameTitle] = useState("");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<ThreadMetadata | null>(null);

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

  // Supabase threads loader
  useEffect(() => {
    let ignore = false;
    if (!user) {
      Promise.resolve().then(() => {
        if (!ignore) setThreads([]);
      });
      return () => {
        ignore = true;
      };
    }
    void supabase
      .from("threads")
      .select("id,title,updated_at")
      .order("updated_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!ignore) setThreads(data ?? []);
      });
    return () => {
      ignore = true;
    };
  }, [user]);

  // Local metadata loader & listener
  const refreshLocalMeta = () => {
    const all = getAllThreadMetadata();
    setMetaMap(all);
  };

  useEffect(() => {
    window.addEventListener("echo-threads-updated", refreshLocalMeta);
    return () => {
      window.removeEventListener("echo-threads-updated", refreshLocalMeta);
    };
  }, []);

  // Combined threads list: strictly empty when not logged in
  const allChats = useMemo(() => {
    if (!user) {
      return [];
    }

    const list: ThreadMetadata[] = [];
    for (const st of threads) {
      const meta = metaMap[st.id];
      list.push({
        id: st.id,
        title: meta?.title || st.title,
        modelId: meta?.modelId || "echogpt",
        modelName: meta?.modelName || "EchoGPT",
        provider: meta?.provider || "echogpt",
        modelTag: meta?.modelTag || "echogpt",
        isPinned: meta?.isPinned ?? false,
        updated_at: meta?.updated_at || st.updated_at,
      });
    }

    // Sort: Pinned chats first (newest pinnedAt first), then sorted by updated_at desc
    return list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.isPinned && b.isPinned) {
        const pinA = a.pinnedAt ? new Date(a.pinnedAt).getTime() : 0;
        const pinB = b.pinnedAt ? new Date(b.pinnedAt).getTime() : 0;
        if (pinA !== pinB) return pinB - pinA;
      }
      const timeA = a.updated_at ? new Date(a.updated_at).getTime() || 0 : 0;
      const timeB = b.updated_at ? new Date(b.updated_at).getTime() || 0 : 0;
      return timeB - timeA;
    });
  }, [user, threads, metaMap]);

  // Available models derived from user's chats
  const availableModels = useMemo(() => {
    if (!user || allChats.length === 0) {
      return ["All"];
    }
    const set = new Set<string>();
    set.add("All");
    for (const chat of allChats) {
      if (chat.modelTag) set.add(chat.modelTag);
    }
    return Array.from(set);
  }, [user, allChats]);

  // Filtered chats based on text query and selected model
  const filteredChats = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allChats.filter((chat) => {
      // Model match
      if (selectedModelFilter !== "All") {
        if (chat.modelTag.toLowerCase() !== selectedModelFilter.toLowerCase()) {
          return false;
        }
      }

      // Query match (searches title, model tag, model name)
      if (query) {
        const titleMatch = chat.title.toLowerCase().includes(query);
        const modelMatch = chat.modelTag.toLowerCase().includes(query);
        const modelNameMatch = chat.modelName.toLowerCase().includes(query);
        if (!titleMatch && !modelMatch && !modelNameMatch) return false;
      }

      return true;
    });
  }, [allChats, searchQuery, selectedModelFilter]);

  // Date formatter (e.g. "Sep 16", "Sep 8", "Today")
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";

    const now = new Date();
    const diffHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24 && now.getDate() === d.getDate()) {
      return "Today";
    }
    if (diffHours < 48 && now.getDate() - d.getDate() === 1) {
      return "Yesterday";
    }

    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  // Actions
  const handleTogglePin = (chat: ThreadMetadata, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newStatus = togglePinThread(chat.id, {
      title: chat.title,
      modelId: chat.modelId,
      modelName: chat.modelName,
      provider: chat.provider,
      modelTag: chat.modelTag,
      updated_at: chat.updated_at,
    });
    toast.success(newStatus ? `Pinned "${chat.title}"` : `Unpinned "${chat.title}"`);
    refreshLocalMeta();
  };

  const openRenameModal = (chat: ThreadMetadata, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenameTarget(chat);
    setRenameTitle(chat.title);
  };

  const handleSaveRename = async () => {
    if (!renameTarget) return;
    const trimmed = renameTitle.trim();
    if (!trimmed) {
      toast.error("Chat title cannot be empty");
      return;
    }

    renameThread(renameTarget.id, trimmed, {
      modelId: renameTarget.modelId,
      modelName: renameTarget.modelName,
      provider: renameTarget.provider,
      modelTag: renameTarget.modelTag,
      isPinned: renameTarget.isPinned,
      pinnedAt: renameTarget.pinnedAt,
      updated_at: renameTarget.updated_at,
    });

    // If user is logged in, update Supabase too
    if (user) {
      await supabase
        .from("threads")
        .update({ title: trimmed })
        .eq("id", renameTarget.id);

      setThreads((prev) =>
        prev.map((t) => (t.id === renameTarget.id ? { ...t, title: trimmed } : t))
      );
    }

    toast.success("Conversation renamed");
    setRenameTarget(null);
    refreshLocalMeta();
  };

  const openDeleteModal = (chat: ThreadMetadata, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget(chat);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;

    deleteThread(targetId);

    // If user is logged in, delete from Supabase
    if (user) {
      await supabase.from("threads").delete().eq("id", targetId);
    }

    setThreads((prev) => prev.filter((t) => t.id !== targetId));
    toast.success("Conversation deleted");
    setDeleteTarget(null);
    refreshLocalMeta();
  };

  return (
    <div className="soft-grid flex h-dvh min-w-0 bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside className="hidden w-72 shrink-0 lg:block">
        <SidebarNav threads={threads} user={user} />
      </aside>

      {/* Main Content Area */}
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile Sidebar Navigation Toggle */}
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
                <SheetDescription>Conversation history and studio tools</SheetDescription>
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
          <div className="mx-auto max-w-3xl">
            {/* Header / Title block (from Screenshot 1) */}
            <div className="mb-6 pt-4 text-center sm:pt-6">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                My Chat History
              </h1>
              <p className="mt-2 text-xs text-muted-foreground sm:text-sm max-w-lg mx-auto leading-relaxed">
                Access your complete chat history across diverse topics and interactions with different models or characters.
              </p>
            </div>

            {/* Search Input & Model Filter Controls */}
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search chats input (Gemini style) */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70 pointer-events-none" />
                <Input
                  autoFocus
                  aria-label="Search chats"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] pl-11 pr-10 text-sm text-foreground border-border/70 shadow-xs transition-all focus-visible:bg-background focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Model Filter Dropdown (matching Screenshot 1) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 justify-between gap-2.5 rounded-2xl px-4 text-xs sm:text-sm font-medium border-border/70 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] min-w-[140px] shadow-xs cursor-pointer"
                  >
                    <span className="truncate max-w-[130px]">
                      {selectedModelFilter}
                    </span>
                    <ChevronDown className="size-4 text-muted-foreground shrink-0 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 max-h-72 overflow-y-auto rounded-xl p-1.5 shadow-lg border-border/80 bg-popover/95 backdrop-blur-md"
                >
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Filter by Model
                  </div>
                  {availableModels.map((modelTag) => (
                    <DropdownMenuItem
                      key={modelTag}
                      onClick={() => setSelectedModelFilter(modelTag)}
                      className={`cursor-pointer rounded-lg px-2.5 py-2 text-xs font-mono transition-colors ${
                        selectedModelFilter === modelTag
                          ? "bg-accent font-semibold text-accent-foreground"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <span className="truncate">{modelTag}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Chat List Section */}
            {allChats.length === 0 ? (
              /* Global Empty State (from Screenshot 1) */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground mb-4">
                  <MessageSquare className="size-7" />
                </div>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Empty Chat History
                </h2>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                  Access your complete chat history across diverse topics and interactions with different models or characters.
                </p>
                {!user ? (
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <Button
                      className="rounded-xl font-medium shadow-xs"
                      onClick={() => setAuthDialogOpen(true)}
                    >
                      <LogIn className="size-4 mr-2" />
                      Sign in to view history
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl font-medium shadow-xs"
                      onClick={() => router.push(`/chat/${crypto.randomUUID()}`)}
                    >
                      <SquarePen className="size-4 mr-2" />
                      Start a new chat
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="mt-5 rounded-xl font-medium shadow-xs"
                    onClick={() => router.push(`/chat/${crypto.randomUUID()}`)}
                  >
                    <SquarePen className="size-4 mr-2" />
                    Start a new chat
                  </Button>
                )}
              </div>
            ) : filteredChats.length === 0 ? (
              /* Search Query Empty State */
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <p className="text-sm font-medium text-foreground">
                  No chats found matching your search
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try adjusting your search terms or model filter.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-xl text-xs"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedModelFilter("All");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div>
                {/* Section Title (Gemini screenshot: "Recent") */}
                <div className="mb-3 flex items-center justify-between px-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                    Recent
                  </h2>
                  <span className="text-[11px] text-muted-foreground/70">
                    {filteredChats.length} {filteredChats.length === 1 ? "conversation" : "conversations"}
                  </span>
                </div>

                {/* List of Chat Cards / Rows */}
                <div className="space-y-1">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => router.push(`/chat/${chat.id}`)}
                      className={`group relative flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 transition-all hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer ${
                        chat.isPinned ? "bg-primary/[0.035] dark:bg-primary/[0.05] border border-primary/10" : ""
                      }`}
                    >
                      {/* Left: Pin icon + Title + Model badge */}
                      <div className="flex min-w-0 items-center gap-2.5">
                        {chat.isPinned && (
                          <span
                            title="Pinned to top"
                            className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
                          >
                            <Pin className="size-3 rotate-45" />
                          </span>
                        )}
                        <span className="truncate text-sm font-medium text-foreground/90 group-hover:text-foreground">
                          {chat.title}
                        </span>
                        {chat.modelTag && (
                          <span className="hidden sm:inline-flex shrink-0 items-center rounded-md bg-accent/60 px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground/90">
                            {chat.modelTag}
                          </span>
                        )}
                      </div>

                      {/* Right: Date + 3-Dot Hover Action Menu */}
                      <div className="flex shrink-0 items-center gap-2">
                        {/* Formatted Date */}
                        <span className="text-xs text-muted-foreground/70 transition-opacity">
                          {formatDate(chat.updated_at)}
                        </span>

                        {/* 3-Dot Menu Button (Hover action) */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              aria-label="Conversation options"
                              onClick={(e) => e.stopPropagation()}
                              className="flex size-7 items-center justify-center rounded-lg text-muted-foreground/70 opacity-0 group-hover:opacity-100 hover:bg-black/[0.06] hover:text-foreground dark:hover:bg-white/[0.1] transition-all focus-visible:opacity-100"
                            >
                              <MoreVertical className="size-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-40 rounded-xl p-1.5 shadow-lg border-border/80 bg-popover/95 backdrop-blur-md"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Pin / Unpin */}
                            <DropdownMenuItem
                              onClick={(e) => handleTogglePin(chat, e)}
                              className="cursor-pointer gap-2 rounded-lg px-2.5 py-2 text-xs"
                            >
                              {chat.isPinned ? (
                                <>
                                  <PinOff className="size-4 text-muted-foreground" />
                                  <span>Unpin chat</span>
                                </>
                              ) : (
                                <>
                                  <Pin className="size-4 text-muted-foreground" />
                                  <span>Pin to top</span>
                                </>
                              )}
                            </DropdownMenuItem>

                            {/* Rename */}
                            <DropdownMenuItem
                              onClick={(e) => openRenameModal(chat, e)}
                              className="cursor-pointer gap-2 rounded-lg px-2.5 py-2 text-xs"
                            >
                              <Pencil className="size-4 text-muted-foreground" />
                              <span>Rename</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-1" />

                            {/* Delete */}
                            <DropdownMenuItem
                              onClick={(e) => openDeleteModal(chat, e)}
                              className="cursor-pointer gap-2 rounded-lg px-2.5 py-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                              <Trash2 className="size-4 text-destructive" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Rename Dialog */}
      <Dialog
        open={Boolean(renameTarget)}
        onOpenChange={(open) => !open && setRenameTarget(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">Rename Chat</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Enter a new title for this conversation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              autoFocus
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleSaveRename();
                }
              }}
              placeholder="Conversation title"
              className="h-10 rounded-xl bg-background/60"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => setRenameTarget(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="rounded-xl"
              onClick={() => void handleSaveRename()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg text-destructive">
              Delete Chat
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-xl"
              onClick={() => void handleConfirmDelete()}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
}
