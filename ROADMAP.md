# orgolabs roadmap

## Shipped
- ✅ **Reduction of Camphor** — NaBH₄ reduction → isoborneol/borneol (steric approach control). → `orgolabs/camphor-reduction`
- ✅ **Synthesis of Aspirin** — salicylic acid + acetic anhydride (Olmsted 1998). → `orgolabs/aspirin-synthesis`

## Planned

### ⬜ Diels–Alder reaction (`orgolabs/diels-alder`)
A concerted [4+2] cycloaddition. Drops onto the existing engine (`content.md` + `window.LAB`). Plan covers **three
systems** (decided 2026-10-25); procedure will be based on a **user-supplied handout PDF** (like camphor/aspirin).

| | 1. Cyclopentadiene + maleic anhydride | 2. Anthracene + maleic anhydride | 3. Furan + maleic anhydride |
|---|---|---|---|
| Teaches | canonical [4+2]; **endo rule** (endo = kinetic major) | DA across an **aromatic** central ring; one product | **reversible** DA (retro-DA); kinetic vs thermodynamic; **exo** isolated |
| Diene | cyclopentadiene — locked *s-cis*, dimerizes (crack dicyclopentadiene fresh) | anthracene (9,10) | furan (weakly aromatic) |
| Product | endo-norbornene-2,3-dicarboxylic anhydride, C₉H₈O₃ (164.16) | 9,10-bridged succinic anhydride, C₁₈H₁₂O₃ (~276.3) | *exo*-7-oxanorbornene-dicarboxylic anhydride, C₈H₆O₄ (166.13) |
| Conditions | room temp, exothermic | reflux (xylene) | mild; watch reversibility/volatility |
| Pathway | diene + dienophile → **endo (major) + exo (minor)** | anthracene + dienophile → single adduct | furan + dienophile ⇌ **exo (major)** |
| Calculator | cyclopentadiene by volume (ρ≈0.80, 66.10) + MA 98.06 → 164.16 | anthracene 178.23 + MA 98.06 → 276.3 | furan 68.07 + MA 98.06 → 166.13 |

Common to all: real PubChem 3D + 2D (diene / dienophile / adduct — CIDs **to verify at build**, defined-stereo for
endo/exo), FMO note (HOMO-diene/LUMO-dienophile; EWGs lower the dienophile LUMO), stereospecific *syn* addition,
references fact-checked incl. the original **Diels & Alder (1928)**.

**Recommended structure:** one flagship `orgolabs/diels-alder` on the system the handout covers (usually #1) + a
short "dienes compared" section pulling in #2 and #3 — so the **endo (kinetic) vs exo (thermodynamic, reversible)**
contrast becomes a teaching highlight in one page. Alternative: three sibling labs sharing the engine.

**Next step:** user supplies handout PDF(s) → confirm flagship-vs-three-labs → verify CIDs → scaffold → build.

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
