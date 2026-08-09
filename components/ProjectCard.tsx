"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

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
  const isRight = index % 2 === 1;
  const number = project.number ?? String(index).padStart(2, "0");

  return (
    <Reveal
      delay={index * 0.06}
      className={[
        "relative flex w-full",
        isRight ? "md:justify-end" : "md:justify-start",
      ].join(" ")}
    >
      <Link
        href={project.href}
        target={project.external ? "_blank" : undefined}
        rel={project.external ? "noopener noreferrer" : undefined}
        className={[
          "group relative flex w-full cursor-pointer flex-col gap-6",
          "md:items-center md:gap-8 lg:gap-12",
          "md:w-[92%] lg:w-[88%]",
          isRight ? "md:flex-row-reverse" : "md:flex-row",
        ].join(" ")}
        aria-label={`View ${project.title}`}
      >
        <div
          className={[
            "relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border bg-surface",
            "transition-colors duration-200 group-hover:border-[var(--v2-accent)]/40",
            "md:w-[52%] lg:w-[50%]",
          ].join(" ")}
          style={{ borderColor: "var(--v2-border)" }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 50vw, (min-width: 768px) 52vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:motion-safe:scale-105"
          />
        </div>

        <div
          className={[
            "flex w-full flex-col",
            "md:w-[48%] lg:w-[50%]",
            isRight ? "md:items-end md:text-right" : "md:items-start md:text-left",
          ].join(" ")}
        >
          <p className="v2-eyebrow" style={{ color: "var(--v2-accent-text)" }}>
            {project.subtitle}
          </p>

          <h3 className="v2-display mt-2 text-2xl sm:text-3xl lg:text-4xl">
            {project.title}
          </h3>

          <div
            className={[
              "mt-4 h-px w-40 sm:w-52",
              isRight ? "md:ml-auto" : "",
            ].join(" ")}
            style={{ background: "var(--v2-accent)" }}
          />

          <p
            className="mt-4 max-w-[55ch] text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--v2-muted)" }}
          >
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
                className="v2-mono rounded-full border px-3 py-1 text-xs"
                style={{
                  borderColor: "var(--v2-border)",
                  background: "var(--v2-surface)",
                  color: "var(--v2-muted)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            className={[
              "mt-6 flex items-center gap-3 text-sm font-medium",
              isRight ? "md:justify-end" : "",
            ].join(" ")}
            style={{ color: "var(--v2-accent-text)" }}
          >
            <span className="v2-mono">{number}</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:motion-safe:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
