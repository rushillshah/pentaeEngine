import { http, HttpResponse } from "msw";
import { mockPublicUser } from "../fixtures/users";
import { mockProducts } from "../fixtures/products";

export const handlers = [
  http.get("/api/auth/me", () => {
    return HttpResponse.json({ user: mockPublicUser });
  }),

  http.post("/api/auth/signin", async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (body.email === "test@example.com" && body.password === "password123") {
      return HttpResponse.json({ user: mockPublicUser });
    }
    return HttpResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }),

  http.post("/api/auth/signup", async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      first_name?: string;
      last_name?: string;
    };
    if (body.email === "existing@example.com") {
      return HttpResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
    return HttpResponse.json({ user: mockPublicUser }, { status: 201 });
  }),

  http.post("/api/auth/signout", () => {
    return HttpResponse.json({ success: true });
  }),

  http.get("/api/products", () => {
    return HttpResponse.json(mockProducts);
  }),
];
