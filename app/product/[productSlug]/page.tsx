/**
 * /product/[productSlug] – Product Detail Page
 * Server Component + client islands for interactive parts.
 */

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Image from 'next/image';
import type { LangCode } from '@/types/shop';
import Link from 'next/link';
import { getProductBySlug, getProductCards } from '@/lib/shop-queries';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductDetailClient from '@/components/shop/ProductDetailClient';

export const revalidate = 30;

interface Props {
    params: Promise<{ productSlug: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { productSlug } = await params;
    const cookieStore = await cookies();
    const lang = (cookieStore.get('ouroz_lang')?.value ?? 'en') as LangCode;
    const product = await getProductBySlug(productSlug, lang);

    if (!product) return { title: 'Product Not Found' };

    return {
        title: `${product.name} | ${product.supplier?.name ?? 'Atlas Souk'} | OUROZ`,
        description: product.short_description ?? product.description?.slice(0, 160),
        alternates: {
            canonical: `/product/${product.slug}`,
        },
        openGraph: {
            title: `${product.name} | ${product.supplier?.name ?? 'Atlas Souk'} | OUROZ`,
            description: product.short_description ?? product.description?.slice(0, 160),
            images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { productSlug } = await params;
    const cookieStore = await cookies();
    const lang = (cookieStore.get('ouroz_lang')?.value ?? 'en') as LangCode;

    const product = await getProductBySlug(productSlug, lang);
    if (!product) notFound();

    const defaultVariant = product.variants[0] ?? null;

    const { products: relatedProducts } = await getProductCards({
        lang,
        categorySlug: product.category?.slug,
        supplierSlug: product.supplier?.slug,
        limit: 4,
        sortBy: 'featured',
    });

    const related = relatedProducts.filter((item) => item.slug !== product.slug).slice(0, 4);

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.short_description ?? product.description,
        sku: product.sku,
        image: product.images.map((img) => img.url),
        brand: {
            '@type': 'Brand',
            name: product.brand?.name ?? product.supplier?.name ?? 'Atlas Souk',
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: product.currency,
            price: product.price,
            availability: product.in_stock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            url: `/product/${product.slug}`,
        },
        category: product.category?.name,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Gallery – static server render */}
                <ProductGallery images={product.images} productName={product.name} />

                {/* Product info + interactive elements */}
                <ProductDetailClient
                    product={product}
                    defaultVariant={defaultVariant}
                    lang={lang}
                />
            </div>

            {related.length > 0 && (
                <section className="mt-14">
                    <h2 className="font-heading text-2xl mb-4" style={{ color: 'var(--color-charcoal)' }}>
                        Related Products
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {related.map((item) => (
                            <Link
                                key={item.id}
                                href={`/product/${item.slug}`}
                                className="rounded-2xl border overflow-hidden"
                                style={{ borderColor: 'rgba(42,32,22,0.12)', background: 'rgba(255,255,255,0.72)' }}
                            >
                                <div className="relative w-full aspect-square">
                                    <Image
                                        src={item.thumbnail_url ?? item.image_url ?? '/images/catalog/atlas-souk/shared/empty-image.svg'}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div className="p-3">
                                    <p className="font-heading text-sm" style={{ color: 'var(--color-charcoal)' }}>{item.name}</p>
                                    <p className="text-xs mt-1" style={{ color: 'var(--color-charcoal)', opacity: 0.6 }}>
                                        AED {item.price.toFixed(2)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
