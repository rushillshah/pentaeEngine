import db from "@/server/db/knex";
import type { Product } from "@/types/product";
import type { ElementVector } from "@/types/personalization";

interface ScoredProduct extends Product {
  matchScore: number;
}

export class RecommendationService {
  /**
   * Tier 1: Simple element match.
   * Returns products whose primary_element matches the dominant element.
   */
  static async getByElement(
    dominantElement: string,
    limit = 6,
  ): Promise<Product[]> {
    return db("products")
      .where({
        primary_element: dominantElement,
        is_active: true,
        in_stock: true,
      })
      .orderBy("price_aed", "asc")
      .limit(limit);
  }

  /**
   * Tier 2: Scored ranking against full element vector.
   * Scores each product based on how much of its element the user has.
   * Products with elements the user scores higher in rank higher.
   */
  static async getScoredProducts(
    elementVector: ElementVector,
    limit = 12,
  ): Promise<ScoredProduct[]> {
    const products: Product[] = await db("products")
      .where({ is_active: true, in_stock: true })
      .whereNotNull("primary_element");

    const vectorMap: Record<string, number> = {
      fire: elementVector.fire,
      water: elementVector.water,
      earth: elementVector.earth,
      air: elementVector.air,
      spirit: elementVector.spirit,
    };

    const scored: ScoredProduct[] = products.map((product) => {
      const productElement = (product.primary_element || "").toLowerCase();
      const matchScore = vectorMap[productElement] || 0;
      return { ...product, matchScore };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored.slice(0, limit);
  }

  /**
   * Tier 3: Curated collections.
   * Queries the element_collections table for hand-picked items.
   * Falls back to Tier 1 if no curated items exist.
   */
  static async getCurated(
    dominantElement: string,
    limit = 6,
  ): Promise<Product[]> {
    const curated = await db("element_collections")
      .join("products", "element_collections.product_id", "products.id")
      .where({
        "element_collections.element": dominantElement,
        "products.is_active": true,
      })
      .select("products.*")
      .orderBy("element_collections.sort_order", "asc")
      .limit(limit)
      .catch(() => [] as Product[]); // Table may not exist yet

    if (curated.length > 0) return curated;

    return RecommendationService.getByElement(dominantElement, limit);
  }

  /**
   * Get all recommendation tiers for a session.
   */
  static async getRecommendations(params: {
    dominantElement: string;
    elementVector: ElementVector;
  }): Promise<{
    elementMatch: Product[];
    scoredMatch: ScoredProduct[];
    curated: Product[];
  }> {
    const [elementMatch, scoredMatch, curated] = await Promise.all([
      RecommendationService.getByElement(params.dominantElement),
      RecommendationService.getScoredProducts(params.elementVector),
      RecommendationService.getCurated(params.dominantElement),
    ]);
    return { elementMatch, scoredMatch, curated };
  }
}
