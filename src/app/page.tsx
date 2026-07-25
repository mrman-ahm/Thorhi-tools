import { CinematicEntry } from "@/components/cinematic-entry";
import { DiscoveryExperience } from "@/components/discovery-experience";
import { FrameEvolutionScene } from "@/components/frame-evolution-scene";
import { HeroExperience } from "@/components/hero-experience";
import { MacroInspectionScene } from "@/components/signature-scenes";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HomepageUtilityChapters } from "@/components/v3/homepage-utility-chapters";
import type { PreviewProduct } from "@/components/catalogue-preview";

const products: readonly PreviewProduct[] = [
  { family: "SURGICAL · SCISSORS", name: "Operating Scissors", code: "THR-SC-001" },
  { family: "SURGICAL · FORCEPS", name: "Dressing Forceps", code: "THR-FC-014" },
  { family: "SURGICAL · SUTURING", name: "Needle Holder", code: "THR-NH-007" },
  { family: "DENTAL · EXTRACTION", name: "Dental Extraction Forceps", code: "THR-DE-021" }
];

export default function HomePage() {
  return <>
    <CinematicEntry />
    <SiteHeader />
    <main id="main" className="v2-home v3-home">
      <HeroExperience />
      <DiscoveryExperience />
      <MacroInspectionScene />
      <FrameEvolutionScene />
      <HomepageUtilityChapters products={products} />
    </main>
    <SiteFooter />
  </>;
}
