import db from "@/server/db/knex";
import type { User } from "@/server/types/user";

export class UserService {
  static async getAll(): Promise<User[]> {
    return db<User>("users").select("*").orderBy("created_at", "desc");
  }

  static async getById(id: number): Promise<User | undefined> {
    return db<User>("users").where({ id }).first();
  }

  static async getByEmail(email: string): Promise<User | undefined> {
    return db<User>("users").where({ email }).first();
  }

  static async update(
    id: number,
    data: Partial<
      Pick<
        User,
        | "first_name"
        | "last_name"
        | "email"
        | "phone"
        | "shipping_address_line1"
        | "shipping_address_line2"
        | "shipping_city"
        | "shipping_state"
        | "shipping_postal_code"
        | "shipping_country"
      >
    >
  ): Promise<User | undefined> {
    const [updated] = await db<User>("users")
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning("*");
    return updated;
  }
}
