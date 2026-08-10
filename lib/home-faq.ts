export type HomeFaqItem = {
  question: string;
  answer: string;
};

export const homeFaq: HomeFaqItem[] = [
  {
    question: "How do you price projects?",
    answer:
      "Fixed-scope quotes after a short discovery call. You get a clear deliverable list, timeline, and price before work starts — no open-ended hourly surprises.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Most marketing or booking sites land in 2–4 weeks. SaaS MVPs and calculators usually take 4–8+ weeks depending on modules, payments, and auth. Discovery sets a realistic schedule upfront.",
  },
  {
    question: "What does “AI-assisted” development mean?",
    answer:
      "I still own architecture, product decisions, and quality. AI speeds implementation on well-scoped pieces; I verify formulas, edge cases, and UX myself. You hire judgment and accountability, not unchecked prompts.",
  },
  {
    question: "Who isn’t a good fit?",
    answer:
      "Projects that need a large permanent team, undefined “build everything” retainers with no scope, or pure design-only work without shipping. If you want a clear product shipped end-to-end, we’re aligned.",
  },
];
