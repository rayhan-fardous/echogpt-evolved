"use client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Copy, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StaggerContainer, StaggerItem } from "@/components/motion/motion-view";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { BrandMark } from "./brand-mark";
import { ChatInputBox } from "./chat-input-box";
import { SidebarNav, type ThreadSummary } from "./sidebar-nav";
import { DEFAULT_MODELS, ALL_MODELS, type AIModel } from "@/lib/models-data";
import { supabase } from "@/integrations/supabase/client";
import { saveThreadMetadata } from "@/lib/thread-storage";

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };
const starters = [
  "Summarize a complex topic",
  "Draft a polished email",
  "Plan my next project",
  "Review and improve writing",
];

export function ChatWorkspace({ threadId }: { threadId?: string }) {
  const [selectedModel, setSelectedModel] = useState<AIModel>(DEFAULT_MODELS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"ready" | "submitted">("ready");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const modelParam = params.get("model") || localStorage.getItem("echo-selected-model");
      if (modelParam) {
        const found = ALL_MODELS.find((m) => m.id === modelParam);
        if (found) {
          setSelectedModel(found);
        }
      }
    } catch {
      // ignore
    }
  }, []);
  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (active) setUser(data.user);
    };
    void loadUser();
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setUser(session?.user ?? null);
      }
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);
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
      .limit(20)
      .then(({ data }) => {
        if (!ignore) setThreads(data ?? []);
      });
    return () => {
      ignore = true;
    };
  }, [user]);
  useEffect(() => {
    let ignore = false;
    if (!user || !threadId) {
      Promise.resolve().then(() => {
        if (!ignore) setMessages([]);
      });
      return () => {
        ignore = true;
      };
    }
    void supabase
      .from("messages")
      .select("id,role,parts")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (ignore) return;
        const loaded = (data ?? []).flatMap((row) => {
          if (row.role !== "user" && row.role !== "assistant") return [];
          const parts = Array.isArray(row.parts) ? row.parts : [];
          const textPart = parts.find(
            (part): part is { type: "text"; text: string } =>
              typeof part === "object" &&
              part !== null &&
              "type" in part &&
              part["type"] === "text" &&
              "text" in part &&
              typeof part["text"] === "string",
          );
          return textPart
            ? [{ id: row.id, role: row.role as ChatMessage["role"], text: textPart.text }]
            : [];
        });
        setMessages(loaded);
      });
    return () => {
      ignore = true;
    };
  }, [threadId, user]);
  const send = async ({ text }: { text: string }) => {
    if (!text.trim() || status === "submitted") return;
    const user: ChatMessage = { id: crypto.randomUUID(), role: "user", text: text.trim() };
    setMessages((v) => [...v, user]);
    setStatus("submitted");
    if (threadId) {
      saveThreadMetadata(threadId, {
        title: text.trim().slice(0, 64),
        model: selectedModel,
        updated_at: new Date().toISOString(),
      });
    }
    const activeUser = (await supabase.auth.getUser()).data.user;
    if (activeUser && threadId) {
      await supabase.from("threads").upsert({
        id: threadId,
        user_id: activeUser.id,
        title: text.trim().slice(0, 64),
      });
      await supabase.from("messages").insert({
        thread_id: threadId,
        user_id: activeUser.id,
        role: "user",
        parts: [{ type: "text", text: text.trim() }],
      });
    }
    setTimeout(() => {
      const assistant = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        text: `I’ve got it. Responses are powered by ${selectedModel.name}. Your thread is preserved securely when you sign in.`,
      };
      setMessages((v) => [...v, assistant]);
      if (activeUser && threadId) {
        void supabase.from("messages").insert({
          thread_id: threadId,
          user_id: activeUser.id,
          role: "assistant",
          parts: [{ type: "text", text: assistant.text }],
        });
      }
      setStatus("ready");
    }, 700);
  };
  return (
    <div className="soft-grid flex h-dvh min-w-0 bg-background text-foreground">
      <aside className="hidden w-[296px] shrink-0 lg:block">
        <SidebarNav threads={threads} user={user} currentThreadId={threadId} />
      </aside>
      <main className="relative flex min-w-0 flex-1 flex-col">
        {/* Floating Mobile Sidebar Navigation Toggle */}
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
                currentThreadId={threadId}
                onSelect={() => setMobileOpen(false)}
                onClose={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
        <Conversation className="min-h-0">
          <ConversationContent className="mx-auto w-full max-w-3xl gap-8 px-4 pb-8 pt-10 sm:px-8">
            {messages.length === 0 ? (
              <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-12"
              >
                <div className="mb-10">
                  <BrandMark className="mb-5 size-12" />
                  <h1 className="font-heading text-4xl font-semibold sm:text-5xl">
                    What are we working on?
                  </h1>
                  <p className="mt-3 max-w-lg text-base text-muted-foreground sm:text-lg">
                    Think through a problem, shape an idea, or turn scattered notes into clear next
                    steps.
                  </p>
                </div>
                <StaggerContainer className="grid gap-3 sm:grid-cols-2" staggerDelay={0.06}>
                  {starters.map((s) => (
                    <StaggerItem key={s}>
                      <motion.div
                        whileHover={{ y: -2, scale: 1.012 }}
                        whileTap={{ scale: 0.985 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <Button
                          variant="outline"
                          className="glass-panel w-full h-auto min-h-16 justify-start whitespace-normal p-4 sm:p-5 text-left rounded-2xl border-border/80 hover:border-primary/40 hover:shadow-md transition-all shadow-xs cursor-pointer"
                          onClick={() => send({ text: s })}
                        >
                          {s}
                        </Button>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </motion.section>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Message from={m.role}>
                      <MessageContent>
                        {m.role === "assistant" ? <MessageResponse>{m.text}</MessageResponse> : m.text}
                      </MessageContent>
                      {m.role === "assistant" && (
                        <MessageActions>
                          <MessageAction
                            tooltip="Copy response"
                            onClick={() => navigator.clipboard.writeText(m.text)}
                          >
                            <Copy />
                          </MessageAction>
                        </MessageActions>
                      )}
                    </Message>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {status === "submitted" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                aria-live="polite"
                className="text-sm text-muted-foreground"
              >
                {selectedModel.name} is thinking…
              </motion.p>
            )}
          </ConversationContent>
          <ConversationScrollButton aria-label="Scroll to latest message" />
        </Conversation>
        <div className="glass-panel shrink-0 border-t border-border px-4 pb-3 pt-3 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <ChatInputBox
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              onSubmit={send}
              status={status}
            />
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {selectedModel.name} can make mistakes. Check important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
