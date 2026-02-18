import { NextResponse } from "next/server";
import { AuthService } from "@/server/services/AuthService";

export async function POST() {
  try {
    await AuthService.signOut();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sign out failed." }, { status: 500 });
  }
}
