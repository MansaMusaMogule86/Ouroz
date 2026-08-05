import catalogData from './danatAlJazeeraCatalog.generated.json';

export type DanatPriceStatus = 'pending_supplier_confirmation';

export interface DanatVariant {
  id: string;
  pack_size: string | null;
  carton_quantity: string | null;
  moq: number | null;
  price_status: DanatPriceStatus;
  source_document: string;
  source_page: string | null;
  source_reference: string;
}

export interface DanatProduct {
  id: string;
  slug: string;
  english_name: string | null;
  arabic_name: string | null;
  original_name: string | null;
  brand: string | null;
  product_group: string;
  product_category: string;
  supplier_slug: string;
  price_status: DanatPriceStatus;
  retail_availability_status: DanatPriceStatus;
  wholesale_availability_status: DanatPriceStatus;
  source_document: string;
  source_page: string | null;
  source_references: string[];
  manual_review_required: boolean;
  manual_review_reasons: string[];
  variants: DanatVariant[];
}

export interface DanatSupplier {
  name: string;
  slug: string;
  verification_status: 'verified_draft';
  description: string;
}

export interface DanatCatalogQuality {
  source_document: string;
  supplier: string;
  total_rows_imported: number;
  total_products: number;
  total_variants: number;
  manual_review_products: number;
  unmapped_group_products: number;
  missing_arabic_name_products: number;
  missing_english_name_products: number;
  missing_page_reference_products: number;
}

interface DanatCatalogData {
  supplier: DanatSupplier;
  product_groups: string[];
  quality: DanatCatalogQuality;
  products: DanatProduct[];
}

const data = catalogData as DanatCatalogData;

export const DANAT_SUPPLIER = data.supplier;
export const DANAT_PRODUCT_GROUPS = data.product_groups;
export const DANAT_QUALITY = data.quality;
export const DANAT_PRODUCTS = data.products;

export function getDanatProductsByGroup(group: string): DanatProduct[] {
  return DANAT_PRODUCTS.filter((product) => product.product_group === group);
}

export function getDanatGroupPlaceholder(group: string): string {
  const slug = group
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `/images/catalog/danat-al-jazeera/groups/${slug}.svg`;
}

export function buildDanatSupplierActions() {
  const email = 'catalog@ouroz.local';
  return {
    quoteRequestHref: `mailto:${email}?subject=Quote%20Request%20-%20Danat%20Al%20Jazeera`,
    sampleRequestHref: `mailto:${email}?subject=Sample%20Request%20-%20Danat%20Al%20Jazeera`,
    supplierContactHref: `mailto:${email}?subject=Supplier%20Contact%20-%20Danat%20Al%20Jazeera`,
  };
}
