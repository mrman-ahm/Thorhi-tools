import catalogueData from "@/data/catalogue.generated.json";

export const divisionSlugs = ["surgical", "dental"] as const;
export type DivisionSlug = (typeof divisionSlugs)[number];
export type PublicationStatus = "seed" | "approved" | "draft" | "rejected";
export type ImageState = "placeholder" | "available" | "missing";

export type CatalogueDocument = {
  title: string;
  href?: string;
  fileType: "PDF";
  fileSize?: string;
  updatedAt?: string;
  status: "pending" | "available";
};

export type ProductVariant = {
  id: string;
  label: string;
  value: string;
  verified: boolean;
  pdfPage?: number;
  printedPage?: number;
  sourceFile?: string;
};

export type ProductSpecification = {
  label: string;
  value: string;
  verified: boolean;
};

export type ImageSprite = {
  sheet: number;
  row: number;
  column: number;
  columns: number;
  rows: number;
  cellSize: number;
};

export type Division = {
  slug: DivisionSlug;
  label: string;
  index: string;
  description: string;
  familySlugs: string[];
  documents: CatalogueDocument[];
  productCount: number;
  variantCount: number;
};

export type ProductFamily = {
  slug: string;
  division: DivisionSlug;
  label: string;
  index: string;
  description: string;
  aliases: string[];
  order: number;
  productCount: number;
  variantCount: number;
};

export type Product = {
  id: string;
  slug: string;
  code: string;
  name: string;
  division: DivisionSlug;
  family: string;
  description: string;
  aliases: string[];
  status: PublicationStatus;
  imageState: ImageState;
  image?: string | null;
  imageSprite?: ImageSprite | null;
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  documents: CatalogueDocument[];
  relatedProductIds: string[];
  catalogue: string;
  sourceFile: string;
  sourcePdfPage: number;
  sourcePrintedPage?: number;
  legacyUrl?: string;
  updatedAt: string;
  approvalNotes: string;
};

export type CatalogueCounts = {
  divisions: number;
  families: number;
  products: number;
  variants: number;
  images: number;
};

type GeneratedCatalogue = {
  generatedAt: string;
  source: string;
  counts: CatalogueCounts;
  divisions: Division[];
  families: ProductFamily[];
  products: Product[];
  uncoveredVariantImageAssignments: unknown[];
};

const generated = catalogueData as GeneratedCatalogue;

export const catalogueGeneratedAt = generated.generatedAt;
export const catalogueSource = generated.source;
export const catalogueCounts = generated.counts;
export const divisions: readonly Division[] = generated.divisions;
export const families: readonly ProductFamily[] = generated.families;
export const products: readonly Product[] = generated.products;

const divisionBySlug = new Map(divisions.map(division => [division.slug, division]));
const familyByRoute = new Map(families.map(family => [`${family.division}/${family.slug}`, family]));
const productByRoute = new Map(products.map(product => [`${product.division}/${product.family}/${product.slug}`, product]));
const productById = new Map(products.map(product => [product.id, product]));

export function getDivision(slug: string) {
  return divisionBySlug.get(slug as DivisionSlug);
}

export function getFamily(division: string, family: string) {
  return familyByRoute.get(`${division}/${family}`);
}

export function getProduct(division: string, family: string, product: string) {
  return productByRoute.get(`${division}/${family}/${product}`);
}

export function getFamiliesForDivision(division: string) {
  return families.filter(family => family.division === division).sort((a, b) => a.order - b.order);
}

export function getProductsForDivision(division: string) {
  return products.filter(product => product.division === division && product.status !== "rejected");
}

export function getProductsForFamily(division: string, family: string) {
  return products.filter(product => product.division === division && product.family === family && product.status !== "rejected");
}

export function getRelatedProducts(product: Product) {
  return product.relatedProductIds.map(id => productById.get(id)).filter((item): item is Product => Boolean(item));
}

export function productHref(product: Pick<Product, "division" | "family" | "slug">) {
  return `/products/${product.division}/${product.family}/${product.slug}`;
}
