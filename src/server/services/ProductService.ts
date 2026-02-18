import db from "@/server/db/knex";
import type { Product } from "@/server/types/product";

export class ProductService {
  static async getAll(): Promise<Product[]> {
    return db<Product>("products").select("*").orderBy("title");
  }

  static async getByProductId(productId: string): Promise<Product[]> {
    return db<Product>("products").where({ product_id: productId });
  }

  static async getByVariantId(variantId: string): Promise<Product | undefined> {
    return db<Product>("products").where({ variant_id: variantId }).first();
  }

  static async getBySku(sku: string): Promise<Product | undefined> {
    return db<Product>("products").where({ sku }).first();
  }
}
