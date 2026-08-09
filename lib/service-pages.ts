export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServicePage = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  heroTitle: string;
  heroBody: string;
  whoFor: string[];
  outcomes: string[];
  process: { heading: string; body: string }[];
  caseStudySlugs: string[];
  ctaLabel: string;
  ctaSubject: string;
  faqs: ServiceFaq[];
};

export const servicePages: ServicePage[] = [
  {
    slug: "booking-websites",
    title: "Booking & Inquiry Websites",
    shortTitle: "Booking websites",
    tagline: "Venues, resorts, and local services",
    description:
      "Booking and inquiry websites that replace phone tag and Messenger back-and-forth — availability, lead forms, and optional automation, scoped and shipped end-to-end.",
    heroTitle: "Booking and inquiry sites that turn visitors into booked jobs.",
    heroBody:
      "Venues, resorts, courts, and service businesses get a premium site, structured inquiries, and optional booking or automation — designed to convert, not just look good.",
    whoFor: [
      "Venues, resorts, and event spaces that lose leads in Messenger",
      "Courts and recreation businesses that need availability or booking",
      "Local service businesses that want free-quote or inspection forms",
    ],
    outcomes: [
      "A clear marketing site that builds trust in the first viewport",
      "Inquiry or booking flows that capture the details you need to reply",
      "Optional automation — calendars, sheets, or chatbots — when it saves real time",
      "Mobile-first layout, SEO metadata, and a path from proof to contact",
    ],
    process: [
      {
        heading: "Scope the conversion path",
        body: "We define who the site is for, what a successful inquiry looks like, and which proof (services, before/after, reviews) belongs above the fold.",
      },
      {
        heading: "Design and build the site",
        body: "Landing page, services, social proof, and forms ship as a working product — not a mockup stuck in Figma.",
      },
      {
        heading: "Wire follow-up if needed",
        body: "Calendar sync, sheet routing, or Messenger bots plug in when they remove manual back-and-forth for your team.",
      },
    ],
    caseStudySlugs: [
      "pickleball-pavilion",
      "la-purisima-resort",
      "ch-services",
    ],
    ctaLabel: "Tell me about your venue",
    ctaSubject: "Booking website inquiry",
    faqs: [
      {
        question: "Do you build full booking systems or just inquiry forms?",
        answer:
          "Both. Some projects need real-time availability and admin dashboards; others need a strong free-quote or inspection form. We scope to the workflow you actually run.",
      },
      {
        question: "Can you connect Google Calendar or spreadsheets?",
        answer:
          "Yes. Inquiry and availability flows can sync with tools you already use — Google Calendar, Sheets, HubSpot, or Messenger — so you are not learning a new system.",
      },
      {
        question: "How long does a booking or inquiry site usually take?",
        answer:
          "A focused marketing site with lead capture often ships in a few weeks once scope is clear. Full booking products with admin dashboards take longer and get a written plan first.",
      },
    ],
  },
  {
    slug: "web-apps-saas",
    title: "Web Apps & SaaS",
    shortTitle: "Web apps & SaaS",
    tagline: "Products with auth, dashboards, and paywalls",
    description:
      "From landing page to login to paywall — full web products scoped carefully, then shipped: auth, dashboards, subscriptions, CMS, and operational tools.",
    heroTitle: "From landing page to login to paywall — products people actually use.",
    heroBody:
      "For founders and operators who need more than a brochure site: authentication, dashboards, payments, CMS, or multi-language marketing systems built end-to-end.",
    whoFor: [
      "Founders shipping an MVP with auth and a core workflow",
      "Operators who need dashboards, admin tools, or subscription paywalls",
      "Teams rebuilding marketing sites that must connect to CRM or CMS",
    ],
    outcomes: [
      "A scoped product plan before heavy build work starts",
      "Auth, roles, and protected areas when the product needs them",
      "Core workflows — calculators, booking admin, CMS, or AI tools — working in production",
      "Payments, CMS, or CRM integrations wired to how you sell and operate",
    ],
    process: [
      {
        heading: "Scope the product",
        body: "We map users, must-have flows, and what can wait for v2 — so build time goes into the features that prove the product.",
      },
      {
        heading: "Ship a usable first version",
        body: "Design and development happen together: UI, data model, and integrations land as one working release.",
      },
      {
        heading: "Harden and iterate",
        body: "Paywalls, CMS, localization, or CRM hooks get added once the core path is live and measurable.",
      },
    ],
    caseStudySlugs: [
      "konstru",
      "pickleball-pavilion",
      "promise-surrogacy",
      "lumina-studio",
    ],
    ctaLabel: "Start product scoping",
    ctaSubject: "SaaS product scoping",
    faqs: [
      {
        question: "Can you build auth and paid subscriptions?",
        answer:
          "Yes. Past work includes authenticated dashboards and subscription paywalls — including payment providers suited to the market you sell in.",
      },
      {
        question: "Do you only build the marketing site, or the product too?",
        answer:
          "Both. Some engagements are full SaaS products; others are complex marketing sites with CMS and lead pipelines. The scoping call decides which path fits.",
      },
      {
        question: "What stack do you usually use?",
        answer:
          "Most products ship on Next.js, TypeScript, and modern UI tooling, with the databases, auth, and payment providers that fit the project — not a one-size stack forced onto every client.",
      },
    ],
  },
  {
    slug: "construction-trades-software",
    title: "Construction & Trades Software",
    shortTitle: "Construction software",
    tagline: "Crew payroll, estimating, and field ops",
    description:
      "Software for crews and contractors — offline payroll, estimating tools, and field workflows — built by someone who has run construction operations.",
    heroTitle: "Software for crews and contractors — built from site operations experience.",
    heroBody:
      "Payroll on notebooks, BOQ spreadsheets, and chat-thread chaos become tools that match how trades actually work: multi-project crews, advances, estimating, and on-device workflows.",
    whoFor: [
      "Contractors and site teams still running payroll on paper or chat",
      "Estimators who need bill-of-materials or cost tools priced for their market",
      "Operators who want field-ready tools, not generic office SaaS",
    ],
    outcomes: [
      "Workflows scoped against real site constraints — offline, multi-crew, cash advances",
      "Tools that speak construction language: projects, roles, rates, BOQ, pay periods",
      "Mobile or web products designed for one-handed use on site when needed",
      "Clear next steps from a builder who has managed construction operations",
    ],
    process: [
      {
        heading: "Map the field workflow",
        body: "We walk through how attendance, advances, estimating, or payouts actually happen today — including what breaks when the signal drops.",
      },
      {
        heading: "Build the smallest useful product",
        body: "The first release focuses on the painful daily loop: mark attendance, compute pay, price a BOQ — not a bloated ERP.",
      },
      {
        heading: "Expand with operators in mind",
        body: "Multi-site support, subscriptions, or reporting get layered once the core loop is trusted by the people using it.",
      },
    ],
    caseStudySlugs: ["pasahodph", "konstru"],
    ctaLabel: "Describe your workflow",
    ctaSubject: "Construction software project",
    faqs: [
      {
        question: "Have you worked in construction, or only built software for it?",
        answer:
          "Both. Construction project and operations experience informs how these tools get scoped — especially multi-crew payroll, advances, and estimating workflows.",
      },
      {
        question: "Can tools work offline on site?",
        answer:
          "Yes where it matters. PasahodPH is an offline-first Android payroll app for site crews — no cloud login required for the daily loop.",
      },
      {
        question: "Do you build for the Philippine market?",
        answer:
          "Yes. Pricing, pay flows, and estimating tools can be tailored to local rates and practices — including PHP-priced modules when that is what buyers expect.",
      },
    ],
  },
];

export function getServicePage(slug: string): ServicePage | undefined {
  return servicePages.find((page) => page.slug === slug);
}
