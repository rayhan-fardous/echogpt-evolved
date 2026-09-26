import { ALL_MODELS, type AIModel } from "./models-data";

export interface ThreadMetadata {
  id: string;
  title: string;
  modelId: string;
  modelName: string;
  provider: string;
  modelTag: string; // e.g. "echogpt", "deepseek/deepseek-v4-pro", "nvidia/nemotron-3-ultra-550b-a55b"
  isPinned?: boolean;
  pinnedAt?: string;
  updated_at: string;
}

const STORAGE_KEY = "echo-threads-metadata-v4";

export function formatModelIdentifier(provider: string, modelId: string): string {
  if (provider === "echogpt") return "echogpt";
  if (provider === "nvidia" && modelId.includes("nemotron")) {
    return "nvidia/nemotron-3-ultra-550b-a55b";
  }
  return `${provider}/${modelId}`;
}

export function getModelTagForModel(model: AIModel): string {
  return formatModelIdentifier(model.provider, model.id);
}

export function getAllThreadMetadata(): Record<string, ThreadMetadata> {
  if (typeof window === "undefined") return {};
  try {
    // Purge any legacy seed keys from previous runs
    localStorage.removeItem("echo-threads-metadata");
    localStorage.removeItem("echo-threads-metadata-v2");
    localStorage.removeItem("echo-threads-metadata-v3");

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    const cleaned: Record<string, ThreadMetadata> = {};
    for (const [id, item] of Object.entries(parsed as Record<string, ThreadMetadata>)) {
      if (!id.startsWith("sample-") && !id.startsWith("thread-")) {
        cleaned[id] = item;
      }
    }
    return cleaned;
  } catch {
    return {};
  }
}

export function getThreadMetadata(threadId: string): ThreadMetadata | null {
  const all = getAllThreadMetadata();
  return all[threadId] ?? null;
}

export function saveThreadMetadata(
  threadId: string,
  data: {
    title?: string;
    model?: AIModel;
    modelTag?: string;
    isPinned?: boolean;
    pinnedAt?: string;
    updated_at?: string;
  },
): ThreadMetadata {
  const all = getAllThreadMetadata();
  const existing = all[threadId];

  const modelTag = data.model
    ? getModelTagForModel(data.model)
    : data.modelTag || existing?.modelTag || "echogpt";

  const isPinned = data.isPinned !== undefined ? data.isPinned : existing?.isPinned ?? false;
  const pinnedAt = isPinned ? (data.pinnedAt || existing?.pinnedAt || new Date().toISOString()) : undefined;

  const updated: ThreadMetadata = {
    id: threadId,
    title: data.title || existing?.title || "New conversation",
    modelId: data.model?.id || existing?.modelId || "echogpt",
    modelName: data.model?.name || existing?.modelName || "EchoGPT",
    provider: data.model?.provider || existing?.provider || "echogpt",
    modelTag,
    isPinned,
    pinnedAt,
    updated_at: data.updated_at || new Date().toISOString(),
  };

  all[threadId] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("echo-threads-updated", { detail: { threadId } }));
  } catch {}

  return updated;
}

export function togglePinThread(
  threadId: string,
  fallback?: Partial<ThreadMetadata>,
): boolean {
  const all = getAllThreadMetadata();
  if (!all[threadId]) {
    all[threadId] = {
      id: threadId,
      title: fallback?.title || "New conversation",
      modelId: fallback?.modelId || "echogpt",
      modelName: fallback?.modelName || "EchoGPT",
      provider: fallback?.provider || "echogpt",
      modelTag: fallback?.modelTag || "echogpt",
      isPinned: true,
      pinnedAt: new Date().toISOString(),
      updated_at: fallback?.updated_at || new Date().toISOString(),
    };
  } else {
    const nextPinned = !all[threadId].isPinned;
    all[threadId].isPinned = nextPinned;
    if (nextPinned) {
      all[threadId].pinnedAt = new Date().toISOString();
    } else {
      delete all[threadId].pinnedAt;
    }
    if (fallback?.title && (!all[threadId].title || all[threadId].title === "New conversation")) {
      all[threadId].title = fallback.title;
    }
    if (fallback?.updated_at && !all[threadId].updated_at) {
      all[threadId].updated_at = fallback.updated_at;
    }
    if (fallback?.modelTag && (!all[threadId].modelTag || all[threadId].modelTag === "echogpt")) {
      all[threadId].modelTag = fallback.modelTag;
    }
    if (fallback?.modelName && (!all[threadId].modelName || all[threadId].modelName === "EchoGPT")) {
      all[threadId].modelName = fallback.modelName;
    }
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("echo-threads-updated", { detail: { threadId } }));
  } catch {}
  return Boolean(all[threadId].isPinned);
}

export function renameThread(
  threadId: string,
  newTitle: string,
  fallback?: Partial<ThreadMetadata>,
): void {
  const all = getAllThreadMetadata();
  if (all[threadId]) {
    all[threadId].title = newTitle;
    all[threadId].updated_at = new Date().toISOString();
  } else {
    all[threadId] = {
      id: threadId,
      title: newTitle,
      modelId: fallback?.modelId || "echogpt",
      modelName: fallback?.modelName || "EchoGPT",
      provider: fallback?.provider || "echogpt",
      modelTag: fallback?.modelTag || "echogpt",
      isPinned: fallback?.isPinned ?? false,
      pinnedAt: fallback?.pinnedAt,
      updated_at: new Date().toISOString(),
    };
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("echo-threads-updated", { detail: { threadId } }));
  } catch {}
}

export function deleteThread(threadId: string): void {
  const all = getAllThreadMetadata();
  if (all[threadId]) {
    delete all[threadId];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent("echo-threads-updated", { detail: { threadId } }));
    } catch {}
  }
}

export function getDistinctModelTags(): string[] {
  const all = Object.values(getAllThreadMetadata());
  const set = new Set<string>();
  set.add("All");
  set.add("echogpt");
  set.add("deepseek/deepseek-v4-pro");
  set.add("nvidia/nemotron-3-ultra-550b-a55b");

  for (const t of all) {
    if (t.modelTag) set.add(t.modelTag);
  }

  // Also include popular models
  for (const m of ALL_MODELS.slice(0, 10)) {
    set.add(getModelTagForModel(m));
  }

  return Array.from(set);
}
