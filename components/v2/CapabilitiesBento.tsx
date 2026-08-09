"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Loader2, Play } from "lucide-react";

const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

const cellVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_STRONG },
  },
};

export function CapabilitiesBento() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          className="v2-display text-[clamp(2rem,4vw,3rem)]"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE_OUT_STRONG }}
        >
          What I can build for you
        </motion.h2>

        <motion.div
          className="mt-12 grid gap-4 md:grid-cols-6"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          transition={{ staggerChildren: 0.07 }}
        >
          {/* A: Web apps & SaaS + live micro-demo */}
          <motion.div
            variants={cellVariants}
            className="v2-card flex flex-col justify-between gap-10 p-7 sm:p-9 md:col-span-4 md:row-span-2"
          >
            <div>
              <h3
                className="text-xl font-semibold tracking-tight sm:text-2xl"
                style={{ color: "var(--v2-text)" }}
              >
                Web apps &amp; SaaS
              </h3>
              <p
                className="mt-3 max-w-[52ch] leading-relaxed"
                style={{ color: "var(--v2-muted)" }}
              >
                Full products: landing page, auth, dashboard, and the paywall
                that makes it worth paying for. Scoped first, then shipped.
              </p>
            </div>
            <ShipDemo />
          </motion.div>

          {/* B: AI tools (image cell) */}
          <motion.div
            variants={cellVariants}
            className="v2-card relative overflow-hidden md:col-span-2"
          >
            <Image
              src="/images/lumina-promptbuilder.png"
              alt="Lumina Studio prompt builder interface"
              fill
              quality={60}
              sizes="(max-width: 768px) 92vw, 360px"
              className="object-cover object-top opacity-30"
            />
            <div
              className="relative flex h-full min-h-[13rem] flex-col justify-end p-7"
              style={{
                background:
                  "linear-gradient(to top, rgba(14,15,18,0.92) 30%, rgba(14,15,18,0.35))",
              }}
            >
              <h3
                className="text-xl font-semibold tracking-tight"
                style={{ color: "var(--v2-text)" }}
              >
                AI tools
              </h3>
              <p
                className="mt-2 text-[0.9375rem] leading-relaxed"
                style={{ color: "var(--v2-muted)" }}
              >
                Image studios, content pipelines, and prompt-driven systems
                that non-technical users can actually operate.
              </p>
            </div>
          </motion.div>

          {/* C: Chatbots (spotlight cell) */}
          <SpotlightCell />

          {/* D: Business websites (image cell) */}
          <motion.div
            variants={cellVariants}
            className="v2-card overflow-hidden md:col-span-3"
          >
            <div
              className="relative m-3 aspect-[16/8] overflow-hidden rounded-[8px] border"
              style={{
                borderColor: "var(--v2-border)",
                background: "var(--v2-elevated)",
              }}
            >
              <Image
                src="/images/pickle-landing.png"
                alt="The Pickleball Pavilion landing page"
                fill
                quality={60}
                sizes="(max-width: 768px) 92vw, 520px"
                className="object-cover object-top"
              />
            </div>
            <div className="p-7 pt-4">
              <h3
                className="text-xl font-semibold tracking-tight"
                style={{ color: "var(--v2-text)" }}
              >
                Business websites
              </h3>
              <p
                className="mt-2 text-[0.9375rem] leading-relaxed"
                style={{ color: "var(--v2-muted)" }}
              >
                Landing pages and booking sites built clean and fast, designed
                to turn visitors into inquiries.
              </p>
            </div>
          </motion.div>

          {/* E: 3D modeling (image cell) */}
          <motion.div
            variants={cellVariants}
            className="v2-card relative overflow-hidden md:col-span-3"
          >
            <Image
              src="/images/capability-3d-rendering.png"
              alt="Architectural 3D rendering of a modern residence at dusk"
              fill
              quality={70}
              sizes="(max-width: 768px) 92vw, 520px"
              className="object-cover object-center"
            />
            <div
              className="relative flex h-full min-h-[13rem] flex-col justify-end p-7"
              style={{
                background:
                  "linear-gradient(to top, rgba(14,15,18,0.92) 28%, rgba(14,15,18,0.35) 70%, rgba(14,15,18,0.15))",
              }}
            >
              <h3
                className="text-xl font-semibold tracking-tight"
                style={{ color: "var(--v2-text)" }}
              >
                3D modeling &amp; rendering
              </h3>
              <p
                className="mt-2 text-[0.9375rem] leading-relaxed"
                style={{ color: "var(--v2-muted)" }}
              >
                Architectural rendering and 3D visuals for projects that need
                more than the browser.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function SpotlightCell() {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      variants={cellVariants}
      onMouseMove={handleMouseMove}
      className="v2-card v2-spotlight flex min-h-[13rem] flex-col justify-end p-7 md:col-span-2"
    >
      <h3
        className="text-xl font-semibold tracking-tight"
        style={{ color: "var(--v2-text)" }}
      >
        Chatbots &amp; integrations
      </h3>
      <p
        className="mt-2 text-[0.9375rem] leading-relaxed"
        style={{ color: "var(--v2-muted)" }}
      >
        Custom chatbots embedded into your existing site to answer customers
        automatically. No rebuild required.
      </p>
    </motion.div>
  );
}

type ShipState = "idle" | "running" | "done";

/** Working micro-interaction: a state-morphing deploy button. */
function ShipDemo() {
  const [state, setState] = useState<ShipState>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const run = () => {
    if (state !== "idle") return;
    setState("running");
    timers.current.push(setTimeout(() => setState("done"), 1200));
    timers.current.push(setTimeout(() => setState("idle"), 2800));
  };

  return (
    <div
      className="flex flex-col items-start gap-4 rounded-[8px] border p-6 sm:flex-row sm:items-center sm:justify-between"
      style={{
        borderColor: "var(--v2-border)",
        background: "var(--v2-elevated)",
      }}
    >
      <p className="v2-eyebrow">{"// live micro-demo"}</p>
      <button
        type="button"
        onClick={run}
        className="v2-btn v2-btn-primary min-w-[9.5rem] !py-3 text-sm"
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={state}
            className="inline-flex items-center gap-2"
            initial={{ opacity: 0, filter: "blur(4px)", y: 4 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(4px)", y: -4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            {state === "idle" && (
              <>
                <Play className="h-4 w-4" strokeWidth={2} />
                Run deploy
              </>
            )}
            {state === "running" && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Building
              </>
            )}
            {state === "done" && (
              <>
                <Check className="h-4 w-4" strokeWidth={2} />
                Deployed
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
