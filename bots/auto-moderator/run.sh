#!/usr/bin/env bash
set -euo pipefail

bun install --frozen-lockfile || {
	echo 'auto-moderator: Failed to bun install --frozen-lockfile. falling back to bun install...' 2>&1
	bun install
}

bun start
