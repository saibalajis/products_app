import { useEffect, useState } from 'react';
import { getProducts } from '../api/productsApi';
import {
  mergeProducts,
  readStoreData,
  STORAGE_KEYS,
  toProductOverride,
  writeStoreBatch,
} from '../store/storeStorage';

export default function useCatalogData() {
  const [products, setProducts] = useState([]);
  const [productOverrides, setProductOverrides] = useState({});
  const [customProducts, setCustomProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    async function loadStore() {
      try {
        const [apiProducts, storeData] = await Promise.all([getProducts(), readStoreData()]);
        setProductOverrides(storeData.overrides);
        setCustomProducts(storeData.customProducts);
        setOrders(storeData.orders);
        setProducts(mergeProducts(apiProducts, storeData));
      } catch (loadError) {
        setError(`Could not load products: ${loadError.message}`);
      } finally {
        setLoading(false);
      }
    }
    loadStore();
  }, []);

  function commitProducts(nextProducts, changedProducts, additionalWrites = []) {
    const nextOverrides = { ...productOverrides };
    changedProducts.forEach((product) => {
      nextOverrides[product.id] = toProductOverride(product);
    });
    const nextCustomProducts = customProducts.map((customProduct) => (
      nextProducts.find((product) => product.id === customProduct.id) || customProduct
    ));
    try {
      const writes = [[STORAGE_KEYS.overrides, nextOverrides], ...additionalWrites];
      if (nextCustomProducts.some((product, index) => product !== customProducts[index])) {
        writes.push([STORAGE_KEYS.customProducts, nextCustomProducts]);
      }
      writeStoreBatch(writes);
    } catch (saveError) {
      setError(`Could not save product changes: ${saveError.message}`);
      return false;
    }
    setProductOverrides(nextOverrides);
    setCustomProducts(nextCustomProducts);
    setProducts(nextProducts);
    setError('');
    return true;
  }

  function saveProduct(product) {
    const nextProducts = products.map((item) => (item.id === product.id ? product : item));
    if (!commitProducts(nextProducts, [product])) return false;
    setNotice(`${product.title} saved.`);
    return true;
  }

  function createProduct(details) {
    const product = {
      ...details,
      id: `local-${Date.now()}`,
      images: details.thumbnail ? [details.thumbnail] : [],
      rating: 0,
      reviews: [],
      brand: '',
    };
    const nextCustomProducts = [...customProducts, product];
    try {
      writeStoreBatch([[STORAGE_KEYS.customProducts, nextCustomProducts]]);
    } catch (saveError) {
      setError(`Could not add product: ${saveError.message}`);
      return false;
    }
    setCustomProducts(nextCustomProducts);
    setProducts((previous) => [...previous, product]);
    setNotice(`${product.title} added to the catalog.`);
    setError('');
    return true;
  }

  function deleteProduct(product) {
    if (!window.confirm(`Delete "${product.title}" from the product catalog?`)) return;
    try {
      const deletedIds = readStoreData().deletedIds;
      const nextDeletedIds = [...new Set([...deletedIds, product.id])];
      const nextCustom = customProducts.filter((item) => item.id !== product.id);
      writeStoreBatch([
        [STORAGE_KEYS.deletedProducts, nextDeletedIds],
        [STORAGE_KEYS.customProducts, nextCustom],
      ]);
      setCustomProducts(nextCustom);
      setProducts((previous) => previous.filter((item) => item.id !== product.id));
      setNotice(`${product.title} deleted from the catalog.`);
      setError('');
      return true;
    } catch (saveError) {
      setError(`Could not delete product: ${saveError.message}`);
      return false;
    }
  }

  return {
    products, setProducts, productOverrides, setProductOverrides, customProducts,
    orders, setOrders, loading, error, setError, notice, setNotice,
    saveProduct, createProduct, deleteProduct, commitProducts,
  };
}
