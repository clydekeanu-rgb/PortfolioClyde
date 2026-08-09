import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { LaptopBrowserMockup } from "@/components/LaptopBrowserMockup";
import { SitePage } from "@/components/PageBackdrop";
import { Reveal } from "@/components/Reveal";
import { getCaseStudy } from "@/lib/case-studies";
import { projectInquiryMailto } from "@/lib/contact";
import { browserUrl, usesLaptopMockup } from "@/lib/laptop-mockups";
import {
  getServicePage,
  servicePages,
  type ServicePage,
} from "@/lib/service-pages";

type ServiceDetailPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return servicePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const service = getServicePage(params.slug);

  if (!service) {
    return { title: "Service not found | Clyde Abenojar" };
  }

  const url = `https://clydeabenojar.site/services/${service.slug}/`;
  const firstStudy = getCaseStudy(service.caseStudySlugs[0]);

  return {
    title: `${service.title} | Clyde Abenojar`,
    description: service.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: service.title,
      description: service.description,
      url,
      images: firstStudy
        ? [{ url: firstStudy.coverImage }]
        : [{ url: "/og-image.svg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: service.description,
      images: firstStudy ? [firstStudy.coverImage] : ["/og-image.svg"],
    },
  };
}

function serviceJsonLd(service: ServicePage) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: `https://clydeabenojar.site/services/${service.slug}/`,
    provider: {
      "@type": "Person",
      name: "Clyde Abenojar",
      url: "https://clydeabenojar.site/",
      email: "clyde@clydeabenojar.site",
    },
    areaServed: "Worldwide",
  };
}

function faqJsonLd(service: ServicePage) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = getServicePage(params.slug);

  if (!service) {
    notFound();
  }

  const studies = service.caseStudySlugs
    .map((slug) => getCaseStudy(slug))
    .filter((study): study is NonNullable<typeof study> => Boolean(study));

  return (
    <SitePage variant="work">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd(service)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(service)),
        }}
      />
      <main className="min-h-[100dvh] pt-24">
        <article className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Link
              href="/services/"
              className="v2-mono text-sm transition-colors hover:text-[var(--v2-text)]"
              style={{ color: "var(--v2-muted)" }}
            >
              {"← All services"}
            </Link>

            <Reveal>
              <header className="mt-8 max-w-3xl">
                <p
                  className="v2-eyebrow"
                  style={{ color: "var(--v2-accent-text)" }}
                >
                  {service.tagline}
                </p>
                <h1 className="v2-display mt-3 text-[clamp(2.25rem,5vw,3.5rem)]">
                  {service.heroTitle}
                </h1>
                <p
                  className="mt-6 text-lg leading-relaxed"
                  style={{ color: "var(--v2-muted)" }}
                >
                  {service.heroBody}
                </p>
                <div className="mt-8">
                  <a
                    href={projectInquiryMailto(service.ctaSubject)}
                    className="v2-btn v2-btn-primary px-5 py-3 text-sm"
                  >
                    {service.ctaLabel}
                  </a>
                </div>
              </header>
            </Reveal>

            <Reveal className="mt-20">
              <h2 className="v2-display text-2xl sm:text-3xl">Who this is for</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {service.whoFor.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border px-5 py-5 text-sm leading-relaxed"
                    style={{
                      borderColor: "var(--v2-border)",
                      background: "var(--v2-surface)",
                      color: "var(--v2-muted)",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-20">
              <h2 className="v2-display text-2xl sm:text-3xl">What you get</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {service.outcomes.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-base leading-relaxed"
                    style={{ color: "var(--v2-muted)" }}
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "var(--v2-accent)" }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="mt-20">
              <Reveal>
                <h2 className="v2-display text-2xl sm:text-3xl">
                  Proof from shipped work
                </h2>
                <p
                  className="mt-4 max-w-2xl text-base leading-relaxed"
                  style={{ color: "var(--v2-muted)" }}
                >
                  Related case studies — open any for the full build story.
                </p>
              </Reveal>

              <div className="mt-10 flex flex-col gap-10">
                {studies.map((study, index) => (
                  <Reveal key={study.slug} delay={index * 0.05}>
                    <Link
                      href={`/work/${study.slug}/`}
                      className="group grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-center"
                    >
                      <div
                        className="relative aspect-[16/10] overflow-hidden rounded-xl border bg-surface transition-colors duration-200 group-hover:border-[var(--v2-accent)]/40"
                        style={{ borderColor: "var(--v2-border)" }}
                      >
                        {usesLaptopMockup(study.slug) ? (
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
                      <div>
                        <p
                          className="v2-eyebrow"
                          style={{ color: "var(--v2-accent-text)" }}
                        >
                          {study.tagline}
                        </p>
                        <h3 className="v2-display mt-2 text-2xl">
                          {study.title}
                        </h3>
                        <p
                          className="mt-4 text-sm leading-relaxed sm:text-base"
                          style={{ color: "var(--v2-muted)" }}
                        >
                          {study.overview}
                        </p>
                        <span
                          className="mt-5 inline-flex items-center gap-2 text-sm font-medium"
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

            <Reveal className="mt-20">
              <h2 className="v2-display text-2xl sm:text-3xl">How we work</h2>
              <ol className="mt-8 grid gap-6 md:grid-cols-3">
                {service.process.map((step, index) => (
                  <li
                    key={step.heading}
                    className="rounded-xl border px-5 py-6"
                    style={{
                      borderColor: "var(--v2-border)",
                      background: "var(--v2-surface)",
                    }}
                  >
                    <p
                      className="v2-mono text-xs"
                      style={{ color: "var(--v2-accent-text)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="v2-display mt-3 text-xl">{step.heading}</h3>
                    <p
                      className="mt-3 text-sm leading-relaxed"
                      style={{ color: "var(--v2-muted)" }}
                    >
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal className="mt-20">
              <h2 className="v2-display text-2xl sm:text-3xl">FAQ</h2>
              <div className="mt-8 flex flex-col gap-4">
                {service.faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-xl border px-5 py-5"
                    style={{
                      borderColor: "var(--v2-border)",
                      background: "var(--v2-surface)",
                    }}
                  >
                    <h3 className="text-base font-medium sm:text-lg">
                      {faq.question}
                    </h3>
                    <p
                      className="mt-3 text-sm leading-relaxed sm:text-base"
                      style={{ color: "var(--v2-muted)" }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-20">
              <div
                className="rounded-xl border px-6 py-10 text-center sm:px-10"
                style={{
                  borderColor: "var(--v2-border)",
                  background: "var(--v2-surface)",
                }}
              >
                <p
                  className="v2-eyebrow"
                  style={{ color: "var(--v2-accent-text)" }}
                >
                  Ready to start
                </p>
                <h2 className="v2-display mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)]">
                  {service.ctaLabel}
                </h2>
                <p
                  className="mx-auto mt-4 max-w-xl text-base leading-relaxed"
                  style={{ color: "var(--v2-muted)" }}
                >
                  Send a short note about the project. I&apos;ll reply with
                  whether it&apos;s a fit and a clear next step.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href={projectInquiryMailto(service.ctaSubject)}
                    className="v2-btn v2-btn-primary px-5 py-3 text-sm"
                  >
                    {service.ctaLabel}
                  </a>
                  <Link
                    href="/work/"
                    className="v2-btn v2-btn-outline px-5 py-3 text-sm"
                  >
                    Browse all work
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </article>
      </main>
      <Footer />
    </SitePage>
  );
}
