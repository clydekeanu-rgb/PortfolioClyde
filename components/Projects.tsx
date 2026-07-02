"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ProjectCard, type Project } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";

const projects: Project[] = [
  {
    title: "Konstru",
    subtitle: "Construction Cost Calculator SaaS",
    description:
      "Contractors and homeowners in the Philippines often price a build off rough estimates or manual spreadsheets — slow and easy to get wrong. I built Konstru end-to-end: landing page, auth, subscription paywall, dashboard, and a calculator that generates a full bill of materials and BOQ, priced in PHP.",
    tags: ["Web App", "SaaS"],
    href: "https://konstru.clydeabenojar.site",
    external: true,
    image: "/images/Konstru.png",
    number: "00",
  },
  {
    title: "Lumina Studio",
    subtitle: "Personal AI Image Studio",
    description:
      "Most AI image tools make you write a fresh prompt every time, with no way to keep a character consistent. Lumina Studio solves that — text-to-image, image-to-image, and character fusion, plus a built-in prompt builder, powered by Qwen and Wan AI models.",
    tags: ["AI Tool", "Web App"],
    href: "https://lumina.clydeabenojar.site",
    external: true,
    image: "/images/lumina.png",
    number: "01",
  },
  {
    title: "La Purisima Resort",
    subtitle: "Booking & Inquiry Site",
    description:
      "A resort and events venue needed a professional web presence and an easy way for guests to send booking inquiries — without a complex reservation system to manage. I built a landing page and integrated inquiry form that routes requests straight to the business.",
    tags: ["Landing Page", "Business Website"],
    href: "https://lapurisima.clydeabenojar.site",
    external: true,
    image: "/images/Lapurisima.png",
    number: "02",
  },
  {
    title: "Song Automation Tool",
    subtitle: "Automated Song Generation Pipeline",
    description:
      "Generating a good AI song isn't one step — it's lyrics, QA, generation, and catching glitches, usually done manually across separate tools. I automated the whole chain: input a story, get back lyrics, an automated QA pass, a generated song via Suno AI, and an audio glitch check — tracked through a Kanban-style job board.",
    tags: ["AI Tool", "Automation"],
    href: "/song-generator/",
    external: false,
    image: "/images/Songautomation.png",
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
          A few things I&apos;ve built end-to-end.
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
