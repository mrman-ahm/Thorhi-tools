import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { unzipSync } from "fflate";

const root = resolve(process.cwd());
const sourceDirectory = join(root, "assets-source", "sector9d");
const outputDirectory = join(root, "public", "media", "sector9d");
const marker = join(outputDirectory, "evolution", "manifest.json");

if (existsSync(marker) && readFileSync(marker).byteLength > 100) {
  process.exit(0);
}

if (!existsSync(sourceDirectory)) {
  throw new Error(`Sector 9D media source directory is missing: ${sourceDirectory}`);
}

const parts = readdirSync(sourceDirectory)
  .filter(name => /^sector9d-media\.part-\d+\.b64$/.test(name))
  .sort();

if (!parts.length) {
  throw new Error("No Sector 9D base64 media parts were found.");
}

const encoded = parts.map(name => readFileSync(join(sourceDirectory, name), "utf8").trim()).join("");
const archive = Uint8Array.from(Buffer.from(encoded, "base64"));
const files = unzipSync(archive);

mkdirSync(outputDirectory, { recursive: true });
for (const [relativePath, bytes] of Object.entries(files)) {
  if (relativePath.endsWith("/")) continue;
  const destination = join(outputDirectory, relativePath);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, bytes);
}

if (!existsSync(marker)) {
  throw new Error("Sector 9D media archive did not contain evolution/manifest.json.");
}

console.log(`Materialized ${Object.keys(files).length} Sector 9D media entries from ${parts.length} tracked parts.`);
