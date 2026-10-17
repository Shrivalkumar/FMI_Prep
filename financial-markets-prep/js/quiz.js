/* ============================================================
   quiz.js — interactive MCQ quizzes (one question at a time).
   Usage:
     FMIQuiz.render(document.getElementById("quiz"), {
       id: "lesson-01",          // optional: stores best score via Progress
       title: "Lesson 1 Quiz",
       questions: [
         { q:"...", options:["A","B","C","D"], correct:2,
           explain:"...", calc:"...optional worked HTML..." }
       ]
     });
   Answers are NEVER revealed before the user attempts a question.
   ============================================================ */
(function (w) {
  "use strict";
  var LETTERS = ["A", "B", "C", "D", "E", "F"];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function typeset(node) {
    if (w.renderMathIn) { try { w.renderMathIn(node); } catch (e) {} }
  }

  function render(mount, cfg) {
    if (!mount) return;
    var Q = cfg.questions || [];
    var answers = new Array(Q.length).fill(null); // selected index per question
    var idx = 0;

    mount.classList.add("quiz");
    mount.innerHTML = "";

    var head = el("div", "qz-head");
    head.appendChild(el("b", null, cfg.title || "Quick Quiz"));
    var best = cfg.id && w.Progress ? w.Progress.bestQuiz(cfg.id) : null;
    var prog = el("span", "qz-prog");
    head.appendChild(prog);
    mount.appendChild(head);

    var bar = el("div", "qz-bar"); var barI = el("i"); bar.appendChild(barI); mount.appendChild(bar);
    var body = el("div", "qz-body"); mount.appendChild(body);
    var foot = el("div", "qz-foot"); mount.appendChild(foot);

    function updateProgress() {
      prog.textContent = "Question " + (idx + 1) + " / " + Q.length +
        (best != null ? "  ·  Best " + best + "%" : "");
      barI.style.width = (((idx) / Q.length) * 100) + "%";
    }

    function drawQuestion() {
      var q = Q[idx];
      body.innerHTML = "";
      foot.innerHTML = "";

      body.appendChild(el("div", "qz-q", (idx + 1) + ". " + q.q));
      var opts = el("div", "opts");
      q.options.forEach(function (opt, i) {
        var b = el("button", "opt");
        b.type = "button";
        b.appendChild(el("span", "ltr", LETTERS[i]));
        b.appendChild(el("span", null, opt));
        b.onclick = function () { choose(i); };
        if (answers[idx] != null) markOpt(b, i, q);
        opts.appendChild(b);
      });
      body.appendChild(opts);

      var ex = el("div", "explain");
      ex.id = "ex";
      body.appendChild(ex);
      if (answers[idx] != null) showExplain(q, ex);

      // footer nav
      var prev = el("button", "btn ghost sm", "‹ Previous");
      prev.disabled = idx === 0;
      prev.onclick = function () { if (idx > 0) { idx--; drawQuestion(); updateProgress(); } };
      foot.appendChild(prev);
      foot.appendChild(el("span", "spacer"));

      if (idx < Q.length - 1) {
        var next = el("button", "btn ghost sm", "Next ›");
        next.onclick = function () { idx++; drawQuestion(); updateProgress(); };
        foot.appendChild(next);
      } else {
        var fin = el("button", "btn primary sm", "Finish & see score");
        fin.onclick = finish;
        foot.appendChild(fin);
      }
      typeset(body);
    }

    function markOpt(btn, i, q) {
      btn.disabled = true;
      if (i === q.correct) btn.classList.add("correct");
      else if (i === answers[idx]) btn.classList.add("wrong");
    }

    function showExplain(q, ex) {
      var ok = answers[idx] === q.correct;
      ex.classList.add("show");
      var v = ok ? '<span class="verdict ok">✓ Correct.</span> '
                 : '<span class="verdict no">✗ Not quite.</span> ' +
                   'Correct answer: <b>' + LETTERS[q.correct] + '</b>. ';
      ex.innerHTML = v + (q.explain || "") + (q.calc ? '<div style="margin-top:8px">' + q.calc + "</div>" : "");
      typeset(ex);
    }

    function choose(i) {
      if (answers[idx] != null) return; // lock after first answer
      answers[idx] = i;
      var q = Q[idx];
      var buttons = body.querySelectorAll(".opt");
      buttons.forEach(function (b, bi) { markOpt(b, bi, q); });
      showExplain(q, document.getElementById("ex"));
    }

    function finish() {
      var correct = 0;
      answers.forEach(function (a, i) { if (a === Q[i].correct) correct++; });
      var pct = Math.round((correct / Q.length) * 100);
      var stored = cfg.id && w.Progress ? w.Progress.recordQuiz(cfg.id, pct) : null;

      barI.style.width = "100%";
      prog.textContent = "Complete";
      body.innerHTML = "";
      foot.innerHTML = "";

      var msg = pct >= 80 ? "Excellent — exam ready on this topic!" :
                pct >= 60 ? "Good. Review the ones you missed and retry." :
                            "Keep going — reread the lesson, then try again.";
      var card = el("div", "score-card");
      card.innerHTML =
        '<div class="pct">' + pct + '%</div>' +
        '<div class="msg">You scored ' + correct + " / " + Q.length + ". " + msg + "</div>" +
        (stored != null ? '<div class="best">Best score saved: ' + stored + "%</div>" : "");
      body.appendChild(card);

      var retry = el("button", "btn primary sm", "↻ Retry quiz");
      retry.onclick = function () { answers = new Array(Q.length).fill(null); idx = 0; drawQuestion(); updateProgress(); };
      var review = el("button", "btn ghost sm", "Review all answers");
      review.onclick = reviewAll;
      foot.appendChild(retry);
      foot.appendChild(el("span", "spacer"));
      foot.appendChild(review);

      if (w.FMIEvents && w.FMIEvents.quizDone) w.FMIEvents.quizDone(cfg.id, pct);
    }

    function reviewAll() {
      body.innerHTML = "";
      foot.innerHTML = "";
      Q.forEach(function (q, qi) {
        var block = el("div");
        block.style.margin = "0 0 20px";
        block.appendChild(el("div", "qz-q", (qi + 1) + ". " + q.q));
        var opts = el("div", "opts");
        q.options.forEach(function (opt, i) {
          var b = el("button", "opt");
          b.type = "button"; b.disabled = true;
          b.appendChild(el("span", "ltr", LETTERS[i]));
          b.appendChild(el("span", null, opt));
          if (i === q.correct) b.classList.add("correct");
          else if (i === answers[qi]) b.classList.add("wrong");
          opts.appendChild(b);
        });
        block.appendChild(opts);
        var ex = el("div", "explain show");
        var ok = answers[qi] === q.correct;
        ex.innerHTML = (ok ? '<span class="verdict ok">✓ You got this right.</span> '
                           : '<span class="verdict no">✗ Correct: ' + LETTERS[q.correct] + '.</span> ') +
                       (q.explain || "") + (q.calc ? '<div style="margin-top:8px">' + q.calc + "</div>" : "");
        block.appendChild(ex);
        body.appendChild(block);
      });
      var back = el("button", "btn primary sm", "↻ Retry quiz");
      back.onclick = function () { answers = new Array(Q.length).fill(null); idx = 0; drawQuestion(); updateProgress(); };
      foot.appendChild(back);
      typeset(body);
    }

    drawQuestion();
    updateProgress();
  }

  w.FMIQuiz = { render: render };
})(window);
