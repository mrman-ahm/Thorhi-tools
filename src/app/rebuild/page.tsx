import type { Metadata } from "next";
import { CinematicEntry } from "@/components/cinematic-entry";
import { HomeCompanyIntro } from "@/components/rebuild/home/home-company-intro";
import { HomeDivisionIndex } from "@/components/rebuild/home/home-division-index";
import { HomeEvolutionPreview } from "@/components/rebuild/home/home-evolution-preview";
import { HomeHero } from "@/components/rebuild/home/home-hero";
import { HomeSelectedFamilies } from "@/components/rebuild/home/home-selected-families";
import { HomeUtilitiesContact } from "@/components/rebuild/home/home-utilities-contact";
import {
  getRebuildProductByCode,
  rebuildCatalogue,
  type RuntimeProduct,
} from "@/lib/rebuild-catalogue";

export const metadata: Metadata = {
  title: "THROHI Medical Tools",
  description:
    "Browse THROHI surgical and dental instrument families by product name or code.",
  robots: { index: false, follow: false },
};

function requireProduct(code: string): RuntimeProduct {
  const product = getRebuildProductByCode(code);
  if (!product) throw new Error(`Required rebuild product ${code} is missing.`);
  return product;
}

function divisionCount(slug: "surgical" | "dental") {
  return (
    rebuildCatalogue.divisions.find((division) => division.slug === slug)
      ?.productCount ?? 0
  );
}

const operatingScissors = requireProduct("04-0101");
const oliverPliers = requireProduct("SP-84");
const needleHolder = requireProduct("09-1301");
const osteotome = requireProduct("36-6901");

const selectedProducts = [operatingScissors, needleHolder, osteotome] as const;

export default function RebuildHome() {
  return (
    <>
      <CinematicEntry
        variant="rebuild"
        indexLeft="THROHI MEDICAL TOOLS"
        indexRight="SIALKOT / PAKISTAN"
        eyebrow="INSTRUMENTS IN MOTION"
        title={
          <>
            Precision begins
            <br />
            with the instrument.
          </>
        }
        titleElement="p"
      />

      <main id="main" tabIndex={-1}>
        <HomeHero
          scissors={operatingScissors}
          productCount={rebuildCatalogue.counts.products}
          variantCount={rebuildCatalogue.counts.variants}
        />

        <HomeDivisionIndex
          representatives={{
            surgical: operatingScissors,
            dental: oliverPliers,
          }}
          counts={{
            surgical: divisionCount("surgical"),
            dental: divisionCount("dental"),
          }}
        />

        <HomeSelectedFamilies products={selectedProducts} />
        <HomeCompanyIntro />
        <HomeEvolutionPreview />
        <HomeUtilitiesContact />
      </main>
    </>
  );
}
