'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';

interface WishlistProduct {
    id: string;
    name: string;
    slug: string;
    base_price: number;
    compare_at_price: number | null;
    image_urls: string[];
    thumbnail_url: string | null;
    variant_id: string;
    stock: number;
}

const STORAGE_KEY = 'ouroz_wishlist';

function getLocalWishlist(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
        return [];
    }
}

function setLocalWishlist(ids: string[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function WishlistPage() {
    const [products, setProducts] = useState<WishlistProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();

    const loadWishlist = useCallback(async () => {
        const productIds = getLocalWishlist();
        if (productIds.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
        }

        const { data } = await supabase
            .from('products')
            .select(`
                id, name, slug, base_price, compare_at_price, image_urls,
                thumbnail_url,
                variants:product_variants(id, retail_price, stock_quantity, is_active)
            `)
            .in('id', productIds)
            .eq('is_active', true);

        const items: WishlistProduct[] = (data ?? []).map((p: {
            id: string; name: string; slug: string; base_price: number;
            compare_at_price: number | null; image_urls: string[]; thumbnail_url: string | null;
            variants: { id: string; stock_quantity: number; is_active: boolean }[];
        }) => {
            const v = p.variants?.find(v => v.is_active) ?? p.variants?.[0];
            return {
                id: p.id,
                name: p.name,
                slug: p.slug,
                base_price: p.base_price,
                compare_at_price: p.compare_at_price,
                image_urls: p.image_urls ?? [],
                thumbnail_url: p.thumbnail_url,
                variant_id: v?.id ?? '',
                stock: v?.stock_quantity ?? 0,
            };
        });

        setProducts(items);
        setLoading(false);
    }, []);

    useEffect(() => { loadWishlist(); }, [loadWishlist]);

    const removeFromWishlist = (productId: string) => {
        const ids = getLocalWishlist().filter(id => id !== productId);
        setLocalWishlist(ids);
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    const handleAddToCart = (product: WishlistProduct) => {
        if (!product.variant_id) return;
        addItem({
            variantId: product.variant_id,
            qty: 1,
            name: product.name,
            image: product.image_urls[0] ?? null,
            sku: '',
            label: null,
            price: product.base_price,
            productId: product.id,
            productSlug: product.slug,
        });
    };

    const clearAll = () => {
        setLocalWishlist([]);
        setProducts([]);
    };

    return (
        <div className="min-h-screen bg-[var(--color-sahara)]">
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/shop" className="text-sm text-amber-600 hover:underline mb-2 inline-block">&larr; Back to Shop</Link>
                        <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">My Wishlist</h1>
                    </div>
                    {products.length > 0 && (
                        <button onClick={clearAll}
                            className="text-sm text-red-500 hover:text-red-600 font-medium">
                            Clear All
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[1,2,3].map(i => <div key={i} className="h-48 bg-white rounded-xl animate-pulse" />)}
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                        <div className="text-4xl mb-4">&#9825;</div>
                        <p className="text-lg font-semibold text-gray-800 mb-2">Your wishlist is empty</p>
                        <p className="text-sm text-gray-500 mb-6">Browse products and tap the heart to save them here.</p>
                        <Link href="/shop"
                            className="inline-block px-6 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition text-sm">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map(product => (
                            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">
                                <Link href={`/product/${product.slug}`} className="block">
                                    <div className="aspect-square bg-gray-100 overflow-hidden">
                                        {(product.thumbnail_url ?? product.image_urls[0]) ? (
                                            <img src={product.thumbnail_url ?? product.image_urls[0]} alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <img src="/images/catalog/atlas-souk/shared/wishlist-fallback.svg" alt="Wishlist image placeholder" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <Link href={`/product/${product.slug}`}>
                                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-amber-600 transition">{product.name}</h3>
                                    </Link>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-bold text-[var(--color-charcoal)]">AED {product.base_price.toFixed(2)}</span>
                                        {product.compare_at_price && (
                                            <span className="text-sm text-gray-400 line-through">AED {product.compare_at_price.toFixed(2)}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-3">
                                        <button onClick={() => handleAddToCart(product)}
                                            disabled={product.stock === 0}
                                            className="flex-1 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                        <button onClick={() => removeFromWishlist(product.id)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Remove">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
