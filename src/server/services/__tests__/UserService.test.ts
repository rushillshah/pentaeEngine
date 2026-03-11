import { mockUser } from "@/test/fixtures/users";

const { db, chain } = vi.hoisted(() => {
  const _chain = {
    select: vi.fn(),
    where: vi.fn(),
    first: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    orderBy: vi.fn(),
    returning: vi.fn(),
    raw: vi.fn(),
  };
  for (const key of Object.keys(_chain) as (keyof typeof _chain)[]) {
    _chain[key].mockReturnValue(_chain);
  }
  const _db = vi.fn(() => _chain) as unknown as ReturnType<typeof vi.fn> & {
    raw: ReturnType<typeof vi.fn>;
    fn: { now: ReturnType<typeof vi.fn> };
  };
  _db.raw = _chain.raw;
  _db.fn = { now: vi.fn(() => "NOW()") };
  return { db: _db, chain: _chain };
});

vi.mock("@/server/db/knex", () => ({
  default: db,
}));

import { UserService } from "@/server/services/UserService";

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const key of Object.keys(chain) as (keyof typeof chain)[]) {
      chain[key].mockReturnValue(chain);
    }
  });

  describe("getAll", () => {
    it("returns users ordered by created_at desc", async () => {
      const users = [mockUser];
      chain.orderBy.mockResolvedValue(users);

      const result = await UserService.getAll();

      expect(db).toHaveBeenCalledWith("users");
      expect(chain.select).toHaveBeenCalledWith("*");
      expect(chain.orderBy).toHaveBeenCalledWith("created_at", "desc");
      expect(result).toEqual(users);
    });
  });

  describe("getById", () => {
    it("returns user when found", async () => {
      chain.first.mockResolvedValue(mockUser);

      const result = await UserService.getById(1);

      expect(db).toHaveBeenCalledWith("users");
      expect(chain.where).toHaveBeenCalledWith({ id: 1 });
      expect(chain.first).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("returns undefined when not found", async () => {
      chain.first.mockResolvedValue(undefined);

      const result = await UserService.getById(999);

      expect(chain.where).toHaveBeenCalledWith({ id: 999 });
      expect(result).toBeUndefined();
    });
  });

  describe("getByEmail", () => {
    it("returns user when found", async () => {
      chain.first.mockResolvedValue(mockUser);

      const result = await UserService.getByEmail("test@example.com");

      expect(db).toHaveBeenCalledWith("users");
      expect(chain.where).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(chain.first).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("returns undefined when not found", async () => {
      chain.first.mockResolvedValue(undefined);

      const result = await UserService.getByEmail("nobody@example.com");

      expect(result).toBeUndefined();
    });
  });

  describe("update", () => {
    it("returns updated user", async () => {
      const updatedUser = { ...mockUser, first_name: "Updated" };
      chain.returning.mockResolvedValue([updatedUser]);

      const result = await UserService.update(1, { first_name: "Updated" });

      expect(db).toHaveBeenCalledWith("users");
      expect(chain.where).toHaveBeenCalledWith({ id: 1 });
      expect(chain.update).toHaveBeenCalledWith(
        expect.objectContaining({ first_name: "Updated", updated_at: "NOW()" })
      );
      expect(chain.returning).toHaveBeenCalledWith("*");
      expect(result).toEqual(updatedUser);
    });

    it("returns undefined for non-existent id", async () => {
      chain.returning.mockResolvedValue([]);

      const result = await UserService.update(999, { first_name: "Ghost" });

      expect(result).toBeUndefined();
    });

    it("sets updated_at", async () => {
      chain.returning.mockResolvedValue([mockUser]);

      await UserService.update(1, { email: "new@example.com" });

      expect(chain.update).toHaveBeenCalledWith(
        expect.objectContaining({ updated_at: "NOW()" })
      );
    });
  });
});
