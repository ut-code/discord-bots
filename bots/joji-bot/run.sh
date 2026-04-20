#!/usr/bin/env -S mise exec -- bash
set -euo pipefail
cd "$(dirname "$0")"

bun install --frozen-lockfile
bun --env-file=.env run index.ts
