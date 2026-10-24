// Per-lab stoichiometry & yield calculator — EDIT for each reaction.
// Pattern: read numeric inputs, compute mmol / limiting reagent / theoretical & percent yield,
// write results into the #o-* spans. Pre-fill the inputs in index.html with the experiment's amounts.
(function () {
  "use strict";

  // TODO: set molar masses (g/mol) and any densities for this lab.
  // var MW_A = 0, MW_PRODUCT = 0;

  var els = {};
  // TODO: list every input id and output id this lab uses, e.g.:
  // ["in-a", "in-b", "in-isolated", "o-ammol", "o-theory", "o-yield"].forEach(function (id) {
  //   els[id] = document.getElementById(id);
  // });

  function num(el) { var v = parseFloat(el && el.value); return isFinite(v) && v >= 0 ? v : 0; }
  function set(el, value, digits) { if (el) el.textContent = value > 0 ? value.toFixed(digits == null ? 2 : digits) : "—"; }

  function update() {
    // TODO: compute and set outputs. Example:
    // var a = num(els["in-a"]);
    // var theory = (a / MW_A) * MW_PRODUCT;
    // set(els["o-theory"], theory, 3);
  }

  Object.keys(els).forEach(function (id) {
    if (els[id] && els[id].tagName === "INPUT") els[id].addEventListener("input", update);
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", update);
  else update();
})();
