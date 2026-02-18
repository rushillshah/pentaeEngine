"use client";

import { useEffect, useState } from "react";

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
  variants: { variant_id: string; variant_title: string | null; sku: string }[];
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

export default function ProductGrid() {
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (products.length === 0) {
    return <p className="text-warm-gray">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, i) => (
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
  );
}
