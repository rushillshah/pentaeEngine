import db from "@/server/db/knex";
import type { User, UserUpdateInput } from "@/types/user";

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
    data: UserUpdateInput
  ): Promise<User | undefined> {
    const [updated] = await db<User>("users")
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning("*");
    return updated;
  }
}
