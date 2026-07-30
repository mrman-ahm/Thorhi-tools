# THROHI Product Examination & Inquiry Desk — Design Specification

## Status

Approved for implementation by the user’s instruction to proceed with design quality as the primary preference. This milestone remains isolated on `design/surgical-precision-archive`; no merge, pull request, deployment, or public cutover is authorized.

## Goal

Redesign the product-detail and Inquiry List routes into one coherent procurement workflow that feels precise, premium, and instrument-led while preserving all existing catalogue, return-context, variant, inquiry, validation, storage, and submission behavior.

## Design direction

**Instrument Examination Desk**

The product page behaves like a controlled examination surface rather than an ecommerce product page. The Inquiry List behaves like a buyer’s procurement desk rather than a checkout.

Visual priorities:

- real instrument imagery receives the largest visual area;
- catalogue code, family, division, source status, and variant identity remain immediately scannable;
- inquiry actions are visually strong but never resemble purchasing or payment;
- dark navy, steel, surgical green, restrained blue, paper white, and precise rule lines continue the Surgical Precision Archive system;
- spacing, typography, image staging, and responsive composition receive priority over decorative effects;
- no generic rounded cards, fake specifications, pricing, stock, ratings, testimonials, or unsupported claims.

## Product-detail architecture

### 1. Return and identity rail

A compact top rail preserves the exact catalogue return URL, family context, and product code. It remains keyboard accessible and mobile-safe.

### 2. Examination stage

Desktop uses an asymmetric two-column composition:

- left: large light examination field with real product media, technical framing lines, source label, and catalogue code;
- right: dark procurement identity rail with division, family, name, code, truth-boundary copy, primary inquiry action, and structured source ledger.

The instrument image must remain visually dominant. Hover movement is limited to a subtle media scale or steel-line response. Reduced motion disables it.

### 3. Inquiry action behavior

The primary action shows current list state and quantity. The secondary action opens the Inquiry List. No commerce language is introduced.

### 4. Variant ledger

Variants appear as a structured ledger rather than generic rows. Each row includes:

- sequence number;
- variant code;
- source reference status;
- independent Add Variant action;
- selected quantity feedback.

Mobile rows become stacked records without losing code/action association.

### 5. Related-family comparison

Related instruments remain real same-family products. Their presentation is compact and comparison-oriented, preserving the original catalogue return context.

## Inquiry List architecture

### 1. Procurement masthead

A dark masthead identifies the route as a structured product inquiry, explicitly stating that it is not an order or payment flow. A four-stage ledger shows Products, Requirements, Buyer Details, and Review.

### 2. Product ledger

Selected items display as procurement records with:

- product name and selected/base code;
- quantity control;
- item note;
- remove action;
- clear separation between product identity and editable fields.

Empty state prioritizes Browse Products and Add Unlisted Instrument.

### 3. Requirements and attachment

Requirements remain a separate editorial section. Attachment limitations and development metadata-only behavior remain explicit.

### 4. Buyer details

Buyer inputs use a disciplined two-column form on desktop and one column on mobile. Validation, consent, and preferred contact behavior remain unchanged.

### 5. Sticky review desk

Desktop uses a sticky dark summary rail with line count, quantity, notes, attachment state, submission status, and the single submit action. Mobile moves the review desk below the form and keeps the submit action full width.

## Responsive behavior

- 1280–1440px: full asymmetric product examination and sticky inquiry review desk.
- 768–1024px: stacked product examination with preserved visual hierarchy; inquiry review becomes non-sticky.
- 390px and 320px: single-column records, large touch targets, no horizontal overflow, no truncated product codes, and no hidden validation messages.

## Motion

Allowed:

- subtle image-stage scale on hover/focus;
- restrained line and button state transitions;
- immediate quantity/action feedback.

Disallowed:

- entrance cascades across repeated records;
- parallax, cursor effects, 3D tilt, auto-scrolling, or fixed overlays;
- motion that delays reading, variant selection, or submission.

Reduced-motion mode removes nonessential transforms and transitions.

## Accessibility

- semantic headings and labelled sections;
- visible keyboard focus;
- live-region feedback for inquiry changes;
- adequate contrast for every state;
- no focus trap outside existing navigation/dialog behavior;
- error messages remain associated with the relevant controls;
- disabled submission remains understandable and visually distinct.

## Preserved behavior

- safe catalogue return path;
- same-family related-product filtering;
- base and variant inquiry identities;
- quantity persistence and local migration;
- manual/unlisted items;
- attachment validation;
- client and server validation;
- one-time submission token;
- success route and development-storage truth boundary.

## Critical verification

A milestone is blocked only by:

- TypeScript/build failure;
- broken return context, product routes, variant identity, inquiry persistence, validation, submission, or success routing;
- serious accessibility violations;
- desktop/mobile overflow or unusable controls;
- missing real product imagery or incorrect inquiry state.

Nonblocking legacy lint warnings and unrelated deprecated styling are deferred.

## Non-goals

- durable backend delivery or file storage;
- verified WhatsApp integration;
- new technical specifications;
- product comparison engine;
- catalogue-data approval work;
- public deployment or cutover.
