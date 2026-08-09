import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { SitePage } from "@/components/PageBackdrop";
import { Reveal } from "@/components/Reveal";
import { SitePageHeader } from "@/components/SectionHeading";
import { projectInquiryMailto } from "@/lib/contact";
import { servicePages } from "@/lib/service-pages";

export const metadata: Metadata = {
  title: "Services | Clyde Abenojar",
  description:
    "Booking websites, web apps & SaaS, and construction software — scoped carefully and shipped end-to-end.",
  alternates: {
    canonical: "https://clydeabenojar.site/services/",
  },
  openGraph: {
    title: "Services | Clyde Abenojar",
    description:
      "Booking websites, web apps & SaaS, and construction software — scoped carefully and shipped end-to-end.",
    url: "https://clydeabenojar.site/services/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Clyde Abenojar",
    description:
      "Booking websites, web apps & SaaS, and construction software — scoped carefully and shipped end-to-end.",
  },
};

export default function ServicesPage() {
  return (
    <SitePage variant="work">
      <main className="min-h-[100dvh] pt-24">
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <SitePageHeader
                eyebrow="Services"
                title="Pick the problem you need solved."
                description="Three focused offers backed by shipped work: booking and inquiry sites, full web products, and construction/trades software."
              />
            </Reveal>

            <div className="mt-16 flex flex-col gap-8">
              {servicePages.map((service, index) => (
                <Reveal key={service.slug} delay={index * 0.06}>
                  <Link
                    href={`/services/${service.slug}/`}
                    className="group block rounded-xl border px-6 py-8 transition-colors duration-200 hover:border-[var(--v2-accent)]/40 sm:px-8"
                    style={{
                      borderColor: "var(--v2-border)",
                      background: "var(--v2-surface)",
                    }}
                  >
                    <p
                      className="v2-eyebrow"
                      style={{ color: "var(--v2-accent-text)" }}
                    >
                      {service.tagline}
                    </p>
                    <h2 className="v2-display mt-3 text-2xl sm:text-3xl">
                      {service.title}
                    </h2>
                    <p
                      className="mt-4 max-w-3xl text-sm leading-relaxed sm:text-base"
                      style={{ color: "var(--v2-muted)" }}
                    >
                      {service.description}
                    </p>
                    <span
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium"
                      style={{ color: "var(--v2-accent-text)" }}
                    >
                      Explore {service.shortTitle}{" "}
                      <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-16">
              <div className="text-center">
                <a
                  href={projectInquiryMailto()}
                  className="v2-btn v2-btn-primary px-5 py-3 text-sm"
                >
                  Start a project
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </SitePage>
  );
}
