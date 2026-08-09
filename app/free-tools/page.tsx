import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { FreeTools } from "@/components/FreeTools";
import { SitePage } from "@/components/PageBackdrop";

export const metadata: Metadata = {
  title: "Free Tools | Clyde Abenojar",
  description:
    "A small collection of free tools and prompt builders I use for product photography and creative workflows.",
  openGraph: {
    title: "Free Tools | Clyde Abenojar",
    description:
      "A small collection of free tools and prompt builders I use for product photography and creative workflows.",
    url: "https://clydeabenojar.site/free-tools/",
  },
};

export default function FreeToolsPage() {
  return (
    <SitePage variant="tools">
      <main className="min-h-[100dvh] pt-24">
        <FreeTools />
      </main>
      <Footer />
    </SitePage>
  );
}
