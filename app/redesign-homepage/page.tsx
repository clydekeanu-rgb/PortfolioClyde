import type { Metadata } from "next";
import { FloatingGlassNav } from "@/components/FloatingGlassNav";
import { ScrollCanvasHero } from "@/components/ScrollCanvasHero";
import { ScrollCanvasWork } from "@/components/ScrollCanvasWork";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import "./scroll-canvas-hero.css";

export const metadata: Metadata = {
  title: "Homepage Redesign | Clyde Abenojar",
  description:
    "Experimental scroll-scrubbed canvas homepage redesign for Clyde Abenojar.",
  robots: { index: false, follow: false },
};

export default function RedesignHomepagePage() {
  return (
    <SmoothScrollProvider>
      <FloatingGlassNav />
      <main className="bg-background text-foreground">
        <ScrollCanvasHero />
        <ScrollCanvasWork />
      </main>
    </SmoothScrollProvider>
  );
}
