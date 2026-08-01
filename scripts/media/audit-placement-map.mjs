import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  CROP_POLICIES,
  PLACEMENT_STATUSES,
  PUBLIC_DIVISIONS,
  repositoryRootFrom,
} from "./media-model.mjs";

export const REQUIRED_PLACEMENT_IDS = Object.freeze([
  "catalogues.dental.cover",
  "catalogues.surgical.cover",
  "company.evolution.static-fallback",
  "company.present-day.primary",
  "company.sialkot.context",
  "home.catalogues.surgical",
  "home.company.primary",
  "home.division.dental",
  "home.division.surgical",
  "home.hero.primary",
  "home.products.featured",
  "products.division.dental",
  "products.division.surgical",
]);

export const PRODUCT_PATTERN_IDS = Object.freeze([
  "pattern.product-card.image",
  "pattern.product-detail.primary",
  "pattern.related-product.image",
  "pattern.inquiry-snapshot.image",
  "pattern.search-result.image",
]);

const ALT_TEXT_POLICIES = new Set(["informative", "decorative", "product-derived"]);
const RESPONSIVE_KEYS = ["desktop", "tablet", "mobile"];

function validateResponsiveRecord(placement, key, errors) {
  const record = placement[key];
  if (!record || typeof record !== "object") {
    errors.push(`${placement.id}: ${key} geometry is required`);
    return;
  }
  if (!record.plannedFigmaPage || typeof record.plannedFigmaPage !== "string") {
    errors.push(`${placement.id}: ${key}.plannedFigmaPage is required`);
  }
  if (record.figmaPage !== null && typeof record.figmaPage !== "string") {
    errors.push(`${placement.id}: ${key}.figmaPage must be null or a string`);
  }
  if (record.figmaPageId !== null && !/^\d+[:-]\d+$/.test(record.figmaPageId ?? "")) {
    errors.push(`${placement.id}: ${key}.figmaPageId must be null or a Figma node id`);
  }
  if (!/^\d+(?:\.\d+)?:\d+(?:\.\d+)?$/.test(record.aspectRatio ?? "")) {
    errors.push(`${placement.id}: ${key}.aspectRatio must use width:height`);
  }
  if (!["contain", "cover"].includes(record.fit)) {
    errors.push(`${placement.id}: ${key}.fit must be contain or cover`);
  }
  if (!record.textSafeArea || typeof record.textSafeArea !== "string") {
    errors.push(`${placement.id}: ${key}.textSafeArea is required`);
  }
}

export function auditPlacementMap(map) {
  const errors = [];
  const blockers = [];
  if (map?.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  if (map?.figmaFileKey !== "w12E41un4krAwBqlo8fHa6") {
    errors.push("figmaFileKey must match the approved THROHI Figma file");
  }
  if (map?.figmaAudit?.status !== "blocked-production-pages-missing") {
    errors.push("figmaAudit must record the missing production pages");
  }
  const observedPages = map?.figmaAudit?.topLevelPages;
  if (
    !Array.isArray(observedPages) ||
    observedPages.length !== 1 ||
    observedPages[0]?.id !== "22:2" ||
    observedPages[0]?.name !== "00 Cover"
  ) {
    errors.push("figmaAudit must preserve the observed 00 Cover page evidence");
  }
  if (!Array.isArray(map?.placements)) {
    return { errors: [...errors, "placements must be an array"], blockers, summary: null };
  }

  const ids = new Set();
  for (const placement of map.placements) {
    if (!placement.id || typeof placement.id !== "string") {
      errors.push("placement id is required");
      continue;
    }
    if (ids.has(placement.id)) errors.push(`duplicate placement id: ${placement.id}`);
    ids.add(placement.id);
    if (!placement.route || typeof placement.route !== "string") errors.push(`${placement.id}: route is required`);
    if (!placement.role || typeof placement.role !== "string") errors.push(`${placement.id}: role is required`);
    if (placement.division !== null && !PUBLIC_DIVISIONS.includes(placement.division)) {
      errors.push(`${placement.id}: invalid public division`);
    }
    if (!placement.plannedFigmaPage || typeof placement.plannedFigmaPage !== "string") {
      errors.push(`${placement.id}: plannedFigmaPage is required`);
    }
    if (placement.figmaPage !== null && typeof placement.figmaPage !== "string") {
      errors.push(`${placement.id}: figmaPage must be null or a string`);
    }
    if (placement.figmaPageId !== null && !/^\d+[:-]\d+$/.test(placement.figmaPageId ?? "")) {
      errors.push(`${placement.id}: figmaPageId must be null or a Figma node id`);
    }
    if (!CROP_POLICIES.includes(placement.cropPolicy)) errors.push(`${placement.id}: invalid cropPolicy`);
    if (!ALT_TEXT_POLICIES.has(placement.altTextPolicy)) errors.push(`${placement.id}: invalid altTextPolicy`);
    if (!PLACEMENT_STATUSES.includes(placement.status)) errors.push(`${placement.id}: invalid status`);
    for (const key of RESPONSIVE_KEYS) validateResponsiveRecord(placement, key, errors);
    if (placement.role === "product-pattern" && placement.cropPolicy !== "contain") {
      errors.push(`${placement.id}: product patterns must use contain`);
    }
    if (placement.status === "production-approved") {
      if (!placement.figmaPage || !placement.figmaPageId) {
        errors.push(`${placement.id}: approved placement requires an observed Figma page`);
      }
      if (!placement.figmaNodeId) errors.push(`${placement.id}: approved placement requires figmaNodeId`);
      if (!placement.codeOwner) errors.push(`${placement.id}: approved placement requires codeOwner`);
      if (!placement.assetId) errors.push(`${placement.id}: approved placement requires assetId`);
    }
    if (placement.required && placement.status.startsWith("blocked-")) {
      blockers.push({ id: placement.id, status: placement.status });
    }
  }

  for (const id of REQUIRED_PLACEMENT_IDS) {
    if (!ids.has(id)) errors.push(`missing required placement: ${id}`);
  }
  for (const id of PRODUCT_PATTERN_IDS) {
    if (!ids.has(id)) errors.push(`missing product pattern: ${id}`);
  }

  const required = map.placements.filter((placement) => placement.required);
  const patterns = map.placements.filter((placement) => placement.role === "product-pattern");
  return {
    errors,
    blockers,
    summary: {
      total: map.placements.length,
      required: required.length,
      productPatterns: patterns.length,
      productionApproved: map.placements.filter((placement) => placement.status === "production-approved").length,
      blocked: blockers.length,
    },
  };
}

export async function loadAndAuditPlacementMap(rootDir = process.cwd()) {
  const filePath = path.join(rootDir, "data/media/placement-map.json");
  const map = JSON.parse(await readFile(filePath, "utf8"));
  return auditPlacementMap(map);
}

async function main() {
  const result = await loadAndAuditPlacementMap(repositoryRootFrom(import.meta.url));
  console.log(JSON.stringify(result));
  if (result.errors.length) process.exitCode = 1;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)
) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
