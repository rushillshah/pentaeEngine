import { NextRequest, NextResponse } from "next/server";
import { PersonalizationService } from "@/server/services/PersonalizationService";

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

    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
