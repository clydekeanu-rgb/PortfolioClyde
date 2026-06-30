"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export type Project = {
  title: string;
  description: string;
  tags: string[];
  href: string;
  image: string;
  external?: boolean;
  number?: string;
  liveUrl?: string;
};

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  const isRight = index % 2 === 1;
  const number = project.number ?? String(index).padStart(2, "0");

  return (
    <motion.div
      className={[
        "relative flex w-full",
        isRight
          ? "md:justify-end md:pr-0 lg:mt-8"
          : "md:justify-start md:pl-0",
      ].join(" ")}
      variants={{
        hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Link
        href={project.href}
        target={project.external ? "_blank" : undefined}
        rel={project.external ? "noopener noreferrer" : undefined}
        className={[
          "group relative flex w-full cursor-pointer flex-col",
          "md:w-[72%] lg:w-[58%] xl:w-[55%]",
          isRight ? "md:items-end" : "md:items-start",
        ].join(" ")}
        aria-label={`View ${project.title}`}
      >
        <h3
          className={[
            "relative z-10 max-w-[18rem] font-mono text-2xl font-bold leading-tight text-primary sm:text-3xl",
            "md:max-w-[20rem] lg:text-4xl",
            isRight ? "md:mr-[48%] lg:mr-[46%]" : "md:ml-0",
          ].join(" ")}
        >
          {project.title}
        </h3>

        <div
          className={[
            "relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-md border border-border bg-surface shadow-soft",
            "transition-[border-color,box-shadow] duration-300 ease-out",
            "group-hover:border-accent/80 group-hover:shadow-[0_0_34px_rgba(124,58,237,0.34)]",
            "md:-mt-3",
            isRight ? "md:ml-auto" : "md:mr-auto",
          ].join(" ")}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 1280px) 620px, (min-width: 1024px) 55vw, (min-width: 768px) 72vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:motion-safe:scale-105"
          />
        </div>

        <div
          className={[
            "mt-5 flex w-full flex-col",
            isRight ? "md:items-end" : "md:items-start",
          ].join(" ")}
        >
          <div className="h-0.5 w-40 bg-primary sm:w-52" />
          <div className="mt-3 flex items-center gap-3 font-mono text-sm font-semibold">
            <span className="text-secondary transition-colors duration-300 group-hover:text-accent">
              {number}
            </span>
            <ArrowRight
              className="h-4 w-4 text-secondary transition-all duration-300 group-hover:text-accent group-hover:motion-safe:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
