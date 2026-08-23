/**
 * ProductCard — Light glass card matching OUROZ reference design.
 * Cream/sandy background, centered product image (object-contain),
 * dark serif name + "Handcrafted in Morocco" + price below.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import type { ProductCard as ProductCardType } from '@/types/shop';
import { isInWishlist, toggleWishlist } from '@/lib/wishlist';
import { useCart } from '@/contexts/CartContext';

interface Props {
  product: ProductCardType;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [wishlisted, setWishlisted] = useState(() => isInWishlist(product.id));
  const pathname = usePathname();

  const isB2B = product.supplier_slug === 'danat-al-jazeera' || 
                product.price <= 0 || 
                pathname?.startsWith('/wholesale') || 
                pathname?.startsWith('/trade');

  const discount = !isB2B && product.compare_at_price && product.compare_at_price > product.price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : null;

  const imageUrl = product.thumbnail_url ?? product.image_url ?? '/images/catalog/atlas-souk/shared/empty-image.svg';
  const stockLabel = product.stock_status === 'low_stock'
    ? 'Low stock'
    : product.stock_status === 'out_of_stock' || !product.in_stock
      ? 'Out of stock'
      : 'In stock';

  return (
    <div className="group block">
      <div
        className="relative rounded-2xl overflow-hidden flex flex-col aspect-[3/4]"
        style={{
          background: 'rgba(253, 248, 240, 0.68)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.55)',
          boxShadow: '0 4px 20px rgba(42, 32, 22, 0.08)',
        }}
      >
        {/* Image — upper ~62% */}
        <div className="flex-1 relative flex items-center justify-center px-5 pt-5 pb-2 min-h-0">
          <Link href={`/product/${product.slug}`} className="absolute inset-0" aria-label={`View ${product.name}`} />

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setWishlisted(toggleWishlist(product.id));
            }}
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className="absolute left-3 top-3 z-10 rounded-full border px-2 py-1 text-xs"
            style={{
              borderColor: 'rgba(42,32,22,0.2)',
              background: 'rgba(253,248,240,0.9)',
              color: wishlisted ? 'var(--color-imperial)' : 'var(--color-charcoal)',
            }}
          >
            {wishlisted ? '♥' : '♡'}
          </button>

          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-contain transition-transform duration-700 group-hover:scale-[1.04]"
              style={{ filter: 'drop-shadow(0 8px 18px rgba(42,32,22,0.14))' }}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl" style={{ opacity: 0.12 }}>🫙</span>
            </div>
          )}

          {/* Discount badge */}
          {discount !== null && (
            <span
              className="absolute top-3 right-3 text-[9px] font-bold font-body px-2.5 py-1 rounded-full text-white"
              style={{ background: 'var(--color-terracotta)' }}
            >
              −{discount}%
            </span>
          )}

          {/* Out-of-stock overlay */}
          {!product.in_stock && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-xl"
              style={{ background: 'rgba(253,248,240,0.72)' }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.18em] font-body"
                style={{ color: 'rgba(42,32,22,0.38)' }}
              >
                Out of stock
              </span>
            </div>
          )}
        </div>

        {/* Info — bottom ~38% */}
        <div
          className="px-4 pb-4 pt-3 shrink-0"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.65)',
            background: 'rgba(253,248,240,0.82)',
          }}
        >
          {product.is_featured && (
            <p className="text-[9px] uppercase tracking-[0.16em] mb-1" style={{ color: 'var(--color-imperial)' }}>
              Featured
            </p>
          )}
          <p
            className="font-heading text-[var(--color-charcoal)] leading-snug line-clamp-1 mb-0.5"
            style={{ fontSize: 15, fontWeight: 500 }}
          >
            {product.name}
          </p>
          <p
            className="font-body mb-2"
            style={{ fontSize: 10, color: 'rgba(42,32,22,0.38)', letterSpacing: '0.02em' }}
          >
            {(product.supplier_name ?? 'Atlas Souk')} • {(product.category_name ?? 'Moroccan Collection')}
          </p>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {isB2B ? (
              <span className="font-body font-bold text-xs uppercase tracking-wider text-[var(--color-gold-muted)]">
                Request Price
              </span>
            ) : (
              <>
                <span
                  className="font-body font-bold"
                  style={{ fontSize: 15, color: 'var(--color-charcoal)' }}
                >
                  {product.price.toFixed(0)}
                </span>
                <span
                  className="font-body"
                  style={{ fontSize: 11, color: 'rgba(42,32,22,0.45)' }}
                >
                  {product.currency ?? 'AED'}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span
                    className="font-body line-through"
                    style={{ fontSize: 11, color: 'rgba(42,32,22,0.28)' }}
                  >
                    {product.compare_at_price.toFixed(0)}
                  </span>
                )}
              </>
            )}
          </div>
          <p className="text-[10px] mt-2" style={{ color: 'rgba(42,32,22,0.45)' }}>
            {stockLabel}
          </p>
          {isB2B ? (
            <Link
              href={`/trade/rfq/new?product=${encodeURIComponent(product.name)}`}
              className="mt-2 w-full rounded-lg px-3 py-1.5 text-xs font-semibold text-center block transition-all duration-300"
              style={{
                background: 'var(--color-gold-muted)',
                color: 'var(--color-cream)',
              }}
            >
              Request Quote
            </Link>
          ) : (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image_url: imageUrl,
                  slug: product.slug,
                });
              }}
              disabled={!product.in_stock}
              className="mt-2 w-full rounded-lg px-3 py-1.5 text-xs font-semibold"
              style={{
                background: product.in_stock ? 'var(--color-charcoal)' : 'rgba(42,32,22,0.1)',
                color: product.in_stock ? 'var(--color-cream)' : 'rgba(42,32,22,0.4)',
              }}
            >
              {product.in_stock ? 'Quick Add' : 'Unavailable'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
