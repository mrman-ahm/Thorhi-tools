import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

type RotationStyle = { rotate: string; transform: string };

function rotationFromMatrix(transform: string) {
  if (!transform || transform === "none") return 0;
  const matrix3d = transform.match(/matrix3d\(([^)]+)\)/);
  if (matrix3d) {
    const values = matrix3d[1].split(",").map(Number);
    return Math.atan2(values[1], values[0]) * 180 / Math.PI;
  }
  const matrix = transform.match(/matrix\(([^)]+)\)/);
  if (!matrix) return 0;
  const values = matrix[1].split(",").map(Number);
  return Math.atan2(values[1], values[0]) * 180 / Math.PI;
}

function rotationFromStyle(style: RotationStyle) {
  if (style.rotate && style.rotate !== "none") {
    const value = Number.parseFloat(style.rotate);
    if (Number.isFinite(value)) return value;
  }
  return rotationFromMatrix(style.transform);
}

async function waitForSpecialMotion(page: import("@playwright/test").Page, selector: string) {
  const target = page.locator(selector);
  await expect(target).toHaveAttribute("data-special-motion", /ready|reduced|mobile-static/);
  return target;
}

test("hero opens blades around a fixed pivot within the approved angle", async ({ page }) => {
  await page.goto("/");
  await waitForSpecialMotion(page, ".hero-experience");
  await page.waitForTimeout(1500);

  const before = await page.evaluate(() => {
    const pivot = document.querySelector<SVGGElement>(".hero-experience .instrument-pivot");
    const upper = document.querySelector<SVGGElement>(".hero-experience .instrument-half-upper");
    const lower = document.querySelector<SVGGElement>(".hero-experience .instrument-half-lower");
    if (!pivot || !upper || !lower) throw new Error("Hero mechanism is incomplete");
    const motion = (element: Element) => {
      const style = getComputedStyle(element);
      return { rotate: style.rotate, transform: style.transform };
    };
    return { pivot: motion(pivot), upper: motion(upper), lower: motion(lower) };
  });

  await page.evaluate(() => window.scrollTo({ top: Math.min(720, document.documentElement.scrollHeight / 5), behavior: "instant" }));
  await page.waitForTimeout(900);

  const after = await page.evaluate(() => {
    const pivot = document.querySelector<SVGGElement>(".hero-experience .instrument-pivot");
    const upper = document.querySelector<SVGGElement>(".hero-experience .instrument-half-upper");
    const lower = document.querySelector<SVGGElement>(".hero-experience .instrument-half-lower");
    if (!pivot || !upper || !lower) throw new Error("Hero mechanism is incomplete");
    const motion = (element: Element) => {
      const style = getComputedStyle(element);
      return { rotate: style.rotate, transform: style.transform };
    };
    return { pivot: motion(pivot), upper: motion(upper), lower: motion(lower) };
  });

  const upperAngle = rotationFromStyle(after.upper);
  const lowerAngle = rotationFromStyle(after.lower);
  expect(Math.abs(upperAngle)).toBeGreaterThan(0.1);
  expect(Math.abs(lowerAngle)).toBeGreaterThan(0.1);
  expect(Math.abs(upperAngle)).toBeLessThanOrEqual(4.8);
  expect(Math.abs(lowerAngle)).toBeLessThanOrEqual(4.8);
  expect(Math.sign(upperAngle)).not.toBe(Math.sign(lowerAngle));
  expect(rotationFromStyle(after.pivot)).toBeCloseTo(rotationFromStyle(before.pivot), 1);
});

test("hero measurements draw and engraving finishes readable", async ({ page }) => {
  await page.goto("/");
  await waitForSpecialMotion(page, ".hero-experience");
  await page.waitForTimeout(1700);

  await expect(page.locator(".hero-experience .connector-label-edge")).toContainText("EDGE");
  await expect(page.locator(".hero-experience .connector-label-pivot")).toContainText("PIVOT");
  await expect(page.locator(".hero-experience .connector-label-grip")).toContainText("GRIP");
  await expect(page.locator(".hero-experience .visual-code")).toContainText("THR / OBJECT STUDY / 001");

  const clip = await page.locator(".hero-experience .visual-code > span").evaluate(element => getComputedStyle(element).clipPath);
  expect(clip).not.toContain("100%");
  const content = await page.locator(".hero-experience .instrument-connectors").textContent();
  expect(content).not.toMatch(/\b(mm|cm|inch|inches)\b/i);
});

test("macro controls draw the matching connector before settling the readout", async ({ page }) => {
  await page.goto("/");
  const section = page.locator(".macro-inspection-scene");
  await section.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Working end/i }).click();
  await expect(section).toHaveAttribute("data-active-region", "0");
  await expect(section.locator('.macro-connector-path[data-region="0"]')).toHaveAttribute("data-active", "true");
  await expect(section.getByRole("heading", { level: 3, name: "Working end" })).toBeVisible();
  await page.getByRole("button", { name: /Handle/i }).focus();
  await expect(section).toHaveAttribute("data-active-region", "2");
  await expect(section.locator('.macro-connector-path[data-region="2"]')).toHaveAttribute("data-active", "true");
});

test("evolution transforms one persistent mechanism and keeps its pivot centered", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile-chromium", "Desktop stage is intentionally replaced by stacked mobile chapters");
  await page.goto("/");
  const section = page.locator(".evolution-experience");
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator(".evolution-visual-stage .evolution-layer")).toHaveCount(1);

  const relativePivot = async () => page.evaluate(() => {
    const stage = document.querySelector<HTMLElement>(".evolution-visual-stage");
    const pivot = document.querySelector<HTMLElement>(".evolution-visual-stage .scene-pivot");
    if (!stage || !pivot) throw new Error("Evolution mechanism is incomplete");
    const stageBox = stage.getBoundingClientRect();
    const pivotBox = pivot.getBoundingClientRect();
    return {
      x: pivotBox.x + pivotBox.width / 2 - stageBox.x,
      y: pivotBox.y + pivotBox.height / 2 - stageBox.y
    };
  });

  const before = await relativePivot();
  await section.locator(".evolution-chapter").nth(2).focus();
  await expect(section).toHaveAttribute("data-active-chapter", "2");
  await page.waitForTimeout(850);
  const after = await relativePivot();
  expect(Math.abs(before.x - after.x)).toBeLessThanOrEqual(2);
  expect(Math.abs(before.y - after.y)).toBeLessThanOrEqual(2);
});

test("product examination completes without delaying inquiry controls", async ({ page }) => {
  await page.goto("/products/surgical/scissors/operating-scissors");
  const motion = await waitForSpecialMotion(page, ".product-examination-motion");
  await expect(motion.locator(".product-stage-engraving")).toContainText("THR-SC-001");
  const submit = page.locator(".catalogue-detail-submit");
  await expect(submit).toBeVisible();
  await expect(submit).toBeEnabled();
  await expect(submit).toHaveAttribute("aria-label", /Add to inquiry: Operating Scissors/i);
  await submit.click();
  await expect(submit).toHaveAttribute("aria-label", /Update inquiry details for: Operating Scissors/i);
});

test("mobile blade opening remains smaller than desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile intensity contract runs in the mobile project");
  await page.goto("/");
  await waitForSpecialMotion(page, ".hero-experience");
  await page.evaluate(() => window.scrollTo({ top: 540, behavior: "instant" }));
  await page.waitForTimeout(850);
  const styles = await page.evaluate(() => {
    const upper = document.querySelector<SVGGElement>(".hero-experience .instrument-half-upper");
    const lower = document.querySelector<SVGGElement>(".hero-experience .instrument-half-lower");
    return [upper, lower].map(element => {
      if (!element) return { rotate: "none", transform: "none" };
      const style = getComputedStyle(element);
      return { rotate: style.rotate, transform: style.transform };
    });
  });
  styles.forEach(style => {
    expect(Math.abs(rotationFromStyle(style))).toBeGreaterThan(0.1);
    expect(Math.abs(rotationFromStyle(style))).toBeLessThanOrEqual(2.9);
  });
});

test("reduced motion keeps the hero mechanism closed and fully readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero-experience")).toHaveAttribute("data-special-motion", "reduced");
  const styles = await page.evaluate(() => {
    const upper = document.querySelector<SVGGElement>(".hero-experience .instrument-half-upper");
    const lower = document.querySelector<SVGGElement>(".hero-experience .instrument-half-lower");
    return [upper, lower].map(element => {
      if (!element) return { rotate: "none", transform: "none" };
      const style = getComputedStyle(element);
      return { rotate: style.rotate, transform: style.transform };
    });
  });
  styles.forEach(style => expect(rotationFromStyle(style)).toBe(0));
  await expect(page.locator(".hero-experience .visual-code")).toContainText("THR / OBJECT STUDY / 001");
});

test("special effects remain accessible and do not create overflow", async ({ page }, testInfo) => {
  for (const route of ["/", "/products/surgical/scissors/operating-scissors"]) {
    await page.goto(route);
    await page.waitForTimeout(1100);
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(dimensions.scrollWidth, `${route} on ${testInfo.project.name}`).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
    expect(serious, `${route}\n${JSON.stringify(serious, null, 2)}`).toEqual([]);
  }
});
