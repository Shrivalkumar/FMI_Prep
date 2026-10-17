/* ============================================================
   app.js — shared UI: theme, mobile nav, math rendering,
   lesson completion, sidebar state, and search index.
   ============================================================ */
(function (w, d) {
  "use strict";

  /* ---------- Theme ---------- */
  var THEME_KEY = "fmi_theme";
  function getTheme() { try { return w.localStorage.getItem(THEME_KEY); } catch (e) { return null; } }
  function applyTheme(t) {
    if (t === "light" || t === "dark") d.documentElement.setAttribute("data-theme", t);
    else d.documentElement.removeAttribute("data-theme");
  }
  applyTheme(getTheme()); // run ASAP (script is in <head> defer, acceptable)

  function currentEffective() {
    var t = getTheme();
    if (t) return t;
    return (w.matchMedia && w.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }
  w.FMITheme = {
    toggle: function () {
      var next = currentEffective() === "dark" ? "light" : "dark";
      try { w.localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
      updateThemeBtns();
    }
  };
  function updateThemeBtns() {
    var dark = currentEffective() === "dark";
    d.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.textContent = dark ? "☀️" : "🌙";
      b.title = dark ? "Switch to light mode" : "Switch to dark mode";
    });
  }

  /* ---------- Math rendering (KaTeX, with graceful fallback) ---------- */
  w.renderMathIn = function (node) {
    if (!node) return;
    if (w.renderMathInElement) {
      try {
        w.renderMathInElement(node, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "\\[", right: "\\]", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false }
          ],
          throwOnError: false
        });
      } catch (e) {}
    }
  };

  /* ---------- Mobile sidebar ---------- */
  function wireNav() {
    var side = d.querySelector(".sidebar");
    var burger = d.querySelector("[data-menu]");
    var scrim = d.querySelector(".scrim");
    if (burger && side) {
      burger.addEventListener("click", function () {
        side.classList.toggle("open");
        if (scrim) scrim.classList.toggle("show");
      });
    }
    if (scrim) scrim.addEventListener("click", function () {
      side.classList.remove("open"); scrim.classList.remove("show");
    });
    d.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", w.FMITheme.toggle);
    });
    updateThemeBtns();
  }

  /* ---------- Nav active + done states ---------- */
  function wireNavStates() {
    if (!w.Progress) return;
    var path = location.pathname.split("/").pop() || "index.html";
    d.querySelectorAll(".nav-link[data-lesson]").forEach(function (a) {
      var id = a.getAttribute("data-lesson");
      if (w.Progress.isDone(id)) a.classList.add("is-done");
    });
    d.querySelectorAll(".nav-link").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("/").pop();
      if (href === path) a.classList.add("active");
    });
  }

  /* ---------- Lesson completion ---------- */
  function wireCompletion() {
    var btn = d.querySelector("[data-complete]");
    if (!btn || !w.Progress) return;
    var id = btn.getAttribute("data-complete");
    function refresh() {
      var done = w.Progress.isDone(id);
      btn.textContent = done ? "✓ Completed — click to undo" : "Mark lesson complete";
      btn.classList.toggle("primary", !done);
      btn.classList.toggle("ghost", done);
      var note = d.querySelector("[data-complete-note]");
      if (note) note.textContent = done ? "Saved. This lesson shows a ✓ on the dashboard." : "Finished reading and the quiz? Mark it done to track progress.";
    }
    btn.addEventListener("click", function () { w.Progress.toggle(id); refresh(); });
    refresh();
  }

  /* ---------- Build table of contents from h2[id] ---------- */
  function buildTOC() {
    var toc = d.querySelector("[data-toc]");
    if (!toc) return;
    var hs = d.querySelectorAll(".wrap h2[id]");
    if (!hs.length) { toc.parentElement && (toc.parentElement.style.display = "none"); return; }
    var html = "";
    hs.forEach(function (h) { html += '<a href="#' + h.id + '">' + h.textContent + "</a>"; });
    toc.innerHTML = html;
  }

  /* ---------- Search index (concepts, formulas, definitions) ---------- */
  var L = "lessons/";
  w.FMI_SEARCH = [
    { t: "Accounting equation (Assets = Liabilities + Equity)", u: L + "lesson-01.html#equation", k: "balance sheet dual aspect double entry" },
    { t: "Accrual, matching & realisation concepts", u: L + "lesson-01.html#concepts", k: "prudence consistency going concern revenue recognition" },
    { t: "Depreciation — straight line & reducing balance", u: L + "lesson-01.html#depreciation", k: "slm wdv amortisation residual value" },
    { t: "Income statement line items (COGS, EBIT, PAT, EPS)", u: L + "lesson-01.html#income", k: "gross profit operating profit net income" },
    { t: "Cash flow statement & reconciliation", u: L + "lesson-01.html#cashflow", k: "operating investing financing non-cash" },
    { t: "Liquidity ratios (current, quick, cash)", u: L + "lesson-02.html#liquidity", k: "acid test working capital" },
    { t: "Efficiency ratios & operating cycle", u: L + "lesson-02.html#efficiency", k: "inventory days receivable days payable days turnover" },
    { t: "Solvency: debt-to-equity & interest coverage", u: L + "lesson-02.html#solvency", k: "leverage gearing" },
    { t: "Profitability, ROCE, ROE & DuPont", u: L + "lesson-02.html#profitability", k: "margin return on equity net margin asset turnover" },
    { t: "Market ratios (EPS, P/E, dividend yield, EV)", u: L + "lesson-02.html#market", k: "price earnings enterprise value market cap payout" },
    { t: "Cost classification (fixed, variable, direct, sunk)", u: L + "lesson-03.html#classify", k: "behaviour traceability relevant opportunity cost" },
    { t: "Overhead absorption rate (OAR)", u: L + "lesson-03.html#overhead", k: "under over absorbed product cost" },
    { t: "Marginal vs absorption costing & contribution", u: L + "lesson-03.html#marginal", k: "period cost" },
    { t: "CVP: break-even, P/V ratio, margin of safety", u: L + "lesson-03.html#cvp", k: "cost volume profit target profit" },
    { t: "Compounding & discounting (PV, FV)", u: L + "lesson-04.html#pvfv", k: "time value money factor rule of 72" },
    { t: "Annuities (ordinary & due)", u: L + "lesson-04.html#annuity", k: "emi sip lease pv fv" },
    { t: "Perpetuity & growing perpetuity", u: L + "lesson-04.html#perpetuity", k: "preference share gordon terminal value" },
    { t: "NPV — net present value", u: L + "lesson-05.html#npv", k: "capital budgeting discounted cash flow" },
    { t: "IRR — internal rate of return", u: L + "lesson-05.html#irr", k: "interpolation hurdle rate" },
    { t: "Payback & discounted payback", u: L + "lesson-05.html#payback", k: "recovery period" },
    { t: "Profitability index & capital rationing", u: L + "lesson-05.html#pi", k: "pi ranking budget" },
    { t: "Systematic vs unsystematic risk", u: L + "lesson-06.html#risk", k: "market specific diversifiable beta" },
    { t: "CAPM — cost of equity", u: L + "lesson-06.html#capm", k: "beta risk free market premium alpha" },
    { t: "Dividend Growth Model (Gordon)", u: L + "lesson-06.html#dgm", k: "sustainable growth retention roe ke" },
    { t: "Bond valuation (coupon, zero, perpetual)", u: L + "lesson-07.html#bonds", k: "face value redemption discount premium" },
    { t: "Yield to maturity (YTM)", u: L + "lesson-07.html#ytm", k: "yield coupon rate" },
    { t: "Stock valuation (DDM: zero, constant, two-stage)", u: L + "lesson-07.html#ddm", k: "gordon growth dividend discount" },
    { t: "WACC — weighted average cost of capital", u: L + "lesson-07.html#wacc", k: "book value market value weights tax shield" },
    { t: "Free cash flow (FCF, FCFF, FCFE)", u: L + "lesson-08.html#fcf", k: "operating cash flow capex working capital" },
    { t: "DCF valuation & terminal value", u: L + "lesson-08.html#dcf", k: "enterprise value intrinsic multiples" },
    { t: "Portfolio theory & diversification", u: L + "lesson-09.html#portfolio", k: "markowitz correlation efficient frontier" },
    { t: "Efficient Market Hypothesis (EMH)", u: L + "lesson-09.html#emh", k: "weak semi-strong strong active passive" },
    { t: "Derivatives: options, futures, forwards, swaps", u: L + "lesson-10.html#types", k: "call put hedging speculation underlying" },
    { t: "Option payoffs & moneyness (ITM/OTM)", u: L + "lesson-10.html#payoff", k: "premium strike price buyer seller" },
    { t: "Black-Scholes model (intro)", u: L + "lesson-10.html#bs", k: "volatility option pricing" },
    { t: "Securitization, MBS & tranching", u: L + "lesson-11.html#securit", k: "spv senior mezzanine equity subordination ptc" },
    { t: "Credit spreads & credit default swaps (CDS)", u: L + "lesson-11.html#cds", k: "basis points aig counterparty risk" },
    { t: "The 2008 financial crisis", u: L + "lesson-11.html#crisis", k: "lehman subprime cdo leverage" },
    { t: "Market-linked notes (MLDs)", u: L + "lesson-11.html#mln", k: "participation rate principal protection" },
    { t: "Formula sheet (all formulas)", u: "formula-sheet.html", k: "formulas reference" },
    { t: "Practice problems", u: "practice.html", k: "numerical exam questions" },
    { t: "Mock test", u: "mock-test.html", k: "exam quiz timed" }
  ];

  w.FMISearch = function (query) {
    query = (query || "").trim().toLowerCase();
    if (!query) return [];
    var terms = query.split(/\s+/);
    return w.FMI_SEARCH.map(function (item) {
      var hay = (item.t + " " + item.k).toLowerCase();
      var score = 0;
      terms.forEach(function (t) { if (hay.indexOf(t) > -1) score += 1; if (item.t.toLowerCase().indexOf(t) > -1) score += 1; });
      return { item: item, score: score };
    }).filter(function (x) { return x.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 12)
      .map(function (x) { return x.item; });
  };

  /* ---------- Interactive numeric practice (.try blocks) ---------- */
  // <div class="try" data-answer="37908" data-tol="2%"> ... <input> ...
  //   <div class="sol" hidden>worked solution HTML</div> </div>
  function wireTry() {
    d.querySelectorAll(".try").forEach(function (box) {
      if (box.__wired) return; box.__wired = true;
      var ans = parseFloat(box.getAttribute("data-answer"));
      var tolRaw = box.getAttribute("data-tol") || "1%";
      var input = box.querySelector("input");
      var fb = box.querySelector(".fb") || (function () { var f = el("div", "fb"); box.appendChild(f); return f; })();
      var sol = box.querySelector(".sol");
      var checkBtn = box.querySelector("[data-check]");
      var solBtn = box.querySelector("[data-show-sol]");

      function tol() {
        if (tolRaw.indexOf("%") > -1) return Math.abs(ans) * parseFloat(tolRaw) / 100;
        return parseFloat(tolRaw);
      }
      function check() {
        var val = parseFloat((input.value || "").replace(/[₹,%\s]/g, ""));
        if (isNaN(val)) { fb.className = "fb no"; fb.textContent = "Enter a number first."; return; }
        if (Math.abs(val - ans) <= tol()) {
          fb.className = "fb ok"; fb.innerHTML = "✓ Correct! " + (box.getAttribute("data-ok") || "Well done.");
        } else {
          fb.className = "fb no"; fb.innerHTML = "✗ Not yet — check your working and try again. (Within " + tolRaw + " tolerance.)";
        }
      }
      if (checkBtn) checkBtn.addEventListener("click", check);
      if (input) input.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
      if (solBtn && sol) solBtn.addEventListener("click", function () {
        sol.hidden = !sol.hidden; solBtn.textContent = sol.hidden ? "Show solution" : "Hide solution";
        if (!sol.hidden) w.renderMathIn(sol);
      });
    });
  }
  function el(tag, cls, html) { var e = d.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  w.FMIWireTry = wireTry; // allow pages that render .try blocks dynamically to (re)wire them

  /* ---------- init ---------- */
  function init() {
    wireNav();
    wireNavStates();
    wireCompletion();
    buildTOC();
    wireTry();
    w.renderMathIn(d.body);
    if (w.FMICalc) w.FMICalc.mountAll(d);
  }
  if (d.readyState !== "loading") init();
  else d.addEventListener("DOMContentLoaded", init);
})(window, document);
