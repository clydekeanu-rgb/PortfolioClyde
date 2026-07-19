"use client";

import { useEffect, useRef, useState } from "react";
import { Marquee } from "@/components/ui/marquee";

type TechItem = {
  name: string;
  slug: string;
};

type TechMarqueeProps = {
  techStack: readonly TechItem[];
};

export function TechMarquee({ techStack }: TechMarqueeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Technologies"
      className="rw-tech-marquee border-y border-[var(--rw-border)] py-8"
    >
      {visible ? (
        <Marquee
          pauseOnHover
          repeat={2}
          className="[--duration:35s] [--gap:1rem]"
        >
          {techStack.map((tech) => (
            <div key={tech.slug} className="rw-tech-pill">
              {/* Simple Icons CDN — next/image domain not configured for this host */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${tech.slug}`}
                alt=""
                width={16}
                height={16}
                loading="lazy"
                decoding="async"
              />
              <span>{tech.name}</span>
            </div>
          ))}
        </Marquee>
      ) : (
        <div className="h-10" aria-hidden="true" />
      )}
    </section>
  );
}
