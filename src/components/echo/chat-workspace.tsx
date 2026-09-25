"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Archive,
  ChevronDown,
  Copy,
  Image,
  LogOut,
  Menu,
  Mic,
  Moon,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Settings,
  Share2,
  Sun,
  Video,
} from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { BrandMark } from "./brand-mark";
import { ModelSelector } from "./model-selector";
import { SidebarNav, type ThreadSummary } from "./sidebar-nav";
import { DEFAULT_MODELS, type AIModel } from "@/lib/models-data";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };
const starters = [
  "Summarize a complex topic",
  "Draft a polished email",
  "Plan my next project",
  "Review and improve writing",
];

function AuthDialog() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setNotice(error ? error.message : "Signed in successfully.");
  };
  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setNotice(error ? error.message : "Check your email to confirm your account.");
  };
  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setNotice(result.error.message);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-background/55">
          Sign in
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <BrandMark className="mb-2 size-12" />
          <DialogTitle className="font-heading text-2xl">Welcome to EchoGPT</DialogTitle>
          <DialogDescription>Sign in to sync conversations across devices.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Button variant="outline" className="h-11 w-full" onClick={google}>
            Continue with Google
          </Button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or use email
            <span className="h-px flex-1 bg-border" />
          </div>
          <Input
            aria-label="Email address"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            aria-label="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={signIn}>Sign in</Button>
            <Button variant="outline" onClick={signUp}>
              Create account
            </Button>
          </div>
          {notice && (
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {notice}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ChatWorkspace({ threadId }: { threadId?: string }) {
  const [selectedModel, setSelectedModel] = useState<AIModel>(DEFAULT_MODELS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"ready" | "submitted">("ready");
  const [mobileOpen, setMobileOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId, status]);
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
    if (!user) {
      setThreads([]);
      return;
    }
    void supabase
      .from("threads")
      .select("id,title,updated_at")
      .order("updated_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setThreads(data ?? []));
  }, [user]);
  useEffect(() => {
    if (!user || !threadId) {
      setMessages([]);
      return;
    }
    void supabase
      .from("messages")
      .select("id,role,parts")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
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
  }, [threadId, user]);
  const send = async ({ text }: { text: string }) => {
    if (!text.trim() || status === "submitted") return;
    const user: ChatMessage = { id: crypto.randomUUID(), role: "user", text: text.trim() };
    setMessages((v) => [...v, user]);
    setStatus("submitted");
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
      <aside className="hidden w-72 shrink-0 lg:block">
        <SidebarNav threads={threads} user={user} currentThreadId={threadId} />
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="glass-panel grid h-16 shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  aria-label="Open navigation"
                  variant="ghost"
                  size="icon"
                  className="min-h-11 min-w-11 lg:hidden"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[86vw] max-w-72 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription>Conversation history and studio tools</SheetDescription>
                </SheetHeader>
                <SidebarNav
                  threads={threads}
                  user={user}
                  currentThreadId={threadId}
                  onSelect={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <ModelSelector
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
            />
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              aria-label="Share conversation"
              variant="ghost"
              size="icon"
              className="min-h-11 min-w-11"
            >
              <Share2 />
            </Button>
            {!user && <AuthDialog />}
          </div>
        </header>
        <Conversation className="min-h-0">
          <ConversationContent className="mx-auto w-full max-w-3xl gap-8 px-4 pb-8 pt-10 sm:px-8">
            {messages.length === 0 ? (
              <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-12">
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
                <div className="grid gap-3 sm:grid-cols-2">
                  {starters.map((s) => (
                    <Button
                      key={s}
                      variant="outline"
                      className="glass-panel h-auto min-h-16 justify-start whitespace-normal p-4 text-left"
                      onClick={() => send({ text: s })}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </section>
            ) : (
              messages.map((m) => (
                <Message key={m.id} from={m.role}>
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
              ))
            )}
            {status === "submitted" && (
              <p aria-live="polite" className="text-sm text-muted-foreground">
                {selectedModel.name} is thinking…
              </p>
            )}
          </ConversationContent>
          <ConversationScrollButton aria-label="Scroll to latest message" />
        </Conversation>
        <div className="glass-panel shrink-0 border-t border-border px-4 pb-3 pt-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <PromptInput
              onSubmit={send}
              className="rounded-xl border-border bg-background/70 shadow-lg backdrop-blur-xl"
            >
              <PromptInputTextarea
                ref={textareaRef}
                placeholder={`Ask ${selectedModel.name} anything…`}
                className="min-h-16 px-4 pt-4 text-base"
              />
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputButton tooltip="Attach file" aria-label="Attach file">
                    <Paperclip />
                  </PromptInputButton>
                  <PromptInputButton tooltip="Use voice" aria-label="Use voice">
                    <Mic />
                  </PromptInputButton>
                </PromptInputTools>
                <PromptInputSubmit
                  status={status}
                  disabled={status === "submitted"}
                  className="size-10 rounded-lg"
                  aria-label="Send message"
                />
              </PromptInputFooter>
            </PromptInput>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {selectedModel.name} can make mistakes. Check important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
