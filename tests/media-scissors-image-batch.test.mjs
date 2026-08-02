import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'data/media/scissors-image-batch-01.generated.json');

async function readManifest() {
  return JSON.parse(await readFile(manifestPath, 'utf8'));
}

test('Scissors image batch 01 records 15 unique product groups from pages 2 to 4', async () => {
  const manifest = await readManifest();
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.summary.products, 15);
  assert.deepEqual(manifest.summary.pages, [2, 3, 4]);
  assert.equal(new Set(manifest.products.map((item) => item.id)).size, 15);
});

test('every Scissors image record preserves source evidence and pending approval state', async () => {
  const manifest = await readManifest();
  for (const item of manifest.products) {
    assert.equal(item.sourceFile, 'Scissors Catalog(1).pdf');
    assert.ok([2, 3, 4].includes(item.sourcePdfPage), `${item.id} source page`);
    assert.equal(item.sourceBboxPdf.length, 4, `${item.id} source bbox`);
    assert.equal(item.extraction, 'rendered-visible-clip');
    assert.equal(item.renderScale, 6);
    assert.equal(item.format, 'avif');
    assert.ok(item.width >= 580 && item.width <= 1600, `${item.id} width`);
    assert.equal(item.height, 1600, `${item.id} height`);
    assert.match(item.sha256, /^[a-f0-9]{64}$/);
    assert.equal(item.identityApproved, false);
    assert.equal(item.reviewStatus, 'visual-match-pending-final');
  }
});

test('binary delivery remains explicitly separate until the AVIF files are committed', async () => {
  const manifest = await readManifest();
  assert.equal(manifest.delivery.status, 'local-package-ready');
  assert.equal(manifest.delivery.packageFile, 'scissors-image-batch-01.zip');
  assert.equal(manifest.delivery.packageBytes, 425243);
  assert.equal(
    manifest.delivery.packageSha256,
    '3962577505d555d3545f2ebe45b8a9b50d37679eea372656cedd3ef9d5a28987',
  );
});
