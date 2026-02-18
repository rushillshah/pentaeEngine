import { NextResponse } from "next/server";
import { getSession } from "@/server/lib/session";
import { UserService } from "@/server/services/UserService";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const user = await UserService.getById(session.userId);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    const { password_hash: _, ...safe } = user;
    return NextResponse.json({ user: safe });
  } catch {
    return NextResponse.json({ user: null });
  }
}
