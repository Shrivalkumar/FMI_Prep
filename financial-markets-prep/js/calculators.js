/* ============================================================
   calculators.js — interactive finance calculators.
   Auto-mounts into any element: <div data-calc="pvfv"></div>
   Supported: pvfv, compound, annuity, perpetuity, npv, bond,
              ytm, capm, dgm, wacc, breakeven.
   ============================================================ */
(function (w, d) {
  "use strict";

  /* ---------- formatting ---------- */
  function inr(x) {
    if (!isFinite(x)) return "—";
    var neg = x < 0; x = Math.abs(x);
    var s = x.toLocaleString("en-IN", { maximumFractionDigits: 2 });
    return (neg ? "−₹" : "₹") + s;
  }
  function num(x, dp) { return isFinite(x) ? Number(x).toLocaleString("en-IN", { maximumFractionDigits: dp == null ? 2 : dp }) : "—"; }
  function pct(x, dp) { return isFinite(x) ? Number(x).toFixed(dp == null ? 2 : dp) + "%" : "—"; }

  function build(mount, cfg) {
    mount.classList.add("calc");
    var head = '<div class="calc-head"><span class="ci">🧮</span>' + cfg.title + "</div>";
    if (cfg.sub) head += '<div class="note" style="color:var(--ink-faint);font-size:13px">' + cfg.sub + "</div>";
    var fields = '<div class="fields">';
    cfg.fields.forEach(function (f) {
      if (f.type === "select") {
        fields += '<div class="field"><label>' + f.label + '</label><select data-k="' + f.key + '">' +
          f.options.map(function (o) { return '<option value="' + o.v + '"' + (o.v == f.val ? " selected" : "") + ">" + o.t + "</option>"; }).join("") +
          "</select></div>";
      } else {
        fields += '<div class="field"><label>' + f.label + '</label><input type="number" step="' + (f.step || "any") +
          '" data-k="' + f.key + '" value="' + f.val + '"></div>';
      }
    });
    fields += "</div>";
    mount.innerHTML = head + fields + '<div class="result"></div>';

    var res = mount.querySelector(".result");
    function vals() {
      var o = {};
      mount.querySelectorAll("[data-k]").forEach(function (inp) {
        o[inp.getAttribute("data-k")] = inp.tagName === "SELECT" ? inp.value : parseFloat(inp.value);
      });
      return o;
    }
    function recompute() {
      try { res.innerHTML = cfg.compute(vals(), { inr: inr, num: num, pct: pct }); }
      catch (e) { res.innerHTML = '<span class="note">Enter valid numbers.</span>'; }
    }
    mount.querySelectorAll("[data-k]").forEach(function (inp) { inp.addEventListener("input", recompute); inp.addEventListener("change", recompute); });
    recompute();
  }

  /* ---------- helpers ---------- */
  function npv(rate, cfs) { // cfs[0] at t=0
    var r = rate / 100, v = 0;
    for (var t = 0; t < cfs.length; t++) v += cfs[t] / Math.pow(1 + r, t);
    return v;
  }
  function irr(cfs) {
    var lo = -0.9, hi = 10, mid, f;
    function npvR(r) { var v = 0; for (var t = 0; t < cfs.length; t++) v += cfs[t] / Math.pow(1 + r, t); return v; }
    if (npvR(lo) * npvR(hi) > 0) return NaN;
    for (var i = 0; i < 200; i++) { mid = (lo + hi) / 2; f = npvR(mid); if (Math.abs(f) < 1e-6) break; if (npvR(lo) * f < 0) hi = mid; else lo = mid; }
    return mid * 100;
  }

  var BUILDERS = {
    pvfv: function (m) {
      build(m, {
        title: "Present Value / Future Value (single sum)",
        sub: "FV = PV × (1+r)ⁿ. Fill PV to compound forward, or FV to discount back.",
        fields: [
          { key: "pv", label: "Present value ₹ (today)", val: 10000 },
          { key: "fv", label: "Future value ₹ (later)", val: 0 },
          { key: "r", label: "Rate per period %", val: 10 },
          { key: "n", label: "Periods (n)", val: 5 }
        ],
        compute: function (v, F) {
          var f = Math.pow(1 + v.r / 100, v.n);
          var out = "";
          if (v.pv) out += '<div class="big">' + F.inr(v.pv * f) + '</div><div class="note">FV of ' + F.inr(v.pv) + " in " + v.n + " periods at " + F.pct(v.r) + " (factor " + F.num(f, 4) + ").</div>";
          if (v.fv) out += '<div style="margin-top:8px">PV of ' + F.inr(v.fv) + ' = <b>' + F.inr(v.fv / f) + "</b></div>";
          return out || '<span class="note">Enter a PV or an FV.</span>';
        }
      });
    },
    compound: function (m) {
      build(m, {
        title: "Compound vs Simple Interest",
        fields: [
          { key: "p", label: "Principal ₹", val: 100 },
          { key: "r", label: "Rate % p.a.", val: 10 },
          { key: "n", label: "Years", val: 5 }
        ],
        compute: function (v, F) {
          var comp = v.p * Math.pow(1 + v.r / 100, v.n);
          var simp = v.p * (1 + (v.r / 100) * v.n);
          return '<div class="big">' + F.inr(comp) + '</div>' +
            '<div class="note">Compound value after ' + v.n + " yrs. Simple interest would give " + F.inr(simp) +
            " — the extra " + F.inr(comp - simp) + " is interest-on-interest.</div>";
        }
      });
    },
    annuity: function (m) {
      build(m, {
        title: "Annuity — PV & FV",
        sub: "Equal payments each period. Ordinary = end of period; Due = start.",
        fields: [
          { key: "pmt", label: "Payment per period ₹", val: 10000 },
          { key: "r", label: "Rate per period %", val: 10 },
          { key: "n", label: "Number of payments", val: 5 },
          { key: "type", label: "Timing", val: "ord", type: "select", options: [{ v: "ord", t: "Ordinary (end)" }, { v: "due", t: "Due (start)" }] }
        ],
        compute: function (v, F) {
          var r = v.r / 100;
          var pvF = (1 - Math.pow(1 + r, -v.n)) / r;
          var fvF = (Math.pow(1 + r, v.n) - 1) / r;
          var adj = v.type === "due" ? (1 + r) : 1;
          return '<div>PV = <span class="big" style="font-size:20px">' + F.inr(v.pmt * pvF * adj) + '</span></div>' +
            '<div style="margin-top:6px">FV = <b>' + F.inr(v.pmt * fvF * adj) + "</b></div>" +
            '<div class="note">PV factor ' + F.num(pvF, 4) + ", FV factor " + F.num(fvF, 4) +
            (v.type === "due" ? " (×(1+r) for annuity due)" : "") + ".</div>";
        }
      });
    },
    perpetuity: function (m) {
      build(m, {
        title: "Perpetuity (level & growing)",
        sub: "Level: PV = C ÷ r.  Growing: PV = C₁ ÷ (r − g), needs r > g.",
        fields: [
          { key: "c", label: "Cash flow ₹ (first/next)", val: 500 },
          { key: "r", label: "Discount rate %", val: 10 },
          { key: "g", label: "Growth g %", val: 0 }
        ],
        compute: function (v, F) {
          var r = v.r / 100, g = v.g / 100;
          if (g >= r) return '<span class="note" style="color:var(--bad)">Growing perpetuity needs r &gt; g.</span>';
          var lvl = v.c / r, grow = v.c / (r - g);
          return '<div class="big">' + F.inr(grow) + '</div>' +
            '<div class="note">Growing perpetuity. A level perpetuity (g = 0) would be worth ' + F.inr(lvl) + ".</div>";
        }
      });
    },
    npv: function (m) {
      build(m, {
        title: "NPV & IRR",
        sub: "Investment is a cash outflow at Year 0 (enter as a negative, or use the box below).",
        fields: [
          { key: "inv", label: "Initial investment ₹", val: 8000000 },
          { key: "cf", label: "Equal annual inflow ₹", val: 2500000 },
          { key: "yrs", label: "Years", val: 5 },
          { key: "r", label: "Cost of capital %", val: 12 }
        ],
        compute: function (v, F) {
          var cfs = [-Math.abs(v.inv)];
          for (var i = 0; i < v.yrs; i++) cfs.push(v.cf);
          var val = npv(v.r, cfs), rate = irr(cfs);
          var pvIn = val + Math.abs(v.inv);
          var decision = val > 0 ? '<span style="color:var(--good)">Accept</span>' : '<span style="color:var(--bad)">Reject</span>';
          return '<div>NPV = <span class="big" style="font-size:20px;color:' + (val >= 0 ? "var(--good)" : "var(--bad)") + '">' + F.inr(val) + '</span> → ' + decision + '</div>' +
            '<div class="note" style="margin-top:6px">PV of inflows ' + F.inr(pvIn) + " · IRR ≈ " + F.pct(rate) +
            " · PI = " + F.num(pvIn / Math.abs(v.inv), 2) + ". Accept if NPV &gt; 0 and IRR &gt; cost of capital.</div>";
        }
      });
    },
    bond: function (m) {
      build(m, {
        title: "Bond Price (coupon bond)",
        sub: "P = Σ C/(1+r)ᵗ + F/(1+r)ᵀ. Set coupon rate 0 for a zero-coupon bond.",
        fields: [
          { key: "face", label: "Face value ₹", val: 1000 },
          { key: "cr", label: "Coupon rate % p.a.", val: 8 },
          { key: "r", label: "Required yield (YTM) %", val: 9 },
          { key: "t", label: "Years to maturity", val: 3 }
        ],
        compute: function (v, F) {
          var c = v.face * v.cr / 100, r = v.r / 100, p = 0;
          for (var t = 1; t <= v.t; t++) p += c / Math.pow(1 + r, t);
          p += v.face / Math.pow(1 + r, v.t);
          var rel = p > v.face ? "premium (coupon &gt; yield)" : p < v.face ? "discount (coupon &lt; yield)" : "par";
          return '<div class="big">' + F.inr(p) + '</div><div class="note">Trades at a ' + rel + ". Coupon ₹" + F.num(c) + "/yr.</div>";
        }
      });
    },
    ytm: function (m) {
      build(m, {
        title: "Yield to Maturity (approximation)",
        sub: "YTM ≈ [C + (F − P)/n] ÷ [(F + P)/2].",
        fields: [
          { key: "face", label: "Face value ₹", val: 1000 },
          { key: "cr", label: "Coupon rate %", val: 9 },
          { key: "p", label: "Market price ₹", val: 980 },
          { key: "n", label: "Years to maturity", val: 2 }
        ],
        compute: function (v, F) {
          var c = v.face * v.cr / 100;
          var ytm = (c + (v.face - v.p) / v.n) / ((v.face + v.p) / 2) * 100;
          return '<div class="big">' + F.pct(ytm) + '</div><div class="note">Approx YTM. Bought ' +
            (v.p < v.face ? "below" : v.p > v.face ? "above" : "at") + " face value, so YTM is " +
            (v.p < v.face ? "above" : v.p > v.face ? "below" : "equal to") + " the " + F.pct(v.cr) + " coupon.</div>";
        }
      });
    },
    capm: function (m) {
      build(m, {
        title: "Cost of Equity — CAPM",
        sub: "Ke = Rf + β × (Rm − Rf).",
        fields: [
          { key: "rf", label: "Risk-free rate Rf %", val: 7 },
          { key: "b", label: "Beta (β)", val: 1.05 },
          { key: "rm", label: "Market return Rm %", val: 13 }
        ],
        compute: function (v, F) {
          var ke = v.rf + v.b * (v.rm - v.rf);
          return '<div class="big">' + F.pct(ke) + '</div><div class="note">Market risk premium = ' +
            F.pct(v.rm - v.rf) + ". Beta " + v.b + (v.b > 1 ? " → more volatile than the market." : v.b < 1 ? " → less volatile than the market." : " → moves with the market.") + "</div>";
        }
      });
    },
    dgm: function (m) {
      build(m, {
        title: "Cost of Equity / Price — Dividend Growth (Gordon)",
        sub: "Ke = D₁/P₀ + g, where D₁ = D₀(1+g). Needs Ke > g.",
        fields: [
          { key: "d0", label: "Current dividend D₀ ₹", val: 53 },
          { key: "p0", label: "Share price P₀ ₹", val: 2209 },
          { key: "g", label: "Growth g %", val: 14.35 }
        ],
        compute: function (v, F) {
          var g = v.g / 100, d1 = v.d0 * (1 + g);
          var ke = (d1 / v.p0 + g) * 100;
          return '<div class="big">' + F.pct(ke) + '</div><div class="note">D₁ = ' + F.inr(d1) +
            ". Dividend yield " + F.pct(d1 / v.p0 * 100) + " + growth " + F.pct(v.g) + " = cost of equity.</div>";
        }
      });
    },
    wacc: function (m) {
      build(m, {
        title: "WACC",
        sub: "WACC = rE·E/(E+D) + rD(1−Tc)·D/(E+D). Enter values at market value.",
        fields: [
          { key: "e", label: "Equity value E ₹ cr", val: 1800000 },
          { key: "dd", label: "Debt value D ₹ cr", val: 310000 },
          { key: "re", label: "Cost of equity rE %", val: 13.3 },
          { key: "rd", label: "Pre-tax cost of debt rD %", val: 7.5 },
          { key: "tc", label: "Tax rate Tc %", val: 25 }
        ],
        compute: function (v, F) {
          var tot = v.e + v.dd, we = v.e / tot, wd = v.dd / tot;
          var wacc = v.re * we + v.rd * (1 - v.tc / 100) * wd;
          return '<div class="big">' + F.pct(wacc) + '</div><div class="note">Equity weight ' + F.pct(we * 100) +
            ", debt weight " + F.pct(wd * 100) + ". After-tax cost of debt " + F.pct(v.rd * (1 - v.tc / 100)) + ".</div>";
        }
      });
    },
    breakeven: function (m) {
      build(m, {
        title: "Break-even & CVP",
        sub: "Contribution = Price − Variable cost. BEP = Fixed ÷ Contribution.",
        fields: [
          { key: "p", label: "Selling price / unit ₹", val: 2000 },
          { key: "vc", label: "Variable cost / unit ₹", val: 1200 },
          { key: "fc", label: "Fixed cost ₹", val: 2400000 },
          { key: "units", label: "Actual units (for MoS)", val: 4500 },
          { key: "target", label: "Target profit ₹", val: 1200000 }
        ],
        compute: function (v, F) {
          var contr = v.p - v.vc;
          if (contr <= 0) return '<span class="note" style="color:var(--bad)">Contribution must be positive.</span>';
          var pv = contr / v.p * 100;
          var bepU = v.fc / contr, bepV = v.fc / (pv / 100);
          var tgtU = (v.fc + v.target) / contr;
          var mosU = v.units - bepU, mosPct = v.units ? mosU / v.units * 100 : 0;
          var profit = v.units * contr - v.fc;
          return '<div>Break-even = <span class="big" style="font-size:20px">' + F.num(bepU, 0) + ' units</span> (' + F.inr(bepV) + ")</div>" +
            '<div class="note" style="margin-top:6px">Contribution ' + F.inr(contr) + "/unit · P/V ratio " + F.pct(pv) +
            " · Units for target profit " + F.num(tgtU, 0) + " · Profit at " + F.num(v.units, 0) + " units " + F.inr(profit) +
            " · Margin of safety " + F.num(mosU, 0) + " units (" + F.pct(mosPct) + ").</div>";
        }
      });
    }
  };

  function mountAll(root) {
    (root || d).querySelectorAll("[data-calc]").forEach(function (m) {
      if (m.__calcDone) return;
      var type = m.getAttribute("data-calc");
      if (BUILDERS[type]) { BUILDERS[type](m); m.__calcDone = true; }
    });
  }

  w.FMICalc = { mountAll: mountAll, builders: BUILDERS };
  if (d.readyState !== "loading") mountAll();
  else d.addEventListener("DOMContentLoaded", function () { mountAll(); });
})(window, document);
