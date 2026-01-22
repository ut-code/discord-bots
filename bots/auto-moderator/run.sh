#!/usr/bin/env bash
set -euo pipefail

bun install --frozen-lockfile
sops exec-env sops.env 'bun start'
