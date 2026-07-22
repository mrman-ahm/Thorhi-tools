import { families, products, type DivisionSlug, type Product } from "@/lib/catalogue";

export type SearchFilters = {
  division?: DivisionSlug;
  family?: string;
};

export type SearchResult = {
  product: Product;
  score: number;
  reason: string;
};

export function normalizeText(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ");
}

export function normalizeCode(value: string) {
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

export function scoreProduct(product: Product, query: string): SearchResult | null {
  const raw = query.trim();
  if (!raw) return { product, score: 1, reason: "browse" };

  const normalizedQueryCode = normalizeCode(raw);
  const normalizedProductCode = normalizeCode(product.code);
  let score = 0;
  let reason = "";

  if (normalizedQueryCode === normalizedProductCode) {
    score = 1000;
    reason = "exact code";
  } else if (normalizedProductCode.startsWith(normalizedQueryCode) && normalizedQueryCode.length >= 3) {
    score = 900;
    reason = "code prefix";
  } else if (normalizedProductCode.includes(normalizedQueryCode) && normalizedQueryCode.length >= 3) {
    score = 820;
    reason = "partial code";
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

  const family = families.find(item => item.slug === product.family && item.division === product.division);
  if (family) {
    const familyScore = tokenScore(raw, family.label) - 140;
    if (familyScore > score) {
      score = familyScore;
      reason = "family match";
    }
    for (const alias of family.aliases) {
      const familyAliasScore = tokenScore(raw, alias) - 170;
      if (familyAliasScore > score) {
        score = familyAliasScore;
        reason = "family alias match";
      }
    }
  }

  const divisionScore = tokenScore(raw, product.division) - 250;
  if (divisionScore > score) {
    score = divisionScore;
    reason = "division match";
  }

  return score > 0 ? { product, score, reason } : null;
}

export function searchProducts(query: string, filters: SearchFilters = {}) {
  return products
    .filter(product => product.status !== "rejected")
    .filter(product => !filters.division || product.division === filters.division)
    .filter(product => !filters.family || product.family === filters.family)
    .map(product => scoreProduct(product, query))
    .filter((result): result is SearchResult => Boolean(result))
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));
}
