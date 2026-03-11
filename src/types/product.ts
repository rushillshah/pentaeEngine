import type { ElementCode, ProductTypeCode } from "./enums";

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
  brand_name: string | null;
  product_name: string | null;
  product_title: string | null;
  product_element: string | null;
  description: string | null;
  main_category: string | null;
  sub_category: string | null;
  style: string | null;
  availability: boolean | null;
  shipping_policy: string | null;
  care_instructions: string | null;
  disclaimer: string | null;
  price: number | null;
  stone_details: string | null;
  stone_weight: number | null;
  diamond_details: string | null;
  diamond_weight: number | null;
  metal: string | null;
  metal_weight: number | null;
  size: string | null;
  charm_name: string | null;
  charm_type: string | null;
  charm_details: string | null;
  charm_weight: number | null;
  charm_metal: string | null;
  charm_metal_weight: number | null;
  charm_stone: string | null;
  charm_stone_weight: number | null;
  charm_diamond: string | null;
  charm_diamond_weight: number | null;
  charm_care: string | null;
  // New fields
  primary_element: ElementCode | null;
  product_type: ProductTypeCode | null;
  is_active: boolean;
  in_stock: boolean;
  price_inr: number | null; // minor units (paise)
  price_aed: number | null; // minor units (fils)
  created_at: Date;
  updated_at: Date;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  sort_order: number;
  created_at: Date;
}
