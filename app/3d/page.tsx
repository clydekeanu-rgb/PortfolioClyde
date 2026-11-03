import type { Metadata } from "next";
import { RendersHeader } from "@/components/renders/RendersHeader";
import { TimeOfDayViewer } from "@/components/renders/TimeOfDayViewer";
import { RendersGallery } from "@/components/renders/RendersGallery";
import { RendersContact } from "@/components/renders/RendersContact";
import { SOFTWARE_PIPELINE } from "@/lib/renders-data";
import { Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "3D Modeling & Architectural Visualization | Clyde Abenojar",
  description:
    "Architectural visualization, precision 3D modeling, and generative concept studies created with SketchUp, Enscape, V-Ray, Archiwyn AI, and Photoshop.",
  alternates: {
    canonical: "https://clydeabenojar.site/3d/",
  },
  openGraph: {
    title: "3D Modeling & Architectural Visualization | Clyde Abenojar",
    description:
      "Architectural visualization, precision 3D modeling, and generative concept studies created with SketchUp, Enscape, V-Ray, Archiwyn AI, and Photoshop.",
    url: "https://clydeabenojar.site/3d/",
    images: [
      {
        url: "/renders/villa-day-angle.png",
        width: 1920,
        height: 1080,
        alt: "Villa Horizon 3D Architectural Render",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Modeling & Architectural Visualization | Clyde Abenojar",
    description:
      "Architectural visualization, precision 3D modeling, and generative concept studies created with SketchUp, Enscape, V-Ray, Archiwyn AI, and Photoshop.",
    images: ["/renders/villa-day-angle.png"],
  },
};

export default function ThreeDPage() {
  return (
    <div
      className="min-h-[100dvh] flex flex-col text-[var(--v2-text)]"
      style={{ backgroundColor: "var(--v2-bg)" }}
    >
      <RendersHeader />

      <main className="flex-1 pt-24 sm:pt-28">
        {/* Hero Section */}
        <section className="pt-8 sm:pt-12 pb-12 sm:pb-16 border-b" style={{ borderColor: "var(--v2-border)" }}>
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl">
              <p
                className="v2-mono text-xs uppercase tracking-wider"
                style={{ color: "var(--v2-accent-text)" }}
              >
                {"// 3D ARCHITECTURAL VISUALIZATION"}
              </p>
              <h1 className="v2-display mt-4 text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight leading-[1.08]">
                Architectural form, light, and spatial precision.
              </h1>
              <p
                className="mt-4 text-base sm:text-lg leading-relaxed max-w-2xl"
                style={{ color: "var(--v2-muted)" }}
              >
                High-resolution residential architecture, outdoor amenities, and concept studies modeled in SketchUp and rendered across Enscape, V-Ray, and Archiwyn AI.
              </p>

              {/* Software Pipeline Badges */}
              <div className="mt-8 pt-6 border-t flex flex-wrap items-center gap-3"
                style={{ borderColor: "var(--v2-border)" }}
              >
                <div className="flex items-center gap-2 mr-2 text-xs" style={{ color: "var(--v2-muted)" }}>
                  <Layers className="h-4 w-4 text-[var(--v2-accent-text)]" />
                  <span className="v2-mono text-xs">Production stack:</span>
                </div>

                {SOFTWARE_PIPELINE.map((tool) => (
                  <div
                    key={tool.name}
                    className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
                    style={{
                      borderColor: "var(--v2-border)",
                      backgroundColor: "var(--v2-surface)",
                      color: "var(--v2-text)",
                    }}
                  >
                    <span className="font-semibold">{tool.name}</span>
                    <span
                      className="v2-mono text-[10px] px-1.5 py-0.2 rounded"
                      style={{
                        backgroundColor: "var(--v2-bg)",
                        color: "var(--v2-accent-text)",
                      }}
                    >
                      {tool.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Lighting Rig */}
            <div className="mt-14">
              <TimeOfDayViewer />
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6">
              <p
                className="v2-mono text-xs uppercase tracking-wider"
                style={{ color: "var(--v2-faint)" }}
              >
                Catalog
              </p>
              <h2 className="v2-display mt-2 text-xl sm:text-2xl font-semibold tracking-tight">
                Selected Renders and Spatial Studies
              </h2>
            </div>

            <RendersGallery />
          </div>
        </section>

        {/* Contact Closer */}
        <RendersContact />
      </main>

      {/* Footer */}
      <footer
        className="py-12 border-t"
        style={{
          backgroundColor: "var(--v2-surface)",
          borderColor: "var(--v2-border)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ color: "var(--v2-muted)" }}
        >
          <p>
            © {new Date().getFullYear()} Clyde Abenojar. Architectural renders and 3D modeling showcase.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="mailto:clyde@clydeabenojar.site"
              className="transition-colors hover:text-[var(--v2-text)]"
            >
              clyde@clydeabenojar.site
            </a>
            <span style={{ color: "var(--v2-border)" }}>•</span>
            <a
              href="/"
              className="transition-colors hover:text-[var(--v2-text)]"
            >
              Main Portfolio
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
