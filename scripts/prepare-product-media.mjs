import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { unzipSync } from "fflate";
import sharp from "sharp";

const textDecoder = new TextDecoder();
const expectedImageCount = 626;
const outputWidth = 1200;
const outputHeight = 900;
const avifQuality = 68;
const concurrency = 6;

function normalizeCode(value) {
  return String(value ?? "").trim().toUpperCase();
}

function sourceCode(sourceText, sourcePath) {
  const match = sourceText.match(/^Representative Code:\s*(.+?)\s*$/m);
  if (!match) throw new Error(`Missing representative code in ${sourcePath}.`);
  return normalizeCode(match[1]);
}

function sourceField(sourceText, label) {
  const match = sourceText.match(new RegExp(`^${label}:\\s*(.+?)\\s*$`, "m"));
  return match?.[1]?.trim() ?? "";
}

function identityTokens(value) {
  return new Set(
    String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter((token) => token.length > 1)
  );
}

function identityScore(productName, sourceName) {
  const productTokens = identityTokens(productName);
  const sourceTokens = identityTokens(sourceName);
  let overlap = 0;
  for (const token of productTokens) {
    if (sourceTokens.has(token)) overlap += 1;
  }
  return overlap * 100 - Math.abs(productTokens.size - sourceTokens.size);
}

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`);
  await rename(temporary, filePath);
}

function buildArchiveIndex(entries) {
  const imagesByCode = new Map();
  const sourcePaths = Object.keys(entries)
    .filter((entry) => entry.endsWith("/source.txt"))
    .sort();

  for (const sourcePath of sourcePaths) {
    const sourceText = textDecoder.decode(entries[sourcePath]);
    const code = sourceCode(sourceText, sourcePath);
    const imagePath = sourcePath.replace(/source\.txt$/, "instrument.png");
    const image = entries[imagePath];
    if (!image) throw new Error(`Missing instrument image for ${code}.`);
    const records = imagesByCode.get(code) ?? [];
    records.push({
      imagePath,
      image,
      sourceName: sourceField(sourceText, "Family"),
      sourceCategory: sourceField(sourceText, "Category"),
    });
    imagesByCode.set(code, records);
  }

  const imageCount = Array.from(imagesByCode.values()).reduce(
    (total, records) => total + records.length,
    0
  );
  if (imageCount !== expectedImageCount) {
    throw new Error(
      `Expected ${expectedImageCount} source images; received ${imageCount}.`
    );
  }
  return imagesByCode;
}

function selectProductSources(products, imagesByCode) {
  const usedPaths = new Set();
  const selected = new Map();

  for (const product of products) {
    const exactCode = normalizeCode(product.code);
    const baseCode = exactCode.replace(/-\d+$/, "");
    const candidates = (imagesByCode.get(exactCode) ?? imagesByCode.get(baseCode) ?? [])
      .filter((candidate) => !usedPaths.has(candidate.imagePath))
      .map((candidate) => ({
        ...candidate,
        score:
          identityScore(product.familyLabel, candidate.sourceCategory) * 1000 +
          identityScore(product.name, candidate.sourceName),
      }))
      .sort(
        (left, right) =>
          right.score - left.score ||
          left.imagePath.localeCompare(right.imagePath)
      );

    if (!candidates.length) {
      throw new Error(`No unassigned high-resolution source image for ${product.code}.`);
    }
    if (candidates.length > 1 && candidates[0].score === candidates[1].score) {
      throw new Error(
        `Ambiguous high-resolution source image for ${product.code}: ` +
          candidates.slice(0, 2).map((candidate) => candidate.sourceName).join(" / ")
      );
    }

    usedPaths.add(candidates[0].imagePath);
    selected.set(product.id, candidates[0]);
  }

  if (usedPaths.size !== expectedImageCount) {
    throw new Error(
      `Expected ${expectedImageCount} unique media assignments; received ${usedPaths.size}.`
    );
  }
  return selected;
}

async function processProduct(product, source, outputDirectory) {
  const outputName = `${product.id}.avif`;
  const outputPath = path.join(outputDirectory, outputName);
  const temporaryPath = `${outputPath}.tmp`;
  const { data, info } = await sharp(source.image)
    .rotate()
    .resize({
      width: outputWidth,
      height: outputHeight,
      fit: "inside",
      withoutEnlargement: true,
    })
    .avif({
      quality: avifQuality,
      effort: 4,
      chromaSubsampling: "4:4:4",
    })
    .toBuffer({ resolveWithObject: true });

  await writeFile(temporaryPath, data);
  await rename(temporaryPath, outputPath);

  return {
    path: `/catalogue/products/${outputName}`,
    width: info.width,
    height: info.height,
    bytes: data.byteLength,
    format: "avif",
    source: "FineMed organized instrument extraction",
  };
}

export async function prepareProductMedia({
  inputPath,
  runtimePath,
  outputDirectory,
  mediaDataPath,
  publicManifestPath,
}) {
  const [archiveBytes, runtimeBytes] = await Promise.all([
    readFile(inputPath),
    readFile(runtimePath),
  ]);
  const entries = unzipSync(new Uint8Array(archiveBytes));
  const runtime = JSON.parse(runtimeBytes.toString());
  const imagesByCode = buildArchiveIndex(entries);

  if (runtime.products.length !== expectedImageCount) {
    throw new Error(
      `Expected ${expectedImageCount} runtime products; received ${runtime.products.length}.`
    );
  }
  const selectedSources = selectProductSources(runtime.products, imagesByCode);

  await mkdir(outputDirectory, { recursive: true });
  const records = new Array(runtime.products.length);
  let cursor = 0;

  async function worker() {
    while (cursor < runtime.products.length) {
      const index = cursor;
      cursor += 1;
      const product = runtime.products[index];
      const source = selectedSources.get(product.id);
      if (!source) throw new Error(`No high-resolution source image for ${product.code}.`);
      records[index] = [
        product.id,
        await processProduct(product, source, outputDirectory),
      ];
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  const products = Object.fromEntries(records);
  const totalBytes = Object.values(products).reduce(
    (total, media) => total + media.bytes,
    0
  );
  const mediaData = {
    generatedAt: runtime.generatedAt,
    source: "FineMed organized instrument extraction",
    count: runtime.products.length,
    delivery: {
      format: "avif",
      quality: avifQuality,
      maximumWidth: outputWidth,
      maximumHeight: outputHeight,
      loading: "native-lazy-except-priority-media",
      fallback: runtime.assetManifest.path,
      totalBytes,
    },
    products,
  };

  await Promise.all([
    writeJson(mediaDataPath, mediaData),
    writeJson(publicManifestPath, {
      generatedAt: mediaData.generatedAt,
      source: mediaData.source,
      count: mediaData.count,
      delivery: mediaData.delivery,
    }),
  ]);

  return mediaData;
}

async function main() {
  const root = process.cwd();
  const mediaData = await prepareProductMedia({
    inputPath: path.join(
      root,
      "sources(previousAI)/FineMed_Organized_Instrument_Images.zip"
    ),
    runtimePath: path.join(root, "src/data/catalogue.runtime.generated.json"),
    outputDirectory: path.join(root, "public/catalogue/products"),
    mediaDataPath: path.join(root, "src/data/catalogue.media.generated.json"),
    publicManifestPath: path.join(root, "public/catalogue/media-manifest.json"),
  });
  console.log(
    JSON.stringify({
      count: mediaData.count,
      format: mediaData.delivery.format,
      totalBytes: mediaData.delivery.totalBytes,
    })
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) ===
    path.resolve(new URL(import.meta.url).pathname)
) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
