<p align="center">
  <img src="https://orgolabs.github.io/camphor-reduction/brand/orgolabs-wordmark.png" alt="orgolabs" width="300">
</p>

# orgolabs lab playbook (private)

The repeatable method + reusable scaffold for building **orgolabs** interactive chemistry labs.
Private on purpose — the labs themselves are public under [orgolabs](https://github.com/orgolabs).

- **[PLAYBOOK.md](PLAYBOOK.md)** — how we build a lab, start to finish, and the gotchas we hit.
- **[ROADMAP.md](ROADMAP.md)** — shipped labs + what's planned (Diels–Alder, NMR, …).
- **[`template/`](template/)** — a ready scaffold: shared design system, brand, generic 3D viewer + reference renderer, Codespaces devcontainer.
- **[`scripts/`](scripts/)** — `new-lab.sh` (scaffold a lab) and `fetch-structures.sh` (pull PubChem SDFs → embed in `js/structures.js`).

## Quick start

```bash
scripts/new-lab.sh diels-alder
cd ../diels-alder
../orgolabs-lab-playbook/scripts/fetch-structures.sh cyclopentadiene:7612 maleic_anhydride:7923
# edit index.html, js/calculator.js, js/references.js; add docs/<handout>.pdf
# then publish (see PLAYBOOK.md § Publish)
```

## Codespaces

Every repo (labs + this one) ships a `.devcontainer/` that, on launch:
- installs the **Claude Code** CLI (`claude`) and the Claude Code **VS Code extension**,
- serves the site on **port 8000** (auto-forwarded preview) so you can test the lab immediately.

Open any repo → **Code ▸ Codespaces ▸ Create codespace on main**. Authenticate Claude in the terminal (`claude`), and the live preview opens on port 8000. This makes each lab easy to test and collaborate on when spawned.

## Conventions (the short version)

Commit as the author with **no AI attribution**; **MIT** license; **fact-check** molar masses/CIDs (PubChem) and citations (Crossref) before publishing; **real** PubChem 3D only (prefer defined-stereo CIDs). Full detail in [PLAYBOOK.md](PLAYBOOK.md).
