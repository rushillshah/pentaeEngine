# Quiz UI Integration Design

## Context

The pentaeEngine has three working Python personality engines (Numerology, MBTI, Astrology) that produce 5-element vectors. None are accessible from the web UI — the `/quiz` page is a placeholder. This spec covers porting the engines to TypeScript, building API routes, a personalization service, and a multi-step quiz frontend.

## Decisions

- **Engine language**: TypeScript (port from Python) — runs natively in Next.js, no subprocess
- **Astrology chart source**: External API (no TS equivalent of Swiss Ephemeris)
- **Quiz flow**: Single multi-step wizard at `/quiz`
- **Auth**: Guest-first — anonymous user record created, linkable to account later
- **Results**: Element breakdown visualization only (no recommendations or narrative yet)

---

## 1. TypeScript Engines

All engines live under `src/server/engines/` and export a `run()` function returning `ElementVector`.

### Shared Type

Reuse the existing `ElementVector` from `src/types/personalization.ts` — do NOT create a duplicate. All engines import from `@/types/personalization`.

### 1.1 Numerology — `src/server/engines/numerology/`

Port of `src/engines/numerology/`. Pure math, no external dependencies.

| File | Exports | Logic |
|------|---------|-------|
| `constants.ts` | `LETTER_MAP`, `VOWELS`, `MASTER_NUMBERS`, `WEIGHTS`, `ELEMENT_VECTORS` | Same values as Python `parameters.py` |
| `calculator.ts` | `getLifePath(dob)`, `getExpression(name)`, `getSoulUrge(name)`, `cleanString(s)`, `reduceNumber(n)` | Digit sum + reduce, Pythagorean letter map, vowel extraction. Parser utilities (`cleanString`, `reduceNumber`) are inlined here rather than in a separate file. |
| `elementMapper.ts` | `numberToVector(n)` | Lookup in `ELEMENT_VECTORS` for 1-9, 11, 22, 33 |
| `aggregator.ts` | `mixProfiles(lpVec, expVec, suVec)` | Weighted: LP 50%, Expression 30%, Soul Urge 20% |
| `index.ts` | `run(dob: string, fullName: string): ElementVector` | Orchestrates calculator → mapper → aggregator |

### 1.2 MBTI — `src/server/engines/mbti/`

Port of `src/engines/mbti/`. Pure math, no external dependencies.

| File | Exports | Logic |
|------|---------|-------|
| `constants.ts` | `FUNCTIONS`, `QUESTIONS`, `ELEMENT_MATRIX` | 8 questions with favored/opposite, 8×5 element matrix. Questions include `text` field for frontend display. |
| `scorer.ts` | `scoreFunctions(answers)`, `normalizeFunctions(raw)` | v to favored, 6-v to opposite. Normalize to sum=1.0 |
| `elementMapper.ts` | `functionsToElements(normalized)` | Multiply each function's weight by its element row, sum, normalize |
| `index.ts` | `run(answers: number[]): ElementVector` | Orchestrates scorer → mapper |

**Frontend question access**: The MBTI `constants.ts` is a plain data file with no server-only imports, so it can be imported by both server engines and client components.

### 1.3 Astrology — `src/server/engines/astrology/`

Port of element mapping logic. Chart data comes from external API.

| File | Exports | Logic |
|------|---------|-------|
| `constants.ts` | `SIGN_ELEMENTS`, `PLANET_WEIGHTS`, `SPIRIT_*` constants | Sign-to-element mapping uses full sign names (Aries, Taurus, etc.) to match external API format. |
| `chartService.ts` | `computeNatalChart(year, month, day, hour, minute, lat, lng): Promise<NatalChart>` | Calls external astrology API, normalizes response sign names to match `SIGN_ELEMENTS` keys, returns `NatalChart`. Timezone resolution is handled by the external API (it accepts lat/lng and resolves internally). |
| `elementMapper.ts` | `chartToElementVector(chart): ElementVector` | Planet weight contributions + spirit bonuses. Returns raw vector then normalizes to sum=1.0 (absorbs the aggregator's normalization step since astrology has no sub-vector mixing). |
| `index.ts` | `run(year, month, day, hour, minute, lat, lng): Promise<ElementVector>` | chart → map (includes normalize) |

**NatalChart type:**
```typescript
interface PlanetPlacement { sign: string; house: number; }
interface NatalChart {
  sun: PlanetPlacement; moon: PlanetPlacement; ascendant: { sign: string };
  mercury: PlanetPlacement; venus: PlanetPlacement; mars: PlanetPlacement;
  jupiter: PlanetPlacement; saturn: PlanetPlacement;
  uranus: PlanetPlacement; neptune: PlanetPlacement; pluto: PlanetPlacement;
}
```

**External API**: Use a third-party astrology API (e.g., AstroAPI). The `chartService.ts` is the only file that touches the external API — all other files work with the `NatalChart` type.

**New env vars** (add to `.env.local`):
```
ASTROLOGY_API_KEY=<your-key>
ASTROLOGY_API_URL=<api-base-url>
```

### 1.4 Combiner — `src/server/engines/combiner.ts`

```typescript
export function combineVectors(
  vectors: Record<string, ElementVector>,
  weights: Record<string, number>
): ElementVector
```

Weighted average, normalized to sum=1.0. Default weights: `{ numerology: 0.33, mbti: 0.33, astrology: 0.34 }`.

---

## 2. PersonalizationService

**File**: `src/server/services/PersonalizationService.ts`

Static class following the existing service pattern (like `AuthService`, `ProductService`).

### Methods

**`runQuiz(input: QuizInput): Promise<QuizResult>`**

1. Create `anonymous_users` record → get `anonymousUserId`
2. Create `personalization_sessions` record (status: ACTIVE, consent_given: true, consent_at: now)
3. Run all 3 engines concurrently with `Promise.all()`:
   - `numerologyEngine.run(input.dob, input.fullName)`
   - `mbtiEngine.run(input.mbtiAnswers)`
   - `astrologyEngine.run(...)` (async — external API)
4. Save each engine's output as a `personalization_module_responses` row (module, input_payload, output_vector, status: COMPLETED)
5. Combine vectors with `combineVectors()`
6. Update session: set quintessence scores (air_score, water_score, etc.), dominant_element, status=COMPLETED
7. Return `{ sessionId, elementVector, dominantElement }`

**Error handling**: If the astrology API fails, catch the error, save its module response with status=FAILED, and combine only the successful engines (reweight to 50/50 numerology/MBTI). Numerology and MBTI are pure computation and should not fail. If they do, fail the entire quiz.

**`getSession(sessionId: number): Promise<PersonalizationSession | null>`**

Fetch session by ID for results retrieval. Session ID is a `number` (auto-incrementing integer from DB).

### Types

```typescript
interface QuizInput {
  fullName: string;
  dob: string;            // "YYYY-MM-DD"
  birthHour: number;      // 0-23
  birthMinute: number;    // 0-59
  birthLat: number;       // -90 to 90
  birthLng: number;       // -180 to 180
  mbtiAnswers: number[];  // 8 ints, each 1-5
}

interface QuizResult {
  sessionId: number;
  elementVector: ElementVector;
  dominantElement: string;
}
```

---

## 3. API Routes

### `POST /api/quiz/submit`

**File**: `src/app/api/quiz/submit/route.ts`

Thin route handler:
1. Parse and validate request body:
   - `fullName`: non-empty string
   - `dob`: valid YYYY-MM-DD format
   - `birthHour`: integer 0-23
   - `birthMinute`: integer 0-59
   - `birthLat`: number -90 to 90
   - `birthLng`: number -180 to 180
   - `mbtiAnswers`: array of exactly 8 integers, each 1-5
2. Call `PersonalizationService.runQuiz(input)`
3. Return `NextResponse.json({ sessionId, elementVector, dominantElement })`
4. On validation error: return `{ error: message }` with 400
5. On server error: return `{ error: "Something went wrong" }` with 500

### `GET /api/quiz/results/[sessionId]`

**File**: `src/app/api/quiz/results/[sessionId]/route.ts`

1. Parse `sessionId` as integer
2. Call `PersonalizationService.getSession(sessionId)`
3. Return session data with quintessence scores
4. 404 if not found

---

## 4. Quiz Frontend

### Component Decomposition

The wizard is split into focused components under `src/app/components/quiz/`:

| Component | Purpose |
|-----------|---------|
| `QuizWizard.tsx` | Top-level client component — manages step state, orchestrates navigation |
| `QuizWelcome.tsx` | Step 0: intro + consent checkbox + start button |
| `QuizPersonalDetails.tsx` | Step 1: name, DOB, birth time, lat/lng form |
| `QuizQuestion.tsx` | Steps 2-9: reusable Likert question component |
| `QuizLoading.tsx` | Step 10: loading spinner |
| `QuizResults.tsx` | Step 11: element breakdown visualization |
| `QuizProgress.tsx` | Progress bar (step X of 10) |

The `/quiz/page.tsx` is a thin server component that renders `<QuizWizard />`.

### Steps

| Step | Component | Content |
|------|-----------|---------|
| 0 | QuizWelcome | "Discover your elemental profile" + consent checkbox + Start |
| 1 | QuizPersonalDetails | Full name, DOB, birth time (HH:MM), latitude, longitude |
| 2-9 | QuizQuestion (×8) | One MBTI question per step, Likert 1-5 as styled buttons |
| 10 | QuizLoading | "Calculating your elemental profile..." spinner |
| 11 | QuizResults | Element breakdown bars + dominant element |

**Navigation**: Back button on steps 1-9 to allow corrections. No back from loading/results.

### State (in QuizWizard)

```typescript
const [step, setStep] = useState(0);
const [details, setDetails] = useState<PersonalDetails>({ ... });
const [answers, setAnswers] = useState<number[]>([]);
const [result, setResult] = useState<QuizResult | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

### Results Display (QuizResults)

- Heading: "Your Elemental Profile" (Playfair Display)
- Dominant element name in large text with element color
- 5 horizontal bars with percentages
- Bar colors: Fire=#E25822, Water=#4A90D9, Air=#87CEEB, Earth=#8B7355, Spirit=#9B59B6

### Styling

- Cream background, charcoal text
- Playfair Display for headings, Inter for body
- Gold accent buttons (`bg-gold text-cream`)
- Progress indicator showing step X of 10

---

## 5. Files to Create/Modify

### New Files (25)

```
# TS Engines
src/server/engines/combiner.ts
src/server/engines/numerology/constants.ts
src/server/engines/numerology/calculator.ts
src/server/engines/numerology/elementMapper.ts
src/server/engines/numerology/aggregator.ts
src/server/engines/numerology/index.ts
src/server/engines/mbti/constants.ts
src/server/engines/mbti/scorer.ts
src/server/engines/mbti/elementMapper.ts
src/server/engines/mbti/index.ts
src/server/engines/astrology/constants.ts
src/server/engines/astrology/chartService.ts
src/server/engines/astrology/elementMapper.ts
src/server/engines/astrology/index.ts

# Service
src/server/services/PersonalizationService.ts

# API Routes
src/app/api/quiz/submit/route.ts
src/app/api/quiz/results/[sessionId]/route.ts

# Frontend Components
src/app/components/quiz/QuizWizard.tsx
src/app/components/quiz/QuizWelcome.tsx
src/app/components/quiz/QuizPersonalDetails.tsx
src/app/components/quiz/QuizQuestion.tsx
src/app/components/quiz/QuizLoading.tsx
src/app/components/quiz/QuizResults.tsx
src/app/components/quiz/QuizProgress.tsx

# Page (rewrite)
src/app/quiz/page.tsx
```

---

## 6. Verification

1. **Unit tests** (Vitest, in `__tests__/` co-located with each engine):
   - Port Python test assertions for numerology calculator, element mapper, aggregator
   - Port Python test assertions for MBTI scorer, element mapper
   - Port Python test assertions for astrology element mapper, spirit bonuses
   - Test combiner with known vectors
   - Mock external astrology API in chartService tests
2. **Cross-check**: Run Python and TS engines with identical inputs, verify element vectors match within rounding tolerance
3. **API test**: POST to `/api/quiz/submit` with valid + invalid data, verify response shapes and DB records
4. **Manual E2E**: Walk through quiz wizard, verify each step, submit, see results
5. **Error case**: Simulate astrology API failure, verify graceful degradation to 2-module results
