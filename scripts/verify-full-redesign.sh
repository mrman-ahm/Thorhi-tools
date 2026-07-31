#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

printf '\n== THROHI Precision Heritage full redesign verification ==\n\n'

run() {
  printf '\n-- %s\n' "$*"
  "$@"
}

rm -rf playwright-report test-results .next

run npm run lint
run npm run typecheck
run npm run test
run npm run build
run npm run readiness:check
run env PLAYWRIGHT_PORT=3105 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- \
  tests/e2e/rebuild-home-design.spec.ts \
  tests/e2e/rebuild-company-trust.spec.ts \
  tests/e2e/rebuild-catalogue-design.spec.ts \
  tests/e2e/rebuild-product-inquiry-design.spec.ts \
  tests/e2e/rebuild-premium-convergence.spec.ts \
  tests/e2e/rebuild-premium-utility-states.spec.ts \
  tests/e2e/rebuild-production-readiness.spec.ts \
  tests/e2e/rebuild-rendered-visual-qa.spec.ts \
  tests/e2e/rebuild-full-redesign.spec.ts \
  --project=desktop-chromium \
  --project=mobile-chromium

printf '\nAll automated full-redesign commands completed.\n'
printf 'Manual visual review remains required at 1440x1000, 1280x800, 768x1024, 390x844, and 320x700.\n'
printf 'Inspect the cinematic handoff, header overlays, mobile index, homepage sequence, catalogue ledger, product dossier, inquiry worksheet, corporate routes, legal pages, terminal states, and footer.\n'
