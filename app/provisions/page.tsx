'use client';

import { useState, type ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Authentic Moroccan Provisions — premium landing                    */
/* ------------------------------------------------------------------ */

type Category = {
    id: string;
    label: string;
    title: string;
    chipText: string;
    icon: ReactNode;
    chipIcon: ReactNode;
    gradient: string;
    glow: string;
};

const CATEGORIES: Category[] = [
    {
        id: 'olives',
        label: '01 — Pantry',
        title: 'Olives & Moroccan Products',
        chipText: '24 producers',
        gradient: 'linear-gradient(150deg, #F2E7D5 0%, #E8D8BE 50%, #DCC8A6 100%)',
        glow: 'radial-gradient(circle at 30% 20%, rgba(255,247,232,0.85), transparent 55%)',
        icon: (
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
                <ellipse cx="32" cy="34" rx="13" ry="17" />
                <path d="M32 17c-1.5-4 1-7 4-8" />
                <path d="M22 30c2 1.5 5 1.5 7 0" />
            </svg>
        ),
        chipIcon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                <ellipse cx="8" cy="9" rx="4" ry="5" />
                <path d="M8 4c-.5-1.2.5-2 1.5-2.2" />
            </svg>
        ),
    },
    {
        id: 'tea',
        label: '02 — Infusions',
        title: 'Tea & Herbal Infusions',
        chipText: 'Atlas grown',
        gradient: 'linear-gradient(150deg, #EFE5D2 0%, #E2D2B6 50%, #CFBC9C 100%)',
        glow: 'radial-gradient(circle at 70% 25%, rgba(255,250,238,0.9), transparent 55%)',
        icon: (
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
                <path d="M18 26h22v12a10 10 0 0 1-10 10h-2A10 10 0 0 1 18 38z" />
                <path d="M40 30h4a5 5 0 0 1 0 10h-3" />
                <path d="M24 20c0-3 2-4 2-7M30 20c0-3 2-4 2-7M36 20c0-3 2-4 2-7" />
            </svg>
        ),
        chipIcon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <path d="M3 6h8v3a4 4 0 0 1-8 0z" />
                <path d="M11 7h1.5a1.5 1.5 0 0 1 0 3H11" />
            </svg>
        ),
    },
    {
        id: 'coffee',
        label: '03 — Awakening',
        title: 'Coffee & Sugar',
        chipText: 'Slow roast',
        gradient: 'linear-gradient(150deg, #ECDFC9 0%, #DCC9AA 50%, #C5AE8C 100%)',
        glow: 'radial-gradient(circle at 50% 20%, rgba(255,246,230,0.85), transparent 55%)',
        icon: (
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
                <path d="M16 24h28v14a14 14 0 0 1-14 14h0a14 14 0 0 1-14-14z" />
                <path d="M44 28h4a6 6 0 0 1 0 12h-3" />
                <path d="M26 16c0-3 2-4 2-6M34 16c0-3 2-4 2-6" />
            </svg>
        ),
        chipIcon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <path d="M3 6h8v4a4 4 0 0 1-8 0z" />
                <path d="M5 4c0-1 .8-1.3.8-2.3M8 4c0-1 .8-1.3.8-2.3" />
            </svg>
        ),
    },
];

export default function ProvisionsPage() {
    return (
        <main
            className="relative min-h-screen overflow-hidden font-light antialiased"
            style={{
                background:
                    'linear-gradient(180deg, #FBF6EC 0%, #F5EDDD 45%, #EFE4CE 100%)',
                color: '#3A3024',
            }}
        >
            {/* Top luminous wash */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 0%, rgba(255,250,236,0.9) 0%, transparent 65%)',
                }}
            />

            {/* Bottom warm wash */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[40vh]"
                style={{
                    background:
                        'linear-gradient(180deg, transparent 0%, rgba(213,189,153,0.18) 100%)',
                }}
            />

            {/* Soft vignette */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at center, transparent 55%, rgba(120,90,55,0.12) 100%)',
                }}
            />

            {/* Subtle paper grain */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0 0.13  0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                }}
            />

            {/* ---------------- NAV ---------------- */}
            <header className="relative z-10 flex items-center justify-between px-8 md:px-16 lg:px-24 pt-8">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-white/40 ring-1 ring-[#3A3024]/10">
                        <img
                            src="/logo/logo.png"
                            alt="OUROZ"
                            className="h-[82%] w-[82%] object-contain"
                            draggable={false}
                        />
                    </div>
                    <span
                        className="text-[0.65rem] uppercase tracking-[0.42em] text-[#3A3024]/70"
                        style={{ fontWeight: 500 }}
                    >
                        Ouroz · Maison
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-10 text-[0.7rem] uppercase tracking-[0.34em] text-[#3A3024]/60">
                    <a className="hover:text-[#3A3024] transition-colors" href="#collections">Collections</a>
                    <a className="hover:text-[#3A3024] transition-colors" href="#story">Atelier</a>
                    <a className="hover:text-[#3A3024] transition-colors" href="#journal">Journal</a>
                </nav>

                <button
                    className="text-[0.7rem] uppercase tracking-[0.34em] px-5 py-3 rounded-full border border-[#3A3024]/15 bg-white/30 backdrop-blur-md text-[#3A3024]/80 hover:bg-white/50 transition-all"
                    style={{ fontWeight: 500 }}
                >
                    Maison Login
                </button>
            </header>

            {/* ---------------- HERO ---------------- */}
            <section className="relative z-10 px-6 md:px-16 lg:px-24 pt-28 pb-40 md:pt-36 md:pb-48">
                {/* Right-side faded motif */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute right-[-8%] top-[6%] w-[55vw] max-w-[720px] aspect-square opacity-[0.07]"
                    style={{
                        background:
                            'radial-gradient(circle at center, rgba(143,108,67,0.45) 0%, transparent 65%)',
                    }}
                >
                    <MoroccanMotif />
                </div>

                <div className="relative mx-auto max-w-4xl text-center">
                    <p
                        className="text-[0.65rem] uppercase text-[#7A6240]"
                        style={{ letterSpacing: '0.55em', fontWeight: 500 }}
                    >
                        — Atlas to Atelier —
                    </p>

                    <h1
                        className="mt-10 text-[#2A2218] leading-[1.02] tracking-[-0.015em]"
                        style={{
                            fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
                            fontWeight: 400,
                            fontSize: 'clamp(2.6rem, 6.4vw, 5.6rem)',
                        }}
                    >
                        Authentic Moroccan
                        <br />
                        <em
                            className="not-italic"
                            style={{
                                fontStyle: 'italic',
                                fontWeight: 300,
                                color: '#8F6C43',
                            }}
                        >
                            Provisions
                        </em>
                    </h1>

                    <p
                        className="mx-auto mt-10 max-w-xl text-[#5A4A33]/75"
                        style={{
                            fontSize: '1.02rem',
                            lineHeight: 1.85,
                            letterSpacing: '0.01em',
                            fontWeight: 300,
                        }}
                    >
                        Sourced directly from cooperatives and producers across the Atlas —
                        each provision carries the patience of stone mills, slow harvests, and
                        hands that have practiced their craft for generations.
                    </p>

                    <div className="mt-14 flex items-center justify-center gap-5">
                        <a
                            href="#collections"
                            className="group relative inline-flex items-center gap-3 rounded-full px-8 py-4 text-[0.7rem] uppercase tracking-[0.34em] text-[#FBF6EC] transition-all hover:-translate-y-[1px]"
                            style={{
                                background:
                                    'linear-gradient(135deg, #6B5436 0%, #4A3A23 100%)',
                                boxShadow:
                                    '0 18px 40px -18px rgba(74,58,35,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
                                fontWeight: 500,
                            }}
                        >
                            Browse Collections
                            <span className="transition-transform group-hover:translate-x-0.5">→</span>
                        </a>

                        <a
                            href="#story"
                            className="text-[0.7rem] uppercase tracking-[0.34em] text-[#3A3024]/70 hover:text-[#3A3024] transition-colors px-2"
                            style={{ fontWeight: 500 }}
                        >
                            Our atelier
                        </a>
                    </div>

                    {/* delicate ornamental rule */}
                    <div className="mt-20 flex items-center justify-center gap-4">
                        <span className="h-px w-16 bg-[#3A3024]/15" />
                        <span
                            className="text-[#8F6C43]/70"
                            style={{
                                fontFamily: '"Playfair Display", serif',
                                fontWeight: 300,
                                fontSize: '1rem',
                                lineHeight: 1,
                            }}
                        >
                            ✻
                        </span>
                        <span className="h-px w-16 bg-[#3A3024]/15" />
                    </div>
                </div>
            </section>

            {/* ---------------- COLLECTIONS ---------------- */}
            <section
                id="collections"
                className="relative z-10 px-6 md:px-16 lg:px-24 pb-40"
            >
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
                        <div>
                            <p
                                className="text-[0.62rem] uppercase text-[#8F6C43]"
                                style={{ letterSpacing: '0.5em', fontWeight: 500 }}
                            >
                                — Curated —
                            </p>
                            <h2
                                className="mt-5 text-[#2A2218] leading-[1.05] tracking-[-0.01em]"
                                style={{
                                    fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
                                    fontWeight: 400,
                                    fontSize: 'clamp(2rem, 4.4vw, 3.4rem)',
                                }}
                            >
                                Browse by collection
                            </h2>
                        </div>

                        <p
                            className="max-w-sm text-[#5A4A33]/70"
                            style={{
                                fontSize: '0.92rem',
                                lineHeight: 1.85,
                                fontWeight: 300,
                            }}
                        >
                            Three living archives, each gathered from a different rhythm of
                            the Moroccan year.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-9">
                        {CATEGORIES.map((c) => (
                            <CategoryCard key={c.id} category={c} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------------- FOOTER WHISPER ---------------- */}
            <footer className="relative z-10 px-6 md:px-16 lg:px-24 pb-16 pt-10 border-t border-[#3A3024]/8">
                <div className="mx-auto max-w-7xl flex items-center justify-between flex-wrap gap-6">
                    <p
                        className="text-[0.6rem] uppercase text-[#3A3024]/55"
                        style={{ letterSpacing: '0.45em', fontWeight: 500 }}
                    >
                        © Ouroz Maison — Marrakech
                    </p>
                    <p
                        className="text-[0.6rem] uppercase text-[#3A3024]/45"
                        style={{ letterSpacing: '0.4em', fontWeight: 500 }}
                    >
                        Sourced with patience
                    </p>
                </div>
            </footer>
        </main>
    );
}

/* ------------------------------------------------------------------ */
/*  Category card                                                       */
/* ------------------------------------------------------------------ */

function CategoryCard({ category }: { category: Category }) {
    const [hover, setHover] = useState(false);

    return (
        <article
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="group relative cursor-pointer rounded-[28px] overflow-hidden transition-all duration-700 ease-out"
            style={{
                background: category.gradient,
                transform: hover ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: hover
                    ? '0 30px 60px -28px rgba(74,58,35,0.35), 0 6px 18px -10px rgba(74,58,35,0.18), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -22px 30px -28px rgba(74,58,35,0.45)'
                    : '0 18px 40px -24px rgba(74,58,35,0.28), 0 4px 12px -8px rgba(74,58,35,0.14), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -22px 30px -28px rgba(74,58,35,0.45)',
                filter: hover ? 'brightness(1.05) saturate(1.05)' : 'brightness(1) saturate(1)',
            }}
        >
            {/* glass overlay */}
            <div
                aria-hidden
                className="absolute inset-0 backdrop-blur-[2px]"
                style={{
                    background:
                        'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 45%, transparent 100%)',
                }}
            />

            {/* highlight glow */}
            <div
                aria-hidden
                className="absolute inset-0 transition-opacity duration-700"
                style={{
                    background: category.glow,
                    opacity: hover ? 1 : 0.75,
                }}
            />

            {/* hairline border */}
            <div
                aria-hidden
                className="absolute inset-0 rounded-[28px] pointer-events-none"
                style={{
                    boxShadow:
                        'inset 0 0 0 1px rgba(255,255,255,0.55), inset 0 0 0 2px rgba(143,108,67,0.06)',
                }}
            />

            <div className="relative flex flex-col items-center px-8 pt-14 pb-8 min-h-[440px]">
                {/* eyebrow */}
                <p
                    className="text-[0.58rem] uppercase text-[#5A4A33]/55"
                    style={{ letterSpacing: '0.5em', fontWeight: 500 }}
                >
                    {category.label}
                </p>

                {/* icon halo */}
                <div className="relative mt-12 flex items-center justify-center">
                    <div
                        aria-hidden
                        className="absolute inset-0 -m-10 rounded-full blur-2xl transition-opacity duration-700"
                        style={{
                            background:
                                'radial-gradient(circle, rgba(255,250,236,0.85) 0%, transparent 65%)',
                            opacity: hover ? 0.95 : 0.7,
                        }}
                    />
                    <div
                        className="relative h-24 w-24 text-[#8F6C43]/85 transition-transform duration-700"
                        style={{
                            transform: hover ? 'scale(1.04)' : 'scale(1)',
                            filter: 'drop-shadow(0 6px 12px rgba(74,58,35,0.18))',
                        }}
                    >
                        {/* slightly blurred soft icon */}
                        <div
                            className="absolute inset-0 blur-[2.5px] opacity-70"
                            style={{ color: 'inherit' }}
                        >
                            {category.icon}
                        </div>
                        <div className="relative">{category.icon}</div>
                    </div>
                </div>

                {/* title */}
                <h3
                    className="mt-12 text-center text-[#2A2218] leading-[1.15]"
                    style={{
                        fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
                        fontWeight: 400,
                        fontSize: '1.5rem',
                        letterSpacing: '-0.005em',
                    }}
                >
                    {category.title}
                </h3>

                <div className="flex-1" />

                {/* pill */}
                <div
                    className="mt-10 inline-flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-500"
                    style={{
                        background: 'rgba(255,255,255,0.45)',
                        border: '1px solid rgba(143,108,67,0.18)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: hover
                            ? '0 6px 14px -8px rgba(74,58,35,0.25)'
                            : '0 3px 8px -6px rgba(74,58,35,0.18)',
                    }}
                >
                    <span className="h-3 w-3 text-[#8F6C43]/80">{category.chipIcon}</span>
                    <span
                        className="text-[0.6rem] uppercase text-[#5A4A33]/75"
                        style={{ letterSpacing: '0.35em', fontWeight: 500 }}
                    >
                        {category.chipText}
                    </span>
                </div>
            </div>
        </article>
    );
}

/* ------------------------------------------------------------------ */
/*  Decorative Moroccan motif (zellige-inspired star)                   */
/* ------------------------------------------------------------------ */

function MoroccanMotif() {
    return (
        <svg
            viewBox="0 0 400 400"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            className="h-full w-full text-[#8F6C43]"
            aria-hidden
        >
            <g transform="translate(200 200)">
                {Array.from({ length: 16 }).map((_, i) => (
                    <g key={i} transform={`rotate(${(360 / 16) * i})`}>
                        <path d="M0 0 L 0 -180 L 22 -150 L 0 -120 L -22 -150 Z" />
                        <path d="M0 -90 L 14 -70 L 0 -50 L -14 -70 Z" />
                    </g>
                ))}
                <circle r="40" />
                <circle r="60" />
                <circle r="120" />
                <circle r="170" />
            </g>
        </svg>
    );
}
