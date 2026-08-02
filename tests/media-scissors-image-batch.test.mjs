import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'data/media/scissors-image-batch-01.generated.json');

async function sha256(filePath) {
  const bytes = await readFile(filePath);
  return createHash('sha256').update(bytes).digest('hex');
}

test('Scissors image batch 01 contains the approved 15 product groups', async () => {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.summary.products, 15);
  assert.deepEqual(manifest.summary.pages, [2, 3, 4]);
  assert.equal(new Set(manifest.products.map((item) => item.id)).size, 15);
});

test('every Scissors image is a real AVIF file with matching metadata and hash', async () => {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  for (const item of manifest.products) {
    assert.equal(item.format, 'avif');
    assert.ok(item.width >= 580 && item.width <= 1600, `${item.id} width`);
    assert.equal(item.height, 1600, `${item.id} height`);
    assert.equal(item.identityApproved, false);
    assert.equal(item.reviewStatus, 'visual-match-pending-final');
    const filePath = path.join(root, item.path);
    const info = await stat(filePath);
    assert.equal(info.size, item.bytes, `${item.id} byte size`);
    assert.equal(await sha256(filePath), item.sha256, `${item.id} hash`);
    const signature = await readFile(filePath);
    assert.equal(signature.subarray(4, 12).toString('ascii'), 'ftypavif');
  }
});
