export type LangCode = 'en' | 'ar' | 'fr';

export interface SubCategory {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  product_count?: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  image_url?: string;
  description?: string;
  product_count?: number;
  subcategories?: SubCategory[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  compare_at_price?: number;
  in_stock: boolean;
  sku?: string;
}

export type WholesaleStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface WholesaleApplyFormData {
  business_name: string;
  trade_license_number: string;
  trade_license_url: string;
  contact_email: string;
  contact_phone: string;
  business_type: string;
}

export interface ProductCard {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  price: number;
  compare_at_price?: number;
  currency: string;
  image_url?: string;
  thumbnail_url?: string;
  supplier_name?: string;
  supplier_slug?: string;
  tags?: string[];
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  inventory_quantity?: number;
  is_featured?: boolean;
  requires_compliance_review?: boolean;
  /** Slug of the direct category this product belongs to */
  category_slug?: string;
  /** Slug of the brand this product belongs to */
  brand_slug?: string;
  category_name?: string;
  origin?: string;
  in_stock: boolean;
  badge?: string;
}

export interface Product extends ProductCard {
  short_description?: string;
  description?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  care_information?: string;
  shipping_information?: string;
  storage_information?: string;
  return_eligible?: boolean;
  minimum_order_quantity?: number;
  wholesale_ready?: boolean;
  product_review_status?: 'pending' | 'approved';
  compliance_review_status?: 'pending' | 'approved';
  compliance_notes?: string;
  brand?: { name: string; slug: string };
  category?: { name: string; slug: string };
  supplier?: { name: string; slug: string };
  weight?: string;
  origin_region?: string;
  certifications?: string[];
}

export interface DbOrder {
  id: string;
  order_number: string;
  created_at: string;
  total: number | string;
  status: string;
}

export interface DbOrderItem {
  variant_id: string;
  product_name: string;
  variant_sku?: string | null;
  variant_label?: string | null;
  product_image_url?: string | null;
  qty: number;
  unit_price: number | string;
  line_total?: number | string;
}
