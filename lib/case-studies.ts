export type CaseStudySection = {
  heading: string;
  body: string;
  image?: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  coverImage: string;
  liveUrl?: string;
  liveLinks?: { label: string; href: string }[];
  role: string;
  techStack: string[];
  overview: string;
  sections: CaseStudySection[];
  /** Buyer-intent page title (omit brand suffix — metadata adds it). */
  seoTitle?: string;
  seoDescription?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "pasahodph",
    title: "PasahodPH",
    tagline: "Offline Payroll for Site Crews",
    coverImage: "/images/pasahodph-cover-v2.png",
    liveUrl: "/downloads/PasahodPH.apk",
    liveLinks: [
      { label: "Download APK", href: "/downloads/PasahodPH.apk" },
    ],
    role: "End-to-end design & AI-assisted development",
    techStack: [
      "Kotlin",
      "Jetpack Compose",
      "Room",
      "DataStore",
      "Navigation Compose",
      "Material 3",
    ],
    overview:
      "Small construction and site teams still run payroll on notebooks, chat threads, and spreadsheets — easy to lose a day, double-count a cash advance, or mix up crews across jobs. I built PasahodPH end-to-end as a local-first Android app: multi-project crews, swipe attendance, advances, overtime, and live pay for the current period — no cloud account required.",
    seoTitle: "Offline payroll app for construction site crews | PasahodPH",
    seoDescription:
      "Local-first Android payroll for multi-project crews: swipe attendance, advances, overtime, and live pay — built end-to-end for Philippine site teams.",
    sections: [
      {
        heading: "Projects & Crews",
        body:
          "Each job site is its own project with isolated workers, attendance, and pay history. Foremen, masons, welders, and other roles get a daily rate so one phone can run multiple crews without data bleeding between sites.",
        image: "/images/pasahodph-workers-v2.png",
      },
      {
        heading: "Swipe Attendance & Grid",
        body:
          "Mark present, absent, or half-day with a swipe card flow built for one-handed use on site, plus a grid view for scanning the whole crew at once. Overtime hours attach to the day so pay stays tied to what actually happened.",
        image: "/images/pasahodph-attendance-v2.png",
      },
      {
        heading: "Advances, Salary & Payouts",
        body:
          "Cash advances deduct from the open pay period automatically. Salary updates live from attendance and overtime, and marking a period paid locks a payout record so the next cycle can start clean.",
        image: "/images/pasahodph-salary-v2.png",
      },
    ],
  },
  {
    slug: "promise-surrogacy",
    title: "Promise Surrogacy",
    tagline: "Marketing Website Rebuild",
    coverImage: "/images/promise-cover.png",
    liveUrl: "https://pilot.promisesurrogacy.com",
    liveLinks: [
      {
        label: "English (pilot)",
        href: "https://pilot.promisesurrogacy.com",
      },
      { label: "Spanish", href: "https://es.promisesurrogacy.com" },
      { label: "Chinese", href: "https://zh.promisesurrogacy.com" },
    ],
    role: "End-to-end design & AI-assisted development",
    techStack: [
      "Next.js",
      "TinaCMS",
      "TypeScript",
      "CSS Modules",
      "Cloudflare Turnstile",
      "Upstash Redis",
      "HubSpot",
    ],
    overview:
      "Rebuilt a full surrogacy agency marketing site from a legacy Wix export into a modern, content-managed Next.js application. The site serves intended parents and surrogate candidates across 46 routed pages, with editable content via TinaCMS, per-deploy localization in English, Spanish, and Chinese, and secure form pipelines that feed leads into Google Sheets and HubSpot.",
    seoTitle:
      "Surrogacy agency website rebuild — 46 pages, 3 languages, HubSpot leads",
    seoDescription:
      "Wix-to-Next.js rebuild for a surrogacy agency: TinaCMS, EN/ES/ZH localization, Turnstile-protected forms into Sheets and HubSpot.",
    sections: [
      {
        heading: "Content CMS",
        body:
          "TinaCMS powers visual editing over Markdown/YAML content so the team can update copy and pages without a developer in the loop — covering 46 routed pages from a single content model, with the admin experience available at /admin.",
        image: "/images/promise-cms.png",
      },
      {
        heading: "Localization",
        body:
          "Per-deploy localization ships the site in English, Spanish, and Chinese so intended parents and surrogate candidates get the full experience in their language without a separate site for each locale.",
        image: "/images/promise-i18n.png",
      },
      {
        heading: "Lead Capture",
        body:
          "Hardened lead forms use Cloudflare Turnstile, honeypot fields, and Upstash Redis rate limiting, then route submissions through a Next.js API into Google Sheets and HubSpot so marketing can follow up without losing inquiries to spam.",
        image: "/images/promise-forms.png",
      },
    ],
  },
  {
    slug: "pickleball-pavilion",
    title: "The Pickleball Pavilion",
    tagline: "Cebu's Premier Pickleball Venue",
    coverImage: "/images/PicklePavilion.png",
    liveUrl: "https://picklepavilion.netlify.app/",
    role: "End-to-end design & AI-assisted development",
    techStack: ["Next.js", "Supabase", "GSAP", "ScrollTrigger", "Tailwind CSS"],
    overview:
      "Cebu's pickleball boom needed a venue that felt as premium as the sport's audience — not just a court schedule slapped onto a template. I designed and built the full experience end-to-end: from first scroll to booked court.",
    seoTitle: "Pickleball venue booking website with live court reservations",
    seoDescription:
      "Scrollytelling venue site plus live court booking and admin dashboard for The Pickleball Pavilion in Cebu.",
    sections: [
      {
        heading: "Landing Page",
        body:
          "A scrollytelling homepage built with GSAP and ScrollTrigger, using cinematic scroll-driven motion to introduce the venue — a repurposed warehouse in Cebu City — before a single court is ever mentioned.",
        image: "/images/pickle-landing.png",
      },
      {
        heading: "Booking Widget",
        body:
          "A live court-availability and booking widget lets visitors check open time slots and reserve a court in real time, without a phone call or a Messenger back-and-forth.",
        image: "/images/pickle-booking.png",
      },
      {
        heading: "Admin Dashboard",
        body:
          "Behind the scenes, an admin dashboard gives the venue owners a single place to manage reservations, block off maintenance windows, and see the day's schedule at a glance.",
        image: "/images/pickle-dashboard.png",
      },
    ],
  },
  {
    slug: "konstru",
    title: "Konstru",
    tagline: "Construction Cost Calculator SaaS",
    coverImage: "/images/Konstru.png",
    liveUrl: "https://konstru.clydeabenojar.site",
    role: "End-to-end design & AI-assisted development",
    techStack: ["Next.js", "Supabase", "PayMongo", "Tailwind CSS"],
    overview:
      "Contractors and homeowners in the Philippines often price a build off rough estimates or manual spreadsheets — slow, and easy to get wrong. I built Konstru end-to-end to fix that.",
    seoTitle: "Philippine construction BOQ calculator SaaS | Konstru",
    seoDescription:
      "Construction cost calculator with 16+ modules, PHP-priced BOQ output, PayMongo subscriptions, and a contractor dashboard.",
    sections: [
      {
        heading: "Landing Page & Pricing",
        body:
          "A landing page and pricing page explain the tool and lead into a PayMongo-powered checkout, so a visitor can go from 'what is this' to a paid subscription in one flow.",
        image: "/images/konstru-landing.png",
      },
      {
        heading: "Calculator Engine",
        body:
          "The core calculator covers 16+ construction modules — footing, columns, beams, walls, slabs, roofing, tiling, and more — generating a full bill of materials and BOQ output priced in PHP.",
        image: "/images/konstru-calculator.png",
      },
      {
        heading: "Auth & Subscription Dashboard",
        body:
          "A dashboard behind Supabase auth lets subscribed users manage their projects and calculations, with subscription status tied to their PayMongo payment.",
        image: "/images/konstru-dashboard.png",
      },
    ],
  },
  {
    slug: "la-purisima-resort",
    title: "La Purisima Resort",
    tagline: "Booking & Inquiry Site",
    coverImage: "/images/Lapurisima.png",
    liveUrl: "https://lapurisima.clydeabenojar.site",
    role: "End-to-end design & AI-assisted development",
    techStack: [
      "Next.js",
      "Gemini/Qwen",
      "Google Sheets API",
      "Google Calendar API",
      "Railway",
    ],
    overview:
      "A resort and events venue needed more than a brochure site — they needed a way to handle booking inquiries without hiring someone to sit on Messenger all day. I built the site and the automation behind it.",
    seoTitle: "Resort booking website with AI Messenger bot | La Purisima",
    seoDescription:
      "Inquiry site plus Gemini/Qwen Messenger bot and Google Sheets/Calendar sync for a resort and events venue.",
    sections: [
      {
        heading: "Landing Page & Inquiry Form",
        body:
          "A professional landing page gives the venue a real web presence, with an inquiry form that routes booking requests straight to the business.",
        image: "/images/lapurisima-landing.png",
      },
      {
        heading: "AI Messenger Bot",
        body:
          "A Gemini/Qwen-powered chatbot handles guest questions on Facebook Messenger around the clock, deployed on Railway.",
        image: "/images/lapurisima-bot.png",
      },
      {
        heading: "Google Sheets & Calendar Integration",
        body:
          "Booking inquiries and availability sync automatically with Google Sheets and Google Calendar, so the venue owners see everything in tools they already use — no new system to learn.",
        image: "/images/lapurisima-calendar.png",
      },
    ],
  },
  {
    slug: "property-maintenance",
    title: "Property Maintenance Site",
    tagline: "Property Maintenance Marketing Site",
    coverImage: "/images/ch-services-cover.png",
    liveUrl: "https://mockup1.clydeabenojar.site",
    role: "End-to-end design & AI-assisted development",
    techStack: ["Next.js", "TypeScript", "Tailwind"],
    overview:
      "A prospect mockup for a Kent property-maintenance business: a trust-led landing page with services, before/after proof, customer reviews, and free-quote lead capture — built to turn local homeowners into booked jobs.",
    seoTitle:
      "Property maintenance website mockup — marketing site and lead form",
    seoDescription:
      "Trust-led Kent property maintenance marketing site with services catalog, before/after proof, reviews, and free-quote lead capture.",
    sections: [
      {
        heading: "Trust-Led Hero & Positioning",
        body:
          "The first viewport leads with protection messaging over real site photography, then spells out why Kent homes and businesses choose a small, insured, hands-on team — reliable, detailed, and focused on catching issues before they become costly repairs.",
        image: "/images/ch-services-cover.png",
      },
      {
        heading: "Services Catalog & Before/After Proof",
        body:
          "A full services catalog covers everyday upkeep through specialist roofline, gutter, and solar care, paired with an interactive before-and-after slider so prospects can see the difference preventative exterior work actually makes.",
        image: "/images/ch-services-before-after.png",
      },
      {
        heading: "Social Proof & Free-Quote Lead Capture",
        body:
          "Facebook reviews and founder storytelling build confidence, then a structured free-quote form captures name, contact, property, and service interest so the team can respond with a clear next step — no obligation.",
        image: "/images/ch-services-lead.png",
      },
    ],
  },
  {
    slug: "portfolio-lead-assistant",
    title: "Portfolio Lead Assistant",
    tagline: "n8n Auto-Reply & Booking Automation",
    coverImage: "/images/portfolio-lead-assistant.png",
    liveUrl: "/#contact",
    role: "End-to-end automation design & build",
    techStack: ["n8n", "Google Sheets", "Gmail", "OpenRouter"],
    overview:
      "Contact forms on this portfolio write leads to Google Sheets. An n8n Cloud workflow picks them up, skips rows already messaged, routes by type (discovery vs message), sends Gmail acknowledgements and owner alerts, drafts FAQ replies with OpenRouter for general inquiries, then marks each lead handled — so follow-up happens without manual triage.",
    seoTitle: "n8n portfolio lead automation — auto-reply and booking alerts",
    seoDescription:
      "Sheets-triggered n8n workflow that acknowledges discovery calls, AI-drafts FAQ replies, and notifies the owner without duplicate messages.",
    sections: [
      {
        heading: "Sheet Trigger & Dedupe",
        body:
          "New form submissions land as Sheet rows. The workflow triggers on rowAdded, then filters out anything already marked messaged so the same lead never gets a duplicate auto-reply.",
        image: "/images/portfolio-lead-assistant.png",
      },
      {
        heading: "Discovery Path",
        body:
          "Discovery-call requests get a confirmation email to the visitor, a notify-me alert to my inbox, and a Sheet update that marks the row messaged — so booking intent is acknowledged in minutes.",
        image: "/images/portfolio-lead-assistant.png",
      },
      {
        heading: "Message Path with AI FAQ Reply",
        body:
          "General messages route through an AI agent on OpenRouter that drafts an FAQ-style reply, then Gmail sends that reply, notifies me, and marks the Sheet row complete — keeping human handoff for anything the draft cannot cover.",
        image: "/images/portfolio-lead-assistant.png",
      },
    ],
  },
  {
    slug: "lumina-studio",
    title: "Lumina Studio",
    tagline: "Personal AI Image Studio",
    coverImage: "/images/lumina.png",
    liveUrl: "https://lumina.clydeabenojar.site",
    role: "End-to-end design & AI-assisted development",
    techStack: ["Qwen", "Wan AI", "Next.js"],
    overview:
      "Most AI image tools make you write a fresh prompt every time, with no way to keep a character consistent across images. Lumina Studio solves that.",
    seoTitle: "Personal AI image studio with character consistency | Lumina",
    seoDescription:
      "Text-to-image and image-to-image studio with character fusion and a built-in prompt builder.",
    sections: [
      {
        heading: "Text-to-Image & Image-to-Image",
        body:
          "Generate images from a text prompt or transform an existing image, powered by Qwen and Wan AI models.",
        image: "/images/lumina-generate.png",
      },
      {
        heading: "Character Fusion",
        body:
          "Keep a character visually consistent across multiple generations instead of re-describing them every time.",
        image: "/images/lumina-fusion.png",
      },
      {
        heading: "Prompt Builder",
        body:
          "A built-in prompt builder helps structure prompts for better, more predictable results.",
        image: "/images/lumina-promptbuilder.png",
      },
    ],
  },
  {
    slug: "song-automation-tool",
    title: "AI Fulfillment Pipeline",
    tagline: "n8n production workflow with human QA",
    coverImage: "/images/Songautomation.png",
    role: "End-to-end automation design & build",
    techStack: [
      "n8n Cloud",
      "OpenRouter",
      "Google Sheets",
      "Slack",
      "Gmail",
      "HTTP APIs",
    ],
    overview:
      "AI content fulfillment is rarely one API call — operators need intake, generation, QA loops, async callbacks, human approval, delivery, and escalation when something stalls. I built a single n8n Cloud production workflow with multiple triggers so the full order path is visible, maintainable, and ready to clone for volume later.",
    seoTitle:
      "n8n AI fulfillment pipeline — intake, QA loops, human approval, delivery",
    seoDescription:
      "Multi-trigger n8n Cloud workflow: form intake, LLM generation with AI QA, async audio callbacks, Slack human QA, Gmail delivery, and overdue reminders.",
    sections: [
      {
        heading: "Intake → Shared State",
        body:
          "A public form creates the job record in Google Sheets — client details, brief, preferences, and counters for retries. Sheet state is the source of truth so every later stage can resume without brittle payload-only handoffs.",
        image: "/images/song-lyrics.png",
      },
      {
        heading: "LLM Generation + AI QA Loops",
        body:
          "OpenRouter generates structured output from rotated prompt packs and guideline rules. Failed AI QA rotates prompts and retries up to a hard limit, then escalates instead of silently burning tokens or shipping bad work.",
        image: "/images/song-generation.png",
      },
      {
        heading: "Async API + Human QA",
        body:
          "Approved jobs submit to an external generation API with a dedicated callback webhook. Completions land in Slack send-and-wait forms so a human can approve, reject lyrics or audio, edit copy, or escalate — with separate reject caps and automatic overdue pings.",
        image: "/images/Songautomation.png",
      },
      {
        heading: "Deliver, Escalate, Remind",
        body:
          "Approvals download the asset, email the client via Gmail, and post an audit trail to Slack. Failures and max retries mark the job escalated. A 12-hour schedule on the same workflow nudges anything still waiting in human QA past 24 hours — no separate cron workflow to keep in sync.",
        image: "/images/song-kanban.png",
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
