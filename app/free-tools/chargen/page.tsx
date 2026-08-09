import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { SitePage } from "@/components/PageBackdrop";
import { CharGenApp } from "@/components/CharGenApp";

export const metadata: Metadata = {
  title: "CharGen | Clyde Abenojar",
  description:
    "A guided wizard for building Philippines-realism scene descriptions and image prompts.",
  openGraph: {
    title: "CharGen | Clyde Abenojar",
    description:
      "A guided wizard for building Philippines-realism scene descriptions and image prompts.",
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
        </div>
      </main>
      <Footer />
    </SitePage>
  );
}
