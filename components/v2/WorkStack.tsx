"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";

const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

type Project = {
  title: string;
  blurb: string;
  tags: string[];
  href: string;
  image: string;
};

const projects: Project[] = [
  {
    title: "PasahodPH",
    blurb:
      "Offline-first Android payroll for site crews: swipe attendance, cash advances, overtime, and live salary computed on-device with no cloud login.",
    tags: ["Android", "Offline-first"],
    href: "/work/pasahodph/",
    image: "/images/pasahodph-cover-v2.png",
  },
  {
    title: "Promise Surrogacy",
    blurb:
      "A Wix-to-Next.js rebuild for a surrogacy agency: 46 routed pages, TinaCMS, three languages, and hardened lead capture into HubSpot.",
    tags: ["Web app", "CMS"],
    href: "/work/promise-surrogacy/",
    image: "/images/promise-cover.png",
  },
  {
    title: "Konstru",
    blurb:
      "A construction cost calculator SaaS with auth, a subscription paywall, and a bill-of-materials engine priced in PHP.",
    tags: ["SaaS", "Web app"],
    href: "/work/konstru/",
    image: "/images/Konstru.png",
  },
  {
    title: "The Pickleball Pavilion",
    blurb:
      "A scrollytelling venue site with real-time court availability, online booking, and an admin dashboard for Cebu's premier pickleball venue.",
    tags: ["Booking system", "Web app"],
    href: "/work/pickleball-pavilion/",
    image: "/images/PicklePavilion.png",
  },
  {
    title: "Lumina Studio",
    blurb:
      "A personal AI image studio: text-to-image, image-to-image, and consistent character fusion with a built-in prompt builder.",
    tags: ["AI tool", "Web app"],
    href: "/work/lumina-studio/",
    image: "/images/lumina.png",
  },
];

export function WorkStack() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="work" className="pt-24">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-6">
        <motion.h2
          className="v2-display text-[clamp(2rem,4vw,3rem)]"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE_OUT_STRONG }}
        >
          Selected work
        </motion.h2>
        <Link
          href="/work"
          className="group mb-2 inline-flex shrink-0 items-center gap-1 text-[0.9375rem] font-medium transition-colors"
          style={{ color: "var(--v2-muted)" }}
        >
          All projects
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </Link>
      </div>

      <div ref={containerRef} className="relative mt-4">
        {projects.map((project, index) => (
          <StackCard
            key={project.title}
            project={project}
            index={index}
            total={projects.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

function StackCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();

  // Earlier cards settle at a smaller scale as later cards stack on top.
  const targetScale = 1 - (total - 1 - index) * 0.045;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div
      className="sticky flex h-[100dvh] items-center justify-center px-4 sm:px-6"
      style={{ top: `${index * 12}px` }}
    >
      <motion.article
        className="v2-card w-full max-w-5xl overflow-hidden"
        style={reduceMotion ? undefined : { scale, transformOrigin: "top" }}
      >
        <div className="grid md:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col justify-between gap-8 p-7 sm:p-9">
            <div>
              <h3
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
                style={{ color: "var(--v2-text)" }}
              >
                {project.title}
              </h3>
              <p
                className="mt-4 max-w-[42ch] text-[0.9375rem] leading-relaxed sm:text-base"
                style={{ color: "var(--v2-muted)" }}
              >
                {project.blurb}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="v2-eyebrow">{project.tags.join(" / ")}</p>
              <Link
                href={project.href}
                className="group inline-flex items-center gap-1 text-[0.9375rem] font-medium"
                style={{ color: "var(--v2-accent-text)" }}
              >
                Case study
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </Link>
            </div>
          </div>

          <div
            className="relative order-first m-3 aspect-[16/10] overflow-hidden rounded-[8px] border md:order-none md:m-4 md:aspect-auto md:min-h-[26rem]"
            style={{
              borderColor: "var(--v2-border)",
              background: "var(--v2-elevated)",
            }}
          >
            <Image
              src={project.image}
              alt={`${project.title} screenshot`}
              fill
              quality={70}
              sizes="(max-width: 768px) 92vw, 620px"
              className="object-cover object-top"
            />
          </div>
        </div>
      </motion.article>
    </div>
  );
}
