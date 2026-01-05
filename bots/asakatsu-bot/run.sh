#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-.env}"
function bail() {
	echo "$@"
	exit 1
}

# prerequesties
if [ ! -f "$ENV_FILE" ]; then
	bail "Prerequesties not met: .env not found"
fi

case "$1" in
ask)
	bun install --frozen-lockfile
	bun --env-file="$ENV_FILE" commands/ask.ts
	;;
check)
	bun install --frozen-lockfile
	bun --env-file="$ENV_FILE" commands/check.ts
	;;
*)
	bail "[asakatsu-bot] Unknown Command: $1"
	;;
esac
