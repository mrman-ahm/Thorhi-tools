# THROHI Production Imagery System Design

**Date:** 2026-08-01  
**Status:** Awaiting user review  
**Repository:** `mrman-ahm/Thorhi-tools`  
**Working branch:** `media/production-imagery-system`  
**Base branch:** `implementation/throhi-foundation-layer-1`  
**Figma source of truth:** `THROHI Website & Admin Dashboard — Design System and UX` (`w12E41un4krAwBqlo8fHa6`)

## 1. Goal

Replace every production image placeholder with accurate, commercially safe, responsive imagery that fits the approved THROHI layouts and preserves exact product identity.

The work has two coordinated tracks:

1. **Editorial imagery** for Home, Company, division entry points, catalogue documents, Contact, Inquiry, and owner-admin previews.
2. **Product imagery** for catalogue cards, Product Detail, related products, search results, and Inquiry snapshots.

This is a media-production system, not a stock-photo sweep. Every asset must have a documented purpose, source, license state, Figma placement, code path, responsive behavior, and approval state.

## 2. Authority and isolation

When sources conflict, use this order:

1. latest explicit user instruction;
2. this specification;
3. the August 1 THROHI foundation specification;
4. the current Figma production file;
5. client-supplied catalogues and images;
6. existing source-derived repository data;
7. external research under the licensing rules below.

The media branch must not overwrite the frontend agent's layout work. Integration happens through stable asset paths and generated manifests that can be merged into the active frontend branch later.

No merge, deployment, indexing change, public cutover, or intentional GitHub Actions run is authorized.

## 3. Approved catalogue source set

The current attached instrument catalogues are:

- `Knives Catalog(1).pdf`
- `Cutters Catalog(1).pdf`
- `Scissors Catalog(1).pdf`
- `Punches Catalog(1).pdf`
- `Chisels Catalog(1).pdf`

Every meaningful catalogue identity must be inventoried:

- family and named instrument;
- product and representative code;
- dimensional variants;
- straight, curved, angled, left, and right configurations;
- regular, Super Cut, TC, coated, or other visibly distinct states;
- jaw, blade, tip, punch, cup, gouge, handle, and shaft forms;
- diagram-only variants;
- cases where one image legitimately represents several codes.

The inventory must not flatten a page into one product merely because the page uses one representative photograph.

## 4. Existing repository baseline

The repository already contains a 626-product, 1,434-variant source-derived media pipeline, including:

- `src/data/catalogue.runtime.generated.json`
- `src/data/catalogue.media.generated.json`
- `public/catalogue/products/*.avif`
- `public/catalogue/catalogue-sheet.avif`
- `public/catalogue/manifest.json`
- `public/catalogue/media-manifest.json`
- `scripts/prepare-product-media.mjs`

These assets are an engineering baseline, not automatic final approval. Each assignment must be checked for:

- exact identity;
- silhouette and visible geometry;
- correct variant relationship;
- duplicate or swapped assignment;
- source traceability;
- resolution and crop quality;
- background consistency;
- suitability for the approved Figma stage.

Existing product IDs and variant codes remain stable. Media attaches to those identities; it does not silently rename, merge, or split catalogue records.

## 5. Commercial-use rule

Production images may come from:

1. client-owned catalogue imagery;
2. client-supplied photography;
3. images with explicit commercial reuse permission compatible with the website;
4. commissioned or newly photographed THROHI imagery;
5. carefully restored catalogue extracts when no legitimate higher-resolution replacement exists.

Images found on competitors, distributors, marketplaces, social media, or search results are **reference-only** unless commercial reuse permission is explicit and recorded.

The system must never silently ship a competitor image.

Generated imagery may be used only for non-product editorial backgrounds when it does not imply a false factory, employee, facility, certification, export market, historical event, or exact instrument. Generated imagery must not represent precise catalogue products.

## 6. Exact product-matching rule

A product image is valid only when all applicable visible characteristics agree:

- family and instrument name;
- reference or representative code;
- overall silhouette and proportions;
- handle, ring, spring, plier, ratchet, or shaft structure;
- straight, curved, angled, left, or right orientation;
- jaw, tip, blade, cutting edge, cup, punch, or gouge profile;
- number and placement of joints, screws, springs, or ratchets;
- visible coating or TC state;
- catalogue diagrams and detail callouts.

A name-only match is insufficient.

When one photograph legitimately represents multiple dimensional variants, the image may be shared while variant identities remain separate.

When no exact high-resolution image exists, retain the verified catalogue extract and set `qualityStatus` to `restoration-required`. Do not substitute a merely similar instrument.

## 7. Central inventory model

No production page may reference an asset that lacks an approved inventory record.

```ts
type MediaInventoryRecord = {
  id: string;
  workflowState:
    | "discovered"
    | "identity-verified"
    | "license-verified"
    | "prepared"
    | "figma-reviewed"
    | "production-approved"
    | "rejected"
    | "blocked-client-input";
  mediaRole:
    | "editorial"
    | "division"
    | "family"
    | "product"
    | "document"
    | "ui-preview";
  division: "surgical" | "dental" | null;
  familyId: string | null;
  productId: string | null;
  productName: string | null;
  representativeCode: string | null;
  variantCodes: string[];
  catalogueSource: string | null;
  cataloguePage: number | null;
  sourceType:
    | "client-catalogue"
    | "client-photo"
    | "repository-source-derived"
    | "licensed-external"
    | "commissioned"
    | "generated-editorial";
  sourceUrl: string | null;
  sourceFile: string | null;
  retrievedAt: string | null;
  licenseStatus:
    | "client-owned"
    | "commercial-approved"
    | "reference-only"
    | "unknown"
    | "not-applicable";
  identityConfidence: "exact" | "high" | "medium" | "unapproved";
  silhouetteStatus: "verified" | "needs-review" | "mismatch";
  qualityStatus:
    | "production-ready"
    | "retouch-required"
    | "restoration-required"
    | "replacement-required"
    | "reference-only";
  backgroundStatus:
    | "transparent"
    | "clean-neutral"
    | "needs-isolation"
    | "editorial";
  approvedPlacements: string[];
  responsiveCropPolicy: "contain" | "editorial-cover" | "document-cover";
  focalPoint: { x: number; y: number } | null;
  width: number | null;
  height: number | null;
  altText: string;
  notes: string[];
};
```

An asset reaches production only after identity and license verification. Client catalogue extracts satisfy licensing as client-owned but still require identity and quality review.

## 8. Editorial imagery direction

### Home

Home imagery must support:

- THROHI identity and verified Sialkot origin;
- Surgical and Dental entry points;
- representative source-derived families or products;
- catalogue access;
- concise company introduction;
- Contact and Inquiry actions.

Preferred visual language:

- controlled macro photography of stainless-steel instruments;
- clean neutral specimen arrangements;
- restrained paper, pale steel, emerald, and technical-blue surroundings;
- authentic workshop detail only when genuinely sourced;
- human context only when factual and necessary.

Prohibited Home imagery:

- generic surgeons posing at camera;
- blood, tissue, anatomy, or graphic operations;
- fake factories or unnamed workers presented as THROHI;
- generic laboratory stock unrelated to instruments;
- repeated luxury-watch lighting;
- fake certificates, awards, testimonials, or export maps.

### Division entry points

- **Surgical:** representative scissors, forceps, punches, chisels, knives, or other verified Surgical instruments.
- **Dental:** representative orthodontic pliers, cutters, forceps, or other verified Dental instruments.

Both divisions use the same clinical-stage system but must remain visually distinguishable.

### Company

Company imagery may use commercially safe Sialkot documentary context, the supplied scissors evolution sequence, present-day product imagery, and factual catalogue depth.

No image may imply an unverified THROHI factory, founder, workforce, certification, capacity, market, or history.

### Catalogues

Catalogue cards use authentic supplied PDF covers or thumbnails derived from the real first page. No fabricated catalogue document is allowed.

### Contact and Inquiry

These pages remain primarily functional. Supporting imagery is optional and must not compete with forms, selected products, or contact actions.

## 9. Product-stage design

Product cards and Product Detail use a contained clinical-specimen stage.

Rules:

- preserve the full instrument silhouette;
- use contain behavior rather than destructive crops;
- use consistent stage proportions;
- use warm neutral, white, or pale-steel backgrounds;
- avoid fake reflections, mirrored floors, excessive glow, and dramatic grading;
- keep lower-resolution Surgical images smaller and sharper;
- allow stronger Dental images more visual space without changing card geometry;
- preserve visible coatings and material differences;
- keep shadows subtle and physically plausible;
- preserve meaningful catalogue orientation.

The approved grid remains three columns on desktop, two on tablet where practical, and one on mobile.

## 10. Responsive behavior

### Product media

- always preserve the full silhouette;
- never introduce breakpoint-specific destructive crops;
- allow reduced stage padding on smaller screens;
- rotate thin or long instruments only when family policy is consistent and identity remains clear.

### Editorial media

- desktop, tablet, and mobile crops may differ;
- store a focal point for each placement;
- review actual text-safe areas in Figma;
- switch to contain on mobile when cover cropping would lose the subject;
- never place essential product identity beneath text overlays.

Final output sizes must come from actual rendered container dimensions, not arbitrary desktop-only exports.

## 11. Figma coordination

The Figma file remains the placement authority.

For every image-bearing production node:

1. record page and node ID;
2. record natural frame dimensions and aspect ratio;
3. classify crop mode and text-safe area;
4. attach candidate assets to the inventory;
5. review desktop, tablet, and mobile states;
6. place only approved imagery;
7. record final code path and usage in `09 Handoff`.

Rejected candidates belong in a clearly labeled review/archive area, not among approved assets.

Original source files remain outside Figma.

## 12. Repository architecture

```text
data/media/
  editorial-inventory.json
  product-inventory.generated.json
  product-review.decisions.json
  source-licenses.json
  placement-map.json

public/media/
  editorial/
    home/
    company/
    divisions/
    contact/
    catalogues/
  products/
    surgical/
    dental/

scripts/media/
  extract-catalogue-inventory.mjs
  reconcile-product-media.mjs
  validate-media-licenses.mjs
  prepare-editorial-media.mjs
  prepare-product-media-v2.mjs
  build-media-manifest.mjs

src/data/
  media.manifest.generated.json

tests/
  media-inventory.test.mjs
  media-license.test.mjs
  media-product-identity.test.mjs
  media-output.test.mjs
```

## 13. Processing workflow

### A. Placement audit

Inspect the Figma production pages and current frontend routes. Record every image-bearing node, placeholder, component state, aspect ratio, crop mode, focal point, responsive variant, and priority.

### B. Catalogue extraction

Parse all five attached PDFs. Extract page text and images, identify products and variants, and generate page-level contact sheets and structured inventory records without publishing anything.

### C. Reconciliation

Match the catalogue inventory against the existing 626-product runtime. Detect exact matches, missing records, duplicate assignments, swapped images, ambiguous names, and variant mismatches. Ambiguous records require review.

### D. External research

Search for high-resolution identification references and commercially reusable candidates. Record URL, ownership, license, retrieval date, and silhouette comparison. Unknown licenses remain reference-only.

### E. Restoration and preparation

Isolate catalogue products where needed, normalize neutral backgrounds and exposure, and remove page text only when product geometry is untouched.

Do not use AI reconstruction on tips, jaws, serrations, blades, screws, springs, coatings, or other identity-bearing geometry.

### F. Figma review

Place candidates in actual production frames and review desktop, tablet, and mobile crops. Images that fail in context are rejected even when they look acceptable in isolation.

### G. Code integration

Publish stable paths and generated manifests. Replace placeholders through data mappings rather than repeated component-specific hardcoding. Preserve dimensions, alt text, priority loading, and lazy loading.

## 14. Accessibility

Product alt text identifies the instrument and useful visible configuration without keyword stuffing.

Examples:

- `Curved Metzenbaum surgical scissors with ring handles`
- `Straight orthodontic ligature cutter, reference SC-01T`
- `Stille osteotome with broad straight blade`

Decorative textures use empty alt text. Informative editorial imagery uses concise factual alt text.

Product names, codes, variants, and actions must remain available as text outside the image.

## 15. Performance

- retain explicit width and height metadata;
- use modern formats supported by the existing Next.js pipeline;
- preserve originals outside public delivery folders;
- do not enlarge low-resolution images beyond useful sharpness;
- produce responsive derivatives from real layout needs;
- priority-load only above-the-fold media;
- lazy-load catalogue grids below the initial viewport;
- prevent cumulative layout shift;
- keep individual product files available instead of relying only on one oversized sprite;
- provide a factual fallback for blocked or missing imagery.

## 16. Fail-closed behavior

- unknown license: reference-only;
- ambiguous identity: no automatic assignment;
- missing exact image: verified source extract or factual unavailable stage;
- corrupt file: excluded and reported;
- missing Figma mapping: no code integration;
- missing dimensions or alt text: validation failure;
- incompatible duplicate assignment: validation failure;
- frontend layout changes during media work: refresh placement audit before integration.

## 17. Acceptance criteria

The finished system must prove that:

1. every production image placement has an approved asset or explicit blocked state;
2. every public product image maps to a stable product identity;
3. every external production asset has recorded commercial-use permission;
4. no reference-only competitor image ships;
5. no product silhouette is destructively cropped;
6. desktop, tablet, and mobile crops are reviewed in Figma;
7. mixed source quality still produces consistent product stages;
8. all production assets provide dimensions and correct alt-text behavior;
9. no broken image path appears in tests or rendered browser review;
10. the supplied intro and evolution media continue to work;
11. the media branch does not overwrite concurrent frontend layout work;
12. no GitHub Actions run, deployment, merge, or public cutover occurs without permission.

## 18. Work decomposition

Implementation is split into three independently reviewable plans:

1. **Media inventory and placement audit** — Figma nodes, frontend placeholders, catalogue extraction, and source reconciliation.
2. **Editorial imagery sourcing and preparation** — Home, Company, divisions, catalogues, Contact, Inquiry, and responsive placement review.
3. **Product imagery verification and production pipeline** — exact product matching, licensing, restoration, manifests, integration, and rendered QA.

The first plan must complete before broad sourcing. It defines exactly what images are needed and prevents wasted searches or unsuitable crops.

## 19. Non-goals

This work does not:

- redesign approved layouts;
- invent public divisions;
- fabricate company photography or claims;
- create fake product variants;
- rename catalogue products without a separate data review;
- build ecommerce behavior;
- publish unverified contact details;
- merge or deploy the frontend agent's work;
- intentionally trigger GitHub Actions.

## 20. Completion definition

The imagery program is complete when:

- all production placeholders are audited;
- all approved placements have suitable, traceable imagery;
- all five attached catalogues have a structured product and variant inventory;
- existing repository media is reconciled against that inventory;
- production product images are identity-verified and commercially safe;
- Figma and code use the same approved manifest;
- responsive crops and product stages pass rendered review;
- blocked client inputs are documented rather than hidden by placeholders.
