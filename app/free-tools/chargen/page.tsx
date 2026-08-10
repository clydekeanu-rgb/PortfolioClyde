import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { SitePage } from "@/components/PageBackdrop";
import { CharGenApp } from "@/components/CharGenApp";
import { ToolHireCta } from "@/components/ToolHireCta";
import { getFreeTool } from "@/lib/free-tools";

const tool = getFreeTool("chargen")!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.seoDescription,
  openGraph: {
    title: tool.seoTitle,
    description: tool.seoDescription,
    url: "https://clydeabenojar.site/free-tools/chargen/",
  },
};

export default function CharGenPage() {
  return (
    <SitePage variant="tools">
      <main className="min-h-[100dvh] pt-24">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Link
            href="/free-tools/"
            className="v2-mono text-sm transition-colors hover:text-[var(--v2-text)]"
            style={{ color: "var(--v2-muted)" }}
          >
            {"← Back to free tools"}
          </Link>

          <CharGenApp />

          <ToolHireCta
            audience={tool.audience}
            hireLine={tool.hireLine}
            toolSlug={tool.slug}
          />
        </div>
      </main>
      <Footer />
    </SitePage>
  );
}
