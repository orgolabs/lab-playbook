<p align="center">
  <img src="https://orgolabs.github.io/shared/brand/orgolabs-wordmark.png" alt="orgolabs" width="300">
</p>

# orgolabs lab playbook

The repeatable method + reusable scaffold for building **orgolabs** interactive chemistry labs.
Public, and a **GitHub template repo** — the labs live under [orgolabs](https://github.com/orgolabs).

- **[PLAYBOOK.md](PLAYBOOK.md)** — how we build a lab, start to finish, and the gotchas we hit.
- **[ROADMAP.md](ROADMAP.md)** — shipped labs + what's planned (Diels–Alder, NMR, …).
- **[`template/`](template/)** — a thin lab scaffold: `index.html` (the `window.LAB` config) + `content.md` (Markdown prose) that the shared engine renders. No per-lab CSS/JS.
- **[`scripts/`](scripts/)** — `new-lab.sh` (scaffold a lab) and `fetch-structures.sh` (pull PubChem SDFs → embed in `js/structures.js`).

## How a lab works

One shared engine, **`shared/lab.js`**, renders every lab from **Markdown + a small config** — no build step:

- **`content.md`** holds all the prose (chemistry written as `$\ce{...}$`); interactive blocks are mount points (`<div data-mount="viewers">`, `pathway`, `calculator`, `references`).
- **`index.html`** holds only `window.LAB` — the structured data (viewers, pathway, references, a config-driven calculator) — and loads `js/structures.js` + `shared/lab.js`.

So a contributor editing content touches **`content.md`** only. The look, chemistry typesetting, 3D viewer, and layout are all the shared engine — one thing to maintain.

## Quick start

```bash
scripts/new-lab.sh diels-alder
cd ../diels-alder
../lab-playbook/scripts/fetch-structures.sh cyclopentadiene:7612 maleic_anhydride:7923
# edit index.html (window.LAB) and content.md; add docs/<handout>.pdf; drop pathway PNGs in shared/mol2d/
python3 -m http.server 8099     # test locally — fetch(content.md) needs http, not file://
#   open http://localhost:8099/
# then publish (see PLAYBOOK.md § Publish)
```

## Codespaces

Every repo ships a `.devcontainer/` that installs the **Claude Code** CLI + VS Code extension and serves the
site on **port 8000** (auto-forwarded) so you can test immediately. Open any repo → **Code ▸ Codespaces ▸ Create codespace on main**.

## Conventions (the short version)

Commit as the author with **no AI attribution**; **MIT** license; **fact-check** molar masses/CIDs (PubChem) and
citations (Crossref) before publishing; **real** PubChem 3D only (prefer defined-stereo CIDs); all chemistry as
**`$\ce{...}$`** (mhchem), never Unicode subscripts. Full detail in [PLAYBOOK.md](PLAYBOOK.md).
