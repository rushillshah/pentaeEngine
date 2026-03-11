"use client";

import { useEffect, useState, useMemo } from "react";
import type { Product } from "@/types/product";

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
  { label: "Any price", min: 0, max: Infinity },
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

function parseJewelryType(title: string): string {
  for (const type of JEWELRY_TYPES) {
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

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-tan pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <h3 className="text-sm font-medium text-charcoal mb-2">{title}</h3>
      {children}
    </div>
  );
}

function CheckboxItem({
  label,
  checked,
  count,
  onChange,
}: {
  label: string;
  checked: boolean;
  count: number;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 py-0.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 rounded border-tan text-gold focus:ring-gold/30 accent-[#B8860B]"
      />
      <span className="text-sm text-warm-gray group-hover:text-charcoal transition-colors flex-1">
        {label}
      </span>
      <span className="text-xs text-warm-gray/60">{count}</span>
    </label>
  );
}

export default function ProductGrid() {
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedElements, setSelectedElements] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  function toggleSet(set: Set<string>, value: string, setter: (s: Set<string>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q) && !p.element.toLowerCase().includes(q) && !p.jewelryType.toLowerCase().includes(q)) return false;
      if (selectedElements.size > 0 && !selectedElements.has(p.element)) return false;
      if (selectedTypes.size > 0 && !selectedTypes.has(p.jewelryType)) return false;
      if (selectedPriceRange > 0) {
        const range = PRICE_RANGES[selectedPriceRange];
        if (p.unit_price < range.min || p.unit_price >= range.max) return false;
      }
      return true;
    });
  }, [products, search, selectedElements, selectedTypes, selectedPriceRange]);

  // Counts per filter (based on current other filters + search)
  const elementCounts = useMemo(() => {
    const q = search.toLowerCase().trim();
    const base = products.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q) && !p.element.toLowerCase().includes(q) && !p.jewelryType.toLowerCase().includes(q)) return false;
      if (selectedTypes.size > 0 && !selectedTypes.has(p.jewelryType)) return false;
      if (selectedPriceRange > 0) {
        const range = PRICE_RANGES[selectedPriceRange];
        if (p.unit_price < range.min || p.unit_price >= range.max) return false;
      }
      return true;
    });
    const counts: Record<string, number> = {};
    for (const el of ELEMENTS) counts[el] = 0;
    for (const p of base) counts[p.element] = (counts[p.element] || 0) + 1;
    return counts;
  }, [products, search, selectedTypes, selectedPriceRange]);

  const typeCounts = useMemo(() => {
    const q = search.toLowerCase().trim();
    const base = products.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q) && !p.element.toLowerCase().includes(q) && !p.jewelryType.toLowerCase().includes(q)) return false;
      if (selectedElements.size > 0 && !selectedElements.has(p.element)) return false;
      if (selectedPriceRange > 0) {
        const range = PRICE_RANGES[selectedPriceRange];
        if (p.unit_price < range.min || p.unit_price >= range.max) return false;
      }
      return true;
    });
    const counts: Record<string, number> = {};
    for (const t of JEWELRY_TYPES) counts[t] = 0;
    for (const p of base) counts[p.jewelryType] = (counts[p.jewelryType] || 0) + 1;
    return counts;
  }, [products, search, selectedElements, selectedPriceRange]);

  const activeFilterCount =
    selectedElements.size + selectedTypes.size + (selectedPriceRange > 0 ? 1 : 0) + (search ? 1 : 0);

  function clearAll() {
    setSelectedElements(new Set());
    setSelectedTypes(new Set());
    setSelectedPriceRange(0);
    setSearch("");
  }

  const sidebar = (
    <div className="space-y-0">
      {/* Search */}
      <div className="pb-4 mb-4 border-b border-tan">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-tan rounded bg-white text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-gold transition-colors"
          />
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-warm-gray/40"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Element */}
      <SidebarSection title="Element">
        <div className="space-y-0.5">
          {ELEMENTS.map((el) => (
            <CheckboxItem
              key={el}
              label={el}
              checked={selectedElements.has(el)}
              count={elementCounts[el] || 0}
              onChange={() => toggleSet(selectedElements, el, setSelectedElements)}
            />
          ))}
        </div>
      </SidebarSection>

      {/* Jewelry Type */}
      <SidebarSection title="Jewelry Type">
        <div className="space-y-0.5">
          {JEWELRY_TYPES.map((type) => (
            <CheckboxItem
              key={type}
              label={type}
              checked={selectedTypes.has(type)}
              count={typeCounts[type] || 0}
              onChange={() => toggleSet(selectedTypes, type, setSelectedTypes)}
            />
          ))}
        </div>
      </SidebarSection>

      {/* Price */}
      <SidebarSection title="Price">
        <select
          value={selectedPriceRange}
          onChange={(e) => setSelectedPriceRange(Number(e.target.value))}
          className="w-full px-2 py-1.5 text-sm border border-tan rounded bg-white text-charcoal focus:outline-none focus:border-gold transition-colors"
        >
          {PRICE_RANGES.map((range, i) => (
            <option key={range.label} value={i}>
              {range.label}
            </option>
          ))}
        </select>
      </SidebarSection>

      {/* Clear */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAll}
          className="text-sm text-gold hover:text-gold-light transition-colors mt-2"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex gap-8">
        <div className="hidden md:block w-56 shrink-0">
          <div className="animate-pulse space-y-4">
            <div className="h-9 bg-tan/30 rounded" />
            <div className="h-32 bg-tan/20 rounded" />
            <div className="h-32 bg-tan/20 rounded" />
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] rounded-lg bg-tan/50" />
              <div className="mt-3 h-4 bg-tan/50 rounded w-3/4" />
              <div className="mt-2 h-3 bg-tan/30 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 text-sm text-charcoal border border-tan rounded px-3 py-2 hover:border-warm-gray transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="8" y1="18" x2="16" y2="18" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-gold text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        {mobileFiltersOpen && (
          <div className="mt-3 p-4 border border-tan rounded-lg bg-white">
            {sidebar}
          </div>
        )}
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          {sidebar}
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-warm-gray">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-warm-gray mb-3">No products match your filters.</p>
              <button
                onClick={clearAll}
                className="text-sm text-gold hover:text-gold-light transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}
