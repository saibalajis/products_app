export const STORAGE_KEYS = {
  overrides: 'admin-product-overrides',
  customProducts: 'admin-custom-products',
  deletedProducts: 'admin-deleted-products',
  orders: 'store-orders',
};

export const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
export const LOW_STOCK_THRESHOLD = 10;

function readJson(key, fallback) {
  const value = window.localStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
}

function isValidOrder(order) {
  return order
    && typeof order.id === 'string'
    && typeof order.customer === 'string'
    && Number.isFinite(Number(order.total))
    && ORDER_STATUSES.includes(order.status)
    && !Number.isNaN(new Date(order.createdAt).getTime())
    && Array.isArray(order.items)
    && order.items.every((item) => (
      item
      && (typeof item.id === 'string' || typeof item.id === 'number')
      && typeof item.title === 'string'
      && Number.isFinite(Number(item.price))
      && Number.isInteger(item.quantity)
      && item.quantity > 0
    ));
}

function readOverrides() {
  const overrides = readJson(STORAGE_KEYS.overrides, {});
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) {
    throw new Error('Saved product settings are invalid.');
  }

  for (const override of Object.values(overrides)) {
    const validText = ['title', 'category', 'description', 'thumbnail']
      .every((field) => override[field] === undefined || typeof override[field] === 'string');
    if (
      !Number.isInteger(Number(override.stock))
      || Number(override.stock) < 0
      || !Number.isFinite(Number(override.price))
      || Number(override.price) < 0
      || typeof override.isAvailable !== 'boolean'
      || !validText
    ) {
      throw new Error('Saved product settings are invalid.');
    }
  }
  return overrides;
}

export function readStoreData() {
  const customProducts = readJson(STORAGE_KEYS.customProducts, []);
  const deletedIds = readJson(STORAGE_KEYS.deletedProducts, []);
  const orders = readJson(STORAGE_KEYS.orders, []);
  if (
    !Array.isArray(customProducts)
    || !Array.isArray(deletedIds)
    || deletedIds.some((id) => typeof id !== 'string' && typeof id !== 'number')
    || !Array.isArray(orders)
    || orders.some((order) => !isValidOrder(order))
  ) {
    throw new Error('Saved store data is invalid.');
  }
  return { customProducts, deletedIds, orders, overrides: readOverrides() };
}

export function mergeProducts(apiProducts, storeData) {
  const deletedIds = new Set(storeData.deletedIds);
  return [...apiProducts, ...storeData.customProducts]
    .filter((product) => !deletedIds.has(product.id))
    .map((product) => ({
      ...product,
      ...storeData.overrides[product.id],
      isAvailable: storeData.overrides[product.id]?.isAvailable ?? product.isAvailable ?? true,
    }));
}

export function toProductOverride(product) {
  return {
    stock: product.stock,
    price: product.price,
    isAvailable: product.isAvailable !== false,
    title: product.title,
    category: product.category,
    description: product.description,
    thumbnail: product.thumbnail,
  };
}

export function writeStoreValue(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function writeStoreBatch(entries) {
  const previousValues = entries.map(([key]) => [key, window.localStorage.getItem(key)]);
  try {
    entries.forEach(([key, value]) => writeStoreValue(key, value));
  } catch (error) {
    previousValues.forEach(([key, value]) => {
      if (value === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, value);
    });
    throw error;
  }
}

export function createOrderId() {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
