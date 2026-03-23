import { NextRequest, NextResponse } from "next/server";
import { PersonalizationService } from "@/server/services/PersonalizationService";
import type { QuizInput } from "@/types/personalization";
import {
  sanitizeString,
  isValidName,
  isValidDob,
  isFiniteNumber,
  stripPrototypeKeys,
} from "@/server/lib/sanitize";
import { rateLimiter } from "@/server/lib/rateLimit";

function validateQuizInput(
  body: unknown
): { valid: true; input: QuizInput } | { valid: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { valid: false, error: "Request body must be a JSON object" };
  }

  const b = stripPrototypeKeys(body as Record<string, unknown>);

  if (typeof b.fullName !== "string") {
    return { valid: false, error: "fullName is required" };
  }

  const sanitizedName = sanitizeString(b.fullName, 200);
  if (!isValidName(sanitizedName)) {
    return {
      valid: false,
      error:
        "fullName must contain only letters, spaces, hyphens, apostrophes, and periods",
    };
  }

  if (typeof b.dob !== "string") {
    return { valid: false, error: "dob is required in YYYY-MM-DD format" };
  }

  const parsedDob = isValidDob(b.dob);
  if (parsedDob === null) {
    return {
      valid: false,
      error: "dob must be a valid date in YYYY-MM-DD format, between 1900 and today",
    };
  }

  if (
    !Number.isInteger(b.birthHour) ||
    (b.birthHour as number) < 0 ||
    (b.birthHour as number) > 23
  ) {
    return {
      valid: false,
      error: "birthHour must be an integer between 0 and 23",
    };
  }

  if (
    !Number.isInteger(b.birthMinute) ||
    (b.birthMinute as number) < 0 ||
    (b.birthMinute as number) > 59
  ) {
    return {
      valid: false,
      error: "birthMinute must be an integer between 0 and 59",
    };
  }

  if (!isFiniteNumber(b.birthLat) || b.birthLat < -90 || b.birthLat > 90) {
    return {
      valid: false,
      error: "birthLat must be a finite number between -90 and 90",
    };
  }

  if (!isFiniteNumber(b.birthLng) || b.birthLng < -180 || b.birthLng > 180) {
    return {
      valid: false,
      error: "birthLng must be a finite number between -180 and 180",
    };
  }

  if (!Array.isArray(b.mbtiAnswers) || b.mbtiAnswers.length !== 16) {
    return {
      valid: false,
      error: "mbtiAnswers must be an array of exactly 16 integers",
    };
  }

  for (let i = 0; i < b.mbtiAnswers.length; i++) {
    const val = b.mbtiAnswers[i];
    if (!Number.isInteger(val) || val < 1 || val > 5) {
      return {
        valid: false,
        error: "Each mbtiAnswer must be an integer between 1 and 5",
      };
    }
  }

  return {
    valid: true,
    input: {
      fullName: sanitizedName,
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
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const limit = rateLimiter.check(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((limit.retryAfterMs || 60_000) / 1000)
            ),
          },
        }
      );
    }

    const body = await request.json();
    const validation = validateQuizInput(body);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const result = await PersonalizationService.runQuiz(validation.input);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
