export type VerifiedPreviewFamily = {
  id: string;
  name: string;
  representativeCode: string;
  division: "surgical" | "dental";
  family: string;
  variantCount: number;
  spritePosition: string;
};

export type VerifiedPreviewVariant = {
  code: string;
  configuration: string;
  size: string;
};

/**
 * Small verified records used for visual and interaction development.
 * This file is not the final catalogue ingestion source.
 */
export const verifiedPreviewFamilies: readonly VerifiedPreviewFamily[] = [
  {
    id: "operating-scissors",
    name: "Operating Scissors",
    representativeCode: "04-0101",
    division: "surgical",
    family: "Scissors",
    variantCount: 12,
    spritePosition: "4% 45.833%",
  },
  {
    id: "mayo-hegar-needle-holder",
    name: "Mayo Hegar Needle Holder",
    representativeCode: "09-1301",
    division: "surgical",
    family: "Needle Holders",
    variantCount: 5,
    spritePosition: "96% 54.167%",
  },
  {
    id: "stille-osteotome",
    name: "Stille Osteotome",
    representativeCode: "36-6901",
    division: "surgical",
    family: "Bone Chisels & Osteotomes",
    variantCount: 8,
    spritePosition: "80% 66.667%",
  },
  {
    id: "oliver-wire-bending-plier",
    name: "Oliver Wire Bending Plier",
    representativeCode: "SP-84",
    division: "dental",
    family: "Orthodontic Pliers",
    variantCount: 1,
    spritePosition: "44% 8.333%",
  },
] as const;

export const operatingScissorsVariants: readonly VerifiedPreviewVariant[] = [
  { code: "04-0101", configuration: "Straight · sharp / sharp", size: "14 cm" },
  { code: "04-0102", configuration: "Straight · sharp / sharp", size: "17 cm" },
  { code: "04-0111", configuration: "Curved · sharp / sharp", size: "14 cm" },
  { code: "04-0112", configuration: "Curved · sharp / sharp", size: "17 cm" },
  { code: "04-0201", configuration: "Straight · sharp / blunt", size: "14 cm" },
  { code: "04-0202", configuration: "Straight · sharp / blunt", size: "17 cm" },
  { code: "04-0211", configuration: "Curved · sharp / blunt", size: "14 cm" },
  { code: "04-0212", configuration: "Curved · sharp / blunt", size: "17 cm" },
  { code: "04-0301", configuration: "Straight · blunt / blunt", size: "14 cm" },
  { code: "04-0302", configuration: "Straight · blunt / blunt", size: "17 cm" },
  { code: "04-0311", configuration: "Curved · blunt / blunt", size: "14 cm" },
  { code: "04-0312", configuration: "Curved · blunt / blunt", size: "17 cm" },
] as const;

export function getVerifiedPreviewFamily(id: string) {
  return verifiedPreviewFamilies.find((family) => family.id === id);
}
