#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

printf '\n== THROHI Design Milestone 2 verification ==\n\n'

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
run env PLAYWRIGHT_PORT=3101 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- \
  tests/e2e/rebuild-home-design.spec.ts \
  tests/e2e/rebuild-company-trust.spec.ts \
  --project=desktop-chromium \
  --project=mobile-chromium

printf '\nAll automated Milestone 2 commands completed.\n'
printf 'Manual screenshot review is still required for Company, Scissors Through Time, Catalogues, and Contact.\n'
printf 'Inspect desktop, mobile, reduced-motion, missing-manifest, empty-document, and unverified-contact states.\n'
