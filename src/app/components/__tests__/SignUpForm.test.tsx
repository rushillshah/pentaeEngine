// @vitest-environment jsdom
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";
import { renderWithProviders } from "@/test/helpers/render";
import SignUpForm from "@/app/components/SignUpForm";

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

async function fillForm(
  user: ReturnType<typeof userEvent.setup>,
  overrides: { firstName?: string; lastName?: string; email?: string; password?: string } = {}
) {
  const { firstName = "Jane", lastName = "Doe", email = "new@example.com", password = "password123" } = overrides;

  await user.type(screen.getByLabelText("First Name"), firstName);
  await user.type(screen.getByLabelText("Last Name"), lastName);
  await user.type(screen.getByPlaceholderText("you@example.com"), email);
  await user.type(screen.getByPlaceholderText("At least 6 characters"), password);
}

describe("SignUpForm", () => {
  it("renders all 4 fields (first name, last name, email, password)", () => {
    renderWithProviders(<SignUpForm />);

    expect(screen.getByLabelText("First Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("At least 6 characters")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
  });

  it("shows error on 409 duplicate email", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignUpForm />);

    await fillForm(user, { email: "existing@example.com" });
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(screen.getByText("An account with this email already exists.")).toBeInTheDocument();
    });
  });

  it("shows loading state during submission", async () => {
    server.use(
      http.post("/api/auth/signup", async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return HttpResponse.json({ error: "fail" }, { status: 400 });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<SignUpForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    expect(screen.getByRole("button", { name: "Creating account..." })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
    });
  });

  it("calls /api/auth/signup with correct data", async () => {
    let capturedBody: Record<string, string> | null = null;
    server.use(
      http.post("/api/auth/signup", async ({ request }) => {
        capturedBody = (await request.json()) as Record<string, string>;
        return HttpResponse.json({ user: { id: 1, email: "new@example.com", first_name: "Jane", last_name: "Doe", role: "customer" } }, { status: 201 });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<SignUpForm />);

    await fillForm(user, { firstName: "Jane", lastName: "Doe", email: "new@example.com", password: "securePass1" });
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(capturedBody).toEqual({
        email: "new@example.com",
        password: "securePass1",
        first_name: "Jane",
        last_name: "Doe",
      });
    });
  });

  it("redirects to / on success", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignUpForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(assignedHref).toBe("/");
    });
  });
});
