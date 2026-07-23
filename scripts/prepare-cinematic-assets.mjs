import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { unzipSync } from "fflate";

const root = resolve(process.cwd());
const sourceDirectory = join(root, "assets", "sector9d");
const outputDirectory = join(root, "public", "media", "sector9d");
const expectedFiles = ["intro.mp4", "evolution-sprite.webp"];
const manifestPath = join(outputDirectory, "manifest.json");

mkdirSync(outputDirectory, { recursive: true });

function writeManifest(available, reason) {
  writeFileSync(manifestPath, JSON.stringify({
    available,
    intro: available ? "/media/sector9d/intro.mp4" : null,
    sprite: available ? "/media/sector9d/evolution-sprite.webp" : null,
    frameCount: 260,
    reason
  }, null, 2));
}

const alreadyPrepared = expectedFiles.every(file => existsSync(join(outputDirectory, file)));
if (alreadyPrepared) {
  writeManifest(true, "prepared");
  console.log("Sector 9D cinematic assets are already prepared.");
  process.exit(0);
}

if (!existsSync(sourceDirectory)) {
  writeManifest(false, "source-bundle-missing");
  console.warn("Sector 9D source bundle is not present. The application will use its accessible media fallback.");
  process.exit(0);
}

const chunks = readdirSync(sourceDirectory)
  .filter(file => /^cinematic-assets\.part-\d+\.b64$/.test(file))
  .sort((left, right) => left.localeCompare(right));

if (!chunks.length) {
  writeManifest(false, "source-chunks-missing");
  console.warn("Sector 9D source chunks are not present. The application will use its accessible media fallback.");
  process.exit(0);
}

const base64 = chunks.map(file => readFileSync(join(sourceDirectory, file), "utf8").trim()).join("");
const archive = Buffer.from(base64, "base64");
const extracted = unzipSync(archive);

const aliases = new Map([
  ["intro-tiny.mp4", "intro.mp4"],
  ["intro-lite.mp4", "intro.mp4"],
  ["intro-web.mp4", "intro.mp4"],
  ["evolution-sprite-tiny.webp", "evolution-sprite.webp"],
  ["evolution-sprite-lite.webp", "evolution-sprite.webp"],
  ["evolution-sprite.webp", "evolution-sprite.webp"]
]);

for (const [sourceName, outputName] of aliases) {
  const file = extracted[sourceName];
  if (!file || existsSync(join(outputDirectory, outputName))) continue;
  writeFileSync(join(outputDirectory, outputName), file);
}

const missing = expectedFiles.filter(file => !existsSync(join(outputDirectory, file)));
if (missing.length) {
  rmSync(outputDirectory, { recursive: true, force: true });
  mkdirSync(outputDirectory, { recursive: true });
  writeManifest(false, "bundle-incomplete");
  throw new Error(`Sector 9D media bundle is incomplete: ${missing.join(", ")}`);
}

writeManifest(true, "prepared-from-source-chunks");
console.log(`Prepared Sector 9D cinematic media from ${chunks.length} source chunks.`);
