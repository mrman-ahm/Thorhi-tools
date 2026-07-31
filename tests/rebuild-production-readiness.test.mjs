import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("crawler and metadata boundaries fail closed", async () => {
  const [robots, rootLayout, rebuildLayout] = await Promise.all([
    read("src/app/robots.ts"),
    read("src/app/layout.tsx"),
    read("src/app/rebuild/layout.tsx"),
  ]);

  assert.match(robots, /MetadataRoute\.Robots/);
  assert.match(robots, /NEXT_PUBLIC_ALLOW_INDEXING/);
  assert.match(robots, /disallow:\s*"\/"/);
  assert.match(robots, /"\/rebuild\/"/);
  assert.match(robots, /"\/api\/"/);

  assert.match(rootLayout, /applicationName:\s*"THROHI Medical Tools"/);
  assert.match(rootLayout, /formatDetection/);
  assert.match(rootLayout, /telephone:\s*false/);
  assert.match(rootLayout, /email:\s*false/);
  assert.match(rootLayout, /address:\s*false/);
  assert.match(rootLayout, /NEXT_PUBLIC_ALLOW_INDEXING/);
  assert.match(rootLayout, /export const viewport:\s*Viewport/);
  assert.match(rootLayout, /themeColor/);
  assert.match(rootLayout, /colorScheme:\s*"light"/);

  assert.match(rebuildLayout, /export const metadata:\s*Metadata/);
  assert.match(rebuildLayout, /index:\s*false/);
  assert.match(rebuildLayout, /follow:\s*false/);
});

test("response headers protect rebuild and api boundaries", async () => {
  const config = await read("next.config.ts");

  for (const header of [
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "X-Frame-Options",
    "X-Permitted-Cross-Domain-Policies",
    "X-DNS-Prefetch-Control",
  ]) {
    assert.match(config, new RegExp(header));
  }

  assert.match(config, /source:\s*"\/rebuild\/:path\*"/);
  assert.match(config, /source:\s*"\/api\/:path\*"/);
  assert.match(config, /X-Robots-Tag/);
  assert.match(config, /noindex, nofollow, noarchive/);
  assert.match(config, /Cache-Control/);
  assert.match(config, /no-store, max-age=0/);
});

test("rebuild supports increased contrast and forced colors", async () => {
  const styles = await read("src/app/rebuild/surgical-precision-shell.module.css");

  assert.match(styles, /@media \(prefers-contrast: more\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.match(styles, /CanvasText/);
  assert.match(styles, /Highlight/);
});

test("post-build readiness budgets are deterministic", async () => {
  const [script, pkg, gate] = await Promise.all([
    read("scripts/check-production-readiness.mjs"),
    read("package.json"),
    read("scripts/verify-design-milestone-6.sh"),
  ]);

  assert.match(script, /25 \* 1024 \* 1024/);
  assert.match(script, /768 \* 1024/);
  assert.match(script, /512 \* 1024/);
  assert.match(script, /20_000/);
  assert.match(script, /\.next\/static/);
  assert.match(script, /public/);

  assert.match(pkg, /"readiness:check":\s*"node scripts\/check-production-readiness\.mjs"/);
  assert.match(gate, /npm run readiness:check/);
});
