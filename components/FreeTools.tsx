"use client";

import { ProjectCard, type Project } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { SitePageHeader } from "@/components/SectionHeading";
import { freeTools } from "@/lib/free-tools";

export function FreeTools() {
  return (
    <section id="free-tools" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SitePageHeader
            eyebrow="Free Tools"
            title="Small tools I've built and use myself, free to try."
          />
        </Reveal>

        <div className="relative mt-16 flex flex-col gap-20 md:gap-28 lg:gap-32">
          {freeTools.map((tool, index) => (
            <ProjectCard
              key={tool.title}
              project={tool as Project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
