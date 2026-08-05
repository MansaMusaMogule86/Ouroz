import Link from 'next/link';
import Image from 'next/image';
import {
  DANAT_PRODUCTS,
  DANAT_PRODUCT_GROUPS,
  DANAT_QUALITY,
  DANAT_SUPPLIER,
  buildDanatSupplierActions,
  getDanatGroupPlaceholder,
} from '@/lib/catalog/danatAlJazeeraCatalog';

export const metadata = {
  title: 'Danat Al Jazeera | OUROZ Supplier Draft',
  description: 'Verified draft wholesale supplier catalog imported from danat-al-jazeera-catalog.',
};

export default function DanatAlJazeeraSupplierPage() {
  const actions = buildDanatSupplierActions();
  const highlightedGroups = DANAT_PRODUCT_GROUPS.filter((group) => group !== 'UNMAPPED_MANUAL_REVIEW');

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border overflow-hidden" style={{ borderColor: 'rgba(42,32,22,0.12)', background: 'rgba(253,248,240,0.7)' }}>
        <div className="relative w-full h-52 md:h-72">
          <Image
            src="/images/catalog/danat-al-jazeera/supplier/banner.svg"
            alt="Danat Al Jazeera banner placeholder"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="p-5 md:p-8 grid grid-cols-1 md:grid-cols-[auto,1fr,auto] gap-4 items-start">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(42,32,22,0.16)' }}>
            <Image
              src="/images/catalog/danat-al-jazeera/supplier/avatar.svg"
              alt="Danat Al Jazeera avatar placeholder"
              fill
              sizes="80px"
              className="object-cover"
              unoptimized
            />
          </div>

          <div>
            <h1 className="font-heading text-4xl" style={{ color: 'var(--color-charcoal)' }}>
              {DANAT_SUPPLIER.name}
            </h1>
            <p className="text-sm mt-2 max-w-3xl" style={{ color: 'var(--color-charcoal)', opacity: 0.72 }}>
              {DANAT_SUPPLIER.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full border" style={{ borderColor: 'rgba(42,32,22,0.18)' }}>Status: {DANAT_SUPPLIER.verification_status}</span>
              <span className="px-3 py-1 rounded-full border" style={{ borderColor: 'rgba(139,26,74,0.26)', color: 'var(--color-imperial)' }}>
                Source: danat-al-jazeera-catalog
              </span>
            </div>
          </div>

          <div className="text-sm" style={{ color: 'var(--color-charcoal)', opacity: 0.7 }}>
            <p>Products: {DANAT_QUALITY.total_products}</p>
            <p>Variants: {DANAT_QUALITY.total_variants}</p>
            <p>Manual Review: {DANAT_QUALITY.manual_review_products}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border p-4 md:p-6" style={{ borderColor: 'rgba(42,32,22,0.12)', background: 'rgba(255,255,255,0.65)' }}>
        <div className="flex flex-wrap gap-3">
          <a href={actions.quoteRequestHref} className="rounded-xl px-4 py-2 text-sm" style={{ background: 'var(--color-charcoal)', color: 'var(--color-cream)' }}>
            Quote Request
          </a>
          <a href={actions.sampleRequestHref} className="rounded-xl px-4 py-2 text-sm border" style={{ borderColor: 'rgba(42,32,22,0.2)' }}>
            Sample Request
          </a>
          <a href={actions.supplierContactHref} className="rounded-xl px-4 py-2 text-sm border" style={{ borderColor: 'rgba(42,32,22,0.2)' }}>
            Supplier Contact
          </a>
          <Link href="/wholesale/catalog" className="rounded-xl px-4 py-2 text-sm border" style={{ borderColor: 'rgba(42,32,22,0.2)' }}>
            Open Wholesale Catalog
          </Link>
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl mb-4" style={{ color: 'var(--color-charcoal)' }}>
          Product Groups
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {highlightedGroups.map((group) => {
            const count = DANAT_PRODUCTS.filter((product) => product.product_group === group).length;
            return (
              <article key={group} className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(42,32,22,0.12)', background: 'rgba(255,255,255,0.8)' }}>
                <div className="relative w-full h-36">
                  <Image
                    src={getDanatGroupPlaceholder(group)}
                    alt={`${group} placeholder`}
                    fill
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-lg" style={{ color: 'var(--color-charcoal)' }}>{group}</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-charcoal)', opacity: 0.65 }}>{count} products</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
