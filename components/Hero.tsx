"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

const items = [
  "// full-stack builder, AI-assisted",
  "Hi, I'm Clyde.",
  "I design and ship web apps using AI-assisted development.",
  "I turn ideas into working products - fast. From AI tools to business websites, I use modern AI-assisted workflows to design, build, and ship real things people use.",
];

const profileImage = "/images/add_profile_photo.jpg";

type DotWaveInstance = {
  destroy: () => void;
};

type DotWaveConstructor = new (options: Record<string, unknown>) => DotWaveInstance;

export function Hero() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced || reduceMotion) {
      return;
    }

    let dotWaveInstance: DotWaveInstance | null = null;
    let script: HTMLScriptElement | null = null;

    const initDotWave = () => {
      const DotWave = (window as Window & { DotWave?: DotWaveConstructor })
        .DotWave;
      const container = document.getElementById("hero-canvas");

      if (!DotWave || !container || container.querySelector("canvas")) {
        return;
      }

      dotWaveInstance = new DotWave({
        container,
        numDots: 150,
        dotColor: "#7C3AED",
        backgroundColor: "transparent",
        dotMinOpacity: 0.15,
        dotMaxOpacity: 0.5,
        influenceRadius: 180,
        dotStretch: true,
        zIndex: 0,
      });
    };

    const existingScript = document.querySelector(
      'script[src="/libs/dotwave.min.js"]',
    );

    if (existingScript && (window as Window & { DotWave?: DotWaveConstructor }).DotWave) {
      initDotWave();
    } else {
      script = document.createElement("script");
      script.src = "/libs/dotwave.min.js";
      script.async = true;
      script.onload = initDotWave;
      document.body.appendChild(script);
    }

    return () => {
      dotWaveInstance?.destroy();
      if (script?.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [reduceMotion]);

  return (
    <>
      <span id="top" className="sr-only" aria-hidden="true" />
      <section
        id="hero-canvas"
        className="relative overflow-hidden pt-32"
      >
      <div className="relative z-[1] mx-auto grid max-w-5xl items-center gap-12 px-6 pb-24 pt-10 md:grid-cols-[1.05fr_0.95fr] md:pt-16">
        <div>
          <motion.p
            className="text-sm font-semibold text-accent"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            {items[0]}
          </motion.p>
          <motion.h1
            className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-normal text-primary"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            {items[1]}
            <span
              className="ml-1 inline-block text-accent"
              style={{ animation: "blink 1s step-end infinite" }}
            >
              |
            </span>
          </motion.h1>
          <motion.p
            className="mt-5 max-w-xl text-xl font-semibold leading-8 text-primary"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
          >
            {items[2]}
          </motion.p>
          <motion.p
            className="mt-5 max-w-xl text-base leading-7 text-secondary"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.32 }}
          >
            {items[3]}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.42 }}
          >
            <a
              href="#work"
              className="rounded-md bg-accent px-5 py-3 text-center text-sm font-semibold text-background transition-shadow hover:shadow-glow"
            >
              &gt; view_work()
            </a>
            <a
              href="#contact"
              className="rounded-md border border-border bg-transparent px-5 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent-soft"
            >
              &gt; get_in_touch()
            </a>
          </motion.div>
        </div>

        <motion.div
          className="relative"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease: "easeOut" }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-accent bg-surface shadow-soft">
            <Image
              src={profileImage}
              alt="Clyde Abenojar"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2 text-xs font-semibold text-primary shadow-glow backdrop-blur-sm">
            <span
              className="h-2.5 w-2.5 rounded-full bg-emerald-400"
              style={{ animation: "pulse-dot 1.6s ease-in-out infinite" }}
            />
            [ status: available_for_work ]
          </div>
        </motion.div>
      </div>
    </section>
    </>
  );
}
