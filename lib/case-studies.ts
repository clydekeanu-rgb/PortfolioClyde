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
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
