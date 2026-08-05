import { DANAT_QUALITY } from '@/lib/catalog/danatAlJazeeraCatalog';

export const metadata = {
  title: 'Wholesale Data Quality Report | OUROZ',
  description: 'Data quality summary for Danat Al Jazeera imported supplier catalog.',
};

const METRICS: Array<{ label: string; value: number }> = [
  { label: 'Total rows imported', value: DANAT_QUALITY.total_rows_imported },
  { label: 'Total products', value: DANAT_QUALITY.total_products },
  { label: 'Total variants', value: DANAT_QUALITY.total_variants },
  { label: 'Manual review products', value: DANAT_QUALITY.manual_review_products },
  { label: 'Unmapped group products', value: DANAT_QUALITY.unmapped_group_products },
  { label: 'Missing Arabic name products', value: DANAT_QUALITY.missing_arabic_name_products },
  { label: 'Missing English name products', value: DANAT_QUALITY.missing_english_name_products },
  { label: 'Missing page reference products', value: DANAT_QUALITY.missing_page_reference_products },
];

export default function WholesaleQualityReportPage() {
  return (
    <div className="space-y-8">
      <header className="rounded-3xl border p-6 md:p-8" style={{ borderColor: 'rgba(42,32,22,0.14)', background: 'rgba(255,255,255,0.72)' }}>
        <h1 className="font-heading text-4xl" style={{ color: 'var(--color-charcoal)' }}>
          Data Quality Report
        </h1>
        <p className="mt-2 text-sm md:text-base" style={{ color: 'var(--color-charcoal)', opacity: 0.72 }}>
          Supplier: {DANAT_QUALITY.supplier} • Source: {DANAT_QUALITY.source_document}
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {METRICS.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border p-4"
            style={{ borderColor: 'rgba(42,32,22,0.12)', background: 'rgba(255,255,255,0.86)' }}
          >
            <p className="text-xs" style={{ color: 'var(--color-charcoal)', opacity: 0.65 }}>{metric.label}</p>
            <p className="font-heading text-3xl mt-2" style={{ color: 'var(--color-charcoal)' }}>{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border p-4 md:p-6" style={{ borderColor: 'rgba(139,26,74,0.2)', background: 'rgba(255,249,242,0.8)' }}>
        <h2 className="font-heading text-2xl" style={{ color: 'var(--color-charcoal)' }}>Validation Notes</h2>
        <ul className="mt-3 text-sm space-y-2" style={{ color: 'var(--color-charcoal)', opacity: 0.78 }}>
          <li>All prices remain in pending status until supplier confirmation.</li>
          <li>No ingredients, allergens, certifications, country of origin, stock quantities, barcodes, or legal claims were fabricated.</li>
          <li>Source page fields are currently pending because the source PDF with explicit page mapping is unavailable in the workspace.</li>
          <li>Products flagged for manual review require reconciliation against source material before publication.</li>
        </ul>
      </section>
    </div>
  );
}
