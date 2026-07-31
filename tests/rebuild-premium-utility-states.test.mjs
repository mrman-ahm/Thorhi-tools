import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("rebuild utility routes use one premium shared system", async () => {
  const [privacy, terms, missing, error, loading, styles] = await Promise.all([
    read("src/app/rebuild/privacy/page.tsx"),
    read("src/app/rebuild/terms/page.tsx"),
    read("src/app/rebuild/not-found.tsx"),
    read("src/app/rebuild/error.tsx"),
    read("src/app/rebuild/loading.tsx"),
    read("src/app/rebuild/utility-state.module.css"),
  ]);

  for (const source of [privacy, terms, missing, error, loading]) {
    assert.match(source, /utility-state\.module\.css/);
    assert.match(source, /data-utility-state=/);
  }

  assert.match(styles, /var\(--font-regal\)/);
  assert.match(styles, /font-size:\s*clamp\(1rem/);
  assert.match(styles, /@media \(max-width: 760px\)/);
  assert.match(styles, /prefers-reduced-motion/);
});

test("legal content remains inside the verified truth boundary", async () => {
  const content = await read("src/rebuild/legal-content.ts");

  assert.match(content, /privacySections/);
  assert.match(content, /termsSections/);
  assert.match(content, /legal review/i);
  assert.doesNotMatch(content, /effective date:\s*\d/i);
  assert.doesNotMatch(content, /privacy officer/i);
  assert.doesNotMatch(content, /governed by the laws/i);
  assert.doesNotMatch(content, /retain(?:ed)? for \d/i);
});

test("missing, error, and loading states provide useful recovery", async () => {
  const [missing, error, loading] = await Promise.all([
    read("src/app/rebuild/not-found.tsx"),
    read("src/app/rebuild/error.tsx"),
    read("src/app/rebuild/loading.tsx"),
  ]);

  assert.match(missing, /\/rebuild\/products/);
  assert.match(missing, /\/rebuild\/inquiry\?manual=1/);
  assert.match(error, /"use client"/);
  assert.match(error, /reset\(\)/);
  assert.match(loading, /role="status"/);
  assert.match(loading, /aria-live="polite"/);
  assert.doesNotMatch(loading, /spinner/i);
  assert.doesNotMatch(loading, /\d+%/);
});
