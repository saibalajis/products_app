import {
  createOrderId,
  ORDER_STATUSES,
  STORAGE_KEYS,
  writeStoreValue,
} from '../store/storeStorage';

export default function useStoreOrders({
  user, cart, cartTotal, products, orders, setOrders,
  commitProducts, setError, setNotice, clearCart,
}) {
  function placeOrder() {
    const invalidItem = cart.find(({ product, quantity }) => {
      const current = products.find((item) => item.id === product.id);
      return !current || current.isAvailable === false || current.stock < quantity;
    });
    if (invalidItem) {
      setError(`${invalidItem.product.title} no longer has enough stock. Please update your cart.`);
      return;
    }

    const order = {
      id: createOrderId(),
      customer: user.username,
      items: cart.map(({ product, quantity }) => ({
        id: product.id, title: product.title, price: product.price, quantity,
      })),
      total: cartTotal,
      status: 'Processing',
      createdAt: new Date().toISOString(),
    };
    const nextOrders = [order, ...orders];
    const nextProducts = products.map((product) => {
      const item = order.items.find((ordered) => ordered.id === product.id);
      return item ? { ...product, stock: product.stock - item.quantity } : product;
    });
    const productsCommitted = commitProducts(nextProducts, nextProducts.filter((product) => (
      order.items.some((item) => item.id === product.id)
    )), [[STORAGE_KEYS.orders, nextOrders]]);
    if (!productsCommitted) return;
    setOrders(nextOrders);
    clearCart();
    setNotice(`Order ${order.id} placed successfully.`);
  }

  function updateOrderStatus(orderId, status) {
    if (!ORDER_STATUSES.includes(status)) return;
    const order = orders.find((item) => item.id === orderId);
    if (!order || order.status === status) return;
    if (order.status === 'Cancelled' || order.status === 'Delivered') {
      setError('Cancelled and delivered orders cannot be changed.');
      return;
    }
    const nextOrders = orders.map((item) => item.id === orderId ? { ...item, status } : item);
    let nextProducts = products;
    let changedProducts = [];
    if (status === 'Cancelled') {
      nextProducts = products.map((product) => {
        const ordered = order.items.find((item) => item.id === product.id);
        return ordered ? { ...product, stock: product.stock + ordered.quantity } : product;
      });
      changedProducts = nextProducts.filter((product) => order.items.some((item) => item.id === product.id));
    }

    if (changedProducts.length) {
      if (!commitProducts(nextProducts, changedProducts, [[STORAGE_KEYS.orders, nextOrders]])) return;
    } else {
      try {
        writeStoreValue(STORAGE_KEYS.orders, nextOrders);
      } catch (saveError) {
        setError(`Could not update order: ${saveError.message}`);
        return;
      }
    }
    setOrders(nextOrders);
    setNotice(`Order ${orderId} updated to ${status.toLowerCase()}.`);
    setError('');
  }

  return { placeOrder, updateOrderStatus };
}
