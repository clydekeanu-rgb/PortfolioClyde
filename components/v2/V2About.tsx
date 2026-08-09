"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

const paragraphs = [
  "I'm Clyde. I build web apps, AI tools, and business websites using AI-assisted development, and I'm upfront about how that works: tools like Claude and Codex write a lot of the code, while the real work is in the scoping. Figuring out exactly what needs to be built, cutting what doesn't matter, and fixing precisely what's broken instead of guessing.",
  "Before this I spent years in construction project coordination and operations management: documentation, compliance, and day-to-day operations for real businesses. That background shows up in how I work now. I scope things properly before I build, and I don't let a project drift.",
  "Based in the Philippines, working with clients wherever they are. If you've got an idea that needs to become a working product, let's talk.",
];

export function V2About() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          className="v2-display text-[clamp(2rem,4vw,3rem)]"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE_OUT_STRONG }}
        >
          About
        </motion.h2>

        <div className="mt-10 max-w-[65ch] space-y-7">
          {paragraphs.map((text, index) => (
            <motion.p
              key={index}
              className="text-lg leading-relaxed"
              style={{ color: "var(--v2-muted)" }}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: EASE_OUT_STRONG,
              }}
            >
              {text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
