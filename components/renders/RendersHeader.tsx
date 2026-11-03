"use client";

import Link from "next/link";
import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { ArrowLeft, Sparkles, Send } from "lucide-react";

export function RendersHeader() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 20);
    if (reduceMotion) return;
    setHidden(latest > previous && latest > 150);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-200"
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ type: "spring", bounce: 0, duration: 0.35 }}
      style={{
        backgroundColor: scrolled
          ? "rgba(14, 15, 18, 0.85)"
          : "rgba(14, 15, 18, 0.4)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: scrolled
          ? "1px solid var(--v2-border)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors hover:text-[var(--v2-text)]"
            style={{ color: "var(--v2-muted)" }}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Portfolio</span>
          </Link>
          <span
            className="hidden sm:inline-block h-3.5 w-px"
            style={{ backgroundColor: "var(--v2-border)" }}
            aria-hidden="true"
          />
          <div className="hidden sm:flex items-center gap-2">
            <span
              className="text-sm font-semibold tracking-tight"
              style={{ color: "var(--v2-text)" }}
            >
              Clyde Abenojar
            </span>
            <span
              className="v2-mono rounded-full border px-2 py-0.5 text-[11px]"
              style={{
                borderColor: "var(--v2-border)",
                backgroundColor: "var(--v2-surface)",
                color: "var(--v2-faint)",
              }}
            >
              3D & ArchViz
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#gallery"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[var(--v2-text)]"
            style={{ color: "var(--v2-muted)" }}
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--v2-accent-text)]" />
            <span>Gallery</span>
          </a>
          <a
            href="#inquire"
            className="v2-btn v2-btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Inquire for 3D Work</span>
          </a>
        </div>
      </div>
    </motion.header>
  );
}
