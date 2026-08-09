export const FRAME_COUNT = 120;

export const framePath = (n: number) =>
  `/frames/frame_${String(n).padStart(4, "0")}.jpg`;

export type Dialogue = {
  id: string;
  show: number;
  hide: number;
  quote: string;
  speaker: string;
  film: string;
};

export const DIALOGUES: Dialogue[] = [
  {
    id: "d1",
    show: 0.1,
    hide: 0.3,
    quote: "Scope first. Ship fast. Don't burn the budget on guesswork.",
    speaker: "Clyde Abenojar",
    film: "BUILD METHOD",
  },
  {
    id: "d2",
    show: 0.35,
    hide: 0.55,
    quote: "Web apps, AI tools, and business sites — built end-to-end.",
    speaker: "Clyde Abenojar",
    film: "SELECTED WORK",
  },
  {
    id: "d3",
    show: 0.6,
    hide: 0.8,
    quote: "If you've got an idea that needs to become a product, let's talk.",
    speaker: "Clyde Abenojar",
    film: "PHILIPPINES → WORLD",
  },
];

/** Progress at which intro text is fully faded out */
export const HERO_TEXT_FADE_END = 0.08;
