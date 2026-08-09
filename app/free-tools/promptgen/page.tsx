import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { SitePage } from "@/components/PageBackdrop";
import { PromptGenApp } from "@/components/PromptGenApp";

export const metadata: Metadata = {
  title: "PromptGen | Clyde Abenojar",
  description:
    "A guided wizard for building structured AI image-generation prompts for product photography.",
  openGraph: {
    title: "PromptGen | Clyde Abenojar",
    description:
      "A guided wizard for building structured AI image-generation prompts for product photography.",
    url: "https://clydeabenojar.site/free-tools/promptgen/",
  },
};

export default function PromptGenPage() {
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

          <PromptGenApp />
        </div>
      </main>
      <Footer />
    </SitePage>
  );
}
