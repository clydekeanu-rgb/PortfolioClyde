"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export type Project = {
  title: string;
  subtitle: string;
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
        isRight ? "md:justify-end" : "md:justify-start",
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
          "group relative flex w-full cursor-pointer flex-col gap-6 transition-transform duration-300 ease-out group-hover:-translate-y-1",
          "md:items-center md:gap-8 lg:gap-12",
          "md:w-[92%] lg:w-[88%]",
          isRight ? "md:flex-row-reverse" : "md:flex-row",
        ].join(" ")}
        aria-label={`View ${project.title}`}
      >
        <div
          className={[
            "relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-md border border-border bg-surface shadow-soft",
            "transition-[border-color,box-shadow] duration-300 ease-out",
            "group-hover:border-accent/80 group-hover:shadow-[0_0_34px_rgba(124,58,237,0.34)]",
            "md:w-[52%] lg:w-[50%]",
          ].join(" ")}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 50vw, (min-width: 768px) 52vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:motion-safe:scale-105"
          />
        </div>

        <div
          className={[
            "flex w-full flex-col",
            "md:w-[48%] lg:w-[50%]",
            isRight ? "md:items-end md:text-right" : "md:items-start md:text-left",
          ].join(" ")}
        >
          <p className="font-mono text-sm text-accent">{project.subtitle}</p>

          <h3 className="mt-2 font-mono text-2xl font-bold leading-tight text-primary sm:text-3xl lg:text-4xl">
            {project.title}
          </h3>

          <div
            className={[
              "mt-4 h-0.5 w-40 bg-primary sm:w-52",
              isRight ? "md:ml-auto" : "",
            ].join(" ")}
          />

          <p className="mt-4 max-w-[55ch] font-readable text-base leading-[1.7] text-secondary sm:text-lg">
            {project.description}
          </p>

          <div
            className={[
              "mt-4 flex flex-wrap gap-2",
              isRight ? "md:justify-end" : "",
            ].join(" ")}
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-accent-soft/80 transition-colors duration-300 group-hover:border-accent-soft/40 group-hover:text-accent-soft"
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            className={[
              "mt-6 flex items-center gap-3 font-mono text-sm font-semibold",
              isRight ? "md:justify-end" : "",
            ].join(" ")}
          >
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
