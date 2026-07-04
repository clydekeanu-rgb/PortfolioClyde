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
  role: string;
  techStack: string[];
  overview: string;
  sections: CaseStudySection[];
};

export const caseStudies: CaseStudy[] = [
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
    slug: "lumina-studio",
    title: "Lumina Studio",
    tagline: "Personal AI Image Studio",
    coverImage: "/images/lumina.png",
    liveUrl: "https://lumina.clydeabenojar.site",
    role: "End-to-end design & AI-assisted development",
    techStack: ["Qwen", "Wan AI", "Next.js"],
    overview:
      "Most AI image tools make you write a fresh prompt every time, with no way to keep a character consistent across images. Lumina Studio solves that.",
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
    title: "Song Automation Tool",
    tagline: "Automated Song Generation Pipeline",
    coverImage: "/images/Songautomation.png",
    liveUrl: "/song-generator/",
    role: "End-to-end design & AI-assisted development",
    techStack: ["Suno AI", "Automation Pipeline"],
    overview:
      "Generating a good AI song isn't one step — it's lyrics, QA, generation, and catching glitches, usually done manually across separate tools. I automated the whole chain.",
    sections: [
      {
        heading: "Lyrics Generation & QA",
        body:
          "Input a story or idea and get back lyrics, run through an automated QA pass before generation even starts.",
        image: "/images/song-lyrics.png",
      },
      {
        heading: "Song Generation",
        body: "Lyrics feed into Suno AI to generate the actual track.",
        image: "/images/song-generation.png",
      },
      {
        heading: "Kanban Job Board & Glitch Detection",
        body:
          "Every job is tracked through a Kanban-style board, with an automated audio glitch check catching generation artifacts before a track is considered done.",
        image: "/images/song-kanban.png",
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
