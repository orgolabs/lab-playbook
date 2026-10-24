# orgolabs lab playbook

How we build an **orgolabs** lab, start to finish, so the next one (Diels–Alder, NMR, …) is repeatable.
Each lab is a single self-contained static site → a public repo under the `orgolabs` org → GitHub Pages.

> Private repo on purpose: this holds process notes and a reusable scaffold. The labs themselves are public.

---

## Hard rules (don't skip)

1. **Commit as the author, no AI attribution.** `git -c commit.gpgsign=false commit -m "…"` with a normal message. No `Co-Authored-By` / "Generated with…" lines.
2. **MIT License**, © 2026 Punit Mishra.
3. **Fact-check before you publish.** Verify molar masses + CIDs via **PubChem PUG-REST**; verify every citation (title / volume / page / DOI) via the **Crossref API**. Prefer open-access links and label each reference *open* vs *subscription*.
4. **Real data only.** 3D geometries come from PubChem, never hand-invented coordinates. Prefer **defined-stereochemistry** CIDs — undefined-stereo records render the wrong 3D (this bit us: borneol must be CID 6552009, not 64685).

---

## Shared vs per-lab (DRY — don't copy shared things)

Common assets live once in **`orgolabs/shared`** (served at `https://orgolabs.github.io/shared/`) and labs link
them by absolute URL — never copy them into a lab:
- `shared/styles.css` — the design system (+ `.scheme`/`.sv-*` mechanism-diagram and `.mol-sci` styles)
- `shared/viewer.js` — the generic 3D viewer (reads `window.VIEWERS = [{id,key}]`)
- `shared/references.js` — the renderer (reads `window.REFERENCES`)
- `shared/brand/*` — the logo

## Anatomy of a lab (only lab-specific files live in the lab repo)

```
<lab>/
├── index.html              # content + layout; defines window.VIEWERS and window.REFERENCES inline;
│                           #   links shared styles.css / viewer.js / references.js / brand by URL
├── js/
│   ├── structures.js        # embedded SDF strings (generated — see scripts/)
│   └── calculator.js        # per-lab stoichiometry + yield
├── data/*.sdf               # source structures from PubChem (kept as source of truth)
├── docs/                    # the lab handout/PDF (downloadable from the page)
├── .devcontainer/           # Codespaces: Node + Claude Code + auto-served preview
├── .nojekyll · LICENSE · README.md
```

Every lab has two scientific-naming + mechanism conventions:
- Show the **systematic (IUPAC) name** for every compound (a facts-table row + a `.mol-sci` subtitle under each
  viewer). Common names are secondary — never the only identifier.
- Include a **reaction pathway** SVG (`.scheme` + `.sv-*` classes) in the mechanism section.

## Steps

1. **Scaffold:** `scripts/new-lab.sh <lab-name>` copies `template/` into `../<lab-name>/`.
2. **Source the chemistry:** read any provided lab PDF; drop it in `docs/` and link it. Write background / mechanism / procedure faithfully in your own words.
3. **Fetch structures:** `scripts/fetch-structures.sh name1:CID1 name2:CID2 …` writes `data/*.sdf` and generates `js/structures.js` (SDF embedded as JSON strings so 3Dmol works on `file://` and Pages — no fetch/CORS).
4. **Wire the viewer:** set `window.VIEWERS = [{id:"view-x", key:"x"}, …]` and add matching `<div class="viewer" id="view-x">` cards. For a 4-up grid use `class="viewer-grid grid-4"`.
5. **Calculator:** edit `js/calculator.js` for the reaction's stoichiometry (limiting reagent, theoretical + percent yield), pre-filled with the experiment's amounts.
6. **References:** fill `js/references.js` (`window.REFERENCES`), each with a verified DOI/URL and `access: "open"|"paywall"`.
7. **Verify locally:** `node --check js/*.js`; render with headless Chrome and eyeball alignment (desktop + a true ~390px mobile via `--force-device-scale-factor=2 --window-size=780,…`; Chrome clamps window width to ~500px otherwise).
8. **Publish** (see below).

## Publish

```bash
cd <lab> && git init -b main && git add -A
git -c commit.gpgsign=false commit -m "<lab> interactive explainer"
gh repo create orgolabs/<lab> --public --source=. --remote=origin --description "…"
# SSH push fails in this environment — switch to HTTPS:
gh auth setup-git
git remote set-url origin https://github.com/orgolabs/<lab>.git
git push -u origin main
# GitHub Pages (org has no custom domain → serves directly, no redirect):
gh api -X POST repos/orgolabs/<lab>/pages -f "source[branch]=main" -f "source[path]=/"
# poll until built, then verify:
gh api repos/orgolabs/<lab>/pages/builds/latest --jq .status   # wait for "built"
curl -s -o /dev/null -w "%{http_code}\n" https://orgolabs.github.io/<lab>/
```

Then: add the lab to `orgolabs/.github` profile README, and apply branch protection (see `README.md`).

## Gotchas we hit (so you don't)

- **SSH push fails here** → always switch the remote to HTTPS after `gh auth setup-git`.
- **Personal Pages redirect:** `punitmishra.github.io/*` 301s to `punitmishra.com` (custom domain on the user site). That's why labs live under the **org**, which has no custom domain.
- **Don't delegate a whole lab build to a subagent** — it failed once (produced nothing). Build directly.
- **Org avatar & creating an org are web-only** (no API) — hand those to the user.
- **Branch protection is gated to public repos on the Free org plan** (private needs Team/Enterprise).
