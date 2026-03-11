import { NextRequest } from "next/server";
import { mockPublicUser } from "@/test/fixtures/users";

vi.mock("@/server/services/AuthService", () => ({
  AuthService: {
    signIn: vi.fn(),
  },
}));

import { POST } from "@/app/api/auth/signin/route";
import { AuthService } from "@/server/services/AuthService";

const mockedSignIn = vi.mocked(AuthService.signIn);

function createRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/auth/signin", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/auth/signin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 on successful sign in", async () => {
    mockedSignIn.mockResolvedValue({
      success: true,
      user: mockPublicUser,
    });

    const req = createRequest({
      email: "test@example.com",
      password: "password123",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.user).toEqual(expect.objectContaining({ email: "test@example.com" }));
  });

  it("returns 400 when fields are missing", async () => {
    const req = createRequest({ email: "test@example.com" });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Email and password are required.");
  });

  it("returns 401 for invalid credentials", async () => {
    mockedSignIn.mockResolvedValue({
      success: false,
      error: "Invalid email or password.",
    });

    const req = createRequest({
      email: "test@example.com",
      password: "wrongpassword",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Invalid email or password.");
  });

  it("returns 500 on internal error", async () => {
    mockedSignIn.mockRejectedValue(new Error("DB down"));

    const req = createRequest({
      email: "test@example.com",
      password: "password123",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Sign in failed.");
  });
});
