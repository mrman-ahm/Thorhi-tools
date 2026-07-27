export type RebuildPrimaryRoute = {
  label: string;
  href: string;
  productsMenu?: boolean;
};

export type RebuildDivisionRoute = {
  slug: "surgical" | "dental" | "veterinary" | "beauty";
  label: string;
  shortLabel: string;
  href: string;
  description: string;
  catalogueState: "structured" | "contact";
};

export const rebuildPrimaryNavigation: readonly RebuildPrimaryRoute[] = [
  { label: "Products", href: "/products", productsMenu: true },
  { label: "Company", href: "/company" },
  { label: "Catalogues", href: "/catalogues" },
  { label: "Contact", href: "/contact" },
] as const;

export const rebuildDivisionNavigation: readonly RebuildDivisionRoute[] = [
  {
    slug: "surgical",
    label: "Surgical Instruments",
    shortLabel: "Surgical",
    href: "/products/surgical",
    description: "Scissors, forceps, clamps, needle holders, retractors and related surgical families.",
    catalogueState: "structured",
  },
  {
    slug: "dental",
    label: "Dental & Orthodontic Instruments",
    shortLabel: "Dental & Orthodontic",
    href: "/products/dental",
    description: "Dental and orthodontic instrument families, including pliers, cutters and positioning tools.",
    catalogueState: "structured",
  },
  {
    slug: "veterinary",
    label: "Veterinary Instruments",
    shortLabel: "Veterinary",
    href: "/products/veterinary",
    description: "Contact THROHI for the current verified veterinary instrument range.",
    catalogueState: "contact",
  },
  {
    slug: "beauty",
    label: "Beauty Instruments",
    shortLabel: "Beauty",
    href: "/products/beauty",
    description: "Contact THROHI for the current verified beauty instrument range.",
    catalogueState: "contact",
  },
] as const;

export const rebuildProductUtilities = [
  { label: "Browse all products", href: "/products" },
  { label: "Search by name or code", href: "/search" },
] as const;

export const rebuildPersistentUtilities = {
  search: { label: "Search", href: "/search" },
  inquiry: { label: "Inquiry List", href: "/inquiry" },
  whatsapp: { label: "WhatsApp", href: "/contact#whatsapp" },
} as const;

export function isRebuildRouteActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
