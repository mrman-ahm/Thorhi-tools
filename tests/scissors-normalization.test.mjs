import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../data/media/scissors-normalization/', import.meta.url);

async function load() {
  const index = JSON.parse(await readFile(new URL('index.json', root), 'utf8'));
  const shards = await Promise.all(index.pageFiles.map(async (file) => {
    return JSON.parse(await readFile(new URL(file, root), 'utf8'));
  }));
  return { index, products: shards.flatMap((shard) => shard.products) };
}

test('scissors normalization contains the complete supplied catalogue structure', async () => {
  const { index, products } = await load();
  assert.equal(index.summary.productGroups, 68);
  assert.equal(index.summary.variants, 276);
  assert.equal(products.length, 68);
  assert.equal(index.pageFiles.length, 10);
});

test('every product and catalogue code is unique', async () => {
  const { products } = await load();
  const ids = products.map((product) => product.id);
  const codes = products.flatMap((product) => product.variantCodes);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(codes).size, codes.length);
});

test('every record stays tied to the supplied Scissors catalogue', async () => {
  const { products } = await load();
  for (const product of products) {
    assert.ok(product.sourcePdfPage >= 2 && product.sourcePdfPage <= 11);
    assert.equal(product.sourcePrintedPage, product.sourcePdfPage - 1);
    assert.ok(product.variantCodes.length > 0);
    assert.equal(product.identityApproved, false);
  }
});

test('the ambiguous TC Goldman Fox label remains blocked for client confirmation', async () => {
  const { products } = await load();
  const item = products.find((product) => product.id === 'scissors-goldman-fox-tc');
  assert.ok(item);
  assert.equal(item.sourceLabel, 'TC Jameson Scissors');
  assert.equal(item.displayName, null);
  assert.equal(item.clientConfirmationRequired, true);
  assert.equal(item.recommendedAction, 'client-confirm');
});
