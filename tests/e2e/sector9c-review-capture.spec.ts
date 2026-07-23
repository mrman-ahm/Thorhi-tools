import { expect, test } from "@playwright/test";

async function smoothScrollTo(page: import("@playwright/test").Page, top: number, duration = 1100) {
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

async function sectionTop(page: import("@playwright/test").Page, selector: string) {
  return page.locator(selector).evaluate(element => Math.max(0, element.getBoundingClientRect().top + window.scrollY - 92));
}

test("capture Sector 9C bespoke motion review", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "One desktop review recording is sufficient");

  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: testInfo.outputPath("motion-video"), size: { width: 1280, height: 720 } }
  });
  const page = await context.newPage();
  const video = page.video();

  await page.goto("/");
  await expect(page.locator(".hero-experience")).toHaveAttribute("data-special-motion", "ready");
  await page.waitForTimeout(1800);
  await testInfo.attach("sector9c-hero-calibrated.png", { body: await page.screenshot(), contentType: "image/png" });

  await smoothScrollTo(page, 620, 1500);
  await page.waitForTimeout(650);
  await testInfo.attach("sector9c-hero-open.png", { body: await page.screenshot(), contentType: "image/png" });

  const macroTop = await sectionTop(page, ".macro-inspection-scene");
  await smoothScrollTo(page, macroTop, 1500);
  await page.waitForTimeout(650);
  await page.getByRole("button", { name: /Working end/i }).click();
  await page.waitForTimeout(720);
  await page.getByRole("button", { name: /Handle/i }).click();
  await page.waitForTimeout(720);
  await testInfo.attach("sector9c-macro-calibration.png", { body: await page.screenshot(), contentType: "image/png" });

  const evolutionTop = await sectionTop(page, ".evolution-experience");
  await smoothScrollTo(page, evolutionTop + 680, 1500);
  await page.waitForTimeout(650);
  await page.locator(".evolution-chapter").nth(1).focus();
  await page.waitForTimeout(720);
  await page.locator(".evolution-chapter").nth(3).focus();
  await page.waitForTimeout(800);
  await testInfo.attach("sector9c-evolution-precision.png", { body: await page.screenshot(), contentType: "image/png" });

  await page.goto("/products/surgical/scissors/operating-scissors");
  await expect(page.locator(".product-examination-motion")).toHaveAttribute("data-special-motion", "ready");
  await page.waitForTimeout(1700);
  await testInfo.attach("sector9c-product-examination.png", { body: await page.screenshot(), contentType: "image/png" });

  await context.close();
  const videoPath = await video?.path();
  if (videoPath) await testInfo.attach("sector9c-bespoke-motion.webm", { path: videoPath, contentType: "video/webm" });
});
