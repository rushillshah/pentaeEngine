import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/server/services/AuthService";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const result = await AuthService.signIn(email, password);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({ user: result.user });
  } catch {
    return NextResponse.json({ error: "Sign in failed." }, { status: 500 });
  }
}
