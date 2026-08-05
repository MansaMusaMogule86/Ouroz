import { describe, expect, it } from 'vitest';

import {
  BAB_PRODUCTS,
  productCountByCategory,
  getCatalogQualityWarnings,
} from '@/lib/catalog/atlasSoukCatalog';

describe('Atlas Souk Catalog', () => {
  it('contains exact product counts by category', () => {
    expect(productCountByCategory()).toEqual({
      'kitchen-accessories': 14,
      'skin-care': 17,
      groceries: 14,
      total: 45,
    });
  });

  it('has unique slugs and SKUs', () => {
    const slugs = BAB_PRODUCTS.map((product) => product.slug);
    const skus = BAB_PRODUCTS.map((product) => product.sku);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(skus).size).toBe(skus.length);
  });

  it('uses valid local placeholder paths', () => {
    for (const product of BAB_PRODUCTS) {
      expect(product.thumbnailPath.startsWith('/images/catalog/atlas-souk/')).toBe(true);
      expect(product.thumbnailPath.endsWith('.svg')).toBe(true);
      expect(product.imagePaths.length).toBeGreaterThan(0);
    }
  });

  it('flags expected compliance and quality warnings', () => {
    const warnings = getCatalogQualityWarnings();
    const whitening = warnings.find((item) => item.slug === 'whitening-cream');
    const generic = warnings.find((item) => item.slug === 'bio-products');

    expect(whitening?.warnings).toContain('Compliance review required');
    expect(generic?.warnings).toContain('Generic product name');
  });
});
