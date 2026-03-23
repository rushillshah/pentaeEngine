# Quiz UI Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port Python personality engines to TypeScript, build API routes and a multi-step quiz frontend so users can take the elemental personality quiz on the web.

**Architecture:** Three TS engine modules (numerology, MBTI, astrology) under `src/server/engines/` each expose a `run()` → `ElementVector`. A `PersonalizationService` orchestrates them, saves results to the existing DB schema, and is called by a thin API route. The frontend is a multi-step wizard at `/quiz` decomposed into 7 focused components.

**Tech Stack:** Next.js App Router, TypeScript, Knex, Vitest, Tailwind CSS, external astrology API

**Spec:** `docs/superpowers/specs/2026-03-23-quiz-ui-integration-design.md`

**Python reference implementations:** `src/engines/numerology/`, `src/engines/mbti/`, `src/engines/astrology/`

---

## File Structure

```
src/server/engines/
├── combiner.ts                          # Weighted average of N element vectors
├── numerology/
│   ├── constants.ts                     # Letter map, master numbers, weights, element vectors
│   ├── calculator.ts                    # getLifePath, getExpression, getSoulUrge, cleanString, reduceNumber
│   ├── elementMapper.ts                 # numberToVector lookup
│   ├── aggregator.ts                    # mixProfiles (LP 50%, Exp 30%, SU 20%)
│   ├── index.ts                         # run(dob, fullName) orchestrator
│   └── __tests__/
│       ├── calculator.test.ts
│       ├── elementMapper.test.ts
│       └── index.test.ts
├── mbti/
│   ├── constants.ts                     # QUESTIONS, FUNCTIONS, ELEMENT_MATRIX
│   ├── scorer.ts                        # scoreFunctions, normalizeFunctions
│   ├── elementMapper.ts                 # functionsToElements
│   ├── index.ts                         # run(answers) orchestrator
│   └── __tests__/
│       ├── scorer.test.ts
│       ├── elementMapper.test.ts
│       └── index.test.ts
├── astrology/
│   ├── constants.ts                     # SIGN_ELEMENTS, PLANET_WEIGHTS, spirit rules
│   ├── chartService.ts                  # External API wrapper → NatalChart
│   ├── elementMapper.ts                 # chartToElementVector + spirit bonuses + normalize
│   ├── index.ts                         # run(birth data) orchestrator
│   └── __tests__/
│       ├── elementMapper.test.ts
│       └── index.test.ts

src/server/services/
└── PersonalizationService.ts            # runQuiz, getSession

src/app/api/quiz/
├── submit/route.ts                      # POST — validate + runQuiz
└── results/[sessionId]/route.ts         # GET — fetch session

src/app/components/quiz/
├── QuizWizard.tsx                       # Top-level step state manager
├── QuizWelcome.tsx                      # Step 0: intro + consent
├── QuizPersonalDetails.tsx              # Step 1: name, DOB, time, lat/lng
├── QuizQuestion.tsx                     # Steps 2-9: reusable Likert component
├── QuizLoading.tsx                      # Step 10: spinner
├── QuizResults.tsx                      # Step 11: element bars
└── QuizProgress.tsx                     # Progress indicator

src/app/quiz/page.tsx                    # Rewrite — thin server wrapper
```

---

### Task 1: Numerology Engine — Constants & Calculator

**Files:**
- Create: `src/server/engines/numerology/constants.ts`
- Create: `src/server/engines/numerology/calculator.ts`
- Create: `src/server/engines/numerology/__tests__/calculator.test.ts`

**Reference:** `src/engines/numerology/constants/parameters.py`, `src/engines/numerology/services/calculator.py`, `src/engines/numerology/utils/parsers.py`

- [ ] **Step 1: Write `constants.ts`** — Port all values from Python `parameters.py`: `LETTER_MAP` (Record<string, number>), `VOWELS` (Set<string>), `MASTER_NUMBERS` (Set<number>), `WEIGHTS` ({life_path: 0.5, expression: 0.3, soul_urge: 0.2}), `ELEMENT_VECTORS` (Record<number, ElementVector> for 1-9, 11, 22, 33). Import `ElementVector` from `@/types/personalization`.

- [ ] **Step 2: Write failing tests for calculator** — Test `reduceNumber` (32→5, 33→33 master, 11→11, 7→7), `cleanString` ("John Doe 123"→"JOHNDOE"), `getLifePath` ("1992-07-23"→33, "1990-06-25"→5), `getExpression` and `getSoulUrge` with known inputs. Run `npx vitest run src/server/engines/numerology/__tests__/calculator.test.ts` — expect FAIL.

- [ ] **Step 3: Write `calculator.ts`** — Implement `cleanString(s)`: strip non-alpha, uppercase. `reduceNumber(n)`: loop summing digits until single digit or master number. `getLifePath(dob)`: extract digits, sum, reduce. `getExpression(name)`: clean, map letters, sum, reduce. `getSoulUrge(name)`: clean, filter vowels, map, sum, reduce (return null if no vowels).

- [ ] **Step 4: Run tests** — Expect PASS.

- [ ] **Step 5: Commit** — `git add src/server/engines/numerology/constants.ts src/server/engines/numerology/calculator.ts src/server/engines/numerology/__tests__/calculator.test.ts && git commit -m "feat(engines): add numerology constants and calculator"`

---

### Task 2: Numerology Engine — Element Mapper, Aggregator, Index

**Files:**
- Create: `src/server/engines/numerology/elementMapper.ts`
- Create: `src/server/engines/numerology/aggregator.ts`
- Create: `src/server/engines/numerology/index.ts`
- Create: `src/server/engines/numerology/__tests__/elementMapper.test.ts`
- Create: `src/server/engines/numerology/__tests__/index.test.ts`

**Reference:** `src/engines/numerology/services/elementMapper.py`, `src/engines/numerology/services/aggregator.py`, `src/engines/numerology/supervisor.py`

- [ ] **Step 1: Write failing tests for elementMapper** — Test `numberToVector(1)` returns pure fire, `numberToVector(7)` returns pure spirit, `numberToVector(33)` returns fire 0.6 + spirit 0.4, unknown number returns zero vector. Run — expect FAIL.

- [ ] **Step 2: Write `elementMapper.ts`** — `numberToVector(n: number): ElementVector` — lookup in `ELEMENT_VECTORS`, return copy. Fallback: all zeros.

- [ ] **Step 3: Run tests** — Expect PASS.

- [ ] **Step 4: Write `aggregator.ts`** — `mixProfiles(lpVec, expVec, suVec)`: weighted blend using `WEIGHTS`. If `suVec` is null, redistribute its weight proportionally. Round to 4 decimals.

- [ ] **Step 5: Write failing test for `index.ts` run()** — Test `run("1992-07-23", "John Doe")` returns an ElementVector with 5 keys summing close to 1.0. Cross-check against Python: run `python3 -c "from src.engines.numerology.supervisor import run; print(run('1992-07-23', 'John Doe'))"` and use those values as expected.

- [ ] **Step 6: Write `index.ts`** — `run(dob, fullName)`: call calculator for LP/Exp/SU, map each to vector, mix profiles. Return final vector.

- [ ] **Step 7: Run all numerology tests** — `npx vitest run src/server/engines/numerology/` — Expect PASS.

- [ ] **Step 8: Commit** — `git commit -m "feat(engines): complete numerology TS engine"`

---

### Task 3: MBTI Engine

**Files:**
- Create: `src/server/engines/mbti/constants.ts`
- Create: `src/server/engines/mbti/scorer.ts`
- Create: `src/server/engines/mbti/elementMapper.ts`
- Create: `src/server/engines/mbti/index.ts`
- Create: `src/server/engines/mbti/__tests__/scorer.test.ts`
- Create: `src/server/engines/mbti/__tests__/elementMapper.test.ts`
- Create: `src/server/engines/mbti/__tests__/index.test.ts`

**Reference:** `src/engines/mbti/constants/parameters.py`, `src/engines/mbti/services/scorer.py`, `src/engines/mbti/services/elementMapper.py`

- [ ] **Step 1: Write `constants.ts`** — Port `FUNCTIONS` (string array), `QUESTIONS` (array of {text, favored, opposite}), `ELEMENT_MATRIX` (Record<string, ElementVector>). All values identical to Python.

- [ ] **Step 2: Write failing scorer tests** — Test `scoreFunctions([5,1,5,1,5,1,5,1])` returns max for Ni/Ne/Ti/Te (5+5=10 each for favored). Test `normalizeFunctions` sums to 1.0. Test wrong answer count throws. Run — expect FAIL.

- [ ] **Step 3: Write `scorer.ts`** — `scoreFunctions(answers: number[]): Record<string, number>` — iterate questions, favored gets v, opposite gets 6-v. `normalizeFunctions(raw): Record<string, number>` — divide by total, round to 6 decimals.

- [ ] **Step 4: Run scorer tests** — Expect PASS.

- [ ] **Step 5: Write failing elementMapper tests** — Test `functionsToElements` with all-Ni input (100% Ni) returns pure spirit. Test with balanced input returns balanced vector. Run — expect FAIL.

- [ ] **Step 6: Write `elementMapper.ts`** — `functionsToElements(normalized: Record<string, number>): ElementVector` — for each function, multiply weight by element matrix row, accumulate, normalize to sum=1.0.

- [ ] **Step 7: Run elementMapper tests** — Expect PASS.

- [ ] **Step 8: Write failing index test** — Test `run([3,3,3,3,3,3,3,3])` (all neutral) returns balanced vector. Cross-check one case against Python output.

- [ ] **Step 9: Write `index.ts`** — `run(answers: number[]): ElementVector` — score → normalize → map to elements.

- [ ] **Step 10: Run all MBTI tests** — `npx vitest run src/server/engines/mbti/` — Expect PASS.

- [ ] **Step 11: Commit** — `git commit -m "feat(engines): add MBTI TS engine"`

---

### Task 4: Astrology Engine

**Files:**
- Create: `src/server/engines/astrology/constants.ts`
- Create: `src/server/engines/astrology/chartService.ts`
- Create: `src/server/engines/astrology/elementMapper.ts`
- Create: `src/server/engines/astrology/index.ts`
- Create: `src/server/engines/astrology/__tests__/elementMapper.test.ts`
- Create: `src/server/engines/astrology/__tests__/index.test.ts`

**Reference:** `src/engines/astrology/constants/parameters.py`, `src/engines/astrology/services/elementMapper.py`, `src/engines/astrology/services/chartService.py`

- [ ] **Step 1: Write `constants.ts`** — Port from Python but use **full sign names** (Aries, Taurus, etc.) instead of Kerykeion abbreviations. `SIGN_ELEMENTS` (Record<string, string>, 12 signs → fire/earth/air/water). `PLANET_LIST`, `PLANET_WEIGHTS`, `SPIRIT_SIGNS` (Set: Pisces, Sagittarius, Aquarius). Spirit bonus constants. `ELEMENTS` array.

- [ ] **Step 2: Define `NatalChart` and `PlanetPlacement` types** at the top of `constants.ts` or in the index — `interface PlanetPlacement { sign: string; house: number }`, `interface NatalChart { sun, moon, ascendant, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto }`.

- [ ] **Step 3: Write failing elementMapper tests** — Test `signToElement("Aries")` → "fire". Test `chartToElementVector` with a crafted chart (all fire signs, no spirit bonuses) returns mostly fire. Test spirit bonus: Sun in Pisces → +2.0 spirit. Test 12th house stellium. Port assertions from Python `test_element_mapper.py`. Run — expect FAIL.

- [ ] **Step 4: Write `elementMapper.ts`** — `signToElement(sign)`, `chartToElementVector(chart): ElementVector` — planet weight contributions + spirit bonuses + normalize to sum=1.0. Port logic from Python `elementMapper.py` + `aggregator.py`.

- [ ] **Step 5: Run elementMapper tests** — Expect PASS.

- [ ] **Step 6: Write `chartService.ts`** — `computeNatalChart(year, month, day, hour, minute, lat, lng): Promise<NatalChart>`. Reads `ASTROLOGY_API_KEY` and `ASTROLOGY_API_URL` from `process.env`. Makes fetch request to external API, normalizes response to `NatalChart` format. If env vars are missing, throw descriptive error.

- [ ] **Step 7: Write failing index test** — Mock `chartService.computeNatalChart` to return a known chart. Test `run()` returns ElementVector summing to 1.0 with expected values. Run — expect FAIL.

- [ ] **Step 8: Write `index.ts`** — `run(year, month, day, hour, minute, lat, lng): Promise<ElementVector>` — call chartService → elementMapper.

- [ ] **Step 9: Run all astrology tests** — `npx vitest run src/server/engines/astrology/` — Expect PASS.

- [ ] **Step 10: Commit** — `git commit -m "feat(engines): add astrology TS engine"`

---

### Task 5: Combiner

**Files:**
- Create: `src/server/engines/combiner.ts`
- Create: `src/server/engines/__tests__/combiner.test.ts`

**Reference:** `src/engines/supervisor.py` `combine_vectors` function

- [ ] **Step 1: Write failing tests** — Test with 3 known vectors at 33/33/34 weights, verify output sums to 1.0 and proportions are correct. Test with 2 vectors (fallback weights). Test all-zero input returns uniform 0.2.

- [ ] **Step 2: Write `combiner.ts`** — `combineVectors(vectors: Record<string, ElementVector>, weights: Record<string, number>): ElementVector`. `MODULE_WEIGHTS` constant: `{ numerology: 0.33, mbti: 0.33, astrology: 0.34 }`. `FALLBACK_WEIGHTS`: `{ numerology: 0.5, mbti: 0.5 }`.

- [ ] **Step 3: Run tests** — Expect PASS.

- [ ] **Step 4: Cross-check** — Run Python combined supervisor and TS combiner with same 3 vectors, verify match.

- [ ] **Step 5: Commit** — `git commit -m "feat(engines): add vector combiner"`

---

### Task 6: PersonalizationService

**Files:**
- Create: `src/server/services/PersonalizationService.ts`

**Reference:** `src/server/services/AuthService.ts` for pattern, `src/types/personalization.ts` for types

- [ ] **Step 1: Write `PersonalizationService.ts`** — Static class with:
  - `runQuiz(input: QuizInput): Promise<QuizResult>`:
    1. Insert into `anonymous_users` → get UUID
    2. Insert into `personalization_sessions` (status: ACTIVE, consent_given: true)
    3. `Promise.all` numerology + MBTI + astrology (wrap astrology in try/catch)
    4. Insert 3 `personalization_module_responses` rows (COMPLETED or FAILED)
    5. Combine successful vectors (use `MODULE_WEIGHTS` or `FALLBACK_WEIGHTS`)
    6. Update session with scores + dominant_element + status=COMPLETED
    7. Return `{ sessionId, elementVector, dominantElement }`
  - `getSession(id: number): Promise<PersonalizationSession | null>`:
    1. `db("personalization_sessions").where({ id }).first()`

- [ ] **Step 2: Define `QuizInput` and `QuizResult` interfaces** — either at the top of the file or in `src/types/personalization.ts`.

- [ ] **Step 3: Commit** — `git commit -m "feat(services): add PersonalizationService"`

---

### Task 7: API Routes

**Files:**
- Create: `src/app/api/quiz/submit/route.ts`
- Create: `src/app/api/quiz/results/[sessionId]/route.ts`

**Reference:** `src/app/api/products/route.ts`, `src/app/api/auth/signup/route.ts` for pattern

- [ ] **Step 1: Write `submit/route.ts`** — `POST` handler:
  1. Parse body with `await request.json()`
  2. Validate: fullName non-empty, dob matches YYYY-MM-DD, birthHour 0-23, birthMinute 0-59, birthLat -90..90, birthLng -180..180, mbtiAnswers length=8 each 1-5
  3. On validation fail: return `{ error }` with 400
  4. Call `PersonalizationService.runQuiz(validated)`
  5. Return `NextResponse.json(result)`
  6. Catch: return `{ error: "Something went wrong" }` with 500

- [ ] **Step 2: Write `results/[sessionId]/route.ts`** — `GET` handler:
  1. Parse `sessionId` from `params` as integer
  2. Call `PersonalizationService.getSession(id)`
  3. If null: return 404
  4. Return session data

- [ ] **Step 3: Commit** — `git commit -m "feat(api): add quiz submit and results routes"`

---

### Task 8: Quiz Frontend — QuizProgress, QuizWelcome, QuizPersonalDetails

**Files:**
- Create: `src/app/components/quiz/QuizProgress.tsx`
- Create: `src/app/components/quiz/QuizWelcome.tsx`
- Create: `src/app/components/quiz/QuizPersonalDetails.tsx`

**Reference:** `src/app/components/SignUpForm.tsx` for styling/form patterns

- [ ] **Step 1: Write `QuizProgress.tsx`** — Props: `{ current: number; total: number }`. Renders a progress bar (div with width % based on current/total) + "Step X of Y" text. Tailwind: `bg-tan` track, `bg-gold` fill.

- [ ] **Step 2: Write `QuizWelcome.tsx`** — Props: `{ onStart: () => void }`. Heading "Discover Your Elemental Profile" (font-serif), description paragraph, consent checkbox ("I agree to share my birth details for this quiz"), Start button (disabled until consent checked). Gold button styling.

- [ ] **Step 3: Write `QuizPersonalDetails.tsx`** — Props: `{ details: PersonalDetails; onChange: (d: PersonalDetails) => void; onNext: () => void; onBack: () => void }`. Form fields: Full Name (text), Date of Birth (date input), Birth Time (two number inputs HH:MM), Birth Latitude (number), Birth Longitude (number). Next + Back buttons. Basic validation: all fields required.

- [ ] **Step 4: Commit** — `git commit -m "feat(ui): add quiz progress, welcome, and personal details components"`

---

### Task 9: Quiz Frontend — QuizQuestion, QuizLoading, QuizResults

**Files:**
- Create: `src/app/components/quiz/QuizQuestion.tsx`
- Create: `src/app/components/quiz/QuizLoading.tsx`
- Create: `src/app/components/quiz/QuizResults.tsx`

- [ ] **Step 1: Write `QuizQuestion.tsx`** — Props: `{ questionNumber: number; questionText: string; value: number | null; onAnswer: (v: number) => void; onNext: () => void; onBack: () => void }`. Display question text, 5 Likert buttons (1=Strongly Disagree through 5=Strongly Agree) styled as a row of selectable buttons. Selected button gets `bg-gold text-white`, others get `border-tan`. Next button disabled until answer selected. Back button.

- [ ] **Step 2: Write `QuizLoading.tsx`** — Props: `{ error?: string }`. Centered spinner with "Calculating your elemental profile..." text. If error prop set, show error message with retry guidance.

- [ ] **Step 3: Write `QuizResults.tsx`** — Props: `{ elementVector: ElementVector; dominantElement: string }`. Heading "Your Elemental Profile". Dominant element in large text with its color. 5 horizontal bars: each bar shows element name, colored fill (Fire=#E25822, Water=#4A90D9, Air=#87CEEB, Earth=#8B7355, Spirit=#9B59B6), and percentage. Bars sorted by value descending.

- [ ] **Step 4: Commit** — `git commit -m "feat(ui): add quiz question, loading, and results components"`

---

### Task 10: Quiz Frontend — QuizWizard & Page

**Files:**
- Create: `src/app/components/quiz/QuizWizard.tsx`
- Modify: `src/app/quiz/page.tsx`

**Reference:** `src/app/components/SignUpForm.tsx` for fetch/state patterns

- [ ] **Step 1: Write `QuizWizard.tsx`** — `"use client"`. Import all quiz components + MBTI `QUESTIONS` from `@/server/engines/mbti/constants`. State: step (0-11), details, answers (number[]), result, loading, error. Render logic:
  - Step 0: `<QuizWelcome onStart={() => setStep(1)} />`
  - Step 1: `<QuizPersonalDetails ... onNext={() => setStep(2)} />`
  - Steps 2-9: `<QuizQuestion questionNumber={step-1} questionText={QUESTIONS[step-2].text} ... onNext={handleQuestionNext} onBack={() => setStep(step-1)} />`
  - Step 10: `<QuizLoading error={error} />`
  - Step 11: `<QuizResults elementVector={result.elementVector} dominantElement={result.dominantElement} />`
  - `handleQuestionNext`: push answer to array, if step=9 call `submitQuiz()` and go to step 10, else step+1
  - `submitQuiz()`: set loading, POST to `/api/quiz/submit`, set result or error

- [ ] **Step 2: Wrap with QuizProgress** — Show `<QuizProgress current={step} total={10} />` for steps 1-9.

- [ ] **Step 3: Rewrite `src/app/quiz/page.tsx`** — Server component with metadata. Renders `<Navbar />`, `<QuizWizard />`, `<Footer />`.

- [ ] **Step 4: Manual test** — Run `npm run dev`, navigate to `/quiz`, walk through all steps. Verify styling, navigation, back buttons work.

- [ ] **Step 5: Commit** — `git commit -m "feat(ui): add quiz wizard and rewrite quiz page"`

---

### Task 11: End-to-End Verification

- [ ] **Step 1: Cross-check engines** — For numerology and MBTI, run Python and TS with identical inputs, compare vectors. Use: DOB="1992-07-23", name="John Doe", answers=[3,3,3,3,3,3,3,3].

- [ ] **Step 2: Test API route** — `curl -X POST http://localhost:3000/api/quiz/submit -H 'Content-Type: application/json' -d '{"fullName":"John Doe","dob":"1992-07-23","birthHour":14,"birthMinute":30,"birthLat":25.2048,"birthLng":55.2708,"mbtiAnswers":[3,3,3,3,3,3,3,3]}'` — verify response has sessionId, elementVector, dominantElement.

- [ ] **Step 3: Test results route** — `curl http://localhost:3000/api/quiz/results/<sessionId>` — verify session data returned.

- [ ] **Step 4: Test validation** — POST with missing fields, invalid answers, out-of-range lat/lng — verify 400 errors.

- [ ] **Step 5: Test astrology fallback** — Temporarily set invalid `ASTROLOGY_API_KEY`, submit quiz, verify it still returns results using 50/50 numerology/MBTI.

- [ ] **Step 6: Full E2E in browser** — Walk through the complete wizard flow from welcome → personal details → 8 questions → loading → results.

- [ ] **Step 7: Final commit** — `git commit -m "feat: complete quiz UI integration"`
