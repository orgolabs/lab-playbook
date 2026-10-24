# orgolabs roadmap

## Shipped
- ✅ **Reduction of Camphor** — NaBH₄ reduction → isoborneol/borneol (steric approach control). → `orgolabs/camphor-reduction`
- ✅ **Synthesis of Aspirin** — salicylic acid + acetic anhydride (Olmsted 1998). → `orgolabs/aspirin-synthesis`

## Planned
- ⬜ **Diels–Alder reaction** — a [4+2] cycloaddition (e.g. cyclopentadiene + maleic anhydride → norbornene endo adduct). Good fit for the 3D viewer: show diene, dienophile, and the bicyclic endo product; mechanism = concerted, endo rule; calculator = limiting reagent + yield.
- ⬜ **NMR lab** — interpreting ¹H / ¹³C NMR. Different shape from the synthesis labs: likely an interactive spectrum (peaks ↔ structure highlighting) rather than a 3D-reaction viewer. Scope TBD.
- ⬜ Further labs "as we see fit."

## Platform / infrastructure
- ✅ Org profile landing page (`orgolabs/.github`).
- ✅ Private playbook + reusable template (this repo).
- ✅ Codespaces devcontainers (Node + Claude Code + auto-served preview) in each repo.
- ✅ Branch protection + issues/discussions on the public labs.
- ⬜ Org avatar upload (manual, web-only — pending user).
- ⬜ Consider: shared CSS as a versioned package instead of copy-per-repo; a tiny test/CI check (HTML/JS lint, link check) via GitHub Actions.
