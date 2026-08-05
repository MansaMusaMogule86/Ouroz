import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { CartProvider } from '@/contexts/CartContext';
import ProductCard from '@/components/shop/ProductCard';

describe('ProductCard', () => {
  it('renders product metadata and quick add action', () => {
    render(
      <CartProvider>
        <ProductCard
          product={{
            id: '1',
            slug: 'ceramic-tagine-green',
            name: 'Ceramic Tagine Green',
            price: 109,
            currency: 'AED',
            in_stock: true,
            supplier_name: 'Atlas Souk',
            category_name: 'Kitchen Accessories',
            thumbnail_url: '/images/catalog/atlas-souk/kitchen-accessories/ceramic-tagine-green.svg',
          }}
        />
      </CartProvider>
    );

    expect(screen.getByText('Ceramic Tagine Green')).toBeDefined();
    expect(screen.getByText('Quick Add')).toBeDefined();
    expect(screen.getByText('In stock')).toBeDefined();
  });
});
