#!/usr/bin/env bash
set -euo pipefail

function bail() {
	echo "$@"
	exit 1
}

# prerequesties
if [ ! -f .env ]; then
	bail "Prerequesties not met: .env not found"
fi

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
