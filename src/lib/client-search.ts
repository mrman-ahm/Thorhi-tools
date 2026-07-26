import searchData from "@/data/catalogue-search.generated.json";
import type { DivisionSlug } from "@/lib/catalogue";

export type ClientSearchProduct = {
  id: string;
  slug: string;
  code: string;
  name: string;
  division: DivisionSlug;
  family: string;
  aliases: string[];
  variantCodes: string[];
  variantDescriptions: string[];
};

export type ClientSearchResult = {
  product: ClientSearchProduct;
  score: number;
  reason: string;
};

const records = searchData as ClientSearchProduct[];

function normalizeText(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ");
}

function normalizeCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function tokenScore(query: string, candidate: string) {
  const q = normalizeText(query);
  const c = normalizeText(candidate);
  if (!q) return 0;
  if (c === q) return 700;
  if (c.startsWith(q)) return 600;
  const tokens = q.split(" ").filter(Boolean);
  if (tokens.every(token => c.includes(token))) return 500 + tokens.length * 5;
  if (c.includes(q)) return 430;
  return 0;
}

function scoreRecord(product: ClientSearchProduct, query: string): ClientSearchResult | null {
  const raw = query.trim();
  if (!raw) return { product, score: 1, reason: "browse" };

  const queryCode = normalizeCode(raw);
  const productCode = normalizeCode(product.code);
  let score = 0;
  let reason = "";

  if (queryCode === productCode) {
    score = 1000;
    reason = "exact code";
  } else if (queryCode.length >= 3 && productCode.startsWith(queryCode)) {
    score = 900;
    reason = "code prefix";
  } else if (queryCode.length >= 3 && productCode.includes(queryCode)) {
    score = 820;
    reason = "partial code";
  }

  for (const variantCode of product.variantCodes) {
    const normalized = normalizeCode(variantCode);
    const variantScore = normalized === queryCode ? 970 : queryCode.length >= 3 && normalized.includes(queryCode) ? 790 : 0;
    if (variantScore > score) {
      score = variantScore;
      reason = variantScore === 970 ? "exact variant code" : "variant-code match";
    }
  }

  const nameScore = tokenScore(raw, product.name);
  if (nameScore > score) {
    score = nameScore;
    reason = nameScore >= 700 ? "exact product name" : nameScore >= 600 ? "product-name prefix" : "product-name match";
  }

  for (const alias of product.aliases) {
    const aliasScore = tokenScore(raw, alias) - 50;
    if (aliasScore > score) {
      score = aliasScore;
      reason = "alias match";
    }
  }

  for (const description of product.variantDescriptions) {
    const descriptionScore = tokenScore(raw, description) - 190;
    if (descriptionScore > score) {
      score = descriptionScore;
      reason = "variant-description match";
    }
  }

  return score > 0 ? { product, score, reason } : null;
}

export function clientSearchProducts(query: string) {
  return records
    .map(product => scoreRecord(product, query))
    .filter((result): result is ClientSearchResult => Boolean(result))
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));
}
