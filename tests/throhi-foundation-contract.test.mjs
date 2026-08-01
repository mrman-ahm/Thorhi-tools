import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

async function readRequired(path) {
  try {
    return await read(path);
  } catch (error) {
    assert.fail(`Required approved-foundation file is missing: ${path}\n${error}`);
  }
}

test("approved THROHI typography and canonical foundation replace legacy font layers", async () => {
  const [layout, foundation, shell] = await Promise.all([
    read("src/app/layout.tsx"),
    readRequired("src/app/rebuild/throhi-foundation.module.css"),
    read("src/app/rebuild/rebuild-shell.tsx"),
  ]);

  assert.match(layout, /DM_Serif_Display/);
  assert.match(layout, /Instrument_Sans/);
  assert.match(layout, /IBM_Plex_Mono/);
  assert.doesNotMatch(layout, /Cormorant_Garamond|Archivo/);

  assert.match(foundation, /--throhi-emerald-700:\s*#0b6b4e/i);
  assert.match(foundation, /--throhi-blue-600:\s*#3f6475/i);
  assert.match(foundation, /--throhi-paper:\s*#f6f3ea/i);
  assert.match(foundation, /--throhi-ink:\s*#132522/i);
  assert.match(foundation, /--throhi-container-max:\s*1440px/i);
  assert.match(foundation, /--throhi-radius-md:\s*6px/i);
  assert.match(foundation, /prefers-reduced-motion/);

  assert.match(shell, /throhi-foundation\.module\.css/);
  assert.match(shell, /data-design-contract="throhi-foundation-v1"/);
});

test("public company and navigation expose Surgical and Dental only", async () => {
  const [home, company, companyContent, header, footer] = await Promise.all([
    read("src/app/rebuild/page.tsx"),
    read("src/app/rebuild/company/page.tsx"),
    read("src/rebuild/company-content.ts"),
    read("src/components/rebuild/rebuild-header.tsx"),
    read("src/components/rebuild/rebuild-footer.tsx"),
  ]);

  for (const source of [home, company, companyContent, header, footer]) {
    assert.doesNotMatch(source, /Four divisions/i);
    assert.doesNotMatch(source, /Veterinary|Beauty/);
  }

  assert.match(home, /surgical/);
  assert.match(home, /dental/);
  assert.match(company, /Surgical/);
  assert.match(company, /Dental/);
});

test("full scissors evolution belongs on Company and not Home", async () => {
  const [home, company] = await Promise.all([
    read("src/app/rebuild/page.tsx"),
    read("src/app/rebuild/company/page.tsx"),
  ]);

  assert.doesNotMatch(home, /HomeEvolutionPreview|FrameEvolutionScene/);
  assert.match(company, /FrameEvolutionScene/);
  assert.match(company, /does not imply|does not claim|general instrument/i);
});

test("public inquiry contains product snapshots but no attachment contract", async () => {
  const [provider, client, backendDocs] = await Promise.all([
    read("src/components/inquiry-provider.tsx"),
    read("src/app/rebuild/inquiry/inquiry-client.tsx"),
    read("docs/backend/INQUIRY_BACKEND.md"),
  ]);

  assert.match(provider, /productCode/);
  assert.match(provider, /quantity/);
  assert.match(provider, /note/);

  assert.doesNotMatch(provider, /attachment|setAttachment/i);
  assert.doesNotMatch(client, /attachment|FileReader|accept=/i);
  assert.doesNotMatch(backendDocs, /R2 stores optional reference attachments|file upload/i);
});

test("approved public language uses Inquiry rather than ecommerce terminology", async () => {
  const sources = await Promise.all([
    read("src/app/rebuild/page.tsx"),
    read("src/app/rebuild/products/catalogue-client.tsx"),
    read("src/app/rebuild/inquiry/inquiry-client.tsx"),
    read("src/components/rebuild/rebuild-header.tsx"),
  ]);
  const combined = sources.join("\n");

  assert.match(combined, /Add to Inquiry|Inquiry List|Request quotation|Submit inquiry/i);
  assert.doesNotMatch(combined, /\bcart\b|\bbasket\b|\bcheckout\b|\bpayment\b|place order/i);
});

test("catalogue document source allows only authentic Surgical and Dental PDFs", async () => {
  const documents = await read("src/rebuild/catalogue-documents.ts");

  assert.match(documents, /"surgical"\s*\|\s*"dental"/);
  assert.doesNotMatch(documents, /"veterinary"|"beauty"|"general"/);
  assert.doesNotMatch(documents, /merge|generate|rewrite/i);
});
