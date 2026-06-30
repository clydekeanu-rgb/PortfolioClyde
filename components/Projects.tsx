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
    title: "Lumina Studio",
    description:
      "A full AI image studio - text-to-image, image-to-image, character fusion, and a built-in prompt builder. Powered by multiple AI models.",
    tags: ["AI Tool", "Web App"],
    href: "https://lumina.clydeabenojar.site",
    external: true,
    image: "/images/projects/lumina.png",
    number: "01",
  },
  {
    title: "La Purisima Resort",
    description:
      "Landing page for a resort and events venue in Jaro, Leyte - covering event hall rental, room accommodations, and swimming pool bookings.",
    tags: ["Landing Page", "Business Website"],
    href: "https://lapurisima.clydeabenojar.site",
    external: true,
    image: "/images/projects/lapurisima.png",
    number: "02",
  },
  {
    title: "Song Generator",
    description:
      "An AI-powered songwriting tool that turns prompts, moods, and genre choices into usable lyrical starting points.",
    tags: ["AI", "Web App"],
    href: "/song-generator",
    image: "/images/project-song-generator.svg",
    number: "03",
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
