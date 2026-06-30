"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ProjectCard, type Project } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";

const projects: Project[] = [
  {
    title: "Konstru",
    description:
      "Turns rough building dimensions into a defensible bill of materials and a project-wide BOQ, priced in Philippine Pesos.",
    tags: ["Web App", "AI-assisted"],
    href: "https://konstru.clydeabenojar.site",
    external: true,
    image: "/images/projects/konstru.png",
    number: "00",
  },
  {
    title: "Song Generator",
    description:
      "An AI-powered songwriting tool that turns prompts, moods, and genre choices into usable lyrical starting points.",
    tags: ["AI", "Web App"],
    href: "/song-generator",
    image: "/images/project-song-generator.svg",
  },
  {
    title: "Image Generator",
    description:
      "A creative interface for generating image concepts, previewing variations, and keeping prompt ideas organized.",
    tags: ["AI", "Web App"],
    href: "/image-generator",
    image: "/images/project-image-generator.svg",
  },
  {
    title: "Business Websites",
    description:
      "Clean, responsive websites for local businesses that make services easy to understand and contact paths obvious.",
    tags: ["Website", "Brand"],
    href: "/work/business-websites",
    image: "/images/project-business-websites.svg",
  },
];

export function Projects() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="work" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading>Work</SectionHeading>
        <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
          Selected web, mobile, video projects...
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
            WEB
          </span>

          <div className="relative z-10 flex flex-col gap-20 md:gap-28 lg:gap-32">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
