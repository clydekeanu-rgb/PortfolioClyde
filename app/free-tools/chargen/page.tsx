import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { FloatingGlassNav } from "@/components/FloatingGlassNav";
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

          <CharGenApp />
        </div>
      </main>
      <Footer />
    </>
  );
}
