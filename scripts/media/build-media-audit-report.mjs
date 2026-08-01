import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { auditPlacementMap } from "./audit-placement-map.mjs";
import { writeProductMediaInventory } from "./audit-product-media.mjs";
import { repositoryRootFrom, validateCatalogueRegistry } from "./media-model.mjs";

function queuePlacement(placement, order) {
  return {
    order,
    type: "placement",
    id: placement.id,
    route: placement.route,
    status: placement.status,
    reason: placement.status === "production-approved" ? "approved" : "mapping-or-candidate-required",
  };
}

function placementOrder(placement) {
  if (placement.id.startsWith("home.") && placement.priority === "critical") return 10;
  if (placement.id.includes("division.")) return 20;
  if (placement.id.startsWith("catalogues.") || placement.id.includes("catalogues.")) return 30;
  if (placement.id.startsWith("company.") || placement.id === "home.company.primary") return 40;
  return 45;
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function validateFigmaEvidence(figmaEvidence, placementMap) {
  if (figmaEvidence === null || figmaEvidence === undefined) {
    return { lookup: null, summary: null };
  }

  assertObject(figmaEvidence, "Figma evidence");
  if (figmaEvidence.schemaVersion !== 1) {
    throw new Error("Figma evidence must use schemaVersion 1");
  }
  if (figmaEvidence.figmaFileKey !== placementMap.figmaFileKey) {
    throw new Error("Figma evidence file key must match the approved placement registry");
  }
  if (!Array.isArray(figmaEvidence.productionPages)) {
    throw new Error("Figma evidence productionPages must be an array");
  }
  if (!Array.isArray(figmaEvidence.placements)) {
    throw new Error("Figma evidence placements must be an array");
  }

  const placementIds = new Set(placementMap.placements.map((placement) => placement.id));
  const lookup = new Map();
  for (const record of figmaEvidence.placements) {
    assertObject(record, "Figma placement evidence");
    if (!record.id || typeof record.id !== "string") {
      throw new Error("Figma placement evidence id is required");
    }
    if (lookup.has(record.id)) {
      throw new Error(`Duplicate Figma placement evidence: ${record.id}`);
    }
    if (!placementIds.has(record.id)) {
      throw new Error(`Unknown Figma placement evidence: ${record.id}`);
    }
    if (typeof record.supportsImage !== "boolean") {
      throw new Error(`${record.id}: Figma evidence supportsImage must be boolean`);
    }
    if (typeof record.productionApproved !== "boolean") {
      throw new Error(`${record.id}: Figma evidence productionApproved must be boolean`);
    }
    lookup.set(record.id, record);
  }

  for (const placement of placementMap.placements) {
    if (!lookup.has(placement.id)) {
      throw new Error(`Missing Figma placement evidence: ${placement.id}`);
    }
  }

  const mapped = figmaEvidence.placements.filter((record) => Boolean(record.nodeId)).length;
  const unmapped = figmaEvidence.placements.length - mapped;
  const dedicatedImageNodes = figmaEvidence.placements.filter(
    (record) => record.supportsImage && Boolean(record.nodeId)
  ).length;
  const noDedicatedImageSlot = figmaEvidence.placements.filter(
    (record) => !record.supportsImage && Boolean(record.nodeId)
  ).length;
  const emptyProductionPages = figmaEvidence.productionPages
    .filter((page) => page?.childCount === 0)
    .map((page) => page.name);

  const computedSummary = {
    placements: figmaEvidence.placements.length,
    mapped,
    unmapped,
    dedicatedImageNodes,
    noDedicatedImageSlot,
  };
  for (const [key, value] of Object.entries(computedSummary)) {
    if (figmaEvidence.summary?.[key] !== value) {
      throw new Error(`Figma evidence summary ${key} must equal ${value}`);
    }
  }

  return {
    lookup,
    summary: {
      productionReady: figmaEvidence.productionReady === true,
      mapped,
      unmapped,
      dedicatedImageNodes,
      noDedicatedImageSlot,
      emptyProductionPages,
      sourcePages: figmaEvidence.sourcePages ?? [],
    },
  };
}

function supportsImage(placement, evidenceLookup) {
  if (!evidenceLookup) return true;
  return evidenceLookup.get(placement.id)?.supportsImage === true;
}

function buildNextQueue(placementMap, inventory, evidenceLookup) {
  const queue = placementMap.placements
    .filter(
      (placement) =>
        placement.required &&
        placement.status !== "production-approved" &&
        supportsImage(placement, evidenceLookup)
    )
    .map((placement) => queuePlacement(placement, placementOrder(placement)));

  const qualityProducts = inventory.products
    .filter((product) => product.qualityFlags.length > 0)
    .map((product) => ({
      order: 50,
      type: "product",
      id: product.productId,
      familyId: product.familyId,
      division: product.division,
      reason: product.qualityFlags.join(", "),
    }));
  queue.push(...qualityProducts);

  const remainingFamilies = new Map();
  for (const product of inventory.products) {
    if (product.qualityFlags.length > 0 || product.identityConfidence !== "unapproved") continue;
    const key = `${product.division}:${product.familyId}`;
    const group = remainingFamilies.get(key) ?? {
      order: 60,
      type: "family-review",
      id: key,
      division: product.division,
      familyId: product.familyId,
      familyLabel: product.familyLabel,
      productIds: [],
      reason: "identity-and-silhouette-review",
    };
    group.productIds.push(product.productId);
    remainingFamilies.set(key, group);
  }
  queue.push(...remainingFamilies.values());

  return queue.sort(
    (left, right) =>
      left.order - right.order ||
      String(left.division ?? "").localeCompare(String(right.division ?? "")) ||
      String(left.familyLabel ?? "").localeCompare(String(right.familyLabel ?? "")) ||
      left.id.localeCompare(right.id)
  );
}

function buildBlockers(placementMap, inventory, evidenceLookup) {
  const blockers = [];
  for (const placement of placementMap.placements) {
    if (
      placement.required &&
      placement.status !== "production-approved" &&
      supportsImage(placement, evidenceLookup)
    ) {
      blockers.push({
        severity: "blocker",
        type: "placement",
        id: placement.id,
        message: `Required image-bearing placement is ${placement.status}.`,
      });
    }
  }
  const productBlockers = [
    ["missingMedia", "product-media", "Runtime products are missing media records."],
    ["orphanMedia", "orphan-media", "Media records do not map to runtime products."],
    ["duplicatePaths", "duplicate-assets", "Multiple products share current asset paths."],
    ["missingPublicFiles", "missing-public-files", "Media records point to absent public files."],
  ];
  for (const [summaryKey, type, message] of productBlockers) {
    const count = inventory.summary[summaryKey] ?? 0;
    if (count > 0) blockers.push({ severity: "blocker", type, count, message });
  }
  return blockers;
}

export function buildMediaAudit({
  sourcesRegistry,
  placementMap,
  figmaEvidence = null,
  productInventory,
  generatedAt = new Date().toISOString(),
}) {
  const sourceErrors = validateCatalogueRegistry(sourcesRegistry);
  if (sourceErrors.length) throw new Error(`Invalid source registry:\n${sourceErrors.join("\n")}`);
  const placementAudit = auditPlacementMap(placementMap);
  if (placementAudit.errors.length) {
    throw new Error(`Invalid placement map:\n${placementAudit.errors.join("\n")}`);
  }
  if (productInventory?.schemaVersion !== 1 || !Array.isArray(productInventory.products)) {
    throw new Error("product inventory must use schemaVersion 1 and include products");
  }

  const validatedEvidence = validateFigmaEvidence(figmaEvidence, placementMap);
  const blockers = buildBlockers(placementMap, productInventory, validatedEvidence.lookup);
  const reviews = [
    {
      severity: "review",
      type: "product-identity",
      count: productInventory.summary.identityReviewRequired,
      message: "Product identity remains unapproved until catalogue or client evidence is attached.",
    },
    {
      severity: "review",
      type: "product-quality",
      count: productInventory.summary.qualityReviewRequired,
      message: "Measurable source-image findings require review without implying identity failure.",
    },
    validatedEvidence.summary && !validatedEvidence.summary.productionReady
      ? {
          severity: "review",
          type: "figma-production-pages",
          count: validatedEvidence.summary.emptyProductionPages.length,
          message: "High-fidelity production pages are empty; wireframe/component nodes are evidence, not production approval.",
        }
      : null,
    validatedEvidence.summary?.unmapped > 0
      ? {
          severity: "review",
          type: "figma-unmapped-placement",
          count: validatedEvidence.summary.unmapped,
          message: "One or more placement contracts have no dedicated Figma node.",
        }
      : null,
  ].filter((finding) => finding && finding.count > 0);

  const textOnlyPlacements = validatedEvidence.lookup
    ? placementMap.placements
        .filter((placement) => validatedEvidence.lookup.get(placement.id)?.supportsImage === false)
        .map((placement) => placement.id)
        .sort()
    : [];

  return {
    schemaVersion: 1,
    generatedAt,
    sourceCatalogues: {
      total: sourcesRegistry.sources.length,
      clientOwned: sourcesRegistry.sources.filter((source) => source.licenseStatus === "client-owned").length,
      mountedVerified: sourcesRegistry.sources.filter((source) => source.availability === "mounted-verified").length,
      attachedNotMounted: sourcesRegistry.sources.filter((source) => source.availability === "attached-not-mounted").length,
      sources: sourcesRegistry.sources.map(({ id, fileName, category, pageCount, byteSize, sha256, availability }) => ({
        id,
        fileName,
        category,
        pageCount,
        byteSize,
        sha256,
        availability,
      })),
    },
    placementSummary: placementAudit.summary,
    figmaEvidence: validatedEvidence.summary,
    productSummary: productInventory.summary,
    blockers,
    reviews,
    information: [
      {
        severity: "information",
        type: "public-divisions",
        value: ["surgical", "dental"],
      },
      ...(validatedEvidence.summary
        ? [
            {
              severity: "information",
              type: "text-only-placements",
              count: textOnlyPlacements.length,
              placementIds: textOnlyPlacements,
              message: "These observed Figma sections have no dedicated image slot and must not trigger decorative image sourcing.",
            },
          ]
        : []),
    ],
    nextQueue: buildNextQueue(placementMap, productInventory, validatedEvidence.lookup),
  };
}

function markdownTableRow(values) {
  return `| ${values.map((value) => String(value).replaceAll("|", "\\|")).join(" | ")} |`;
}

export function renderMediaAuditMarkdown(audit) {
  const lines = [
    "# THROHI Media Audit Report",
    "",
    `Generated: ${audit.generatedAt}`,
    "",
    "## Source Catalogues",
    "",
    `Registered sources: **${audit.sourceCatalogues.total}**. Client-owned: **${audit.sourceCatalogues.clientOwned}**. Mounted and hash-verified: **${audit.sourceCatalogues.mountedVerified}**.`,
    "",
    "| ID | File | Pages | Bytes | Availability |",
    "| --- | --- | ---: | ---: | --- |",
    ...audit.sourceCatalogues.sources.map((source) =>
      markdownTableRow([source.id, source.fileName, source.pageCount, source.byteSize, source.availability])
    ),
    "",
    "## Placement Coverage",
    "",
    `Required editorial placements: **${audit.placementSummary.required}**. Product patterns: **${audit.placementSummary.productPatterns}**. Production-approved: **${audit.placementSummary.productionApproved}**. Blocked in the placement registry: **${audit.placementSummary.blocked}**.`,
    "",
  ];

  if (audit.figmaEvidence) {
    lines.push(
      "## Figma Placement Evidence",
      "",
      `Mapped nodes: **${audit.figmaEvidence.mapped}**. Unmapped contracts: **${audit.figmaEvidence.unmapped}**. Dedicated image nodes: **${audit.figmaEvidence.dedicatedImageNodes}**. Observed nodes without image slots: **${audit.figmaEvidence.noDedicatedImageSlot}**.`,
      "",
      `High-fidelity production pages ready: **${audit.figmaEvidence.productionReady ? "yes" : "no"}**. Empty production pages: **${audit.figmaEvidence.emptyProductionPages.join(", ") || "none"}**.`,
      ""
    );
  }

  lines.push(
    "## Existing Product Media",
    "",
    `Runtime products: **${audit.productSummary.runtimeProducts}**. Media records: **${audit.productSummary.mediaRecords}**. Variant codes: **${audit.productSummary.variantCodes}**. Missing media: **${audit.productSummary.missingMedia}**. Duplicate paths: **${audit.productSummary.duplicatePaths}**.`,
    "",
    "## Blocking Issues",
    ""
  );
  if (audit.blockers.length === 0) lines.push("No production-integration blockers were detected.");
  else for (const blocker of audit.blockers) lines.push(`- **${blocker.id ?? blocker.type}:** ${blocker.message}`);

  lines.push("", "## Next Review Queue", "");
  if (audit.nextQueue.length === 0) lines.push("No remaining media review work.");
  else {
    for (const item of audit.nextQueue) {
      const count = Array.isArray(item.productIds) ? ` (${item.productIds.length} products)` : "";
      lines.push(`- **${item.id}**${count}: ${item.reason}`);
    }
  }
  return `${lines.join("\n")}\n`;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

export async function writeMediaAuditReport(rootDir, options = {}) {
  let productInventory;
  try {
    productInventory = await readJson(path.join(rootDir, "data/media/product-inventory.generated.json"));
  } catch {
    productInventory = await writeProductMediaInventory(rootDir, {
      verifyPublicFiles: options.verifyPublicFiles,
      generatedAt: options.generatedAt,
    });
  }
  const [sourcesRegistry, placementMap, figmaEvidence] = await Promise.all([
    readJson(path.join(rootDir, "data/media/catalogue-sources.json")),
    readJson(path.join(rootDir, "data/media/placement-map.json")),
    readJson(path.join(rootDir, "data/media/figma-placement-evidence.json")),
  ]);
  const audit = buildMediaAudit({
    sourcesRegistry,
    placementMap,
    figmaEvidence,
    productInventory,
    generatedAt: options.generatedAt,
  });
  const jsonPath = path.join(rootDir, "data/media/media-audit.generated.json");
  const markdownPath = path.join(rootDir, "docs/media/MEDIA_AUDIT_REPORT.generated.md");
  await Promise.all([
    mkdir(path.dirname(jsonPath), { recursive: true }),
    mkdir(path.dirname(markdownPath), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(jsonPath, `${JSON.stringify(audit, null, 2)}\n`),
    writeFile(markdownPath, renderMediaAuditMarkdown(audit)),
  ]);
  return audit;
}

async function main() {
  const audit = await writeMediaAuditReport(repositoryRootFrom(import.meta.url));
  console.log(
    JSON.stringify({
      sources: audit.sourceCatalogues.total,
      placements: audit.placementSummary.total,
      imagePlacements: audit.figmaEvidence?.dedicatedImageNodes ?? null,
      products: audit.productSummary.runtimeProducts,
      blockers: audit.blockers.length,
      queueItems: audit.nextQueue.length,
    })
  );
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
