import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ScoredProduct extends Product {
  matchScore: number;
}

interface RecommendedProductsProps {
  title: string;
  products: Product[] | ScoredProduct[];
  showMatchScore?: boolean;
}

function hasMatchScore(product: Product): product is ScoredProduct {
  return "matchScore" in product && typeof (product as ScoredProduct).matchScore === "number";
}

export default function RecommendedProducts({
  title,
  products,
  showMatchScore = false,
}: RecommendedProductsProps) {
  return (
    <section className="animate-fade-in-up">
      <h2 className="font-serif text-2xl text-charcoal mb-6">{title}</h2>

      {products.length === 0 ? (
        <p className="text-warm-gray text-sm">
          No products found for this element yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              matchScore={
                showMatchScore && hasMatchScore(product)
                  ? product.matchScore
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
