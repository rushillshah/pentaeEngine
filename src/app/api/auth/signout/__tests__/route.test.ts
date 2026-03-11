vi.mock("@/server/services/AuthService", () => ({
  AuthService: {
    signOut: vi.fn(),
  },
}));

import { POST } from "@/app/api/auth/signout/route";
import { AuthService } from "@/server/services/AuthService";

const mockedSignOut = vi.mocked(AuthService.signOut);

describe("POST /api/auth/signout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 on successful sign out", async () => {
    mockedSignOut.mockResolvedValue(undefined);

    const res = await POST();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("returns 500 on error", async () => {
    mockedSignOut.mockRejectedValue(new Error("Session error"));

    const res = await POST();
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Sign out failed.");
  });
});
