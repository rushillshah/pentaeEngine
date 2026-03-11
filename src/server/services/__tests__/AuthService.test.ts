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

vi.mock("@/server/services/UserService", () => ({
  UserService: {
    getByEmail: vi.fn(),
  },
}));

vi.mock("@/server/lib/auth", () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
}));

vi.mock("@/server/lib/session", () => ({
  createSession: vi.fn(),
  destroySession: vi.fn(),
}));

import { AuthService } from "@/server/services/AuthService";
import { UserService } from "@/server/services/UserService";
import { hashPassword, verifyPassword } from "@/server/lib/auth";
import { createSession, destroySession } from "@/server/lib/session";

const mockedGetByEmail = vi.mocked(UserService.getByEmail);
const mockedHashPassword = vi.mocked(hashPassword);
const mockedVerifyPassword = vi.mocked(verifyPassword);
const mockedCreateSession = vi.mocked(createSession);
const mockedDestroySession = vi.mocked(destroySession);

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const key of Object.keys(chain) as (keyof typeof chain)[]) {
      chain[key].mockReturnValue(chain);
    }
  });

  describe("signUp", () => {
    const signUpInput = {
      email: "Test@Example.com",
      password: "password123",
      first_name: "Jane",
      last_name: "Doe",
    };

    it("returns success with user for valid input", async () => {
      mockedGetByEmail.mockResolvedValue(undefined);
      mockedHashPassword.mockResolvedValue("hashed_pw");
      chain.returning.mockResolvedValue([mockUser]);
      mockedCreateSession.mockResolvedValue("token");

      const result = await AuthService.signUp(signUpInput);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it("returns error for duplicate email", async () => {
      mockedGetByEmail.mockResolvedValue(mockUser);

      const result = await AuthService.signUp(signUpInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "An account with this email already exists."
      );
    });

    it("lowercases email", async () => {
      mockedGetByEmail.mockResolvedValue(undefined);
      mockedHashPassword.mockResolvedValue("hashed_pw");
      chain.returning.mockResolvedValue([mockUser]);
      mockedCreateSession.mockResolvedValue("token");

      await AuthService.signUp(signUpInput);

      expect(mockedGetByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(chain.insert).toHaveBeenCalledWith(
        expect.objectContaining({ email: "test@example.com" })
      );
    });

    it("hashes password", async () => {
      mockedGetByEmail.mockResolvedValue(undefined);
      mockedHashPassword.mockResolvedValue("hashed_pw");
      chain.returning.mockResolvedValue([mockUser]);
      mockedCreateSession.mockResolvedValue("token");

      await AuthService.signUp(signUpInput);

      expect(mockedHashPassword).toHaveBeenCalledWith("password123");
      expect(chain.insert).toHaveBeenCalledWith(
        expect.objectContaining({ password_hash: "hashed_pw" })
      );
    });

    it("strips password_hash from returned user", async () => {
      mockedGetByEmail.mockResolvedValue(undefined);
      mockedHashPassword.mockResolvedValue("hashed_pw");
      chain.returning.mockResolvedValue([mockUser]);
      mockedCreateSession.mockResolvedValue("token");

      const result = await AuthService.signUp(signUpInput);

      expect(result.user).toBeDefined();
      expect(result.user).not.toHaveProperty("password_hash");
    });
  });

  describe("signIn", () => {
    it("returns success for valid credentials", async () => {
      mockedGetByEmail.mockResolvedValue(mockUser);
      mockedVerifyPassword.mockResolvedValue(true);
      mockedCreateSession.mockResolvedValue("token");

      const result = await AuthService.signIn("test@example.com", "password123");

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user).not.toHaveProperty("password_hash");
    });

    it("returns error for non-existent email", async () => {
      mockedGetByEmail.mockResolvedValue(undefined);

      const result = await AuthService.signIn("nobody@example.com", "pass");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid email or password.");
    });

    it("returns error for wrong password", async () => {
      mockedGetByEmail.mockResolvedValue(mockUser);
      mockedVerifyPassword.mockResolvedValue(false);

      const result = await AuthService.signIn("test@example.com", "wrong");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid email or password.");
    });

    it("returns error for deactivated account", async () => {
      const inactiveUser = { ...mockUser, is_active: false };
      mockedGetByEmail.mockResolvedValue(inactiveUser);
      mockedVerifyPassword.mockResolvedValue(true);

      const result = await AuthService.signIn("test@example.com", "password123");

      expect(result.success).toBe(false);
      expect(result.error).toBe("This account has been deactivated.");
    });

    it("updates last_login_at", async () => {
      mockedGetByEmail.mockResolvedValue(mockUser);
      mockedVerifyPassword.mockResolvedValue(true);
      mockedCreateSession.mockResolvedValue("token");

      await AuthService.signIn("test@example.com", "password123");

      expect(db).toHaveBeenCalledWith("users");
      expect(chain.where).toHaveBeenCalledWith({ id: mockUser.id });
      expect(chain.update).toHaveBeenCalledWith({ last_login_at: "NOW()" });
    });
  });

  describe("signOut", () => {
    it("calls destroySession", async () => {
      mockedDestroySession.mockResolvedValue(undefined);

      await AuthService.signOut();

      expect(mockedDestroySession).toHaveBeenCalled();
    });
  });
});
