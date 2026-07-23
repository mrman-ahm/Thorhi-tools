import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { basename, join, resolve } from "node:path";
import { unzipSync } from "fflate";

const root = resolve(process.cwd());
const sourceDirectory = join(root, "assets", "sector9d");
const outputDirectory = join(root, "public", "media", "sector9d");
const manifestPath = join(outputDirectory, "manifest.json");
const frameCount = 260;
const columns = 12;

const originalIntroCandidates = [
  "Instruments_reveal_vanish_sequence_202607231803.mp4",
  "intro-source.mp4",
  "intro.mp4"
];
const originalFrameArchiveCandidates = [
  "ezgif-35dd2244dafee1ab-jpg.zip",
  "evolution-frames.zip"
];

function findSource(candidates) {
  return candidates
    .map(file => join(sourceDirectory, file))
    .find(file => existsSync(file)) ?? null;
}

function resetOutput() {
  rmSync(outputDirectory, { recursive: true, force: true });
  mkdirSync(outputDirectory, { recursive: true });
}

function writeManifest(payload) {
  writeFileSync(manifestPath, JSON.stringify({ frameCount, ...payload }, null, 2));
}

function unavailable(reason) {
  resetOutput();
  writeManifest({
    available: false,
    intro: null,
    sprite: null,
    sprites: null,
    reason
  });
  console.warn(`Sector 9D media unavailable (${reason}). The accessible designed fallback will be used.`);
}

function frameNumber(name) {
  const match = basename(name).match(/(\d+)(?=\.[^.]+$)/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

async function createSprite(sharp, frames, config) {
  const rows = Math.ceil(frameCount / columns);
  const width = columns * config.cellWidth;
  const height = rows * config.cellHeight;
  const layers = [];

  for (let index = 0; index < frames.length; index += 1) {
    const input = await sharp(Buffer.from(frames[index][1]))
      .resize(config.cellWidth, config.cellHeight, { fit: "fill", kernel: "lanczos3" })
      .jpeg({ quality: 88, mozjpeg: true })
      .toBuffer();

    layers.push({
      input,
      left: (index % columns) * config.cellWidth,
      top: Math.floor(index / columns) * config.cellHeight
    });
  }

  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  })
    .composite(layers)
    .webp({ quality: config.quality, effort: 5, smartSubsample: true })
    .toFile(join(outputDirectory, config.filename));
}

async function prepareFromOriginalSources(introSource, archiveSource) {
  resetOutput();
  copyFileSync(introSource, join(outputDirectory, "intro.mp4"));

  const extracted = unzipSync(readFileSync(archiveSource));
  const frames = Object.entries(extracted)
    .filter(([name]) => /\.(?:jpe?g)$/i.test(name))
    .sort(([left], [right]) => frameNumber(left) - frameNumber(right));

  if (frames.length !== frameCount) {
    throw new Error(`Expected ${frameCount} JPG frames, received ${frames.length}.`);
  }

  const { default: sharp } = await import("sharp");
  await createSprite(sharp, frames, {
    filename: "evolution-sprite-desktop.webp",
    cellWidth: 400,
    cellHeight: 225,
    quality: 84
  });
  await createSprite(sharp, frames, {
    filename: "evolution-sprite-mobile.webp",
    cellWidth: 240,
    cellHeight: 135,
    quality: 80
  });

  writeManifest({
    available: true,
    intro: "/media/sector9d/intro.mp4",
    sprite: "/media/sector9d/evolution-sprite-desktop.webp",
    sprites: {
      desktop: {
        src: "/media/sector9d/evolution-sprite-desktop.webp",
        cellWidth: 400,
        cellHeight: 225,
        columns
      },
      mobile: {
        src: "/media/sector9d/evolution-sprite-mobile.webp",
        cellWidth: 240,
        cellHeight: 135,
        columns
      }
    },
    reason: "prepared-from-original-mp4-and-frame-archive"
  });

  console.log(`Prepared Sector 9D media from the original MP4 and ${frames.length} source frames.`);
}

function prepareFromChunkBundle() {
  if (!existsSync(sourceDirectory)) return false;

  const chunks = readdirSync(sourceDirectory)
    .filter(file => /^cinematic-assets\.part-\d+\.b64$/.test(file))
    .sort((left, right) => left.localeCompare(right));
  if (!chunks.length) return false;

  try {
    const base64 = chunks.map(file => readFileSync(join(sourceDirectory, file), "utf8").trim()).join("");
    const extracted = unzipSync(Buffer.from(base64, "base64"));
    const introAliases = ["intro-tiny.mp4", "intro-lite.mp4", "intro-web.mp4", "intro.mp4"];
    const spriteAliases = [
      "evolution-sprite-tiny.webp",
      "evolution-sprite-lite.webp",
      "evolution-sprite.webp"
    ];
    const introName = introAliases.find(name => extracted[name]);
    const spriteName = spriteAliases.find(name => extracted[name]);
    if (!introName || !spriteName) return false;

    resetOutput();
    writeFileSync(join(outputDirectory, "intro.mp4"), extracted[introName]);
    writeFileSync(join(outputDirectory, "evolution-sprite-desktop.webp"), extracted[spriteName]);
    writeFileSync(join(outputDirectory, "evolution-sprite-mobile.webp"), extracted[spriteName]);
    writeManifest({
      available: true,
      intro: "/media/sector9d/intro.mp4",
      sprite: "/media/sector9d/evolution-sprite-desktop.webp",
      sprites: {
        desktop: {
          src: "/media/sector9d/evolution-sprite-desktop.webp",
          cellWidth: 240,
          cellHeight: 135,
          columns
        },
        mobile: {
          src: "/media/sector9d/evolution-sprite-mobile.webp",
          cellWidth: 240,
          cellHeight: 135,
          columns
        }
      },
      reason: `prepared-from-${chunks.length}-source-chunks`
    });
    console.log(`Prepared Sector 9D fallback media from ${chunks.length} source chunks.`);
    return true;
  } catch (error) {
    console.warn("Sector 9D chunk bundle is incomplete or invalid; checking for original source media instead.");
    return false;
  }
}

async function main() {
  mkdirSync(sourceDirectory, { recursive: true });
  const introSource = findSource(originalIntroCandidates);
  const archiveSource = findSource(originalFrameArchiveCandidates);

  if (introSource && archiveSource) {
    try {
      await prepareFromOriginalSources(introSource, archiveSource);
      return;
    } catch (error) {
      unavailable(error instanceof Error ? error.message : "original-source-processing-failed");
      process.exitCode = 1;
      return;
    }
  }

  if (prepareFromChunkBundle()) return;

  const missing = [
    introSource ? null : originalIntroCandidates[0],
    archiveSource ? null : originalFrameArchiveCandidates[0]
  ].filter(Boolean).join(", ");
  unavailable(`original-source-files-missing: ${missing}`);
}

await main();
