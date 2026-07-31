#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

printf '\n== THROHI Design Milestone 6 verification ==\n\n'

run() {
  printf '\n-- %s\n' "$*"
  "$@"
}

rm -rf playwright-report test-results
rm -rf .next

run npm run lint
run npm run typecheck
run npm run test
run npm run build
run env PLAYWRIGHT_PORT=3104 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- \
  tests/e2e/rebuild-home-design.spec.ts \
  tests/e2e/rebuild-company-trust.spec.ts \
  tests/e2e/rebuild-catalogue-design.spec.ts \
  tests/e2e/rebuild-product-inquiry-design.spec.ts \
  tests/e2e/rebuild-premium-convergence.spec.ts \
  --project=desktop-chromium \
  --project=mobile-chromium

printf '\nAll automated Milestone 6 commands completed.\n'
printf 'Manual premium visual review remains required at 1440x1000, 1280x800, 768x1024, 390x844, and 320x700.\n'
printf 'Inspect typography loading, hierarchy, header panels, mobile navigation, footer, forms, product records, and reduced motion.\n'
