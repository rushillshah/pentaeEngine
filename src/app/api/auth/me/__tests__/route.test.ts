import { mockUser, mockPublicUser } from "@/test/fixtures/users";

vi.mock("@/server/lib/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/server/services/UserService", () => ({
  UserService: {
    getById: vi.fn(),
  },
}));

import { GET } from "@/app/api/auth/me/route";
import { getSession } from "@/server/lib/session";
import { UserService } from "@/server/services/UserService";

const mockedGetSession = vi.mocked(getSession);
const mockedGetById = vi.mocked(UserService.getById);

describe("GET /api/auth/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with user when session exists", async () => {
    mockedGetSession.mockResolvedValue({
      userId: 1,
      email: "test@example.com",
      role: "customer",
    });
    mockedGetById.mockResolvedValue(mockUser);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.user).toEqual(expect.objectContaining({ id: mockPublicUser.id, email: mockPublicUser.email }));
    expect(data.user).not.toHaveProperty("password_hash");
  });

  it("returns null when no session", async () => {
    mockedGetSession.mockResolvedValue(null);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.user).toBeNull();
  });

  it("returns null when user not found", async () => {
    mockedGetSession.mockResolvedValue({
      userId: 999,
      email: "gone@example.com",
      role: "customer",
    });
    mockedGetById.mockResolvedValue(undefined);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.user).toBeNull();
  });
});
