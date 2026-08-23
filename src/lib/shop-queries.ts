/**
 * shop-queries.ts — All Supabase read queries for the storefront.
 * Uses the browser client (anon key) — safe for public product/category data.
 * Called from server components only; no auth cookies needed for public reads.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Category, SubCategory, ProductCard, Product, LangCode } from '@/types/shop';
import { BAB_CATEGORIES, BAB_PRODUCTS, BAB_SEARCH_ALIASES, BAB_SUPPLIER } from '@/lib/catalog/atlasSoukCatalog';
import { DANAT_PRODUCTS, DANAT_SUPPLIER, getDanatGroupPlaceholder } from '@/lib/catalog/danatAlJazeeraCatalog';

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

// ── Localisation helpers ──────────────────────────────────────────────────────

function localName(
  row: { name: string; name_ar?: string | null; name_fr?: string | null },
  lang: LangCode
): string {
  if (lang === 'ar' && row.name_ar) return row.name_ar;
  if (lang === 'fr' && row.name_fr) return row.name_fr;
  return row.name;
}

function localDesc(
  row: { description?: string | null; description_ar?: string | null; description_fr?: string | null },
  lang: LangCode
): string | undefined {
  if (lang === 'ar' && row.description_ar) return row.description_ar;
  if (lang === 'fr' && row.description_fr) return row.description_fr;
  return row.description ?? undefined;
}

function fallbackCategories(lang: LangCode = 'en'): Category[] {
  return BAB_CATEGORIES.map((category, index) => ({
    id: `bab-category-${index + 1}`,
    slug: category.slug,
    name: category.name,
    icon: undefined,
    image_url: category.heroImage,
    description: category.description,
    subcategories: [],
  }));
}

function fallbackCategoryBySlug(slug: string): Category | null {
  const category = BAB_CATEGORIES.find((item) => item.slug === slug);
  if (!category) return null;

  return {
    id: `bab-category-${slug}`,
    slug: category.slug,
    name: category.name,
    icon: undefined,
    image_url: category.heroImage,
    description: category.description,
    subcategories: [],
  };
}

function fallbackProductCards(query: ProductCardsQuery): { products: ProductCard[]; total: number } {
  const {
    lang = 'en',
    categorySlug,
    supplierSlug,
    featuredOnly = false,
    search,
    limit = 24,
    offset = 0,
    sortBy = 'featured',
  } = query;

  let products = DANAT_PRODUCTS.filter((product) => {
    if (categorySlug && product.product_category !== categorySlug && !product.product_group.toLowerCase().includes(categorySlug.toLowerCase())) return false;
    if (supplierSlug && supplierSlug !== DANAT_SUPPLIER.slug) return false;
    if (search) {
      const searchKey = search.trim().toLowerCase();
      const haystack = [
        product.english_name ?? '',
        product.arabic_name ?? '',
        product.original_name ?? '',
        product.brand ?? '',
        product.product_group,
        product.slug,
        DANAT_SUPPLIER.name,
      ].join(' ').toLowerCase();
      if (!haystack.includes(searchKey)) return false;
    }
    return true;
  });

  products = [...products].sort((left, right) => {
    const leftName = left.english_name || left.original_name || left.slug;
    const rightName = right.english_name || right.original_name || right.slug;
    switch (sortBy) {
      case 'name':
        return leftName.localeCompare(rightName);
      case 'name_desc':
        return rightName.localeCompare(leftName);
      default:
        return 0;
    }
  });

  const paged = products.slice(offset, offset + limit);

  return {
    products: paged.map((product) => {
      const name = lang === 'ar' && product.arabic_name
        ? product.arabic_name
        : (product.english_name || product.original_name || product.slug);
      
      const placeholderImg = getDanatGroupPlaceholder(product.product_group);

      return {
        id: product.id,
        slug: product.slug,
        sku: product.id.toUpperCase(),
        name,
        price: 0, // Unverified price: displayed as "Request Price"
        currency: 'AED',
        image_url: placeholderImg,
        thumbnail_url: placeholderImg,
        supplier_name: DANAT_SUPPLIER.name,
        supplier_slug: DANAT_SUPPLIER.slug,
        tags: [product.product_group, product.brand ?? '', product.product_category].filter(Boolean),
        stock_status: 'in_stock',
        inventory_quantity: undefined,
        is_featured: featuredOnly,
        requires_compliance_review: product.manual_review_required,
        category_slug: product.product_category,
        category_name: product.product_group,
        brand_slug: product.brand ? product.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') : DANAT_SUPPLIER.slug,
        origin: 'Morocco',
        in_stock: true,
        badge: product.brand ?? 'Imported B2B',
      };
    }),
    total: products.length,
  };
}

function fallbackProductBySlug(slug: string, lang: LangCode = 'en'): Product | null {
  const product = DANAT_PRODUCTS.find((item) => item.slug === slug);
  if (!product) {
    const bab = BAB_PRODUCTS.find((item) => item.slug === slug);
    if (!bab) return null;
    return {
      id: bab.slug,
      slug: bab.slug,
      sku: bab.sku,
      name: bab.name,
      short_description: `${bab.name} available through OUROZ suppliers.`,
      description: `${bab.name} is available for quotation and procurement through OUROZ verified suppliers.`,
      price: 0,
      currency: 'AED',
      origin: 'Morocco',
      origin_region: undefined,
      weight: undefined,
      certifications: [],
      badge: 'Request Price',
      in_stock: true,
      image_url: bab.imagePaths[0],
      thumbnail_url: bab.thumbnailPath,
      stock_status: 'in_stock',
      inventory_quantity: undefined,
      is_featured: bab.featured,
      tags: bab.tags,
      requires_compliance_review: false,
      care_information: bab.careInformation,
      shipping_information: bab.shippingInformation,
      storage_information: bab.storageInformation,
      return_eligible: true,
      minimum_order_quantity: 1,
      wholesale_ready: true,
      product_review_status: 'approved',
      compliance_review_status: 'approved',
      compliance_notes: '',
      brand: { name: BAB_SUPPLIER.name, slug: BAB_SUPPLIER.slug },
      category: {
        name: BAB_CATEGORIES.find((category) => category.slug === bab.categorySlug)?.name ?? bab.categorySlug,
        slug: bab.categorySlug,
      },
      supplier: { name: BAB_SUPPLIER.name, slug: BAB_SUPPLIER.slug },
      images: bab.imagePaths.map((url, index) => ({
        id: `${bab.slug}-${index}`,
        url,
        alt: bab.imageAlt,
        position: index,
      })),
      variants: [
        {
          id: `${bab.slug}-variant`,
          name: 'Standard',
          price: 0,
          in_stock: true,
          sku: `${bab.sku}-STD`,
        },
      ],
    };
  }

  const name = lang === 'ar' && product.arabic_name
    ? product.arabic_name
    : (product.english_name || product.original_name || product.slug);

  const placeholderImg = getDanatGroupPlaceholder(product.product_group);

  return {
    id: product.id,
    slug: product.slug,
    sku: product.id.toUpperCase(),
    name,
    short_description: `${name} — authentic Moroccan provision supplied by ${DANAT_SUPPLIER.name}.`,
    description: `${name} is supplied by ${DANAT_SUPPLIER.name} under ${product.product_group}. Trade inquiries, specifications, and wholesale pricing are provided upon request.`,
    price: 0, // Unverified price: Request Price
    currency: 'AED',
    origin: 'Morocco',
    origin_region: undefined,
    weight: undefined,
    certifications: [],
    badge: product.brand ?? 'Imported B2B',
    in_stock: true,
    image_url: placeholderImg,
    thumbnail_url: placeholderImg,
    stock_status: 'in_stock',
    inventory_quantity: undefined,
    is_featured: false,
    tags: [product.product_group, product.brand ?? '', product.product_category].filter(Boolean),
    requires_compliance_review: product.manual_review_required,
    care_information: 'Store in a cool, dry place. Observe packaging instructions.',
    shipping_information: 'Available for UAE delivery and wholesale dispatch.',
    storage_information: 'Standard dry/ambient storage unless specified on product packaging.',
    return_eligible: true,
    minimum_order_quantity: 1,
    wholesale_ready: true,
    product_review_status: 'approved',
    compliance_review_status: 'approved',
    compliance_notes: '',
    brand: { name: product.brand || DANAT_SUPPLIER.name, slug: product.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || DANAT_SUPPLIER.slug },
    category: {
      name: product.product_group,
      slug: product.product_category,
    },
    supplier: { name: DANAT_SUPPLIER.name, slug: DANAT_SUPPLIER.slug },
    images: [
      {
        id: `${product.slug}-0`,
        url: placeholderImg,
        alt: name,
        position: 0,
      },
    ],
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.pack_size || 'Standard Case',
      price: 0,
      in_stock: true,
      sku: v.id,
    })),
  };
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getCategories(lang: LangCode = 'en'): Promise<Category[]> {
  const db = supabase();

  const [{ data: topLevel, error: topLevelError }, { data: subs }] = await Promise.all([
    db
      .from('categories')
      .select('id, slug, name, name_ar, name_fr, icon, image_url, description, description_ar, description_fr')
      .is('parent_id', null)
      .eq('is_active', true)
      .order('display_order', { ascending: true }),

    db
      .from('categories')
      .select('id, slug, name, name_ar, name_fr, icon, parent_id')
      .not('parent_id', 'is', null)
      .eq('is_active', true)
      .order('display_order', { ascending: true }),
  ]);

  if (topLevelError || !topLevel) return fallbackCategories(lang);

  // Group subcategories by parent
  const subMap: Record<string, SubCategory[]> = {};
  for (const s of subs ?? []) {
    if (!subMap[s.parent_id]) subMap[s.parent_id] = [];
    subMap[s.parent_id].push({
      id: s.id,
      slug: s.slug,
      name: localName(s, lang),
      icon: s.icon ?? undefined,
    });
  }

  return topLevel.map(cat => ({
    id: cat.id,
    slug: cat.slug,
    name: localName(cat, lang),
    icon: cat.icon ?? undefined,
    image_url: cat.image_url ?? undefined,
    description: localDesc(cat, lang),
    subcategories: subMap[cat.id] ?? [],
  }));
}

export async function getCategoryBySlug(
  slug: string,
  lang: LangCode = 'en'
): Promise<Category | null> {
  const db = supabase();

  const { data, error } = await db
    .from('categories')
    .select('id, slug, name, name_ar, name_fr, icon, image_url, description, description_ar, description_fr')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return fallbackCategoryBySlug(slug);

  const { data: subs } = await db
    .from('categories')
    .select('id, slug, name, name_ar, name_fr, icon')
    .eq('parent_id', data.id)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  return {
    id: data.id,
    slug: data.slug,
    name: localName(data, lang),
    icon: data.icon ?? undefined,
    image_url: data.image_url ?? undefined,
    description: localDesc(data, lang),
    subcategories: (subs ?? []).map(s => ({
      id: s.id,
      slug: s.slug,
      name: localName(s, lang),
      icon: s.icon ?? undefined,
    })),
  };
}

// ── Products ──────────────────────────────────────────────────────────────────

export interface ProductCardsQuery {
  lang?: LangCode;
  categorySlug?: string;
  subcategorySlug?: string;
  supplierSlug?: string;
  stock?: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
  featuredOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  complianceOnly?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'name' | 'name_desc';
}

export async function getProductCards({
  lang = 'en',
  categorySlug,
  subcategorySlug,
  supplierSlug,
  stock = 'all',
  featuredOnly = false,
  minPrice,
  maxPrice,
  complianceOnly = false,
  search,
  limit = 24,
  offset = 0,
  sortBy = 'featured',
}: ProductCardsQuery): Promise<{ products: ProductCard[]; total: number }> {
  const db = supabase();

  // Resolve which category IDs to filter against
  let categoryIds: string[] | null = null;

  if (subcategorySlug) {
    const { data: sub } = await db
      .from('categories')
      .select('id')
      .eq('slug', subcategorySlug)
      .single();
    if (sub) categoryIds = [sub.id];
  } else if (categorySlug) {
    const { data: cat } = await db
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    if (cat) {
      const { data: children } = await db
        .from('categories')
        .select('id')
        .eq('parent_id', cat.id);
      categoryIds = [cat.id, ...(children ?? []).map(c => c.id)];
    }
  }

  let query = db
    .from('products')
    .select(
      `id, slug, name, name_ar, name_fr,
       base_price, compare_at_price, currency, sku, thumbnail_url,
       origin, in_stock, badge, stock_status, inventory_quantity, is_featured, requires_compliance_review, product_tags,
       category:categories!category_id(slug, name),
       brand:brands!brand_id(slug),
       supplier:suppliers!supplier_id(slug, name),
       image_urls,
       images:product_images(url, position)`,
      { count: 'exact' }
    )
    .eq('is_active', true);

  if (categoryIds?.length) {
    query = query.in('category_id', categoryIds);
  }

  if (supplierSlug) {
    const { data: supplier } = await db
      .from('suppliers')
      .select('id')
      .eq('slug', supplierSlug)
      .single();
    if (supplier?.id) {
      query = query.eq('supplier_id', supplier.id);
    }
  }

  if (featuredOnly) {
    query = query.eq('is_featured', true);
  }

  if (typeof minPrice === 'number') {
    query = query.gte('base_price', minPrice);
  }

  if (typeof maxPrice === 'number') {
    query = query.lte('base_price', maxPrice);
  }

  if (complianceOnly) {
    query = query.eq('requires_compliance_review', true);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`);
  }

  switch (sortBy) {
    case 'featured':
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
      break;
    case 'price_asc':  query = query.order('base_price', { ascending: true });  break;
    case 'price_desc': query = query.order('base_price', { ascending: false }); break;
    case 'name':       query = query.order('name',       { ascending: true });  break;
    case 'name_desc':  query = query.order('name',       { ascending: false }); break;
    default:           query = query.order('created_at', { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error || !data || data.length === 0) {
    return fallbackProductCards({
      lang,
      categorySlug,
      subcategorySlug,
      supplierSlug,
      stock,
      featuredOnly,
      minPrice,
      maxPrice,
      complianceOnly,
      search,
      limit,
      offset,
      sortBy,
    });
  }

  let products: ProductCard[] = data.map(row => {
    const imgs = ((row.images as { url: string; position: number }[]) ?? [])
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    const legacyImages = (row.image_urls as string[] | null) ?? [];

    const name = lang === 'ar' && (row as { name_ar?: string }).name_ar
      ? (row as { name_ar: string }).name_ar
      : lang === 'fr' && (row as { name_fr?: string }).name_fr
      ? (row as { name_fr: string }).name_fr
      : row.name;

    return {
      id: row.id,
      slug: row.slug,
      sku: row.sku ?? undefined,
      name,
      price: row.base_price,
      compare_at_price: row.compare_at_price ?? undefined,
      currency: row.currency ?? 'AED',
      image_url: imgs[0]?.url ?? legacyImages[0] ?? undefined,
      thumbnail_url: row.thumbnail_url ?? imgs[0]?.url ?? legacyImages[0] ?? undefined,
      category_slug: (row.category as unknown as { slug: string } | null)?.slug,
      category_name: (row.category as unknown as { name: string } | null)?.name,
      brand_slug: (row.brand as unknown as { slug: string } | null)?.slug,
      supplier_slug: (row.supplier as unknown as { slug: string } | null)?.slug,
      supplier_name: (row.supplier as unknown as { name: string } | null)?.name,
      origin: row.origin ?? undefined,
      in_stock: row.in_stock,
      stock_status: (row.stock_status as ProductCard['stock_status']) ?? undefined,
      inventory_quantity: row.inventory_quantity ?? undefined,
      is_featured: row.is_featured ?? undefined,
      requires_compliance_review: row.requires_compliance_review ?? undefined,
      tags: (row.product_tags as string[] | null) ?? undefined,
      badge: row.badge ?? undefined,
    };
  });

  if (search) {
    const searchKey = search.trim().toLowerCase();
    const aliases = BAB_SEARCH_ALIASES[searchKey] ?? [searchKey];
    products = products.filter((product) => {
      const haystack = [
        product.name,
        product.slug,
        product.category_name ?? '',
        product.supplier_name ?? '',
        ...(product.tags ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return aliases.some((token) => haystack.includes(token.toLowerCase()));
    });
  }

  if (stock !== 'all') {
    products = products.filter((product) => {
      const state = product.stock_status ?? (product.in_stock ? 'in_stock' : 'out_of_stock');
      if (stock === 'in-stock') return state === 'in_stock';
      if (stock === 'low-stock') return state === 'low_stock';
      return state === 'out_of_stock';
    });
  }

  return { products, total: count ?? products.length };
}

export async function getProductBySlug(
  slug: string,
  lang: LangCode = 'en'
): Promise<Product | null> {
  const db = supabase();

  const { data, error } = await db
    .from('products')
    .select(`
      id, slug, name, name_ar, name_fr,
      short_description, description, description_ar, description_fr,
      base_price, compare_at_price, currency,
      origin, origin_region, weight, certifications, badge, in_stock,
      sku, thumbnail_url, stock_status, inventory_quantity, is_featured, product_tags,
      care_information, shipping_information, storage_information, return_eligible,
      minimum_order_quantity, wholesale_ready, product_review_status,
      compliance_review_status, requires_compliance_review, compliance_notes,
      images:product_images(id, url, alt, position),
      image_urls,
      variants:product_variants(id, name, price, compare_at_price, in_stock, sku, display_order),
      category:categories!category_id(slug, name),
      brand:brands!brand_id(slug, name),
      supplier:suppliers!supplier_id(slug, name)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return fallbackProductBySlug(slug, lang);

  const name = lang === 'ar' && data.name_ar ? data.name_ar
             : lang === 'fr' && data.name_fr ? data.name_fr
             : data.name;

  const description = lang === 'ar' && data.description_ar ? data.description_ar
                    : lang === 'fr' && data.description_fr ? data.description_fr
                    : data.description;

  const images = ((data.images as { id: string; url: string; alt?: string; position: number }[]) ?? [])
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map(img => ({ id: img.id, url: img.url, alt: img.alt ?? name, position: img.position ?? 0 }));

  const legacyImages = (data.image_urls as string[] | null) ?? [];
  const mergedImages = images.length > 0
    ? images
    : legacyImages.map((url, idx) => ({
        id: `legacy-${idx}`,
        url,
        alt: `${name} image ${idx + 1}`,
        position: idx,
      }));

  const variants = (
    (data.variants as {
      id: string; name: string; price: number;
      compare_at_price?: number; in_stock: boolean;
      sku?: string; display_order?: number;
    }[]) ?? []
  )
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map(v => ({
      id: v.id,
      name: v.name,
      price: v.price,
      compare_at_price: v.compare_at_price ?? undefined,
      in_stock: v.in_stock,
      sku: v.sku ?? undefined,
    }));

  const cat = data.category as unknown as { slug: string; name: string } | null;
  const brand = data.brand as unknown as { slug: string; name: string } | null;
  const supplier = data.supplier as unknown as { slug: string; name: string } | null;

  return {
    id: data.id,
    slug: data.slug,
    sku: data.sku ?? undefined,
    name,
    short_description: data.short_description ?? undefined,
    description: description ?? undefined,
    price: data.base_price,
    compare_at_price: data.compare_at_price ?? undefined,
    currency: data.currency ?? 'AED',
    origin: data.origin ?? undefined,
    origin_region: data.origin_region ?? undefined,
    weight: data.weight ?? undefined,
    certifications: (data.certifications as string[]) ?? [],
    badge: data.badge ?? undefined,
    in_stock: data.in_stock,
    image_url: mergedImages[0]?.url,
    thumbnail_url: data.thumbnail_url ?? mergedImages[0]?.url,
    stock_status: (data.stock_status as Product['stock_status']) ?? undefined,
    inventory_quantity: data.inventory_quantity ?? undefined,
    is_featured: data.is_featured ?? undefined,
    tags: (data.product_tags as string[] | null) ?? undefined,
    requires_compliance_review: data.requires_compliance_review ?? undefined,
    care_information: data.care_information ?? undefined,
    shipping_information: data.shipping_information ?? undefined,
    storage_information: data.storage_information ?? undefined,
    return_eligible: data.return_eligible ?? undefined,
    minimum_order_quantity: data.minimum_order_quantity ?? undefined,
    wholesale_ready: data.wholesale_ready ?? undefined,
    product_review_status: (data.product_review_status as Product['product_review_status']) ?? undefined,
    compliance_review_status: (data.compliance_review_status as Product['compliance_review_status']) ?? undefined,
    compliance_notes: data.compliance_notes ?? undefined,
    images: mergedImages,
    variants,
    category: cat ? { slug: cat.slug, name: cat.name } : undefined,
    brand: brand ? { slug: brand.slug, name: brand.name } : undefined,
    supplier: supplier ? { slug: supplier.slug, name: supplier.name } : undefined,
  };
}
