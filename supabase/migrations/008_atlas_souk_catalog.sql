-- =============================================================================
-- 008_atlas_souk_catalog.sql
-- Atlas Souk production-ready catalog seed (Kitchen Accessories, Skin Care,
-- Groceries) with exactly 45 products.
-- =============================================================================

-- Supplier storefront fields (non-destructive)
ALTER TABLE suppliers
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS banner_url TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS origin_country TEXT,
  ADD COLUMN IF NOT EXISTS verified_badge_label TEXT,
  ADD COLUMN IF NOT EXISTS verification_placeholder BOOLEAN NOT NULL DEFAULT TRUE;

-- Product catalog fields (non-destructive)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sku TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS stock_status TEXT NOT NULL DEFAULT 'in_stock',
  ADD COLUMN IF NOT EXISTS inventory_quantity INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS product_tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS country_of_origin TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT,
  ADD COLUMN IF NOT EXISTS product_attributes JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS care_information TEXT,
  ADD COLUMN IF NOT EXISTS shipping_information TEXT,
  ADD COLUMN IF NOT EXISTS storage_information TEXT,
  ADD COLUMN IF NOT EXISTS return_eligible BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS minimum_order_quantity INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS retail_available BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS wholesale_ready BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS product_review_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS compliance_review_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS requires_compliance_review BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS compliance_notes TEXT,
  ADD COLUMN IF NOT EXISTS ingredients_verified BOOLEAN,
  ADD COLUMN IF NOT EXISTS claims_verified BOOLEAN;

-- Ensure image_urls exists for compatibility with existing UI paths.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_urls TEXT[] NOT NULL DEFAULT '{}';

-- Food and compliance readiness tables
CREATE TABLE IF NOT EXISTS product_compliance_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  requires_compliance_review BOOLEAN NOT NULL DEFAULT FALSE,
  compliance_notes TEXT,
  ingredients_verified BOOLEAN,
  claims_verified BOOLEAN,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS catalog_quality_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quality_score INTEGER NOT NULL DEFAULT 0,
  flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  confirmed_quantity INTEGER NOT NULL DEFAULT 0,
  released_quantity INTEGER NOT NULL DEFAULT 0,
  reservation_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, variant_id)
);

-- Indexes / uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug_unique ON products(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku_unique ON products(sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_stock_status ON products(stock_status);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(base_price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_tags_gin ON products USING GIN(product_tags);
CREATE INDEX IF NOT EXISTS idx_inventory_available ON inventory(available_quantity);
CREATE INDEX IF NOT EXISTS idx_catalog_quality_product ON catalog_quality_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_compliance_reviews_product ON product_compliance_reviews(product_id);

-- RLS additions
ALTER TABLE product_compliance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_quality_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_products" ON products;
CREATE POLICY "public_read_published_products"
  ON products FOR SELECT
  USING (is_active = TRUE AND status = 'published');

DROP POLICY IF EXISTS "public_read_active_suppliers" ON suppliers;
CREATE POLICY "public_read_active_suppliers"
  ON suppliers FOR SELECT
  USING (is_active = TRUE AND status = 'approved');

DROP POLICY IF EXISTS "admins_manage_compliance_reviews" ON product_compliance_reviews;
CREATE POLICY "admins_manage_compliance_reviews"
  ON product_compliance_reviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admins_manage_quality_reviews" ON catalog_quality_reviews;
CREATE POLICY "admins_manage_quality_reviews"
  ON catalog_quality_reviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admins_manage_inventory" ON inventory;
CREATE POLICY "admins_manage_inventory"
  ON inventory FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'admin'
    )
  );

-- Brand seed
INSERT INTO brands (name, slug, is_active)
VALUES ('Atlas Souk', 'atlas-souk', TRUE)
ON CONFLICT (slug)
DO UPDATE SET
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active;

-- Supplier seed
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  SELECT user_id INTO admin_user_id
  FROM user_profiles
  WHERE role = 'admin'
  ORDER BY created_at ASC
  LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    INSERT INTO suppliers (
      owner_user_id,
      name,
      slug,
      description,
      contact_email,
      status,
      is_active,
      banner_url,
      avatar_url,
      logo_url,
      origin_country,
      verified_badge_label,
      verification_placeholder
    )
    VALUES (
      admin_user_id,
      'Atlas Souk',
      'atlas-souk',
      'Authentic Moroccan kitchenware, beauty products, and pantry essentials curated from Morocco.',
      'catalog@ouroz.local',
      'approved',
      TRUE,
      '/images/catalog/atlas-souk/supplier/banner.svg',
      '/images/catalog/atlas-souk/supplier/avatar.svg',
      '/images/catalog/atlas-souk/supplier/logo.svg',
      'Morocco',
      'Verification Placeholder',
      TRUE
    )
    ON CONFLICT (slug)
    DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      status = EXCLUDED.status,
      is_active = EXCLUDED.is_active,
      banner_url = EXCLUDED.banner_url,
      avatar_url = EXCLUDED.avatar_url,
      logo_url = EXCLUDED.logo_url,
      origin_country = EXCLUDED.origin_country,
      verified_badge_label = EXCLUDED.verified_badge_label,
      verification_placeholder = EXCLUDED.verification_placeholder;
  END IF;
END $$;

-- Category seed
INSERT INTO categories (slug, name, description, is_active, display_order, image_url, icon)
VALUES
  ('kitchen-accessories', 'Kitchen Accessories', 'Traditional Moroccan cookware, ceramic tableware, tea accessories, and serving essentials.', TRUE, 1, '/images/catalog/atlas-souk/categories/kitchen-accessories.svg', '⟡'),
  ('skin-care', 'Skin Care', 'Moroccan beauty rituals, botanical skin care, bath products, serums, oils, and traditional ingredients.', TRUE, 2, '/images/catalog/atlas-souk/categories/skin-care.svg', '◌'),
  ('groceries', 'Groceries', 'Moroccan pantry essentials, tea, coffee, honey, spices, olive oil, baking products, biscuits, and traditional spreads.', TRUE, 3, '/images/catalog/atlas-souk/categories/groceries.svg', '◉')
ON CONFLICT (slug)
DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  image_url = EXCLUDED.image_url,
  icon = EXCLUDED.icon;

WITH seed(name, slug, category_slug, sku, base_price, compliance_name, generic_name) AS (
  VALUES
    ('Couscous Pot Medium', 'couscous-pot-medium', 'kitchen-accessories', 'BM-KIT-001', 249, FALSE, FALSE),
    ('Oil Bottle Ziata', 'oil-bottle-ziata', 'kitchen-accessories', 'BM-KIT-002', 39, FALSE, FALSE),
    ('Safi Plate 21cm', 'safi-plate-21cm', 'kitchen-accessories', 'BM-KIT-003', 69, FALSE, FALSE),
    ('Ceramic Tagine Green', 'ceramic-tagine-green', 'kitchen-accessories', 'BM-KIT-004', 109, FALSE, FALSE),
    ('Ceramic Tagine Purple', 'ceramic-tagine-purple', 'kitchen-accessories', 'BM-KIT-005', 109, FALSE, FALSE),
    ('Cooking Tagine 28cm', 'cooking-tagine-28cm', 'kitchen-accessories', 'BM-KIT-006', 99, FALSE, FALSE),
    ('Cooking Tagine 30cm', 'cooking-tagine-30cm', 'kitchen-accessories', 'BM-KIT-007', 119, FALSE, FALSE),
    ('Cooking Tagine 35cm', 'cooking-tagine-35cm', 'kitchen-accessories', 'BM-KIT-008', 159, FALSE, FALSE),
    ('Mug Safi Ceramic', 'mug-safi-ceramic', 'kitchen-accessories', 'BM-KIT-009', 25, FALSE, FALSE),
    ('Ceramic Laban Set', 'ceramic-laban-set', 'kitchen-accessories', 'BM-KIT-010', 209, FALSE, FALSE),
    ('Ceramic Fera9a', 'ceramic-fera9a', 'kitchen-accessories', 'BM-KIT-011', 199, FALSE, FALSE),
    ('Ceramic Large', 'ceramic-large', 'kitchen-accessories', 'BM-KIT-012', 39, FALSE, TRUE),
    ('Tea Glasses', 'tea-glasses', 'kitchen-accessories', 'BM-KIT-013', 79, FALSE, FALSE),
    ('Royal Tea Pot Large', 'royal-tea-pot-large', 'kitchen-accessories', 'BM-KIT-014', 189, FALSE, FALSE),

    ('Moroccan Soap', 'moroccan-soap', 'skin-care', 'BM-SKN-001', 69, FALSE, FALSE),
    ('Blue Neela and Rose', 'blue-neela-and-rose', 'skin-care', 'BM-SKN-002', 89, FALSE, FALSE),
    ('Aker Fasi and Rose', 'aker-fasi-and-rose', 'skin-care', 'BM-SKN-003', 89, FALSE, FALSE),
    ('Pure Rose Water', 'pure-rose-water', 'skin-care', 'BM-SKN-004', 69, FALSE, FALSE),
    ('Pure Lavender', 'pure-lavender', 'skin-care', 'BM-SKN-005', 49, FALSE, FALSE),
    ('Whitening Cream', 'whitening-cream', 'skin-care', 'BM-SKN-006', 69, TRUE, FALSE),
    ('Whitening Soap', 'whitening-soap', 'skin-care', 'BM-SKN-007', 59, TRUE, FALSE),
    ('Bio Products', 'bio-products', 'skin-care', 'BM-SKN-008', 89, FALSE, TRUE),
    ('Hair Herbs', 'hair-herbs', 'skin-care', 'BM-SKN-009', 89, FALSE, TRUE),
    ('Scrubs', 'scrubs', 'skin-care', 'BM-SKN-010', 119, FALSE, TRUE),
    ('Lip Products', 'lip-products', 'skin-care', 'BM-SKN-011', 39, FALSE, TRUE),
    ('Bath Bombs', 'bath-bombs', 'skin-care', 'BM-SKN-012', 129, FALSE, FALSE),
    ('Bath Salts', 'bath-salts', 'skin-care', 'BM-SKN-013', 39, FALSE, FALSE),
    ('Sugar Scrubs', 'sugar-scrubs', 'skin-care', 'BM-SKN-014', 29, FALSE, FALSE),
    ('Essential Oils', 'essential-oils', 'skin-care', 'BM-SKN-015', 129, FALSE, FALSE),
    ('Serums', 'serums', 'skin-care', 'BM-SKN-016', 229, FALSE, TRUE),
    ('Argan Oil', 'argan-oil', 'skin-care', 'BM-SKN-017', 99, FALSE, FALSE),

    ('Jibal Products', 'jibal-products', 'groceries', 'BM-GRO-001', 16, FALSE, TRUE),
    ('Alsa Products', 'alsa-products', 'groceries', 'BM-GRO-002', 9, FALSE, TRUE),
    ('Baking Items', 'baking-items', 'groceries', 'BM-GRO-003', 13, FALSE, TRUE),
    ('Merendina', 'merendina', 'groceries', 'BM-GRO-004', 4, FALSE, FALSE),
    ('Biscuits', 'biscuits', 'groceries', 'BM-GRO-005', 7, FALSE, TRUE),
    ('Olive Oil 500ml', 'olive-oil-500ml', 'groceries', 'BM-GRO-006', 49, FALSE, FALSE),
    ('Olive Oil 1L', 'olive-oil-1l', 'groceries', 'BM-GRO-007', 95, FALSE, FALSE),
    ('Spice Collections', 'spice-collections', 'groceries', 'BM-GRO-008', 59, FALSE, TRUE),
    ('Harissa', 'harissa', 'groceries', 'BM-GRO-009', 69, FALSE, FALSE),
    ('Traditional Spices', 'traditional-spices', 'groceries', 'BM-GRO-010', 49, FALSE, FALSE),
    ('Tea Collections', 'tea-collections', 'groceries', 'BM-GRO-011', 39, FALSE, TRUE),
    ('Coffee Products', 'coffee-products', 'groceries', 'BM-GRO-012', 39, FALSE, TRUE),
    ('Honey', 'honey', 'groceries', 'BM-GRO-013', 149, FALSE, FALSE),
    ('Amlou Products', 'amlou-products', 'groceries', 'BM-GRO-014', 209, FALSE, TRUE)
),
resolved AS (
  SELECT
    s.*,
    c.id AS category_id,
    sup.id AS supplier_id,
    b.id AS brand_id
  FROM seed s
  JOIN categories c ON c.slug = s.category_slug
  JOIN suppliers sup ON sup.slug = 'atlas-souk'
  JOIN brands b ON b.slug = 'atlas-souk'
),
upserted_products AS (
  INSERT INTO products (
    name,
    slug,
    sku,
    category_id,
    supplier_id,
    brand_id,
    base_price,
    compare_at_price,
    currency,
    short_description,
    description,
    status,
    is_active,
    in_stock,
    stock_status,
    inventory_quantity,
    is_featured,
    product_tags,
    country_of_origin,
    image_urls,
    thumbnail_url,
    seo_title,
    seo_description,
    product_attributes,
    care_information,
    shipping_information,
    storage_information,
    return_eligible,
    minimum_order_quantity,
    retail_available,
    wholesale_ready,
    product_review_status,
    compliance_review_status,
    requires_compliance_review,
    compliance_notes,
    ingredients_verified,
    claims_verified
  )
  SELECT
    r.name,
    r.slug,
    r.sku,
    r.category_id,
    r.supplier_id,
    r.brand_id,
    r.base_price::numeric(10,2),
    NULL,
    'AED',
    r.name || ' curated by Atlas Souk for the OUROZ Moroccan catalog.',
    r.name || ' is presented as part of the Atlas Souk collection. Material details to be confirmed by supplier. Final dimensions pending supplier verification.',
    'published',
    TRUE,
    TRUE,
    CASE WHEN r.base_price >= 180 THEN 'low_stock' ELSE 'in_stock' END,
    CASE WHEN r.base_price >= 180 THEN 8 ELSE 24 END,
    (r.slug LIKE '%tagine%' OR r.slug LIKE '%argan%' OR r.slug LIKE '%olive-oil%' OR r.slug = 'honey'),
    ARRAY[
      r.category_slug,
      'morocco',
      'atlas-souk',
      CASE WHEN r.slug LIKE '%tagine%' THEN 'tagine' ELSE NULL END,
      CASE WHEN r.slug LIKE '%tagine%' THEN 'tajine' ELSE NULL END,
      CASE WHEN r.slug LIKE '%neela%' THEN 'neela' ELSE NULL END,
      CASE WHEN r.slug LIKE '%neela%' THEN 'nila' ELSE NULL END,
      CASE WHEN r.slug LIKE '%aker-fasi%' THEN 'aker-fasi' ELSE NULL END,
      CASE WHEN r.slug LIKE '%aker-fasi%' THEN 'aker-el-fassi' ELSE NULL END,
      CASE WHEN r.slug LIKE '%ziata%' THEN 'ziata' ELSE NULL END,
      CASE WHEN r.slug LIKE '%ziata%' THEN 'ziyata' ELSE NULL END,
      CASE WHEN r.slug LIKE '%couscous%' THEN 'couscous' ELSE NULL END,
      CASE WHEN r.slug LIKE '%couscous%' THEN 'kuskus' ELSE NULL END
    ],
    'Morocco',
    ARRAY[
      '/images/catalog/atlas-souk/' || r.category_slug || '/' || r.slug || '.svg',
      '/images/catalog/atlas-souk/shared/' || r.category_slug || '-gallery-secondary.svg'
    ],
    '/images/catalog/atlas-souk/' || r.category_slug || '/' || r.slug || '.svg',
    r.name || ' | Atlas Souk | OUROZ',
    'Discover ' || r.name || ' from Atlas Souk, available through OUROZ in the UAE.',
    jsonb_build_object(
      'category_slug', r.category_slug,
      'supplier_slug', 'atlas-souk',
      'brand_name', 'Atlas Souk',
      'supplier_verification', 'pending_detailed_verification'
    ),
    CASE
      WHEN r.category_slug = 'kitchen-accessories' THEN 'Hand-wash preferred. Dry thoroughly before storage. Care details pending supplier verification.'
      WHEN r.category_slug = 'skin-care' THEN 'Patch testing guidance and full usage instructions pending supplier verification.'
      ELSE 'Store in a cool, dry place away from direct sunlight. Storage details pending supplier verification.'
    END,
    'Standard UAE shipping applies. Fragile or temperature-sensitive handling notes pending supplier verification.',
    CASE WHEN r.category_slug = 'groceries' THEN 'Store in a cool, dry place. Full storage requirements pending supplier verification.' ELSE NULL END,
    TRUE,
    1,
    TRUE,
    TRUE,
    CASE WHEN r.generic_name THEN 'pending' ELSE 'approved' END,
    CASE WHEN r.compliance_name OR r.generic_name THEN 'pending' ELSE 'approved' END,
    (r.compliance_name OR r.generic_name),
    CASE
      WHEN r.compliance_name THEN 'Name retained from supplier source. Product copy must avoid unverified cosmetic claims.'
      WHEN r.generic_name THEN 'Generic product naming requires supplier clarification and catalog refinement.'
      ELSE 'No blocking compliance issue identified in placeholder content.'
    END,
    CASE WHEN r.category_slug = 'skin-care' THEN FALSE ELSE NULL END,
    CASE WHEN r.category_slug = 'skin-care' THEN FALSE ELSE NULL END
  FROM resolved r
  ON CONFLICT (slug)
  DO UPDATE SET
    sku = EXCLUDED.sku,
    category_id = EXCLUDED.category_id,
    supplier_id = EXCLUDED.supplier_id,
    brand_id = EXCLUDED.brand_id,
    base_price = EXCLUDED.base_price,
    currency = EXCLUDED.currency,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    is_active = EXCLUDED.is_active,
    in_stock = EXCLUDED.in_stock,
    stock_status = EXCLUDED.stock_status,
    inventory_quantity = EXCLUDED.inventory_quantity,
    is_featured = EXCLUDED.is_featured,
    product_tags = EXCLUDED.product_tags,
    country_of_origin = EXCLUDED.country_of_origin,
    image_urls = EXCLUDED.image_urls,
    thumbnail_url = EXCLUDED.thumbnail_url,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description,
    product_attributes = EXCLUDED.product_attributes,
    care_information = EXCLUDED.care_information,
    shipping_information = EXCLUDED.shipping_information,
    storage_information = EXCLUDED.storage_information,
    return_eligible = EXCLUDED.return_eligible,
    minimum_order_quantity = EXCLUDED.minimum_order_quantity,
    retail_available = EXCLUDED.retail_available,
    wholesale_ready = EXCLUDED.wholesale_ready,
    product_review_status = EXCLUDED.product_review_status,
    compliance_review_status = EXCLUDED.compliance_review_status,
    requires_compliance_review = EXCLUDED.requires_compliance_review,
    compliance_notes = EXCLUDED.compliance_notes,
    ingredients_verified = EXCLUDED.ingredients_verified,
    claims_verified = EXCLUDED.claims_verified,
    updated_at = NOW()
  RETURNING id, slug, sku, category_id, supplier_id, requires_compliance_review, compliance_notes
),
variant_seed AS (
  INSERT INTO product_variants (
    product_id,
    name,
    sku,
    price,
    retail_price,
    in_stock,
    stock_quantity,
    is_active,
    display_order
  )
  SELECT
    p.id,
    'Standard',
    p.sku || '-STD',
    p.base_price,
    p.base_price,
    TRUE,
    p.inventory_quantity,
    TRUE,
    0
  FROM products p
  WHERE p.slug IN (SELECT slug FROM seed)
  ON CONFLICT (sku)
  DO UPDATE SET
    price = EXCLUDED.price,
    retail_price = EXCLUDED.retail_price,
    in_stock = EXCLUDED.in_stock,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = EXCLUDED.is_active
  RETURNING id, product_id
),
seed_images AS (
  INSERT INTO product_images (product_id, url, alt, position)
  SELECT
    p.id,
    '/images/catalog/atlas-souk/' || c.slug || '/' || p.slug || '.svg',
    p.name || ' placeholder image for Atlas Souk',
    0
  FROM products p
  JOIN categories c ON c.id = p.category_id
  WHERE p.slug IN (SELECT slug FROM seed)
  ON CONFLICT DO NOTHING
  RETURNING product_id
)
INSERT INTO supplier_products (supplier_id, product_id, status, submitted_at, reviewed_at)
SELECT
  p.supplier_id,
  p.id,
  'approved',
  NOW(),
  NOW()
FROM products p
WHERE p.slug IN (SELECT slug FROM seed)
ON CONFLICT (supplier_id, product_id)
DO UPDATE SET
  status = 'approved',
  reviewed_at = NOW();

-- Inventory + quality + compliance records
INSERT INTO inventory (product_id, variant_id, available_quantity, reserved_quantity, confirmed_quantity, released_quantity)
SELECT
  p.id,
  v.id,
  p.inventory_quantity,
  0,
  0,
  0
FROM products p
LEFT JOIN product_variants v ON v.product_id = p.id
WHERE p.slug IN (
  SELECT slug FROM (
    VALUES
      ('couscous-pot-medium'), ('oil-bottle-ziata'), ('safi-plate-21cm'), ('ceramic-tagine-green'), ('ceramic-tagine-purple'),
      ('cooking-tagine-28cm'), ('cooking-tagine-30cm'), ('cooking-tagine-35cm'), ('mug-safi-ceramic'), ('ceramic-laban-set'),
      ('ceramic-fera9a'), ('ceramic-large'), ('tea-glasses'), ('royal-tea-pot-large'),
      ('moroccan-soap'), ('blue-neela-and-rose'), ('aker-fasi-and-rose'), ('pure-rose-water'), ('pure-lavender'),
      ('whitening-cream'), ('whitening-soap'), ('bio-products'), ('hair-herbs'), ('scrubs'), ('lip-products'),
      ('bath-bombs'), ('bath-salts'), ('sugar-scrubs'), ('essential-oils'), ('serums'), ('argan-oil'),
      ('jibal-products'), ('alsa-products'), ('baking-items'), ('merendina'), ('biscuits'), ('olive-oil-500ml'), ('olive-oil-1l'),
      ('spice-collections'), ('harissa'), ('traditional-spices'), ('tea-collections'), ('coffee-products'), ('honey'), ('amlou-products')
  ) AS t(slug)
)
ON CONFLICT (product_id, variant_id)
DO UPDATE SET
  available_quantity = EXCLUDED.available_quantity,
  updated_at = NOW();

INSERT INTO product_compliance_reviews (product_id, requires_compliance_review, compliance_notes, ingredients_verified, claims_verified)
SELECT
  p.id,
  p.requires_compliance_review,
  p.compliance_notes,
  p.ingredients_verified,
  p.claims_verified
FROM products p
WHERE p.slug IN (
  'whitening-cream', 'whitening-soap', 'ceramic-large', 'bio-products', 'hair-herbs',
  'scrubs', 'lip-products', 'serums', 'jibal-products', 'alsa-products', 'baking-items',
  'biscuits', 'spice-collections', 'tea-collections', 'coffee-products', 'amlou-products'
)
ON CONFLICT DO NOTHING;

INSERT INTO catalog_quality_reviews (product_id, quality_score, flags, notes)
SELECT
  p.id,
  CASE WHEN p.requires_compliance_review THEN 62 ELSE 78 END,
  CASE
    WHEN p.requires_compliance_review THEN
      '["generic_name_or_compliance_review","missing_verified_supplier_attributes","placeholder_image_only"]'::jsonb
    ELSE
      '["placeholder_image_only","supplier_verification_pending"]'::jsonb
  END,
  'Non-blocking quality report generated during Atlas Souk initial import.'
FROM products p
WHERE p.slug IN (
  SELECT slug FROM (
    VALUES
      ('couscous-pot-medium'), ('oil-bottle-ziata'), ('safi-plate-21cm'), ('ceramic-tagine-green'), ('ceramic-tagine-purple'),
      ('cooking-tagine-28cm'), ('cooking-tagine-30cm'), ('cooking-tagine-35cm'), ('mug-safi-ceramic'), ('ceramic-laban-set'),
      ('ceramic-fera9a'), ('ceramic-large'), ('tea-glasses'), ('royal-tea-pot-large'),
      ('moroccan-soap'), ('blue-neela-and-rose'), ('aker-fasi-and-rose'), ('pure-rose-water'), ('pure-lavender'),
      ('whitening-cream'), ('whitening-soap'), ('bio-products'), ('hair-herbs'), ('scrubs'), ('lip-products'),
      ('bath-bombs'), ('bath-salts'), ('sugar-scrubs'), ('essential-oils'), ('serums'), ('argan-oil'),
      ('jibal-products'), ('alsa-products'), ('baking-items'), ('merendina'), ('biscuits'), ('olive-oil-500ml'), ('olive-oil-1l'),
      ('spice-collections'), ('harissa'), ('traditional-spices'), ('tea-collections'), ('coffee-products'), ('honey'), ('amlou-products')
  ) AS t(slug)
)
ON CONFLICT DO NOTHING;
