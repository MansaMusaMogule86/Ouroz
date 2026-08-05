/**
 * ProductGallery — main image with thumbnail strip.
 * Halo lighting applied per design_standards.md Rule #2.
 */
'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProductImage } from '@/types/shop';

interface Props {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-3xl flex items-center justify-center"
           style={{ background: 'var(--color-sahara-dark)' }}>
        <span className="text-8xl opacity-10">🫙</span>
      </div>
    );
  }

  const active = images[activeIdx];

  return (
    <div className="space-y-3">

      {/* Main image */}
      <div className="relative aspect-square rounded-3xl overflow-hidden"
           style={{ background: 'var(--color-sahara-dark)' }}>
        <Image
          src={active.url}
          alt={active.alt ?? productName}
          fill
          priority={activeIdx === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          unoptimized
        />

        {/* Halo (design_standards.md Rule #2) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.18) 0%, transparent 55%)' }}
        />

        {/* Grain overlay (Rule #1) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-body text-white/50 uppercase tracking-widest"
               style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}>
            {activeIdx + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 ${
                i === activeIdx
                  ? 'ring-2 ring-offset-2 ring-offset-[var(--color-sahara)]'
                  : 'opacity-45 hover:opacity-70'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? ''}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
              {i === activeIdx && (
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ boxShadow: '0 0 0 2px var(--color-gold), 0 0 0 4px rgba(201,168,76,0.2)' }}
                />
              )}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
