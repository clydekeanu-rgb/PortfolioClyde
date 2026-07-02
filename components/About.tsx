import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeading } from "@/components/SectionHeading";

const capabilities = [
  {
    title: "Web Apps & SaaS",
    description:
      "Full products — from landing page to login, dashboard, and the core functionality that makes it worth paying for. I've built and shipped a construction cost calculator with a live paywall, so I know what it takes to go from idea to something a customer would actually subscribe to.",
  },
  {
    title: "AI Tools",
    description:
      "Custom AI-powered tools — image generation studios, automated content pipelines, prompt-driven systems. If a workflow can be automated with AI, I can scope it, build it, and make it something a non-technical user can actually operate.",
  },
  {
    title: "Business Websites",
    description:
      "Landing pages, booking/inquiry sites, and small business web presence — built fast, built clean, and built to actually convert visitors into inquiries.",
  },
  {
    title: "Chatbots & Integrations",
    description:
      "Custom chatbots embedded directly into your existing site to handle customer questions automatically — no rebuild required.",
  },
  {
    title: "3D Modeling & Architectural Rendering",
    description:
      "Available alongside web work for projects that need visuals beyond the browser.",
  },
];

export function About() {
  return (
    <AnimatedSection id="about" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading>About</SectionHeading>

        <div className="mt-10 max-w-2xl font-readable text-lg leading-[1.8] text-secondary">
          <p>
            I&apos;m Clyde — I build web apps, AI tools, and business websites
            using AI-assisted development.
          </p>
          <p className="mt-7">
            I&apos;m upfront about how I work: I&apos;m not writing every line
            of code by hand. I use tools like Claude and Codex, but the real
            work is in the scoping — figuring out exactly what needs to be built,
            cutting the parts that don&apos;t matter, and fixing precisely
            what&apos;s broken instead of guessing. That&apos;s how a project
            ships fast without burning your budget on trial and error.
          </p>
          <p className="mt-7">
            Before this, I spent years in construction project coordination and
            operations management — managing documentation, compliance, and
            day-to-day operations for real businesses. That background shows up
            in how I work now: I scope things properly before I build, and I
            don&apos;t let a project drift.
          </p>
          <p className="mt-7">
            Based in the Philippines, working with clients wherever they are. If
            you&apos;ve got an idea that needs to become a working product,
            let&apos;s talk.
          </p>
        </div>

        <div className="mt-12 max-w-3xl font-readable">
          <h3 className="text-2xl font-bold text-primary">
            What I Can Build For You
          </h3>
          <ul className="mt-6 space-y-5 text-base leading-7 sm:text-lg">
            {capabilities.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="mt-1 text-accent" aria-hidden="true">
                  —
                </span>
                <span>
                  <strong className="font-semibold text-primary">
                    {item.title}
                  </strong>{" "}
                  <span className="text-secondary">{item.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AnimatedSection>
  );
}
