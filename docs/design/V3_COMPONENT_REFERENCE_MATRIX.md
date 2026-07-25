# THROHI V3 — Component Reference Matrix

This file records whether each supplied reference is used, adapted, or rejected. External snippets are research material, not automatic dependencies. Any reused code must be license-checked, rewritten into THROHI primitives, and tested for semantics, keyboard behavior, focus, reduced motion, mobile layout, and runtime cost.

| Reference | Decision | Intended use | Required adaptation | Main concern |
|---|---|---|---|---|
| Animate UI Radix Accordion | Adapt | Resources, technical disclosures, concise FAQs | Preserve semantic disclosure behavior; restyle as quiet optical rows; remove springy overshoot | Avoid animated height instability and excessive nesting |
| Animate UI Liquid Button | Adapt sparingly | One primary action in a major scene | Convert playful liquid fill into restrained surgical-green optical pressure; keep clear focus/active states | Must not obscure labels or become a site-wide gimmick |
| Animate UI Flip Button | Adapt sparingly | Non-critical secondary links such as family navigation | Small directional face change; no full dramatic flip; static reduced-motion state | Never use for submit, delete, quantity, consent, or error recovery |
| Animate UI Theme Toggler | Reject | None | THROHI uses authored dark/pale chapters rather than a user-facing theme trick | Unnecessary global state and inconsistent art direction |
| Animate UI Radial Intro | Concept only | Optional one-time instrument-family assembly | Rebuild in Anime.js; run once; settle completely; omit on constrained devices | Continuous orbiting would feel decorative and expensive |
| Aceternity 3D Globe | Reject | None | No replacement | Adds 3D cost and may imply unsupported geographic reach |
| Aceternity Lamp Effect | Adapt once | Final major catalogue/inquiry call to action | Reinterpret as controlled surgical examination light; reduce bloom; retain text contrast | Excessive glow can overpower the footer and harm readability |
| Aceternity GitHub Globe | Reject | None | No replacement | Developer-oriented and irrelevant to medical procurement |
| Uiverse `gharsh11032000/loud-chicken-53` | Study | Surface and control construction | Extract only useful depth/border behavior into THROHI primitives | Do not paste its visual identity directly |
| Uiverse `liyaxu123/warm-eel-62` | Study/adapt | Search/input behavior | Merge useful field behavior into one unified `MachinedField` | Multiple unrelated input styles would fragment the system |
| Uiverse `kamehame-ha/chilly-snake-91` | Study | Catalogue object edge treatment | Retain only layered border/hover-light ideas | Avoid novelty card appearance |
| Cult UI Canvas Fractal Grid | Adapt once, optional | Subtle background field near catalogue command or optical hero | Lazy load; low contrast; DPR cap; pause offscreen; disable for Save-Data, reduced motion, coarse pointers, and constrained devices | Canvas cannot run continuously across the whole site |
| Cult UI Text Animate | Concept only | Calm group entrances | Recreate masking/fade/shift with the existing Anime.js dependency | Do not install Framer Motion; reject pop, whip, roll, and novelty word effects |
| Uiverse `joe-watson-sbf/rude-shrimp-21` | Study | Inset and elevation cues | Translate into `OpticalPanel` or `CatalogueObject` tokens | Avoid component-showcase styling |
| Uiverse `Smit-Prajapati/spicy-rat-83` | Adapt concept | One decorative THROHI abbreviation slab | Use a secondary `T` or `TH` object while preserving the official logo | Must not replace the actual THROHI identity |
| Uiverse `Smit-Prajapati/massive-insect-5` | Study | Layered card construction | Extract structural depth only | Do not repeat monogram/card effects throughout pages |
| Uiverse `Lakshay-art/curvy-earwig-22` | Study/adapt | Catalogue command input | Merge useful focus/field behavior into the unified search system | Must preserve labels, semantics, and contrast |
| Uiverse `Tiagoadag/cuddly-catfish-6` | Study | Panel/card depth | Translate into shallow machined surface tokens | Avoid soft claymorphism |
| FreeFrontend CSS Neon Effects | Microscopic adaptation only | Focus edge, active search result, tiny status light | Use narrow green/blue edge light, never full neon typography or global glow | Neon can quickly make the site look cyberpunk |
| Cult UI 3D Carousel | Reject as implementation | None as actual 3D | A flat DOM-based layered archive may borrow its composition idea | 3D transforms, accessibility, and performance risk |
| Uiverse `satyamchaudharydev/splendid-husky-54` | Adapt | Compact inline loading state | Restrict to search, catalogue loading, or inquiry submission | Never use as a decorative full-screen blocker |
| Uiverse `PriyanshuGupta28/tender-fish-11` | Adapt | Quantity control | Build semantic number input with visible label, typed entry, plus/minus, minimum validation, disabled states, and 44px targets | Must work without pointer input and without placeholder-only labeling |
| Uiverse `mrhyddenn/fluffy-bird-66` | Study/adapt | Input-link or attachment field | Merge useful interaction into `MachinedField`; preserve native input behavior | Avoid hidden labels and animation while typing |
| Uiverse `alexruix/slippery-snail-18` | Study/adapt | Input-link field | Consolidate into the same THROHI field system | Do not introduce a second visibly unrelated input language |
| Kokonut UI Avatar Picker | Reject | None | No replacement | User avatars are not part of the procurement journey |
| CodePen `soju22/qEbdVjK` tubes cursor | Reject | None | Preserve native cursor | WebGL/WebGPU cost, accessibility risk, and constant GPU use |
| Uiverse `andrew-demchenk0/lucky-bobcat-25` | Reject by default | None | Reconsider only if a narrow utility control is discovered during audit | Portfolio-oriented effect is not inherently relevant |
| Uiverse `vinodjangid07/wonderful-yak-52` | Reject by default | None | Reconsider only for a justified secondary control | Portfolio-oriented effect can distract from product content |

## Approved V3 extraction principles

The references may contribute only these underlying ideas:

- optical edge lighting
- shallow inset and raised states
- layered border construction
- controlled reveal masking
- compact information hierarchy
- tactile quantity controls
- semantic disclosure motion
- one restrained liquid primary action
- one surgical-light closing composition

They must be translated into a small coherent set:

- `OpticalPanel`
- `SmokedGlassPanel`
- `ClinicalGlassPanel`
- `MachinedField`
- `CatalogueObject`
- `SurgicalButton`
- `LiquidPrimaryAction`
- `InquiryQuantityControl`
- `TechnicalAccordion`

## Explicitly prohibited additions

- 3D globe
- GitHub globe
- WebGL/WebGPU cursor
- production 3D carousel
- global theme toggler
- avatar system
- additional motion engine
- full-site neon treatment
- repeated liquid buttons
- random card styles copied per section
- hidden or placeholder-only form labels
- hover-only functionality

## Source-attribution rule

Before materially copying any source implementation:

1. verify its license;
2. record the original URL and author in the final source-attribution document;
3. rewrite it to use THROHI tokens and semantics;
4. remove unused dependencies and styling;
5. add keyboard, focus, reduced-motion, and responsive tests;
6. reject it when the same outcome can be achieved more safely with existing React, CSS, and Anime.js infrastructure.
