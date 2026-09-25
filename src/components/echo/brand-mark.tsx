import Image from "next/image";

export function BrandMark({ className = "size-9" }: { className?: string }) {
  return (
    <div
      className={`${className} relative shrink-0 select-none overflow-hidden rounded-xl shadow-sm`}
      aria-hidden="true"
    >
      <Image
        src="/logo.png"
        alt="EchoGPT logo"
        width={64}
        height={64}
        className="size-full object-contain"
        priority
      />
    </div>
  );
}
