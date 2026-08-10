"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { PrimaryCta } from "@/components/PrimaryCta";
import { Reveal } from "@/components/Reveal";

const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

const outcomes = [
  "Booking sites that take inquiries without living in Messenger",
  "SaaS and calculators with real auth, payments, and dashboards",
  "Lead capture wired to Sheets, HubSpot, or automation",
];

const segments = [
  {
    title: "For local businesses",
    body: "Marketing sites, booking, and lead forms that turn visitors into booked jobs.",
    proofs: [
      { label: "C.H Services", href: "/work/ch-services/" },
      { label: "Pickleball Pavilion", href: "/work/pickleball-pavilion/" },
      { label: "La Purisima", href: "/work/la-purisima-resort/" },
    ],
    serviceHref: "/services/booking-websites/",
    serviceLabel: "Booking websites",
  },
  {
    title: "For SaaS & product founders",
    body: "Web apps with auth, billing, and the admin tools you need to operate.",
    proofs: [
      { label: "Konstru", href: "/work/konstru/" },
      { label: "PasahodPH", href: "/work/pasahodph/" },
      { label: "Lead Assistant", href: "/work/portfolio-lead-assistant/" },
    ],
    serviceHref: "/services/web-apps-saas/",
    serviceLabel: "Web apps & SaaS",
  },
  {
    title: "For construction & trades",
    body: "Estimating tools and ops software that match how crews actually work.",
    proofs: [
      { label: "Konstru BOQ", href: "/work/konstru/" },
      { label: "PasahodPH payroll", href: "/work/pasahodph/" },
    ],
    serviceHref: "/services/construction-trades-software/",
    serviceLabel: "Construction software",
  },
];

export function AudienceSegments() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="who-i-help" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="v2-eyebrow">{"// who I help"}</p>
          <h2 className="v2-display mt-3 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)]">
            I help local businesses and product founders ship working web
            products.
          </h2>
          <p
            className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--v2-muted)" }}
          >
            What I ship: marketing sites, booking systems, SaaS MVPs, and
            AI-assisted tools — scoped carefully, built end-to-end, and ready
            for real users.
          </p>
          <ul className="mt-6 flex flex-col gap-2">
            {outcomes.map((line) => (
              <li
                key={line}
                className="text-sm leading-relaxed sm:text-base"
                style={{ color: "var(--v2-muted)" }}
              >
                <span style={{ color: "var(--v2-accent-text)" }}>→ </span>
                {line}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {segments.map((segment, index) => (
            <motion.div
              key={segment.title}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
                ease: EASE_OUT_STRONG,
              }}
            >
              <h3 className="v2-display text-xl">{segment.title}</h3>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: "var(--v2-muted)" }}
              >
                {segment.body}
              </p>
              <ul className="mt-4 flex flex-col gap-1.5">
                {segment.proofs.map((proof) => (
                  <li key={proof.href}>
                    <Link
                      href={proof.href}
                      className="v2-mono text-sm transition-colors hover:text-[var(--v2-text)]"
                      style={{ color: "var(--v2-accent-text)" }}
                    >
                      {proof.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={segment.serviceHref}
                className="mt-4 inline-block text-sm font-medium transition-colors hover:text-[var(--v2-text)]"
                style={{ color: "var(--v2-muted)" }}
              >
                {segment.serviceLabel} →
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <PrimaryCta className="px-5 py-3 text-sm" source="audience_segments" />
        </div>
      </div>
    </section>
  );
}
