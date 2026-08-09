"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MagneticButton } from "@/components/v2/MagneticButton";

const GradientBlinds = dynamic(
  () => import("@/components/ui/GradientBlinds"),
  { ssr: false },
);

const Lanyard = dynamic(() => import("@/components/ui/Lanyard/Lanyard"), {
  ssr: false,
});

const headlineLines = ["I design and ship", "working web products."];

const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

const GRADIENT_COLORS = ["#FF9FFC", "#5227FF"];

export function V2Hero() {
  const reduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const showLanyard = !reduceMotion && isDesktop;

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
              "linear-gradient(to bottom, rgba(14,15,18,0.4) 0%, rgba(14,15,18,0.55) 50%, var(--v2-bg) 100%)",
          }}
        />
      </div>

      {showLanyard && (
        <motion.div
          className="absolute inset-0 z-[5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE_OUT_STRONG }}
          aria-hidden="true"
        >
          <div className="absolute inset-y-0 right-0 top-0 h-full w-full md:w-[min(52%,38rem)]">
            <Lanyard
              position={[0, 0, 22]}
              gravity={[0, -40, 0]}
              frontImage="/images/add_profile_photo.jpg"
              imageFit="cover"
              lanyardWidth={1.2}
            />
          </div>
        </motion.div>
      )}

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
              <span key={line} className="block overflow-hidden pb-[0.08em]">
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
                  {line}
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
              href="mailto:clyde@clydeabenojar.site?subject=Project%20Inquiry"
              className="v2-btn v2-btn-outline"
            >
              Start a project
            </a>
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-sm md:max-w-none">
          {showLanyard ? (
            <div className="aspect-[4/5] w-full" aria-hidden="true" />
          ) : (
            <div
              className="pointer-events-auto relative aspect-[4/5] overflow-hidden rounded-[12px] border"
              style={{ borderColor: "var(--v2-border)" }}
            >
              <Image
                src="/images/add_profile_photo.jpg"
                alt="Clyde Abenojar"
                fill
                priority
                quality={75}
                sizes="(max-width: 768px) 90vw, 460px"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
