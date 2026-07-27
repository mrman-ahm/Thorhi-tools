import type { Product } from "@/lib/catalogue";

export const cataloguePageSize = 36;

export const materialFilters = [
  { value: "surgical stainless steel", label: "Surgical stainless steel" },
  { value: "stainless steel", label: "Stainless steel" },
  { value: "tungsten carbide", label: "Tungsten carbide" },
  { value: "titanium", label: "Titanium" },
  { value: "ceramic", label: "Ceramic" },
  { value: "plastic", label: "Plastic / polymer" },
  { value: "silicone", label: "Silicone" },
  { value: "aluminium", label: "Aluminium" }
] as const;

export const finishFilters = [
  { value: "matte", label: "Matte" },
  { value: "satin", label: "Satin" },
  { value: "polished", label: "Polished" },
  { value: "gold plated", label: "Gold plated" },
  { value: "black", label: "Black finish" },
  { value: "coated", label: "Coated" }
] as const;

export type CatalogueFacetValue =
  | (typeof materialFilters)[number]["value"]
  | (typeof finishFilters)[number]["value"];

export function productSearchText(product: Product) {
  return [
    product.name,
    product.code,
    product.description,
    product.catalogue,
    product.family,
    ...product.aliases,
    ...product.specifications.flatMap(item => [item.label, item.value]),
    ...product.variants.flatMap(variant => [variant.label, variant.value])
  ].join(" ").toLowerCase();
}

export function productContainsFacet(product: Product, term?: string) {
  return !term || productSearchText(product).includes(term.toLowerCase());
}

export function resolveMaterial(value?: string) {
  return materialFilters.find(item => item.value === value)?.value;
}

export function resolveFinish(value?: string) {
  return finishFilters.find(item => item.value === value)?.value;
}

export function materialLabel(value?: string) {
  return materialFilters.find(item => item.value === value)?.label;
}

export function finishLabel(value?: string) {
  return finishFilters.find(item => item.value === value)?.label;
}

export function clampPage(value: string | undefined, totalPages: number) {
  const parsed = Number.parseInt(value ?? "1", 10);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(Math.max(1, totalPages), Math.max(1, parsed));
}
