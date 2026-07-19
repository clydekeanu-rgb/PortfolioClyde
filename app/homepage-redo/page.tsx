/* Sandbox — redesign sections here; live site stays on / */

import Image from "next/image";
import Link from "next/link";
import { FloatingGlassNav } from "@/components/FloatingGlassNav";
import { HomepageRedoHero } from "@/components/HomepageRedoHero";
import { Marquee } from "@/components/ui/marquee";
import "./railway.css";

const email = "clyde@clydeabenojar.site";
const profileImage = "/images/add_profile_photo.jpg";

const techStack = [
  { name: "JavaScript", slug: "javascript" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "Python", slug: "python" },
  { name: "Git", slug: "git" },
  { name: "Docker", slug: "docker" },
  { name: "Supabase", slug: "supabase" },
] as const;

const projects = [
  {
    title: "Konstru",
    subtitle: "Construction Cost Calculator SaaS",
    description:
      "Contractors and homeowners in the Philippines often price a build off rough estimates or manual spreadsheets — slow and easy to get wrong. I built Konstru end-to-end: landing page, auth, subscription paywall, dashboard, and a calculator that generates a full bill of materials and BOQ, priced in PHP.",
    tags: ["Web App", "SaaS"],
    href: "/work/konstru/",
    image: "/images/Konstru.png",
    number: "00",
  },
  {
    title: "The Pickleball Pavilion",
    subtitle: "Cebu's Premier Pickleball Venue",
    description:
      "Cebu's pickleball boom needed a venue that felt as premium as the sport's audience — not just a booking form bolted onto a warehouse. I designed and built the full site: a scrollytelling landing page (GSAP + ScrollTrigger), a real-time court availability and booking system, and an admin dashboard for managing reservations, all for a venue set inside a repurposed warehouse in Cebu City.",
    tags: ["Web App", "Booking System"],
    href: "/work/pickleball-pavilion/",
    image: "/images/PicklePavilion.png",
    number: "01",
  },
  {
    title: "La Purisima Resort",
    subtitle: "Booking & Inquiry Site",
    description:
      "A resort and events venue needed a professional web presence and an easy way for guests to send booking inquiries — without a complex reservation system to manage. I built a landing page and integrated inquiry form that routes requests straight to the business.",
    tags: ["Landing Page", "Business Website"],
    href: "/work/la-purisima-resort/",
    image: "/images/Lapurisima.png",
    number: "02",
  },
  {
    title: "Lumina Studio",
    subtitle: "Personal AI Image Studio",
    description:
      "Most AI image tools make you write a fresh prompt every time, with no way to keep a character consistent. Lumina Studio solves that — text-to-image, image-to-image, and character fusion, plus a built-in prompt builder, powered by Qwen and Wan AI models.",
    tags: ["AI Tool", "Web App"],
    href: "/work/lumina-studio/",
    image: "/images/lumina.png",
    number: "03",
  },
  {
    title: "Song Automation Tool",
    subtitle: "Automated Song Generation Pipeline",
    description:
      "Generating a good AI song isn't one step — it's lyrics, QA, generation, and catching glitches, usually done manually across separate tools. I automated the whole chain: input a story, get back lyrics, an automated QA pass, a generated song via Suno AI, and an audio glitch check — tracked through a Kanban-style job board.",
    tags: ["AI Tool", "Automation"],
    href: "/work/song-automation-tool/",
    image: "/images/Songautomation.png",
    number: "04",
  },
];

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

export default function HomepageRedo() {
  return (
    <div className="railway min-h-screen">
      <FloatingGlassNav />

      <main>
        <HomepageRedoHero profileImage={profileImage} />

        {/* Tech stack */}
        <section
          aria-label="Technologies"
          className="rw-tech-marquee border-y border-[var(--rw-border)] py-8"
        >
          <Marquee pauseOnHover className="[--duration:35s] [--gap:1rem]">
            {techStack.map((tech) => (
              <div key={tech.slug} className="rw-tech-pill">
                {/* Simple Icons CDN — next/image domain not configured for this host */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://cdn.simpleicons.org/${tech.slug}`}
                  alt=""
                  width={16}
                  height={16}
                />
                <span>{tech.name}</span>
              </div>
            ))}
          </Marquee>
        </section>

        {/* Work */}
        <section id="work" className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-mono text-xl font-semibold tracking-normal rw-text">
              Work <span className="rw-brand">/&gt;</span>
            </h2>
            <h3 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.2] rw-text sm:text-4xl lg:text-[2.75rem]">
              A few things I&apos;ve built end-to-end.
            </h3>

            <div className="relative mt-16 flex flex-col gap-20 md:gap-28 lg:gap-32">
              {projects.map((project, index) => {
                const isRight = index % 2 === 1;
                return (
                  <Link
                    key={project.title}
                    href={project.href}
                    className={[
                      "group relative flex w-full flex-col gap-6",
                      "md:items-center md:gap-8 lg:gap-12",
                      "md:w-[92%] lg:w-[88%]",
                      isRight ? "md:ml-auto md:flex-row-reverse" : "md:flex-row",
                    ].join(" ")}
                    aria-label={`View ${project.title}`}
                  >
                    <div
                      className={[
                        "rw-media relative aspect-[16/10] w-full shrink-0 overflow-hidden",
                        "md:w-[52%] lg:w-[50%]",
                      ].join(" ")}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, (min-width: 768px) 52vw, 100vw"
                        className="object-cover"
                      />
                    </div>

                    <div
                      className={[
                        "flex w-full flex-col",
                        "md:w-[48%] lg:w-[50%]",
                        isRight
                          ? "md:items-end md:text-right"
                          : "md:items-start md:text-left",
                      ].join(" ")}
                    >
                      <p className="font-mono text-sm rw-brand">
                        {project.subtitle}
                      </p>
                      <h4 className="mt-2 font-mono text-2xl font-semibold leading-tight rw-text sm:text-3xl lg:text-4xl">
                        {project.title}
                      </h4>
                      <div
                        className={[
                          "rw-divider mt-4 h-0.5 w-40 sm:w-52",
                          isRight ? "md:ml-auto" : "",
                        ].join(" ")}
                      />
                      <p className="mt-4 max-w-[55ch] text-base leading-[1.6] rw-muted sm:text-lg">
                        {project.description}
                      </p>
                      <div
                        className={[
                          "mt-4 flex flex-wrap gap-2",
                          isRight ? "md:justify-end" : "",
                        ].join(" ")}
                      >
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rw-tag px-3 py-1 font-mono text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div
                        className={[
                          "mt-6 flex items-center gap-3 font-mono text-sm font-semibold rw-muted",
                          isRight ? "md:justify-end" : "",
                        ].join(" ")}
                      >
                        <span>{project.number}</span>
                        <span aria-hidden="true">→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-mono text-xl font-semibold tracking-normal rw-text">
              About <span className="rw-brand">/&gt;</span>
            </h2>

            <div className="mt-10 max-w-2xl text-lg leading-[1.6] rw-muted">
              <p>
                I&apos;m Clyde — I build web apps, AI tools, and business websites
                using AI-assisted development.
              </p>
              <p className="mt-7">
                I&apos;m upfront about how I work: I&apos;m not writing every line
                of code by hand. I use tools like Claude and Codex, but the real
                work is in the scoping — figuring out exactly what needs to be
                built, cutting the parts that don&apos;t matter, and fixing
                precisely what&apos;s broken instead of guessing. That&apos;s how a
                project ships fast without burning your budget on trial and error.
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

            <div className="mt-12 max-w-3xl">
              <h3 className="text-[1.75rem] font-semibold leading-[1.2] rw-text">
                What I Can Build For You
              </h3>
              <ul className="mt-6 space-y-4 text-base leading-[1.6] sm:text-lg">
                {capabilities.map((item) => (
                  <li key={item.title} className="rw-card p-4">
                    <div className="flex gap-3">
                      <span className="mt-1 rw-brand" aria-hidden="true">
                        —
                      </span>
                      <span>
                        <strong className="font-semibold rw-text">
                          {item.title}
                        </strong>{" "}
                        <span className="rw-muted">{item.description}</span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center font-mono text-xl font-semibold tracking-normal rw-text">
              Contact <span className="rw-brand">/&gt;</span>
            </h2>
            <h3 className="mt-8 text-center text-[clamp(2.5rem,5vw,3rem)] font-bold leading-[1.1] rw-text">
              Let&apos;s build something.
            </h3>
            <p className="mx-auto mt-5 max-w-xl text-center text-base leading-[1.6] rw-muted">
              Open to freelance projects and collaborations.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rw-card p-6">
                <p className="font-mono text-xs font-semibold uppercase rw-muted">
                  const email =
                </p>
                <a
                  href={`mailto:${email}`}
                  className="mt-2 block break-words text-lg font-semibold rw-text transition-colors hover:text-[var(--rw-brand-soft)]"
                >
                  {email}
                </a>
              </div>

              <div className="rw-card p-6">
                <p className="font-mono text-xs font-semibold uppercase rw-muted">
                  function startConversation()
                </p>
                <h4 className="mt-4 text-2xl font-semibold leading-snug rw-text">
                  Have a product, site, or workflow that needs a careful build?
                </h4>
                <a
                  href={`mailto:${email}?subject=Project%20Inquiry`}
                  className="rw-cta mt-6 inline-flex px-5 py-3 text-sm font-semibold"
                >
                  &gt; send_message()
                </a>
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-xl space-y-3 font-mono text-sm rw-muted">
              <a
                href="https://www.linkedin.com/in/clyde-keanu-abenojar-b3b578346"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-[var(--rw-brand-soft)]"
              >
                <span className="rw-brand">&gt;</span>{" "}
                linkedin.com/in/clyde-keanu-abenojar-b3b578346
              </a>
              <a
                href="https://github.com/clydekeanu-rgb"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-[var(--rw-brand-soft)]"
              >
                <span className="rw-brand">&gt;</span> github.com/clydekeanu-rgb
              </a>
              <a
                href={`mailto:${email}`}
                className="block transition-colors hover:text-[var(--rw-brand-soft)]"
              >
                <span className="rw-brand">&gt;</span> {email}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="rw-footer py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">
            {"// "}&copy; {new Date().getFullYear()} Clyde Abenojar
          </p>
          <p className="font-mono">clydeabenojar.site</p>
        </div>
      </footer>
    </div>
  );
}
