#!/usr/bin/env bash
# Scaffold a new orgolabs lab from the template.
# Usage (run from this playbook repo root):  scripts/new-lab.sh <lab-name>
#   e.g.  scripts/new-lab.sh diels-alder   ->   creates ../diels-alder/ from template/
set -euo pipefail
[ "$#" -eq 1 ] || { echo "usage: scripts/new-lab.sh <lab-name>"; exit 1; }
lab="$1"
here="$(cd "$(dirname "$0")/.." && pwd)"
dest="$(cd "$here/.." && pwd)/$lab"
[ -e "$dest" ] && { echo "error: $dest already exists"; exit 1; }
cp -R "$here/template" "$dest"
cp "$here/LICENSE" "$dest/LICENSE"
# drop the shared .devcontainer in too (template already carries one)
echo "created $dest"
echo "next:"
echo "  cd $dest"
echo "  $here/scripts/fetch-structures.sh name:CID ...   # pull 3D structures"
echo "  # edit index.html (window.LAB) and content.md; add docs/<handout>.pdf; pathway PNGs -> shared/mol2d/"
echo "  python3 -m http.server 8099   # test at http://localhost:8099/ (fetch needs http, not file://)"
echo "  git init -b main && git add -A && git -c commit.gpgsign=false commit -m \"$lab interactive explainer\""
echo "  gh repo create orgolabs/$lab --public --source=. --remote=origin"
echo "  gh auth setup-git && git remote set-url origin https://github.com/orgolabs/$lab.git && git push -u origin main"
echo "  gh api -X POST repos/orgolabs/$lab/pages -f 'source[branch]=main' -f 'source[path]=/'"
