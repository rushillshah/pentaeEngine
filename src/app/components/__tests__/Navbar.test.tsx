// @vitest-environment jsdom
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";
import { renderWithProviders } from "@/test/helpers/render";
import Navbar from "@/app/components/Navbar";

vi.mock("@/app/components/icons", () => ({
  UserIcon: () => <span data-testid="user-icon">User</span>,
  CartIcon: () => <span data-testid="cart-icon">Cart</span>,
  MenuIcon: () => <span data-testid="menu-icon">Menu</span>,
  CloseIcon: () => <span data-testid="close-icon">Close</span>,
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Navbar", () => {
  it("renders nav links", async () => {
    renderWithProviders(<Navbar />);

    await waitFor(() => {
      expect(screen.getByText("Pentae")).toBeInTheDocument();
    });

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.getByText("Best Sellers")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Materials")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it('shows "Sign In" and "Create Account" when unauthenticated', async () => {
    server.use(
      http.get("/api/auth/me", () => {
        return HttpResponse.json({ user: null });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<Navbar />);

    // Wait for auth to finish loading
    await waitFor(() => {
      // The loading state should complete
      expect(screen.getByTestId("user-icon")).toBeInTheDocument();
    });

    // Open dropdown
    await user.click(screen.getByRole("button", { name: "Account" }));

    await waitFor(() => {
      expect(screen.getByText("Sign In")).toBeInTheDocument();
      expect(screen.getByText("Create Account")).toBeInTheDocument();
    });
  });

  it('shows user name and "Sign Out" when authenticated', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);

    // Wait for auth to load the user
    await waitFor(() => {
      expect(screen.getByTestId("user-icon")).toBeInTheDocument();
    });

    // Open the dropdown
    await user.click(screen.getByRole("button", { name: "Account" }));

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByText("Sign Out")).toBeInTheDocument();
    });
  });

  it("dropdown opens and closes on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);

    // Wait for auth to finish loading
    await waitFor(() => {
      expect(screen.getByTestId("user-icon")).toBeInTheDocument();
    });

    const accountButton = screen.getByRole("button", { name: "Account" });

    // Dropdown should not be visible yet
    expect(screen.queryByText("Account Settings")).not.toBeInTheDocument();

    // Open dropdown
    await user.click(accountButton);

    await waitFor(() => {
      expect(screen.getByText("Account Settings")).toBeInTheDocument();
    });

    // Close dropdown by clicking the button again
    await user.click(accountButton);

    await waitFor(() => {
      expect(screen.queryByText("Account Settings")).not.toBeInTheDocument();
    });
  });
});
