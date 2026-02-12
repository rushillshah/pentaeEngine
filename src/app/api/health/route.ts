import { NextResponse } from "next/server";
import db from "@/server/db/knex";

export async function GET() {
  try {
    await db.raw("SELECT 1");
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch {
    return NextResponse.json(
      { status: "error", database: "disconnected" },
      { status: 503 }
    );
  }
}
