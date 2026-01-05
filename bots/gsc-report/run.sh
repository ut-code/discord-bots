#!/usr/bin/env bash
set -euo pipefail

npm ci || {
	echo 'WARNING: npm ci failed. falling back to npm install' 2>&1
	npm install
}

node main.js
