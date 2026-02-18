import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/server/services/UserService";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await UserService.getById(Number(id));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { password_hash: _, ...safe } = user;
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const allowed = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "shipping_address_line1",
      "shipping_address_line2",
      "shipping_city",
      "shipping_state",
      "shipping_postal_code",
      "shipping_country",
    ] as const;

    const data: Record<string, string | null> = {};
    for (const key of allowed) {
      if (key in body) {
        data[key] = body[key];
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updated = await UserService.update(Number(id), data);
    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { password_hash: _, ...safe } = updated;
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
