// @vitest-environment jsdom
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";
import { AuthProvider, useAuth } from "@/app/components/AuthContext";
import { mockPublicUser } from "@/test/fixtures/users";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function TestConsumer() {
  const { user, loading, signOut, refresh } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? JSON.stringify(user) : "null"}</span>
      <button onClick={signOut}>Sign Out</button>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}

function renderWithAuth() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
}

describe("AuthContext", () => {
  it("starts with loading as true", () => {
    renderWithAuth();
    expect(screen.getByTestId("loading")).toHaveTextContent("true");
  });

  it("fetches /api/auth/me on mount and provides user", async () => {
    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    const userJson = screen.getByTestId("user").textContent;
    const parsed = JSON.parse(userJson!);
    expect(parsed.email).toBe(mockPublicUser.email);
    expect(parsed.first_name).toBe(mockPublicUser.first_name);
  });

  it("provides null user when unauthenticated", async () => {
    server.use(
      http.get("/api/auth/me", () => {
        return HttpResponse.json({ user: null });
      })
    );

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("user")).toHaveTextContent("null");
  });

  it("refresh() re-fetches and updates user", async () => {
    server.use(
      http.get("/api/auth/me", () => {
        return HttpResponse.json({ user: null });
      })
    );

    const user = userEvent.setup();
    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("null");

    // Restore original handler that returns a user
    server.use(
      http.get("/api/auth/me", () => {
        return HttpResponse.json({ user: mockPublicUser });
      })
    );

    await user.click(screen.getByRole("button", { name: "Refresh" }));

    await waitFor(() => {
      const userJson = screen.getByTestId("user").textContent;
      expect(userJson).not.toBe("null");
      const parsed = JSON.parse(userJson!);
      expect(parsed.email).toBe(mockPublicUser.email);
    });
  });

  it("signOut() calls /api/auth/signout and clears user", async () => {
    const user = userEvent.setup();
    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    // Verify user is set
    expect(screen.getByTestId("user").textContent).not.toBe("null");

    await user.click(screen.getByRole("button", { name: "Sign Out" }));

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("null");
    });
  });
});
