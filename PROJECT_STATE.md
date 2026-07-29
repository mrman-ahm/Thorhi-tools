# THROHI Rebuild — Project State

This file is the single decision source of truth for the current rebuild. Chat discussion, earlier branches, screenshots, and previous implementations are reference material unless a decision is recorded here.

## Current phase

**Phase 6: real-route static integration and browser review**

Research, catalogue strategy, information architecture, user journeys, structural wireframes, and the shared Surgical Contrast visual foundation are complete on the rebuild branch. Public routes remain unchanged. Advanced motion and full catalogue ingestion have not begun.

## Approved project purpose

THROHI Medical Tools needs a professional corporate and catalogue website that:

- introduces the company and its instrument ranges to the market;
- presents Surgical, Dental and Orthodontic, Veterinary, and Beauty divisions;
- provides a searchable digital catalogue using real product names, codes, images, families, and variants;
- provides downloadable catalogue documents when real files are available;
- lets visitors create a non-commerce Inquiry List and contact THROHI through form, email, phone, or WhatsApp;
- integrates the supplied cinematic entry and scissors-evolution media without obstructing practical browsing.

## Approved design direction

**Surgical Contrast**

- Dark, cinematic identity moments built around black, charcoal, steel, restrained blue, and restrained green.
- High-clarity catalogue and form surfaces; lighter surfaces are allowed where reading and comparison benefit.
- Strong animation without a gaming, cyberpunk, SaaS, or creative-agency appearance.
- Real instrument imagery is the primary visual material.
- One major cinematic moment and one secondary signature interaction; interface motion remains restrained.
- Instrument Sans is the display face, Archivo is the interface and reading face, and IBM Plex Mono is reserved for product codes and technical data.
- Surgical green is the primary action colour; steel blue is a restrained supporting accent rather than a glow effect.
- Borders, spacing, and moderate radii define grouping. Generic card shells, excessive pills, and decorative glass panels are not part of the foundation.

## Approved information architecture

- Home
- Products
  - All Products
  - Surgical Instruments
  - Dental and Orthodontic Instruments
  - Veterinary Instruments
  - Beauty Instruments
  - Category routes
  - Product-family routes with variants
- Company
  - About THROHI
  - Scissors Through Time
- Catalogues
- Inquiry List
- Contact
- Search and utility/error routes

Company, About, and general company story content belong on one Company page. Do not create repetitive Mission, Vision, Why Choose Us, or Our Story pages without unique verified content.

## Approved global navigation

Primary routes:

- Products
- Company
- Catalogues
- Contact

Persistent utilities:

- Search
- Inquiry List with item count
- WhatsApp

The Products menu exposes only the four divisions, Browse All Products, and Search by Name or Code. It must not expose the entire category tree.

## Approved homepage structure

1. Skippable cinematic cover with reduced-motion fallback.
2. Real homepage hero explaining what THROHI provides and where it is based.
3. Early catalogue search by instrument name or product code.
4. Four product-division entry routes.
5. Concise verified company introduction.
6. Short scissors-evolution preview linking to the complete Company-page experience.
7. Catalogue, document, and Inquiry List utilities.
8. Direct contact methods and a compact form.

Do not add a logo marquee, fake statistics, testimonials, generic feature grid, repeated CTA section, decorative dashboard, newsletter, pricing, or FAQ without verified need.

## Approved catalogue model

Hierarchy:

`Division → Category / Instrument Family → Product Family → Variant`

Current supplied structured data contains approximately:

- 53 categories
- 626 representative product families
- 1,434 variants

The family is the normal catalogue-listing unit. Near-identical variants remain consolidated inside the product-family route.

Search priority:

1. exact product code;
2. code prefix;
3. product-family name;
4. alias;
5. category;
6. broader text match.

Initial filters may include division, category, product family, variant count, and image availability. Technical filters such as size, curvature, tip pattern, material, or finish are added only after reliable data validation.

Surgical and Dental/Orthodontic have the strongest supplied structured data. Beauty and Veterinary remain visible but must not be populated with invented catalogue records.

## Approved Inquiry List behaviour

The Inquiry List is not a shopping cart and has no checkout or public pricing.

Visitors may:

- add product families or selected variants;
- set quantities;
- add notes or an unlisted instrument reference;
- provide contact details;
- submit one structured inquiry or continue through WhatsApp.

No account is required.

## Motion allocation

Major motion:

1. cinematic cover and slide-away reveal;
2. complete scissors-evolution experience.

Supporting motion is limited to navigation, search, filters, inquiry feedback, product-image transitions, and controlled steel-light responses.

Do not use universal fade-up entrances, random cursor trails, constant tilting, excessive parallax, moving buttons, auto-scrolling product carousels, or animation that delays access to content.

## Anti-AI design rules

- Every section must answer a unique visitor question.
- Every visible component must perform a real function or communicate unique information.
- Do not place ordinary text in cards by default.
- Do not place an eyebrow label above every heading.
- Do not repeat the same message in labels, headings, paragraphs, cards, and CTAs.
- Do not invent facts, testimonials, certifications, customers, metrics, awards, export markets, materials, manufacturing capabilities, minimum orders, or company history.
- Use component libraries only as implementation raw material and restyle them into one coherent system.
- Empty space is permitted; decoration must earn its place.
- Mobile is designed deliberately rather than created by stacking desktop sections.
- The website must remain understandable when animation fails or reduced motion is enabled.

## Verified facts and public-safe content

Currently safe:

- THROHI Medical Tools is based in Sialkot, Pakistan.
- The public range includes Surgical, Dental, Veterinary, and Beauty instruments.
- Existing catalogue/product data and public contact routes may be used after validation.

Pending client confirmation:

- founding year and operating history;
- certifications;
- materials and steel grades;
- manufacturing capabilities and capacity;
- export markets;
- OEM or private-label services;
- minimum order quantities and lead times;
- final approved company description;
- final contact formatting;
- complete Beauty and Veterinary catalogue data.

Pending facts must remain absent from production or be explicitly marked as internal placeholders during development.

## Production workflow

The core workflow is browser-first inside the Next.js repository. Figma is optional only for a specific design problem where it clearly improves the result. Canva is not part of website production.

Order:

1. static responsive composition;
2. visual foundation and design tokens;
3. browser screenshot review;
4. responsive corrections;
5. component and catalogue functionality;
6. motion integration;
7. accessibility, performance, security, and QA;
8. production audit and deployment.

Work is batched locally where possible. GitHub pushes are limited to meaningful validated milestones. Pull requests are opened only when remote CI is intentionally required.

## Existing assets to preserve as source material

- supplied THROHI logos, after cleanup and verification;
- supplied instrument cinematic video;
- supplied 260-frame scissors-evolution sequence;
- supplied catalogue workbook, catalogue bundle, and instrument-image archive;
- existing working search, inquiry, accessibility, and testing foundations where they remain useful.

Previous layouts, copy, visual stages, and component decisions are not binding.

## Explicitly rejected patterns

- gaming, cyberpunk, or edgy design-company presentation;
- generic SaaS structure;
- random glass panels, blobs, neon, grids, or particles;
- low-resolution product imagery;
- fake or vector-like instrument substitutes when real assets exist;
- huge elements that weaken product and company clarity;
- every section enclosed in rounded cards;
- filler headings, fake proof, and decorative section numbering;
- coding major visuals before structure and content responsibilities are clear.

## Change control

- Latest explicit user instruction overrides this file.
- A new approved decision must update this file before or with implementation.
- Do not silently reverse an approved decision.
- When two instructions materially conflict, stop that affected decision and ask the user once with the exact conflict and recommended resolution.
- Minor implementation choices that do not alter approved UX, brand direction, content truth, scope, or architecture may be resolved professionally without interruption.

## Next milestone

Integrate and review the approved static foundation on real rebuild routes:

1. reusable global header and Products navigation;
2. homepage hero, catalogue search, division routes, company introduction, utilities, and contact structure;
3. existing SearchCommand and live Inquiry List state;
4. desktop, tablet, and mobile browser screenshots;
5. local lint, typecheck, build, and focused browser validation before any pull request.

The current public implementation must remain available until the rebuild routes pass review. The cinematic entry, full scissors-evolution motion, and complete catalogue ingestion remain deferred until the static real-route UX is approved.
