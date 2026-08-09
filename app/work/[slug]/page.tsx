import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { LaptopBrowserMockup } from "@/components/LaptopBrowserMockup";
import { SitePage } from "@/components/PageBackdrop";
import { Reveal } from "@/components/Reveal";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";
import { browserUrl, usesLaptopMockup } from "@/lib/laptop-mockups";
import type { Metadata } from "next";

type CaseStudyPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const study = getCaseStudy(params.slug);

  if (!study) {
    return { title: "Case study not found | Clyde Abenojar" };
  }

  return {
    title: `${study.title} | Clyde Abenojar`,
    description: study.overview,
    openGraph: {
      title: study.title,
      description: study.overview,
      url: `https://clydeabenojar.site/work/${study.slug}/`,
      images: [{ url: study.coverImage }],
    },
  };
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const study = getCaseStudy(params.slug);

  if (!study) {
    notFound();
  }

  return (
    <SitePage variant="work">
      <main className="min-h-[100dvh] pt-24">
        <article className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Link
              href="/work/"
              className="v2-mono text-sm transition-colors hover:text-[var(--v2-text)]"
              style={{ color: "var(--v2-muted)" }}
            >
              {"← Back to projects"}
            </Link>

            <Reveal>
              <header className="mt-8">
                <p className="v2-eyebrow" style={{ color: "var(--v2-accent-text)" }}>
                  {study.tagline}
                </p>
                <h1 className="v2-display mt-3 text-[clamp(2.25rem,5vw,3.5rem)]">
                  {study.title}
                </h1>

                <div
                  className="relative mt-8 aspect-[16/10] overflow-hidden rounded-xl border bg-surface"
                  style={{ borderColor: "var(--v2-border)" }}
                >
                  {usesLaptopMockup(study.slug) ? (
                    <LaptopBrowserMockup
                      src={study.coverImage}
                      alt={study.title}
                      url={browserUrl(study.liveUrl)}
                      priority
                      sizes="(min-width: 1024px) 1024px, 100vw"
                    />
                  ) : (
                    <Image
                      src={study.coverImage}
                      alt={study.title}
                      fill
                      priority
                      sizes="(min-width: 1024px) 1024px, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
              </header>
            </Reveal>

            <Reveal>
              <div className="mt-10">
                <p className="v2-mono text-sm" style={{ color: "var(--v2-muted)" }}>
                  {study.role}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {study.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="v2-mono rounded-full border px-3 py-1 text-xs"
                      style={{
                        borderColor: "var(--v2-border)",
                        color: "var(--v2-muted)",
                        background: "var(--v2-surface)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <p
                className="mt-10 max-w-[65ch] text-lg leading-relaxed"
                style={{ color: "var(--v2-muted)" }}
              >
                {study.overview}
              </p>
            </Reveal>

            <div className="mt-20 flex flex-col gap-20 md:gap-28 lg:gap-32">
              {study.sections.map((section, index) => {
                const isRight = index % 2 === 1;

                return (
                  <Reveal key={section.heading} delay={index * 0.06}>
                    <div
                      className={[
                        "flex w-full flex-col gap-6",
                        "md:items-center md:gap-8 lg:gap-12",
                        isRight ? "md:flex-row-reverse" : "md:flex-row",
                      ].join(" ")}
                    >
                      {section.image ? (
                        <div
                          className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border bg-surface md:w-[52%] lg:w-[50%]"
                          style={{ borderColor: "var(--v2-border)" }}
                        >
                          <Image
                            src={section.image}
                            alt={section.heading}
                            fill
                            sizes="(min-width: 1024px) 50vw, (min-width: 768px) 52vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                      ) : null}

                      <div
                        className={[
                          "flex w-full flex-col",
                          section.image ? "md:w-[48%] lg:w-[50%]" : "max-w-3xl",
                          isRight
                            ? "md:items-end md:text-right"
                            : "md:items-start md:text-left",
                        ].join(" ")}
                      >
                        <h2 className="v2-display text-2xl sm:text-3xl">
                          {section.heading}
                        </h2>
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
                          {section.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {study.liveLinks?.length ? (
              <Reveal className="mt-20 flex flex-wrap gap-3">
                {study.liveLinks.map((link) => {
                  const isApk = link.href.toLowerCase().endsWith(".apk");
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      {...(isApk
                        ? { download: true }
                        : {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          })}
                      className="v2-btn v2-btn-primary px-5 py-3 text-sm"
                    >
                      {link.label}
                    </a>
                  );
                })}
              </Reveal>
            ) : study.liveUrl ? (
              <Reveal className="mt-20">
                <a
                  href={study.liveUrl}
                  {...(study.liveUrl.toLowerCase().endsWith(".apk")
                    ? { download: true }
                    : {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                  className="v2-btn v2-btn-primary px-5 py-3 text-sm"
                >
                  {study.liveUrl.toLowerCase().endsWith(".apk")
                    ? "Download APK"
                    : "Visit live site"}
                </a>
              </Reveal>
            ) : null}
          </div>
        </article>
      </main>
      <Footer />
    </SitePage>
  );
}
