import { z } from 'zod';

const SORT_VALUES = [
  'featured',
  'newest',
  'price-asc',
  'price-desc',
  'name-asc',
  'name-desc',
] as const;

const STOCK_VALUES = ['all', 'in-stock', 'low-stock', 'out-of-stock'] as const;
const FEATURED_VALUES = ['all', 'only'] as const;
const PRODUCT_TYPE_VALUES = ['all', 'kitchen', 'skin-care', 'groceries'] as const;

const querySchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z
    .enum(['kitchen-accessories', 'skin-care', 'groceries'])
    .optional(),
  supplier: z.string().trim().max(120).optional(),
  stock: z.enum(STOCK_VALUES).optional().default('all'),
  featured: z.enum(FEATURED_VALUES).optional().default('all'),
  type: z.enum(PRODUCT_TYPE_VALUES).optional().default('all'),
  minPrice: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .pipe(z.number().min(0).max(100000).optional()),
  maxPrice: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .pipe(z.number().min(0).max(100000).optional()),
  sort: z.enum(SORT_VALUES).optional().default('featured'),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 1))
    .pipe(z.number().int().min(1).max(999)),
  perPage: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 24))
    .pipe(z.number().int().min(1).max(60)),
});

export type CatalogQueryParams = z.infer<typeof querySchema>;

export function parseCatalogQueryParams(
  source: Record<string, string | string[] | undefined>
): CatalogQueryParams {
  const normalized: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value)) {
      normalized[key] = value[0];
      continue;
    }
    normalized[key] = value;
  }

  const result = querySchema.safeParse(normalized);
  if (!result.success) {
    return {
      stock: 'all',
      featured: 'all',
      type: 'all',
      sort: 'featured',
      page: 1,
      perPage: 24,
    };
  }

  if (
    typeof result.data.minPrice === 'number' &&
    typeof result.data.maxPrice === 'number' &&
    result.data.minPrice > result.data.maxPrice
  ) {
    return {
      ...result.data,
      minPrice: result.data.maxPrice,
      maxPrice: result.data.minPrice,
    };
  }

  return result.data;
}

export type CatalogSortValue = (typeof SORT_VALUES)[number];
