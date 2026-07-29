import type { Metadata } from "next";
import auditData from "@/../data/working/finemed/catalogue-audit.generated.json";
import { rebuildCatalogue, getRebuildProduct } from "@/lib/rebuild-catalogue";
import { CatalogueReviewClient, type ReviewRecord } from "./review-client";

export const metadata: Metadata = {
  title: "Catalogue Review Workspace",
  description: "Private development workspace for reviewing source-derived catalogue identities.",
  robots: { index: false, follow: false, nocache: true },
};

const divisionLabels = new Map(
  rebuildCatalogue.divisions.map((division) => [division.slug, division.label])
);

const records: ReviewRecord[] = auditData.reviewQueue.map((entry) => {
  const product = getRebuildProduct(entry.id);
  if (!product) throw new Error(`Audit record ${entry.id} is missing from the runtime catalogue.`);

  return {
    id: product.id,
    code: product.code,
    name: product.name,
    division: product.division,
    divisionLabel: divisionLabels.get(product.division) ?? product.division,
    family: product.family,
    familyLabel: product.familyLabel,
    flags: entry.flags,
    variants: product.variants,
    sourceFile: product.sourceFile,
    sourcePdfPage: product.sourcePdfPage,
    sourcePrintedPage: product.sourcePrintedPage,
    imageSprite: product.imageSprite,
  };
});

const families = rebuildCatalogue.families.map((family) => ({
  slug: family.slug,
  label: family.label,
  division: family.division,
}));

export default function CatalogueReviewPage() {
  return (
    <main id="main">
      <CatalogueReviewClient records={records} families={families} />
    </main>
  );
}
