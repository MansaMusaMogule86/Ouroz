import { Suspense } from 'react';
import { cookies } from 'next/headers';
import type { LangCode } from '@/types/shop';
import { fetchCategories, fetchBrands } from '@/lib/api';
import { getProductCards } from '@/lib/shop-queries';
import ShopPageClient from '@/components/shop/ShopPageClient';
import BrandTicker from '@/components/shop/BrandTicker';
import { parseCatalogQueryParams } from '@/lib/catalog/catalogQueryParams';

export const revalidate = 60;

interface Props {
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

export default async function ShopPage({ searchParams }: Props) {
    const parsedParams = parseCatalogQueryParams(await searchParams);
    const cookieStore = await cookies();
    const lang = (cookieStore.get('ouroz_lang')?.value ?? 'en') as LangCode;

    const [categories, brands, { products, total }] = await Promise.all([
        fetchCategories(),
        fetchBrands(),
        getProductCards({
            lang,
            categorySlug: parsedParams.category,
            supplierSlug: parsedParams.supplier,
            stock: parsedParams.stock,
            featuredOnly: parsedParams.featured === 'only',
            minPrice: parsedParams.minPrice,
            maxPrice: parsedParams.maxPrice,
            search: parsedParams.q,
            limit: parsedParams.perPage,
            offset: (parsedParams.page - 1) * parsedParams.perPage,
            sortBy: mapSort(parsedParams.sort),
        }),
    ]);

    const headline = {
        en: 'Authentic Moroccan Provisions',
        ar: 'المؤن المغربية الأصيلة',
        fr: 'Provisions Marocaines Authentiques',
    }[lang];

    const subheadline = {
        en: 'Sourced directly from cooperatives and producers across the Atlas.',
        ar: 'مصدرها مباشرة من التعاونيات والمنتجين في جميع أنحاء الأطلس.',
        fr: 'Provenant directement de coopératives et de producteurs de l\'Atlas.',
    }[lang];

    return (
        <div className="space-y-16">
            {/* Page Header */}
            <section className="text-center pt-8 pb-4">
                <h1
                    className="font-heading mb-4"
                    style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 300, letterSpacing: '0.04em', color: 'var(--color-charcoal)' }}
                >
                    {headline}
                </h1>
                <p
                    className="font-body text-lg max-w-2xl mx-auto leading-relaxed"
                    style={{ color: 'var(--color-charcoal)', opacity: 0.38 }}
                >
                    {subheadline}
                </p>
            </section>

            {/* Shop Client (category grid + products) */}
            <Suspense
                fallback={
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 rounded-full animate-spin border-(--color-charcoal)/5 border-t-(--color-charcoal)/30" />
                    </div>
                }
            >
                <ShopPageClient
                    categories={categories}
                    brands={brands}
                    lang={lang}
                    initialProducts={products}
                    totalCount={total}
                    initialQuery={parsedParams}
                />
            </Suspense>

            <BrandTicker brands={brands} />
        </div>
    );
}
