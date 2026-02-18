export interface Product {
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
  created_at: Date;
  updated_at: Date;
}
