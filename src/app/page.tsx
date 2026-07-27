import { CinematicEntry } from "@/components/cinematic-entry";
import { DiscoveryExperience } from "@/components/discovery-experience";
import { FrameEvolutionScene } from "@/components/frame-evolution-scene";
import { HeroExperience } from "@/components/hero-experience";
import { MacroInspectionScene } from "@/components/signature-scenes";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HomepageUtilityChapters } from "@/components/v3/homepage-utility-chapters";
import { products as catalogueProducts } from "@/lib/catalogue";

const featuredCodes = ["04-0101", "01-0501", "SC-01T", "SP-28"];
const featuredProducts = featuredCodes
  .map(code => catalogueProducts.find(product => product.code === code))
  .filter((product): product is NonNullable<typeof product> => Boolean(product));

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
