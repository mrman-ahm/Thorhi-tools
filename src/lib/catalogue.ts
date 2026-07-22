export const divisionSlugs = ["surgical", "dental", "veterinary", "beauty"] as const;
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
};

export type ProductSpecification = {
  label: string;
  value: string;
  verified: boolean;
};

export type Division = {
  slug: DivisionSlug;
  label: string;
  index: string;
  description: string;
  familySlugs: string[];
  documents: CatalogueDocument[];
};

export type ProductFamily = {
  slug: string;
  division: DivisionSlug;
  label: string;
  index: string;
  description: string;
  aliases: string[];
  order: number;
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
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  documents: CatalogueDocument[];
  relatedProductIds: string[];
  legacyUrl?: string;
  updatedAt: string;
  approvalNotes: string;
};

const pendingDocument = (title: string): CatalogueDocument => ({ title, fileType: "PDF", status: "pending" });

export const divisions: readonly Division[] = [
  {
    slug: "surgical",
    label: "Surgical Instruments",
    index: "01",
    description: "Scissors, forceps, clamps, retractors, suturing, and specialty surgical families.",
    familySlugs: ["scissors", "forceps-clamps", "needle-holders"],
    documents: [pendingDocument("Surgical catalogue")]
  },
  {
    slug: "dental",
    label: "Dental Instruments",
    index: "02",
    description: "Diagnostic, extraction, periodontal, restorative, and orthodontic instrument families.",
    familySlugs: ["extraction", "periodontal", "restorative"],
    documents: [pendingDocument("Dental catalogue")]
  },
  {
    slug: "veterinary",
    label: "Veterinary Instruments",
    index: "03",
    description: "General veterinary, equine, hoof, obstetrical, and bone-surgery instrument families.",
    familySlugs: ["equine", "hoof-farrier", "obstetrical"],
    documents: [pendingDocument("Veterinary catalogue")]
  },
  {
    slug: "beauty",
    label: "Beauty Instruments",
    index: "04",
    description: "Hair scissors, tweezers, manicure, pedicure, and professional salon-tool families.",
    familySlugs: ["hair-scissors", "tweezers", "nail-cuticle"],
    documents: [pendingDocument("Beauty catalogue")]
  }
] as const;

export const families: readonly ProductFamily[] = [
  { slug: "scissors", division: "surgical", label: "Scissors", index: "01", description: "Surgical scissors family route. Product facts remain pending catalogue approval.", aliases: ["surgical scissors", "cutting scissors"], order: 1 },
  { slug: "forceps-clamps", division: "surgical", label: "Forceps & Clamps", index: "02", description: "Surgical forceps and clamps family route.", aliases: ["forceps", "clamps"], order: 2 },
  { slug: "needle-holders", division: "surgical", label: "Needle Holders", index: "03", description: "Suturing and needle-holder family route.", aliases: ["needle holder", "suturing"], order: 3 },
  { slug: "extraction", division: "dental", label: "Extraction", index: "01", description: "Dental extraction instrument family route.", aliases: ["dental extraction", "extraction forceps"], order: 1 },
  { slug: "periodontal", division: "dental", label: "Periodontal", index: "02", description: "Periodontal instrument family route.", aliases: ["periodontal tools", "scalers", "curettes"], order: 2 },
  { slug: "restorative", division: "dental", label: "Restorative", index: "03", description: "Restorative dental instrument family route.", aliases: ["restorative instruments"], order: 3 },
  { slug: "equine", division: "veterinary", label: "Equine", index: "01", description: "Equine instrument family route.", aliases: ["horse instruments", "equine tools"], order: 1 },
  { slug: "hoof-farrier", division: "veterinary", label: "Hoof & Farrier", index: "02", description: "Hoof and farrier instrument family route.", aliases: ["hoof tools", "farrier tools"], order: 2 },
  { slug: "obstetrical", division: "veterinary", label: "Obstetrical", index: "03", description: "Veterinary obstetrical instrument family route.", aliases: ["veterinary obstetrical"], order: 3 },
  { slug: "hair-scissors", division: "beauty", label: "Hair Scissors", index: "01", description: "Professional hair-scissors family route.", aliases: ["salon scissors", "hair cutting scissors"], order: 1 },
  { slug: "tweezers", division: "beauty", label: "Tweezers", index: "02", description: "Professional tweezer family route.", aliases: ["beauty tweezers"], order: 2 },
  { slug: "nail-cuticle", division: "beauty", label: "Nail & Cuticle", index: "03", description: "Manicure, pedicure, nail, and cuticle instrument family route.", aliases: ["manicure", "pedicure", "cuticle tools"], order: 3 }
] as const;

const seedDescription = (label: string) => `Seed catalogue record for validating the ${label} product template. Replace with approved THROHI catalogue copy before publication.`;

export const products: readonly Product[] = [
  { id: "seed-sur-001", slug: "operating-scissors", code: "THR-SC-001", name: "Operating Scissors", division: "surgical", family: "scissors", description: seedDescription("Operating Scissors"), aliases: ["operation scissors", "surgical scissors"], status: "seed", imageState: "placeholder", variants: [], specifications: [], documents: [], relatedProductIds: ["seed-sur-002"], updatedAt: "2026-07-22", approvalNotes: "Technical demonstration record only." },
  { id: "seed-sur-002", slug: "dissecting-scissors", code: "THR-SC-002", name: "Dissecting Scissors", division: "surgical", family: "scissors", description: seedDescription("Dissecting Scissors"), aliases: ["dissection scissors"], status: "seed", imageState: "placeholder", variants: [], specifications: [], documents: [], relatedProductIds: ["seed-sur-001"], updatedAt: "2026-07-22", approvalNotes: "Technical demonstration record only." },
  { id: "seed-sur-003", slug: "dressing-forceps", code: "THR-FC-014", name: "Dressing Forceps", division: "surgical", family: "forceps-clamps", description: seedDescription("Dressing Forceps"), aliases: ["dressing forcep"], status: "seed", imageState: "placeholder", variants: [], specifications: [], documents: [], relatedProductIds: [], updatedAt: "2026-07-22", approvalNotes: "Technical demonstration record only." },
  { id: "seed-sur-004", slug: "needle-holder", code: "THR-NH-007", name: "Needle Holder", division: "surgical", family: "needle-holders", description: seedDescription("Needle Holder"), aliases: ["suturing needle holder"], status: "seed", imageState: "placeholder", variants: [], specifications: [], documents: [], relatedProductIds: [], updatedAt: "2026-07-22", approvalNotes: "Technical demonstration record only." },
  { id: "seed-den-001", slug: "extraction-forceps", code: "THR-DE-021", name: "Dental Extraction Forceps", division: "dental", family: "extraction", description: seedDescription("Dental Extraction Forceps"), aliases: ["tooth extraction forceps"], status: "seed", imageState: "placeholder", variants: [], specifications: [], documents: [], relatedProductIds: [], updatedAt: "2026-07-22", approvalNotes: "Technical demonstration record only." },
  { id: "seed-den-002", slug: "periodontal-curette", code: "THR-DP-010", name: "Periodontal Curette", division: "dental", family: "periodontal", description: seedDescription("Periodontal Curette"), aliases: ["dental curette"], status: "seed", imageState: "placeholder", variants: [], specifications: [], documents: [], relatedProductIds: [], updatedAt: "2026-07-22", approvalNotes: "Technical demonstration record only." },
  { id: "seed-den-003", slug: "restorative-instrument", code: "THR-DR-004", name: "Restorative Instrument", division: "dental", family: "restorative", description: seedDescription("Restorative Instrument"), aliases: ["dental restorative tool"], status: "seed", imageState: "placeholder", variants: [], specifications: [], documents: [], relatedProductIds: [], updatedAt: "2026-07-22", approvalNotes: "Technical demonstration record only." },
  { id: "seed-vet-001", slug: "equine-forceps", code: "THR-VE-008", name: "Equine Forceps", division: "veterinary", family: "equine", description: seedDescription("Equine Forceps"), aliases: ["horse forceps"], status: "seed", imageState: "placeholder", variants: [], specifications: [], documents: [], relatedProductIds: [], updatedAt: "2026-07-22", approvalNotes: "Technical demonstration record only." },
  { id: "seed-vet-002", slug: "hoof-nipper", code: "THR-VH-012", name: "Hoof Nipper", division: "veterinary", family: "hoof-farrier", description: seedDescription("Hoof Nipper"), aliases: ["farrier hoof nipper"], status: "seed", imageState: "placeholder", variants: [], specifications: [], documents: [], relatedProductIds: [], updatedAt: "2026-07-22", approvalNotes: "Technical demonstration record only." },
  { id: "seed-vet-003", slug: "obstetrical-instrument", code: "THR-VO-003", name: "Veterinary Obstetrical Instrument", division: "veterinary", family: "obstetrical", description: seedDescription("Veterinary Obstetrical Instrument"), aliases: ["animal obstetrical tool"], status: "seed", imageState: "placeholder", variants: [], specifications: [], documents: [], relatedProductIds: [], updatedAt: "2026-07-22", approvalNotes: "Technical demonstration record only." },
  { id: "seed-bea-001", slug: "hair-scissors", code: "THR-BH-006", name: "Professional Hair Scissors", division: "beauty", family: "hair-scissors", description: seedDescription("Professional Hair Scissors"), aliases: ["salon scissors", "hair cutting scissors"], status: "seed", imageState: "placeholder", variants: [], specifications: [], documents: [], relatedProductIds: [], updatedAt: "2026-07-22", approvalNotes: "Technical demonstration record only." },
  { id: "seed-bea-002", slug: "precision-tweezers", code: "THR-BT-011", name: "Precision Tweezers", division: "beauty", family: "tweezers", description: seedDescription("Precision Tweezers"), aliases: ["beauty tweezers"], status: "seed", imageState: "placeholder", variants: [], specifications: [], documents: [], relatedProductIds: [], updatedAt: "2026-07-22", approvalNotes: "Technical demonstration record only." },
  { id: "seed-bea-003", slug: "cuticle-nipper", code: "THR-BC-009", name: "Cuticle Nipper", division: "beauty", family: "nail-cuticle", description: seedDescription("Cuticle Nipper"), aliases: ["nail nipper", "manicure nipper"], status: "seed", imageState: "placeholder", variants: [], specifications: [], documents: [], relatedProductIds: [], updatedAt: "2026-07-22", approvalNotes: "Technical demonstration record only." }
] as const;

export function getDivision(slug: string) {
  return divisions.find(division => division.slug === slug);
}

export function getFamily(division: string, family: string) {
  return families.find(item => item.division === division && item.slug === family);
}

export function getProduct(division: string, family: string, product: string) {
  return products.find(item => item.division === division && item.family === family && item.slug === product);
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
  return product.relatedProductIds.map(id => products.find(item => item.id === id)).filter((item): item is Product => Boolean(item));
}

export function productHref(product: Product) {
  return `/products/${product.division}/${product.family}/${product.slug}`;
}
