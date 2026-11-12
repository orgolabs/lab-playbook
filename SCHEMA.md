# The lab contract (`window.LAB` + `content.md`)

Every orgolabs lab is a thin page the shared engine (`shared/lab.js`) renders from two things:
a **`window.LAB`** config object in `index.html`, and a **`content.md`** Markdown file.
`scripts/check-lab.js` validates both — run it before every change (`scripts/check-lab.sh`).

## `window.LAB` (in `index.html`)

| Field | Required | Notes |
|---|---|---|
| `repo` | ✅ | GitHub repo name; must equal the directory name. |
| `labName` | ✅ | Short name for the brand bar. |
| `eyebrow` | ✅ | Kicker line above the title. |
| `title` | ✅ | Hero `<h1>`. |
| `lede` | ✅ | One-paragraph hook. HTML ok (`<strong>`, `<em>`); **no `$…$`** here. |
| `reaction` | ⚠️ rec. | Hero equation in **mhchem** (`\\ce{...}`, double backslash in the JS string). |
| `content` | ✅ | Usually `"content.md"`. |
| `viewers[]` | — | `{ id, key, kind:"start\|major\|minor", role, name, iupac, note }`. `key` **must** exist in `js/structures.js`; `id` and `key` unique. `note`/`iupac` render in `#main`, so chemistry there is mhchem `$\\ce{...}$`. |
| `pathway[]` | — | items: `{ node:{ img, name, sub, kind } }` \| `{ op:{ cond, sub } }` \| `{ plus:true }`. `node.img` must exist in `shared/mol2d/`. `cond` is mhchem (no `$`); `sub` renders via KaTeX so wrap chemistry as `$\\ce{...}$`. |
| `pathwayCaption` | — | One line under the pathway (HTML ok). |
| `calculator` | — | `{ intro, inputs:[{id,label,value,step,min,note,optional}], outputs:[{id,label,unit,kind}], compute(v)⇒{outputId:value} }`. `compute` must not throw on the default inputs. |
| `references[]` | — | `{ authors, title, meta, note, url, linkText, access:"open"\|"paywall" }`. `authors`/`title`/`meta`/`access` required; `note` optional; `url`+`linkText` optional but come as a **pair** (book refs omit both — the engine then renders no link). |

## `content.md`

- `## ` headings become section cards + TOC chips (keep short, e.g. `1 · 3D structures`).
- Interactive widgets are **mount points** the engine fills from `window.LAB`:
  `<div data-mount="viewers"></div>`, `pathway`, `calculator`, `references`.
  A widget declared in `window.LAB` **must** have its mount div, or it won't render.
- Chemistry is **mhchem** `$\ce{...}$` (single backslash in Markdown). **Never** Unicode
  subscripts/superscripts for formulas (`NaBH₄`, `–CO₂H`, `H⁻`) — they bypass KaTeX and render
  inconsistently. Units in prose are fine (`cm⁻¹`, `°C`), as are IUPAC locants (`[5.2.1.0²,⁶]`) and `¹H NMR`.
- **Never** use a bare `~` for "approximately" — a pair of `~` in one block renders as GFM
  ~~strikethrough~~. Use `≈` or the word "about".
- The procedure download button links `docs/<handout>.pdf`, which must exist.

## What the validator checks

`scripts/check-lab.sh` (runs `check-lab.js`) **fails (exit 1)** on: `window.LAB`/`structures.js` parse
errors; missing required fields; viewer `key` with no structure (or a structure that isn't a real
`V2000` molblock); duplicate viewer ids/keys; malformed pathway items or missing `mol2d` images;
references missing fields or a bad `access`; a `calculator.compute` that throws; **any `<del>`
strikethrough in the rendered `content.md`**; a missing mount div; or a missing linked PDF.
It **warns** (non-failing) on: missing `reaction`; a structure without PubChem tags (stopgap geometry);
stray `~`; Unicode formula sub/superscripts; `repo` ≠ dir name; missing `README.md`/`.nojekyll`.
