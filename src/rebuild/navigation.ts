export type RebuildPrimaryRoute = {
  label: string;
  href: string;
  productsMenu?: boolean;
};

export type RebuildDivisionRoute = {
  slug: "surgical" | "dental" | "veterinary" | "beauty";
  label: string;
  shortLabel: string;
  href?: string;
  description: string;
  catalogueState: "structured" | "pending";
};

export const rebuildPrimaryNavigation: readonly RebuildPrimaryRoute[] = [
  { label: "Products", href: "/rebuild/products", productsMenu: true },
  { label: "Company", href: "/rebuild#company" },
  { label: "Contact", href: "/rebuild#contact" },
] as const;

export const rebuildDivisionNavigation: readonly RebuildDivisionRoute[] = [
  {
    slug: "surgical",
    label: "Surgical Instruments",
    shortLabel: "Surgical",
    href: "/rebuild/products?division=surgical",
    description: "Browse surgical instrument families by product name, family, or catalogue code.",
    catalogueState: "structured",
  },
  {
    slug: "dental",
    label: "Dental & Orthodontic Instruments",
    shortLabel: "Dental & Orthodontic",
    href: "/rebuild/products?division=dental",
    description: "Browse dental and orthodontic instrument families by name, family, or catalogue code.",
    catalogueState: "structured",
  },
  {
    slug: "veterinary",
    label: "Veterinary Instruments",
    shortLabel: "Veterinary",
    description: "Detailed catalogue records are not yet published. Send THROHI a product reference or requirement.",
    catalogueState: "pending",
  },
  {
    slug: "beauty",
    label: "Beauty Instruments",
    shortLabel: "Beauty",
    description: "Detailed catalogue records are not yet published. Send THROHI a product reference or requirement.",
    catalogueState: "pending",
  },
] as const;

export const rebuildProductUtilities = [
  { label: "Browse all products", href: "/rebuild/products" },
] as const;

export const rebuildPersistentUtilities = {
  inquiry: { label: "Inquiry List", href: "/rebuild/inquiry" },
} as const;

export function isRebuildRouteActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  const routePath = href.split("#", 1)[0].split("?", 1)[0];
  if (routePath === "/rebuild") return pathname === "/rebuild";
  return pathname === routePath || pathname.startsWith(`${routePath}/`);
}
