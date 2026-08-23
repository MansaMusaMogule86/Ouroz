/**
 * OUROZ – Homepage
 * Clean luxury Moroccan provisions layout:
 *   1. Unified Hero — Centered ⵣ + OUROZ wordmark + tagline + description + CTAs
 *   2. Categories   — Horizontal scroll of real B2B category cards
 *   3. Featured     — Real imported catalog products (with "Request Price")
 *   4. Footer
 */

import Link from 'next/link';
import OurozHeader from '@/components/shared/OurozHeader';
import OurozBackground from '@/components/shared/OurozBackground';
import CategoryShowcase from '@/components/shop/CategoryShowcase';
import { getProductCards } from '@/lib/shop-queries';
import type { ProductCard as ProductCardType } from '@/types/shop';

/* ── Reusable light glass card used in featured strip ── */
function LightCard({
  image, name, subtitle, price, compare, href,
}: {
  image: string; name: string; subtitle?: string;
  price: number; compare?: number; href: string;
}) {
  const isRequestPrice = price <= 0;
  return (
    <Link href={href} className="group block flex-shrink-0">
      <div
        className="rounded-2xl overflow-hidden flex flex-col aspect-[3/4] transition-all duration-300 hover:translate-y-[-4px]"
        style={{
          background: 'rgba(253,248,240,0.68)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.55)',
          boxShadow: '0 4px 20px rgba(42,32,22,0.06)',
        }}
      >
        {/* Image — flex-1 so it takes remaining space above the info panel */}
        <div className="flex-1 flex items-center justify-center px-5 pt-5 pb-2 min-h-0 relative">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ filter: 'drop-shadow(0 8px 18px rgba(42,32,22,0.13))' }}
          />
        </div>
        {/* Info */}
        <div
          className="px-4 pb-4 pt-3 shrink-0"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.65)',
            background: 'rgba(253,248,240,0.82)',
          }}
        >
          <p
            className="font-heading text-[var(--color-charcoal)] leading-snug line-clamp-1 mb-0.5"
            style={{ fontSize: 14, fontWeight: 500 }}
          >
            {name}
          </p>
          {subtitle && (
            <p
              className="font-body mb-1.5"
              style={{ fontSize: 10, color: 'rgba(42,32,22,0.38)', letterSpacing: '0.02em' }}
            >
              {subtitle}
            </p>
          )}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {isRequestPrice ? (
              <span className="font-body font-bold text-[11px] uppercase tracking-wider text-[var(--color-gold-muted)]">
                Request Price
              </span>
            ) : (
              <>
                <span className="font-body font-bold" style={{ fontSize: 14, color: 'var(--color-charcoal)' }}>
                  {price}
                </span>
                <span className="font-body" style={{ fontSize: 10, color: 'rgba(42,32,22,0.45)' }}>
                  AED
                </span>
                {compare && compare > price && (
                  <span className="font-body line-through" style={{ fontSize: 10, color: 'rgba(42,32,22,0.28)' }}>
                    {compare}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const { products: featuredProducts } = await getProductCards({ limit: 8 });

  return (
    <div className="relative min-h-screen bg-[var(--color-sahara)] overflow-hidden">

      {/* Decorative background layers */}
      <OurozBackground showArch={false} showWatermark showDunes={false} />

      {/* ═══════════════════════════════════════════════════════════════
          HERO — Exact recreation of brand-entry design
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 min-h-[90vh] flex flex-col justify-between">
        
        {/* Left vertical architectural crease / margin spine */}
        <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-12 border-r border-[var(--color-charcoal)]/[0.08] pointer-events-none z-20 hidden sm:flex">
          <div className="w-full h-full border-r border-[var(--color-charcoal)]/[0.04] bg-[var(--color-sahara-dark)]/10" />
        </div>

        {/* Top Header */}
        <OurozHeader />

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 max-w-4xl mx-auto w-full">
          
          {/* Luminous circular sun/halo with centered Amazigh ⵣ symbol */}
          <div className="relative mb-6 flex items-center justify-center">
            <div
              className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255, 252, 246, 0.98) 0%, rgba(248, 238, 222, 0.78) 50%, rgba(245, 230, 211, 0) 75%)',
                boxShadow: '0 0 70px rgba(212, 175, 55, 0.10)',
              }}
            >
              <img
                src="/logo/logo.png"
                alt="OUROZ"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain select-none"
                draggable={false}
                style={{ filter: 'drop-shadow(0 4px 12px rgba(42,32,22,0.12))' }}
              />
            </div>
          </div>

          {/* OUROZ wordmark */}
          <h1
            className="font-heading text-[var(--color-charcoal)] text-center leading-none tracking-tight mb-4"
            style={{ fontSize: 'clamp(3.8rem, 9.5vw, 6.8rem)', fontWeight: 700, letterSpacing: '-0.01em' }}
          >
            OUROZ
          </h1>

          {/* Tagline: MOROCCAN PROVISIONS FROM the ATLAS */}
          <p
            className="font-heading uppercase tracking-[0.26em] text-xs sm:text-[13px] font-semibold mb-10"
            style={{ color: '#B38E46' }}
          >
            MOROCCAN PROVISIONS FROM <span style={{ textTransform: 'lowercase', fontSize: '0.85em', letterSpacing: '0.12em' }}>the</span> ATLAS
          </p>

          {/* Pill Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
            <Link
              href="/shop"
              className="w-full sm:w-auto whitespace-nowrap py-3.5 px-9 bg-[#282019] text-[#F5E6D3] rounded-full text-center font-body font-semibold text-xs tracking-[0.08em] hover:bg-[#3d2e20] transition-all duration-300 shadow-md"
            >
              Explore Products
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto whitespace-nowrap py-3.5 px-9 border border-[#C9A84C]/50 bg-[#F5E6D3]/30 text-[#282019] rounded-full text-center font-body font-semibold text-xs tracking-[0.08em] hover:bg-[#F5E6D3]/80 hover:border-[#C9A84C] transition-all duration-300 shadow-sm"
            >
              Supplier Login
            </Link>
          </div>

        </div>

        {/* Bottom spacer */}
        <div className="h-6" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — Explore by Category
          Horizontal scroll of light portrait category cards
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10">
        <CategoryShowcase />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — Featured Products
          Real imported catalog products with "Request Price"
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-16 lg:py-24">

        {/* Heading */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-14 mb-10">
          <div className="text-center">
            <h2
              className="font-heading text-[var(--color-charcoal)] mb-3"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 300 }}
            >
              Featured Products
            </h2>
            <p
              className="font-body text-sm max-w-md mx-auto"
              style={{ color: 'rgba(42,32,22,0.42)', lineHeight: 1.75 }}
            >
              Moroccan provisions, pantry goods and artisan collections available for trade inquiry.
            </p>
          </div>
        </div>

        {/* Horizontal scroll */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-6 lg:px-14 pb-2" style={{ width: 'max-content' }}>
            {featuredProducts.map((p: ProductCardType) => (
              <div key={p.id} className="w-[180px] lg:w-[210px]">
                <LightCard
                  href={`/product/${p.slug}`}
                  image={p.thumbnail_url ?? p.image_url ?? '/images/placeholder-product.jpg'}
                  name={p.name}
                  subtitle={p.supplier_name ?? 'Danat Al Jazeera'}
                  price={p.price}
                  compare={p.compare_at_price ?? undefined}
                />
              </div>
            ))}
          </div>
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-block py-3 px-8 border border-[var(--color-charcoal)]/18 text-[var(--color-charcoal)] rounded-full font-body font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[var(--color-charcoal)] hover:text-[var(--color-sahara)] transition-all duration-400"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 bg-[var(--color-charcoal)] text-white/40 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center overflow-hidden bg-white/[0.04]">
                  <img src="/logo/logo.png" alt="OUROZ" className="w-[82%] h-[82%] object-contain" draggable={false} />
                </div>
                <span className="text-sm font-heading tracking-[0.3em] uppercase text-white/60" style={{ fontWeight: 400 }}>
                  OUROZ
                </span>
              </div>
              <p className="text-xs leading-relaxed text-white/25" style={{ lineHeight: 1.8 }}>
                Authentic Moroccan products, delivered to your door in the UAE.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">Shop</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/shop" className="hover:text-white/70 transition-colors">All Products</Link></li>
                <li><Link href="/wholesale/apply" className="hover:text-white/70 transition-colors">Wholesale</Link></li>
              </ul>
            </div>

            {/* Sell */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">Sell</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/suppliers" className="hover:text-white/70 transition-colors">Become a Supplier</Link></li>
                <li><Link href="/suppliers" className="hover:text-white/70 transition-colors">Supplier Directory</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">Account</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/auth/login" className="hover:text-white/70 transition-colors">Sign In</Link></li>
                <li><Link href="/about" className="hover:text-white/70 transition-colors">About</Link></li>
                <li><Link href="/journal" className="hover:text-white/70 transition-colors">Journal</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-6 text-center text-[10px] uppercase tracking-[0.2em] text-white/15">
            <p>&copy; {new Date().getFullYear()} OUROZ. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
