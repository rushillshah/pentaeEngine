// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";
import ProductGrid from "@/app/components/ProductGrid";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ProductGrid", () => {
  it("shows loading skeleton initially", () => {
    render(<ProductGrid />);

    // The loading state renders divs with animate-pulse class
    const pulseElements = document.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("renders product cards after loading", async () => {
    render(<ProductGrid />);

    await waitFor(() => {
      expect(screen.getAllByText("Fire Ring").length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText("Water Pendant").length).toBeGreaterThan(0);
  });

  it("search filters products by title", async () => {
    const user = userEvent.setup();
    render(<ProductGrid />);

    await waitFor(() => {
      expect(screen.getAllByText("Fire Ring").length).toBeGreaterThan(0);
    });

    await user.type(screen.getByPlaceholderText("Search products..."), "Water");

    await waitFor(() => {
      expect(screen.queryByText("Fire Ring")).not.toBeInTheDocument();
    });

    expect(screen.getAllByText("Water Pendant").length).toBeGreaterThan(0);
  });

  it("element checkbox filters products", async () => {
    const user = userEvent.setup();
    render(<ProductGrid />);

    await waitFor(() => {
      expect(screen.getAllByText("Fire Ring").length).toBeGreaterThan(0);
    });

    // Click the "Water" element checkbox
    const waterCheckbox = screen.getByRole("checkbox", { name: /Water/i });
    await user.click(waterCheckbox);

    await waitFor(() => {
      expect(screen.queryByText("Fire Ring")).not.toBeInTheDocument();
    });

    expect(screen.getAllByText("Water Pendant").length).toBeGreaterThan(0);
  });

  it("shows empty state when no products match", async () => {
    const user = userEvent.setup();
    render(<ProductGrid />);

    await waitFor(() => {
      expect(screen.getAllByText("Fire Ring").length).toBeGreaterThan(0);
    });

    await user.type(screen.getByPlaceholderText("Search products..."), "xyznonexistent");

    await waitFor(() => {
      expect(screen.getByText("No products match your filters.")).toBeInTheDocument();
    });
  });
});
