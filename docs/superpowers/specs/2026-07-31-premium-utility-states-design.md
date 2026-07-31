# Premium Utility States Design

## Scope

Converge the non-commercial terminal and legal surfaces inside `/rebuild`:

- `/rebuild/privacy`
- `/rebuild/terms`
- rebuild-scoped not-found state
- rebuild-scoped runtime error state
- rebuild-scoped loading state

Legacy public routes remain unchanged until explicit cutover approval.

## Direction

**Regal Technical Corporate** continues without decorative spectacle. Utility pages use warm ivory reading surfaces, near-black navy identity panels, restrained brass rules, surgical green actions, Cormorant Garamond headings, Instrument Sans body text, and IBM Plex Mono references.

Important information must remain comfortably readable. Body copy targets 1rem–1.125rem with generous line height. Legal headings and recovery actions must never rely on microtype.

## Legal truth boundary

The pages publish only application boundaries already implemented:

- an inquiry is not an order, quotation, payment, reservation, or supply commitment;
- buyer and inquiry information is collected to review and respond to a request;
- optional attachments may be submitted through the inquiry flow;
- final retention periods, jurisdiction, privacy contact, commercial terms, and effective dates require client/legal approval;
- certifications, materials, capabilities, export markets, and company history are not invented.

No fake effective date, privacy officer, address, phone number, email address, retention promise, governing law, or dispute process may appear.

## Page composition

### Legal pages

- dark compact identity masthead with page title and honest review status;
- two-column reading layout on desktop;
- sticky section index with large readable links;
- numbered legal sections with clear headings and 18px-class body copy;
- final truth-boundary panel and practical route actions;
- single-column mobile reading flow.

### Not found

- premium split composition with an oversized restrained `404` reference;
- direct explanation focused on catalogue routing;
- actions to search products, browse the catalogue, or add an unlisted instrument;
- no jokes, filler, or generic illustration.

### Runtime error

- client boundary with concise explanation;
- primary retry action using `reset()`;
- secondary catalogue and inquiry recovery routes;
- development-only error detail remains outside the public design.

### Loading

- calm semantic status region;
- structured masthead and content-ledger placeholders;
- no endless spinner, fake progress percentage, or distracting animation;
- reduced motion disables shimmer movement.

## Components

- `src/rebuild/legal-content.ts`: verified legal section data only.
- `src/app/rebuild/utility-state.module.css`: shared visual system for legal, missing, error, and loading states.
- route files remain small and declarative.

## Accessibility and responsive behavior

- exactly one visible `h1` per route;
- readable body and control sizing;
- keyboard-accessible sticky index and recovery controls;
- semantic `role="status"` for loading;
- no horizontal overflow at 320, 390, 768, 1280, or 1440 pixels;
- reduced-motion parity;
- serious and critical Axe violations block cutover.

## Verification

Add source contracts and Playwright coverage for route headings, legal truth boundaries, recovery links, loading semantics, retry control, readable font sizes, overflow, and accessibility.
