# MASTER PROMPT — Financial Markets and Instruments Exam Preparation Website

## ROLE

You are an expert Financial Markets and Instruments professor, financial analyst, instructional designer, and senior frontend developer.

Your task is to transform all the class notes, PowerPoint presentations, PDFs, documents, and other study materials in the provided folder into a **complete, interactive, multi-page HTML learning website** that will prepare me thoroughly for my Financial Markets and Instruments examination.

**Your primary goal is to TEACH me the entire syllabus, not merely summarize the material.**

Assume I am a student learning many concepts for the first time. Explain them clearly enough that I can confidently solve numerical problems, answer MCQs, understand financial terminology, and handle conceptual questions in my examination.

---

## 1. FIRST — ANALYZE ALL PROVIDED MATERIAL

Before creating any HTML files:

1. Recursively scan the entire provided folder and identify every PPT, PPTX, PDF, DOCX, text file, spreadsheet, and relevant study resource.
2. Carefully examine every file, slide, page, diagram, table, formula, worked example, and practice question.
3. Identify every topic and subtopic that has been taught in class.
4. Organize the syllabus into a logical learning sequence based on the lecture order and conceptual dependencies.
5. Create a syllabus coverage checklist that maps every topic to its corresponding source file and slide/page number.
6. Identify all formulas, numerical problems, practice questions, definitions, and important financial concepts.

**CRITICAL: DO NOT SKIP ANYTHING THAT HAS BEEN TAUGHT.**

Even if a particular topic was covered in only one slide, make sure it appears in the website.

Do not assume that a topic is unimportant because it occupies little space in the slides.

If a topic is briefly mentioned but not properly explained, expand it with the background knowledge necessary to understand it.

Use the provided class materials as the primary source of truth. You may add accurate explanations, examples, and practice problems, but clearly distinguish additional material from the actual syllabus.

If any file is unreadable or some slide content cannot be extracted, explicitly report it instead of silently omitting it.

---

## 2. WEBSITE STRUCTURE

Create a modern, responsive, visually appealing educational website using HTML, CSS, and JavaScript.

The website must contain **multiple HTML pages**, not one enormous page.

Suggested structure:

- `index.html` — Main dashboard and syllabus overview.
- `lesson-01.html` — First lecture or concept group.
- `lesson-02.html` — Second lecture or concept group.
- Additional lesson pages for every class or logical concept group.
- `formula-sheet.html` — Master formula reference.
- `practice.html` — Numerical practice and exam revision.
- `mock-test.html` — Comprehensive exam-style quiz.

You can organize lessons by lecture or concept, whichever provides the best learning experience, but preserve the correspondence with the actual class materials.

Every lesson page must be accessible through the dashboard.

### Dashboard requirements

Display:

- Complete syllabus and chapter navigation.
- Learning progress for every chapter.
- Completed and incomplete lessons.
- Total number of lessons.
- Quick access to numerical practice.
- Quick access to the formula sheet.
- Quick access to the mock examination.
- A search feature for locating concepts, formulas, or definitions.

Use `localStorage` to preserve learning progress, completed lessons, and quiz scores.

---

## 3. TEACHING STYLE — MOST IMPORTANT

I do not want a website that simply copies bullet points from PowerPoint slides.

I want the experience of being taught by an excellent professor who knows how to make difficult financial concepts easy.

For **every concept**, use the following teaching approach:

### A. Explain it from scratch

Assume I have little prior knowledge.

Begin with the intuition behind the concept.

Explain:

- What is it?
- Why does it exist?
- Why is it important in financial markets?
- How does it work?
- When and where is it used?
- What should I remember for the examination?

### B. Explain using simple language

Avoid unnecessarily complicated financial terminology.

Whenever a technical term is introduced, define it immediately.

Use intuitive explanations before moving to formal definitions.

### C. Give real-world examples

Use realistic financial scenarios, preferably involving Indian markets when relevant.

For example, use stocks, bonds, banks, interest rates, government securities, mutual funds, NSE/BSE, or business investment decisions whenever appropriate.

Use ₹ for numerical examples unless the original question specifies another currency.

### D. Teach the concept in depth

Do not sacrifice important content for brevity.

Provide enough explanation to understand the logic, assumptions, applications, and exceptions.

Break complex concepts into manageable steps.

### E. Add comparisons wherever useful

For concepts that students commonly confuse, include comparison tables.

Explain the differences and provide memorable examples.

### F. Highlight exam-important information

Mark important definitions, formulas, assumptions, and commonly confused concepts.

Include brief **Exam Tip** and **Common Mistake** callouts only when useful.

End each major section with a short recap of what I should remember.

---

## 4. NUMERICAL QUESTIONS — HIGHEST PRIORITY

This is extremely important.

**My examination will include calculation-based questions and numerical MCQs.**

I need to understand not just the formula, but also WHY it works, WHEN to apply it, and HOW to solve the question quickly and accurately.

For every numerical concept taught in class, provide the following:

### Step 1 — Build intuition

Explain what quantity we are calculating and why it matters.

### Step 2 — Introduce the formula

Display the formula in clear mathematical notation using KaTeX or MathJax.

Define every variable, including its units.

### Step 3 — Explain formula selection

Teach me how to recognize from the wording of a question which formula should be applied.

Explain how this formula differs from other similar-looking formulas.

### Step 4 — Solve a complete example

For every worked problem, follow this structure:

**Question:** State the numerical problem.

**Given:** List all supplied values.

**Find:** State the quantity to calculate.

**Formula:** Show the applicable formula.

**Substitution:** Substitute the given numbers into the formula.

**Calculation:** Perform the arithmetic step by step.

**Final Answer:** Highlight the answer with the correct units.

**Interpretation:** Explain what the answer actually means in financial terms.

### Step 5 — Explain common mistakes

Identify issues such as:

- Confusing percentages and decimals.
- Using annual rates for monthly periods without adjustment.
- Incorrect discounting or compounding.
- Mixing present value and future value.
- Using an inappropriate formula.
- Incorrect sign conventions for cash flows.
- Confusing nominal and effective interest rates.
- Rounding too early.

Include topic-specific pitfalls as well.

### Step 6 — Provide multiple practice problems

For every significant numerical technique, create:

1. One easy problem to understand the basics.
2. One moderate problem resembling a classroom problem.
3. One challenging exam-style problem with a twist.

Where applicable, include reverse calculations, missing-variable problems, and interpretation-based MCQs.

Provide step-by-step solutions accessible through a **Show Solution** button.

### Step 7 — Add interactive numerical practice

Create interactive problems where I can enter my calculated answer.

The website should:

- Validate numerical answers with appropriate tolerance.
- Explain why an answer is correct or incorrect.
- Show the full solution after an attempt or when requested.
- Allow unlimited retries.
- Generate additional randomized practice variants where mathematically appropriate.

**VERY IMPORTANT:** Never merely display a formula and move on. I should become capable of independently solving exam-level questions.

---

## 5. INTERACTIVE QUIZ AT THE END OF EVERY LESSON

Every lesson HTML file MUST end with a small interactive quiz.

The quiz should test everything important taught within that particular lesson.

### Quiz requirements

- Include approximately **5–10 MCQs per lesson**, increasing the count when the lesson covers many concepts.
- Mix conceptual questions, definitions, applications, formula selection, and numerical calculations.
- Include numerical MCQs whenever a lesson involves calculations.
- Use four options: A, B, C, and D.
- Make the distractors realistic and based on common student mistakes.
- Include some moderately challenging questions, not only basic recall.

### Quiz interaction

When I select an answer:

1. Indicate whether it is correct or incorrect.
2. Show the correct answer.
3. Provide a clear explanation.
4. For numerical questions, show the complete calculation.
5. Explain why the incorrect choices are wrong when useful.

Additional features:

- Progress indicator such as Question 3/8.
- Previous and Next navigation.
- Final score and percentage.
- Retry Quiz button.
- Option to review all answers.
- Store the best score in localStorage.

Keep the quiz small enough for quick revision, but comprehensive enough to test important concepts.

**Do not reveal the correct answer before I attempt the question.**

---

## 6. INTERACTIVE LEARNING ELEMENTS

Make the website engaging and useful rather than a static collection of notes.

Include appropriate interactive elements such as:

### Expandable explanations

Buttons like:

- Explain More
- Show Example
- Show Calculation
- Common Exam Mistake
- Show Solution

### Financial calculators

Whenever relevant to topics actually present in the syllabus, create simple interactive calculators.

For example:

- Present Value / Future Value.
- Compound Interest.
- NPV.
- IRR.
- Bond Price and Yield.
- Annuities.
- Other numerical models covered in the notes.

These are examples, not a mandatory list of additional syllabus topics.

Users should be able to change input values and immediately see updated outputs.

### Interactive charts

Where useful, include plots demonstrating financial relationships, such as how interest rates affect present value or bond prices.

Make the charts educational, with labeled axes and accompanying interpretation.

Only introduce visualizations when they genuinely improve understanding.

---

## 7. FORMULA SHEET

Create a dedicated `formula-sheet.html` page containing ALL formulas appearing in the provided materials.

Organize them chapter-wise.

For every formula, include:

- Formula name.
- Mathematical expression.
- Definition of variables.
- When to use it.
- One short solved example.
- Common mistakes or special assumptions, when relevant.

Make the formula sheet searchable and printer-friendly.

Highlight formulas that are especially important for numerical questions.

Ensure the formula sheet is consistent with the lesson explanations.

---

## 8. EXAM PREPARATION SECTION

Create a dedicated revision and practice section.

### Numerical problem bank

Collect every numerical question appearing in the class materials.

Preserve the original wording and values where possible.

Provide separate worked solutions.

Also generate additional original exam-style numerical problems covering the calculation methods taught in class.

### Conceptual practice

Include exam-style questions involving:

- Definitions.
- Financial reasoning.
- Instrument comparisons.
- Formula interpretation.
- Identification of incorrect statements.
- Application-based scenarios.

### Mock examination

Create a comprehensive interactive mock test covering all topics in the supplied syllabus.

Target approximately 25–40 MCQs, adjustable if the syllabus is much smaller or larger.

Include a suitable mixture of conceptual and numerical questions.

Features:

- Start Test.
- Timer (optional and user-controlled).
- Question navigation.
- Submit Test.
- Final score.
- Detailed answer review.
- Topic-wise performance breakdown.
- Recommendations for lessons to revisit.

The practice questions and mock test should reflect the difficulty and style of the supplied class material, not introduce unrelated professional certification topics.

---

## 9. DESIGN REQUIREMENTS

I want the website to feel like a premium interactive learning platform.

Use:

- Clean, modern typography.
- A professional financial/educational color palette.
- Dark mode support.
- Responsive design for desktop and mobile.
- A fixed or sticky navigation sidebar on desktop.
- Clear headings and content hierarchy.
- Attractive cards, tables, and formula blocks.
- Smooth transitions and subtle animations.
- Readable mathematical equations.
- Syntax-free presentation of calculations.
- Well-spaced worked examples.

The site should prioritize readability, clarity, and learning effectiveness over unnecessary animation.

Use vanilla HTML, CSS, and JavaScript where practical.

Use shared CSS and JavaScript files to avoid duplicating components and maintain a consistent experience.

The pages should work locally by opening `index.html` without requiring a backend or build system.

Prefer local assets and dependencies. If an external library is used, provide an offline-compatible fallback or clearly document the dependency.

---

## 10. CONTENT TRACEABILITY AND COMPLETENESS

This requirement is non-negotiable.

Every significant concept, definition, formula, and numerical method in the class materials MUST appear somewhere in the learning website.

Create a `syllabus-coverage.md` file mapping:

- Source filename.
- Slide or page number.
- Topic covered.
- Corresponding HTML lesson.
- Coverage status.

Also create a `question-inventory.md` file mapping every original question and numerical example to its source and the page where its solution can be found.

Distinguish between:

1. **Class Material** — Information or questions directly taken from the supplied materials.
2. **Additional Explanation** — Explanations added to improve understanding.
3. **Extra Practice** — Original questions created for exam preparation.

Do not fabricate source references, class questions, or slide numbers.

Never silently omit unreadable slides, unclear calculations, or uncertain answers.

---

## 11. FINAL QUALITY CHECK

Before declaring the website complete:

1. Verify every supplied class file was inspected.
2. Verify all lecture topics are included.
3. Verify every formula was transferred correctly.
4. Recalculate every numerical example independently.
5. Check every quiz answer against its explanation.
6. Make sure every lesson contains a quiz.
7. Make sure every quiz works interactively.
8. Make sure every Show Solution button works.
9. Verify all navigation links.
10. Check responsive layout and dark mode.
11. Verify learning progress and quiz scores persist.
12. Ensure every included numerical technique has worked examples and practice questions.
13. Confirm the mock test covers the actual syllabus.
14. Check for broken JavaScript, missing files, and rendering errors.
15. Compare the finished website against `syllabus-coverage.md` and resolve missing coverage.

**Never mark content as verified unless it has actually been checked.**

---

## 12. EXPECTED DELIVERABLES

Create a complete project folder containing:

```text
financial-markets-prep/
├── index.html
├── lessons/
│   ├── lesson-01.html
│   ├── lesson-02.html
│   ├── lesson-03.html
│   └── ...
├── formula-sheet.html
├── practice.html
├── mock-test.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── quiz.js
│   ├── calculators.js
│   └── progress.js
├── syllabus-coverage.md
├── question-inventory.md
└── README.md
```

You may change the structure if there is a better technical reason.

The README should explain how to open and use the website locally.

## FINAL INSTRUCTIONS

Your responsibility is not simply to generate HTML pages.

**Your responsibility is to prepare me to score as highly as possible in my Financial Markets and Instruments examination.**

Prioritize these objectives, in order:

1. Complete coverage of every topic taught in class.
2. Crystal-clear explanations that build understanding from first principles.
3. Strong numerical problem-solving ability.
4. Confidence in handling difficult calculation-based MCQs.
5. Interactive reinforcement through examples and quizzes.
6. Smooth navigation, attractive design, and a reliable user experience.

Do not compress the material into short summaries just to reduce file length.

Do not create placeholder sections, fake questions, or generic content unrelated to the provided notes.

If the syllabus is extensive, implement it in manageable batches, maintaining a coverage checklist and completing every lesson. Do not stop after generating only the dashboard or first few lessons.

**Start by reading the complete folder and producing the syllabus inventory and proposed lesson structure. Then implement the full website, verify the content and functionality, and deliver the finished project.**
