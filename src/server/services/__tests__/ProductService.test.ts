import { mockProduct, mockProducts } from "@/test/fixtures/products";

const { db, chain } = vi.hoisted(() => {
  const _chain = {
    select: vi.fn(),
    where: vi.fn(),
    first: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    orderBy: vi.fn(),
    returning: vi.fn(),
    raw: vi.fn(),
  };
  for (const key of Object.keys(_chain) as (keyof typeof _chain)[]) {
    _chain[key].mockReturnValue(_chain);
  }
  const _db = vi.fn(() => _chain) as unknown as ReturnType<typeof vi.fn> & {
    raw: ReturnType<typeof vi.fn>;
    fn: { now: ReturnType<typeof vi.fn> };
  };
  _db.raw = _chain.raw;
  _db.fn = { now: vi.fn(() => "NOW()") };
  return { db: _db, chain: _chain };
});

vi.mock("@/server/db/knex", () => ({
  default: db,
}));

import { ProductService } from "@/server/services/ProductService";

describe("ProductService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const key of Object.keys(chain) as (keyof typeof chain)[]) {
      chain[key].mockReturnValue(chain);
    }
  });

  describe("getAll", () => {
    it("returns products ordered by title", async () => {
      chain.orderBy.mockResolvedValue(mockProducts);

      const result = await ProductService.getAll();

      expect(db).toHaveBeenCalledWith("products");
      expect(chain.select).toHaveBeenCalledWith("*");
      expect(chain.orderBy).toHaveBeenCalledWith("title");
      expect(result).toEqual(mockProducts);
    });
  });

  describe("getByProductId", () => {
    it("returns matching products", async () => {
      const fireProducts = mockProducts.filter(
        (p) => p.product_id === "prod_fire"
      );
      chain.where.mockResolvedValue(fireProducts);

      const result = await ProductService.getByProductId("prod_fire");

      expect(db).toHaveBeenCalledWith("products");
      expect(chain.where).toHaveBeenCalledWith({ product_id: "prod_fire" });
      expect(result).toEqual(fireProducts);
    });

    it("returns empty array when no matches", async () => {
      chain.where.mockResolvedValue([]);

      const result = await ProductService.getByProductId("prod_nonexistent");

      expect(chain.where).toHaveBeenCalledWith({
        product_id: "prod_nonexistent",
      });
      expect(result).toEqual([]);
    });
  });

  describe("getByVariantId", () => {
    it("returns product when found", async () => {
      chain.first.mockResolvedValue(mockProduct);

      const result = await ProductService.getByVariantId("var_fire_s");

      expect(db).toHaveBeenCalledWith("products");
      expect(chain.where).toHaveBeenCalledWith({ variant_id: "var_fire_s" });
      expect(chain.first).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it("returns undefined when not found", async () => {
      chain.first.mockResolvedValue(undefined);

      const result = await ProductService.getByVariantId("var_nonexistent");

      expect(result).toBeUndefined();
    });
  });

  describe("getBySku", () => {
    it("returns product when found", async () => {
      chain.first.mockResolvedValue(mockProduct);

      const result = await ProductService.getBySku("FIRE-RING-S");

      expect(db).toHaveBeenCalledWith("products");
      expect(chain.where).toHaveBeenCalledWith({ sku: "FIRE-RING-S" });
      expect(chain.first).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it("returns undefined when not found", async () => {
      chain.first.mockResolvedValue(undefined);

      const result = await ProductService.getBySku("NONEXISTENT");

      expect(result).toBeUndefined();
    });
  });
});
