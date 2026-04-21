#!/usr/bin/env -S mise exec -- bash
set -euo pipefail
cd "$(dirname "$0")"

bun install --frozen-lockfile
sops exec-env sops.env 'bun start'
