"use client";

import { useEffect, useState, useMemo } from "react";

interface Product {
  id: number;
  product_id: string;
  variant_id: string;
  sku: string;
  title: string;
  variant_title: string | null;
  quantity: number;
  currency: string;
  unit_price: number;
  discount_amount: number;
  tax_amount: number;
  line_total: number;
}

interface GroupedProduct {
  product_id: string;
  title: string;
  unit_price: number;
  currency: string;
  element: string;
  jewelryType: string;
  variants: { variant_id: string; variant_title: string | null; sku: string }[];
}

const ELEMENTS = ["Fire", "Water", "Earth", "Air", "Aether"];
const JEWELRY_TYPES = ["Ring", "Pendant", "Bracelet", "Earrings", "Necklace"];
const PRICE_RANGES = [
  { label: "Under AED 150", min: 0, max: 15000 },
  { label: "AED 150 – 200", min: 15000, max: 20000 },
  { label: "AED 200 – 250", min: 20000, max: 25000 },
  { label: "AED 250+", min: 25000, max: Infinity },
];

const ELEMENT_MAP: Record<string, string> = {
  prod_fire: "Fire",
  prod_water: "Water",
  prod_earth: "Earth",
  prod_air: "Air",
  prod_aether: "Aether",
};

const TYPE_MAP: Record<string, string> = {
  Ring: "Ring",
  Pendant: "Pendant",
  Bracelet: "Bracelet",
  Earrings: "Earrings",
  Necklace: "Necklace",
};

function parseJewelryType(title: string): string {
  for (const type of Object.keys(TYPE_MAP)) {
    if (title.includes(type)) return type;
  }
  return "Other";
}

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

const gradients = [
  "from-gold/20 via-gold-light/30 to-tan",
  "from-cream-dark via-tan to-gold-light/30",
  "from-cream via-cream-dark to-tan/50",
  "from-gold-light/20 via-cream-dark to-tan",
  "from-tan via-cream-dark to-gold/10",
];

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "border-gold bg-gold/10 text-gold"
          : "border-tan text-warm-gray hover:border-warm-gray"
      }`}
    >
      {label}
    </button>
  );
}

export default function ProductGrid() {
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedElements, setSelectedElements] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        const grouped = new Map<string, GroupedProduct>();
        for (const p of data) {
          if (!grouped.has(p.product_id)) {
            grouped.set(p.product_id, {
              product_id: p.product_id,
              title: p.title,
              unit_price: p.unit_price,
              currency: p.currency,
              element: ELEMENT_MAP[p.product_id] ?? "Unknown",
              jewelryType: parseJewelryType(p.title),
              variants: [],
            });
          }
          grouped.get(p.product_id)!.variants.push({
            variant_id: p.variant_id,
            variant_title: p.variant_title,
            sku: p.sku,
          });
        }
        setProducts(Array.from(grouped.values()));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function toggleFilter(set: Set<string>, value: string, setter: (s: Set<string>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedElements.size > 0 && !selectedElements.has(p.element)) return false;
      if (selectedTypes.size > 0 && !selectedTypes.has(p.jewelryType)) return false;
      if (selectedPriceRange !== null) {
        const range = PRICE_RANGES[selectedPriceRange];
        if (p.unit_price < range.min || p.unit_price >= range.max) return false;
      }
      return true;
    });
  }, [products, selectedElements, selectedTypes, selectedPriceRange]);

  const activeFilterCount =
    selectedElements.size + selectedTypes.size + (selectedPriceRange !== null ? 1 : 0);

  function clearAll() {
    setSelectedElements(new Set());
    setSelectedTypes(new Set());
    setSelectedPriceRange(null);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] rounded-lg bg-tan/50" />
            <div className="mt-3 h-4 bg-tan/50 rounded w-3/4" />
            <div className="mt-2 h-3 bg-tan/30 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Element */}
        <div>
          <h3 className="text-xs font-medium tracking-wide text-charcoal uppercase mb-2">
            Element
          </h3>
          <div className="flex flex-wrap gap-2">
            {ELEMENTS.map((el) => (
              <FilterChip
                key={el}
                label={el}
                active={selectedElements.has(el)}
                onClick={() => toggleFilter(selectedElements, el, setSelectedElements)}
              />
            ))}
          </div>
        </div>

        {/* Jewelry Type */}
        <div>
          <h3 className="text-xs font-medium tracking-wide text-charcoal uppercase mb-2">
            Type
          </h3>
          <div className="flex flex-wrap gap-2">
            {JEWELRY_TYPES.map((type) => (
              <FilterChip
                key={type}
                label={type}
                active={selectedTypes.has(type)}
                onClick={() => toggleFilter(selectedTypes, type, setSelectedTypes)}
              />
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <h3 className="text-xs font-medium tracking-wide text-charcoal uppercase mb-2">
            Price
          </h3>
          <div className="flex flex-wrap gap-2">
            {PRICE_RANGES.map((range, i) => (
              <FilterChip
                key={range.label}
                label={range.label}
                active={selectedPriceRange === i}
                onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
              />
            ))}
          </div>
        </div>

        {/* Active filter count + clear */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs text-warm-gray">
              {filtered.length} of {products.length} products
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-gold hover:text-gold-light transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-warm-gray py-8 text-center">
          No products match your filters.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <div key={product.product_id} className="group cursor-pointer">
              <div
                className={`aspect-[4/5] rounded-lg bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center group-hover:opacity-90 transition-opacity`}
              >
                <span className="text-sm font-sans tracking-wide text-warm-gray/60">
                  {product.title}
                </span>
              </div>
              <div className="mt-3">
                <h3 className="font-serif text-base text-charcoal group-hover:text-gold transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-warm-gray mt-0.5">
                  {formatPrice(product.unit_price, product.currency)}
                </p>
                <div className="mt-2 flex gap-1.5">
                  {product.variants.map((v) => (
                    <span
                      key={v.variant_id}
                      className="text-xs px-2 py-0.5 border border-tan rounded text-warm-gray hover:border-gold hover:text-gold transition-colors"
                    >
                      {v.variant_title?.replace("Size ", "") ?? v.sku}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
