export type RebuildCatalogueDocument = {
  id: string;
  title: string;
  division: "surgical" | "dental" | "veterinary" | "beauty" | "general";
  format: "PDF";
  sizeLabel: string;
  publishedOrUpdated: string;
  href: string;
};

export function isCompleteCatalogueDocument(
  value: Partial<RebuildCatalogueDocument>,
): value is RebuildCatalogueDocument {
  return Boolean(
    value.id &&
      value.title &&
      value.division &&
      value.format === "PDF" &&
      value.sizeLabel &&
      value.publishedOrUpdated &&
      value.href,
  );
}

export const rebuildCatalogueDocuments: readonly RebuildCatalogueDocument[] = [];
