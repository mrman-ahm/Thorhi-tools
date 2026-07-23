import { expect, type Page } from "@playwright/test";

export async function clearCinematicCover(page: Page) {
  const entry = page.locator(".cinematic-entry");
  if (await entry.count() === 0) return;

  await page.evaluate(() => {
    const section = document.querySelector<HTMLElement>(".cinematic-entry");
    if (!section) return;
    const target = section.offsetTop + section.offsetHeight - window.innerHeight + 2;
    window.scrollTo(0, target);
  });

  await expect(entry).toHaveAttribute("data-exit-state", "cleared");
  await expect.poll(() => page.evaluate(() => document.body.dataset.cinematicActive ?? "cleared")).toBe("cleared");
}
