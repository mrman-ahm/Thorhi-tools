export type CompanyDivisionContent = {
  slug: "surgical" | "dental" | "veterinary" | "beauty";
  label: string;
  shortLabel: string;
  description: string;
  catalogueState: "structured" | "pending";
  href?: string;
};

export const companyProfile = {
  name: "THROHI Medical Tools",
  location: "Sialkot, Pakistan",
  introduction:
    "THROHI Medical Tools presents surgical, dental and orthodontic, veterinary, and beauty instrument ranges through a searchable catalogue and structured inquiry workflow.",
  catalogueStatement:
    "Validated catalogue records can be searched by instrument name or product code and collected into one non-commerce Inquiry List.",
  publicationStatement:
    "Public company and document information expands only when the underlying details are verified for publication.",
} as const;

export const companyDivisionCopy: readonly CompanyDivisionContent[] = [
  {
    slug: "surgical",
    label: "Surgical Instruments",
    shortLabel: "Surgical",
    description:
      "Browse structured surgical instrument families by product name, family, or catalogue code.",
    catalogueState: "structured",
    href: "/rebuild/products?division=surgical",
  },
  {
    slug: "dental",
    label: "Dental and Orthodontic Instruments",
    shortLabel: "Dental and Orthodontic",
    description:
      "Browse structured dental and orthodontic instrument families by product name, family, or catalogue code.",
    catalogueState: "structured",
    href: "/rebuild/products?division=dental",
  },
  {
    slug: "veterinary",
    label: "Veterinary Instruments",
    shortLabel: "Veterinary",
    description:
      "Detailed catalogue records are not yet published. Send a known product reference or requirement through the Inquiry List.",
    catalogueState: "pending",
  },
  {
    slug: "beauty",
    label: "Beauty Instruments",
    shortLabel: "Beauty",
    description:
      "Detailed catalogue records are not yet published. Send a known product reference or requirement through the Inquiry List.",
    catalogueState: "pending",
  },
] as const;

export const scissorsEditorialCopy = {
  title: "Scissors through time",
  introduction:
    "A visual editorial sequence follows changes in cutting and surgical instrument form across four broad chapters.",
  disclaimer:
    "This editorial sequence describes the evolution of instrument form. It is not presented as THROHI corporate history.",
  closing:
    "Present-day catalogue discovery depends on clear instrument families, product identities, variants, and reference codes.",
} as const;
