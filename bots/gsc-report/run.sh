#!/usr/bin/env -S mise exec -- bash
set -euo pipefail
cd "$(dirname "$0")"

npm ci || {
	echo 'WARNING: npm ci failed. falling back to npm install' 2>&1
	npm install
}

node main.js
