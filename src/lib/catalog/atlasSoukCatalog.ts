export type BabCategoryCode = 'KIT' | 'SKN' | 'GRO';

export interface BabCategory {
  name: string;
  slug: 'kitchen-accessories' | 'skin-care' | 'groceries';
  code: BabCategoryCode;
  description: string;
  heroImage: string;
}

export interface BabProduct {
  name: string;
  slug: string;
  sku: string;
  categorySlug: BabCategory['slug'];
  categoryCode: BabCategoryCode;
  priceAed: number;
  currency: 'AED';
  shortDescription: string;
  longDescription: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  inventoryQty: number;
  featured: boolean;
  tags: string[];
  countryOfOrigin: 'Morocco';
  imagePaths: string[];
  thumbnailPath: string;
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
  attributes: Record<string, string>;
  careInformation: string;
  shippingInformation: string;
  storageInformation?: string;
  returnEligible: boolean;
  minimumOrderQty: number;
  retailAvailable: boolean;
  wholesaleReady: boolean;
  productReviewStatus: 'pending' | 'approved';
  requiresComplianceReview: boolean;
  complianceNotes: string;
  ingredientsVerified?: boolean;
  claimsVerified?: boolean;
  foodSafety?: {
    ingredients: string;
    allergens: string;
    netWeightOrVolume: string;
    storageInstructions: string;
    expiryDate: string;
    batchNumber: string;
    manufacturer: string;
    importerInformation: string;
    nutritionInformation: string;
    halalVerificationStatus: string;
  };
}

export const BAB_SUPPLIER = {
  name: 'Atlas Souk',
  slug: 'atlas-souk',
  brand: 'Atlas Souk',
  description:
    'Authentic Moroccan kitchenware, beauty products, and pantry essentials curated from Morocco.',
  bannerImage: '/images/catalog/atlas-souk/supplier/banner.svg',
  logoImage: '/images/catalog/atlas-souk/supplier/logo.svg',
  avatarImage: '/images/catalog/atlas-souk/supplier/avatar.svg',
  archCoverImage: '/images/catalog/atlas-souk/supplier/arch-cover.svg',
  storeBadgeImage: '/images/catalog/atlas-souk/supplier/store-badge.svg',
  verifiedBadgeImage: '/images/catalog/atlas-souk/supplier/verified-placeholder.svg',
  originBadgeImage: '/images/catalog/atlas-souk/supplier/morocco-origin.svg',
} as const;

export const BAB_CATEGORIES: BabCategory[] = [
  {
    name: 'Kitchen Accessories',
    slug: 'kitchen-accessories',
    code: 'KIT',
    description:
      'Traditional Moroccan cookware, ceramic tableware, tea accessories, and serving essentials.',
    heroImage: '/images/catalog/atlas-souk/categories/kitchen-accessories.svg',
  },
  {
    name: 'Skin Care',
    slug: 'skin-care',
    code: 'SKN',
    description:
      'Moroccan beauty rituals, botanical skin care, bath products, serums, oils, and traditional ingredients.',
    heroImage: '/images/catalog/atlas-souk/categories/skin-care.svg',
  },
  {
    name: 'Groceries',
    slug: 'groceries',
    code: 'GRO',
    description:
      'Moroccan pantry essentials, tea, coffee, honey, spices, olive oil, baking products, biscuits, and traditional spreads.',
    heroImage: '/images/catalog/atlas-souk/categories/groceries.svg',
  },
];

const KITCHEN_PRODUCTS: Array<[string, string, number]> = [
  ['Couscous Pot Medium', 'couscous-pot-medium', 249],
  ['Oil Bottle Ziata', 'oil-bottle-ziata', 39],
  ['Safi Plate 21cm', 'safi-plate-21cm', 69],
  ['Ceramic Tagine Green', 'ceramic-tagine-green', 109],
  ['Ceramic Tagine Purple', 'ceramic-tagine-purple', 109],
  ['Cooking Tagine 28cm', 'cooking-tagine-28cm', 99],
  ['Cooking Tagine 30cm', 'cooking-tagine-30cm', 119],
  ['Cooking Tagine 35cm', 'cooking-tagine-35cm', 159],
  ['Mug Safi Ceramic', 'mug-safi-ceramic', 25],
  ['Ceramic Laban Set', 'ceramic-laban-set', 209],
  ['Ceramic Fera9a', 'ceramic-fera9a', 199],
  ['Ceramic Large', 'ceramic-large', 39],
  ['Tea Glasses', 'tea-glasses', 79],
  ['Royal Tea Pot Large', 'royal-tea-pot-large', 189],
];

const SKIN_PRODUCTS: Array<[string, string, number]> = [
  ['Moroccan Soap', 'moroccan-soap', 69],
  ['Blue Neela and Rose', 'blue-neela-and-rose', 89],
  ['Aker Fasi and Rose', 'aker-fasi-and-rose', 89],
  ['Pure Rose Water', 'pure-rose-water', 69],
  ['Pure Lavender', 'pure-lavender', 49],
  ['Whitening Cream', 'whitening-cream', 69],
  ['Whitening Soap', 'whitening-soap', 59],
  ['Bio Products', 'bio-products', 89],
  ['Hair Herbs', 'hair-herbs', 89],
  ['Scrubs', 'scrubs', 119],
  ['Lip Products', 'lip-products', 39],
  ['Bath Bombs', 'bath-bombs', 129],
  ['Bath Salts', 'bath-salts', 39],
  ['Sugar Scrubs', 'sugar-scrubs', 29],
  ['Essential Oils', 'essential-oils', 129],
  ['Serums', 'serums', 229],
  ['Argan Oil', 'argan-oil', 99],
];

const GROCERY_PRODUCTS: Array<[string, string, number]> = [
  ['Jibal Products', 'jibal-products', 16],
  ['Alsa Products', 'alsa-products', 9],
  ['Baking Items', 'baking-items', 13],
  ['Merendina', 'merendina', 4],
  ['Biscuits', 'biscuits', 7],
  ['Olive Oil 500ml', 'olive-oil-500ml', 49],
  ['Olive Oil 1L', 'olive-oil-1l', 95],
  ['Spice Collections', 'spice-collections', 59],
  ['Harissa', 'harissa', 69],
  ['Traditional Spices', 'traditional-spices', 49],
  ['Tea Collections', 'tea-collections', 39],
  ['Coffee Products', 'coffee-products', 39],
  ['Honey', 'honey', 149],
  ['Amlou Products', 'amlou-products', 209],
];

const GENERIC_NAME_REVIEW_SET = new Set([
  'Ceramic Large',
  'Bio Products',
  'Hair Herbs',
  'Scrubs',
  'Lip Products',
  'Serums',
  'Jibal Products',
  'Alsa Products',
  'Baking Items',
  'Biscuits',
  'Spice Collections',
  'Tea Collections',
  'Coffee Products',
  'Amlou Products',
]);

function seqSku(code: BabCategoryCode, index: number) {
  return `BM-${code}-${String(index + 1).padStart(3, '0')}`;
}

function buildProduct(
  item: [string, string, number],
  category: BabCategory,
  index: number
): BabProduct {
  const [name, slug, priceAed] = item;
  const imagePath = `/images/catalog/atlas-souk/${category.slug}/${slug}.svg`;
  const generic = GENERIC_NAME_REVIEW_SET.has(name);
  const isComplianceName = name === 'Whitening Cream' || name === 'Whitening Soap';
  const isFood = category.slug === 'groceries';

  return {
    name,
    slug,
    sku: seqSku(category.code, index),
    categorySlug: category.slug,
    categoryCode: category.code,
    priceAed,
    currency: 'AED',
    shortDescription: `${name} curated by ${BAB_SUPPLIER.name} for the OUROZ Moroccan catalog.`,
    longDescription:
      `${name} is presented as part of the ${category.name} collection from ${BAB_SUPPLIER.name}. ` +
      `Product presentation, care, and usage details are provided as factual placeholders pending supplier verification. ` +
      `Material details to be confirmed by supplier. Final dimensions pending supplier verification.`,
    stockStatus: priceAed > 180 ? 'low_stock' : 'in_stock',
    inventoryQty: priceAed > 180 ? 8 : 24,
    featured:
      slug.includes('tagine') || slug.includes('argan') || slug.includes('olive-oil') || slug.includes('honey'),
    tags: buildTags(name, category.slug),
    countryOfOrigin: 'Morocco',
    imagePaths: [
      imagePath,
      `/images/catalog/atlas-souk/shared/${category.slug}-gallery-secondary.svg`,
    ],
    thumbnailPath: imagePath,
    imageAlt: `${name} placeholder image for ${BAB_SUPPLIER.name}`,
    seoTitle: `${name} | ${BAB_SUPPLIER.name} | OUROZ`,
    seoDescription: `Discover ${name} from ${BAB_SUPPLIER.name}, available through OUROZ in the UAE.`,
    attributes: {
      category: category.name,
      collection: 'Atlas Souk Catalog',
      supplier_verification: 'Pending detailed supplier verification',
    },
    careInformation:
      category.slug === 'kitchen-accessories'
        ? 'Hand-wash preferred. Dry thoroughly before storage. Care details pending supplier verification.'
        : category.slug === 'skin-care'
          ? 'Patch testing guidance and full usage instructions pending supplier verification.'
          : 'Store in a cool, dry place away from direct sunlight. Storage details pending supplier verification.',
    shippingInformation:
      'Standard UAE shipping applies. Fragile or temperature-sensitive handling notes pending supplier verification.',
    storageInformation: isFood
      ? 'Store in a cool, dry place. Full storage requirements pending supplier verification.'
      : undefined,
    returnEligible: true,
    minimumOrderQty: 1,
    retailAvailable: true,
    wholesaleReady: true,
    productReviewStatus: generic ? 'pending' : 'approved',
    requiresComplianceReview: isComplianceName || generic,
    complianceNotes: isComplianceName
      ? 'Name retained from supplier source. Product copy must avoid unverified cosmetic claims.'
      : generic
        ? 'Generic product naming requires supplier clarification and catalog refinement.'
        : 'No blocking compliance issue identified in placeholder content.',
    ingredientsVerified: category.slug === 'skin-care' ? false : undefined,
    claimsVerified: category.slug === 'skin-care' ? false : undefined,
    foodSafety: isFood
      ? {
          ingredients: 'Complete ingredient list pending supplier verification.',
          allergens: 'Allergen declaration pending supplier verification.',
          netWeightOrVolume: 'Net weight/volume pending supplier verification.',
          storageInstructions: 'Storage instructions pending supplier verification.',
          expiryDate: 'Expiry date pending supplier verification.',
          batchNumber: 'Batch number assigned per received inventory lot.',
          manufacturer: 'Manufacturer details pending supplier verification.',
          importerInformation: 'Importer information pending supplier verification.',
          nutritionInformation: 'Nutrition information pending supplier verification.',
          halalVerificationStatus: 'Halal verification status pending supplier confirmation.',
        }
      : undefined,
  };
}

function buildTags(name: string, categorySlug: BabCategory['slug']) {
  const lowered = name.toLowerCase();
  const base = [categorySlug, 'morocco', 'atlas-souk'];

  if (lowered.includes('tagine')) base.push('tagine', 'tajine');
  if (lowered.includes('neela')) base.push('neela', 'nila');
  if (lowered.includes('aker')) base.push('aker-fasi', 'aker-el-fassi');
  if (lowered.includes('ziata')) base.push('ziata', 'ziyata');
  if (lowered.includes('couscous')) base.push('couscous', 'kuskus');
  if (lowered.includes('olive oil')) base.push('olive-oil');
  if (lowered.includes('argan')) base.push('argan');

  return Array.from(new Set(base));
}

export const BAB_PRODUCTS: BabProduct[] = [
  ...KITCHEN_PRODUCTS.map((item, index) => buildProduct(item, BAB_CATEGORIES[0], index)),
  ...SKIN_PRODUCTS.map((item, index) => buildProduct(item, BAB_CATEGORIES[1], index)),
  ...GROCERY_PRODUCTS.map((item, index) => buildProduct(item, BAB_CATEGORIES[2], index)),
];

export const BAB_SEARCH_ALIASES: Record<string, string[]> = {
  tagine: ['tagine', 'tajine'],
  tajine: ['tajine', 'tagine'],
  'aker fasi': ['aker fasi', 'aker el fassi'],
  'aker el fassi': ['aker el fassi', 'aker fasi'],
  neela: ['neela', 'nila'],
  nila: ['nila', 'neela'],
  ziata: ['ziata', 'ziyata'],
  ziyata: ['ziyata', 'ziata'],
  couscous: ['couscous', 'kuskus'],
  kuskus: ['kuskus', 'couscous'],
};

export interface CatalogQualityWarning {
  slug: string;
  name: string;
  warnings: string[];
}

export function getCatalogQualityWarnings(): CatalogQualityWarning[] {
  return BAB_PRODUCTS.map((product) => {
    const warnings: string[] = [];

    if (GENERIC_NAME_REVIEW_SET.has(product.name)) warnings.push('Generic product name');
    if (product.longDescription.includes('Material details to be confirmed')) warnings.push('Missing material confirmation');
    if (!product.seoDescription?.trim()) warnings.push('Missing SEO description');
    if (product.categorySlug === 'skin-care' && product.ingredientsVerified === false) warnings.push('Missing ingredients verification');
    if (product.categorySlug === 'groceries' && product.foodSafety?.allergens.includes('pending')) warnings.push('Missing allergen information');
    if (product.requiresComplianceReview) warnings.push('Compliance review required');
    warnings.push('Missing real product image');

    return {
      slug: product.slug,
      name: product.name,
      warnings,
    };
  }).filter((row) => row.warnings.length > 0);
}

export function productCountByCategory() {
  return {
    'kitchen-accessories': BAB_PRODUCTS.filter((p) => p.categorySlug === 'kitchen-accessories').length,
    'skin-care': BAB_PRODUCTS.filter((p) => p.categorySlug === 'skin-care').length,
    groceries: BAB_PRODUCTS.filter((p) => p.categorySlug === 'groceries').length,
    total: BAB_PRODUCTS.length,
  };
}
