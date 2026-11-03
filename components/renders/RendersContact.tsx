import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/contact";

export function RendersContact() {
  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "3D Architectural Modeling & Rendering Inquiry"
  )}`;

  const capabilities = [
    "Precision architectural massing in SketchUp",
    "Photorealistic daylight, dusk, and night renders in V-Ray and Enscape",
    "Rapid concept ideation and facade iterations via Archiwyn AI",
    "Architectural floor plans and schematic diagrams",
  ];

  return (
    <section id="inquire" className="scroll-mt-24 py-24 sm:py-32 border-t" style={{ borderColor: "var(--v2-border)" }}>
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p
          className="v2-mono text-xs uppercase tracking-wider"
          style={{ color: "var(--v2-accent-text)" }}
        >
          Work with Clyde
        </p>

        <h2 className="v2-display mt-3 text-2xl sm:text-4xl tracking-tight">
          Have an architectural project to visualize?
        </h2>

        <p
          className="mx-auto mt-4 max-w-xl text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--v2-muted)" }}
        >
          Send floor plans, sketches, or 3D models. You will receive clear timelines, high-resolution renders, and iterative reviews.
        </p>

        {/* Capabilities Pill List */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {capabilities.map((cap) => (
            <div
              key={cap}
              className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs text-left"
              style={{
                borderColor: "var(--v2-border)",
                backgroundColor: "var(--v2-surface)",
                color: "var(--v2-muted)",
              }}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--v2-accent-text)] shrink-0" />
              <span>{cap}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={mailtoUrl}
            className="v2-btn v2-btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-medium"
          >
            <Mail className="h-4 w-4" />
            <span>Email for 3D Projects</span>
          </a>

          <Link
            href="/"
            className="v2-btn v2-btn-outline inline-flex items-center gap-2 px-6 py-3 text-sm font-medium"
          >
            <span>Explore Full Portfolio</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-6 text-xs v2-mono" style={{ color: "var(--v2-faint)" }}>
          Direct inquiries: {CONTACT_EMAIL}
        </p>
      </div>
    </section>
  );
}
