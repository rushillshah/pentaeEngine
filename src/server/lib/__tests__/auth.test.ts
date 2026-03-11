import { hashPassword, verifyPassword } from "@/server/lib/auth";

describe("auth lib", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("hashPassword", () => {
    it("returns a bcrypt hash, not plaintext", async () => {
      const plain = "mySecret123";
      const hash = await hashPassword(plain);

      expect(hash).not.toBe(plain);
      expect(hash).toMatch(/^\$2[aby]?\$\d{2}\$/);
    });

    it("produces different hashes for the same input (salted)", async () => {
      const plain = "mySecret123";
      const hash1 = await hashPassword(plain);
      const hash2 = await hashPassword(plain);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("verifyPassword", () => {
    it("returns true for correct password", async () => {
      const plain = "correctPassword";
      const hash = await hashPassword(plain);

      const result = await verifyPassword(plain, hash);
      expect(result).toBe(true);
    });

    it("returns false for wrong password", async () => {
      const plain = "correctPassword";
      const hash = await hashPassword(plain);

      const result = await verifyPassword("wrongPassword", hash);
      expect(result).toBe(false);
    });

    it("returns false for empty string", async () => {
      const hash = await hashPassword("somePassword");

      const result = await verifyPassword("", hash);
      expect(result).toBe(false);
    });
  });
});
