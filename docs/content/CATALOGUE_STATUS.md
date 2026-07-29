# Catalogue Data Status

**Status:** Source-derived development catalogue  
**Last reviewed:** 2026-07-29

## Current coverage

The supplied FineMed bundle contains:

- 2 searchable divisions
- 53 product families
- 626 grouped product records
- 1,434 variant codes
- 626 representative instrument images

The searchable divisions are Surgical and Dental & Orthodontic. Veterinary and
Beauty remain part of the approved information architecture, but no equivalent
structured source catalogues were supplied in this handoff.

## Publication boundary

The rebuild may display the following source-derived identity fields:

- product and variant codes
- conservative product names
- catalogue division and family
- source catalogue page references
- representative instrument images

The following fields remain withheld until the original catalogue pages or
client confirmation are available:

- descriptive claims
- measurements and configurations
- materials and finishes
- manufacturing or quality statements
- certifications and compliance
- availability and commercial terms

The source bundle labels records as approved and variants as verified. Those
labels are not treated as client approval. Runtime records are explicitly
marked `source-derived` and `pending-verification`.

## Import and audit

Run `npm run data:finemed` to regenerate the working payload, compact runtime
catalogue, audit report, sprite, and public manifest from the supplied bundle.
The importer does not modify `sources(previousAI)/`.

Generated working files:

- `data/working/finemed/catalogue.source-derived.json`
- `data/working/finemed/catalogue-audit.generated.json`
- `src/data/catalogue.runtime.generated.json`
- `public/catalogue/catalogue-sheet.avif`
- `public/catalogue/manifest.json`

The current automated audit places 175 records in the copy-review queue. This
is a triage signal, not a complete editorial approval process.

## Client review and promotion

The private development workspace at `/rebuild/review/catalogue` turns the
175-record audit queue into a structured identity review. It supports:

- approved, corrected, needs-client, rejected, and pending decisions
- controlled corrections to product name, product code, and existing-division
  family assignment
- independent confirmation of representative media, variant codes, and
  catalogue page references
- browser-local draft persistence and explicit JSON import/export

The route is no-indexed but does not provide authentication. It must not be
deployed as a public review portal until access control is added.

After review, place the exported JSON at
`data/working/finemed/catalogue-review.decisions.json` and run:

```bash
npm run data:approve
```

The deterministic command writes only approved and corrected identities to
`data/approved/catalogue.approved.json`. Pending, rejected, and needs-client
records remain outside approved data. Technical and commercial fields are not
accepted by this promotion schema.

## Asset notes

- The 626-image organized archive passed ZIP integrity checks.
- Product imagery is delivered through one validated 4,992 by 4,800 AVIF sprite.
- The original organized extraction now also produces 626 individually mapped
  AVIF product assets, capped at 1,200 by 900 without enlarging smaller source
  images.
- Individual product assets total approximately 4.28 MB encoded and load lazily
  outside first-viewport priority media. The 192-pixel-cell sprite remains the
  automatic missing-image fallback.
- `public/brand/throhi-logo-temporary.webp` is a valid transparent raster
  derived from the supplied background-removed logo.
- Final vector artwork and legal review of the cross-like wordmark element
  remain launch dependencies.
- The supplied generated video and frame sequence are not integrated into the
  rebuild pending provenance and creative approval.
