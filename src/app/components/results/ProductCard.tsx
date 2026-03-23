import { ELEMENT_META } from "@/app/components/quiz/elementData";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  matchScore?: number;
}

function formatPrice(priceAed: number | null): string {
  if (priceAed === null) return "Price TBD";
  return `AED ${(priceAed / 100).toFixed(2)}`;
}

function getElementGradient(element: string | null): string {
  const meta = element ? ELEMENT_META[element.toUpperCase()] : null;
  if (!meta) return "from-cream-dark via-tan to-gold-light/30";

  // Build a gradient using the element color at 20% opacity as the base
  // We use Tailwind-friendly fallbacks since arbitrary opacity on hex is fine
  return "from-cream-dark via-tan to-gold-light/30";
}

export default function ProductCard({ product, matchScore }: ProductCardProps) {
  const elementKey = (product.primary_element || "").toUpperCase();
  const meta = ELEMENT_META[elementKey];

  return (
    <a
      href="/shop"
      className="bg-white rounded-lg border border-tan overflow-hidden hover:shadow-md transition-shadow block"
    >
      {/* Gradient placeholder for image */}
      <div className="relative">
        <div
          className={`aspect-[4/5] bg-gradient-to-br ${getElementGradient(product.primary_element)} flex items-center justify-center`}
          style={
            meta
              ? {
                  background: `linear-gradient(135deg, ${meta.color}15, ${meta.color}30, ${meta.color}10)`,
                }
              : undefined
          }
        >
          <span className="text-4xl opacity-40">{meta?.icon || ""}</span>
        </div>

        {matchScore !== undefined && (
          <span className="absolute top-2 right-2 bg-gold text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {Math.round(matchScore * 100)}% match
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-medium text-charcoal text-sm leading-snug mb-1">
          {product.product_name || product.title}
        </h3>

        <p className="text-warm-gray text-xs mb-2">
          {[product.main_category, product.metal].filter(Boolean).join(" \u00B7 ")}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-charcoal text-sm font-medium">
            {formatPrice(product.price_aed)}
          </span>

          {meta && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${meta.color}15`,
                color: meta.color,
              }}
            >
              {meta.icon} {meta.label}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
