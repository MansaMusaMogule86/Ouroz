import {
  DANAT_PRODUCTS,
  DANAT_PRODUCT_GROUPS,
  DANAT_QUALITY,
  DANAT_SUPPLIER,
} from '@/lib/catalog/danatAlJazeeraCatalog';

export const metadata = {
  title: 'Wholesale Catalog | Danat Al Jazeera | OUROZ',
  description: 'Wholesale draft catalog with source-trace fields and pending supplier confirmation statuses.',
};

function displayName(englishName: string | null, originalName: string | null): string {
  return englishName || originalName || 'Unnamed Product';
}

export default function WholesaleCatalogPage() {
  const grouped = DANAT_PRODUCT_GROUPS.map((group) => ({
    group,
    products: DANAT_PRODUCTS.filter((product) => product.product_group === group),
  })).filter((entry) => entry.products.length > 0);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border p-6 md:p-8" style={{ borderColor: 'rgba(42,32,22,0.14)', background: 'rgba(255,255,255,0.72)' }}>
        <h1 className="font-heading text-4xl" style={{ color: 'var(--color-charcoal)' }}>
          Wholesale Catalog Draft
        </h1>
        <p className="mt-2 text-sm md:text-base" style={{ color: 'var(--color-charcoal)', opacity: 0.72 }}>
          Supplier: {DANAT_SUPPLIER.name} • Source: {DANAT_QUALITY.source_document}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 rounded-full border" style={{ borderColor: 'rgba(42,32,22,0.18)' }}>Products: {DANAT_QUALITY.total_products}</span>
          <span className="px-3 py-1 rounded-full border" style={{ borderColor: 'rgba(42,32,22,0.18)' }}>Variants: {DANAT_QUALITY.total_variants}</span>
          <span className="px-3 py-1 rounded-full border" style={{ borderColor: 'rgba(139,26,74,0.28)', color: 'var(--color-imperial)' }}>
            Manual Review Flags: {DANAT_QUALITY.manual_review_products}
          </span>
        </div>
      </header>

      {grouped.map(({ group, products }) => (
        <section key={group} className="space-y-3">
          <h2 className="font-heading text-2xl" style={{ color: 'var(--color-charcoal)' }}>{group}</h2>
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-2xl border p-4 md:p-5"
                style={{ borderColor: 'rgba(42,32,22,0.12)', background: 'rgba(255,255,255,0.86)' }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-heading text-xl" style={{ color: 'var(--color-charcoal)' }}>
                      {displayName(product.english_name, product.original_name)}
                    </h3>
                    {product.arabic_name && (
                      <p className="text-sm" dir="rtl" style={{ color: 'var(--color-charcoal)', opacity: 0.8 }}>
                        {product.arabic_name}
                      </p>
                    )}
                    <p className="text-xs" style={{ color: 'var(--color-charcoal)', opacity: 0.68 }}>
                      Brand: {product.brand || 'not provided'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-charcoal)', opacity: 0.68 }}>
                      Price status: {product.price_status}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-charcoal)', opacity: 0.68 }}>
                      Retail availability: {product.retail_availability_status} • Wholesale availability: {product.wholesale_availability_status}
                    </p>
                  </div>

                  <div className="text-xs min-w-[260px] max-w-[380px] space-y-1" style={{ color: 'var(--color-charcoal)', opacity: 0.72 }}>
                    <p>Source document: {product.source_document}</p>
                    <p>Source page: {product.source_page || 'pending page mapping'}</p>
                    <p>Source references: {product.source_references.join(', ')}</p>
                    <p>Manual review: {product.manual_review_required ? 'required' : 'not required'}</p>
                    {product.manual_review_required && product.manual_review_reasons.length > 0 && (
                      <p>Review reasons: {product.manual_review_reasons.join(', ')}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="text-left" style={{ color: 'var(--color-charcoal)', opacity: 0.78 }}>
                        <th className="py-2 pr-3">Variant</th>
                        <th className="py-2 pr-3">Pack size</th>
                        <th className="py-2 pr-3">Carton quantity</th>
                        <th className="py-2 pr-3">MOQ</th>
                        <th className="py-2 pr-3">Price status</th>
                        <th className="py-2 pr-3">Source reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.map((variant) => (
                        <tr key={variant.id} className="border-t" style={{ borderColor: 'rgba(42,32,22,0.1)' }}>
                          <td className="py-2 pr-3">{variant.id}</td>
                          <td className="py-2 pr-3">{variant.pack_size || 'not provided'}</td>
                          <td className="py-2 pr-3">{variant.carton_quantity || 'not provided'}</td>
                          <td className="py-2 pr-3">{variant.moq ?? 'not provided'}</td>
                          <td className="py-2 pr-3">{variant.price_status}</td>
                          <td className="py-2 pr-3">{variant.source_reference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
