import { NextRequest } from "next/server";
import { mockUser } from "@/test/fixtures/users";

vi.mock("@/server/services/UserService", () => ({
  UserService: {
    getById: vi.fn(),
    update: vi.fn(),
  },
}));

import { GET, PATCH } from "@/app/api/users/[id]/route";
import { UserService } from "@/server/services/UserService";

const mockedGetById = vi.mocked(UserService.getById);
const mockedUpdate = vi.mocked(UserService.update);

function createGetRequest() {
  return new NextRequest("http://localhost:3000/api/users/1", {
    method: "GET",
  });
}

function createPatchRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/users/1", {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("GET /api/users/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with user", async () => {
    mockedGetById.mockResolvedValue(mockUser);

    const res = await GET(createGetRequest(), {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(expect.objectContaining({ id: 1, email: "test@example.com" }));
    expect(data).not.toHaveProperty("password_hash");
  });

  it("returns 404 when user not found", async () => {
    mockedGetById.mockResolvedValue(undefined);

    const res = await GET(createGetRequest(), {
      params: Promise.resolve({ id: "999" }),
    });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("User not found");
  });

  it("returns 500 on error", async () => {
    mockedGetById.mockRejectedValue(new Error("DB error"));

    const res = await GET(createGetRequest(), {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Failed to fetch user");
  });
});

describe("PATCH /api/users/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 on successful update", async () => {
    const updatedUser = { ...mockUser, first_name: "Updated" };
    mockedUpdate.mockResolvedValue(updatedUser);

    const res = await PATCH(createPatchRequest({ first_name: "Updated" }), {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(expect.objectContaining({ first_name: "Updated" }));
    expect(data).not.toHaveProperty("password_hash");
  });

  it("returns 400 when no valid fields provided", async () => {
    const res = await PATCH(
      createPatchRequest({ invalid_field: "value" }),
      { params: Promise.resolve({ id: "1" }) }
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("No valid fields to update");
  });

  it("returns 404 when user not found", async () => {
    mockedUpdate.mockResolvedValue(undefined);

    const res = await PATCH(createPatchRequest({ first_name: "Ghost" }), {
      params: Promise.resolve({ id: "999" }),
    });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("User not found");
  });

  it("returns 500 on error", async () => {
    mockedUpdate.mockRejectedValue(new Error("DB error"));

    const res = await PATCH(createPatchRequest({ first_name: "Crash" }), {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Failed to update user");
  });
});
