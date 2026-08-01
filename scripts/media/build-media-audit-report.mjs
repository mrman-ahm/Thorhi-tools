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

function buildNextQueue(placementMap, inventory) {
  const queue = placementMap.placements
    .filter((placement) => placement.required && placement.status !== "production-approved")
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

function buildBlockers(placementMap, inventory) {
  const blockers = [];
  for (const placement of placementMap.placements) {
    if (placement.required && placement.status !== "production-approved") {
      blockers.push({
        severity: "blocker",
        type: "placement",
        id: placement.id,
        message: `Required placement is ${placement.status}.`,
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

  const blockers = buildBlockers(placementMap, productInventory);
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
  ].filter((finding) => finding.count > 0);

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
    productSummary: productInventory.summary,
    blockers,
    reviews,
    information: [
      {
        severity: "information",
        type: "public-divisions",
        value: ["surgical", "dental"],
      },
    ],
    nextQueue: buildNextQueue(placementMap, productInventory),
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
    `Required editorial placements: **${audit.placementSummary.required}**. Product patterns: **${audit.placementSummary.productPatterns}**. Production-approved: **${audit.placementSummary.productionApproved}**. Blocked: **${audit.placementSummary.blocked}**.`,
    "",
    "## Existing Product Media",
    "",
    `Runtime products: **${audit.productSummary.runtimeProducts}**. Media records: **${audit.productSummary.mediaRecords}**. Variant codes: **${audit.productSummary.variantCodes}**. Missing media: **${audit.productSummary.missingMedia}**. Duplicate paths: **${audit.productSummary.duplicatePaths}**.`,
    "",
    "## Blocking Issues",
    "",
  ];
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
  const [sourcesRegistry, placementMap] = await Promise.all([
    readJson(path.join(rootDir, "data/media/catalogue-sources.json")),
    readJson(path.join(rootDir, "data/media/placement-map.json")),
  ]);
  const audit = buildMediaAudit({
    sourcesRegistry,
    placementMap,
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
