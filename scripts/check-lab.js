#!/usr/bin/env node
/*
 * orgolabs lab validator — enforces the window.LAB + content.md contract so labs
 * stay consistent and changes are safe. Catches the real drift we've hit:
 * GFM strikethrough from ~, Unicode formula sub/superscripts, viewer/structure key
 * mismatches, missing mount divs, broken reference/calculator config, missing PDFs.
 *
 * Usage:
 *   node check-lab.js                 # validate every lab (siblings of this repo)
 *   node check-lab.js ../diels-alder  # validate one lab
 *   node check-lab.js --shared ../shared ../aspirin-synthesis
 *
 * Exit code 0 = all pass; 1 = at least one ERROR. Warnings never fail the run.
 * Requires: marked (npm i in this repo). The engine contract is documented in SCHEMA.md.
 */
const fs = require("fs");
const path = require("path");

let marked;
try { ({ marked } = require("marked")); }
catch { console.error("ERROR: marked not installed. Run `npm install` in lab-playbook/ first."); process.exit(2); }

// ---- args ----
const argv = process.argv.slice(2);
let sharedDir = null;
const targets = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--shared") sharedDir = path.resolve(argv[++i]);
  else targets.push(path.resolve(argv[i]));
}
const ROOT = path.resolve(__dirname, "..", ".."); // orgolabs/
if (!sharedDir) sharedDir = path.join(ROOT, "shared");

function isLab(dir) {
  return fs.existsSync(path.join(dir, "index.html")) &&
    fs.existsSync(path.join(dir, "content.md")) &&
    fs.existsSync(path.join(dir, "js", "structures.js"));
}
let labs = targets.length ? targets : fs.readdirSync(ROOT)
  .map(d => path.join(ROOT, d))
  .filter(d => { try { return fs.statSync(d).isDirectory() && isLab(d); } catch { return false; } });

// ---- helpers ----
const SUB = /[₀₁₂₃₄₅₆₇₈₉]/;                       // subscript digits
const SUPCHG = /[⁺⁻]/;                            // superscript + / -
// allow these Unicode bits in prose: units (cm⁻¹, m³…), degrees, ¹H NMR, von-Baeyer locants
function stripAllowedUnicode(s) {
  return s
    .replace(/cm⁻¹|µ[LlMm]|m³|m²|°[CF]?/g, "")     // units
    .replace(/¹H|¹³C|³¹P/g, "")                     // NMR nuclides
    .replace(/\[[0-9.]+\.0[²³⁴⁵⁶⁷⁸⁹⁰¹,]+\]/g, "");  // bicyclo/oxatricyclo locants e.g. [5.2.1.0²,⁶]
}
function parseObjectLiteral(src, varName) {
  const m = src.match(new RegExp(varName.replace(".", "\\.") + "\\s*=\\s*({[\\s\\S]*?});\\s*</script>"));
  const body = m ? m[1] : (src.match(new RegExp(varName.replace(".", "\\.") + "\\s*=\\s*({[\\s\\S]*});")) || [])[1];
  if (!body) return null;
  return new Function("return (" + body + ")")();
}
function parseStructures(src) {
  const w = {};
  new Function("window", src)(w);
  return w.STRUCTURES || {};
}

// ---- per-lab validation ----
function checkLab(dir) {
  const name = path.basename(dir);
  const errors = [], warnings = [];
  const E = m => errors.push(m), W = m => warnings.push(m);
  const read = f => fs.readFileSync(path.join(dir, f), "utf8");

  // --- window.LAB ---
  let LAB = null;
  try { LAB = parseObjectLiteral(read("index.html"), "window.LAB"); }
  catch (e) { E("index.html: window.LAB does not parse as JS — " + e.message); }
  if (LAB && typeof LAB !== "object") { E("window.LAB is not an object"); LAB = null; }

  // --- structures ---
  let STRUCT = {};
  try { STRUCT = parseStructures(read("js/structures.js")); }
  catch (e) { E("js/structures.js: does not parse — " + e.message); }
  const sKeys = Object.keys(STRUCT);

  if (LAB) {
    ["repo", "labName", "eyebrow", "title", "lede", "content"].forEach(k => {
      if (!LAB[k] || !String(LAB[k]).trim()) E(`window.LAB.${k} is required and must be non-empty`);
    });
    if (LAB.repo && LAB.repo !== name) W(`window.LAB.repo ("${LAB.repo}") != directory name ("${name}")`);
    if (!LAB.reaction) W("window.LAB.reaction (hero equation) is missing");

    // viewers
    const vids = new Set(), vkeys = new Set();
    (LAB.viewers || []).forEach((v, i) => {
      ["id", "key", "role", "name"].forEach(k => { if (!v[k]) E(`viewers[${i}] missing "${k}"`); });
      if (v.id && vids.has(v.id)) E(`duplicate viewer id "${v.id}"`); vids.add(v.id);
      if (v.key && vkeys.has(v.key)) E(`duplicate viewer key "${v.key}"`); vkeys.add(v.key);
      if (v.key && !sKeys.includes(v.key)) E(`viewers[${i}].key "${v.key}" has no entry in js/structures.js`);
    });
    // every structure should be real 3D SDF
    sKeys.forEach(k => {
      const sdf = STRUCT[k] || "";
      if (!/V2000/.test(sdf)) E(`structures.js "${k}" is not a valid MDL molblock (no V2000)`);
      else if (!/PUBCHEM/.test(sdf)) W(`structures.js "${k}" has no PubChem tags — may be a computed stopgap, not the real PubChem geometry`);
    });

    // pathway
    (LAB.pathway || []).forEach((it, i) => {
      if (it.plus) return;
      if (it.op) { if (!it.op.cond) W(`pathway[${i}].op has no cond`); return; }
      if (!it.node) { E(`pathway[${i}] is neither node, op, nor plus`); return; }
      if (!it.node.img) { E(`pathway[${i}].node has no img`); return; }
      const png = path.join(sharedDir, "mol2d", it.node.img);
      if (!fs.existsSync(png)) E(`pathway[${i}] image "${it.node.img}" not found in shared/mol2d/`);
    });

    // references
    (LAB.references || []).forEach((r, i) => {
      ["authors", "title", "meta"].forEach(k => { if (!r[k]) E(`references[${i}] missing "${k}"`); });
      if (!["open", "paywall"].includes(r.access)) E(`references[${i}].access must be "open" or "paywall" (got ${JSON.stringify(r.access)})`);
      // url+linkText are optional (book refs omit both) but must come as a pair
      if (Boolean(r.url) !== Boolean(r.linkText)) E(`references[${i}]: "url" and "linkText" must be provided together (or both omitted for a book)`);
    });

    // calculator
    const c = LAB.calculator;
    if (c) {
      (c.inputs || []).forEach((x, i) => { if (!x.id) E(`calculator.inputs[${i}] missing id`); });
      (c.outputs || []).forEach((x, i) => { if (!x.id) E(`calculator.outputs[${i}] missing id`); });
      if (typeof c.compute !== "function") E("calculator.compute must be a function");
      else {
        try {
          const vals = {}; (c.inputs || []).forEach(x => { vals[x.id] = parseFloat(x.value) || 0; });
          const out = c.compute(vals) || {};
          const got = new Set(Object.keys(out));
          (c.outputs || []).forEach(o => { if (!got.has(o.id)) W(`calculator: compute() did not return output "${o.id}" for default inputs`); });
        } catch (e) { E("calculator.compute threw on default inputs — " + e.message); }
      }
    }
  }

  // --- content.md ---
  let md = "";
  try { md = read("content.md"); } catch { E("content.md unreadable"); }
  if (md) {
    const html = marked.parse(md);
    const dels = (html.match(/<del>/g) || []).length;
    if (dels) E(`content.md renders ${dels} strikethrough span(s) <del> — a stray "~" pair. Use "≈" / "about".`);
    if (/~/.test(md)) W(`content.md contains "~" (${(md.match(/~/g) || []).length}) — fragile under GFM; prefer "≈".`);
    // mount divs for each widget the LAB declares
    if (LAB) {
      const need = [];
      if ((LAB.viewers || []).length) need.push("viewers");
      if ((LAB.pathway || []).length) need.push("pathway");
      if (LAB.calculator) need.push("calculator");
      if ((LAB.references || []).length) need.push("references");
      need.forEach(w => { if (!new RegExp(`data-mount=["']${w}["']`).test(md)) E(`content.md is missing <div data-mount="${w}"></div>`); });
    }
    // Unicode formula sub/superscripts (heuristic; units/locants/NMR allowed)
    md.split("\n").forEach((line, i) => {
      const t = stripAllowedUnicode(line);
      if (SUB.test(t) || SUPCHG.test(t)) W(`content.md:${i + 1} Unicode sub/superscript in a formula — use mhchem $\\ce{...}$: ${line.trim().slice(0, 70)}`);
    });
    // dl-btn PDF exists
    const pdf = (md.match(/href="(docs\/[^"]+\.pdf)"/) || [])[1];
    if (pdf && !fs.existsSync(path.join(dir, pdf))) E(`content.md links ${pdf} but that file is missing`);
  }

  // --- repo hygiene ---
  if (!fs.existsSync(path.join(dir, "README.md"))) W("README.md missing");
  if (!fs.existsSync(path.join(dir, ".nojekyll"))) W(".nojekyll missing (GitHub Pages may strip files)");

  return { name, errors, warnings };
}

// ---- run ----
let totalErr = 0, totalWarn = 0;
console.log(`Validating ${labs.length} lab(s) against the window.LAB + content.md contract (shared: ${path.relative(ROOT, sharedDir) || "shared"})\n`);
for (const dir of labs.sort()) {
  const r = checkLab(dir);
  totalErr += r.errors.length; totalWarn += r.warnings.length;
  const mark = r.errors.length ? "✗" : "✓";
  console.log(`${mark} ${r.name}${r.errors.length ? "" : r.warnings.length ? "  (" + r.warnings.length + " warning" + (r.warnings.length > 1 ? "s" : "") + ")" : ""}`);
  r.errors.forEach(m => console.log("    ERROR  " + m));
  r.warnings.forEach(m => console.log("    warn   " + m));
}
console.log(`\n${totalErr ? "✗" : "✓"} ${labs.length} lab(s): ${totalErr} error(s), ${totalWarn} warning(s)`);
process.exit(totalErr ? 1 : 0);
