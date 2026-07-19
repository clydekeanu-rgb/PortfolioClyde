import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { FloatingGlassNav } from "@/components/FloatingGlassNav";
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
    <>
      <FloatingGlassNav />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-5xl px-6 py-8 sm:py-10">
          <Link
            href="/free-tools/"
            className="font-mono text-sm text-secondary transition-colors hover:text-accent"
          >
            {"← Back to free tools"}
          </Link>

          <BlueprintAIApp />
        </div>
      </main>
      <Footer />
    </>
  );
}
