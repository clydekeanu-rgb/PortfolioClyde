import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import {
  LaptopBrowserMockup,
  LAPTOP_MOCKUP_SLUGS,
} from "@/components/LaptopBrowserMockup";
import { SitePage } from "@/components/PageBackdrop";
import { Reveal } from "@/components/Reveal";
import { SitePageHeader } from "@/components/SectionHeading";
import { caseStudies } from "@/lib/case-studies";
import type { Metadata } from "next";

function browserUrl(liveUrl?: string) {
  if (!liveUrl || liveUrl.startsWith("/")) return undefined;
  return liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export const metadata: Metadata = {
  title: "Work | Clyde Abenojar",
  description:
    "Selected projects and case studies: web apps, AI tools, and business sites built end-to-end.",
  openGraph: {
    title: "Work | Clyde Abenojar",
    description:
      "Selected projects and case studies: web apps, AI tools, and business sites built end-to-end.",
    url: "https://clydeabenojar.site/work/",
  },
};

export default function WorkPage() {
  return (
    <SitePage variant="work">
      <main className="min-h-[100dvh] pt-24">
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <SitePageHeader
                eyebrow="Work"
                title="A few things I've built end-to-end."
                description="Case studies from SaaS products, booking systems, AI tools, and business sites: scoped, designed, and shipped."
              />
            </Reveal>

            <div className="mt-16 flex flex-col gap-14">
              {caseStudies.map((study, index) => (
                <Reveal key={study.slug} delay={index * 0.06}>
                  <Link
                    href={`/work/${study.slug}/`}
                    className="group grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center"
                  >
                    <div
                      className={[
                        "relative aspect-[16/10] overflow-hidden rounded-xl border bg-surface transition-colors duration-200 group-hover:border-[var(--v2-accent)]/40",
                        index % 2 === 1 ? "md:order-2" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={{ borderColor: "var(--v2-border)" }}
                    >
                      {LAPTOP_MOCKUP_SLUGS.has(study.slug) ? (
                        <LaptopBrowserMockup
                          src={study.coverImage}
                          alt={study.title}
                          url={browserUrl(study.liveUrl)}
                          sizes="(min-width: 768px) 50vw, 100vw"
                          imageClassName="transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <Image
                          src={study.coverImage}
                          alt={study.title}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      )}
                    </div>

                    <div className={index % 2 === 1 ? "md:order-1" : ""}>
                      <p className="v2-eyebrow" style={{ color: "var(--v2-accent-text)" }}>
                        {study.tagline}
                      </p>
                      <h2 className="v2-display mt-2 text-2xl sm:text-3xl">
                        {study.title}
                      </h2>
                      <p
                        className="mt-4 text-sm leading-relaxed sm:text-base"
                        style={{ color: "var(--v2-muted)" }}
                      >
                        {study.overview}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {study.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="v2-mono rounded-full border px-3 py-1 text-xs"
                            style={{
                              borderColor: "var(--v2-border)",
                              color: "var(--v2-muted)",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <span
                        className="mt-5 inline-flex items-center gap-2 text-sm font-medium transition-colors"
                        style={{ color: "var(--v2-accent-text)" }}
                      >
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
    </SitePage>
  );
}
