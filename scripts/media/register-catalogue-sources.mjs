import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { loadCatalogueSources, repositoryRootFrom } from "./media-model.mjs";

async function hashFile(filePath) {
  const bytes = await readFile(filePath);
  return createHash("sha256").update(bytes).digest("hex");
}

export async function verifyCatalogueSources({ rootDir, sourceDirectory = null }) {
  const sources = await loadCatalogueSources(rootDir);
  if (!sourceDirectory) {
    return sources.map((source) => ({
      id: source.id,
      fileName: source.fileName,
      status: source.availability,
      verified: false,
    }));
  }

  const results = [];
  for (const source of sources) {
    const filePath = path.join(sourceDirectory, source.fileName);
    try {
      const [fileStat, sha256] = await Promise.all([stat(filePath), hashFile(filePath)]);
      const sizeMatches = fileStat.size === source.byteSize;
      const hashMatches = sha256 === source.sha256;
      results.push({
        id: source.id,
        fileName: source.fileName,
        status: sizeMatches && hashMatches ? "mounted-verified" : "mounted-mismatch",
        verified: sizeMatches && hashMatches,
        byteSize: fileStat.size,
        sha256,
        expectedByteSize: source.byteSize,
        expectedSha256: source.sha256,
      });
    } catch (error) {
      results.push({
        id: source.id,
        fileName: source.fileName,
        status: "mounted-mismatch",
        verified: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return results;
}

async function main() {
  const rootDir = repositoryRootFrom(import.meta.url);
  const sourceDirectory = process.argv[2] ?? process.env.THROHI_CATALOGUE_SOURCE_DIR ?? null;
  const results = await verifyCatalogueSources({ rootDir, sourceDirectory });
  for (const result of results) console.log(JSON.stringify(result));
  if (sourceDirectory && results.some((result) => !result.verified)) process.exitCode = 1;
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
