const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

const routes = [
  '/shop',
  '/shop/kitchen-accessories',
  '/shop/skin-care',
  '/shop/groceries',
  '/supplier/atlas-souk',
  '/supplier/danat-al-jazeera',
  '/wholesale/catalog',
  '/wholesale/quality-report',
  '/product/ceramic-tagine-green',
  '/product/pure-rose-water',
  '/product/olive-oil-500ml',
  '/cart',
  '/wishlist',
];

async function checkRoute(pathname) {
  const url = `${baseUrl}${pathname}`;
  const response = await fetch(url, { redirect: 'manual' });
  const ok = response.status >= 200 && response.status < 400;
  return { pathname, status: response.status, ok };
}

(async () => {
  const results = [];
  for (const route of routes) {
    try {
      const result = await checkRoute(route);
      results.push(result);
      console.log(`${result.ok ? 'PASS' : 'FAIL'} ${result.status} ${route}`);
    } catch (error) {
      results.push({ pathname: route, status: 0, ok: false });
      console.log(`FAIL ERR ${route} ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  const failed = results.filter((result) => !result.ok);
  if (failed.length > 0) {
    console.error(`Smoke checks failed: ${failed.length}/${results.length}`);
    process.exit(1);
  }

  console.log(`Smoke checks passed: ${results.length}/${results.length}`);
})();
