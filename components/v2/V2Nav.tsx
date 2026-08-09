"use client";

import Link from "next/link";
import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function V2Nav() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 16);
    if (reduceMotion) return;
    setHidden(latest > previous && latest > 120);
  });

  return (
    <motion.header
      className="v2-nav fixed inset-x-0 top-0 z-50"
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      style={{
        borderBottom: scrolled
          ? "1px solid var(--v2-border)"
          : "1px solid transparent",
      }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/v2"
          className="text-[0.9375rem] font-semibold tracking-tight"
          style={{ color: "var(--v2-text)" }}
        >
          Clyde Abenojar
        </Link>
        <div className="flex items-center gap-7">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="v2-nav-link">
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </motion.header>
  );
}
