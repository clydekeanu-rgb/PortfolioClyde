"use client";

import { motion, useReducedMotion } from "motion/react";

type SectionHeadingProps = {
  children: string;
  center?: boolean;
};

export function SectionHeading({ children, center = false }: SectionHeadingProps) {
  const reduceMotion = useReducedMotion();
  const label = `${children} />`;
  const characters = label.split("");

  return (
    <div className={center ? "text-center" : ""}>
      <motion.h2
        className="font-mono text-xl font-semibold tracking-normal text-foreground"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.7 }}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: reduceMotion ? 0 : 0.03 },
          },
        }}
        aria-label={label}
      >
        {characters.map((char, index) => {
          const isAccent = char === "/" || char === ">";
          return (
            <motion.span
              key={`${char}-${index}`}
              className={isAccent ? "text-accent" : "text-foreground"}
              variants={{
                hidden: reduceMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0 },
              }}
              aria-hidden="true"
            >
              {char}
            </motion.span>
          );
        })}
      </motion.h2>
    </div>
  );
}
