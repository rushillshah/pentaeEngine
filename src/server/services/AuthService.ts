import { UserService } from "./UserService";
import { hashPassword, verifyPassword } from "@/server/lib/auth";
import { createSession, destroySession } from "@/server/lib/session";
import db from "@/server/db/knex";
import type { User } from "@/types/user";
import type { SignUpInput, AuthResult } from "@/types/auth";

export class AuthService {
  static async signUp(input: SignUpInput): Promise<AuthResult> {
    const existing = await UserService.getByEmail(input.email.toLowerCase());
    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    const password_hash = await hashPassword(input.password);

    const [user] = await db<User>("users")
      .insert({
        email: input.email.toLowerCase(),
        password_hash,
        first_name: input.first_name,
        last_name: input.last_name,
        is_verified: true,
        is_active: true,
        role: "customer",
      })
      .returning("*");

    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { password_hash: _, ...safe } = user;
    return { success: true, user: safe };
  }

  static async signIn(email: string, password: string): Promise<AuthResult> {
    const user = await UserService.getByEmail(email.toLowerCase());
    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return { success: false, error: "Invalid email or password." };
    }

    if (!user.is_active) {
      return { success: false, error: "This account has been deactivated." };
    }

    await db<User>("users").where({ id: user.id }).update({ last_login_at: db.fn.now() });

    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { password_hash: _, ...safe } = user;
    return { success: true, user: safe };
  }

  static async signOut(): Promise<void> {
    await destroySession();
  }
}
