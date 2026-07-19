"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type WorkCarouselProject = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  number: string;
};

type WorkCarouselProps = {
  projects: WorkCarouselProject[];
};

export function WorkCarousel({ projects }: WorkCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Native horizontal trackpad swipe — let the browser handle it.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;

      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= max - 1;

      // At either edge, allow the page to scroll past the carousel.
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;

      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges, projects.length]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const gap = 24;
    const amount = (card?.offsetWidth ?? el.clientWidth * 0.7) + gap;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div className="relative mt-16">
      <div className="mb-6 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Previous project"
          disabled={!canPrev}
          onClick={() => scrollByCard(-1)}
          className="rounded-full border-[var(--rw-border)] bg-[var(--rw-surface-2)] text-[var(--rw-text)] hover:bg-[var(--rw-surface)] disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Next project"
          disabled={!canNext}
          onClick={() => scrollByCard(1)}
          className="rounded-full border-[var(--rw-border)] bg-[var(--rw-surface-2)] text-[var(--rw-text)] hover:bg-[var(--rw-surface)] disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </Button>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-label="Projects"
        tabIndex={0}
        className="rw-carousel-track flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 outline-none"
      >
        {projects.map((project) => (
          <Link
            key={project.title}
            href={project.href}
            data-carousel-card
            className={cn(
              "group flex w-[85%] shrink-0 snap-start flex-col gap-4 sm:w-[55%] lg:w-[40%]",
            )}
            aria-label={`View ${project.title}`}
          >
            <div className="rw-media relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                loading="lazy"
                quality={70}
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 55vw, 85vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div>
              <p className="font-mono text-sm rw-brand">{project.subtitle}</p>
              <h4 className="mt-1 font-mono text-xl font-semibold leading-tight rw-text sm:text-2xl">
                {project.title}
              </h4>
              <p className="mt-3 font-mono text-sm rw-muted">
                {project.number} <span aria-hidden="true">→</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
