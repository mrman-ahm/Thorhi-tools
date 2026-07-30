# THROHI Milestone 2 — Company & Trust Spine Design

**Date:** 2026-07-30  
**Branch:** `design/surgical-precision-archive`  
**Status:** Design specification for review

## 1. Objective

Milestone 2 extends the approved Surgical Precision Archive direction beyond the homepage into the company and trust-building routes that support procurement decisions.

The milestone creates rebuild-native experiences for:

- `/rebuild/company`
- `/rebuild/company/scissors-through-time`
- `/rebuild/catalogues`
- `/rebuild/contact`

It also updates the rebuild header and footer so Company, Catalogues, and Contact point to real destinations rather than homepage anchors.

Milestone 2 does not replace the existing catalogue, product-detail, or Inquiry List architecture. It gives those working buyer tools a credible corporate and documentary context.

## 2. Mandatory prerequisite

Milestone 1 remains the gate.

Before Milestone 2 implementation begins, the current branch must pass:

- ESLint without generated-artifact errors;
- TypeScript checking;
- all unit tests;
- production build;
- desktop Playwright coverage;
- mobile Playwright coverage;
- Axe serious/critical checks;
- reduced-motion checks;
- media-failure checks;
- visual screenshot review at the required desktop and mobile sizes.

Milestone 2 may be planned while this verification finishes, but feature implementation must not conceal or defer a Milestone 1 regression.

## 3. Selected approach

### Approach A — Company & Trust Spine — selected

Build four related rebuild-native routes using one shared internal-page system. Company establishes the verified identity, Scissors Through Time carries the signature editorial experience, Catalogues explains real document availability, and Contact routes visitors into structured inquiry.

Advantages:

- one coherent buyer journey;
- shared components and tokens without generic page duplication;
- strong separation between verified facts and pending evidence;
- the full evolution sequence receives a proper destination;
- practical routes remain available even when direct contact details or PDFs are pending.

Risk:

- the scope can become too large if every route is implemented simultaneously.

Mitigation:

- execute in four independently verified blocks, with one route-level acceptance contract per block.

### Approach B — Company and evolution only

Build only Company and Scissors Through Time, leaving Catalogues and Contact as homepage utilities.

Advantage: smaller initial scope.

Disadvantage: navigation still leads to incomplete trust and conversion surfaces. The buyer journey remains fragmented.

### Approach C — One combined Company page

Place company identity, history, documents, and contact on one long route.

Advantage: fewer routes.

Disadvantage: mixes unrelated visitor questions, weakens navigation clarity, and creates an oversized page with competing responsibilities.

Approach A is selected because it preserves clear page responsibilities while sharing one system.

## 4. Product and content truth boundary

Public-safe facts currently available:

- the company name is THROHI Medical Tools;
- THROHI is based in Sialkot, Pakistan;
- the range includes Surgical, Dental and Orthodontic, Veterinary, and Beauty instruments;
- validated catalogue records can be searched by product name or code;
- visitors can build a structured non-commerce Inquiry List;
- the supplied instrument video and 260-frame scissors sequence are approved source assets for the rebuild experience.

The milestone must not invent or imply:

- founding year or company age;
- certifications;
- steel grades or materials;
- manufacturing capacity;
- factory processes or quality systems;
- export markets;
- OEM or private-label services;
- minimum order quantities;
- lead times;
- clients, awards, testimonials, or performance statistics;
- direct email, phone, WhatsApp, address formatting, or business hours before verification;
- downloadable catalogue PDFs that do not exist as approved files.

Pending facts appear only as restrained availability states or internal review guidance, never as achievements.

## 5. Information architecture

### 5.1 `/rebuild/company`

Visitor question: **Who is THROHI, what ranges does it present, and what can I do next?**

Responsibilities:

1. identify THROHI Medical Tools and Sialkot, Pakistan;
2. explain the four instrument divisions without inflating incomplete catalogue depth;
3. connect company context to real catalogue discovery;
4. explain the evidence-first publication boundary without exposing internal production language as the page’s main story;
5. introduce Scissors Through Time as an editorial instrument-history experience, not THROHI corporate history;
6. route visitors to Products, Catalogues, and Inquiry List.

The page must feel like a company profile, not a compliance checklist or a developer-status screen.

### 5.2 `/rebuild/company/scissors-through-time`

Visitor question: **How did the form and use of scissors evolve, and how does the supplied sequence communicate that progression?**

Responsibilities:

1. present a concise editorial introduction;
2. render the full supplied 260-frame evolution sequence;
3. synchronize clear chapter copy with frame boundaries;
4. maintain the original sixteen-by-nine geometry;
5. provide loading, missing-manifest, decoding, and canvas-failure fallbacks;
6. provide a complete reduced-motion reading mode;
7. distinguish general instrument evolution from THROHI company history;
8. end with present-day product discovery and inquiry routes.

The page is the second and final major motion experience. It must not gain unrelated parallax, cursor effects, moving buttons, or decorative animation.

### 5.3 `/rebuild/catalogues`

Visitor question: **What product information can I browse now, and which downloadable documents are actually available?**

Responsibilities:

1. separate the digital searchable catalogue from downloadable documents;
2. expose the four divisions truthfully;
3. link Surgical and Dental/Orthodontic to structured catalogue results;
4. show Veterinary and Beauty as pending detailed records without fake links;
5. render approved document metadata only when a real file exists;
6. show a clear unavailable state rather than a disabled-looking fake download;
7. route document requests or unlisted references into the Inquiry List.

No document card may render a Download action without a verified URL, file type, file size, title, division, and publication/update date.

### 5.4 `/rebuild/contact`

Visitor question: **What is the best way to send THROHI a useful request?**

Responsibilities:

1. make the structured Inquiry List the primary product-request route;
2. provide an unlisted-instrument entry path;
3. explain the minimum useful request context: product/reference, quantity, requirements, buyer details;
4. render verified direct contact channels only when present in the contact data boundary;
5. never render empty or placeholder email, phone, WhatsApp, map, hours, or address controls;
6. include a concise information-safety notice;
7. provide clear next actions without duplicating the entire Inquiry List form.

The Contact page is a routing surface, not a second inquiry implementation.

## 6. Shared rebuild internal-page architecture

Milestone 2 introduces a small shared component layer for corporate routes. Components remain specific enough to avoid generic template output.

Suggested boundaries:

- `RebuildPageHero` — route identity, title, concise supporting copy, optional real media;
- `RebuildSectionHeading` — section title and one unique explanatory paragraph;
- `RebuildDivisionLedger` — four-division presentation with structured/pending states;
- `RebuildTruthBoundary` — compact verified/pending publication explanation;
- `RebuildActionRail` — two or three real next routes, no repeated CTA wall;
- `RebuildDocumentLedger` — verified document rows and honest unavailable states;
- `RebuildContactRoutes` — structured inquiry, unlisted item, and verified direct channels;
- `RebuildEditorialFrame` — constrained reading layout around the full evolution scene.

Content constants and verified availability state live outside visual components:

- `src/rebuild/company-content.ts`
- `src/rebuild/catalogue-documents.ts`
- existing `src/rebuild/contact.ts`

Components receive typed content and availability state. They do not invent fallback claims internally.

## 7. Visual system

The routes inherit Milestone 1 tokens and typography.

### Corporate surfaces

- paper and steel backgrounds for reading;
- near-black navy for major identity or editorial transitions;
- surgical green reserved for primary actions and verified availability;
- steel blue for supporting structure, not glow;
- lines, alignment, and spacing provide grouping;
- moderate radii only where a bounded control or media frame needs them.

### Layout behavior

- editorial split layouts rather than repeated cards;
- clear reading widths for company and history copy;
- division and document information presented as ledgers, rows, or indexed bands;
- real instrument media used only where it communicates product or editorial meaning;
- no decorative factory imagery placeholders on customer-facing routes.

### Mobile behavior

Mobile is designed as a deliberate sequence:

1. identity and purpose;
2. primary action;
3. supporting evidence or division information;
4. editorial/media content;
5. final next route.

Desktop grids must not merely collapse into long stacks with duplicated labels.

## 8. Navigation convergence

When routes exist, update rebuild navigation to:

- Products → `/rebuild/products`
- Company → `/rebuild/company`
- Catalogues → `/rebuild/catalogues`
- Contact → `/rebuild/contact`

Persistent utilities remain:

- search;
- Inquiry List with live count;
- verified WhatsApp only when approved.

The Products menu remains limited to four divisions, Browse All Products, and Search by Name or Code.

The footer exposes the same real route system and does not link rebuild users back into legacy public pages.

## 9. Scissors evolution interaction

The existing `FrameEvolutionScene` remains the renderer foundation but receives a page-level editorial wrapper.

### Motion mode

- sequence loads lazily after essential route content;
- canvas is sticky only for the defined evolution stage;
- scroll progress maps to the analyzed frame boundaries;
- chapter copy changes from rendered frame state, not raw scroll position;
- transitions use easing only to prevent jitter, not to create delayed input;
- the sequence releases the document cleanly at the final frame.

### Reduced-motion mode

- no sticky scroll progression;
- one representative supplied visual;
- all chapter titles and copy displayed in normal document flow;
- no hidden information;
- direct catalogue and inquiry actions remain available.

### Failure mode

If the manifest or sprite fails:

- the page remains usable;
- chapter copy remains readable;
- a restrained static THROHI/instrument fallback replaces the canvas;
- no retry loop blocks navigation.

## 10. Catalogue-document data model

A document record must include:

```ts
type RebuildCatalogueDocument = {
  id: string;
  title: string;
  division: "surgical" | "dental" | "veterinary" | "beauty" | "general";
  format: "PDF";
  sizeLabel: string;
  publishedOrUpdated: string;
  href: string;
};
```

Only complete valid records render as downloads.

An empty division state renders:

- division name;
- concise availability message;
- relevant digital catalogue route when structured data exists;
- Inquiry List route for a known reference or requirement.

The code must not synthesize metadata from filenames.

## 11. Contact data flow

The Contact page reads the existing verified contact boundary.

Rendering rules:

- location may render because Sialkot, Pakistan is verified;
- email renders only when a verified email exists;
- phone renders only when display and href values both exist;
- WhatsApp renders only when a verified href exists;
- no label such as “pending approval” appears as though it were a usable public contact method;
- structured inquiry remains available regardless of direct-contact verification.

No new backend or form endpoint is introduced in this milestone.

## 12. Accessibility requirements

Every route must meet:

- one visible page `h1`;
- semantic regions with distinct accessible names;
- keyboard-reachable navigation and actions;
- visible focus styles with sufficient contrast;
- no focus trap outside the mobile menu dialog;
- mobile menu focus restoration on close;
- WCAG AA text contrast;
- accessible loading and failure text for media;
- canvas content represented by readable chapter text;
- no information conveyed by color alone;
- touch targets at least 44 by 44 CSS pixels where practical;
- correct reduced-motion behavior.

Axe serious and critical violations are release blockers.

## 13. Performance requirements

- no new large JavaScript animation library;
- reuse Anime.js only where already justified;
- evolution sprites remain outside the JavaScript bundle;
- lazy-load the full evolution media;
- no full-resolution product images below the fold without responsive sizing;
- no duplicated media downloads between homepage preview and full history route when browser cache can be reused;
- route-first content must remain visible while optional media loads;
- no autoplay video on Milestone 2 routes.

## 14. Error and empty states

Required states:

- missing evolution manifest;
- image decode failure;
- no approved catalogue documents;
- one or more document divisions unavailable;
- no verified direct contact methods;
- empty Inquiry List before following a contact route;
- unknown rebuild corporate route uses the existing not-found behavior.

States must explain the next useful action without exposing stack traces or internal client-review language.

## 15. Testing strategy

### Unit/source contracts

- rebuild navigation points to real corporate routes;
- company copy includes only verified facts;
- four divisions remain present;
- no prohibited claims enter company content;
- document records require complete metadata;
- incomplete documents never render download links;
- direct contact controls require verified values;
- full evolution route uses the supplied renderer and reduced-motion copy.

### Playwright — desktop and mobile

- Company route identity and real facts;
- Company division ledger and next actions;
- Scissors route full motion mode;
- Scissors reduced-motion mode;
- Scissors manifest-failure mode;
- Catalogues digital/document separation;
- no fake document downloads;
- Contact structured inquiry and unlisted item routes;
- direct-contact absence does not produce empty controls;
- header and footer route convergence;
- mobile navigation focus trap and restoration;
- no horizontal overflow at 320, 390, 768, 1280, and 1440 widths;
- Axe serious/critical scan for all four routes.

### Visual review

Capture and review:

- Company desktop and mobile;
- Scissors opening, middle chapter, final release, reduced motion, and failure fallback;
- Catalogues with no approved PDFs;
- Contact with no verified direct channels;
- open mobile navigation on each route.

## 16. Execution decomposition

### Phase 0 — Milestone 1 closure

- rerun the isolated verification script;
- fix remaining real failures;
- review screenshots;
- update project state only after evidence exists.

### Phase 1 — Shared corporate route foundation

- acceptance tests first;
- typed content and document boundaries;
- shared internal-page components;
- real navigation routes;
- no large visual content implementation yet.

### Phase 2 — Company

- rebuild-native Company route;
- verified identity and division ledger;
- editorial evolution preview;
- catalogue and inquiry actions;
- route-specific accessibility and screenshots.

### Phase 3 — Scissors Through Time

- rebuild-native full editorial route;
- full 260-frame sequence;
- reduced-motion and failure states;
- performance and interaction review.

### Phase 4 — Catalogues

- digital catalogue and document separation;
- typed verified document model;
- honest empty states;
- division routes and inquiry handoff.

### Phase 5 — Contact

- structured inquiry routing;
- unlisted item path;
- verified contact rendering;
- information-safety notice.

### Phase 6 — Convergence and verification

- header/footer active states;
- cross-route responsive and accessibility review;
- lint, typecheck, unit, build, desktop/mobile Playwright, Axe;
- final screenshot correction pass;
- documentation and changelog updates.

Each phase receives a dedicated implementation commit and a separate specification/quality review before the next phase begins.

## 17. Acceptance criteria

Milestone 2 is complete only when:

1. all four rebuild-native routes exist and are linked from the shared shell;
2. every company statement is public-safe and evidence-bound;
3. the full supplied evolution sequence has motion, reduced-motion, and failure parity;
4. the Catalogues route never exposes a fake download;
5. the Contact route never exposes an empty or unverified direct channel;
6. catalogue and Inquiry List behavior remain intact;
7. desktop and mobile navigation remains accessible;
8. all required automated checks pass from a clean checkout;
9. Axe reports no serious or critical violations on the four routes;
10. visual review confirms one coherent Surgical Precision Archive system without filler, generic cards, or unnecessary motion;
11. `/rebuild` remains no-indexed and no public cutover occurs without explicit approval;
12. no pull request or GitHub Actions run is triggered without explicit approval.

## 18. Explicit non-goals

Not part of Milestone 2:

- catalogue discovery redesign;
- product-detail redesign;
- Inquiry List redesign;
- durable database or attachment storage;
- email or WhatsApp delivery integration;
- legal-page redesign;
- public route replacement;
- production cutover;
- client catalogue approval work;
- invented company proof or document content.
