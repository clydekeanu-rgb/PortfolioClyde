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
      "property-maintenance",
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
  {
    slug: "lead-automation",
    title: "Lead Auto-Reply & Booking Assistants",
    shortTitle: "Lead automation",
    tagline: "n8n Cloud follow-up that runs while you work",
    description:
      "Form → sheet → typed routes for discovery vs message: Gmail acknowledgements, owner alerts, and AI FAQ drafts via OpenRouter — built so leads get a reply without manual triage.",
    heroTitle: "Auto-reply and booking assistants that clear your inbox queue.",
    heroBody:
      "For founders and freelancers who lose hours sorting contact forms: an n8n Cloud workflow that watches new leads, skips duplicates, confirms discovery calls, drafts FAQ replies, and notifies you when something needs a human.",
    whoFor: [
      "Portfolio and agency sites that collect message + booking leads in one sheet",
      "Operators who want acknowledgement emails without living in Gmail",
      "Teams ready to add AI FAQ drafts with a clear human handoff",
    ],
    outcomes: [
      "Sheet-triggered automation that starts when a lead lands",
      "Separate paths for discovery bookings vs general messages",
      "Visitor acknowledgements plus owner notifications by email",
      "AI-assisted FAQ replies with rows marked messaged so nothing double-sends",
    ],
    process: [
      {
        heading: "Map the lead types",
        body: "We define discovery vs message fields, what “already messaged” means, and which replies should be canned vs AI-drafted.",
      },
      {
        heading: "Build the n8n Cloud flow",
        body: "Sheet trigger, filters, routers, Gmail nodes, and an OpenRouter-backed agent ship as a maintainable workflow — not a one-off Zap.",
      },
      {
        heading: "Harden and hand off",
        body: "Dedupe, notify-me alerts, and mark-messaged updates keep the loop safe. You stay in control of anything the FAQ draft cannot answer.",
      },
    ],
    caseStudySlugs: [
      "portfolio-lead-assistant",
      "la-purisima-resort",
      "song-automation-tool",
    ],
    ctaLabel: "Automate my lead follow-up",
    ctaSubject: "Lead automation inquiry",
    faqs: [
      {
        question: "Does this run on n8n Cloud?",
        answer:
          "Yes. The portfolio assistant is an n8n Cloud workflow wired to Google Sheets and Gmail, with OpenRouter for AI drafting on the message path.",
      },
      {
        question: "Will every message get an AI reply?",
        answer:
          "Only the message route uses the FAQ agent. Discovery bookings get a confirmation acknowledgement. You still get a notify-me email so you can take over when needed.",
      },
      {
        question: "Can this plug into my existing form and sheet?",
        answer:
          "Usually yes. We map your columns (type, email, message status) and deploy a flow that matches how you already capture leads — including portfolio-style message + discovery forms.",
      },
    ],
  },
  {
    slug: "ai-workflow-automation",
    title: "AI Workflow & Ops Automation",
    shortTitle: "AI workflow automation",
    tagline: "n8n pipelines with LLM steps and human QA",
    description:
      "Production n8n Cloud workflows for AI-assisted operations: intake forms, generation + QA loops, async API callbacks, Slack human approval, delivery, and escalation — scoped so operators stay in control.",
    heroTitle: "AI ops pipelines that generate, check, and hand off to humans.",
    heroBody:
      "For automation buyers who need more than a single Zap: multi-trigger n8n workflows that keep shared state, retry safely, escalate on limits, and pause for Slack approval before anything reaches a customer.",
    whoFor: [
      "Operators fulfilling AI-assisted orders or content jobs at volume",
      "Teams that need human-in-the-loop QA before email or client delivery",
      "Founders who want one maintainable production workflow instead of fragmented Zaps",
    ],
    outcomes: [
      "A single n8n Cloud workflow with form, webhook, and schedule triggers",
      "LLM generation with guideline-backed AI QA and prompt rotation",
      "Async external APIs with callback handling, retries, and hard escalation",
      "Slack approve/reject/edit loops plus Gmail delivery and audit trails",
    ],
    process: [
      {
        heading: "Map the status machine",
        body: "We define intake fields, retry counters, escalate rules, and what a human must approve before delivery — so the canvas matches the real operation.",
      },
      {
        heading: "Build the production pipeline",
        body: "Form intake, sheet state, OpenRouter agents, HTTP APIs, Slack send-and-wait, Gmail, and reminders ship as one grouped workflow — not a chain of brittle Execute hops.",
      },
      {
        heading: "Harden for handoff",
        body: "Credentials, publish checklist, and clone-ready paths mean you can run, observe, and later duplicate the pipeline when demand grows.",
      },
    ],
    caseStudySlugs: ["song-automation-tool", "portfolio-lead-assistant"],
    ctaLabel: "Scope my automation pipeline",
    ctaSubject: "AI workflow automation inquiry",
    faqs: [
      {
        question: "Is this Zapier, Make, or n8n?",
        answer:
          "I typically ship production ops pipelines on n8n Cloud — especially when you need multi-trigger workflows, AI agents, Slack human QA, and shared sheet or database state in one place.",
      },
      {
        question: "Can humans still approve before customers get anything?",
        answer:
          "Yes. Slack send-and-wait forms support approve, reject, edit, and escalate paths with counters so bad work does not loop forever.",
      },
      {
        question: "Will this work with APIs that call back later?",
        answer:
          "Yes. Async jobs use a dedicated webhook path, acknowledge quickly, then resume the project from shared state — including retries when the provider fails.",
      },
    ],
  },
];

export function getServicePage(slug: string): ServicePage | undefined {
  return servicePages.find((page) => page.slug === slug);
}
