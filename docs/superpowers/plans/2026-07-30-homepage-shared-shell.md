# THROHI Homepage and Shared Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production-quality `Surgical Precision Archive` milestone: the THROHI rebuild homepage, global header, footer, cinematic opening, company-led hero, early catalogue search, four-division index, selected product families, verified company introduction, scissors-evolution preview, practical utilities, contact entry, and complete responsive/accessibility behavior.

**Architecture:** Preserve the existing Next.js 15 rebuild, runtime catalogue, Inquiry Provider, search URLs, product routes, media preparation pipeline, and accessible overlay logic. Split the current large homepage into focused server-compatible sections, keep interactive state inside existing client components, expose shared design tokens through the rebuild shell, and adapt the two existing media components through backward-compatible props rather than copying or replacing them.

**Tech Stack:** Next.js 15.4.4, React 19.1.0, TypeScript 5.8, CSS Modules, Anime.js 4.5.0, Next Image, Playwright 1.61.1, `@axe-core/playwright` 4.12.1, Node test runner, existing catalogue and inquiry modules.

## Global Constraints

- Work only on `design/surgical-precision-archive`, based on `rebuild/surgical-contrast`.
- Keep `/rebuild` non-indexed and leave the current public implementation available.
- Preserve the supplied cinematic MP4, 260-frame scissors sequence, catalogue data, high-resolution product media, search, Inquiry List, accessibility, and testing foundations.
- Use only public-safe facts: THROHI Medical Tools, Sialkot, Pakistan, and the four supplied instrument divisions.
- Do not publish unverified certifications, materials, steel grades, manufacturing claims, company history, export markets, capacity, OEM services, minimum order quantities, or lead times.
- Do not invent Veterinary or Beauty product records.
- Do not add new UI, animation, icon, or 3D dependencies.
- Use Instrument Sans for display, Archivo for interface/body, and IBM Plex Mono for product codes and compact technical data.
- Use surgical green for primary actions, steel blue as restrained support, and red only for error/warning states.
- Do not add generic feature grids, fake metrics, testimonials, customer logos, pricing, FAQ, newsletter, decorative dashboard elements, random glass panels, neon, particles, or repeated calls to action.
- Maintain WCAG 2.2 AA intent, keyboard operation, visible focus, reduced-motion parity, responsive touch targets, and useful failure states.
- Motion may not delay catalogue search, product browsing, Inquiry List access, or contact.
- Batch GitHub work into meaningful commits; this branch should not open a pull request until local verification is intentionally complete.

---

## File Structure Map

### Existing files to modify

- `src/app/rebuild/page.tsx` — reduce to homepage orchestration and catalogue data selection.
- `src/app/rebuild/home.module.css` — replace the current monolithic visual treatment or remove after styles move into focused modules.
- `src/app/rebuild/rebuild-shell.tsx` — preserve structure and expose shell-level state/classes only when required.
- `src/app/rebuild/rebuild.module.css` — rebuild-wide color, typography, focus, surface, and layout tokens.
- `src/components/rebuild/rebuild-header.tsx` — preserve accessible behavior while refining labels, layout, active state, cinematic state, and utilities.
- `src/components/rebuild/rebuild-header.module.css` — implement desktop/mobile header system.
- `src/components/rebuild/rebuild-footer.tsx` — remove internal-facing filler and render only truthful routes/status.
- `src/components/rebuild/rebuild-footer.module.css` — implement compact corporate footer.
- `src/rebuild/navigation.ts` — keep only real routes and typed division states.
- `src/components/cinematic-entry.tsx` — add backward-compatible content/semantic props and preserve current default behavior.
- Existing cinematic global styles used by `CinematicEntry` — add rebuild variant selectors without breaking the public root.
- `src/components/frame-evolution-scene.tsx` — add backward-compatible `preview` configuration while preserving the existing full default.
- Existing evolution global styles — add preview selectors and reduced-motion behavior.
- `PROJECT_STATE.md` — record approved visual subdirection and milestone state after implementation passes review.
- `PLANS.md` — mark milestone status and next dependency.
- `CHANGELOG.md` — record the verified milestone.

### New files to create

- `src/rebuild/home-content.ts` — typed public-safe homepage copy and division presentation configuration.
- `src/components/rebuild/home/home-hero.tsx` — company-led hero and actions.
- `src/components/rebuild/home/home-hero.module.css` — hero composition and responsive image treatment.
- `src/components/rebuild/home/home-catalogue-search.tsx` — early GET search form.
- `src/components/rebuild/home/home-division-index.tsx` — four-division presentation with structured/pending states.
- `src/components/rebuild/home/home-selected-families.tsx` — curated real catalogue families.
- `src/components/rebuild/home/home-company-intro.tsx` — verified company copy.
- `src/components/rebuild/home/home-evolution-preview.tsx` — semantic wrapper around `FrameEvolutionScene` preview mode.
- `src/components/rebuild/home/home-utilities-contact.tsx` — digital catalogue, Inquiry List, unlisted-item, and verified contact entry.
- `src/components/rebuild/home/home-sections.module.css` — shared below-hero editorial sections.
- `src/rebuild/contact.ts` — typed optional verified contact configuration; empty values do not render.
- `tests/e2e/rebuild-home-design.spec.ts` — desktop/mobile homepage, shell, search, cinematic, and accessibility tests.

### Interfaces locked by this plan

```ts
// src/rebuild/home-content.ts
export type HomeDivisionPresentation = {
  slug: "surgical" | "dental" | "veterinary" | "beauty";
  label: string;
  summary: string;
  state: "structured" | "pending";
  href?: string;
};

export const homeCompanyCopy: {
  heading: string;
  body: readonly string[];
};

export const homeDivisionPresentation: readonly HomeDivisionPresentation[];
```

```ts
// src/rebuild/contact.ts
export type VerifiedContactConfig = {
  email?: string;
  phoneDisplay?: string;
  phoneHref?: string;
  whatsappHref?: string;
  location: "Sialkot, Pakistan";
};

export const verifiedContact: VerifiedContactConfig;
```

```ts
// src/components/rebuild/home/home-hero.tsx
export type HomeHeroProps = {
  scissors: RuntimeProduct;
  productCount: number;
  variantCount: number;
};
```

```ts
// src/components/rebuild/home/home-selected-families.tsx
export type HomeSelectedFamiliesProps = {
  products: readonly RuntimeProduct[];
};
```

```ts
// src/components/cinematic-entry.tsx
export type CinematicEntryProps = {
  variant?: "default" | "rebuild";
  indexLeft?: string;
  indexRight?: string;
  eyebrow?: string;
  title?: ReactNode;
  titleElement?: "h1" | "p";
};
```

```ts
// src/components/frame-evolution-scene.tsx
export type FrameEvolutionSceneProps = {
  variant?: "full" | "preview";
  eyebrow?: string;
  title?: ReactNode;
  accessibleLabel?: string;
};
```

---

### Task 1: Establish failing end-to-end acceptance tests

**Files:**
- Create: `tests/e2e/rebuild-home-design.spec.ts`
- Read: `playwright.config.ts`
- Read: `src/app/rebuild/page.tsx`

**Interfaces:**
- Consumes: existing `/rebuild`, `/rebuild/products`, `/rebuild/inquiry`, cinematic Skip control, mobile navigation, and search URL behavior.
- Produces: executable acceptance criteria for every later task.

- [ ] **Step 1: Create the homepage test scaffold**

Use this initial structure:

```ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function enterRebuild(page: Parameters<typeof test>[0]["page"]) {
  await page.goto("/rebuild");
  const enter = page.getByRole("button", {
    name: /enter the THROHI website|slide the opening cover away/i,
  });
  if (await enter.isVisible().catch(() => false)) {
    await enter.click();
  }
  await page.getByRole("heading", { level: 1, name: /THROHI Medical Tools/i }).scrollIntoViewIfNeeded();
}

test("company identity and catalogue search lead the real homepage", async ({ page }) => {
  await enterRebuild(page);
  await expect(page.getByRole("heading", { level: 1, name: /THROHI Medical Tools/i })).toBeVisible();
  await expect(page.getByText(/Sialkot, Pakistan/i)).toBeVisible();
  await expect(page.getByRole("search", { name: /catalogue/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Browse instruments/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Build an inquiry/i })).toBeVisible();
});

test("homepage search submits the query to the catalogue", async ({ page }) => {
  await enterRebuild(page);
  const search = page.getByRole("search", { name: /catalogue/i });
  await search.getByRole("searchbox").fill("04-0101");
  await search.getByRole("button", { name: /Find product/i }).click();
  await expect(page).toHaveURL(/\/rebuild\/products\?q=04-0101/);
});

test("all four truthful divisions are visible", async ({ page }) => {
  await enterRebuild(page);
  for (const division of [
    "Surgical Instruments",
    "Dental & Orthodontic Instruments",
    "Veterinary Instruments",
    "Beauty Instruments",
  ]) {
    await expect(page.getByText(division, { exact: true })).toBeVisible();
  }
  await expect(page.getByText(/Veterinary.*catalogue.*not yet published/i)).toBeVisible();
  await expect(page.getByText(/Beauty.*catalogue.*not yet published/i)).toBeVisible();
});

test("mobile navigation traps focus and exposes inquiry state", async ({ page }) => {
  test.skip(test.info().project.name !== "mobile-chromium");
  await page.goto("/rebuild");
  await page.getByRole("button", { name: "Menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("search")).toBeVisible();
  await expect(dialog.getByText(/Inquiry List/i)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
});

test("stable homepage and open navigation have no serious axe violations", async ({ page }) => {
  await enterRebuild(page);
  const homepage = await new AxeBuilder({ page })
    .exclude("video")
    .analyze();
  expect(homepage.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});
```

- [ ] **Step 2: Correct the helper type if Playwright rejects the inferred parameter**

Use the explicit import and signature:

```ts
import type { Page } from "@playwright/test";

async function enterRebuild(page: Page) {
  // body from Step 1
}
```

- [ ] **Step 3: Build the current branch and run the new test**

Run:

```bash
npm run build
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=desktop-chromium
```

Expected: at least the company-led H1, Sialkot copy, four-division truth state, and new CTA expectations fail against the current homepage.

- [ ] **Step 4: Commit the failing acceptance test**

```bash
git add tests/e2e/rebuild-home-design.spec.ts
git commit -m "test: define rebuild homepage experience"
```

---

### Task 2: Create typed public-safe homepage content and contact boundaries

**Files:**
- Create: `src/rebuild/home-content.ts`
- Create: `src/rebuild/contact.ts`
- Modify: `src/rebuild/navigation.ts`
- Test: `tests/e2e/rebuild-home-design.spec.ts`

**Interfaces:**
- Consumes: `rebuildDivisionNavigation` and verified project facts.
- Produces: `homeCompanyCopy`, `homeDivisionPresentation`, `homeHeroCopy`, `verifiedContact`.

- [ ] **Step 1: Add a failing source-truth test to the Playwright file**

```ts
test("homepage avoids unverified promotional claims", async ({ page }) => {
  await enterRebuild(page);
  const body = await page.locator("body").innerText();
  for (const unsupported of [
    "certified",
    "ISO",
    "world-class",
    "premium steel",
    "trusted worldwide",
    "years of experience",
  ]) {
    expect(body.toLowerCase()).not.toContain(unsupported.toLowerCase());
  }
});
```

- [ ] **Step 2: Create typed homepage copy**

Implement `src/rebuild/home-content.ts` with exact public-safe meaning:

```ts
import { rebuildDivisionNavigation } from "@/rebuild/navigation";

export type HomeDivisionPresentation = {
  slug: "surgical" | "dental" | "veterinary" | "beauty";
  label: string;
  summary: string;
  state: "structured" | "pending";
  href?: string;
};

export const homeHeroCopy = {
  title: "THROHI Medical Tools",
  description:
    "Surgical, dental, orthodontic, veterinary and beauty instrument ranges from Sialkot, Pakistan.",
} as const;

export const homeCompanyCopy = {
  heading: "Instrument ranges, catalogue identities and one clear inquiry path.",
  body: [
    "THROHI Medical Tools is based in Sialkot, Pakistan and presents Surgical, Dental and Orthodontic, Veterinary, and Beauty instrument ranges.",
    "Validated catalogue records can be searched by product name or code and collected into one structured Inquiry List.",
  ],
} as const;

export const homeDivisionPresentation: readonly HomeDivisionPresentation[] =
  rebuildDivisionNavigation.map((division) => ({
    slug: division.slug,
    label: division.label,
    state: division.catalogueState,
    href: division.href,
    summary:
      division.catalogueState === "structured"
        ? division.description
        : `${division.label.replace(" Instruments", "")} detailed catalogue records are not yet published. Contact THROHI with a product reference or requirement.`,
  }));
```

- [ ] **Step 3: Create optional verified contact configuration**

Implement `src/rebuild/contact.ts`:

```ts
export type VerifiedContactConfig = {
  email?: string;
  phoneDisplay?: string;
  phoneHref?: string;
  whatsappHref?: string;
  location: "Sialkot, Pakistan";
};

export const verifiedContact: VerifiedContactConfig = {
  location: "Sialkot, Pakistan",
};
```

The UI must render no empty email, phone, or WhatsApp control when a value is absent.

- [ ] **Step 4: Keep navigation truthful**

In `src/rebuild/navigation.ts`:
- retain Products, Company, and Contact routes that currently resolve;
- do not add Catalogues until its route exists;
- retain all four divisions;
- keep pending divisions without an `href`;
- update descriptions only where the current wording is internal-facing or unclear.

- [ ] **Step 5: Verify type safety and commit**

```bash
npm run typecheck
npm run lint
git add src/rebuild/home-content.ts src/rebuild/contact.ts src/rebuild/navigation.ts tests/e2e/rebuild-home-design.spec.ts
git commit -m "feat: define truthful rebuild homepage content"
```

---

### Task 3: Establish the Surgical Precision Archive shell tokens

**Files:**
- Modify: `src/app/rebuild/rebuild.module.css`
- Modify: `src/app/rebuild/rebuild-shell.tsx`
- Modify: `src/components/rebuild/rebuild-header.module.css`
- Modify: `src/components/rebuild/rebuild-footer.module.css`
- Test: `tests/e2e/rebuild-home-design.spec.ts`

**Interfaces:**
- Consumes: existing rebuild font variables and shell structure.
- Produces: shared CSS custom properties used by every homepage and later internal page component.

- [ ] **Step 1: Add a failing computed-style test**

```ts
test("rebuild shell exposes the approved corporate design tokens", async ({ page }) => {
  await page.goto("/rebuild");
  const tokens = await page.locator("[data-rebuild-shell]").evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      ink: style.getPropertyValue("--throhi-ink-950").trim(),
      paper: style.getPropertyValue("--throhi-paper-50").trim(),
      green: style.getPropertyValue("--throhi-green-600").trim(),
    };
  });
  expect(tokens.ink).not.toBe("");
  expect(tokens.paper).not.toBe("");
  expect(tokens.green).not.toBe("");
});
```

- [ ] **Step 2: Add shell identity without changing DOM responsibility**

Update `RebuildShell`:

```tsx
export function RebuildShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.root} data-rebuild-shell>
      <RebuildHeader />
      {children}
      <RebuildFooter />
    </div>
  );
}
```

- [ ] **Step 3: Define shared tokens in `rebuild.module.css`**

Use one rebuild-wide token set:

```css
.root {
  --throhi-ink-950: #04131f;
  --throhi-navy-900: #071f33;
  --throhi-navy-800: #0d2d46;
  --throhi-steel-100: #dce8ed;
  --throhi-steel-200: #c7d9e1;
  --throhi-paper-50: #f6f8f7;
  --throhi-white: #ffffff;
  --throhi-green-600: #2e8c63;
  --throhi-green-300: #8fd6b3;
  --throhi-blue-600: #2f6f91;
  --throhi-red-600: #a94348;
  --throhi-text: #0a2a3d;
  --throhi-muted: #526b77;
  --throhi-line: rgba(7, 31, 51, 0.17);
  --throhi-gutter: clamp(1rem, 4vw, 4rem);
  --throhi-container: 87.5rem;
  --throhi-reading: 45rem;
  --throhi-radius-sm: 0.25rem;
  --throhi-radius-md: 0.625rem;
  color: var(--throhi-text);
  background: var(--throhi-paper-50);
  font-family: var(--font-archivo), Arial, sans-serif;
}
```

Also provide:
- consistent `box-sizing`;
- shared `:focus-visible` outline using green or blue with sufficient contrast;
- body overflow behavior for the existing mobile dialog;
- no blanket transition on all elements.

- [ ] **Step 4: Replace duplicated header/footer colors with shell variables**

Update header and footer CSS to consume the new tokens. Do not redesign their layout yet; this step only establishes consistent color, border, radius, type, and focus roles.

- [ ] **Step 5: Verify and commit**

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=desktop-chromium --grep "design tokens"
git add src/app/rebuild/rebuild-shell.tsx src/app/rebuild/rebuild.module.css src/components/rebuild/rebuild-header.module.css src/components/rebuild/rebuild-footer.module.css tests/e2e/rebuild-home-design.spec.ts
git commit -m "feat: establish surgical precision archive tokens"
```

---

### Task 4: Redesign the shared header and footer without breaking behavior

**Files:**
- Modify: `src/components/rebuild/rebuild-header.tsx`
- Modify: `src/components/rebuild/rebuild-header.module.css`
- Modify: `src/components/rebuild/rebuild-footer.tsx`
- Modify: `src/components/rebuild/rebuild-footer.module.css`
- Modify: `src/rebuild/navigation.ts`
- Test: `tests/e2e/rebuild-home-design.spec.ts`

**Interfaces:**
- Consumes: `useInquiry()`, `rebuildPrimaryNavigation`, `rebuildDivisionNavigation`, search query routing, existing focus trap and body scroll lock.
- Produces: the global navigation used by all rebuild pages.

- [ ] **Step 1: Add failing desktop header tests**

```ts
test("desktop header exposes products, search and live inquiry utility", async ({ page }) => {
  await page.goto("/rebuild");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Products" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
  await expect(page.getByRole("link", { name: /0 instruments in Inquiry List/i })).toBeVisible();

  await page.getByRole("button", { name: "Products" }).click();
  const panel = page.getByRole("navigation", { name: "Product divisions" });
  await expect(panel).toBeVisible();
  await expect(panel.getByText("Surgical Instruments", { exact: true })).toBeVisible();
  await expect(panel.getByText("Beauty Instruments", { exact: true })).toBeVisible();
});
```

- [ ] **Step 2: Preserve all existing accessibility behavior**

Keep these exact behaviors from the current component:
- outside-pointer close for Products;
- Escape close and focus return;
- autofocus when Search opens;
- route-change close;
- mobile body scroll lock;
- Tab focus trap;
- focus restoration;
- `inert` on closed panels;
- live Inquiry List count.

Do not replace native buttons/links with clickable containers.

- [ ] **Step 3: Correct customer-facing labels**

Change the brand link label from `THROHI Medical Tools rebuild home` to `THROHI Medical Tools home`.

Keep preview-only status outside the brand label. Use exact action labels:
- `Search`;
- `Inquiry List`;
- `Browse all products`;
- `Search by name or code` where the utility is displayed.

- [ ] **Step 4: Implement desktop composition**

Header layout:
- left: properly cropped logo container;
- center: primary navigation;
- right: Search and Inquiry List count;
- cinematic-active state uses a transparent dark-compatible treatment;
- cleared/content state uses a stable light or navy surface with reliable contrast;
- Products panel uses open editorial columns, not rounded cards;
- pending divisions use text and state treatment, not disabled-looking fake links.

Use the existing `throhi:cinematic-state` event or `body[data-cinematic-active]` state. Do not add a second scroll listener if CSS can respond to the existing body dataset.

- [ ] **Step 5: Implement mobile composition**

- Menu and Inquiry List remain visible in the header.
- Full-height dialog uses clear section grouping.
- Search appears first.
- Structured divisions are links.
- Pending divisions are informative non-links.
- Primary company/contact routes follow.
- Inquiry summary is anchored near the panel footer without covering content at short viewport heights.

- [ ] **Step 6: Rewrite footer content truthfully**

Replace `Medical instrument catalogue and structured inquiry workspace.` with a concise company descriptor using only approved facts.

Replace the `Rebuild` navigation label with `Company` or `THROHI`.

Render:
- Products;
- Inquiry List;
- Company anchor;
- Contact anchor;
- Sialkot, Pakistan;
- preview status only while `/rebuild` is non-indexed.

Do not render empty contact channels or nonexistent routes.

- [ ] **Step 7: Run focused tests and commit**

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=desktop-chromium --grep "header|navigation"
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=mobile-chromium --grep "mobile navigation"
git add src/components/rebuild/rebuild-header.tsx src/components/rebuild/rebuild-header.module.css src/components/rebuild/rebuild-footer.tsx src/components/rebuild/rebuild-footer.module.css src/rebuild/navigation.ts tests/e2e/rebuild-home-design.spec.ts
git commit -m "feat: redesign rebuild navigation shell"
```

---

### Task 5: Adapt and integrate the cinematic opening

**Files:**
- Modify: `src/components/cinematic-entry.tsx`
- Modify: existing cinematic stylesheet containing `.cinematic-entry*`
- Modify: `src/app/rebuild/page.tsx`
- Test: `tests/e2e/rebuild-home-design.spec.ts`

**Interfaces:**
- Consumes: `/media/sector9d/manifest.json`, existing MP4, `throhi:cinematic-state`, reduced-motion media query.
- Produces: backward-compatible `CinematicEntryProps` and a rebuild-specific opening that leaves the real H1 to the hero.

- [ ] **Step 1: Add failing semantic and failure tests**

```ts
test("cinematic cover does not replace the real homepage h1", async ({ page }) => {
  await page.goto("/rebuild");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(/THROHI Medical Tools/i);
});

test("cinematic skip reveals usable content", async ({ page }) => {
  await page.goto("/rebuild");
  const enter = page.getByRole("button", { name: /enter the THROHI website/i });
  await enter.click();
  await expect(page.getByRole("heading", { level: 1, name: /THROHI Medical Tools/i })).toBeVisible();
});
```

- [ ] **Step 2: Add backward-compatible props**

Implement:

```tsx
import type { CSSProperties, ReactNode } from "react";

export type CinematicEntryProps = {
  variant?: "default" | "rebuild";
  indexLeft?: string;
  indexRight?: string;
  eyebrow?: string;
  title?: ReactNode;
  titleElement?: "h1" | "p";
};

export function CinematicEntry({
  variant = "default",
  indexLeft = "THROHI / OPENING STUDY",
  indexRight = "INSTRUMENTS IN TRANSITION",
  eyebrow = "PRECISION THROUGH FORM",
  title = <>Built around<br />the instrument.</>,
  titleElement = "h1",
}: CinematicEntryProps) {
  const Title = titleElement;
  // preserve the existing state/effects and render the supplied values
}
```

Add `data-variant={variant}` to the section.

- [ ] **Step 3: Use a non-H1 cinematic title on `/rebuild`**

At the top of `src/app/rebuild/page.tsx`, render:

```tsx
<CinematicEntry
  variant="rebuild"
  indexLeft="THROHI MEDICAL TOOLS"
  indexRight="SIALKOT / PAKISTAN"
  eyebrow="INSTRUMENTS IN MOTION"
  title={<>Precision begins<br />with the instrument.</>}
  titleElement="p"
/>
```

The company hero remains the only H1.

- [ ] **Step 4: Style the rebuild variant**

For `[data-variant="rebuild"]`:
- deep black/navy base;
- supplied video remains full-bleed;
- logo/identity copy stays legible and restrained;
- Skip control is always discoverable;
- slide-away movement uses existing progress variable;
- no extra particles, grid, cursor, or glow;
- reduced-motion state has no long scroll spacer;
- media error shows the fallback and allows immediate entry.

Preserve default selectors for the current public page.

- [ ] **Step 5: Verify default and rebuild usage**

Run:

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=desktop-chromium --grep "cinematic"
```

Manually open `/` and `/rebuild` locally to confirm the default public component still renders.

- [ ] **Step 6: Commit**

```bash
git add src/components/cinematic-entry.tsx src/app/rebuild/page.tsx tests/e2e/rebuild-home-design.spec.ts
git add <existing-cinematic-stylesheet-path>
git commit -m "feat: integrate rebuild cinematic entry"
```

Before executing this commit, replace `<existing-cinematic-stylesheet-path>` with the actual stylesheet found by searching for `.cinematic-entry`; do not commit a literal placeholder path.

---

### Task 6: Build the company-led hero and immediate search

**Files:**
- Create: `src/components/rebuild/home/home-hero.tsx`
- Create: `src/components/rebuild/home/home-hero.module.css`
- Create: `src/components/rebuild/home/home-catalogue-search.tsx`
- Modify: `src/app/rebuild/page.tsx`
- Modify or delete: `src/app/rebuild/home.module.css`
- Test: `tests/e2e/rebuild-home-design.spec.ts`

**Interfaces:**
- Consumes: `RuntimeProduct`, `CatalogueMedia`, `homeHeroCopy`, `/rebuild/products?q=...`.
- Produces: `HomeHero` and `HomeCatalogueSearch`.

- [ ] **Step 1: Keep the Task 1 hero/search test failing and add image identity**

```ts
test("hero uses one signature scissors composition", async ({ page }) => {
  await enterRebuild(page);
  const hero = page.locator("[data-home-hero]");
  await expect(hero.getByRole("img", { name: /operating scissors/i })).toHaveCount(1);
  await expect(hero.locator("[data-hero-instrument]")).toHaveCount(1);
});
```

- [ ] **Step 2: Implement `HomeCatalogueSearch`**

```tsx
export function HomeCatalogueSearch() {
  return (
    <form
      action="/rebuild/products"
      role="search"
      aria-label="Catalogue search"
    >
      <label htmlFor="home-catalogue-query">Find an instrument by name or product code</label>
      <div>
        <input
          id="home-catalogue-query"
          name="q"
          type="search"
          placeholder="04-0101 or operating scissors"
          autoComplete="off"
        />
        <button type="submit">Find product</button>
      </div>
      <p>Exact code, compact code, instrument name, or product family.</p>
    </form>
  );
}
```

Keep it a server-compatible GET form. Do not add client state.

- [ ] **Step 3: Implement `HomeHero`**

```tsx
import Link from "next/link";
import { CatalogueMedia } from "@/app/rebuild/products/catalogue-media";
import type { RuntimeProduct } from "@/lib/rebuild-catalogue";
import { homeHeroCopy } from "@/rebuild/home-content";
import { HomeCatalogueSearch } from "./home-catalogue-search";
import styles from "./home-hero.module.css";

export type HomeHeroProps = {
  scissors: RuntimeProduct;
  productCount: number;
  variantCount: number;
};

export function HomeHero({ scissors, productCount, variantCount }: HomeHeroProps) {
  return (
    <section className={styles.hero} data-home-hero aria-labelledby="rebuild-home-title">
      <div className={styles.copy}>
        <h1 id="rebuild-home-title">{homeHeroCopy.title}</h1>
        <p>{homeHeroCopy.description}</p>
        <div className={styles.actions}>
          <Link href="/rebuild/products">Browse instruments</Link>
          <Link href="/rebuild/inquiry">Build an inquiry</Link>
        </div>
      </div>
      <div className={styles.instrument} data-hero-instrument>
        <CatalogueMedia product={scissors} priority labelled />
      </div>
      <HomeCatalogueSearch />
      <dl className={styles.catalogueSummary} aria-label="Available catalogue data">
        <div><dt>Product families</dt><dd>{productCount}</dd></div>
        <div><dt>Variant codes</dt><dd>{variantCount.toLocaleString("en-US")}</dd></div>
      </dl>
    </section>
  );
}
```

Counts are factual catalogue inventory, not promotional performance statistics.

- [ ] **Step 4: Implement the clean-split composition**

Desktop:
- company copy uses the stronger left reading column;
- one scissors visual occupies the right and may approach the central grid without crossing text;
- search is integrated along the lower hero boundary and visible before a full extra viewport;
- catalogue summary is quiet technical data, not a dark promotional stats strip.

Mobile:
- title and explanation first;
- actions second;
- scissors third;
- search fourth;
- summary last;
- no absolute positioning that causes overlap at 320–390px.

- [ ] **Step 5: Replace the old hero composition in `page.tsx`**

Keep product lookup:

```ts
const operatingScissors = requireProduct("04-0101");
```

Render:

```tsx
<HomeHero
  scissors={operatingScissors}
  productCount={rebuildCatalogue.counts.products}
  variantCount={rebuildCatalogue.counts.variants}
/>
```

Remove the three-instrument scene, internal coordinate labels, vertical review copy, and oversized dark count strip.

- [ ] **Step 6: Run tests and commit**

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=desktop-chromium --grep "company identity|search|signature scissors"
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=mobile-chromium --grep "company identity|search"
git add src/components/rebuild/home/home-hero.tsx src/components/rebuild/home/home-hero.module.css src/components/rebuild/home/home-catalogue-search.tsx src/app/rebuild/page.tsx src/app/rebuild/home.module.css tests/e2e/rebuild-home-design.spec.ts
git commit -m "feat: build company-led rebuild hero"
```

---

### Task 7: Build truthful division and selected-family discovery

**Files:**
- Create: `src/components/rebuild/home/home-division-index.tsx`
- Create: `src/components/rebuild/home/home-selected-families.tsx`
- Create: `src/components/rebuild/home/home-sections.module.css`
- Modify: `src/app/rebuild/page.tsx`
- Test: `tests/e2e/rebuild-home-design.spec.ts`

**Interfaces:**
- Consumes: `homeDivisionPresentation`, `RuntimeProduct[]`, `CatalogueMedia`, existing product routes.
- Produces: division index and selected real family section.

- [ ] **Step 1: Add failing interaction assertions**

```ts
test("structured divisions link to filtered catalogue and pending divisions do not fake links", async ({ page }) => {
  await enterRebuild(page);
  await expect(page.getByRole("link", { name: /Surgical Instruments/i })).toHaveAttribute("href", /division=surgical/);
  await expect(page.getByRole("link", { name: /Dental & Orthodontic Instruments/i })).toHaveAttribute("href", /division=dental/);
  await expect(page.getByRole("link", { name: /Veterinary Instruments/i })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Beauty Instruments/i })).toHaveCount(0);
});

test("selected families use real product routes", async ({ page }) => {
  await enterRebuild(page);
  const section = page.getByRole("region", { name: /Selected instrument families/i });
  await expect(section.locator("article")).toHaveCount(3);
  await expect(section.getByRole("link", { name: /04-0101/i })).toBeVisible();
});
```

- [ ] **Step 2: Implement `HomeDivisionIndex`**

Render structured divisions as links and pending divisions as `article` elements. Each item contains:
- division name;
- concise truthful summary;
- indexed family count only for structured divisions;
- one representative real image only where real data exists;
- exact state phrase for pending divisions: `Detailed catalogue not yet published`.

Do not number the divisions unless the numbers are used for navigation. Do not wrap ordinary copy in nested cards.

- [ ] **Step 3: Implement `HomeSelectedFamilies`**

```tsx
export type HomeSelectedFamiliesProps = {
  products: readonly RuntimeProduct[];
};
```

Each product article must show:
- `product.code` in `<code>`;
- `product.name`;
- `product.division`;
- `product.familyLabel`;
- variant count when available;
- real `CatalogueMedia`;
- a single clear product link.

Do not label the selection `Popular`, `Best selling`, or `Recommended`.

- [ ] **Step 4: Select three complementary real families in `page.tsx`**

Continue using existing validated products:
- Operating Scissors `04-0101`;
- Needle Holder `09-1301`;
- Osteotome `36-6901`.

Use Oliver Pliers `SP-84` as the Dental representative in the division index, not as a fourth selected card unless visual review shows a real content need.

- [ ] **Step 5: Implement responsive editorial rows**

- Division items are broad horizontal bands on desktop.
- Product families form a useful three-item comparison on desktop.
- Tablet and mobile preserve image, code, name, and route without oversized card height.
- Pending divisions remain visually intentional and do not look disabled due to an error.

- [ ] **Step 6: Run tests and commit**

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --grep "divisions|selected families"
git add src/components/rebuild/home/home-division-index.tsx src/components/rebuild/home/home-selected-families.tsx src/components/rebuild/home/home-sections.module.css src/app/rebuild/page.tsx tests/e2e/rebuild-home-design.spec.ts
git commit -m "feat: add truthful homepage catalogue discovery"
```

---

### Task 8: Add verified company introduction and scissors-evolution preview

**Files:**
- Create: `src/components/rebuild/home/home-company-intro.tsx`
- Create: `src/components/rebuild/home/home-evolution-preview.tsx`
- Modify: `src/components/frame-evolution-scene.tsx`
- Modify: existing stylesheet containing `.frame-evolution-*`
- Modify: `src/app/rebuild/page.tsx`
- Test: `tests/e2e/rebuild-home-design.spec.ts`

**Interfaces:**
- Consumes: `homeCompanyCopy`, `/media/sector9d/manifest.json`, existing evolution chapter/frame utilities.
- Produces: backward-compatible `FrameEvolutionSceneProps` and homepage preview wrapper.

- [ ] **Step 1: Add failing copy and preview tests**

```ts
test("verified company section names the real origin and four divisions", async ({ page }) => {
  await enterRebuild(page);
  const company = page.getByRole("region", { name: /About THROHI/i });
  await expect(company.getByText(/Sialkot, Pakistan/i)).toBeVisible();
  await expect(company.getByText(/Surgical/i)).toBeVisible();
  await expect(company.getByText(/Dental and Orthodontic/i)).toBeVisible();
  await expect(company.getByText(/Veterinary/i)).toBeVisible();
  await expect(company.getByText(/Beauty/i)).toBeVisible();
});

test("scissors evolution preview exposes useful fallback semantics", async ({ page }) => {
  await enterRebuild(page);
  const evolution = page.getByRole("region", { name: /Scissors through time/i });
  await expect(evolution).toBeVisible();
  await expect(evolution.getByRole("img", { name: /evolution of cutting and surgical instruments/i })).toBeVisible();
});
```

- [ ] **Step 2: Add props to `FrameEvolutionScene`**

```tsx
import type { ReactNode } from "react";

export type FrameEvolutionSceneProps = {
  variant?: "full" | "preview";
  eyebrow?: string;
  title?: ReactNode;
  accessibleLabel?: string;
};

export function FrameEvolutionScene({
  variant = "full",
  eyebrow = "05 · PRECISION THROUGH TIME",
  title = <>The instrument changes.<br /><span>The text follows.</span></>,
  accessibleLabel = "Scroll-controlled evolution of cutting and surgical instruments",
}: FrameEvolutionSceneProps) {
  // preserve loading, sprite selection, frame rendering and chapter state
}
```

Add `data-variant={variant}`. Use the props in the heading and stage label. Preserve full-mode defaults for the current public implementation.

- [ ] **Step 3: Implement preview-specific presentation**

For `variant="preview"`:
- use the same 260 frames and chapter logic;
- reduce section scroll distance and visual chrome;
- hide the development-style frame counter if it does not improve visitor understanding;
- keep chapter copy readable;
- use title `Scissors through time`;
- do not imply THROHI invented or manufactured every historical form;
- do not link to a Company page until that route exists;
- reduced motion shows a representative frame and full text without sticky scrolling.

- [ ] **Step 4: Implement `HomeCompanyIntro`**

Use a `<section id="company" aria-labelledby="home-company-title">` with:
- one heading;
- the two approved public-safe paragraphs;
- a compact division list only if it adds scanning value;
- no mission, vision, values, stats, or proof cards.

- [ ] **Step 5: Implement `HomeEvolutionPreview`**

```tsx
import { FrameEvolutionScene } from "@/components/frame-evolution-scene";

export function HomeEvolutionPreview() {
  return (
    <div role="region" aria-label="Scissors through time">
      <FrameEvolutionScene
        variant="preview"
        eyebrow="SCISSORS THROUGH TIME"
        title={<>A familiar form,<br /><span>refined across eras.</span></>}
        accessibleLabel="Evolution of cutting and surgical instruments"
      />
    </div>
  );
}
```

- [ ] **Step 6: Run reduced-motion tests**

Add:

```ts
test("reduced motion keeps cinematic and evolution content accessible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild");
  await expect(page.getByRole("heading", { level: 1, name: /THROHI Medical Tools/i })).toBeVisible();
  await expect(page.getByRole("region", { name: /Scissors through time/i })).toBeVisible();
});
```

Run:

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --grep "company|evolution|reduced motion"
```

- [ ] **Step 7: Commit**

```bash
git add src/components/rebuild/home/home-company-intro.tsx src/components/rebuild/home/home-evolution-preview.tsx src/components/frame-evolution-scene.tsx src/app/rebuild/page.tsx tests/e2e/rebuild-home-design.spec.ts
git add <existing-evolution-stylesheet-path>
git commit -m "feat: add verified company and scissors narrative"
```

Before execution, resolve `<existing-evolution-stylesheet-path>` by searching for `.frame-evolution-section`; do not commit a literal placeholder path.

---

### Task 9: Add practical utilities and honest contact entry

**Files:**
- Create: `src/components/rebuild/home/home-utilities-contact.tsx`
- Modify: `src/components/rebuild/home/home-sections.module.css`
- Modify: `src/app/rebuild/page.tsx`
- Read: `src/rebuild/contact.ts`
- Test: `tests/e2e/rebuild-home-design.spec.ts`

**Interfaces:**
- Consumes: `verifiedContact`, `/rebuild/products`, `/rebuild/inquiry`.
- Produces: homepage utility/contact section with no fake form or empty channels.

- [ ] **Step 1: Add failing utility tests**

```ts
test("homepage ends with real catalogue and inquiry actions", async ({ page }) => {
  await enterRebuild(page);
  const utilities = page.getByRole("region", { name: /Catalogue and inquiry options/i });
  await expect(utilities.getByRole("link", { name: /Browse the digital catalogue/i })).toHaveAttribute("href", "/rebuild/products");
  await expect(utilities.getByRole("link", { name: /Review Inquiry List/i })).toHaveAttribute("href", "/rebuild/inquiry");
  await expect(utilities.getByRole("link", { name: /Request an unlisted instrument/i })).toHaveAttribute("href", "/rebuild/inquiry#unlisted-instrument");
});

test("unverified contact channels are not rendered as empty controls", async ({ page }) => {
  await enterRebuild(page);
  await expect(page.locator('a[href="mailto:"]')).toHaveCount(0);
  await expect(page.locator('a[href="tel:"]')).toHaveCount(0);
});
```

- [ ] **Step 2: Implement utility content**

Use one semantic section with three real actions:
- Browse the digital catalogue.
- Review Inquiry List.
- Request an unlisted instrument.

Present them as structured rows or two-column editorial links. Do not use three generic icon cards.

- [ ] **Step 3: Render contact data conditionally**

```tsx
{verifiedContact.email ? <a href={`mailto:${verifiedContact.email}`}>{verifiedContact.email}</a> : null}
{verifiedContact.phoneHref && verifiedContact.phoneDisplay ? (
  <a href={verifiedContact.phoneHref}>{verifiedContact.phoneDisplay}</a>
) : null}
{verifiedContact.whatsappHref ? (
  <a href={verifiedContact.whatsappHref}>Continue through WhatsApp</a>
) : null}
```

Always render `Sialkot, Pakistan` as verified location.

When no direct channel is verified, provide one honest path: `Start a structured inquiry` linking to `/rebuild/inquiry`. Do not display a nonfunctional contact form.

- [ ] **Step 4: Ensure the unlisted-item anchor exists**

Inspect `src/app/rebuild/inquiry` implementation. If an unlisted instrument section already exists, add `id="unlisted-instrument"` to its semantic container. If it does not exist, use `/rebuild/inquiry` without a fragment in this milestone and update the test accordingly. Do not add a dead fragment.

- [ ] **Step 5: Run tests and commit**

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --grep "catalogue and inquiry|contact"
git add src/components/rebuild/home/home-utilities-contact.tsx src/components/rebuild/home/home-sections.module.css src/app/rebuild/page.tsx src/rebuild/contact.ts tests/e2e/rebuild-home-design.spec.ts
git commit -m "feat: add honest homepage inquiry utilities"
```

---

### Task 10: Complete responsive, accessibility, and failure-state behavior

**Files:**
- Modify: `src/components/rebuild/home/home-hero.module.css`
- Modify: `src/components/rebuild/home/home-sections.module.css`
- Modify: `src/components/rebuild/rebuild-header.module.css`
- Modify: `src/components/rebuild/rebuild-footer.module.css`
- Modify: cinematic/evolution stylesheets.
- Modify: `tests/e2e/rebuild-home-design.spec.ts`

**Interfaces:**
- Consumes: all Milestone 1 components.
- Produces: deliberate desktop/tablet/mobile/reduced-motion/high-zoom behavior.

- [ ] **Step 1: Add layout overflow checks**

```ts
for (const width of [320, 390, 768, 1280, 1440]) {
  test(`homepage has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    await page.goto("/rebuild");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
```

- [ ] **Step 2: Add keyboard journey test**

```ts
test("keyboard users can reach search, catalogue and inquiry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});
```

If `#main` is not focusable after the native skip link, add `tabIndex={-1}` to the main element.

- [ ] **Step 3: Define responsive breakpoints by behavior**

Implement at least:
- large desktop composition above 1200px;
- laptop/tablet refinement around 900–1199px;
- mobile navigation and stacked hero below the point where nav labels or hero columns become cramped;
- narrow mobile correction around 360px.

Do not choose breakpoints merely to match common device names; inspect actual content fit.

- [ ] **Step 4: Add reduced-motion CSS**

Under `@media (prefers-reduced-motion: reduce)`:
- remove cinematic smooth transition and excess scroll travel;
- remove instrument entrance animation;
- disable evolution sticky frame progression in favor of stable content;
- keep panel state changes immediate;
- preserve hover/focus state without movement.

- [ ] **Step 5: Add media failure simulation test**

Intercept the manifest:

```ts
test("media failure never blocks the homepage", async ({ page }) => {
  await page.route("**/media/sector9d/manifest.json", (route) => route.fulfill({ status: 500, body: "" }));
  await page.goto("/rebuild");
  await expect(page.getByRole("heading", { level: 1, name: /THROHI Medical Tools/i })).toBeVisible();
  await expect(page.getByRole("search", { name: /catalogue/i })).toBeVisible();
});
```

- [ ] **Step 6: Run full desktop and mobile e2e**

```bash
npm run build
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=desktop-chromium
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=mobile-chromium
```

Expected: all tests pass with no serious or critical Axe findings.

- [ ] **Step 7: Commit**

```bash
git add src/components/rebuild/home/home-hero.module.css src/components/rebuild/home/home-sections.module.css src/components/rebuild/rebuild-header.module.css src/components/rebuild/rebuild-footer.module.css tests/e2e/rebuild-home-design.spec.ts
git add <resolved-cinematic-stylesheet> <resolved-evolution-stylesheet>
git commit -m "fix: complete responsive and accessible homepage behavior"
```

Resolve the two stylesheet paths before execution.

---

### Task 11: Perform visual review and subtractive correction

**Files:**
- Modify only files implicated by specific visual findings.
- Create or update: `output/playwright/rebuild-home-desktop.png`
- Create or update: `output/playwright/rebuild-home-mobile.png`
- Test: `tests/e2e/rebuild-home-design.spec.ts`

**Interfaces:**
- Consumes: completed Milestone 1 build.
- Produces: reviewed desktop/mobile screenshots and corrected composition.

- [ ] **Step 1: Start the production build locally**

```bash
npm run build
npm run start -- -p 3000
```

- [ ] **Step 2: Capture desktop and mobile screenshots**

Use Playwright against:
- desktop 1440×1000;
- mobile 390×844;
- one laptop viewport around 1280×800;
- one narrow mobile viewport around 320×700.

Save the two primary review images to the existing `output/playwright` paths.

- [ ] **Step 3: Conduct an art-direction review**

Record concrete findings against:
- Is THROHI clearly the first real-screen focus?
- Does the scissors support rather than compete with the identity?
- Is Sialkot visible but secondary?
- Is search available early?
- Do the four divisions feel like one editorial system rather than cards?
- Are product images high-resolution and correctly cropped?
- Does any section repeat a message or CTA?
- Does any internal review language remain customer-facing?
- Does the homepage become visually noisy after the cinematic cover?
- Is the mobile order deliberate rather than a simple stack?

Fix every finding that is within Milestone 1 scope.

- [ ] **Step 4: Conduct a subtractive review**

Remove any element that does not improve:
- understanding;
- navigation;
- credibility;
- decision-making;
- interaction;
- accessibility;
- appropriate brand emotion.

Specifically check for:
- unnecessary eyebrow labels;
- duplicate product counts;
- decorative technical coordinates;
- extra borders;
- repeated actions;
- redundant explanatory paragraphs;
- empty contact controls;
- motion applied to every section.

- [ ] **Step 5: Re-run screenshots and tests**

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts
```

- [ ] **Step 6: Commit reviewed corrections**

```bash
git add src output/playwright tests/e2e/rebuild-home-design.spec.ts
git commit -m "fix: refine rebuild homepage after visual review"
```

Do not use `git add .`; stage only reviewed files.

---

### Task 12: Complete documentation and milestone verification

**Files:**
- Modify: `PROJECT_STATE.md`
- Modify: `PLANS.md`
- Modify: `CHANGELOG.md`
- Read: `docs/superpowers/specs/2026-07-30-surgical-precision-archive-design.md`
- Read: `docs/superpowers/plans/2026-07-30-homepage-shared-shell.md`

**Interfaces:**
- Consumes: all passing implementation and review evidence.
- Produces: an auditable milestone state and a clean handoff to catalogue redesign planning.

- [ ] **Step 1: Run the final quality gate**

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=desktop-chromium
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=mobile-chromium
```

Record the exact pass/fail results. Do not mark the milestone complete if any command fails.

- [ ] **Step 2: Update `PROJECT_STATE.md`**

Record:
- `Surgical Precision Archive` as the approved visual subdirection of `Surgical Contrast`;
- company-led hero;
- clean split with one signature scissors;
- balanced buyer/partner entry;
- homepage and shared shell as completed only if every quality gate passes;
- current public site remains unchanged;
- next milestone is catalogue discovery redesign.

- [ ] **Step 3: Update `PLANS.md`**

Move Milestone 1 into Completed only after verification. Set the next active design/implementation phase to catalogue discovery while keeping client catalogue validation dependencies explicit.

- [ ] **Step 4: Update `CHANGELOG.md`**

List:
- new branch and design system;
- header/footer redesign;
- cinematic integration;
- company-led hero and search;
- four-division truth states;
- selected product families;
- company/evolution/utilities sections;
- accessibility and responsive validation;
- tests executed.

- [ ] **Step 5: Commit the verified milestone documentation**

```bash
git add PROJECT_STATE.md PLANS.md CHANGELOG.md
git commit -m "docs: record verified homepage design milestone"
```

- [ ] **Step 6: Do not open a pull request automatically**

Present the branch, screenshots, test results, known content dependencies, and exact files changed to the user. Open a draft pull request only after explicit authorization.

---

## Plan Self-Review

### Spec coverage

- Company-led balanced hero: Tasks 5–6.
- One signature scissors visual: Task 6.
- Cinematic MP4: Task 5.
- Early catalogue search: Task 6.
- Four truthful divisions: Task 7.
- Selected real families: Task 7.
- Verified company copy: Task 8.
- Scissors sequence: Task 8.
- Utilities and honest contact entry: Task 9.
- Shared header/footer: Tasks 3–4.
- Responsive/mobile: Task 10.
- Accessibility and reduced motion: Tasks 1, 4, 5, 8, 10.
- Media failure: Tasks 5 and 10.
- Visual/subtractive review: Task 11.
- Documentation and gated handoff: Task 12.

### Placeholder scan

The only angle-bracket paths in Tasks 5, 8, and 10 are explicit execution instructions requiring the implementer to resolve existing stylesheet locations before staging. They must never be committed literally. No product, copy, contact, or functional requirement is deferred through a vague placeholder.

### Scope check

This plan intentionally implements only homepage and shared shell. Catalogue, product detail, Inquiry List backend work, company route, catalogue downloads, full contact workflow, legal/error pages, and production cutover remain separate milestones so each can be reviewed and rejected independently.

### Type consistency

- `HomeHeroProps` consumes `RuntimeProduct`, `productCount`, and `variantCount` consistently.
- `HomeSelectedFamiliesProps` consumes `readonly RuntimeProduct[]` consistently.
- `CinematicEntryProps` and `FrameEvolutionSceneProps` preserve default behavior and add optional rebuild-specific configuration.
- `HomeDivisionPresentation` uses the same four division slugs as `RebuildDivisionRoute`.
- `VerifiedContactConfig` never renders empty contact controls.

## Execution Rule

After the user reviews this plan, execute with one of these Superpowers workflows:

1. **Subagent-driven development — recommended:** one fresh implementation worker per task, followed by specification and code-quality review before the next task.
2. **Executing plans inline:** implement in controlled batches with review checkpoints after the shell, hero/search, content sections, and final QA.

No implementation begins before the user approves this written plan.