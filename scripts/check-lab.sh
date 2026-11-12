#!/usr/bin/env bash
# Validate one or all orgolabs labs against the window.LAB + content.md contract.
# Usage:  scripts/check-lab.sh                 # all labs (siblings of this repo)
#         scripts/check-lab.sh ../diels-alder  # one lab
# Installs the marked dependency on first run. Exit 0 = pass, 1 = errors.
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
cd "$here"
if [ ! -d node_modules/marked ]; then
  echo "installing validator deps (marked)…"
  npm install --silent
fi
exec node scripts/check-lab.js "$@"
