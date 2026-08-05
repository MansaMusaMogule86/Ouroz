import { createBrowserClient } from '@supabase/ssr';
import type { Brand, Category } from '@/types/shop';
import { getProductCards } from '@/lib/shop-queries';
import type { PriceTier } from '@/lib/pricing';

const fallbackUrl = 'https://placeholder-project.supabase.co';
const fallbackAnon = 'placeholder-anon-key';

function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  return createBrowserClient(
    url || fallbackUrl,
    anonKey || fallbackAnon
  );
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category_id?: string | null;
  brand_id?: string | null;
  is_featured?: boolean;
  is_wholesale_enabled?: boolean;
  search?: string | null;
}

export interface V2ProductCard {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  compare_price: number | null;
  image_urls: string[];
  currency: string;
  in_stock: boolean;
  origin: string | null;
}

export interface V2CartVariant {
  id: string;
  sku: string;
  weight: string | null;
  size_label: string | null;
  retail_price: number;
  stock_quantity: number;
  price_tiers: Array<{
    min_quantity: number;
    price: number;
    label: string | null;
  }>;
  product: {
    id: string;
    name: string;
    slug: string;
    image_urls: string[];
  };
}

export interface V2CartItemEnriched {
  id: string;
  cart_id: string;
  variant_id: string;
  quantity: number;
  variant: V2CartVariant;
}

export interface V2UserProfile {
  user_id: string;
  full_name: string | null;
  role: 'customer' | 'wholesale' | 'admin';
  created_at: string | null;
}

export interface V2WholesaleApplication {
  id: string;
  user_id: string;
  business_name: string;
  trade_license_number: string | null;
  trade_license_url: string | null;
  contact_email: string;
  contact_phone: string | null;
  business_type: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string | null;
}

type FetchProductsOptions = ProductFilters | { limit?: number };

function mapProductCard(product: {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number | null;
  image_url?: string | null;
  currency: string;
  in_stock: boolean;
  origin?: string | null;
}): V2ProductCard {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    base_price: product.price,
    compare_price: product.compare_at_price ?? null,
    image_urls: product.image_url ? [product.image_url] : [],
    currency: product.currency,
    in_stock: product.in_stock,
    origin: product.origin ?? null,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const db = supabase();

  const { data, error } = await db
    .from('categories')
    .select('id, slug, name, name_ar, name_fr, icon, image_url, description')
    .is('parent_id', null)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error || !data) return [];

  return data.map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    icon: cat.icon ?? undefined,
    image_url: cat.image_url ?? undefined,
    description: cat.description ?? undefined,
  }));
}

export async function fetchBrands(): Promise<Brand[]> {
  const db = supabase();

  const { data, error } = await db
    .from('brands')
    .select('id, slug, name, logo_url')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error || !data) return [];

  return data.map((brand) => ({
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logo_url: brand.logo_url ?? undefined,
  }));
}

export async function fetchProducts(options: FetchProductsOptions = {}) {
  const page = 'page' in options ? Math.max(1, options.page ?? 1) : 1;
  const limit = Math.max(1, options.limit ?? 24);
  const offset = (page - 1) * limit;

  const db = supabase();
  let query = db
    .from('products')
    .select(
      'id, name, slug, base_price, compare_price, image_urls, currency, in_stock, origin',
      { count: 'exact' }
    )
    .eq('is_active', true);

  if ('category_id' in options && options.category_id) {
    query = query.eq('category_id', options.category_id);
  }
  if ('brand_id' in options && options.brand_id) {
    query = query.eq('brand_id', options.brand_id);
  }
  if ('is_featured' in options && typeof options.is_featured === 'boolean') {
    query = query.eq('is_featured', options.is_featured);
  }
  if ('is_wholesale_enabled' in options && typeof options.is_wholesale_enabled === 'boolean') {
    query = query.eq('is_wholesale_enabled', options.is_wholesale_enabled);
  }
  if ('search' in options && options.search?.trim()) {
    const search = options.search.trim();
    query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error || !data) {
    return { products: [] as V2ProductCard[], total: 0 };
  }

  return {
    products: data.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      base_price: product.base_price,
      compare_price: product.compare_price ?? null,
      image_urls: product.image_urls ?? [],
      currency: product.currency ?? 'AED',
      in_stock: product.in_stock ?? true,
      origin: product.origin ?? null,
    })),
    total: count ?? 0,
  };
}

export async function fetchProductsByKeyword(
  keyword: string,
  limit = 24
): Promise<V2ProductCard[]> {
  const { products } = await getProductCards({
    search: keyword,
    limit,
    sortBy: 'newest',
  });

  return products.map(mapProductCard);
}

export async function fetchUserProfile(userId: string): Promise<V2UserProfile | null> {
  const db = supabase();
  const { data, error } = await db
    .from('user_profiles')
    .select('user_id, full_name, role, created_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    user_id: data.user_id,
    full_name: data.full_name ?? null,
    role: (data.role ?? 'customer') as V2UserProfile['role'],
    created_at: data.created_at ?? null,
  };
}

export async function fetchWholesaleApplication(
  userId: string
): Promise<V2WholesaleApplication | null> {
  const db = supabase();
  const { data, error } = await db
    .from('wholesale_accounts')
    .select(
      'id, user_id, business_name, trade_license_number, trade_license_url, contact_email, contact_phone, business_type, status, created_at'
    )
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    user_id: data.user_id,
    business_name: data.business_name,
    trade_license_number: data.trade_license_number ?? null,
    trade_license_url: data.trade_license_url ?? null,
    contact_email: data.contact_email,
    contact_phone: data.contact_phone ?? null,
    business_type: data.business_type ?? null,
    status: data.status as V2WholesaleApplication['status'],
    created_at: data.created_at ?? null,
  };
}

export async function getOrCreateCart(userId: string): Promise<string | null> {
  const db = supabase();

  const { data: existing } = await db
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data, error } = await db
    .from('carts')
    .insert({ user_id: userId })
    .select('id')
    .single();

  if (error || !data) return null;
  return data.id;
}

export async function fetchCartItems(cartId: string): Promise<V2CartItemEnriched[]> {
  const db = supabase();
  const { data, error } = await db
    .from('cart_items')
    .select(`
      id,
      cart_id,
      variant_id,
      quantity,
      variant:product_variants(
        id,
        sku,
        weight,
        retail_price,
        stock_quantity,
        price_tiers(min_quantity, price, label),
        product:products(id, name, slug, image_urls)
      )
    `)
    .eq('cart_id', cartId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];

  return data
    .map((item) => {
      const variantRecord = Array.isArray(item.variant) ? item.variant[0] : item.variant;
      const productRecord = Array.isArray(variantRecord?.product)
        ? variantRecord.product[0]
        : variantRecord?.product;

      if (!variantRecord || !productRecord) return null;

      return {
        id: item.id,
        cart_id: item.cart_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        variant: {
          id: variantRecord.id,
          sku: variantRecord.sku ?? '',
          weight: variantRecord.weight ?? null,
          size_label: variantRecord.weight ?? null,
          retail_price: Number(variantRecord.retail_price ?? 0),
          stock_quantity: Number(variantRecord.stock_quantity ?? 0),
          price_tiers: ((variantRecord.price_tiers as PriceTier[] | null) ?? []).map((tier) => ({
            min_quantity: Number(tier.min_quantity),
            price: Number(tier.price),
            label: tier.label ?? null,
          })),
          product: {
            id: productRecord.id,
            name: productRecord.name,
            slug: productRecord.slug,
            image_urls: productRecord.image_urls ?? [],
          },
        },
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

export async function upsertCartItem(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<boolean> {
  const db = supabase();

  const { data: existing } = await db
    .from('cart_items')
    .select('id')
    .eq('cart_id', cartId)
    .eq('variant_id', variantId)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await db
      .from('cart_items')
      .update({ quantity })
      .eq('id', existing.id);
    return !error;
  }

  const { error } = await db
    .from('cart_items')
    .insert({ cart_id: cartId, variant_id: variantId, quantity });

  return !error;
}

export async function removeCartItem(cartId: string, variantId: string): Promise<boolean> {
  const db = supabase();
  const { error } = await db
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId)
    .eq('variant_id', variantId);

  return !error;
}

export async function clearCartItems(cartId: string): Promise<boolean> {
  const db = supabase();
  const { error } = await db
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId);

  return !error;
}

export async function fetchVariantStock(variantId: string): Promise<number> {
  const db = supabase();
  const { data, error } = await db
    .from('product_variants')
    .select('stock_quantity')
    .eq('id', variantId)
    .maybeSingle();

  if (error || !data) return 0;
  return Number(data.stock_quantity ?? 0);
}
