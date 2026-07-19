import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { FloatingGlassNav } from "@/components/FloatingGlassNav";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { caseStudies } from "@/lib/case-studies";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work | Clyde Abenojar",
  description:
    "Selected projects and case studies — web apps, AI tools, and business sites built end-to-end.",
  openGraph: {
    title: "Work | Clyde Abenojar",
    description:
      "Selected projects and case studies — web apps, AI tools, and business sites built end-to-end.",
    url: "https://clydeabenojar.site/work/",
  },
};

export default function WorkPage() {
  return (
    <>
      <FloatingGlassNav />
      <main className="min-h-screen pt-24">
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <SectionHeading>Work</SectionHeading>
              <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                A few things I&apos;ve built end-to-end.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-secondary">
                Case studies from SaaS products, booking systems, AI tools, and
                business sites — scoped, designed, and shipped.
              </p>
            </Reveal>

            <div className="mt-14 flex flex-col gap-12">
              {caseStudies.map((study, index) => (
                <Reveal key={study.slug} delay={index * 0.08}>
                  <Link
                    href={`/work/${study.slug}/`}
                    className="group grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center"
                  >
                    <div
                      className={[
                        "relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-surface shadow-soft transition-[border-color,box-shadow] duration-300 group-hover:border-accent/60 group-hover:shadow-glow",
                        index % 2 === 1 ? "md:order-2" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <Image
                        src={study.coverImage}
                        alt={study.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>

                    <div className={index % 2 === 1 ? "md:order-1" : ""}>
                      <p className="font-mono text-sm text-accent">
                        {study.tagline}
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-foreground transition-colors group-hover:text-accent-soft sm:text-3xl">
                        {study.title}
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed text-secondary sm:text-base">
                        {study.overview}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {study.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-secondary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <span className="mt-5 inline-flex items-center gap-2 font-mono text-sm text-secondary transition-colors group-hover:text-accent">
                        View case study <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
