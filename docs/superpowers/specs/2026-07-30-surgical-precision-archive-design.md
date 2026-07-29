# THROHI Surgical Precision Archive — Experience and Design Specification

**Date:** 2026-07-30  
**Branch:** `design/surgical-precision-archive`  
**Parent:** `rebuild/surgical-contrast`  
**Status:** Approved design direction; implementation requires the milestone plan and final user review.

## 1. Task recapture

### Task
Redesign the THROHI rebuild into a complete corporate and catalogue experience using the existing real catalogue, inquiry workflow, brand assets, cinematic instrument video, and scissors-evolution sequence.

### Goal
Create a website that presents THROHI as a credible Sialkot medical-instrument company, lets buyers discover products quickly, and turns product interest into one precise, non-commerce inquiry.

### Context
The rebuild branch already contains a working Next.js application, searchable catalogue, high-resolution product media, product-family routes, variant data, Inquiry List, responsive navigation, accessibility foundations, review tooling, and non-indexed staging routes. The redesign must improve the experience without discarding those working foundations.

### Assumptions
- The current structured Surgical and Dental/Orthodontic data remains the only catalogue content treated as publishable during design work.
- Veterinary and Beauty remain visible as real THROHI divisions but do not receive invented product records.
- The temporary raster logo remains replaceable and must not dictate permanent layout proportions.
- The cinematic MP4 and 260-frame scissors sequence are mandatory brand assets.
- Client-unverified claims remain absent from public-facing copy.
- The public site is not replaced until the rebuild passes design, functional, accessibility, performance, and content review.

### Definition of done for the complete redesign
- The homepage clearly identifies THROHI, its location, its four divisions, and the primary catalogue/inquiry actions.
- Catalogue discovery is fast for both known-code and exploratory users.
- Every route has one clear responsibility and contains no filler sections.
- The cinematic entry and scissors sequence are integrated without obstructing browsing.
- Desktop, tablet, mobile, keyboard, reduced-motion, slow-network, and missing-data states remain useful.
- No fake facts, certifications, metrics, testimonials, customers, export markets, materials, or manufacturing claims appear.
- The result feels corporate, precise, authored, and specific to surgical instruments rather than template-generated.

## 2. Approved decisions

The following choices were made during the design dialogue and are binding for this specification:

1. **First implementation milestone:** homepage and shared shell.
2. **Audience emphasis:** balanced entry for procurement buyers/importers and distributors/business partners.
3. **First real screen after the cinematic cover:** company-led rather than product-led.
4. **Emotional target:** balanced industrial authority and international precision.
5. **Location treatment:** Sialkot, Pakistan appears clearly in supporting hero copy, not as the main headline.
6. **Hero headline:** large `THROHI Medical Tools` identity followed by a precise explanatory sentence.
7. **Hero visual:** one signature real surgical scissors composition.
8. **Hero layout:** clean split composition, not a crowded collage and not a generic equal 50/50 template.
9. **Visual territory:** `Surgical Precision Archive`, an evolution of the approved `Surgical Contrast` direction.
10. **Motion allocation:** one cinematic opening and one scissors-evolution signature experience; repeated buying tasks remain calm.

## 3. Source-of-truth order

When instructions or assets conflict, use this order:

1. Latest explicit user instruction.
2. This approved specification.
3. `PROJECT_STATE.md` and `DECISIONS.md`.
4. Verified catalogue data and real supplied media.
5. Existing working rebuild behavior.
6. Project quality directives and accessibility rules.
7. External component libraries as implementation references only.

A visually attractive reference never overrides factual accuracy, working behavior, accessibility, performance, or the approved brand direction.

## 4. Core business and user problem

The website must solve two connected problems.

### Business problem
THROHI needs to look like a serious medical-instrument company rather than an anonymous catalogue dump, experimental design studio, generic SaaS landing page, or small local brochure site.

### User problem
Visitors need to determine quickly:

- whether THROHI supplies the relevant instrument division;
- whether a known product code or instrument family exists;
- which variants belong to a product family;
- how to collect several products, quantities, and notes into one request;
- how to contact THROHI when an item is unlisted or requires clarification.

The homepage must therefore build enough company credibility to justify continued exploration while preserving immediate access to catalogue search.

## 5. Primary audiences and jobs

### 5.1 Procurement buyers and importers

**Typical arrival state**
- Possess a product code, reference image, list, or instrument name.
- Need quantities, variants, notes, and supplier contact in one workflow.

**Primary jobs**
- Search exact code.
- Browse related families.
- inspect available variants.
- Add products to Inquiry List.
- Submit or continue through WhatsApp.

**Experience requirement**
The path from homepage to a known product must be extremely short. Corporate storytelling cannot hide search.

### 5.2 Distributors and business partners

**Typical arrival state**
- Evaluating whether THROHI appears credible and relevant.
- May not know exact product codes.

**Primary jobs**
- Understand the company and its origin.
- Review divisions and representative instrument families.
- Access catalogue documents.
- Contact THROHI with a broader request.

**Experience requirement**
The company identity, Sialkot origin, product range, and communication routes must be evident before requiring deep browsing.

### 5.3 Clinical professionals and technical browsers

They are supported but do not determine the primary hierarchy. They benefit from product names, images, families, variants, and direct inquiry, but the site must not invent clinical-use claims or advice.

## 6. Core journeys

### Journey A — known product code
1. Cinematic cover is skipped, completes, or uses reduced-motion fallback.
2. Visitor reaches the company-led hero.
3. Visitor uses the immediately visible product search.
4. Exact-code result is prioritized.
5. Visitor opens the product-family page.
6. Visitor selects family or variant and adds quantity/notes.
7. Visitor reviews Inquiry List and submits or continues through WhatsApp.

### Journey B — exploratory catalogue buyer
1. Visitor understands THROHI and its four divisions.
2. Visitor opens Surgical or Dental/Orthodontic division.
3. Visitor filters or browses product families.
4. Visitor examines a family and related products.
5. Visitor builds an Inquiry List.

### Journey C — distributor or partner evaluation
1. Visitor sees company identity and Sialkot origin.
2. Visitor reviews divisions and selected real product families.
3. Visitor sees concise verified company information.
4. Visitor experiences the scissors narrative as a brand-quality signal.
5. Visitor accesses catalogues or contacts THROHI.

### Journey D — unlisted instrument
1. Visitor searches and receives a useful no-results state.
2. State offers spelling/code guidance and a direct unlisted-instrument path.
3. Visitor enters a reference, quantity, and note in Inquiry List or Contact.
4. Visitor submits one structured request.

## 7. Design concept: Surgical Precision Archive

The visual language combines three qualities:

1. **Industrial authority** — deep navy, charcoal, controlled mass, firm typography, and stable composition.
2. **Instrument precision** — steel surfaces, fine rules, exact alignment, catalogue codes, and disciplined spacing.
3. **Corporate clarity** — high-readability light surfaces, restrained interaction, truthful copy, and predictable buyer workflows.

The archive idea does not mean old-fashioned paper imitation. It means products are treated as carefully indexed professional objects: identifiable, searchable, comparable, and connected to a real inquiry workflow.

### What makes the direction recognizably THROHI
- Real surgical and dental instruments dominate imagery.
- Blue and green reflect the supplied identity without becoming neon.
- Product codes and family data appear as useful technical information.
- Scissors form the signature visual thread across cinematic entry, hero, and evolution experience.
- Sialkot is present as origin, not used as decorative nationalism or an unsupported quality claim.

### Explicitly rejected appearance
- Cyberpunk or gaming interface.
- Creative-agency portfolio language.
- Generic dark SaaS presentation.
- Glass panels, glowing orbs, particles, random grids, and excessive blur.
- A collage of copied component-library effects.
- Identical rounded cards wrapping ordinary paragraphs.
- Huge type that prevents the company and product purpose from being understood.
- Fake dashboards, metrics, badges, testimonials, and customer logos.

## 8. Visual system

### 8.1 Color roles

The implementation may tune exact values during browser review, but role relationships are fixed.

- `--throhi-ink-950`: near-black blue for cinematic and strongest text.
- `--throhi-navy-900`: primary corporate dark surface.
- `--throhi-navy-800`: raised dark navigation/search surface.
- `--throhi-steel-100`: primary light steel-blue surface.
- `--throhi-paper-50`: high-readability catalogue and form background.
- `--throhi-line`: low-contrast structural border.
- `--throhi-green-600`: primary action and confirmed active state.
- `--throhi-green-300`: dark-surface action highlight.
- `--throhi-blue-600`: restrained supporting accent.
- `--throhi-red-600`: errors and destructive warnings only.
- `--throhi-muted`: supporting text that still passes contrast requirements.

Green must identify meaningful action or success. Blue supports identity and hierarchy. Red is not decorative.

### 8.2 Typography

- **Instrument Sans:** display identity, major page headings, editorial statements.
- **Archivo:** navigation, body text, forms, buttons, product names, instructional copy.
- **IBM Plex Mono:** catalogue codes, quantities, counts, technical labels, and compact status data.

Rules:
- Large identity typography must not become unreadable display spectacle.
- Body line length should normally remain between 45 and 75 characters.
- Uppercase tracking is reserved for short technical data, not paragraphs.
- One strong heading is preferred over eyebrow + heading + subheading + repeated explanation.

### 8.3 Grid and spacing

- Maximum content width: approximately 1400px for editorial/hero composition.
- Reading and form widths are narrower according to content.
- Desktop uses a 12-column conceptual grid.
- Tablet reorganizes content around 6–8 effective columns.
- Mobile uses one deliberate flow with occasional two-column utility rows where touch targets remain safe.
- Outer gutters scale with viewport using `clamp()` rather than abrupt jumps.
- Section spacing reflects content importance; not every section receives the same vertical padding.

### 8.4 Shape and materiality

- Moderate radii, generally 4–10px.
- Fine borders and surface changes establish grouping before boxes are introduced.
- Product cards are legitimate because they represent discrete catalogue entities.
- Company copy and explanatory text remain open-layout by default.
- Shadows are soft and rare; dark/light contrast and image layering provide depth.

### 8.5 Imagery

- Use real supplied product media.
- Prefer one clear instrument over several competing objects.
- Preserve accurate silhouettes and avoid fake vector replacements.
- Product imagery uses transparent or controlled neutral backgrounds.
- Hero scissors receive careful crop, scale, and steel-light grading without altering product identity.
- Missing-image states remain credible and do not substitute invented product imagery.

## 9. Global shell

### 9.1 Header responsibilities

The header must provide:
- THROHI identity and home route.
- Products navigation.
- Company route.
- Catalogues route when implemented.
- Contact route.
- Global search.
- Persistent Inquiry List count.
- WhatsApp utility when the final contact is verified.

The header is corporate and calm. It does not imitate a game HUD or hide basic navigation behind effects.

### 9.2 Desktop behavior

- Header overlays only the cinematic/hero area when contrast remains reliable; it transitions to a stable surface for content browsing.
- Products opens a controlled mega-panel containing four divisions, Browse All Products, and Search by Name or Code.
- Only structured divisions are directly browsable; pending divisions are clearly described without appearing broken.
- Search opens a focused search surface and returns focus correctly when closed.
- Inquiry List count updates from the existing provider.

### 9.3 Mobile behavior

- One clear Menu control and persistent Inquiry List access.
- Search appears near the top of the mobile panel.
- Navigation is a full-height accessible dialog with body scroll lock, focus trap, Escape support, and focus restoration.
- Divisions and company routes are grouped by meaning, not merely stacked desktop links.
- Important actions remain at least 44px in target size.

### 9.4 Footer responsibilities

The footer contains only useful information:
- THROHI identity.
- Concise company descriptor.
- Product, company, catalogue, inquiry, and contact routes that actually exist.
- Verified contact methods.
- Development/no-index status only while the rebuild remains a private preview.
- Legal links only after real pages exist.

The footer must not become a large generic sitemap or repeat the homepage pitch.

## 10. Master homepage architecture

### 10.1 Cinematic cover

**Question answered:** What is the brand’s immediate emotional identity?

- Reuse the supplied instrument MP4.
- Full-viewport dark presentation.
- THROHI identity remains visible but restrained.
- Provide Skip control.
- Video is muted, inline, and non-blocking.
- On completion, a clear scroll/continue cue appears.
- Scrolling slides the cover upward like a protective lid, revealing the real site below.
- Returning users may receive a shorter or already-cleared state if the existing implementation supports it without adding tracking complexity.
- Reduced-motion users receive a static poster/identity state and immediate content access.
- Failure state reveals the real homepage rather than leaving a blank cover.

### 10.2 Company-led hero

**Question answered:** Who is THROHI and what does it provide?

Composition:
- Large `THROHI Medical Tools` identity on the left.
- One precise sentence identifying the company, instrument ranges, and Sialkot base.
- One signature real surgical scissors composition on the right.
- Primary action: `Browse instruments`.
- Secondary action: `Build an inquiry`.
- Product search visible within the first screen or attached to its lower boundary.

The layout is asymmetrical and editorial, not a generic equal split. The scissors may approach the central grid but must not cross or reduce headline readability.

The hero does not display internal review language such as `source-derived`, `technical claims pending`, or `evidence boundary` as promotional content. Development status belongs in preview-only utility copy.

### 10.3 Immediate catalogue lookup

**Question answered:** Can I find a specific instrument quickly?

- Search by exact code, compact code, family name, or instrument name.
- Use a visible label, not placeholder-only identification.
- Show a realistic example such as `04-0101 or operating scissors`.
- Submit to the existing products route with URL-backed query.
- Explain search scope in one short supporting line.
- On mobile, search remains early and full-width.

### 10.4 Division index

**Question answered:** Which instrument ranges does THROHI cover?

Show all four real divisions:
- Surgical Instruments.
- Dental and Orthodontic Instruments.
- Veterinary Instruments.
- Beauty Instruments.

Presentation:
- Large editorial rows or bands, not four identical marketing cards.
- Surgical and Dental rows use representative real product media and indexed-family information.
- Veterinary and Beauty are visible as company divisions but communicate that detailed catalogue records are not yet published.
- Pending divisions may lead to Contact or an overview only after those routes are meaningful; they must not create broken catalogue pages.

### 10.5 Selected instrument families

**Question answered:** What does the real catalogue contain?

- Use a small, curated group of real families.
- Each item shows product code, name, division, image, family, and meaningful variant count.
- Entire card is a product link with a separate accessible Add to Inquiry action only if interaction conflicts are handled correctly.
- Do not create a carousel that auto-scrolls.
- Selection should demonstrate range, not claim popularity or recommendation without evidence.

### 10.6 Verified company introduction

**Question answered:** What can I trust about this company?

Public-safe information:
- THROHI Medical Tools.
- Sialkot, Pakistan.
- Surgical, Dental/Orthodontic, Veterinary, and Beauty instrument ranges.
- Available catalogue and inquiry functions.

Do not publish unverified founding year, certifications, steel grades, capacity, export markets, OEM services, minimum orders, lead times, or manufacturing claims.

The section uses concise open-layout copy and a route to Company when that page exists. It does not use decorative mission/vision cards.

### 10.7 Scissors through time preview

**Question answered:** What gives the brand a memorable instrument-specific narrative?

- Reuse the supplied 260-frame scissors sequence.
- Present a compact homepage chapter rather than duplicating the eventual complete Company-page experience.
- Scroll progression must remain controllable, performant, and reversible.
- Copy describes instrument evolution carefully and does not imply unverified THROHI corporate history.
- A future Company-page link is added only when the destination exists.
- Mobile uses the prepared mobile sprite and shorter copy.
- Reduced motion displays a representative frame and complete readable explanation.

### 10.8 Catalogue and inquiry utilities

**Question answered:** What practical resources can I use next?

Combine only genuine utilities:
- Browse digital catalogue.
- Download real catalogue documents when files exist.
- Review Inquiry List.
- Request an unlisted instrument.

This may use a structured list or two-column utility layout. It must not become a generic three-feature grid.

### 10.9 Contact

**Question answered:** How can I contact THROHI now?

- Compact form with only necessary fields.
- Email, phone, WhatsApp, and location only after formatting is verified.
- Inquiry List remains the preferred multi-product route.
- General Contact handles company, catalogue, and unlisted-product questions.
- Successful submission provides a clear confirmation and next expectation only when the backend behavior supports it.

No oversized final slogan is added merely to end the page.

## 11. Internal page system

The homepage establishes tokens, shell, components, and motion vocabulary. Internal pages inherit the system but adapt density to their task.

### Products
Purpose: search, filter, sort, and discover product families.

### Division
Purpose: explain one real division and expose validated categories/families.

### Product detail
Purpose: identify a product family, show imagery and variants, and support inquiry selection.

### Inquiry List
Purpose: edit products, variants, quantities, references, notes, and contact information before one structured submission.

### Company
Purpose: present verified company information and the complete scissors-evolution experience.

### Catalogues
Purpose: provide real downloadable documents with truthful file metadata.

### Contact
Purpose: direct communication and compact general inquiry.

### Search and recovery routes
Purpose: help users recover from no results, missing products, invalid routes, failed requests, or missing media.

No separate Mission, Vision, Why Choose Us, Process, or Our Story pages are created unless unique verified content later justifies them.

## 12. Component architecture

The homepage must not remain one oversized page component. Recommended boundaries:

- `RebuildShell`: global header/footer and shared page frame only.
- `RebuildHeader`: navigation state, search panel, products panel, mobile dialog.
- `RebuildFooter`: truthful routes and verified contact/status.
- `CinematicEntry`: media playback, skip/failure/reduced-motion, slide-away state.
- `HomeHero`: company identity, hero copy, signature scissors, primary actions.
- `HomeCatalogueSearch`: server-compatible search form.
- `HomeDivisionIndex`: division records and pending-state behavior.
- `HomeSelectedFamilies`: curated real product families.
- `HomeCompanyIntro`: verified company copy.
- `HomeEvolutionPreview`: limited scissors-sequence presentation.
- `HomeUtilities`: catalogue/inquiry/unlisted-item actions.
- `HomeContact`: contact methods and compact form when backend is ready.

Content constants that express business meaning should be typed and separated from visual components. Catalogue data continues to come from the existing runtime catalogue rather than duplicated hardcoded records.

## 13. Motion system

### Major motion 1 — cinematic reveal
- Purpose: establish brand identity and transition into the real site.
- Trigger: initial visit/playback completion and user scroll.
- Behavior: controlled cover movement using transform/opacity, interruptible by Skip.
- Reduced motion: static identity, immediate reveal.
- Failure: content remains accessible.

### Major motion 2 — scissors sequence
- Purpose: instrument-specific storytelling.
- Trigger: section scroll progress.
- Behavior: frame interpolation/easing with existing desktop/mobile sprites.
- Reduced motion: single representative frame and complete copy.
- Failure: fallback image and text.

### Supporting motion
Allowed for:
- Header state transitions.
- Search and mobile navigation panels.
- Filter and Inquiry List feedback.
- Product image changes.
- Subtle steel-light response on the hero instrument.

Not allowed:
- Universal fade-up entrances.
- Cursor trails.
- Constant tilt.
- Moving buttons.
- Auto-scrolling product rails.
- Multiple parallax layers.
- Animation that delays search, product access, or form use.

## 14. Responsive behavior

### Large desktop
- Company identity and scissors coexist in one controlled hero composition.
- Search remains visible without requiring a full additional viewport.
- Division rows use image scale and horizontal rhythm.

### Standard laptop
- Headline and image scale down fluidly.
- Hero retains a clear reading column.
- No product image may cover navigation or primary actions.

### Tablet
- Hero may use a 5/7 or 6/6 effective split depending on instrument crop.
- Division rows become simpler and maintain touch behavior.
- Navigation transitions to mobile behavior before labels become cramped.

### Mobile
Order:
1. company identity;
2. concise explanation and actions;
3. signature scissors;
4. catalogue search;
5. divisions;
6. selected products;
7. company/evolution/utilities/contact.

Heavy decorative layers are removed. The cinematic cover and evolution sequence use mobile-optimized media. Search, Inquiry List, and contact remain easy to reach with one hand.

### High zoom and narrow widths
- No horizontal page scrolling.
- Header utilities remain operable.
- Long product names wrap without hiding code or actions.
- Buttons and form fields retain usable target sizes.

## 15. Accessibility requirements

Target WCAG 2.2 AA.

- Semantic landmarks and logical heading order.
- One `h1` on the homepage.
- Visible skip link.
- Real links and buttons.
- Search labels remain programmatically and visually clear.
- Products panel and mobile dialog expose correct state.
- Focus trap and restoration remain intact.
- Escape closes overlays.
- Focus-visible styles meet contrast requirements.
- Status changes from Inquiry List use appropriate live announcements.
- Motion can be skipped or reduced.
- Video does not autoplay with sound.
- Meaningful instrument images receive concise alt text; decorative crops receive empty alt text.
- Color never carries catalogue state alone.
- Form errors identify field and correction.

## 16. Functional states

### Cinematic entry
- loading;
- playable;
- ended/ready to reveal;
- skipped;
- reduced motion;
- failed media.

### Search
- idle;
- focused;
- submitted;
- query retained in URL;
- no results;
- invalid/empty query guidance.

### Division
- structured catalogue;
- pending source;
- unavailable media.

### Product family
- available image;
- fallback image;
- variants available;
- no validated variants;
- already in Inquiry List;
- add/update success.

### Inquiry
- empty;
- populated;
- validation error;
- submission pending;
- submission success;
- submission failure;
- WhatsApp continuation.

### Contact
- idle;
- validation error;
- sending;
- success;
- failure;
- unavailable backend with honest alternative contact.

## 17. Content rules

- Start with useful information.
- Prefer concrete nouns and actions over promotional adjectives.
- Do not repeat the same claim in label, heading, paragraph, cards, and CTA.
- Avoid automatic eyebrow labels above every section.
- Use `Browse instruments`, `Find product`, `Add to Inquiry List`, `Review Inquiry List`, and `Contact THROHI` rather than vague `Explore` or `Learn more` when a specific action exists.
- Internal catalogue-review boundaries may appear in preview-only status areas but not as the customer-facing brand message.
- Pending facts remain omitted, not disguised with polished placeholder copy.

## 18. Performance requirements

- Preserve optimized MP4 and sprite preparation pipeline.
- Do not add another animation or 3D library for effects that CSS and the existing Anime.js dependency can handle.
- Hero imagery uses Next Image or the existing catalogue media abstraction with stable dimensions.
- Lazy-load below-the-fold product and evolution media.
- Preload only the hero-critical asset and required fonts.
- Prevent layout shifts from logo, video, instrument imagery, and search controls.
- Use transform and opacity for major motion.
- Keep catalogue and inquiry pages free of homepage-only animation cost.
- Test production build, not only development mode.

## 19. Testing strategy

### Automated
- Existing Node tests remain passing.
- TypeScript and ESLint pass.
- Production build passes.
- Playwright desktop and mobile journeys cover homepage, search, navigation, product selection, and Inquiry List.
- Axe checks run on stable homepage and overlay states.

### Manual
- Desktop: 1440×1000 and at least one wider viewport.
- Laptop: approximately 1280×800.
- Tablet portrait and landscape.
- Mobile: 390×844 and a narrow 320–360px width.
- Keyboard-only navigation.
- 200% zoom.
- Reduced motion.
- Slow network/media failure.
- Missing product image.
- Long product names and populated Inquiry List.

### Visual review
- First pass: art direction, hierarchy, brand recognition, spacing, image crop, copy density.
- Second pass: responsive behavior, action priority, interaction states, and consistency with internal pages.

## 20. Delivery decomposition

The complete redesign is divided into independent, reviewable subprojects.

### Milestone 1 — homepage and shared shell
- tokens;
- header and footer;
- cinematic cover;
- company-led hero;
- search;
- division index;
- selected products;
- verified company introduction;
- scissors preview;
- utilities/contact structure;
- responsive/accessibility tests.

### Milestone 2 — catalogue discovery
- catalogue page hierarchy;
- filter behavior;
- search results and no-results recovery;
- product-card system;
- mobile filtering;
- performance and accessibility.

### Milestone 3 — product examination
- image presentation;
- family/variant hierarchy;
- Inquiry List action model;
- related products;
- missing-data states.

### Milestone 4 — Inquiry List and submission
- quantities, notes, variants, unlisted references;
- contact fields;
- validation;
- backend delivery/storage after approval;
- success/failure recovery.

### Milestone 5 — company, catalogues, contact, legal, and recovery pages
- complete scissors experience;
- verified company content;
- real catalogue documents;
- contact workflow;
- 404/error/legal content.

### Milestone 6 — production audit and cutover
- content validation;
- accessibility;
- performance;
- security;
- metadata/robots/sitemap;
- deployment and rollback.

## 21. Risks and mitigations

### Risk: visually impressive homepage harms buyer speed
Mitigation: search and Inquiry List remain immediately accessible; motion is limited to two signature moments.

### Risk: unverified company content creates false credibility
Mitigation: public-safe content boundary is enforced in typed content and review checklist.

### Risk: temporary logo distorts final layout
Mitigation: logo container uses replaceable dimensions and does not rely on the temporary raster’s whitespace.

### Risk: hero image becomes another crowded collage
Mitigation: one signature scissors asset only; secondary details are subtle crops, not additional competing products.

### Risk: component-library collage
Mitigation: external components are accepted only for behavior, then rebuilt into the shared tokens and motion vocabulary.

### Risk: two heavy media experiences damage mobile performance
Mitigation: optimized MP4, mobile sprite, lazy loading, reduced-motion fallback, and staged asset loading.

### Risk: redesign breaks working catalogue/inquiry logic
Mitigation: functional data and provider interfaces remain unchanged unless a specific tested improvement is approved.

## 22. Approval criteria

This specification is approved for implementation when the user confirms that:

- `Surgical Precision Archive` is the intended visual and UX direction;
- the company-led, clean-split hero is correct;
- the homepage and shared shell remain the first milestone;
- the two existing media experiences remain mandatory;
- internal pages will inherit the system in later milestones rather than being redesigned in the same uncontrolled pass.

Implementation must then follow the separate Milestone 1 plan and its verification gates.