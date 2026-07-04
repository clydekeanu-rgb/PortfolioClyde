import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";
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
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <article className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <Link
              href="/#work"
              className="font-mono text-sm text-secondary transition-colors hover:text-accent"
            >
              {"← Back to projects"}
            </Link>

            <header className="mt-8">
              <p className="font-mono text-sm text-accent">{study.tagline}</p>
              <h1 className="mt-3 text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
                {study.title}
              </h1>

              <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-md border border-border bg-surface shadow-soft">
                <Image
                  src={study.coverImage}
                  alt={study.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  className="object-cover"
                />
              </div>
            </header>

            <div className="mt-10">
              <p className="font-mono text-sm text-secondary">{study.role}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {study.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-10 max-w-3xl font-readable text-lg leading-[1.8] text-secondary">
              {study.overview}
            </p>

            <div className="mt-20 flex flex-col gap-20 md:gap-28 lg:gap-32">
              {study.sections.map((section, index) => {
                const isRight = index % 2 === 1;

                return (
                  <div
                    key={section.heading}
                    className={[
                      "flex w-full flex-col gap-6",
                      "md:items-center md:gap-8 lg:gap-12",
                      isRight ? "md:flex-row-reverse" : "md:flex-row",
                    ].join(" ")}
                  >
                    {section.image ? (
                      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-md border border-border bg-surface shadow-soft md:w-[52%] lg:w-[50%]">
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
                      <h2 className="font-mono text-2xl font-bold leading-tight text-primary sm:text-3xl">
                        {section.heading}
                      </h2>
                      <div
                        className={[
                          "mt-4 h-0.5 w-40 bg-primary sm:w-52",
                          isRight ? "md:ml-auto" : "",
                        ].join(" ")}
                      />
                      <p className="mt-4 max-w-[55ch] font-readable text-base leading-[1.7] text-secondary sm:text-lg">
                        {section.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {study.liveUrl ? (
              <div className="mt-20">
                <a
                  href={study.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-md bg-accent px-5 py-3 text-sm font-semibold text-background transition-shadow hover:shadow-glow"
                >
                  &gt; visit_live_site()
                </a>
              </div>
            ) : null}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
