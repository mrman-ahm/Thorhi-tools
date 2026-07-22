# Frontend Architecture

## Chosen stack

- Next.js App Router
- React and strict TypeScript
- Authored semantic CSS token layer
- Server-rendered pages by default
- Small client islands only for interactive navigation, search, filters, and inquiry state
- Cloudflare Workers deployment target through OpenNext after hosting approval

## Why

The catalogue needs server-rendered metadata, static generation, accessible public routes, image optimization, and a clean path to dynamic search and inquiry handlers. The homepage remains mostly server-rendered and requires minimal JavaScript.

## Directory direction

- `src/app`: routes, metadata, layouts, route handlers
- `src/components`: reusable interface and domain components
- `src/data`: approved static catalogue snapshots until a CMS/database is selected
- `public`: replaceable brand and product assets
- `tests`: component contracts and critical-flow tests

## Route direction

- `/`
- `/products`
- `/products/[division]`
- `/products/[division]/[family]`
- `/products/[division]/[family]/[code]`
- `/search`
- `/inquiry`
- `/resources`
- `/company`
- `/contact`

## Data boundaries

Only records promoted to `data/approved` may appear as verified production data. Placeholder product names and codes in the homepage are visibly treated as pending validation.

## Inquiry direction

The current homepage provides the interface contract only. The next backend phase must choose storage, attachment handling, anti-spam, email delivery, consent retention, and failure recovery before enabling submission.

## Temporary assets

- `public/logo.webp` is temporary and replaceable.
- Hero, division, product, and macro visual zones are isolated from layout.
- No remote expiring Figma asset is used in committed production code.

## Quality gates

Every implementation milestone must pass formatting, linting, type checking, tests, production build, keyboard review, mobile review, reduced-motion review, and high-zoom review.
