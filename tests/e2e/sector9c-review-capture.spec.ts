import { expect, test } from "@playwright/test";

function syntheticSprite() {
  const width = 12 * 240;
  const height = 22 * 135;
  const cells = Array.from({ length: 260 }, (_, index) => {
    const column = index % 12;
    const row = Math.floor(index / 12);
    const hue = Math.round((index / 260) * 120 + 20);
    return `<rect x="${column * 240}" y="${row * 135}" width="240" height="135" fill="hsl(${hue} 25% 4%)"/><path d="M${column * 240 + 42} ${row * 135 + 94} L${column * 240 + 198} ${row * 135 + 38}" stroke="hsl(${hue} 40% 72%)" stroke-width="8"/><circle cx="${column * 240 + 68}" cy="${row * 135 + 86}" r="18" fill="none" stroke="hsl(${hue} 40% 72%)" stroke-width="6"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${cells}</svg>`;
}

async function smoothScrollTo(page: import("@playwright/test").Page, top: number, duration = 900) {
  await page.evaluate(({ destination, milliseconds }) => new Promise<void>(resolve => {
    const start = window.scrollY;
    const distance = destination - start;
    const began = performance.now();
    const ease = (value: number) => 1 - Math.pow(1 - value, 4);
    const step = (now: number) => {
      const progress = Math.min(1, (now - began) / milliseconds);
      window.scrollTo(0, start + distance * ease(progress));
      if (progress < 1) window.requestAnimationFrame(step);
      else resolve();
    };
    window.requestAnimationFrame(step);
  }), { destination: top, milliseconds: duration });
}

async function sequencePosition(page: import("@playwright/test").Page, progress: number) {
  return page.locator(".frame-evolution-section").evaluate((element, value) => {
    const section = element as HTMLElement;
    return section.offsetTop + (section.offsetHeight - window.innerHeight) * Number(value);
  }, progress);
}

test("capture Sector 9D cinematic and synchronized sequence review", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "One desktop review recording is sufficient");

  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: testInfo.outputPath("motion-video"), size: { width: 1280, height: 720 } }
  });
  const page = await context.newPage();
  const video = page.video();
  await page.route("**/media/sector9d/manifest.json", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ available: true, intro: null, sprite: "/media/sector9d/evolution-sprite.webp", frameCount: 260 })
  }));
  await page.route("**/media/sector9d/evolution-sprite.webp", route => route.fulfill({ status: 200, contentType: "image/svg+xml", body: syntheticSprite() }));

  await page.goto("/");
  await page.waitForTimeout(1200);
  await testInfo.attach("sector9d-cinematic-entry.png", { body: await page.screenshot(), contentType: "image/png" });

  await page.locator("#home-hero").scrollIntoViewIfNeeded();
  await expect(page.locator(".hero-brand-stage")).toBeVisible();
  await page.waitForTimeout(700);
  await testInfo.attach("sector9d-brand-handoff.png", { body: await page.screenshot(), contentType: "image/png" });

  for (const [name, progress] of [["origin", .12], ["mechanism", .32], ["specialization", .60], ["precision", .84]] as const) {
    await smoothScrollTo(page, await sequencePosition(page, progress));
    await page.waitForTimeout(650);
    await testInfo.attach(`sector9d-evolution-${name}.png`, { body: await page.screenshot(), contentType: "image/png" });
  }

  await page.goto("/products/surgical/scissors/operating-scissors");
  await expect(page.locator(".product-examination-motion")).toHaveAttribute("data-special-motion", "ready");
  await page.waitForTimeout(1200);
  await testInfo.attach("sector9d-product-examination.png", { body: await page.screenshot(), contentType: "image/png" });

  await context.close();
  const videoPath = await video?.path();
  if (videoPath) await testInfo.attach("sector9d-scroll-cinema.webm", { path: videoPath, contentType: "video/webm" });
});
