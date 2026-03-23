import { NextRequest, NextResponse } from "next/server";
import { PersonalizationService } from "@/server/services/PersonalizationService";
import type { QuizInput } from "@/types/personalization";

const DOB_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function validateQuizInput(body: unknown): { valid: true; input: QuizInput } | { valid: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { valid: false, error: "Request body must be a JSON object" };
  }

  const b = body as Record<string, unknown>;

  if (typeof b.fullName !== "string" || b.fullName.trim() === "") {
    return { valid: false, error: "fullName must be a non-empty string" };
  }

  if (typeof b.dob !== "string" || !DOB_PATTERN.test(b.dob)) {
    return { valid: false, error: "dob must be a string in YYYY-MM-DD format" };
  }

  if (!Number.isInteger(b.birthHour) || (b.birthHour as number) < 0 || (b.birthHour as number) > 23) {
    return { valid: false, error: "birthHour must be an integer between 0 and 23" };
  }

  if (!Number.isInteger(b.birthMinute) || (b.birthMinute as number) < 0 || (b.birthMinute as number) > 59) {
    return { valid: false, error: "birthMinute must be an integer between 0 and 59" };
  }

  if (typeof b.birthLat !== "number" || b.birthLat < -90 || b.birthLat > 90) {
    return { valid: false, error: "birthLat must be a number between -90 and 90" };
  }

  if (typeof b.birthLng !== "number" || b.birthLng < -180 || b.birthLng > 180) {
    return { valid: false, error: "birthLng must be a number between -180 and 180" };
  }

  if (!Array.isArray(b.mbtiAnswers) || b.mbtiAnswers.length !== 8) {
    return { valid: false, error: "mbtiAnswers must be an array of exactly 8 integers" };
  }

  for (let i = 0; i < b.mbtiAnswers.length; i++) {
    const val = b.mbtiAnswers[i];
    if (!Number.isInteger(val) || val < 1 || val > 5) {
      return { valid: false, error: `mbtiAnswers[${i}] must be an integer between 1 and 5` };
    }
  }

  return {
    valid: true,
    input: {
      fullName: b.fullName.trim(),
      dob: b.dob,
      birthHour: b.birthHour as number,
      birthMinute: b.birthMinute as number,
      birthLat: b.birthLat as number,
      birthLng: b.birthLng as number,
      mbtiAnswers: b.mbtiAnswers as number[],
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateQuizInput(body);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const result = await PersonalizationService.runQuiz(validation.input);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
