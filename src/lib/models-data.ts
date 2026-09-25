export type ModelTier = "Default" | "Advanced";
export type ModelBadge = "Limited" | "Pro";

export interface AIModel {
  id: string;
  name: string;
  tier: ModelTier;
  provider:
    | "echogpt"
    | "nvidia"
    | "meituan"
    | "deepseek"
    | "glm"
    | "tencent"
    | "mimo"
    | "qwen"
    | "openai"
    | "kimi"
    | "gemini"
    | "minimax"
    | "xai"
    | "meta"
    | "stepfun"
    | "thinkingmachines";
  providerName: string;
  description: string;
  badge?: ModelBadge;
  isDefault?: boolean;
}

export const DEFAULT_MODELS: AIModel[] = [
  {
    id: "echogpt",
    name: "EchoGPT",
    tier: "Default",
    provider: "echogpt",
    providerName: "EchoGPT",
    description:
      "Interact with EchoGPT, an AI that reflects your input for quick ideas, summaries, or feedback. Perfect for brainstorming or rapid dialogue.",
    isDefault: true,
  },
  {
    id: "nemotron-3-ultra",
    name: "Nemotron 3 Ultra",
    tier: "Default",
    provider: "nvidia",
    providerName: "NVIDIA",
    description: "Llama 3.1 Nemotron 70B Instruct",
  },
  {
    id: "longcat-2.0",
    name: "LongCat 2.0",
    tier: "Default",
    provider: "meituan",
    providerName: "Meituan",
    description:
      "LongCat 2.0 from Meituan is free to use, with a 1M token context for long documents and extended chats.",
  },
];

export const ADVANCED_MODELS: AIModel[] = [
  {
    id: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    tier: "Advanced",
    provider: "deepseek",
    providerName: "DeepSeek",
    badge: "Limited",
    description:
      "DeepSeek specializes in advanced data exploration, leveraging AI to deliver accurate, insightful, and efficient solutions for complex analysis.",
  },
  {
    id: "glm-5.2",
    name: "GLM-5.2",
    tier: "Advanced",
    provider: "glm",
    providerName: "Zhipu AI",
    badge: "Limited",
    description:
      "GLM-5.2 offers strong multilingual reasoning and coding across a 1M token context at a low cost per token.",
  },
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    tier: "Advanced",
    provider: "deepseek",
    providerName: "DeepSeek",
    badge: "Limited",
    description:
      "DeepSeek V4 Flash answers quickly over a 1M token context, tuned for rapid iteration at very low cost.",
  },
  {
    id: "tencent-hy3",
    name: "Tencent Hy3",
    tier: "Advanced",
    provider: "tencent",
    providerName: "Tencent",
    badge: "Pro",
    description:
      "Tencent Hunyuan 3 provides fast, budget-friendly responses for everyday chat, drafting, and summarisation.",
  },
  {
    id: "mimo-v2.5-pro",
    name: "MiMo V2.5 Pro",
    tier: "Advanced",
    provider: "mimo",
    providerName: "Xiaomi",
    badge: "Limited",
    description:
      "MiMo V2.5 Pro adds stronger reasoning to the MiMo line while staying inexpensive over a 1M token context.",
  },
  {
    id: "qwen-3.7-plus",
    name: "Qwen 3.7 Plus",
    tier: "Advanced",
    provider: "qwen",
    providerName: "Alibaba Cloud",
    badge: "Limited",
    description:
      "Qwen 3.7 Plus gives near-flagship quality at a fraction of the cost for daily reasoning and drafting.",
  },
  {
    id: "gpt-5.6-sol",
    name: "GPT-5.6 Sol",
    tier: "Advanced",
    provider: "openai",
    providerName: "OpenAI",
    badge: "Limited",
    description:
      "GPT-5.6 Sol delivers OpenAI's flagship reasoning with a 1M token context, ideal for long documents and demanding analysis.",
  },
  {
    id: "kimi-k2.7-code",
    name: "Kimi K2.7 Code",
    tier: "Advanced",
    provider: "kimi",
    providerName: "Moonshot AI",
    badge: "Limited",
    description:
      "Kimi K2.7 Code is built for software work — reading large repositories, writing code, and explaining changes.",
  },
  {
    id: "glm-5.3-flash",
    name: "GLM-5.3 Flash",
    tier: "Advanced",
    provider: "glm",
    providerName: "Zhipu AI",
    badge: "Limited",
    description:
      "GLM-5.3 Flash is the fastest GLM tier, made for high-volume chat where latency matters most.",
  },
  {
    id: "qwen-3.8-27b",
    name: "Qwen 3.8 27B",
    tier: "Advanced",
    provider: "qwen",
    providerName: "Alibaba Cloud",
    badge: "Limited",
    description:
      "Qwen 3.8 27B balances speed and quality for general assistance, coding help, and structured output.",
  },
  {
    id: "qwen-3.7-max",
    name: "Qwen 3.7 Max",
    tier: "Advanced",
    provider: "qwen",
    providerName: "Alibaba Cloud",
    badge: "Limited",
    description:
      "Qwen 3.7 Max is the top Qwen tier for complex reasoning, long-form writing, and detailed technical work.",
  },
  {
    id: "qwen-3.6-plus",
    name: "Qwen 3.6 Plus",
    tier: "Advanced",
    provider: "qwen",
    providerName: "Alibaba Cloud",
    badge: "Limited",
    description:
      "Qwen 3.6 Plus is a dependable general-purpose model for conversation, summarisation, and analysis.",
  },
  {
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    tier: "Advanced",
    provider: "gemini",
    providerName: "Google",
    badge: "Limited",
    description:
      "Gemini 3.8 Flash combines Google's multimodal strengths with fast responses across a 1M token context.",
  },
  {
    id: "kimi-k3",
    name: "Kimi K3",
    tier: "Advanced",
    provider: "kimi",
    providerName: "Moonshot AI",
    badge: "Limited",
    description:
      "Kimi K3 is Moonshot's flagship, built for deep reasoning and agentic work across a 1M token context.",
  },
  {
    id: "minimax-m3",
    name: "MiniMax M3",
    tier: "Advanced",
    provider: "minimax",
    providerName: "MiniMax",
    badge: "Limited",
    description:
      "MiniMax M3 handles long-context conversation and reasoning with an efficient price-to-quality balance.",
  },
  {
    id: "gpt-5.5",
    name: "GPT-5.5",
    tier: "Advanced",
    provider: "openai",
    providerName: "OpenAI",
    badge: "Limited",
    description:
      "Preview GPT’s powerful abilities with GPT-5-5, offering precise yet expansive answers in an accessible, versatile format.",
  },
  {
    id: "gpt-5.6-luna",
    name: "GPT-5.6 Luna",
    tier: "Advanced",
    provider: "openai",
    providerName: "OpenAI",
    badge: "Limited",
    description:
      "GPT-5.6 Luna is the lightweight GPT-5.6 tier — quick, inexpensive, and capable across everyday tasks.",
  },
  {
    id: "grok-4.5",
    name: "Grok 4.5",
    tier: "Advanced",
    provider: "xai",
    providerName: "xAI",
    badge: "Limited",
    description:
      "Grok 4.5 brings xAI's conversational style and current-events awareness to a 500K token context.",
  },
  {
    id: "grok-4.6",
    name: "Grok 4.6",
    tier: "Advanced",
    provider: "xai",
    providerName: "xAI",
    badge: "Limited",
    description:
      "Grok 4.6 is the latest xAI release, improving reasoning and instruction following over Grok 4.5.",
  },
  {
    id: "gemini-3.7-flash",
    name: "Gemini 3.7 Flash",
    tier: "Advanced",
    provider: "gemini",
    providerName: "Google",
    badge: "Limited",
    description:
      "Gemini 3.7 Flash pairs fast multimodal responses with prompt caching for repeated long contexts.",
  },
  {
    id: "gpt-5.4",
    name: "GPT-5.4",
    tier: "Advanced",
    provider: "openai",
    providerName: "OpenAI",
    badge: "Limited",
    description:
      "Preview GPT’s powerful abilities with GPT-5.4, offering precise yet expansive answers in an accessible, versatile format.",
  },
  {
    id: "deepseek-v4-flash-vision",
    name: "DeepSeek V4 Flash Vision",
    tier: "Advanced",
    provider: "deepseek",
    providerName: "DeepSeek",
    badge: "Limited",
    description:
      "DeepSeek V4 Flash Vision is an experimental multimodal tier that reads images alongside text.",
  },
  {
    id: "deepseek-v4-flash-fast",
    name: "DeepSeek V4 Flash Fast",
    tier: "Advanced",
    provider: "deepseek",
    providerName: "DeepSeek",
    badge: "Limited",
    description:
      "DeepSeek V4 Flash Fast prioritises latency, returning answers sooner for interactive use.",
  },
  {
    id: "qwen-3.8-flash",
    name: "Qwen 3.8 Flash",
    tier: "Advanced",
    provider: "qwen",
    providerName: "Alibaba Cloud",
    badge: "Limited",
    description:
      "Qwen 3.8 Flash trades a little depth for speed, ideal for quick answers and high-volume chat.",
  },
  {
    id: "qwen-3.8-max",
    name: "Qwen 3.8 Max",
    tier: "Advanced",
    provider: "qwen",
    providerName: "Alibaba Cloud",
    badge: "Limited",
    description:
      "Qwen 3.8 Max is the latest Qwen flagship, strong at multi-step reasoning over very long context.",
  },
  {
    id: "qwen-3.8-max-0902",
    name: "Qwen 3.8 Max 0902",
    tier: "Advanced",
    provider: "qwen",
    providerName: "Alibaba Cloud",
    badge: "Limited",
    description:
      "Qwen 3.8 Max 0902 is the dated flagship snapshot, pinned for reproducible results on long reasoning tasks.",
  },
  {
    id: "muse-spark-1.2",
    name: "Muse Spark 1.2",
    tier: "Advanced",
    provider: "meta",
    providerName: "Meta",
    badge: "Limited",
    description:
      "Muse Spark 1.2 offers dependable creative and conversational output over a 1M token context.",
  },
  {
    id: "muse-spark-1.3",
    name: "Muse Spark 1.3",
    tier: "Advanced",
    provider: "meta",
    providerName: "Meta",
    badge: "Limited",
    description:
      "Muse Spark 1.3 is Meta's newest Spark model, tuned for creative writing and open-ended conversation.",
  },
  {
    id: "muse-spark-1.3-contributor",
    name: "Muse Spark 1.3 Contributor",
    tier: "Advanced",
    provider: "meta",
    providerName: "Meta",
    badge: "Limited",
    description:
      "Muse Spark 1.3 Contributor is the low-cost community tier of Muse Spark 1.3 for everyday drafting.",
  },
  {
    id: "kimi-k2.7-code-highspeed",
    name: "Kimi K2.7 Code HighSpeed",
    tier: "Advanced",
    provider: "kimi",
    providerName: "Moonshot AI",
    badge: "Limited",
    description:
      "Kimi K2.7 Code HighSpeed keeps the coding strengths of K2.7 while returning results faster.",
  },
  {
    id: "mimo-v2.5",
    name: "MiMo V2.5",
    tier: "Advanced",
    provider: "mimo",
    providerName: "Xiaomi",
    badge: "Limited",
    description:
      "MiMo V2.5 from Xiaomi delivers efficient everyday assistance with one of the lowest costs per token.",
  },
  {
    id: "glm-5.3",
    name: "GLM-5.3",
    tier: "Advanced",
    provider: "glm",
    providerName: "Zhipu AI",
    badge: "Limited",
    description:
      "GLM-5.3 is the latest full GLM tier, strong at multilingual reasoning and code over a 1M token context.",
  },
  {
    id: "glm-5.2-fast",
    name: "GLM-5.2 Fast",
    tier: "Advanced",
    provider: "glm",
    providerName: "Zhipu AI",
    badge: "Limited",
    description:
      "GLM-5.2 Fast is the low-latency GLM-5.2 variant for interactive sessions that cannot wait.",
  },
  {
    id: "step-3.7-flash",
    name: "Step 3.7 Flash",
    tier: "Advanced",
    provider: "stepfun",
    providerName: "StepFun",
    badge: "Limited",
    description:
      "Step 3.7 Flash from StepFun answers quickly and cheaply, suited to short interactive exchanges.",
  },
  {
    id: "step-3.5-flash",
    name: "Step 3.5 Flash",
    tier: "Advanced",
    provider: "stepfun",
    providerName: "StepFun",
    badge: "Limited",
    description:
      "Step 3.5 Flash offers a 1M token context at one of the lowest prices in the catalogue.",
  },
  {
    id: "tencent-hy4-preview",
    name: "Tencent Hy4 Preview",
    tier: "Advanced",
    provider: "tencent",
    providerName: "Tencent",
    badge: "Pro",
    description:
      "Tencent Hunyuan 4 Preview is the newest Hunyuan generation, with a 1M token context for long documents.",
  },
  {
    id: "inkling",
    name: "Inkling",
    tier: "Advanced",
    provider: "thinkingmachines",
    providerName: "Thinking Machines",
    badge: "Limited",
    description:
      "Inkling from Thinking Machines is tuned for careful, well-structured reasoning and clear explanations.",
  },
  {
    id: "inkling-small",
    name: "Inkling Small",
    tier: "Advanced",
    provider: "thinkingmachines",
    providerName: "Thinking Machines",
    badge: "Limited",
    description:
      "Inkling Small is the lighter Inkling tier, keeping the same style at a lower cost per token.",
  },
];

export const ALL_MODELS: AIModel[] = [...DEFAULT_MODELS, ...ADVANCED_MODELS];
