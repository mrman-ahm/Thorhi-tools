#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

printf '\n== THROHI Design Milestone 1 verification ==\n\n'

run() {
  printf '\n-- %s\n' "$*"
  "$@"
}

run npm run lint
run npm run typecheck
run npm run test
run npm run build
run env PLAYWRIGHT_PORT=3100 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=desktop-chromium --project=mobile-chromium

printf '\nAll automated milestone commands completed.\n'
printf 'Manual screenshot review is still required at 1440x1000, 1280x800, 390x844, and 320x700.\n'
printf 'Also inspect reduced motion and a failed /media/sector9d/manifest.json response.\n'
