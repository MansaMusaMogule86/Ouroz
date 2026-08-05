/**
 * ProductDetailClient — interactive product detail panel.
 * Handles variant selection, quantity, add-to-cart.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product, ProductVariant, LangCode } from '@/types/shop';
import { useCart } from '@/contexts/CartContext';
import { isInWishlist, toggleWishlist } from '@/lib/wishlist';

interface Props {
  product: Product;
  defaultVariant: ProductVariant | null;
  lang: LangCode;
}

const T = {
  addToCart:     { en: 'Add to Cart',    ar: 'أضف إلى السلة',  fr: 'Ajouter au panier'   },
  outOfStock:    { en: 'Out of Stock',   ar: 'غير متوفر',       fr: 'Rupture de stock'    },
  adding:        { en: 'Adding…',        ar: 'جارٍ الإضافة…',  fr: 'Ajout en cours…'     },
  origin:        { en: 'Origin',         ar: 'المنشأ',          fr: 'Origine'             },
  weight:        { en: 'Weight',         ar: 'الوزن',           fr: 'Poids'               },
  certifications:{ en: 'Certifications', ar: 'الشهادات',        fr: 'Certifications'      },
  sizeWeight:    { en: 'Size / Weight',  ar: 'الحجم / الوزن',  fr: 'Taille / Poids'      },
};

export default function ProductDetailClient({ product, defaultVariant, lang }: Props) {
  const { addItem, setIsOpen } = useCart();
  const [variant, setVariant]     = useState<ProductVariant | null>(defaultVariant);
  const [qty, setQty]             = useState(product.minimum_order_quantity ?? 1);
  const [adding, setAdding]       = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(isInWishlist(product.id));

  const price      = variant?.price      ?? product.price;
  const compareAt  = variant?.compare_at_price ?? product.compare_at_price;
  const inStock    = variant ? variant.in_stock : product.in_stock;
  const discount   = compareAt && compareAt > price
    ? Math.round((1 - price / compareAt) * 100)
    : null;

  async function handleAdd() {
    if (!inStock || adding) return;
    setAdding(true);

    addItem({
      id:        variant ? `${product.id}__${variant.id}` : product.id,
      name:      variant ? `${product.name} — ${variant.name}` : product.name,
      price,
      quantity:  qty,
      image_url: product.image_url,
    });

    setAdding(false);
    setJustAdded(true);
    setIsOpen(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="space-y-6 lg:space-y-8 py-2">

      {/* ── Breadcrumb / category ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {product.supplier && (
          <Link
            href={`/supplier/${product.supplier.slug}`}
            className="text-[10px] uppercase tracking-[0.18em] font-body transition-colors"
            style={{ color: 'var(--color-charcoal)', opacity: 0.35 }}
          >
            {product.supplier.name}
          </Link>
        )}
        {product.category && (
          <Link
            href={`/shop/${product.category.slug}`}
            className="text-[10px] uppercase tracking-[0.18em] font-body transition-colors"
            style={{ color: 'var(--color-charcoal)', opacity: 0.35 }}
          >
            {product.category.name}
          </Link>
        )}
        {product.badge && (
          <span
            className="text-[9px] uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full font-body border"
            style={{
              background: 'rgba(201,168,76,0.1)',
              color: 'var(--color-gold-muted)',
              borderColor: 'rgba(201,168,76,0.25)',
            }}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* ── Product name ── */}
      <div>
        <h1
          className="font-heading leading-tight mb-2"
          style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', fontWeight: 400, letterSpacing: '0.02em', color: 'var(--color-charcoal)' }}
        >
          {product.name}
        </h1>
        {product.short_description && (
          <p className="text-sm font-body leading-relaxed" style={{ color: 'var(--color-charcoal)', opacity: 0.45 }}>
            {product.short_description}
          </p>
        )}
      </div>

      {/* ── Price ── */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl font-bold font-body" style={{ color: 'var(--color-gold)' }}>
          {product.currency}&nbsp;{price.toFixed(2)}
        </span>
        {compareAt && compareAt > price && (
          <>
            <span className="text-xl font-body line-through" style={{ color: 'var(--color-charcoal)', opacity: 0.22 }}>
              {compareAt.toFixed(2)}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-body bg-emerald-500/10 text-emerald-700">
              Save {discount}%
            </span>
          </>
        )}
      </div>

      {/* ── Variants ── */}
      {product.variants.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.18em] font-body" style={{ color: 'var(--color-charcoal)', opacity: 0.38 }}>
            {T.sizeWeight[lang]}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map(v => (
              <button
                key={v.id}
                onClick={() => setVariant(v)}
                disabled={!v.in_stock}
                className={`px-4 py-2 rounded-xl text-sm font-body transition-all border ${
                  variant?.id === v.id
                    ? 'border-transparent'
                    : v.in_stock
                    ? 'hover:border-[var(--color-charcoal)]/30'
                    : 'opacity-30 cursor-not-allowed line-through'
                }`}
                style={variant?.id === v.id ? {
                  background: 'var(--color-charcoal)',
                  color: 'var(--color-sahara)',
                  borderColor: 'transparent',
                } : {
                  borderColor: 'rgba(42,32,22,0.15)',
                  color: 'var(--color-charcoal)',
                }}
              >
                {v.name}
                {v.price !== product.price && (
                  <span className="ml-1.5 text-[10px] opacity-50">
                    {product.currency} {v.price.toFixed(0)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Quantity + Add to cart ── */}
      <div className="flex items-stretch gap-3">

        {/* Qty stepper */}
        <div className="flex items-center rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(42,32,22,0.15)' }}>
          <button
            onClick={() => setQty(q => Math.max(product.minimum_order_quantity ?? 1, q - 1))}
            className="px-4 py-3.5 text-sm font-body transition-colors hover:bg-[var(--color-sahara-dark)]"
            style={{ color: 'var(--color-charcoal)', opacity: 0.45 }}
          >
            −
          </button>
          <span className="px-4 py-3.5 text-sm font-body text-center min-w-[2.75rem]" style={{ color: 'var(--color-charcoal)' }}>
            {qty}
          </span>
          <button
            onClick={() => setQty(q => q + 1)}
            className="px-4 py-3.5 text-sm font-body transition-colors hover:bg-[var(--color-sahara-dark)]"
            style={{ color: 'var(--color-charcoal)', opacity: 0.45 }}
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => setWishlisted(toggleWishlist(product.id))}
          className="px-4 rounded-xl border text-sm"
          style={{
            borderColor: 'rgba(42,32,22,0.15)',
            color: wishlisted ? 'var(--color-imperial)' : 'var(--color-charcoal)',
            background: 'rgba(255,255,255,0.6)',
          }}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          {wishlisted ? '♥ Saved' : '♡ Wishlist'}
        </button>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          disabled={!inStock || adding}
          className={`flex-1 py-3.5 rounded-xl text-[11px] font-body font-semibold uppercase tracking-[0.2em] transition-all duration-200 ${
            inStock && !adding && !justAdded ? 'active:scale-[0.99]' : ''
          }`}
          style={
            justAdded ? {
              background: 'var(--color-gold)',
              color: 'white',
            } : inStock ? {
              background: 'var(--color-charcoal)',
              color: 'var(--color-sahara)',
            } : {
              background: 'rgba(42,32,22,0.08)',
              color: 'rgba(42,32,22,0.3)',
              cursor: 'not-allowed',
            }
          }
        >
          {justAdded ? '✓ Added'
           : adding   ? T.adding[lang]
           : inStock  ? T.addToCart[lang]
           :            T.outOfStock[lang]}
        </button>

      </div>

      {/* ── Product meta ── */}
      <div className="pt-5 border-t space-y-2.5" style={{ borderColor: 'rgba(42,32,22,0.08)' }}>

        {typeof product.minimum_order_quantity === 'number' && (
          <MetaRow label="Min Qty">{product.minimum_order_quantity}</MetaRow>
        )}

        {product.origin && (
          <MetaRow label={T.origin[lang]}>
            {product.origin_region ? `${product.origin_region}, ` : ''}{product.origin}
          </MetaRow>
        )}

        {product.weight && (
          <MetaRow label={T.weight[lang]}>{product.weight}</MetaRow>
        )}

        {product.certifications && product.certifications.length > 0 && (
          <MetaRow label={T.certifications[lang]}>
            <div className="flex flex-wrap gap-1">
              {product.certifications.map(cert => (
                <span
                  key={cert}
                  className="text-[9px] px-2 py-0.5 rounded-full font-body border"
                  style={{ borderColor: 'rgba(42,32,22,0.1)', color: 'var(--color-charcoal)', opacity: 0.5 }}
                >
                  {cert}
                </span>
              ))}
            </div>
          </MetaRow>
        )}

      </div>

      {/* ── Description ── */}
      {product.description && (
        <div className="pt-5 border-t" style={{ borderColor: 'rgba(42,32,22,0.08)' }}>
          <p className="text-sm font-body leading-[1.85] whitespace-pre-line" style={{ color: 'var(--color-charcoal)', opacity: 0.52 }}>
            {product.description}
          </p>
        </div>
      )}

      {product.care_information && (
        <div className="pt-5 border-t" style={{ borderColor: 'rgba(42,32,22,0.08)' }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-charcoal)' }}>Care Information</h2>
          <p className="text-sm font-body leading-[1.8]" style={{ color: 'var(--color-charcoal)', opacity: 0.52 }}>
            {product.care_information}
          </p>
        </div>
      )}

      {product.storage_information && (
        <div className="pt-5 border-t" style={{ borderColor: 'rgba(42,32,22,0.08)' }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-charcoal)' }}>Storage Information</h2>
          <p className="text-sm font-body leading-[1.8]" style={{ color: 'var(--color-charcoal)', opacity: 0.52 }}>
            {product.storage_information}
          </p>
        </div>
      )}

      {product.shipping_information && (
        <div className="pt-5 border-t" style={{ borderColor: 'rgba(42,32,22,0.08)' }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-charcoal)' }}>Shipping & Returns</h2>
          <p className="text-sm font-body leading-[1.8]" style={{ color: 'var(--color-charcoal)', opacity: 0.52 }}>
            {product.shipping_information}
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--color-charcoal)', opacity: 0.45 }}>
            {product.return_eligible ? 'Return eligible under OUROZ return policy classification pending supplier verification.' : 'This product is currently marked as non-returnable.'}
          </p>
        </div>
      )}

      {product.requires_compliance_review && product.compliance_notes && (
        <div className="pt-5 border-t" style={{ borderColor: 'rgba(42,32,22,0.08)' }}>
          <div className="rounded-xl border p-3" style={{ borderColor: 'rgba(139,26,74,0.25)', background: 'rgba(139,26,74,0.05)' }}>
            <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-imperial)' }}>
              Compliance Review Placeholder
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-charcoal)', opacity: 0.62 }}>
              {product.compliance_notes}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 text-sm font-body">
      <span className="text-[9px] uppercase tracking-[0.18em] pt-0.5 w-24 shrink-0" style={{ color: 'var(--color-charcoal)', opacity: 0.32 }}>
        {label}
      </span>
      <span style={{ color: 'var(--color-charcoal)', opacity: 0.58 }}>{children}</span>
    </div>
  );
}
