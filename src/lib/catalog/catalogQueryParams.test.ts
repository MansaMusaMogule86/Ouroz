import { describe, expect, it } from 'vitest';

import { parseCatalogQueryParams } from '@/lib/catalog/catalogQueryParams';

describe('catalogQueryParams', () => {
  it('parses valid query values', () => {
    const parsed = parseCatalogQueryParams({
      q: 'tagine',
      category: 'kitchen-accessories',
      supplier: 'atlas-souk',
      stock: 'in-stock',
      featured: 'only',
      sort: 'price-asc',
      page: '2',
      perPage: '12',
    });

    expect(parsed.q).toBe('tagine');
    expect(parsed.category).toBe('kitchen-accessories');
    expect(parsed.supplier).toBe('atlas-souk');
    expect(parsed.stock).toBe('in-stock');
    expect(parsed.featured).toBe('only');
    expect(parsed.sort).toBe('price-asc');
    expect(parsed.page).toBe(2);
    expect(parsed.perPage).toBe(12);
  });

  it('returns safe defaults for malformed values', () => {
    const parsed = parseCatalogQueryParams({
      stock: 'invalid',
      page: '0',
      perPage: '9999',
      sort: 'abc',
    });

    expect(parsed.stock).toBe('all');
    expect(parsed.sort).toBe('featured');
    expect(parsed.page).toBe(1);
    expect(parsed.perPage).toBe(24);
  });

  it('normalizes min/max price order', () => {
    const parsed = parseCatalogQueryParams({ minPrice: '150', maxPrice: '50' });

    expect(parsed.minPrice).toBe(50);
    expect(parsed.maxPrice).toBe(150);
  });
});
