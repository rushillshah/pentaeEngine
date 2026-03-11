import { mockProducts } from "@/test/fixtures/products";

vi.mock("@/server/services/ProductService", () => ({
  ProductService: {
    getAll: vi.fn(),
  },
}));

import { GET } from "@/app/api/products/route";
import { ProductService } from "@/server/services/ProductService";

const mockedGetAll = vi.mocked(ProductService.getAll);

describe("GET /api/products", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with products", async () => {
    mockedGetAll.mockResolvedValue(mockProducts);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Fire Ring" }),
      ])
    );
  });

  it("returns 500 on error", async () => {
    mockedGetAll.mockRejectedValue(new Error("DB error"));

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Failed to fetch products");
  });
});
