import { Marquee } from "@/components/ui/marquee";

const techStack = [
  { name: "TypeScript", slug: "typescript" },
  { name: "JavaScript", slug: "javascript" },
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "Python", slug: "python" },
  { name: "Supabase", slug: "supabase" },
  { name: "Docker", slug: "docker" },
  { name: "Git", slug: "git" },
] as const;

export function V2TechMarquee() {
  return (
    <section
      className="border-y py-8"
      style={{ borderColor: "var(--v2-border)" }}
      aria-label="Technology stack"
    >
      <Marquee pauseOnHover className="v2-marquee-mask p-0 [--duration:38s]">
        {techStack.map((tech) => (
          <div
            key={tech.slug}
            className="v2-marquee-item flex items-center gap-2.5 px-6"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://cdn.simpleicons.org/${tech.slug}`}
              alt=""
              width={20}
              height={20}
              loading="lazy"
            />
            <span
              className="v2-mono text-sm"
              style={{ color: "var(--v2-muted)" }}
            >
              {tech.name}
            </span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
