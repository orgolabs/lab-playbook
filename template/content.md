<!-- All prose for this lab lives here. Write Markdown; write chemistry as inline $\ce{...}$
     (KaTeX + mhchem — correct subscripts, charges, arrows). Each "## " heading becomes a
     section card and a TOC entry (keep headings short, e.g. "1 · 3D structures").
     Interactive blocks are MOUNT POINTS filled by the engine from window.LAB:
       <div data-mount="viewers"></div>  <div data-mount="pathway"></div>
       <div data-mount="calculator"></div>  <div data-mount="references"></div>
     Styled blocks (.mech-grid / .callout / .safety / .dl-btn) are inline HTML here — use
     <strong>/<em> inside them (Markdown isn't processed inside raw HTML blocks), but $\ce{}$ still renders. -->

## About

TODO background for a classroom reader. Example inline formula: $\ce{C10H16O}$; example reagent: $\ce{NaBH4}$.

## 1 · 3D structures

TODO: one or two sentences on what to look at.

<div data-mount="viewers"></div>

## 2 · Mechanism & pathway

TODO: the mechanism in plain language, with $\ce{...}$ where it helps.

<div data-mount="pathway"></div>

<div class="mech-grid">
<article class="mech-step"><span class="step-num">1</span><h3>Step title</h3><p>TODO ($\ce{...}$ ok).</p></article>
<article class="mech-step major-accent"><span class="step-num">2</span><h3>Step title</h3><p>TODO.</p></article>
<article class="mech-step minor-accent"><span class="step-num">3</span><h3>Step title</h3><p>TODO.</p></article>
</div>

<div class="callout info"><h3>Callout title</h3><p>TODO a useful aside (HTML + $\ce{}$ ok).</p></div>

| Property | A | B |
|---|---|---|
| Systematic (IUPAC) name | … | … |
| Formula | $\ce{...}$ | $\ce{...}$ |
| Molar mass (g/mol) | … | … |
| PubChem CID | [cid](https://pubchem.ncbi.nlm.nih.gov/compound/cid) | [cid](https://pubchem.ncbi.nlm.nih.gov/compound/cid) |

## 3 · Procedure

TODO: based on the lab handout (bundled in `docs/`). A study aid, not a substitute for a supervised SOP.

<a class="dl-btn" href="docs/handout.pdf" target="_blank" rel="noopener">⬇ Download the lab handout (PDF)</a>

| Reagent | Amount | Role |
|---|---|---|
| … | … | … |

1. TODO step ($\ce{...}$ ok).
2. TODO step.

<div class="safety"><strong>Safety:</strong> TODO hazards + PPE. <strong>Waste:</strong> TODO disposal.</div>

## 4 · Calculator

<div data-mount="calculator"></div>

## 5 · References

<div data-mount="references"></div>

TODO closing fineprint: molecular data from [PubChem](https://pubchem.ncbi.nlm.nih.gov/) (public domain); 3D by [3Dmol.js](https://3dmol.csb.pitt.edu/); chemistry typeset with KaTeX + mhchem.
