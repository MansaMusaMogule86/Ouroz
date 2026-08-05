import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCategories, getProductCards } from '@/lib/shop-queries';
import { BAB_CATEGORIES, BAB_SUPPLIER } from '@/lib/catalog/atlasSoukCatalog';
import { parseCatalogQueryParams } from '@/lib/catalog/catalogQueryParams';
import ProductGrid from '@/components/shop/ProductGrid';

interface Props {
  params: Promise<{ supplierSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function mapSort(sort: string) {
  switch (sort) {
    case 'price-asc': return 'price_asc' as const;
    case 'price-desc': return 'price_desc' as const;
    case 'name-asc': return 'name' as const;
    case 'name-desc': return 'name_desc' as const;
    case 'newest': return 'newest' as const;
    default: return 'featured' as const;
  }
}

export async function generateMetadata({ params }: Props) {
  const { supplierSlug } = await params;
  if (supplierSlug !== BAB_SUPPLIER.slug) {
    return { title: 'Supplier Not Found | OUROZ' };
  }

  return {
    title: `${BAB_SUPPLIER.name} | OUROZ Supplier Store`,
    description: BAB_SUPPLIER.description,
    alternates: {
      canonical: `/supplier/${BAB_SUPPLIER.slug}`,
    },
    openGraph: {
      title: `${BAB_SUPPLIER.name} | OUROZ Supplier Store`,
      description: BAB_SUPPLIER.description,
      images: [{ url: BAB_SUPPLIER.bannerImage }],
    },
  };
}

export default async function SupplierStorefrontPage({ params, searchParams }: Props) {
  const { supplierSlug } = await params;
  if (supplierSlug !== BAB_SUPPLIER.slug) {
    notFound();
  }

  const parsed = parseCatalogQueryParams(await searchParams);
  const [{ products, total }, categories] = await Promise.all([
    getProductCards({
      supplierSlug: BAB_SUPPLIER.slug,
      categorySlug: parsed.category,
      search: parsed.q,
      stock: parsed.stock,
      featuredOnly: parsed.featured === 'only',
      minPrice: parsed.minPrice,
      maxPrice: parsed.maxPrice,
      sortBy: mapSort(parsed.sort),
      limit: parsed.perPage,
      offset: (parsed.page - 1) * parsed.perPage,
    }),
    getCategories(),
  ]);

  const categoryNav = categories.filter((category) =>
    BAB_CATEGORIES.some((allowed) => allowed.slug === category.slug)
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BAB_SUPPLIER.name,
    description: BAB_SUPPLIER.description,
    url: `/supplier/${BAB_SUPPLIER.slug}`,
    logo: BAB_SUPPLIER.logoImage,
    image: BAB_SUPPLIER.bannerImage,
    areaServed: 'United Arab Emirates',
    knowsAbout: BAB_CATEGORIES.map((category) => category.name),
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="rounded-3xl border overflow-hidden" style={{ borderColor: 'rgba(42,32,22,0.12)', background: 'rgba(253,248,240,0.7)' }}>
        <div className="relative w-full h-52 md:h-72">
          <Image
            src={BAB_SUPPLIER.bannerImage}
            alt="Atlas Souk supplier banner placeholder"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="p-5 md:p-8 grid grid-cols-1 md:grid-cols-[auto,1fr,auto] gap-4 items-start">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(42,32,22,0.16)' }}>
            <Image
              src={BAB_SUPPLIER.avatarImage}
              alt="Atlas Souk supplier avatar placeholder"
              fill
              sizes="80px"
              className="object-cover"
              unoptimized
            />
          </div>

          <div>
            <h1 className="font-heading text-4xl" style={{ color: 'var(--color-charcoal)' }}>
              {BAB_SUPPLIER.name}
            </h1>
            <p className="text-sm mt-2 max-w-3xl" style={{ color: 'var(--color-charcoal)', opacity: 0.72 }}>
              {BAB_SUPPLIER.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full border" style={{ borderColor: 'rgba(42,32,22,0.18)' }}>Origin: Morocco</span>
              <span className="px-3 py-1 rounded-full border" style={{ borderColor: 'rgba(139,26,74,0.26)', color: 'var(--color-imperial)' }}>
                Verification Placeholder
              </span>
              <span className="px-3 py-1 rounded-full border" style={{ borderColor: 'rgba(201,168,76,0.32)', color: 'var(--color-gold-muted)' }}>
                Reviews Placeholder
              </span>
            </div>
          </div>

          <div className="text-sm" style={{ color: 'var(--color-charcoal)', opacity: 0.7 }}>
            <p>Products: {total}</p>
            <p>Shipping: Standard UAE delivery</p>
            <p>Returns: Policy classification pending</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border p-4 md:p-6" style={{ borderColor: 'rgba(42,32,22,0.12)', background: 'rgba(255,255,255,0.65)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <form action={`/supplier/${BAB_SUPPLIER.slug}`} className="flex gap-2">
            <input
              type="search"
              name="q"
              defaultValue={parsed.q ?? ''}
              placeholder="Search within supplier catalog"
              className="flex-1 rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: 'rgba(42,32,22,0.2)', background: 'rgba(255,255,255,0.8)' }}
            />
            <button
              type="submit"
              className="rounded-xl px-3 py-2 text-sm"
              style={{ background: 'var(--color-charcoal)', color: 'var(--color-cream)' }}
            >
              Search
            </button>
          </form>

          <div className="grid grid-cols-3 gap-2">
            <Link href={`/supplier/${BAB_SUPPLIER.slug}?sort=featured`} className="text-center rounded-xl border px-2 py-2 text-xs" style={{ borderColor: 'rgba(42,32,22,0.2)' }}>Featured</Link>
            <Link href={`/supplier/${BAB_SUPPLIER.slug}?sort=price-asc`} className="text-center rounded-xl border px-2 py-2 text-xs" style={{ borderColor: 'rgba(42,32,22,0.2)' }}>Price ↑</Link>
            <Link href={`/supplier/${BAB_SUPPLIER.slug}?sort=price-desc`} className="text-center rounded-xl border px-2 py-2 text-xs" style={{ borderColor: 'rgba(42,32,22,0.2)' }}>Price ↓</Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/supplier/${BAB_SUPPLIER.slug}`}
            className={`px-3 py-1.5 rounded-full text-xs border ${!parsed.category ? 'font-semibold' : ''}`}
            style={{ borderColor: 'rgba(42,32,22,0.2)', color: 'var(--color-charcoal)' }}
          >
            All Categories
          </Link>
          {categoryNav.map((category) => (
            <Link
              key={category.id}
              href={`/supplier/${BAB_SUPPLIER.slug}?category=${category.slug}`}
              className={`px-3 py-1.5 rounded-full text-xs border ${parsed.category === category.slug ? 'font-semibold' : ''}`}
              style={{ borderColor: 'rgba(42,32,22,0.2)', color: 'var(--color-charcoal)' }}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl mb-4" style={{ color: 'var(--color-charcoal)' }}>
          Featured from {BAB_SUPPLIER.name}
        </h2>
        <ProductGrid products={products.filter((product) => product.is_featured).slice(0, 4)} columns={4} />
      </section>

      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-heading text-2xl" style={{ color: 'var(--color-charcoal)' }}>
            Full Catalog
          </h2>
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-charcoal)', opacity: 0.6 }}>
            {total} products
          </p>
        </div>
        {products.length === 0 ? (
          <div className="rounded-2xl border p-8 text-center" style={{ borderColor: 'rgba(42,32,22,0.12)', background: 'rgba(255,255,255,0.75)' }}>
            <p className="font-heading text-xl mb-2" style={{ color: 'var(--color-charcoal)' }}>No Products Match These Filters</p>
            <p className="text-sm" style={{ color: 'var(--color-charcoal)', opacity: 0.65 }}>
              Try adjusting search terms, category selection, or price range.
            </p>
          </div>
        ) : (
          <ProductGrid products={products} columns={4} />
        )}
      </section>

      <section className="rounded-3xl border p-5 md:p-6" style={{ borderColor: 'rgba(42,32,22,0.12)', background: 'rgba(253,248,240,0.65)' }}>
        <h3 className="font-heading text-xl mb-2" style={{ color: 'var(--color-charcoal)' }}>About Atlas Souk</h3>
        <p className="text-sm mb-3" style={{ color: 'var(--color-charcoal)', opacity: 0.72 }}>
          Store profile copy is a production placeholder and will be refined after final supplier onboarding review.
        </p>
        <div className="grid gap-2 text-sm" style={{ color: 'var(--color-charcoal)', opacity: 0.7 }}>
          <p>Contact action: Use OUROZ supplier contact workflow.</p>
          <p>Shipping information: Standard fulfillment windows apply unless updated by supplier.</p>
          <p>Returns information placeholder: Return classification to be finalized per product.</p>
        </div>
      </section>
    </div>
  );
}
