# Financial Markets & Instruments — Exam Prep Website

An interactive, multi-page learning website that teaches the **entire FMI syllabus** from first
principles — built directly from the class slides and notes (Sessions 1–16). It's designed to make
you able to *solve* exam numericals and answer conceptual MCQs, not just recognise the topics.

## How to open it

No build step, no server, no internet account needed.

1. Open the folder `financial-markets-prep`.
2. Double-click **`index.html`** — it opens in your browser.
3. Navigate from the dashboard or the left sidebar.

> **One note on formulas:** mathematical formulas are rendered with **KaTeX**, loaded from a CDN
> (`cdnjs.cloudflare.com`). With an internet connection they appear as beautifully typeset maths.
> **Offline**, the page still works perfectly — every formula is also written in plain readable
> notation, and nothing else on the site depends on the internet. The fonts (Inter) likewise fall
> back to your system font offline.
>
> If you prefer to run it from a local server instead of `file://` (identical result):
> ```bash
> cd financial-markets-prep
> python3 -m http.server 8000
> # then open http://localhost:8000
> ```

## What's inside

```
financial-markets-prep/
├── index.html              Dashboard: syllabus, progress, search, quick links
├── lessons/
│   ├── lesson-01.html      Accounting Foundations & the 3 Statements
│   ├── lesson-02.html      Financial Ratio Analysis
│   ├── lesson-03.html      Cost Concepts, Costing & CVP
│   ├── lesson-04.html      Time Value of Money
│   ├── lesson-05.html      Capital Budgeting
│   ├── lesson-06.html      Cost of Capital — Cost of Equity
│   ├── lesson-07.html      Bonds, Stock Valuation & WACC
│   ├── lesson-08.html      Valuation & Forecasting (FCF / DCF)
│   ├── lesson-09.html      Portfolio Theory & Market Efficiency
│   ├── lesson-10.html      Derivatives — Foundations
│   └── lesson-11.html      Derivatives — Special Products & the 2008 Crisis
├── formula-sheet.html      Every formula, chapter-wise, searchable & printable
├── practice.html           Numerical + conceptual problem bank with solutions
├── mock-test.html          35-question timed, exam-style mock with topic scoring
├── css/
│   └── styles.css          Shared design system (light + dark, responsive, print)
├── js/
│   ├── app.js              Navigation, theme, search, math rendering, interactivity
│   ├── progress.js         localStorage progress / quiz / mock scores
│   ├── quiz.js             End-of-lesson quiz engine
│   └── calculators.js      Live financial calculators
├── syllabus-coverage.md    Topic → source → lesson coverage map
├── question-inventory.md   Every worked example/question → source & solution
└── README.md               This file
```

## Features

- **Taught, not summarised.** Each concept is explained from scratch — intuition first, then the
  formula, then fully worked examples (Question → Given → Formula → Substitution → Calculation →
  Answer → Interpretation), common mistakes, and recaps. Indian (₹) examples throughout.
- **Live calculators.** PV/FV, compound interest, annuities, perpetuity, NPV/IRR, bond pricing,
  YTM, CAPM, dividend growth, WACC and break-even — change the inputs and see results update.
- **Interactive numerical practice.** Type your answer, get instant right/wrong with tolerance,
  and reveal the full working.
- **Quizzes.** Every lesson ends with a 10–13 question MCQ quiz: one question at a time, answer
  explanations (never shown before you attempt), progress bar, score, retry and review.
- **Mock test.** 35 mixed MCQs, optional timer, a question navigator, a topic-wise performance
  breakdown and a list of lessons to revisit.
- **Formula sheet.** Searchable, print-friendly (`Print / Save as PDF`), ★-marks the
  high-frequency numerical formulas.
- **Search.** Find any concept, formula or definition from the dashboard search box.
- **Progress tracking.** Completed lessons and best quiz/mock scores are saved in your browser
  (localStorage) — reflected on the dashboard. Use "Reset my progress" there to clear it.
- **Dark mode** (toggle in the sidebar) and a **responsive** layout for phone, tablet and desktop.

## Suggested study path

1. Work through lessons **1 → 11** in order (each builds on the last). Mark each complete.
2. After each lesson, take its quiz until you score ≥ 80%.
3. Drill weak spots in **Practice Problems** (filter by topic).
4. Keep the **Formula Sheet** open while solving.
5. Sit the **Mock Test** near exam day; revisit any topic you scored below 60% on, then retake.

## Source material & honesty

All content is derived from the supplied class files (Sessions 1–16 and the FMI Speed Run deck).
Added explanations and original practice questions are tagged on each page
(`From class` / `Added for depth` / `Extra practice`). See `syllabus-coverage.md` and
`question-inventory.md` for the full traceability maps, including the few source slides that were
image-only and how they were handled. Illustrative company figures used in the slides (e.g. Asian
Paints, Reliance, Infosys) are approximate teaching values, not investment advice.
