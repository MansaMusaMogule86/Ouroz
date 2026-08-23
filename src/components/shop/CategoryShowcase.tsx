/**
 * CategoryShowcase — "Explore by Category" section.
 * Horizontal scroll of light portrait cards matching OUROZ reference design:
 * food photo fills upper portion, category label at bottom in dark serif.
 */
'use client';

import Link from 'next/link';

const CATEGORIES = [
  { label: 'Tea',                 slug: 'tea',                 image: '/images/categories/tea-coffee.jpg',        href: '/shop?q=tea' },
  { label: 'Coffee',              slug: 'coffee',              image: '/images/categories/tea-coffee.jpg',        href: '/shop?q=coffee' },
  { label: 'Couscous',            slug: 'couscous',            image: '/images/categories/pantry.jpg',            href: '/shop?q=couscous' },
  { label: 'Pasta',               slug: 'pasta',               image: '/images/categories/pantry.jpg',            href: '/shop?q=pasta' },
  { label: 'Olives',              slug: 'olives',              image: '/images/categories/olives.jpg',            href: '/shop?q=olives' },
  { label: 'Pickles',             slug: 'pickles',             image: '/images/categories/olives.jpg',            href: '/shop?q=pickles' },
  { label: 'Sauces',              slug: 'sauces',              image: '/images/categories/pantry.jpg',            href: '/shop?q=sauces' },
  { label: 'Pantry Goods',        slug: 'pantry-goods',        image: '/images/categories/pantry.jpg',            href: '/shop?category=groceries' },
  { label: 'Dessert Mixes',       slug: 'dessert-mixes',       image: '/images/categories/pantry.jpg',            href: '/shop?q=alsa' },
  { label: 'Moroccan Cookware',   slug: 'moroccan-cookware',   image: '/images/categories/ceramics.jpg',          href: '/shop?category=kitchen-accessories' },
  { label: 'Ceramics',            slug: 'ceramics',            image: '/images/categories/ceramics.jpg',          href: '/shop?q=ceramic' },
  { label: 'Kitchen Accessories', slug: 'kitchen-accessories', image: '/images/categories/ceramics.jpg',          href: '/shop?category=kitchen-accessories' },
  { label: 'Food & Beverage',     slug: 'food-beverage',       image: '/images/categories/pantry.jpg',            href: '/shop?category=groceries' },
];

export default function CategoryShowcase() {
  return (
    <section className="relative py-20 lg:py-28 bg-[var(--color-cream)]/10">

      {/* Heading */}
      <div className="text-center mb-14 px-6">
        <h2
          className="font-heading text-[var(--color-charcoal)] text-3xl lg:text-5xl mb-4"
          style={{ fontWeight: 300, letterSpacing: '0.02em' }}
        >
          Explore by Category
        </h2>
        <p
          className="font-body text-sm max-w-md mx-auto"
          style={{ color: 'rgba(42,32,22,0.48)', lineHeight: 1.8 }}
        >
          Discover authentic Moroccan provisions, pantry goods and artisan products.
        </p>
      </div>

      {/* Horizontal scroll strip */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-5 px-6 lg:px-14 pb-4" style={{ width: 'max-content' }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group flex-shrink-0 w-[145px] lg:w-[175px]"
            >
              <div
                className="rounded-2xl overflow-hidden relative transition-all duration-500 hover:shadow-lg"
                style={{
                  aspectRatio: '2.2 / 3.8', // Tall editorial card proportions
                  background: 'rgba(232,213,190,0.52)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.52)',
                }}
              >
                {/* Photo — fills top ~82% */}
                <div className="absolute inset-x-0 top-0" style={{ bottom: 52 }}>
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]"
                  />
                  {/* Gentle fade at bottom for label readability */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-12 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(232,213,190,0.5), transparent)' }}
                  />
                </div>

                {/* Label */}
                <div
                  className="absolute inset-x-0 bottom-0 h-[52px] flex items-center px-4"
                  style={{
                    background: 'rgba(253,248,240,0.92)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    borderTop: '1px solid rgba(255,255,255,0.7)',
                  }}
                >
                  <span
                    className="font-heading text-[var(--color-charcoal)] truncate block w-full"
                    style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.01em' }}
                  >
                    {cat.label}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Decorative tagline */}
      <p
        className="text-center font-body text-xs mt-12 px-6"
        style={{ color: 'rgba(42,32,22,0.35)', letterSpacing: '0.02em' }}
      >
        Directly connected to OUROZ B2B procurement and trade verification layers.
      </p>

    </section>
  );
}
