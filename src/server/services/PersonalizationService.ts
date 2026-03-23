import db from "@/server/db/knex";
import { run as runNumerology } from "@/server/engines/numerology/index";
import { run as runMbti } from "@/server/engines/mbti/index";
import { run as runAstrology } from "@/server/engines/astrology/index";
import {
  combineVectors,
  MODULE_WEIGHTS,
  FALLBACK_WEIGHTS,
} from "@/server/engines/combiner";
import {
  LIFE_PATH_MEANINGS,
  EXPRESSION_MEANINGS,
  SOUL_URGE_MEANINGS,
} from "@/server/engines/numerology/meanings";
import type {
  ElementVector,
  NumerologyDetails,
  PersonalizationSession,
  QuizInput,
  QuizResult,
} from "@/types/personalization";

const ELEMENTS = ["air", "water", "fire", "earth", "spirit"] as const;

function findDominantElement(vector: ElementVector): string {
  let dominant: string = ELEMENTS[0];
  let maxScore = -1;

  for (const el of ELEMENTS) {
    if (vector[el] > maxScore) {
      maxScore = vector[el];
      dominant = el;
    }
  }

  return dominant.toUpperCase();
}

function parseDateParts(dob: string): { year: number; month: number; day: number } {
  const [yearStr, monthStr, dayStr] = dob.split("-");
  return {
    year: parseInt(yearStr, 10),
    month: parseInt(monthStr, 10),
    day: parseInt(dayStr, 10),
  };
}

function buildNumerologyDetails(
  lifePath: number,
  expression: number,
  soulUrge: number | null,
): NumerologyDetails {
  return {
    lifePath,
    lifePathMeaning: LIFE_PATH_MEANINGS[lifePath] ?? "",
    expression,
    expressionMeaning: EXPRESSION_MEANINGS[expression] ?? "",
    soulUrge,
    soulUrgeMeaning: soulUrge !== null ? (SOUL_URGE_MEANINGS[soulUrge] ?? "") : null,
  };
}

export class PersonalizationService {
  static async runQuiz(input: QuizInput): Promise<QuizResult> {
    const [anonymousUser] = await db("anonymous_users")
      .insert({})
      .returning("id");

    const anonymousUserId: string = anonymousUser.id ?? anonymousUser;

    const now = new Date();

    const [session] = await db("personalization_sessions")
      .insert({
        anonymous_user_id: anonymousUserId,
        status: "ACTIVE",
        consent_given: true,
        consent_at: now,
        started_at: now,
      })
      .returning("*");

    const sessionId: number = session.id;

    const numResult = runNumerology(input.dob, input.fullName);
    const mbtiResult = runMbti(input.mbtiAnswers);

    let astroResult: ElementVector | null = null;
    const { year, month, day } = parseDateParts(input.dob);

    try {
      astroResult = await runAstrology(
        year,
        month,
        day,
        input.birthHour,
        input.birthMinute,
        input.birthLat,
        input.birthLng,
      );
    } catch {
      // Astrology failed -- will use fallback weights
    }

    await db("personalization_module_responses").insert([
      {
        session_id: sessionId,
        module: "NUMEROLOGY",
        input_payload: JSON.stringify({ dob: input.dob, fullName: input.fullName }),
        output_vector: JSON.stringify(numResult.elementVector),
        status: "COMPLETED",
        completed_at: now,
      },
      {
        session_id: sessionId,
        module: "MBTI",
        input_payload: JSON.stringify({ answers: input.mbtiAnswers }),
        output_vector: JSON.stringify(mbtiResult),
        status: "COMPLETED",
        completed_at: now,
      },
      {
        session_id: sessionId,
        module: "ASTROLOGY",
        input_payload: JSON.stringify({
          year,
          month,
          day,
          hour: input.birthHour,
          minute: input.birthMinute,
          lat: input.birthLat,
          lng: input.birthLng,
        }),
        output_vector: astroResult ? JSON.stringify(astroResult) : null,
        status: astroResult ? "COMPLETED" : "FAILED",
        completed_at: astroResult ? now : null,
      },
    ]);

    const vectors: Record<string, ElementVector> = {
      numerology: numResult.elementVector,
      mbti: mbtiResult,
    };
    let weights: Record<string, number>;

    if (astroResult) {
      vectors.astrology = astroResult;
      weights = MODULE_WEIGHTS;
    } else {
      weights = FALLBACK_WEIGHTS;
    }

    const elementVector = combineVectors(vectors, weights);
    const dominantElement = findDominantElement(elementVector);
    const numerologyDetails = buildNumerologyDetails(
      numResult.lifePath,
      numResult.expression,
      numResult.soulUrge,
    );

    await db("personalization_sessions").where({ id: sessionId }).update({
      air_score: elementVector.air,
      water_score: elementVector.water,
      fire_score: elementVector.fire,
      earth_score: elementVector.earth,
      spirit_score: elementVector.spirit,
      dominant_element: dominantElement,
      weights_used: JSON.stringify(weights),
      status: "COMPLETED",
      completed_at: new Date(),
    });

    return {
      sessionId,
      elementVector,
      dominantElement,
      numerologyDetails,
      narrativeText: "",
      narrativeSource: "FALLBACK",
    };
  }

  static async getSession(id: number): Promise<PersonalizationSession | null> {
    const session = await db("personalization_sessions").where({ id }).first();
    return session ?? null;
  }
}
