"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: 0.55,
        delay,
        ease: EASE_OUT_STRONG,
      }}
    >
      {children}
    </motion.div>
  );
}

type SectionHeadingProps = {
  children: string;
  center?: boolean;
  className?: string;
};

export function SectionHeading({
  children,
  center = false,
  className,
}: SectionHeadingProps) {
  return (
    <p
      className={cn(
        "v2-eyebrow",
        center && "text-center",
        className,
      )}
    >
      {`// ${children.toLowerCase()}`}
    </p>
  );
}
