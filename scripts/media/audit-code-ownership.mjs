import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { repositoryRootFrom } from "./media-model.mjs";

const APPROVED_PUBLIC_DIVISIONS = Object.freeze(["surgical", "dental"]);
const OWNERSHIP_STATUSES = new Set(["mapped", "blocked-missing-route"]);

function sortedUnique(values) {
  return [...new Set(values)].sort();
}

export function auditCodeOwnership(codeAudit, placementMap) {
  const errors = [];
  const blockers = [];
  if (codeAudit?.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  if (codeAudit?.branch !== "media/production-imagery-system") {
    errors.push("branch must be media/production-imagery-system");
  }
  if (!Array.isArray(codeAudit?.approvedPublicDivisions)) {
    errors.push("approvedPublicDivisions must be an array");
  } else if (
    JSON.stringify(sortedUnique(codeAudit.approvedPublicDivisions)) !==
    JSON.stringify([...APPROVED_PUBLIC_DIVISIONS].sort())
  ) {
    errors.push("approvedPublicDivisions must contain only surgical and dental");
  }
  if (!Array.isArray(codeAudit?.observedPublicDivisions)) {
    errors.push("observedPublicDivisions must be an array");
  }
  if (!Array.isArray(codeAudit?.unexpectedPublicDivisions)) {
    errors.push("unexpectedPublicDivisions must be an array");
  }
  if (!Array.isArray(codeAudit?.missingRoutes)) errors.push("missingRoutes must be an array");
  if (!Array.isArray(codeAudit?.evidence) || codeAudit.evidence.length === 0) {
    errors.push("evidence must contain inspected frontend files");
  }
  if (!Array.isArray(codeAudit?.placements)) {
    return { errors: [...errors, "placements must be an array"], blockers, summary: null };
  }
  if (!Array.isArray(placementMap?.placements)) {
    return { errors: [...errors, "placement map must contain placements"], blockers, summary: null };
  }

  const observedUnexpected = sortedUnique(
    codeAudit.observedPublicDivisions.filter(
      (division) => !APPROVED_PUBLIC_DIVISIONS.includes(division)
    )
  );
  if (
    JSON.stringify(observedUnexpected) !==
    JSON.stringify(sortedUnique(codeAudit.unexpectedPublicDivisions))
  ) {
    errors.push("unexpectedPublicDivisions must equal observed minus approved divisions");
  }
  if (observedUnexpected.length > 0) {
    blockers.push({
      id: "global.public-division-scope",
      status: "blocked-public-division-conflict",
      divisions: observedUnexpected,
      evidence: codeAudit.evidence
        .filter((item) =>
          [
            "src/lib/catalogue.ts",
            "src/components/discovery-experience.tsx",
            "src/components/hero-experience.tsx",
            "src/app/products/page.tsx",
          ].includes(item.path)
        )
        .map((item) => item.path),
    });
  }
  if (codeAudit.missingRoutes.includes("/catalogues")) {
    blockers.push({
      id: "global.catalogues-route",
      status: "blocked-missing-route",
      route: "/catalogues",
    });
  }

  const placementIds = new Set(placementMap.placements.map((placement) => placement.id));
  const ownershipIds = new Set();
  for (const ownership of codeAudit.placements) {
    if (!ownership?.placementId || typeof ownership.placementId !== "string") {
      errors.push("ownership placementId is required");
      continue;
    }
    if (ownershipIds.has(ownership.placementId)) {
      errors.push(`duplicate ownership placementId: ${ownership.placementId}`);
    }
    ownershipIds.add(ownership.placementId);
    if (!placementIds.has(ownership.placementId)) {
      errors.push(`ownership references unknown placement: ${ownership.placementId}`);
    }
    if (!OWNERSHIP_STATUSES.has(ownership.status)) {
      errors.push(`${ownership.placementId}: invalid ownership status`);
    }
    if (!Array.isArray(ownership.evidence)) {
      errors.push(`${ownership.placementId}: evidence must be an array`);
    }
    if (!Array.isArray(ownership.blockingReasons)) {
      errors.push(`${ownership.placementId}: blockingReasons must be an array`);
    }
    if (ownership.status === "mapped") {
      if (!ownership.codeOwner || typeof ownership.codeOwner !== "string") {
        errors.push(`${ownership.placementId}: mapped ownership requires codeOwner`);
      }
      if (!Array.isArray(ownership.evidence) || ownership.evidence.length === 0) {
        errors.push(`${ownership.placementId}: mapped ownership requires evidence`);
      }
    }
    if (ownership.status === "blocked-missing-route") {
      if (ownership.codeOwner !== null) {
        errors.push(`${ownership.placementId}: missing-route ownership must have null codeOwner`);
      }
      if (!ownership.blockingReasons?.includes("catalogue-route-missing")) {
        errors.push(`${ownership.placementId}: missing-route ownership must record catalogue-route-missing`);
      }
    }
  }

  for (const placementId of placementIds) {
    if (!ownershipIds.has(placementId)) errors.push(`missing code ownership: ${placementId}`);
  }

  return {
    errors,
    blockers,
    summary: {
      totalPlacements: codeAudit.placements.length,
      mapped: codeAudit.placements.filter((ownership) => ownership.status === "mapped").length,
      blocked: codeAudit.placements.filter((ownership) => ownership.status !== "mapped").length,
      unexpectedDivisions: observedUnexpected.length,
      missingRoutes: codeAudit.missingRoutes.length,
      globalBlockers: blockers.length,
    },
  };
}

export async function loadAndAuditCodeOwnership(rootDir = process.cwd()) {
  const [codeAudit, placementMap] = await Promise.all([
    readFile(path.join(rootDir, "data/media/code-ownership.json"), "utf8").then(JSON.parse),
    readFile(path.join(rootDir, "data/media/placement-map.json"), "utf8").then(JSON.parse),
  ]);
  return auditCodeOwnership(codeAudit, placementMap);
}

async function main() {
  const result = await loadAndAuditCodeOwnership(repositoryRootFrom(import.meta.url));
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
