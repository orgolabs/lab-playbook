# orgolabs lab playbook

How we build an **orgolabs** lab. Each lab is a thin page that a single shared engine renders from
**Markdown + a small config** — so there's one template to maintain, labs don't drift, and there's no build step.

> Private notes + a reusable scaffold. The labs themselves are public under the org.

---

## Hard rules (don't skip)

1. **Commit as the author, no AI attribution.** `git -c commit.gpgsign=false commit -m "…"`. No `Co-Authored-By` / "Generated with…" lines.
2. **MIT License**, © 2026 Punit Mishra.
3. **Fact-check before you publish.** Verify molar masses + CIDs via **PubChem PUG-REST**; verify every citation (title / volume / page / DOI) via the **Crossref API**. Prefer open-access links; label each reference *open* vs *subscription*.
4. **Real data only.** 3D geometries come from PubChem, never invented. Prefer **defined-stereochemistry** CIDs (undefined-stereo records render the wrong 3D — borneol must be CID 6552009, not 64685).
5. **Chemistry is typeset, never hand-typed.** Write every formula/equation as **`$\ce{...}$`** (mhchem). Don't use Unicode subscripts.

---

## Architecture — Markdown + one shared engine, no build

Everything shared lives once in **`orgolabs/shared`** (served at `https://orgolabs.github.io/shared/`); labs link it by URL (same-origin, no CORS):

- **`shared/lab.js`** — *the template*. Reads a lab's `window.LAB` config, fetches its `content.md`, renders Markdown (marked.js) + chemistry (KaTeX + mhchem + auto-render), builds the chrome (brand bar, hero, TOC, footer), and mounts the 3D viewers / pathway / references / calculator. Also loads 3Dmol + `viewer.js` + `nav.js`.
- `shared/styles.css` (design system), `shared/brand/`, `shared/mol2d/` (PubChem 2D structure PNGs for pathways).

A **lab repo** is just:

```
<lab>/
├── index.html        # thin shell: sets window.LAB (structured data) + loads js/structures.js, shared/lab.js
├── content.md        # ALL prose/tables/procedure in Markdown, chemistry as $\ce{...}$;
│                     #   interactive blocks are <div data-mount="viewers|pathway|calculator|references">;
│                     #   styled blocks (.mech-grid/.callout/.safety/.dl-btn) are inline HTML
├── js/structures.js  # embedded SDF (generated — see scripts/)
├── data/*.sdf        # source 3D structures from PubChem
├── docs/             # the lab handout/PDF (downloadable from the page)
├── .devcontainer/ · .nojekyll · LICENSE · README.md
```

`window.LAB` holds only the structured bits: `{ repo, labName, eyebrow, title, lede, reaction (mhchem),
viewers[], pathway[], pathwayCaption, calculator{inputs,outputs,compute}, references[] }`. See
`template/index.html` for the shape. **A contributor editing content touches `content.md` only.**

## Steps

1. **Scaffold:** `scripts/new-lab.sh <lab-name>` copies `template/` to `../<lab-name>/`.
2. **Source the chemistry:** read the provided lab PDF; drop it in `docs/` and link it from `content.md`. Write background / mechanism / procedure faithfully in Markdown.
3. **Fetch structures:** `scripts/fetch-structures.sh name:CID …` → `data/*.sdf` + `js/structures.js` (SDF embedded). For the pathway's 2D drawings, grab PubChem PNGs into `shared/mol2d/` (`/rest/pug/compound/cid/<CID>/PNG?image_size=400x400`) and reference `name.png`.
4. **Fill `window.LAB`** in `index.html`: viewers (one per structure), pathway (nodes + `op`/`plus` separators), calculator (inputs/outputs + a `compute(v)` returning `{outputId: value}`), references (verified DOIs + access labels), and the hero `reaction` as mhchem.
5. **Write `content.md`:** `## ` sections (short headings = TOC chips), prose with `$\ce{}$`, Markdown tables, `<div data-mount="…">` where widgets go.
6. **Test LOCALLY on a server** (client-side `fetch(content.md)` fails over `file://`):
   `python3 -m http.server 8099` in the lab dir, then open/screenshot `http://localhost:8099/`. (The shell pulls `shared/lab.js` from the live site, so push shared first if you changed the engine.)
7. **Publish** (below).

## Publish

```bash
cd <lab> && git init -b main && git add -A
git -c commit.gpgsign=false commit -m "<lab> interactive explainer"
gh repo create orgolabs/<lab> --public --source=. --remote=origin --description "…"
gh auth setup-git                                             # SSH push fails here — use HTTPS
git remote set-url origin https://github.com/orgolabs/<lab>.git
git push -u origin main
gh api -X POST repos/orgolabs/<lab>/pages -f "source[branch]=main" -f "source[path]=/"
gh api repos/orgolabs/<lab>/pages/builds/latest --jq .status  # wait for "built"
curl -s -o /dev/null -w "%{http_code}\n" https://orgolabs.github.io/<lab>/
```

Then add the lab to the `orgolabs/.github` profile README and to the `orgolabs.github.io` landing page, and apply branch protection (see `README.md`).

## Conventions

- Show the **systematic (IUPAC) name** for every compound (facts-table row + a `.mol-sci` subtitle under each viewer); common names are secondary.
- Include a **reaction pathway** (`<div data-mount="pathway">`) with real 2D structures, plus the step cards.
- Keep the green accent subtle; headings are Fraunces (serif) via the shared theme automatically.

## Gotchas we hit (so you don't)

- **SSH push fails here** → `gh auth setup-git` + HTTPS remote.
- **`fetch(content.md)` is blocked over `file://`** → always test with a local `http.server`.
- **Don't double-escape `&`** in `window.LAB` strings — the engine escapes them (`&amp;` → shows "&amp;").
- Inline `$…$` is auto-rendered only inside `#main`; the hero `reaction` uses a `.chem[data-tex]` span, which the engine also renders.
- **Don't `git commit --amend` a pushed commit** — branch protection blocks the force-push. Make a new commit (or `git reset --soft origin/main` then recommit).
- Personal Pages (`punitmishra.github.io`) 301-redirect to `punitmishra.com`; that's why labs live under the **org**.
- Org avatar / creating an org are web-only (hand to the user). Branch protection needs a public repo on the Free org plan.
- Headless Chrome can't run WebGL, so 3D viewers look blank in screenshots even when correct — verify 3D in a real browser.
