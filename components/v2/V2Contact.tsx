"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

const LiquidChrome = dynamic(() => import("@/components/ui/LiquidChrome"), {
  ssr: false,
});

const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;
const email = "clyde@clydeabenojar.site";
const LIQUID_BASE_COLOR: [number, number, number] = [0.05, 0.06, 0.12];

export function V2Contact() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="contact" className="py-32">
      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-xl border px-6 py-16 text-center"
        style={{ borderColor: "var(--v2-border)" }}
      >
        {!reduceMotion && (
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <LiquidChrome
              baseColor={LIQUID_BASE_COLOR}
              speed={0.35}
              amplitude={0.35}
              frequencyX={2.5}
              frequencyY={1.8}
              interactive
            />
          </div>
        )}

        <div className="pointer-events-none relative z-10">
          <motion.h2
            className="v2-display mx-auto max-w-4xl text-[clamp(2.5rem,6vw,4.25rem)]"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: EASE_OUT_STRONG }}
          >
            Let&apos;s build something.
          </motion.h2>

          <motion.p
            className="mx-auto mt-6 max-w-md text-lg leading-relaxed"
            style={{ color: "var(--v2-muted)" }}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT_STRONG }}
          >
            Open to freelance projects and collaborations.
          </motion.p>

          <motion.div
            className="pointer-events-auto mt-10"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE_OUT_STRONG }}
          >
            <DirectionalFillButton
              href={`mailto:${email}?subject=Project%20Inquiry`}
            >
              Start a project
            </DirectionalFillButton>
          </motion.div>

          <div
            className="pointer-events-auto mx-auto mt-16 flex flex-col items-center gap-3 text-sm sm:flex-row sm:justify-center sm:gap-10"
            style={{ color: "var(--v2-muted)" }}
          >
            <a
              href={`mailto:${email}`}
              className="v2-mono transition-colors hover:text-[var(--v2-text)]"
            >
              {email}
            </a>
            <a
              href="https://www.linkedin.com/in/clyde-keanu-abenojar-b3b578346"
              target="_blank"
              rel="noopener noreferrer"
              className="v2-mono transition-colors hover:text-[var(--v2-text)]"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/clydekeanu-rgb"
              target="_blank"
              rel="noopener noreferrer"
              className="v2-mono transition-colors hover:text-[var(--v2-text)]"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * CTA whose accent fill grows from the exact point the cursor entered,
 * so the hover reads as directional rather than a flat color swap.
 */
function DirectionalFillButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const setOrigin = (event: React.PointerEvent) => {
    const el = ref.current;
    if (!el || event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--fill-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--fill-y", `${event.clientY - rect.top}px`);
  };

  return (
    <a
      ref={ref}
      href={href}
      className="v2-btn v2-btn-fill px-9 py-4 text-base"
      onPointerEnter={setOrigin}
      onPointerLeave={setOrigin}
    >
      <span className="v2-btn-fill-circle" aria-hidden="true" />
      <span>{children}</span>
    </a>
  );
}
