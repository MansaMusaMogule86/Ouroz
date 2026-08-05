/**
 * ShopPageClient — /shop catalog shell.
 * URL query params drive filter/search/sort state for shareable links.
 */
'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Category, Brand, ProductCard } from '@/types/shop';
import type { CatalogQueryParams } from '@/lib/catalog/catalogQueryParams';
import ProductGrid from './ProductGrid';

interface Props {
  categories: Category[];
  brands: Brand[];
  lang: string;
  initialProducts: ProductCard[];
  totalCount?: number;
  initialQuery: CatalogQueryParams;
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price Low to High' },
  { value: 'price-desc', label: 'Price High to Low' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
] as const;

const STOCK_OPTIONS = [
  { value: 'all', label: 'All Stock' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'low-stock', label: 'Low Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
] as const;

export default function ShopPageClient({
  categories,
  brands,
  lang,
  initialProducts,
  totalCount,
  initialQuery,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const urlParams = useSearchParams();
  const [searchDraft, setSearchDraft] = useState(initialQuery.q ?? '');
  const [isPending, startTransition] = useTransition();

  const supplierOptions = useMemo(() => {
    const seen = new Set<string>();
    const options: Array<{ slug: string; name: string }> = [];
    for (const product of initialProducts) {
      if (!product.supplier_slug || !product.supplier_name) continue;
      if (seen.has(product.supplier_slug)) continue;
      seen.add(product.supplier_slug);
      options.push({ slug: product.supplier_slug, name: product.supplier_name });
    }
    return options;
  }, [initialProducts]);

  const t = (en: string, ar: string, fr: string) =>
    lang === 'ar' ? ar : lang === 'fr' ? fr : en;

  const setQueryParam = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams(urlParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    params.delete('page');
    const queryString = params.toString();

    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    });
  };

  const applySearch = () => {
    setQueryParam({ q: searchDraft.trim() || undefined });
  };

  const clearFilters = () => {
    setSearchDraft('');
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  return (
    <div className="space-y-20">
      {categories.length > 0 && (
        <section>
          <SectionHeader
            eyebrow={t('— Categories', '— الفئات', '— Catégories')}
            title={t('Browse by Collection', 'تصفح حسب المجموعة', 'Parcourir par collection')}
            count={categories.length}
          />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.slug} cat={cat} priority={i < 3} />
            ))}
          </div>
        </section>
      )}

      {brands.length > 0 && (
        <section>
          <SectionHeader
            eyebrow={t('— Brands', '— العلامات التجارية', '— Marques')}
            title={t('Trusted Houses', 'بيوت موثوقة', 'Maisons de confiance')}
            count={brands.length}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeader
          eyebrow={t('— Products', '— المنتجات', '— Produits')}
          title={t('All Provisions', 'كل المؤن', 'Toutes les provisions')}
          count={totalCount ?? initialProducts.length}
        />

        <div className="rounded-3xl border p-4 md:p-6 space-y-4" style={{ borderColor: 'rgba(42,32,22,0.12)', background: 'rgba(253,248,240,0.55)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="search"
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applySearch();
                }}
                placeholder={t('Search products, suppliers, and tags…', 'ابحث في المنتجات والموردين والوسوم…', 'Rechercher produits, fournisseurs et tags…')}
                className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none"
                style={{ borderColor: 'rgba(42,32,22,0.2)', color: 'var(--color-charcoal)', background: 'rgba(255,255,255,0.7)' }}
                aria-label="Search catalog"
              />
              <button
                type="button"
                onClick={applySearch}
                className="absolute right-2 top-2 rounded-lg px-3 py-1.5 text-xs font-semibold"
                style={{ background: 'var(--color-charcoal)', color: 'var(--color-cream)' }}
              >
                Search
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={initialQuery.sort}
                onChange={(e) => setQueryParam({ sort: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: 'rgba(42,32,22,0.2)', color: 'var(--color-charcoal)', background: 'rgba(255,255,255,0.7)' }}
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <select
                value={initialQuery.stock}
                onChange={(e) => setQueryParam({ stock: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: 'rgba(42,32,22,0.2)', color: 'var(--color-charcoal)', background: 'rgba(255,255,255,0.7)' }}
                aria-label="Stock filter"
              >
                {STOCK_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <select
              value={initialQuery.category ?? 'all'}
              onChange={(e) => setQueryParam({ category: e.target.value === 'all' ? undefined : e.target.value })}
              className="rounded-xl border px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: 'rgba(42,32,22,0.2)', color: 'var(--color-charcoal)', background: 'rgba(255,255,255,0.7)' }}
              aria-label="Category filter"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>{category.name}</option>
              ))}
            </select>

            <select
              value={initialQuery.supplier ?? 'all'}
              onChange={(e) => setQueryParam({ supplier: e.target.value === 'all' ? undefined : e.target.value })}
              className="rounded-xl border px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: 'rgba(42,32,22,0.2)', color: 'var(--color-charcoal)', background: 'rgba(255,255,255,0.7)' }}
              aria-label="Supplier filter"
            >
              <option value="all">All Suppliers</option>
              {supplierOptions.map((supplier) => (
                <option key={supplier.slug} value={supplier.slug}>{supplier.name}</option>
              ))}
            </select>

            <input
              type="number"
              min={0}
              defaultValue={initialQuery.minPrice ?? ''}
              onBlur={(e) => setQueryParam({ minPrice: e.target.value || undefined })}
              className="rounded-xl border px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: 'rgba(42,32,22,0.2)', color: 'var(--color-charcoal)', background: 'rgba(255,255,255,0.7)' }}
              placeholder="Min AED"
              aria-label="Minimum price"
            />

            <input
              type="number"
              min={0}
              defaultValue={initialQuery.maxPrice ?? ''}
              onBlur={(e) => setQueryParam({ maxPrice: e.target.value || undefined })}
              className="rounded-xl border px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: 'rgba(42,32,22,0.2)', color: 'var(--color-charcoal)', background: 'rgba(255,255,255,0.7)' }}
              placeholder="Max AED"
              aria-label="Maximum price"
            />

            <button
              type="button"
              onClick={() => setQueryParam({ featured: initialQuery.featured === 'only' ? undefined : 'only' })}
              className="rounded-xl border px-3 py-2 text-sm font-medium"
              style={{
                borderColor: initialQuery.featured === 'only' ? 'var(--color-imperial)' : 'rgba(42,32,22,0.2)',
                color: initialQuery.featured === 'only' ? 'var(--color-imperial)' : 'var(--color-charcoal)',
                background: 'rgba(255,255,255,0.7)',
              }}
            >
              Featured Only
            </button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--color-charcoal)', opacity: 0.45 }}>
              {totalCount ?? initialProducts.length} results
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="text-[11px] uppercase tracking-[0.18em] underline underline-offset-4"
              style={{ color: 'var(--color-charcoal)', opacity: 0.62 }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="pt-6">
          <ProductGrid products={initialProducts} loading={isPending} columns={4} />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title, count }: { eyebrow: string; title: string; count?: number }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <p
          className="text-[9px] uppercase tracking-[0.35em] font-body mb-2"
          style={{ color: 'var(--color-charcoal)', opacity: 0.3 }}
        >
          {eyebrow}
        </p>
        <h2
          className="font-heading"
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 300,
            letterSpacing: '0.05em',
            color: 'var(--color-charcoal)',
          }}
        >
          {title}
        </h2>
      </div>
      {typeof count === 'number' && (
        <p
          className="text-[10px] uppercase tracking-[0.2em] font-body"
          style={{ color: 'var(--color-charcoal)', opacity: 0.32 }}
        >
          {count}
        </p>
      )}
    </div>
  );
}

function CategoryCard({ cat, priority }: { cat: Category; priority: boolean }) {
  void priority;
  return (
    <Link
      href={`/shop/${cat.slug}`}
      className="group relative rounded-2xl lg:rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] block"
    >
      <div className="absolute inset-0" style={{ background: 'var(--color-sahara-dark)' }}>
        {cat.image_url ? (
          <img
            src={cat.image_url}
            alt={cat.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-92 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-sahara-dark) 0%, var(--color-sahara) 100%)' }}
          >
            {cat.icon && <span className="text-7xl opacity-20">{cat.icon}</span>}
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
        <div
          className="rounded-xl lg:rounded-2xl px-4 py-3.5 lg:px-5 lg:py-4"
          style={{
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <div className="flex items-center gap-2 mb-0.5">
            {cat.icon && <span className="text-sm">{cat.icon}</span>}
            <p className="font-heading text-white" style={{ fontSize: '15px', fontWeight: 500, letterSpacing: '0.02em' }}>
              {cat.name}
            </p>
          </div>
          {cat.description && (
            <p className="font-body text-white/45 text-[10px] leading-snug mt-0.5 line-clamp-2">
              {cat.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div
      className="rounded-2xl border p-4 text-center"
      style={{ borderColor: 'rgba(42,32,22,0.12)', background: 'rgba(255,255,255,0.68)' }}
    >
      <p className="font-body text-sm" style={{ color: 'var(--color-charcoal)' }}>{brand.name}</p>
    </div>
  );
}
