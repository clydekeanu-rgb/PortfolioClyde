"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TypingAnimation } from "@/components/ui/typing-animation";

type HomepageRedoHeroProps = {
  profileImage: string;
};

export function HomepageRedoHero({ profileImage }: HomepageRedoHeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.55], [0, -48]);

  const photoOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const photoY = useTransform(scrollYProgress, [0, 0.65], [0, -28]);

  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative overflow-hidden pt-32"
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[58%] overflow-hidden"
        style={reduceMotion ? undefined : { opacity: bgOpacity }}
        aria-hidden="true"
      >
        <Image
          src="/images/hero-twilight-landscape.png"
          alt=""
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-[var(--rw-bg)]/40" />
      </motion.div>

      <motion.div
        className="rw-hero-wave pointer-events-none absolute inset-0 z-[1] motion-reduce:hidden"
        style={reduceMotion ? undefined : { opacity: bgOpacity }}
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </motion.div>

      <div className="relative z-[2] mx-auto grid max-w-5xl items-center gap-12 px-6 pb-24 pt-10 md:grid-cols-[1.05fr_0.95fr] md:pt-16">
        <motion.div
          style={
            reduceMotion
              ? undefined
              : { opacity: copyOpacity, y: copyY }
          }
        >
          <p className="font-mono text-sm font-semibold rw-gradient-text">
            {"// full-stack builder, AI-assisted"}
          </p>
          <TypingAnimation
            as="h1"
            className="rw-hero-typing mt-5 text-[clamp(2.5rem,5vw,3rem)] font-bold leading-[1.1] tracking-tight rw-text"
            duration={80}
            delay={200}
            showCursor
            blinkCursor
            cursorStyle="line"
          >
            Hi, I&apos;m Clyde.
          </TypingAnimation>
          <p className="mt-5 max-w-xl text-xl font-semibold leading-[1.4] rw-text">
            I design and ship web apps using AI-assisted development.
          </p>
          <p className="mt-5 max-w-xl text-base leading-[1.6] rw-muted">
            I turn ideas into working products - fast. From AI tools to business
            websites, I use modern AI-assisted workflows to design, build, and
            ship real things people use.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <InteractiveHoverButton
              href="#work"
              className="rw-ihb rw-ihb-fill w-full sm:w-auto"
            >
              &gt; view_work()
            </InteractiveHoverButton>
            <InteractiveHoverButton
              href="#contact"
              className="rw-ihb rw-ihb-outline w-full sm:w-auto"
            >
              &gt; get_in_touch()
            </InteractiveHoverButton>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          style={
            reduceMotion
              ? undefined
              : { opacity: photoOpacity, y: photoY }
          }
        >
          <div className="rw-hero-photo relative aspect-[4/5] overflow-hidden rounded-[12px]">
            <span
              className="rw-hero-photo-glow motion-reduce:hidden"
              aria-hidden="true"
            />
            <Image
              src={profileImage}
              alt="Clyde Abenojar"
              fill
              priority
              className="object-cover"
            />
            <span className="rw-hero-photo-light" aria-hidden="true" />
          </div>
          <div className="rw-badge absolute bottom-5 left-5 inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-semibold backdrop-blur-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--rw-success)" }}
            />
            [ status: available_for_work ]
          </div>
        </motion.div>
      </div>
    </section>
  );
}
