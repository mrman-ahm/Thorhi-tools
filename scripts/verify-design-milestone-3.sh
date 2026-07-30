#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

printf '\n== THROHI Design Milestone 3 verification ==\n\n'

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
run env PLAYWRIGHT_PORT=3102 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- \
  tests/e2e/rebuild-home-design.spec.ts \
  tests/e2e/rebuild-company-trust.spec.ts \
  tests/e2e/rebuild-catalogue-design.spec.ts \
  --project=desktop-chromium \
  --project=mobile-chromium

printf '\nAll automated Milestone 3 commands completed.\n'
printf 'Manual visual review remains required at 1440x1000, 1280x800, 768x1024, 390x844, and 320x700.\n'
printf 'Inspect default, filtered, no-results, selected-inquiry, pagination, and reduced-motion states.\n'
