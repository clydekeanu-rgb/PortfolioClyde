export const WORK_FRAME_COUNT = 100;

export const workFramePath = (n: number) =>
  `/frames/work/frame_${String(n).padStart(4, "0")}.jpg`;

export type WorkCard = {
  id: string;
  show: number;
  hide: number;
  /** Big left-side headline after the intro */
  name: string;
  /** Card body — what the work is */
  description: string;
  number: string;
  href: string;
  /** Cover / hero image shown centered on the slide */
  image?: string;
  cta?: string;
};

export const WORK_CARDS: WorkCard[] = [
  {
    id: "w0",
    show: 0.08,
    hide: 0.22,
    name: "PasahodPH",
    description:
      "Local-first Android payroll for site crews — multi-project attendance, advances, overtime, and live pay with no cloud account required.",
    number: "00",
    href: "/work/pasahodph/",
    image: "/images/pasahodph-cover-v2.png",
  },
  {
    id: "w1",
    show: 0.22,
    hide: 0.36,
    name: "Promise Surrogacy",
    description:
      "Rebuilt a surrogacy agency marketing site into a CMS-driven Next.js app with EN/ES/ZH localization and hardened lead capture.",
    number: "01",
    href: "/work/promise-surrogacy/",
    image: "/images/promise-cover.png",
  },
  {
    id: "w2",
    show: 0.36,
    hide: 0.5,
    name: "Konstru",
    description:
      "Construction cost calculator for PH contractors and homeowners — replace rough spreadsheets with clearer material and labor estimates.",
    number: "02",
    href: "/work/konstru/",
    image: "/images/Konstru.png",
  },
  {
    id: "w3",
    show: 0.5,
    hide: 0.64,
    name: "The Pickleball Pavilion",
    description:
      "Premium venue site for Cebu's pickleball scene — scroll-driven experience from first look to booked court.",
    number: "03",
    href: "/work/pickleball-pavilion/",
    image: "/images/PicklePavilion.png",
  },
  {
    id: "w4",
    show: 0.64,
    hide: 0.78,
    name: "La Purisima Resort",
    description:
      "Resort booking and inquiry site with automation behind it — so guests can reach out without living in Messenger threads.",
    number: "04",
    href: "/work/la-purisima-resort/",
    image: "/images/Lapurisima.png",
  },
  {
    id: "see-more",
    show: 0.8,
    hide: 0.98,
    name: "See more",
    description: "Browse the full project archive — more case studies, tools, and shipped work.",
    number: "05+",
    href: "/work/",
    cta: "see more →",
  },
];

export const WORK_TEXT_FADE_END = 0.08;
