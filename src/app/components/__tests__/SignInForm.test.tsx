// @vitest-environment jsdom
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";
import { renderWithProviders } from "@/test/helpers/render";
import SignInForm from "@/app/components/SignInForm";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Track location.href assignments without breaking fetch
let assignedHref: string | undefined;

beforeEach(() => {
  assignedHref = undefined;
  Object.defineProperty(window, "location", {
    value: {
      ...window.location,
      get href() {
        return assignedHref ?? "http://localhost/";
      },
      set href(url: string) {
        assignedHref = url;
      },
    },
    writable: true,
    configurable: true,
  });
});

describe("SignInForm", () => {
  it("renders email and password fields", () => {
    renderWithProviders(<SignInForm />);

    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("shows error message on 401 response", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignInForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "wrong@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password.")).toBeInTheDocument();
    });
  });

  it("shows loading state during submission", async () => {
    // Delay the response so we can observe loading state
    server.use(
      http.post("/api/auth/signin", async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return HttpResponse.json({ user: null }, { status: 401 });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<SignInForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(screen.getByRole("button", { name: "Signing in..." })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    });
  });

  it("calls /api/auth/signin with correct data", async () => {
    let capturedBody: Record<string, string> | null = null;
    server.use(
      http.post("/api/auth/signin", async ({ request }) => {
        capturedBody = (await request.json()) as Record<string, string>;
        return HttpResponse.json({ user: { id: 1, email: "test@example.com", first_name: "Jane", last_name: "Doe", role: "customer" } });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<SignInForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(capturedBody).toEqual({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("redirects to / on success", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignInForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(assignedHref).toBe("/");
    });
  });
});
