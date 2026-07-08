"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ProjectCard, type Project } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { freeTools } from "@/lib/free-tools";

export function FreeTools() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="free-tools" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading>Free Tools</SectionHeading>
        <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
          Small tools I&apos;ve built and use myself — free to try.
        </h2>
        <motion.div
          className="relative mt-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.08,
              },
            },
          }}
        >
          <div className="pointer-events-none absolute left-1/2 top-4 hidden h-[calc(100%-2rem)] w-px -translate-x-1/2 bg-accent/35 md:block" />
          <span
            className="pointer-events-none absolute left-1/2 top-20 hidden -translate-x-1/2 select-none font-mono text-[12rem] font-bold leading-none text-secondary/5 lg:block xl:text-[18rem]"
            aria-hidden="true"
          >
            TOOLS
          </span>

          <div className="relative z-10 flex flex-col gap-20 md:gap-28 lg:gap-32">
            {freeTools.map((tool, index) => (
              <ProjectCard key={tool.title} project={tool as Project} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
