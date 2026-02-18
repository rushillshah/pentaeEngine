import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/server/services/AuthService";

export async function POST(req: NextRequest) {
  try {
    const { email, password, first_name, last_name } = await req.json();

    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const result = await AuthService.signUp({ email, password, first_name, last_name });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({ user: result.user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sign up failed." }, { status: 500 });
  }
}
