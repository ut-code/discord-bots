#!/usr/bin/env -S mise exec -- bash
set -euo pipefail
cd "$(dirname "$0")"
source ../../scripts/sops-env.sh

bun install --frozen-lockfile
sops exec-env sops.env 'bun start'
