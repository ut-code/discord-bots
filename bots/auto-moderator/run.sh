#!/usr/bin/env bash
set -euo pipefail

function bail() {
	echo "$@"
	exit 1
}

ENV_FILE="${ENV_FILE:-.env}"
if [ ! -f "$ENV_FILE" ]; then
	bail "Prerequesties not met: .env not found"
fi

bun install --frozen-lockfile
bun --env-file="$ENV_FILE" start
