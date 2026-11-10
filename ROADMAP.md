# orgolabs roadmap

## Shipped
- ✅ **Reduction of Camphor** — NaBH₄ reduction → isoborneol/borneol (steric approach control). → `orgolabs/camphor-reduction`
- ✅ **Synthesis of Aspirin** — salicylic acid + acetic anhydride, one-step microscale (Williamson & Masters, 7th ed.). → `orgolabs/aspirin-synthesis`
- ✅ **Diels–Alder Reaction** — cyclopentadiene + maleic anhydride → endo-norbornene anhydride ([4+2], endo rule). → `orgolabs/diels-alder`
- ✅ **Guaifenesin (Williamson ether synthesis)** — guaiacol phenoxide + 3-chloro-1,2-propanediol (S_N2). → `orgolabs/guaifenesin-synthesis`
- ✅ **Trityl Methyl Ether** — triphenylmethanol → trityl methyl ether via the trityl cation (S_N1). → `orgolabs/trityl-methyl-ether`
- ✅ **Oxidation of Borneol to Camphor** — NaOCl/AcOH oxidation (greener); pairs with camphor-reduction. → `orgolabs/borneol-oxidation`

## Planned

### ✅ Diels–Alder reaction — SHIPPED (`orgolabs/diels-alder`)
Flagship built on **system #1** (cyclopentadiene + maleic anhydride → endo-norbornene anhydride), from the user's
Williamson & Masters handout (Ch. 48, p. 626). Verified CIDs **7612 / 7923 / 2723766** (endo adduct is defined-stereo);
the original **Diels & Alder (1928)** citation confirmed via Crossref (DOI 10.1002/jlac.19284600106). Covers the
concerted [4+2], the FMO picture (HOMO-diene/LUMO-dienophile; EWGs lower the dienophile LUMO), and the **endo rule**.

**Possible follow-up:** a "dienes compared" section or sibling labs for #2 (anthracene + maleic anhydride, one adduct)
and #3 (furan + maleic anhydride, **reversible**/retro-DA, *exo* isolated) — to teach the endo-kinetic vs
exo-thermodynamic contrast in one place.

### ⬜ NMR lab
Interpreting ¹H / ¹³C NMR. Different shape from the synthesis labs: likely an interactive spectrum (peaks ↔
structure highlighting) rather than a 3D-reaction viewer. Scope TBD.

### ⬜ Further labs "as we see fit."

## Platform / infrastructure
- ✅ Org profile landing page (`orgolabs/.github`).
- ✅ Public playbook + reusable template (this repo) — now a **GitHub template repo**.
- ✅ Codespaces devcontainers (Node + Claude Code + auto-served preview) in each repo.
- ✅ Branch protection + issues/discussions on the public labs.
- ✅ **Shared common place** (`orgolabs/shared`) — one source of truth for CSS, brand, viewer, and the lab engine. Labs link it by URL instead of copying.
- ✅ **Markdown + one shared engine** (`shared/lab.js`): labs are `content.md` + a `window.LAB` config; no build step. Chemistry typeset with **KaTeX + mhchem** (`$\ce{...}$`).
- ✅ Standalone landing site (`orgolabs.github.io`).
- ✅ Convention: systematic (IUPAC) names on every compound + a real-2D-structure reaction pathway in each lab.
- ⬜ Org avatar upload (manual, web-only — pending user).
- ⬜ Consider: a tiny CI check (HTML/JS lint, link check) via GitHub Actions; versioning shared assets.
