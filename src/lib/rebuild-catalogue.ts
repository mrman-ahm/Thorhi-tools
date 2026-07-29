import catalogueData from "@/data/catalogue.runtime.generated.json";

export const rebuildCatalogue = catalogueData;

export type RuntimeCatalogue = typeof rebuildCatalogue;
export type RuntimeDivision = RuntimeCatalogue["divisions"][number];
export type RuntimeFamily = RuntimeCatalogue["families"][number];
export type RuntimeProduct = RuntimeCatalogue["products"][number];
export type RuntimeVariant = RuntimeProduct["variants"][number];

export const rebuildProducts = rebuildCatalogue.products;
export const rebuildFamilies = rebuildCatalogue.families;
export const rebuildDivisions = rebuildCatalogue.divisions;

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const compact = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "");

export function scoreRebuildProduct(product: RuntimeProduct, query: string) {
  const normalizedQuery = normalize(query);
  const compactQuery = compact(query);
  if (!normalizedQuery && !compactQuery) return 1;

  const code = compact(product.code);
  const name = normalize(product.name);
  const aliases = product.aliases.map(normalize);
  const variantCodes = product.variants.map(variant => compact(variant.code));

  if (compactQuery && code === compactQuery) return 100;
  if (compactQuery && variantCodes.includes(compactQuery)) return 94;
  if (compactQuery && code.startsWith(compactQuery)) return 82;
  if (compactQuery && variantCodes.some(variant => variant.startsWith(compactQuery))) return 78;
  if (name === normalizedQuery) return 76;
  if (name.startsWith(normalizedQuery)) return 66;
  if (name.includes(normalizedQuery)) return 54;
  if (aliases.some(alias => alias.includes(normalizedQuery))) {
    return 42;
  }
  return 0;
}

export function getRebuildProduct(id: string) {
  return rebuildProducts.find(product => product.id === id);
}

export function getRebuildProductByCode(code: string) {
  const normalizedCode = compact(code);
  return rebuildProducts.find(product =>
    compact(product.code) === normalizedCode ||
    product.variants.some(variant => compact(variant.code) === normalizedCode)
  );
}

export function isRebuildCatalogueCode(productId: string, code: string) {
  const product = getRebuildProduct(productId);
  if (!product) return false;
  const normalizedCode = compact(code);
  return compact(product.code) === normalizedCode ||
    product.variants.some(variant => compact(variant.code) === normalizedCode);
}
