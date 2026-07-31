# THROHI Full-Site Precision Heritage Redesign

## Purpose

Replace the current layered `/rebuild` visual system with one coherent premium medical-manufacturer experience while preserving all verified catalogue, inquiry, accessibility, and backend behavior.

This is a full redesign, not another refinement layer.

## Approved direction

**Precision Heritage House**

A restrained European instrument-manufacturer aesthetic combining:

- regal editorial typography;
- surgical navy and ink;
- warm archival paper and ivory;
- muted brass used only for rules and indexing;
- large real instrument imagery;
- precise procurement layouts;
- generous whitespace with dense technical detail only where it helps comparison or inquiry.

The result must feel established, trustworthy, and technically serious without pretending the company has unverified history, certifications, export markets, or manufacturing claims.

## Rejected directions

- generic SaaS cards and dashboards;
- fake luxury black-and-gold styling;
- cyberpunk, gaming, glassmorphism, or agency-showcase effects;
- filler slogans, decorative labels, and empty sections;
- oversized headings that push useful information below the fold;
- tiny important text;
- ecommerce, cart, checkout, pricing, or payment framing;
- invented company claims or technical specifications.

## Information architecture

Existing routes remain:

- `/rebuild`
- `/rebuild/products`
- `/rebuild/products/[productId]`
- `/rebuild/inquiry`
- `/rebuild/inquiry/success`
- `/rebuild/company`
- `/rebuild/company/scissors-through-time`
- `/rebuild/catalogues`
- `/rebuild/contact`
- `/rebuild/privacy`
- `/rebuild/terms`
- rebuild-specific loading, error, and not-found states

No public cutover, deployment, indexing, or route removal is part of this redesign.

## Global composition

### Shell

- Desktop header: 78px, fixed, calm, mostly ivory with ink typography.
- Logo/wordmark at the left with enough breathing room for the supplied mark.
- Primary navigation centered or visually balanced, not cramped beside utilities.
- Catalogue search and Inquiry List are clear utilities, not oversized promotional buttons.
- Mobile navigation becomes a full-screen editorial index with readable links and a persistent Inquiry List count.
- Footer becomes a dark closing dossier with company identity, route index, verified Sialkot origin, and legal links.

### Grid

- Main content width: approximately 1440px maximum.
- Editorial reading width: approximately 720px.
- Page gutters use fluid clamp values and never fall below 16px.
- Major sections align to a consistent twelve-column desktop grid and collapse deliberately at tablet and mobile widths.

### Typography

- Cormorant Garamond: hero titles, page titles, important section titles, product names, and editorial statements.
- Instrument Sans: navigation, body copy, forms, buttons, and practical instructions.
- IBM Plex Mono: catalogue codes, indexing, counts, status, and concise technical metadata.
- Important body text: 16–18px desktop and at least 15px mobile.
- Essential labels and states: at least 12px.
- Headings scale by information importance, not decoration.

### Color and material

- Ink: `#071722`
- Surgical navy: `#0B2B3F`
- Deep blue: `#123E56`
- Archival ivory: `#F3EFE5`
- Paper: `#FBF9F3`
- Surgical green: `#2E7254`
- Muted brass: `#A78955`
- Steel: `#D9E3E5`
- Error: restrained oxblood/red

No pure black backgrounds across entire pages. Dark sections should retain tonal depth and readable contrast.

## Homepage redesign

### Cinematic handoff

Preserve the supplied cinematic video and skip/reduced-motion behavior. The handoff should reveal the website as a physical archival cover sliding away, but the first useful website content must be available immediately after dismissal.

### Hero

- Full first-view composition with a large real instrument specimen on the right.
- Left side identifies THROHI Medical Tools, Sialkot, Pakistan, and the catalogue purpose.
- One primary action: browse instruments.
- One secondary action: build an inquiry.
- Search is integrated as a large practical tool below the lead statement.
- Product and variant counts are secondary evidence, not tiny decorative badges.

### Divisions

- Four horizontal division dossiers.
- Surgical and Dental link to structured catalogue views.
- Veterinary and Beauty remain visibly pending without fake products.
- Each row uses real imagery only when available.

### Selected instruments

- Editorial product showcase using large images and asymmetric composition.
- Product code, name, family, and variant count remain visible.
- Avoid equal generic cards.

### Company and history

- One concise company introduction limited to verified facts.
- Scissors history preview uses the supplied evolution media as a cinematic editorial section.
- No invented manufacturing story.

### Closing action

- Catalogue, Inquiry List, and unlisted-instrument routes presented as a clear decision path.

## Catalogue redesign

- Compact dark masthead, not an oversized hero.
- Search remains dominant and visible.
- Desktop uses a narrow filter rail and wide product ledger.
- Mobile uses a native disclosure/filter sheet.
- Product records use image, code, product name, family, variants, and inquiry state in one readable horizontal composition.
- Pagination, URL filters, sorting, and search behavior remain unchanged.
- Empty and loading states match the same editorial language.

## Product detail redesign

- Museum-grade instrument examination stage with real media.
- Product identity and inquiry actions sit in a dark procurement dossier.
- Primary action remains visible on 1280×800.
- Code, division, family, source reference, and verification status remain readable.
- Variant records become a formal catalogue ledger.
- Related products use asymmetric comparison records, not generic cards.

## Inquiry redesign

- Formal procurement worksheet rather than a cart.
- Clear four-stage structure: products, requirements, buyer details, review.
- Product rows remain editable and readable.
- Forms use generous labels, strong errors, and calm grouping.
- Review desk remains visible on desktop and becomes a final review block on mobile.
- Attachment, Turnstile, validation, duplicate handling, local persistence, and durable submission behavior remain unchanged.

## Corporate and utility routes

- Company, Catalogues, Contact, Privacy, Terms, success, error, loading, and not-found routes use one shared editorial framework.
- Legal copy stays readable and explicitly pending final legal approval.
- Utility states avoid generic centered cards where a full-page editorial recovery layout is more appropriate.

## Motion

- Signature motion is limited to the cinematic cover and scissors evolution sequence.
- Other motion is restricted to state changes, image response, focus, navigation, and route continuity.
- Reduced-motion parity is mandatory.

## Accessibility and responsiveness

- No horizontal overflow at 320, 390, 768, 1280, and 1440 widths.
- Visible focus, keyboard-safe navigation, and readable contrast remain mandatory.
- Important text never drops below approved sizes.
- Product and inquiry actions must remain reachable without excessive scrolling on common laptop viewports.

## Implementation strategy

The redesign will replace the current layered premium/refinement CSS approach with a new versioned redesign layer and page-specific modules. Existing functional components and data contracts remain intact wherever possible.

Execution order:

1. new global tokens and shell;
2. homepage;
3. catalogue;
4. product detail;
5. Inquiry List;
6. corporate and utility routes;
7. responsive/accessibility convergence;
8. removal of superseded visual layers after the new system covers every route.

## Non-goals

- Cloudflare preview or production deployment;
- public route cutover;
- real D1/R2/Turnstile setup;
- verified content completion;
- new business claims;
- new catalogue data;
- ecommerce behavior.
