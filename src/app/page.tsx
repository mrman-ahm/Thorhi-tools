import { CinematicEntry } from "@/components/cinematic-entry";
import { DiscoveryExperience } from "@/components/discovery-experience";
import { FrameEvolutionScene } from "@/components/frame-evolution-scene";
import { HeroExperience } from "@/components/hero-experience";
import { MacroInspectionScene } from "@/components/signature-scenes";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HomepageUtilityChapters } from "@/components/v3/homepage-utility-chapters";
import { products as catalogueProducts } from "@/lib/catalogue";

const featuredCodes = new Set(["THR-SC-001", "THR-FC-014", "THR-NH-007", "THR-DE-021"]);
const featuredProducts = catalogueProducts.filter(product => featuredCodes.has(product.code));

export default function HomePage() {
  return <>
    <CinematicEntry />
    <SiteHeader />
    <main id="main" className="v2-home v3-home">
      <HeroExperience />
      <DiscoveryExperience />
      <MacroInspectionScene />
      <FrameEvolutionScene />
      <HomepageUtilityChapters products={featuredProducts} />
    </main>
    <SiteFooter />
  </>;
}
