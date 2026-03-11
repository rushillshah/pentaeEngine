import { NextRequest } from "next/server";
import { mockPublicUser } from "@/test/fixtures/users";

vi.mock("@/server/services/AuthService", () => ({
  AuthService: {
    signUp: vi.fn(),
  },
}));

import { POST } from "@/app/api/auth/signup/route";
import { AuthService } from "@/server/services/AuthService";

const mockedSignUp = vi.mocked(AuthService.signUp);

function createRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 201 on successful sign up", async () => {
    mockedSignUp.mockResolvedValue({
      success: true,
      user: mockPublicUser,
    });

    const req = createRequest({
      email: "test@example.com",
      password: "password123",
      first_name: "Jane",
      last_name: "Doe",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.user).toEqual(expect.objectContaining({ email: "test@example.com" }));
  });

  it("returns 400 when fields are missing", async () => {
    const req = createRequest({ email: "test@example.com" });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("All fields are required.");
  });

  it("returns 400 when password is too short", async () => {
    const req = createRequest({
      email: "test@example.com",
      password: "12345",
      first_name: "Jane",
      last_name: "Doe",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Password must be at least 6 characters.");
  });

  it("returns 409 for duplicate email", async () => {
    mockedSignUp.mockResolvedValue({
      success: false,
      error: "An account with this email already exists.",
    });

    const req = createRequest({
      email: "existing@example.com",
      password: "password123",
      first_name: "Jane",
      last_name: "Doe",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.error).toBe("An account with this email already exists.");
  });

  it("returns 500 on internal error", async () => {
    mockedSignUp.mockRejectedValue(new Error("DB down"));

    const req = createRequest({
      email: "test@example.com",
      password: "password123",
      first_name: "Jane",
      last_name: "Doe",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Sign up failed.");
  });
});
