import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const expectedMotionZones = [
  "hero",
  "divisions",
  "functions",
  "families",
  "macro-inspection",
  "scissors-evolution",
  "catalogue-command",
  "catalogue-objects",
  "inquiry-intro",
  "evidence",
  "closing"
];

const auditRoutes = [
  ["home", "/"],
  ["products", "/products"],
  ["division", "/products/surgical"],
  ["family", "/products/surgical/scissors"],
  ["product", "/products/surgical/scissors/operating-scissors"],
  ["search", "/search?q=THR-SC-001"],
  ["inquiry", "/inquiry"],
  ["company", "/company"],
  ["resources", "/resources"],
  ["contact", "/contact"],
  ["privacy", "/privacy"],
  ["terms", "/terms"]
] as const;

function durationInMilliseconds(value: string) {
  return value.split(",").reduce((maximum, entry) => {
    const duration = entry.trim();
    const milliseconds = duration.endsWith("ms") ? Number.parseFloat(duration) : Number.parseFloat(duration) * 1000;
    return Math.max(maximum, Number.isFinite(milliseconds) ? milliseconds : 0);
  }, 0);
}

test("homepage exposes explicit Anime.js zones and protected interaction boundaries", async ({ page }) => {
  await page.goto("/");

  const zones = await page.locator("[data-motion-zone]").evaluateAll(elements => elements.map(element => ({
    zone: element.getAttribute("data-motion-zone"),
    policy: element.getAttribute("data-motion-policy")
  })));

  expect(zones.map(item => item.zone)).toEqual(expectedMotionZones);
  expect(new Set(zones.map(item => item.zone)).size).toBe(expectedMotionZones.length);
  expect(zones.every(item => item.policy === "anime")).toBe(true);

  const protectedElements = page.locator("[data-motion-static]");
  expect(await protectedElements.count()).toBeGreaterThanOrEqual(8);
  await expect(page.locator("form[data-motion-static]").first()).toBeVisible();
  await expect(page.locator('[data-motion-static="live-region"]')).toBeVisible();
});

test("pre-motion foundation avoids smooth scrolling, broad clipping, and permanent will-change", async ({ page }) => {
  await page.goto("/");

  const foundation = await page.evaluate(() => ({
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    bodyBackground: getComputedStyle(document.body).backgroundImage,
    mainOverflow: getComputedStyle(document.querySelector("main")!).overflowX,
    sectionOverflow: getComputedStyle(document.querySelector(".macro-stage")!).overflowX,
    willChange: [".family-track", ".hero-type", ".hero-object", ".division-discovery-item", ".evolution-layer"].map(selector => ({
      selector,
      value: getComputedStyle(document.querySelector(selector)!).willChange
    }))
  }));

  expect(foundation.scrollBehavior).toBe("auto");
  expect(foundation.bodyBackground).not.toContain("repeating-linear-gradient");
  expect(foundation.mainOverflow).toBe("visible");
  expect(foundation.sectionOverflow).toBe("visible");
  expect(foundation.willChange.every(item => item.value === "auto")).toBe(true);
});

test("display hierarchy is bold but remains within the calibrated scale", async ({ page }, testInfo) => {
  await page.goto("/");

  const metrics = await page.evaluate(() => {
    const size = (selector: string) => Number.parseFloat(getComputedStyle(document.querySelector(selector)!).fontSize);
    return {
      hero: size(".hero-type"),
      division: size(".division-discovery-item strong"),
      functionWord: size(".function-lines a strong"),
      contact: size(".contact-stage h2"),
      inactiveOpacity: Number.parseFloat(getComputedStyle(document.querySelector('.division-discovery-item:not([aria-current="true"])')!).opacity),
      controlRadius: Number.parseFloat(getComputedStyle(document.querySelector(".hero-search button")!).borderTopLeftRadius)
    };
  });

  if (testInfo.project.name === "mobile-chromium") {
    expect(metrics.hero).toBeLessThanOrEqual(82);
    expect(metrics.contact).toBeLessThanOrEqual(80);
  } else {
    expect(metrics.hero).toBeLessThanOrEqual(140);
    expect(metrics.contact).toBeLessThanOrEqual(112);
  }

  expect(metrics.hero).toBeGreaterThan(48);
  expect(metrics.inactiveOpacity).toBeGreaterThanOrEqual(.6);
  expect(metrics.controlRadius).toBeGreaterThanOrEqual(6);
  expect(metrics.controlRadius).toBeLessThanOrEqual(12);
});

for (const [name, route] of auditRoutes) {
  test(`${name} is visually ready for motion without overflow or serious accessibility faults`, async ({ page }, testInfo) => {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
    expect(serious, `${route}\n${JSON.stringify(serious, null, 2)}`).toEqual([]);

    const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
    await testInfo.attach(`sector85-${name}-${testInfo.project.name}.png`, { body: screenshot, contentType: "image/png" });
  });
}

test("reduced motion leaves every motion zone visible and effectively static", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const states = await page.locator("[data-motion-zone], [data-motion-item]").evaluateAll(elements => elements.map(element => {
    const style = getComputedStyle(element);
    return {
      opacity: Number.parseFloat(style.opacity),
      transform: style.transform,
      transitionDuration: style.transitionDuration,
      animationDuration: style.animationDuration
    };
  }));

  expect(states.length).toBeGreaterThan(25);
  for (const state of states) {
    expect(state.opacity).toBe(1);
    expect(state.transform).toBe("none");
    expect(durationInMilliseconds(state.transitionDuration)).toBeLessThanOrEqual(1);
    expect(durationInMilliseconds(state.animationDuration)).toBeLessThanOrEqual(1);
  }

  const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
  await testInfo.attach(`sector85-reduced-motion-${testInfo.project.name}.png`, { body: screenshot, contentType: "image/png" });
});
