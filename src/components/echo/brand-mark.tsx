export function BrandMark({ className = "size-9" }: { className?: string }) {
  return (
    <div
      className={`${className} grid shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="size-5" fill="none">
        <path
          d="M8 16c3.3-6.5 6.2-9.7 8.8-9.7 3.8 0 7.2 4.6 7.2 9.7s-3.4 9.7-7.2 9.7c-2.6 0-5.5-3.2-8.8-9.7Z"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path
          d="M4.5 10.5c2 1.1 3.2 3 3.2 5.5s-1.2 4.4-3.2 5.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="17" cy="16" r="2.4" fill="currentColor" />
      </svg>
    </div>
  );
}
