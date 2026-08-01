# THROHI Production Imagery System Design

**Date:** 2026-08-01  
**Status:** Approved for specification; implementation pending written-plan review  
**Repository:** `mrman-ahm/Thorhi-tools`  
**Working branch:** `media/production-imagery-system`  
**Base branch:** `implementation/throhi-foundation-layer-1`  
**Figma source of truth:** `THROHI Website & Admin Dashboard — Design System and UX` (`w12E41un4krAwBqlo8fHa6`)

## 1. Purpose

This specification defines how THROHI will replace image placeholders with accurate, commercially safe, production-ready imagery across the public website, owner-admin interface, Figma handoff, and product catalogue.

The work is not a generic stock-photo exercise. Every image must serve a known page, component, product identity, responsive crop, or procurement task.

The system has two coordinated tracks:

1. **Editorial and interface imagery** for Home, Company, division entry points, catalogues, Contact, Inquiry, and admin previews.
2. **Product imagery** for Surgical and Dental catalogue records, product cards, Product Detail, related products, Inquiry snapshots, and search results.

## 2. Source-of-truth hierarchy

When sources conflict, use this order:

1. Latest explicit user instruction.
2. This specification.
3. August 1 THROHI website foundation specification.
4. Current Figma production file and approved component/page hierarchy.
5. Client-supplied catalogues and images.
6. Existing source-derived repository catalogue data.
7. External research used only under the licensing and traceability rules below.

Historical wireframes, rejected visual studies, old placeholder imagery, dark-first catalogue treatments, and earlier four-division assumptions are not authoritative.

## 3. Approved source materials

### 3.1 Client-supplied catalogue set

The current Surgical catalogue source set is:

- `Knives Catalog(1).pdf`
- `Cutters Catalog(1).pdf`
- `Scissors Catalog(1).pdf`
- `Punches Catalog(1).pdf`
- `Chisels Catalog(1).pdf`

Every distinct product family, named instrument, reference code, dimensional variant, straight/curved configuration, jaw or blade form, coating state, and materially different silhouette shown in these catalogues must be inventoried.

A catalogue page may contain:

- one product with multiple codes;
- one family with multiple dimensions;
- regular, Super Cut, and TC variants;
- straight and curved variants;
- multiple tip or jaw geometries;
- diagram-only variants;
- one product photograph representing several codes.

The inventory must preserve those distinctions rather than flattening a page into a single image record.

### 3.2 Existing repository media

The repository already contains a source-derived media pipeline for 626 products and 1,434 variants, including:

- `src/data/catalogue.runtime.generated.json`
- `src/data/catalogue.media.generated.json`
- `public/catalogue/products/*.avif`
- `public/catalogue/catalogue-sheet.avif`
- `public/catalogue/manifest.json`
- `public/catalogue/media-manifest.json`
- `scripts/prepare-product-media.mjs`

These assets are an engineering baseline, not automatic final approval. Each product image must be checked for:

- identity match;
- silhouette match;
- source traceability;
- crop quality;
- resolution;
- background consistency;
- duplicate or swapped assignment;
- appropriateness for the new Figma layout.

### 3.3 Supplied cinematic and historical media

The approved first-visit intro and Company-page scissors evolution media remain separate from the catalogue image system. They must not be repurposed as generic product thumbnails.

## 4. Commercial-use and licensing rule

Production images may come from:

1. client-owned catalogue imagery;
2. client-supplied photography;
3. images with explicit commercial reuse rights compatible with the website;
4. commissioned or newly photographed THROHI imagery;
5. carefully restored catalogue extracts when no legitimate higher-resolution replacement exists.

Images found on competing manufacturers, distributors, marketplaces, social media, or search results may be retained as identification references only unless commercial reuse permission is explicit and recorded.

The system must never silently copy a competitor image into production.

Generated images may be used for non-product editorial backgrounds only when they do not imply a false factory, certification, facility, employee, or exact instrument. Generated imagery must not represent a precise catalogue product, because small geometric errors can misrepresent surgical or dental instruments.

## 5. Product identity and matching rules

A product image is considered a valid match only when all applicable visible characteristics agree:

- instrument family and common name;
- reference code or documented representative code;
- overall silhouette;
- handle form;
- ring, spring, plier, or shaft structure;
- straight, curved, angled, left, or right orientation;
- jaw, tip, blade, cutting edge, cup, punch, or gouge profile;
- length class and proportion;
- regular, Super Cut, TC, or coated state when visible;
- number and placement of joints, ratchets, screws, or springs;
- catalogue diagrams and detail callouts.

A name-only match is insufficient.

When one photograph legitimately represents several dimensional variants, the media record may be shared but the variant identities must remain separate.

When no exact high-resolution image exists, retain the source catalogue image and mark the record as `source-restoration-required`. Do not substitute a merely similar instrument.

## 6. Image inventory model

The image inventory is the central authority for all placement and approval work.

Each record must contain:

```ts
type MediaInventoryRecord = {
  id: string;
  mediaRole: "editorial" | "division" | "family" | "product" | "document" | "ui-preview";
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
  backgroundStatus: "transparent" | "clean-neutral" | "needs-isolation" | "editorial";
  approvedPlacements: string[];
  responsiveCropPolicy: "contain" | "editorial-cover" | "document-cover";
  focalPoint: { x: number; y: number } | null;
  altText: string;
  notes: string[];
};
```

No production asset may be referenced directly from a page component without a corresponding approved inventory record.

## 7. Editorial imagery system

### 7.1 Home

Home imagery must support:

- THROHI identity and Sialkot origin;
- Surgical and Dental division entry points;
- representative source-derived families or products;
- catalogue access;
- concise company introduction;
- final Contact and Inquiry actions.

Preferred visual language:

- controlled macro photography of stainless-steel instruments;
- clean neutral specimen arrangements;
- precise workshop details only when genuinely sourced;
- restrained paper, pale steel, emerald, and technical-blue surroundings;
- human context only when factual and visually necessary.

Prohibited Home imagery:

- generic surgeons posing at camera;
- graphic operations, blood, tissue, or anatomy;
- fake factories or unnamed workers presented as THROHI;
- generic laboratory stock unrelated to instruments;
- dramatic luxury-watch lighting repeated across sections;
- fake certificates, awards, export maps, or facility claims.

### 7.2 Division entry imagery

Surgical and Dental entry images must be visibly distinct while belonging to one system.

- **Surgical:** scissors, forceps, punches, chisels, knives, or other source-derived instruments arranged with disciplined clinical spacing.
- **Dental:** orthodontic pliers, cutters, forceps, or other source-derived dental instruments with the same neutral-stage logic.

Division imagery must remain representative rather than implying that one featured instrument is the entire division.

### 7.3 Company

Company imagery may include:

- concise Sialkot context from commercially usable documentary photography;
- supplied scissors evolution sequence;
- present-day product imagery;
- factual catalogue depth.

No image may imply an unverified THROHI factory, founder, workforce, certification, export market, capacity, or historical event.

### 7.4 Catalogues

Catalogue cards use authentic supplied document covers or neutral generated thumbnails derived from the real PDF first page. They must not use fabricated catalogue documents.

### 7.5 Contact and Inquiry

Contact and Inquiry should remain primarily functional. Supporting imagery may be used only when it improves hierarchy without distracting from forms, selected products, and contact actions.

## 8. Product stage design

Product cards and Product Detail use a contained clinical-specimen stage.

Rules:

- preserve the full silhouette;
- use `object-fit: contain` or equivalent;
- maintain consistent stage proportions;
- use warm neutral, white, or pale-steel backgrounds;
- avoid aggressive crops;
- avoid fake reflections, mirrored floors, excessive glow, and dramatic color grading;
- keep lower-resolution Surgical images smaller rather than enlarging them to fill the card;
- allow higher-resolution Dental images more space without changing card geometry;
- keep shadows subtle and physically plausible;
- do not erase visible coatings or material differences;
- do not rotate an instrument merely for decoration when orientation communicates product identity.

Desktop catalogue remains three columns, tablet two where practical, and mobile one.

## 9. Responsive image behavior

Every approved placement must define its responsive behavior.

### 9.1 Product images

- always contain the full instrument;
- no breakpoint-specific destructive crops;
- stage padding may reduce on smaller screens;
- thin or long instruments may use a rotated stage only when the catalogue orientation remains understandable and the same policy is consistently applied to the family.

### 9.2 Editorial images

- desktop, tablet, and mobile crops may differ;
- focal point must be stored in the inventory;
- text-safe areas must be reviewed against actual Figma frames;
- mobile may switch from cover crop to contained crop if the subject would otherwise be lost;
- essential product identity must never sit beneath text overlays.

### 9.3 Image dimensions

Final output dimensions will be selected from actual rendered container sizes. Assets must not be generated at arbitrary desktop-only dimensions.

## 10. Figma coordination

The Figma file remains the visual placement authority.

The media workflow must:

1. inspect each production frame that contains or requires imagery;
2. identify the exact node, aspect ratio, crop mode, and text-safe area;
3. create an inventory placement record;
4. supply candidate imagery for review;
5. place only approved imagery into Figma;
6. preserve original source files outside Figma;
7. record the final asset path and code mapping in the `09 Handoff` page.

Rejected candidates belong in a clearly labeled review or archive area, not mixed with approved assets.

The media branch must not overwrite the frontend agent’s layout work. Code integration occurs through stable asset paths and a manifest that the frontend branch can consume or merge.

## 11. Repository architecture

The proposed media architecture is:

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

Existing catalogue runtime and product identifiers must remain stable. The media system attaches to products; it does not silently rename or merge them.

## 12. Processing pipeline

### Stage A — Placement audit

- inspect Figma production pages and current frontend routes;
- list every image-bearing node and every placeholder;
- record role, dimensions, crop mode, focal point, responsive variants, and page priority;
- classify each placement as product, editorial, document, or UI preview.

### Stage B — Catalogue extraction

- parse all five supplied catalogue PDFs;
- extract page images and text;
- identify products, codes, variants, dimensions, and diagrams;
- create page-level contact sheets for review;
- generate inventory records without publishing images.

### Stage C — Existing-media reconciliation

- match extracted catalogue identities against the existing 626-product runtime;
- detect exact matches, missing records, duplicates, swapped assignments, and ambiguous names;
- preserve variant relationships;
- require manual review for ambiguous matches.

### Stage D — External research

- search for higher-resolution identification references and commercially reusable candidates;
- record source URLs, ownership, license, and retrieval date;
- reject unknown or incompatible licenses from production;
- compare silhouette and detail callouts against the catalogue.

### Stage E — Restoration and preparation

- isolate catalogue products when needed;
- correct neutral background and exposure without changing instrument geometry;
- remove page text and unrelated objects only when this does not alter the product;
- avoid AI reconstruction of tips, jaws, serrations, blades, screws, or coatings;
- export responsive, color-managed production files;
- preserve originals and processing provenance.

### Stage F — Figma placement review

- place candidates in actual production frames;
- review desktop, tablet, and mobile crops;
- reject images that look acceptable in isolation but fail in context;
- record approval state.

### Stage G — Code integration

- publish stable asset paths and generated manifests;
- replace placeholders through data mappings rather than repeated component-specific hardcoding;
- preserve lazy loading, priority media, width/height metadata, and accessible alt text;
- run image integrity, unit, build, and rendered-browser checks.

## 13. Approval states

Every media record uses one of these workflow states:

- `discovered`
- `identity-verified`
- `license-verified`
- `prepared`
- `figma-reviewed`
- `production-approved`
- `rejected`
- `blocked-client-input`

An image reaches production only after both identity and licensing verification.

Client catalogue extracts may satisfy licensing as client-owned, but still require identity and quality review.

## 14. Alt text and accessibility

Product alt text should identify the instrument and useful visible configuration without stuffing codes or marketing language.

Examples:

- `Curved Metzenbaum surgical scissors with ring handles`
- `Straight orthodontic ligature cutter, reference SC-01T`
- `Stille osteotome with broad straight blade`

Decorative editorial textures use empty alt text. Informative editorial imagery receives concise factual alt text.

The image itself must not be the only place where a product name, reference code, variant, or action is communicated.

## 15. Performance and output rules

- retain explicit width and height metadata;
- use modern production formats supported by the existing Next.js pipeline;
- preserve original source files outside public delivery folders;
- do not upscale low-resolution images beyond useful sharpness;
- use responsive derivatives based on actual layout needs;
- priority-load only above-the-fold media;
- lazy-load catalogue grids below the initial viewport;
- prevent cumulative layout shift;
- avoid a single oversized global sprite as the only delivery path when individual product files are available;
- keep a factual fallback for missing or blocked imagery.

## 16. Failure behavior

The system must fail closed.

- Unknown license: image remains reference-only.
- Ambiguous product identity: no automatic assignment.
- Missing exact image: retain verified source extract or factual unavailable stage.
- Corrupt file: exclude it and report the record.
- Missing Figma placement mapping: do not integrate the asset into code.
- Missing dimensions or alt text: validation fails.
- Duplicate production assignment to incompatible products: validation fails.
- Frontend branch changes during media work: regenerate the placement audit before integration.

## 17. Testing and acceptance

The finished system must prove:

1. every image-bearing production placement has a mapped approved asset or an explicit factual blocked state;
2. every public product image maps to a stable product identity;
3. every external production asset has recorded commercial-use permission;
4. no reference-only competitor image is shipped;
5. no product silhouette is destructively cropped;
6. desktop, tablet, and mobile Figma frames have reviewed crops;
7. Product cards maintain consistent stages across mixed source quality;
8. all assets expose dimensions and alt-text policy;
9. build and browser tests find no broken image paths;
10. existing intro and evolution media continue to work;
11. no GitHub Actions run, deployment, merge, or public cutover occurs without explicit permission.

## 18. Work decomposition

This specification will be implemented through three independently reviewable plans:

1. **Media inventory and placement audit** — Figma nodes, frontend placeholders, catalogue extraction, and source reconciliation.
2. **Editorial imagery sourcing and preparation** — Home, Company, divisions, catalogues, Contact, Inquiry, and responsive placement review.
3. **Product imagery verification and production pipeline** — exact product matching, licensing, restoration, manifests, code integration, and rendered QA.

The first plan must be completed before broad image sourcing, because it defines exactly what imagery is required and prevents wasted searches or mismatched crops.

## 19. Non-goals

This work does not:

- redesign the approved Figma layouts;
- invent new public divisions;
- fabricate company photography or operational claims;
- create fake product variants;
- change product naming without a separate catalogue-data review;
- build ecommerce behavior;
- publish unverified contact information;
- merge or deploy the frontend agent’s branch;
- intentionally trigger GitHub Actions.

## 20. Completion definition

The imagery program is complete when:

- all production placeholders have been audited;
- all approved placements have suitable, traceable imagery;
- all five supplied catalogues have a structured product and variant inventory;
- existing repository product media has been reconciled against that inventory;
- production product images are identity-verified and commercially safe;
- Figma and code use the same approved asset manifest;
- responsive crops and product stages pass rendered review;
- blocked client inputs are explicitly documented rather than hidden by placeholders.
