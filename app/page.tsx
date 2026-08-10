import { V2Hero } from "@/components/v2/V2Hero";
import { V2Band } from "@/components/v2/V2Band";
import { AudienceSegments } from "@/components/v2/AudienceSegments";
import { WorkStack } from "@/components/v2/WorkStack";
import { CapabilitiesBento } from "@/components/v2/CapabilitiesBento";
import { V2TechMarquee } from "@/components/v2/V2TechMarquee";
import { V2About } from "@/components/v2/V2About";
import { HomeFaq } from "@/components/v2/HomeFaq";
import { V2Contact } from "@/components/v2/V2Contact";
import { V2Footer } from "@/components/v2/V2Footer";

export default function Home() {
  return (
    <>
      <main>
        <V2Hero />
        <V2Band />
        <AudienceSegments />
        <WorkStack />
        <CapabilitiesBento />
        <V2TechMarquee />
        <V2About />
        <HomeFaq />
        <V2Contact />
      </main>
      <V2Footer />
    </>
  );
}
