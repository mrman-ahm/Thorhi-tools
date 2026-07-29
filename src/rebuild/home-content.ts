import { rebuildDivisionNavigation } from "@/rebuild/navigation";

export type HomeDivisionPresentation = {
  slug: "surgical" | "dental" | "veterinary" | "beauty";
  label: string;
  summary: string;
  state: "structured" | "pending";
  href?: string;
};

export const homeHeroCopy = {
  title: "THROHI Medical Tools",
  description:
    "Surgical, dental, orthodontic, veterinary and beauty instrument ranges from Sialkot, Pakistan.",
} as const;

export const homeCompanyCopy = {
  heading: "Instrument ranges, catalogue identities and one clear inquiry path.",
  body: [
    "THROHI Medical Tools is based in Sialkot, Pakistan and presents Surgical, Dental and Orthodontic, Veterinary, and Beauty instrument ranges.",
    "Validated catalogue records can be searched by product name or code and collected into one structured Inquiry List.",
  ],
} as const;

export const homeDivisionPresentation: readonly HomeDivisionPresentation[] =
  rebuildDivisionNavigation.map((division) => ({
    slug: division.slug,
    label: division.label,
    state: division.catalogueState,
    href: division.href,
    summary:
      division.catalogueState === "structured"
        ? division.description
        : `${division.shortLabel} detailed catalogue records are not yet published. Contact THROHI with a product reference or requirement.`,
  }));
