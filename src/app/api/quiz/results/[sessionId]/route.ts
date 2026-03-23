import { NextRequest, NextResponse } from "next/server";
import { PersonalizationService } from "@/server/services/PersonalizationService";
import { RecommendationService } from "@/server/services/RecommendationService";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    const { sessionId } = await params;
    const id = parseInt(sessionId, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    }

    const session = await PersonalizationService.getSession(id);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const elementVector = {
      air: session.air_score || 0,
      water: session.water_score || 0,
      fire: session.fire_score || 0,
      earth: session.earth_score || 0,
      spirit: session.spirit_score || 0,
    };

    const recommendations = await RecommendationService.getRecommendations({
      dominantElement: session.dominant_element || "SPIRIT",
      elementVector,
    });

    return NextResponse.json({ session, recommendations });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
