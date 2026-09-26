"use client";

import { cn } from "@/lib/utils";
import type { MotionProps, MotionStyle } from "motion/react";
import { motion } from "motion/react";
import type { CSSProperties, ElementType, JSX } from "react";
import { memo, useMemo } from "react";

type MotionHTMLProps = MotionProps & Record<string, unknown>;

const staticMotionComponents: Record<string, React.ComponentType<MotionHTMLProps>> = {
  p: motion.p as unknown as React.ComponentType<MotionHTMLProps>,
  span: motion.span as unknown as React.ComponentType<MotionHTMLProps>,
  div: motion.div as unknown as React.ComponentType<MotionHTMLProps>,
  h1: motion.h1 as unknown as React.ComponentType<MotionHTMLProps>,
  h2: motion.h2 as unknown as React.ComponentType<MotionHTMLProps>,
  h3: motion.h3 as unknown as React.ComponentType<MotionHTMLProps>,
};

export interface TextShimmerProps {
  children: string;
  as?: ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

const ShimmerComponent = ({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) => {
  const MotionComponent =
    staticMotionComponents[Component as string] || staticMotionComponents.p;

  const dynamicSpread = useMemo(() => (children?.length ?? 0) * spread, [children, spread]);

  return (
    <MotionComponent
      animate={{ backgroundPosition: "0% center" }}
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent",
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
        className,
      )}
      initial={{ backgroundPosition: "100% center" }}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          backgroundImage:
            "var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))",
        } as CSSProperties & MotionStyle
      }
      transition={{
        duration,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      }}
    >
      {children}
    </MotionComponent>
  );
};

export const Shimmer = memo(ShimmerComponent);
