#!/usr/bin/env -S mise exec -- bash
set -euo pipefail
cd "$(dirname "$0")"

function bail() {
	echo "$@"
	exit 1
}

case "$1" in
ask)
	bun install --frozen-lockfile
	bun --env-file=.env commands/ask.ts
	;;
check)
	bun install --frozen-lockfile
	bun --env-file=.env commands/check.ts
	;;
*)
	bail "[asakatsu-bot] Unknown Command: $1"
	;;
esac
