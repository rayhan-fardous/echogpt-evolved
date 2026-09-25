import React from "react";
import type { AIModel } from "@/lib/models-data";

interface ModelIconProps {
  provider: AIModel["provider"];
  className?: string;
}

export function ModelIcon({ provider, className = "size-6" }: ModelIconProps) {
  switch (provider) {
    case "echogpt":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3/4 text-white">
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.6" opacity="0.75" />
            <path
              d="M12 2.5C14.5 5 15.8 8.5 15.8 12C15.8 15.5 14.5 19 12 21.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M12 2.5C9.5 5 8.2 8.5 8.2 12C8.2 15.5 9.5 19 12 21.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <ellipse cx="12" cy="12" rx="3.5" ry="9.5" stroke="currentColor" strokeWidth="1.3" opacity="0.6" />
          </svg>
        </div>
      );

    case "nvidia":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-[#76B900] shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3/4 text-white">
            <path
              d="M7.8 7.2C10.2 5.5 13.5 5.7 15.6 7.6C17.6 9.4 18 12.3 16.7 14.6C15.7 16.3 13.9 17.4 12 17.4C10.6 17.4 9.3 16.8 8.4 15.8L10 14.4C10.5 15 11.2 15.4 12 15.4C13.1 15.4 14.1 14.7 14.7 13.7C15.5 12.3 15.3 10.5 14.1 9.4C12.8 8.3 10.9 8.2 9.4 9.2L7.8 7.2Z"
              fill="currentColor"
            />
            <path
              d="M5.3 5.3C9 2.5 14.3 2.7 17.6 5.8C20.8 8.8 21.5 13.6 19.3 17.4C17.7 20.2 14.8 21.9 11.7 21.9C9.4 21.9 7.3 21 5.7 19.4L7.2 17.9C8.4 19.1 10 19.9 11.7 19.9C14 19.9 16.2 18.5 17.4 16.3C19.2 13.2 18.6 9.3 16 6.8C13.3 4.3 9 4.1 6 6.3L5.3 5.3Z"
              fill="currentColor"
            />
          </svg>
        </div>
      );

    case "meituan":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-[#18181b] shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3/4">
            <path
              d="M5.5 6L8.5 9.5C9.6 9.2 10.8 9 12 9C13.2 9 14.4 9.2 15.5 9.5L18.5 6L17.5 11.2C19.1 12.7 20 14.7 20 17C20 19.2 16.4 21 12 21C7.6 21 4 19.2 4 17C4 14.7 4.9 12.7 6.5 11.2L5.5 6Z"
              fill="#27272a"
            />
            <circle cx="9" cy="14.5" r="1.8" fill="#00f2fe" />
            <circle cx="15" cy="14.5" r="1.8" fill="#00f2fe" />
            <circle cx="9.4" cy="14.2" r="0.7" fill="#ffffff" />
            <circle cx="15.4" cy="14.2" r="0.7" fill="#ffffff" />
          </svg>
        </div>
      );

    case "deepseek":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-[#0066FF] shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3/4 text-white">
            <path
              d="M4.5 14.2C5.8 11.2 9 8.5 13.5 8.2C17.5 8 20 10.5 20.5 12.8C21 14.8 19.8 16.8 18 17.5C15.2 18.6 11.8 17.5 9.8 16.2C8.2 15.1 6.2 15.4 4.5 14.2Z"
              fill="currentColor"
            />
            <path
              d="M6 14C8.2 12.5 12 11.8 15 13.2C13.2 15 10 16 7.5 15.5L6 14Z"
              fill="#93c5fd"
            />
            <circle cx="16.5" cy="11.5" r="1" fill="#0066FF" />
          </svg>
        </div>
      );

    case "glm":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-[#18181b] shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3/4 text-white">
            <path
              d="M6 7.5H17.5L9.5 16.5H18"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case "tencent":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0052D9] via-[#00A4FF] to-[#00E5FF] shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3/4 text-white">
            <path
              d="M6.5 7.5C6.5 5.5 8.2 4 10.2 4C11.5 4 12.7 4.7 13.4 5.8C14.1 4.7 15.3 4 16.6 4C18.6 4 20.3 5.5 20.3 7.5C20.3 11 13.4 15.5 13.4 15.5C13.4 15.5 6.5 11 6.5 7.5Z"
              fill="currentColor"
              opacity="0.9"
            />
            <path
              d="M4.5 14C4.5 12.5 5.8 11.5 7.2 11.5C8.2 11.5 9 12 9.5 12.8C10 12 10.8 11.5 11.8 11.5C13.2 11.5 14.5 12.5 14.5 14C14.5 16.5 9.5 19.5 9.5 19.5C9.5 19.5 4.5 16.5 4.5 14Z"
              fill="#e0f2fe"
            />
          </svg>
        </div>
      );

    case "mimo":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-[#FF6700] shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3/4 text-white">
            <rect x="5.5" y="6" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M9 14V10L12 12.5L15 10V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );

    case "qwen":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#615ced] via-[#7b61ff] to-[#a079ff] shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3/4 text-white">
            <polygon points="12,3.5 19.5,8 19.5,16 12,20.5 4.5,16 4.5,8" stroke="currentColor" strokeWidth="1.8" fill="none" />
            <polygon points="12,7 16,9.5 16,14.5 12,17 8,14.5 8,9.5" fill="currentColor" opacity="0.75" />
          </svg>
        </div>
      );

    case "openai":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-[#10A37F] text-white shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-3/4">
            <path d="M20.5 10.2a5.4 5.4 0 0 0-.4-4.2 5.5 5.5 0 0 0-5.1-2.7 5.3 5.3 0 0 0-3.4 1.2 5.4 5.4 0 0 0-4.6-.2 5.5 5.5 0 0 0-3.3 4 5.3 5.3 0 0 0-1.8 3.1 5.4 5.4 0 0 0 1 5 5.4 5.4 0 0 0 .4 4.2 5.5 5.5 0 0 0 5.1 2.7 5.3 5.3 0 0 0 3.4-1.2 5.4 5.4 0 0 0 4.6.2 5.5 5.5 0 0 0 3.3-4 5.3 5.3 0 0 0 1.8-3.1 5.4 5.4 0 0 0-1-5.1zm-8.5 10.3c-1.2 0-2.3-.5-3.1-1.3l.1-.1 3.5-2a.7.7 0 0 0 .4-.6v-4.9l1.6.9v4.5c0 1.9-1.6 3.5-3.5 3.5zm-6.7-4.1a3.4 3.4 0 0 1-.4-3.3l.1.1 3.5 2a.7.7 0 0 0 .7 0l4.2-2.5v1.9l-3.9 2.2a3.5 3.5 0 0 1-4.2-.4zm-1.1-7.8c.4-1.1 1.3-2 2.4-2.5v.2l3.5 2a.7.7 0 0 0 .7.4l-4.2 2.5v-1.9l-2.4-2.7zm11.7 4.1-4.2-2.5 1.6-.9 4.2 2.5a.7.7 0 0 0 .7 0l3.5-2v.2a3.5 3.5 0 0 1-5.8 2.7zm2.4-3.3-3.5-2a.7.7 0 0 0-.7 0l-4.2 2.5v-1.9l3.9-2.2a3.5 3.5 0 0 1 4.5 3.6zm-5-3c0-1.9 1.6-3.5 3.5-3.5 1.2 0 2.3.5 3.1 1.3l-.1.1-3.5 2a.7.7 0 0 0-.4.6v4.9l-1.6-.9V6.4z" />
          </svg>
        </div>
      );

    case "kimi":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-[#18181b] shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3/4 text-white">
            <path
              d="M7 6V18M7 12L17 5M10.5 10.5L17.5 19"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="17.5" cy="5" r="1.5" fill="#38bdf8" />
          </svg>
        </div>
      );

    case "gemini":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#1b72e8] via-[#7c3aed] to-[#e84393] shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-3/4 text-white">
            <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" />
          </svg>
        </div>
      );

    case "minimax":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3/4 text-white">
            <path
              d="M5 16V8M9 19V5M13 17V7M17 19V5M21 15V9"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );

    case "xai":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-[#09090b] shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-3/4 text-white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      );

    case "meta":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-[#0081FB] shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3/4 text-white">
            <path
              d="M16.5 8C14.7 8 13.2 9.2 12 10.8C10.8 9.2 9.3 8 7.5 8C4.5 8 2.5 10.5 2.5 13.5C2.5 16.5 4.8 19 7.8 19C10.2 19 12 17.2 12 17.2C12 17.2 13.8 19 16.2 19C19.2 19 21.5 16.5 21.5 13.5C21.5 10.5 19.5 8 16.5 8ZM7.5 16.8C5.8 16.8 4.5 15.4 4.5 13.5C4.5 11.6 5.8 10.2 7.5 10.2C9.2 10.2 10.5 11.8 11.4 13.5C10.5 15.2 9.2 16.8 7.5 16.8ZM16.5 16.8C14.8 16.8 13.5 15.2 12.6 13.5C13.5 11.8 14.8 10.2 16.5 10.2C18.2 10.2 19.5 11.6 19.5 13.5C19.5 15.4 18.2 16.8 16.5 16.8Z"
              fill="currentColor"
            />
          </svg>
        </div>
      );

    case "stepfun":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#10B981] to-[#06B6D4] shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3/4 text-white">
            <path
              d="M6 18H10V14H14V10H18V6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case "thinkingmachines":
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] shadow-xs`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3/4 text-white">
            <path
              d="M12 3C12 3 7 10 7 14.5C7 17.3 9.2 19.5 12 19.5C14.8 19.5 17 17.3 17 14.5C17 10 12 3 12 3Z"
              fill="currentColor"
              opacity="0.9"
            />
            <circle cx="12" cy="14.5" r="2" fill="#e0e7ff" />
          </svg>
        </div>
      );

    default:
      return (
        <div
          className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary`}
          aria-hidden="true"
        >
          <div className="size-2 rounded-full bg-primary" />
        </div>
      );
  }
}
