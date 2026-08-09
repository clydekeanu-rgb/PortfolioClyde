import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { SitePage } from "@/components/PageBackdrop";
import { BlueprintAIApp } from "@/components/BlueprintAIApp";

export const metadata: Metadata = {
  title: "BlueprintAI | Clyde Abenojar",
  description:
    "A guided wizard for turning architectural concepts into polished photorealistic render prompts.",
  openGraph: {
    title: "BlueprintAI | Clyde Abenojar",
    description:
      "A guided wizard for turning architectural concepts into polished photorealistic render prompts.",
    url: "https://clydeabenojar.site/free-tools/blueprintai/",
  },
};

export default function BlueprintAIPage() {
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

          <BlueprintAIApp />
        </div>
      </main>
      <Footer />
    </SitePage>
  );
}
