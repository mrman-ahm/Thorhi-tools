# THROHI V2 — Sector 9D Production Media Repair

## Source contract

The production media archive is stored as ordered binary parts under `assets/sector9d/archive/`.

- 25 parts
- parts 00–23: 15,000 bytes each
- part 24: 1,512 bytes
- concatenated archive size: 361,512 bytes
- SHA-256: `612fb25ae54ede76552c0d25133215608184154aa5bf2e6544f27e19e34e378d`

The archive contains:

- `intro-lite.mp4`
- `evolution-sprite-lite.webp`

The build materializer must fail when a part is missing, the size contract changes, the archive hash differs, extraction fails, or either required media file is absent.

## Runtime geometry

- frame count: 260
- sprite: 2880 × 2970
- columns: 12
- rows: 22
- frame cell: 240 × 135

The canvas remains the only evolution media element. Chapter copy follows the rendered frame boundaries established in Sector 9D.
