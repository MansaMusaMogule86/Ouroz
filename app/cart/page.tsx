'use client';
/**
 * /cart – Full cart page
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import { useLang } from '@/contexts/LangContext';
import QuantitySelector from '@/components/shop/QuantitySelector';

export default function CartPage() {
    const { cart, updateQty, removeItem } = useCart();
    const { t, isRTL } = useLang();

    const fmt = (n: number) =>
        new Intl.NumberFormat(isRTL ? 'ar-AE' : 'en-AE', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 2,
        }).format(n);

    const VAT_RATE = 0.05;
    const subtotal = cart?.subtotal ?? 0;
    const vat = subtotal * VAT_RATE;
    const total = subtotal + vat;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-[var(--color-charcoal)] mb-6">
                {t('cart')}
            </h1>

            {(!cart || cart.items.length === 0) ? (
                <div className="flex flex-col items-center py-20 gap-4 text-stone-400">
                    <span className="text-5xl">🛒</span>
                    <p className="text-base font-medium">{t('cartEmpty')}</p>
                    <Link
                        href="/shop"
                        className="px-6 py-3 bg-[var(--color-imperial)] text-white rounded-xl font-semibold text-sm
                                   hover:bg-[var(--color-imperial)]/90 transition"
                    >
                        {t('continueShopping')}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map(item => (
                            <div
                                key={item.cart_item_id}
                                className="flex gap-4 bg-white rounded-2xl border border-stone-100 p-4"
                            >
                                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl
                                                overflow-hidden bg-[var(--color-sahara)]">
                                    <Image
                                        src={item.image_url ?? '/images/catalog/atlas-souk/shared/cart-fallback.svg'}
                                        alt={item.product_name}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/product/${item.product_slug}`}
                                        className="font-semibold text-sm text-[var(--color-charcoal)]
                                                   hover:text-[var(--color-imperial)] line-clamp-2"
                                    >
                                        {item.product_name}
                                    </Link>
                                    {item.variant_label && (
                                        <p className="text-xs text-stone-400 mt-0.5">{item.variant_label}</p>
                                    )}
                                    <p className="text-xs text-stone-400">SKU: {item.variant_sku}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <QuantitySelector
                                            value={item.qty}
                                            onChange={(q) => updateQty(item.variant_id, q)}
                                            min={1}
                                        />
                                        <span className="font-semibold text-[var(--color-charcoal)]">
                                            {fmt(item.line_total)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeItem(item.variant_id)}
                                    aria-label="Remove item"
                                    className="p-1.5 text-stone-400 hover:text-red-500 transition self-start"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4 sticky top-20">
                            <h2 className="font-semibold text-[var(--color-charcoal)]">Order Summary</h2>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-stone-500">Subtotal</span>
                                    <span>{fmt(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-500">VAT (5%)</span>
                                    <span>{fmt(vat)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-500">Shipping</span>
                                    <span className="text-[var(--color-zellige)] font-medium">Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t flex justify-between font-bold text-[var(--color-charcoal)]">
                                <span>Total</span>
                                <span>{fmt(total)}</span>
                            </div>

                            <Link
                                href="/checkout"
                                className="flex items-center justify-center w-full py-3 rounded-xl
                                           bg-[var(--color-imperial)] text-white font-semibold text-sm
                                           hover:bg-[var(--color-imperial)]/90 transition"
                            >
                                {t('checkout')}
                            </Link>

                            <Link
                                href="/shop"
                                className="flex items-center justify-center w-full py-2.5 text-sm
                                           text-stone-500 hover:text-stone-700 transition"
                            >
                                ← {t('continueShopping')}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
