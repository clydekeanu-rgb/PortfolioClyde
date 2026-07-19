import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { FloatingGlassNav } from "@/components/FloatingGlassNav";
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

          <PromptGenApp />
        </div>
      </main>
      <Footer />
    </>
  );
}
