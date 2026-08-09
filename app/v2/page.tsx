import { AnimatedNavFramer } from "@/components/ui/navigation-menu";
import { V2Hero } from "@/components/v2/V2Hero";
import { V2Band } from "@/components/v2/V2Band";
import { WorkStack } from "@/components/v2/WorkStack";
import { CapabilitiesBento } from "@/components/v2/CapabilitiesBento";
import { V2TechMarquee } from "@/components/v2/V2TechMarquee";
import { V2About } from "@/components/v2/V2About";
import { V2Contact } from "@/components/v2/V2Contact";
import { V2Footer } from "@/components/v2/V2Footer";

export default function V2Page() {
  return (
    <>
      <AnimatedNavFramer
        brand="Clyde Abenojar"
        brandHref="/v2"
        items={[
          { name: "Work", href: "#work" },
          { name: "About", href: "#about" },
          { name: "Contact", href: "#contact" },
        ]}
      />
      <main>
        <V2Hero />
        <V2Band />
        <WorkStack />
        <CapabilitiesBento />
        <V2TechMarquee />
        <V2About />
        <V2Contact />
      </main>
      <V2Footer />
    </>
  );
}
