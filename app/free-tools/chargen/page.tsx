import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CharGen | Clyde Abenojar",
  description:
    "A prompt-builder experience for creating Philippines-realism scene descriptions and image prompts.",
  openGraph: {
    title: "CharGen | Clyde Abenojar",
    description:
      "A prompt-builder experience for creating Philippines-realism scene descriptions and image prompts.",
    url: "https://clydeabenojar.site/free-tools/chargen/",
  },
};

export default function CharGenPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-6xl px-6 py-8 sm:py-10">
          <Link
            href="/free-tools/"
            className="font-mono text-sm text-secondary transition-colors hover:text-accent"
          >
            {"← Back to free tools"}
          </Link>

          <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
            <div className="border-b border-border px-4 py-3 sm:px-6">
              <p className="font-mono text-sm text-accent">CharGen</p>
              <p className="mt-1 text-sm text-secondary">
                This opens the standalone prompt builder in the same portfolio shell as the other free tools.
              </p>
            </div>
            <iframe
              src="/chargen/"
              title="CharGen prompt builder"
              className="h-[80vh] w-full border-0 bg-background"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
