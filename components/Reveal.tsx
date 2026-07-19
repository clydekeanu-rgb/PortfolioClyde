"use client";

import { useReducedMotion } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <BlurFade
      inView
      direction="up"
      offset={40}
      duration={0.6}
      blur="4px"
      delay={delay}
      className={className}
    >
      {children}
    </BlurFade>
  );
}
