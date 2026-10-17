/* ============================================================
   progress.js — localStorage-backed learning progress.
   Safe against private mode / blocked storage (try/catch).
   ============================================================ */
(function (w) {
  "use strict";

  var KEY = "fmi_prep_v1";

  // Canonical lesson list (id -> title). Keep in sync with nav.
  var LESSONS = [
    { id: "lesson-01", title: "Accounting Foundations & the 3 Statements" },
    { id: "lesson-02", title: "Financial Ratio Analysis" },
    { id: "lesson-03", title: "Cost Concepts, Costing & CVP" },
    { id: "lesson-04", title: "Time Value of Money" },
    { id: "lesson-05", title: "Capital Budgeting" },
    { id: "lesson-06", title: "Cost of Capital — Cost of Equity" },
    { id: "lesson-07", title: "Bonds, Stock Valuation & WACC" },
    { id: "lesson-08", title: "Valuation & Forecasting (FCF / DCF)" },
    { id: "lesson-09", title: "Portfolio Theory & Market Efficiency" },
    { id: "lesson-10", title: "Derivatives — Foundations" },
    { id: "lesson-11", title: "Derivatives — Special Products & 2008" }
  ];

  function read() {
    try {
      var raw = w.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function write(obj) {
    try { w.localStorage.setItem(KEY, JSON.stringify(obj)); return true; }
    catch (e) { return false; }
  }

  var Progress = {
    LESSONS: LESSONS,

    state: function () {
      var s = read();
      s.lessons = s.lessons || {};     // id -> true
      s.quiz = s.quiz || {};           // id -> best percent (0..100)
      s.mock = s.mock || null;         // {pct, correct, total, date, topics:{}}
      return s;
    },

    isDone: function (id) { return !!this.state().lessons[id]; },

    setDone: function (id, done) {
      var s = this.state();
      if (done) s.lessons[id] = true; else delete s.lessons[id];
      write(s);
      return done;
    },

    toggle: function (id) { return this.setDone(id, !this.isDone(id)); },

    bestQuiz: function (id) {
      var v = this.state().quiz[id];
      return typeof v === "number" ? v : null;
    },

    recordQuiz: function (id, pct) {
      var s = this.state();
      if (s.quiz[id] == null || pct > s.quiz[id]) s.quiz[id] = pct;
      write(s);
      return s.quiz[id];
    },

    recordMock: function (result) {
      var s = this.state();
      if (!s.mock || result.pct >= s.mock.pct) s.mock = result;
      // Always store "last" too
      s.mockLast = result;
      write(s);
    },

    getMock: function () { return this.state().mock; },
    getMockLast: function () { return this.state().mockLast || null; },

    completedCount: function () {
      var l = this.state().lessons, n = 0;
      for (var k in l) if (l[k]) n++;
      return n;
    },

    overallPercent: function () {
      return Math.round((this.completedCount() / LESSONS.length) * 100);
    },

    reset: function () { write({}); }
  };

  w.Progress = Progress;
})(window);
