import Link from 'next/link';

const NAV_LINKS = [
  { href: '/shop', label: 'SHOP' },
  { href: '/suppliers', label: 'SUPPLIERS' },
  { href: '/journal', label: 'JOURNAL' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
];

export default function OurozHeader() {
  return (
    <header className="w-full z-[60] py-6 px-8 lg:px-16">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Logo with ⵣ symbol */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-7 h-7 rounded-full border border-[var(--color-charcoal)]/20 flex items-center justify-center overflow-hidden bg-transparent">
            <span className="text-xs font-serif text-[var(--color-charcoal)]">ⵣ</span>
          </div>
          <span
            className="text-[14px] font-heading tracking-[0.28em] uppercase text-[var(--color-charcoal)]"
            style={{ fontWeight: 600 }}
          >
            OUROZ
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 sm:gap-10">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] sm:text-[11px] font-body uppercase tracking-[0.22em] text-[var(--color-charcoal)]/60 hover:text-[var(--color-charcoal)] transition-colors duration-300 font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
