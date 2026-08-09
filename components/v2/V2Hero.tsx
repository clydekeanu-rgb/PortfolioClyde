"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { MagneticButton } from "@/components/v2/MagneticButton";
import { projectInquiryMailto } from "@/lib/contact";

const GradientBlinds = dynamic(
  () => import("@/components/ui/GradientBlinds"),
  { ssr: false },
);

const ProfileCard = dynamic(() => import("@/components/ui/ProfileCard"), {
  ssr: false,
});

const headlineLines = [
  {
    key: "line-1",
    content: (
      <>
        I <span className="v2-text-highlight">design and ship</span>
      </>
    ),
  },
  { key: "line-2", content: "working web products." },
];

const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

const GRADIENT_COLORS = ["#FF9FFC", "#5227FF"];

const PROFILE_AVATAR = "/images/add_profile_photo.jpg";

export function V2Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="v2-hero relative flex min-h-[100dvh] items-center overflow-hidden">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {reduceMotion ? (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #5227FF 0%, #FF9FFC 50%, var(--v2-bg) 100%)",
              opacity: 0.45,
            }}
          />
        ) : (
          <div className="absolute inset-0">
            <GradientBlinds
              gradientColors={GRADIENT_COLORS}
              angle={40}
              noise={0.3}
              blindCount={16}
              blindMinWidth={60}
              mouseDampening={0.15}
              mirrorGradient={false}
              spotlightRadius={0.5}
              spotlightSoftness={1}
              spotlightOpacity={1}
              distortAmount={0}
              shineDirection="left"
            />
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(14,15,18,0.1) 0%, rgba(14,15,18,0.2) 50%, var(--v2-bg) 100%)",
          }}
        />
      </div>

      <div className="pointer-events-none relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-16 md:grid-cols-[1.1fr_0.9fr]">
        <div className="pointer-events-auto">
          <motion.p
            className="v2-eyebrow"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {"// full-stack builder, AI-assisted"}
          </motion.p>

          <h1 className="v2-display mt-6 text-[clamp(2.75rem,6vw,4.5rem)]">
            {headlineLines.map((line, i) => (
              <span key={line.key} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={reduceMotion ? false : { y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15 + i * 0.12,
                    ease: EASE_OUT_STRONG,
                  }}
                >
                  {line.content}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-7 max-w-[46ch] text-lg leading-relaxed"
            style={{ color: "var(--v2-muted)" }}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: EASE_OUT_STRONG }}
          >
            Web apps, AI tools, and business websites: scoped carefully, built
            fast, and shipped as products people actually use.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE_OUT_STRONG }}
          >
            <MagneticButton href="#work" className="v2-btn v2-btn-primary">
              View work
            </MagneticButton>
            <a
              href={projectInquiryMailto()}
              className="v2-btn v2-btn-outline"
            >
              Start a project
            </a>
          </motion.div>
        </div>

        <motion.div
          className="pointer-events-auto relative mx-auto flex w-full max-w-sm justify-center md:max-w-none"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE_OUT_STRONG }}
        >
          <ProfileCard
            name="Clyde Abenojar"
            title="AI-assisted Web Builder"
            avatarUrl={PROFILE_AVATAR}
            enableTilt={!reduceMotion}
            enableMobileTilt={false}
            innerGradient="linear-gradient(145deg,#4220828c 0%,#c2ef4e33 100%)"
          />
        </motion.div>
      </div>
    </section>
  );
}
