# THROHI Milestone 2 — Company & Trust Spine Review Addendum

**Parent specification:** `docs/superpowers/specs/2026-07-30-company-trust-spine-design.md`

This addendum records the completion criteria and explicit exclusions confirmed during the required specification self-review.

## Self-review result

- No `TBD`, `TODO`, placeholder claims, or unresolved design decisions remain.
- The four routes have distinct visitor questions and responsibilities.
- The architecture reuses the approved rebuild shell without replacing catalogue, product-detail, or Inquiry List behavior.
- Company and contact content stays inside the verified-facts boundary.
- The full evolution route is explicitly general instrument history, not THROHI corporate history.
- The scope is decomposed into independently reviewed route blocks.
- Milestone 1 verification remains a hard prerequisite.

## Acceptance criteria

Milestone 2 is complete only when:

1. `/rebuild/company`, `/rebuild/company/scissors-through-time`, `/rebuild/catalogues`, and `/rebuild/contact` exist and are linked from the rebuild shell.
2. Every company statement is public-safe and evidence-bound.
3. The Company page identifies THROHI Medical Tools, Sialkot, Pakistan, and the four truthful instrument divisions.
4. The Company page feels customer-facing rather than like a developer checklist or internal review screen.
5. The full supplied 260-frame evolution sequence has motion, reduced-motion, loading, and failure parity.
6. The evolution route clearly states that the sequence is general instrument history rather than THROHI company history.
7. The Catalogues route separates the searchable digital catalogue from downloadable documents.
8. No Download action renders without a verified file URL, title, division, format, file size, and publication or update date.
9. The Contact route keeps the Inquiry List as the primary product-request path and provides an unlisted-instrument path.
10. No empty or unverified email, phone, WhatsApp, address, map, or business-hours control renders.
11. Existing catalogue search, product routes, Inquiry List state, accessibility mechanics, and media pipelines remain intact.
12. Desktop and mobile navigation exposes the four real corporate routes and preserves focus trapping and restoration.
13. All required automated checks pass from a clean checkout.
14. Axe reports no serious or critical violations on all four Milestone 2 routes.
15. Screenshot review confirms one coherent Surgical Precision Archive system without generic cards, filler headings, fake proof, excessive pills, or unnecessary motion.
16. `/rebuild` remains no-indexed.
17. No public cutover, merge, pull request, deployment, or GitHub Actions run occurs without explicit approval.

## Explicit non-goals

Milestone 2 does not include:

- catalogue discovery redesign;
- product-detail redesign;
- Inquiry List redesign;
- catalogue identity approval work;
- durable database or attachment storage;
- email or WhatsApp delivery integration;
- new inquiry endpoints;
- legal-page redesign;
- public route replacement;
- production cutover;
- invented company proof, documents, certifications, materials, capacity, markets, services, minimum orders, or lead times.

## Implementation gate

After the user approves the parent specification and this addendum, the next required step is the Superpowers `writing-plans` workflow. Implementation must not begin before the detailed plan is written and reviewed.
