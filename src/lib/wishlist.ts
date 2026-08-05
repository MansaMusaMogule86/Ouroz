const STORAGE_KEY = 'ouroz_wishlist';

function safeRead(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === 'string');
  } catch {
    return [];
  }
}

function safeWrite(values: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(new Set(values))));
}

export function getWishlistIds() {
  return safeRead();
}

export function isInWishlist(productId: string) {
  return safeRead().includes(productId);
}

export function toggleWishlist(productId: string) {
  const ids = safeRead();
  const exists = ids.includes(productId);
  const next = exists ? ids.filter((id) => id !== productId) : [...ids, productId];
  safeWrite(next);
  return !exists;
}
