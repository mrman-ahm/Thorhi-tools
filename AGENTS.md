# AGENTS.md

## Repository purpose

This repository contains the THROHI website strategy, design system, product data, implementation, tests, and deployment documentation.

## Required reading before changes

1. `README.md`
2. `docs/strategy/PROJECT_BRIEF.md`
3. `docs/strategy/DECISIONS.md`
4. `PLANS.md`
5. Any relevant specification under `docs/`

## Non-negotiable rules

- Do not invent business facts, certifications, manufacturing capabilities, materials, statistics, testimonials, export regions, or compliance claims.
- Do not use the legacy website as a visual reference.
- Preserve approved strategy and document any meaningful reversal.
- Keep cinematic effects away from catalogue, product, form, and inquiry usability.
- Use semantic HTML, accessible interaction, visible focus, reduced-motion support, and responsive behavior.
- Never commit secrets or real `.env` files.
- Do not publish, merge, deploy, or alter production infrastructure without explicit authorization.
- Do not overwrite original client assets in `assets/source/`.
- Product data moves from `data/raw/` to `data/working/` and only then to `data/approved/` after validation.

## Definition of done for implementation work

- Formatting, linting, type checking, tests, and production build pass.
- Loading, empty, error, success, missing-image, and long-content states are handled.
- Keyboard, mobile, reduced-motion, and high-zoom behavior are reviewed.
- Security and privacy implications are documented.
- Meaningful changes are recorded in `CHANGELOG.md` or the decision log.
