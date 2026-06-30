import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeading } from "@/components/SectionHeading";

const capabilities = [
  "Landing pages",
  "Web apps",
  "Custom apps for businesses",
  {
    title: "Chatbot embeds",
    description: "for websites",
  },
  {
    title: "Construction Cost Calculator",
    description:
      "built end-to-end including landing page, paywall, login, dashboard, and the app itself",
  },
  {
    title: "AI Image Generator",
    description:
      "for creating a consistent character across images, with a built-in prompt builder",
  },
  {
    title: "Automated AI Song Generation Workflow",
    description:
      "user describes the story/theme, and the system writes lyrics, checks them against a quality checklist, generates the song through a separate AI model, then runs the output through another model to check for audio glitches",
  },
];

export function About() {
  return (
    <AnimatedSection id="about" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading>About</SectionHeading>

        <div className="mt-10 max-w-2xl font-readable text-lg leading-[1.8] text-secondary">
          <p>
            Here&apos;s the thing — most projects don&apos;t fail because the
            idea was bad. They fail because they dragged on too long or cost way
            more than they should&apos;ve. I use AI tools, but I&apos;m not just
            throwing prompts at a wall and hoping something sticks. I scope
            things out first, fix exactly what&apos;s broken, and look for the
            simpler way to get it done. You get a working product, faster,
            without paying for me to figure things out as I go.
          </p>
          <p className="mt-7">
            Side note — I also do 3D modelling and architectural rendering, so
            if your project needs visuals beyond the web, I&apos;ve got that
            covered too.
          </p>
        </div>

        <div className="mt-12 max-w-3xl font-readable">
          <h3 className="text-2xl font-bold text-primary">
            What I can build for you
          </h3>
          <ul className="mt-6 space-y-3 text-base leading-7 text-secondary sm:text-lg">
            {capabilities.map((item) => {
              const isDetailed = typeof item !== "string";
              const label = isDetailed ? item.title : item;

              return (
                <li key={label} className="flex gap-3">
                  <span className="mt-1 text-accent" aria-hidden="true">
                    —
                  </span>
                  <span>
                    {isDetailed ? (
                      <>
                        <strong className="font-semibold text-primary">
                          {item.title}
                        </strong>{" "}
                        — {item.description}
                      </>
                    ) : (
                      item
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </AnimatedSection>
  );
}
