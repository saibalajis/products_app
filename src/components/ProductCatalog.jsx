import { useMemo, useState } from 'react';
import AdminDashboard from './AdminDashboard';
import AdminSidebar from './AdminSidebar';
import ProductDetail from './ProductDetail';
import ProductListing from './ProductListing';
import ProductManager from './ProductManager';
import ShoppingCart from './ShoppingCart';
import useCatalogData from '../hooks/useCatalogData';
import useStoreOrders from '../hooks/useStoreOrders';

export default function ProductCatalog({ user, onLogout }) {
  const isAdmin = user.role === 'admin';
  const [adminView, setAdminView] = useState('overview');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [managingProduct, setManagingProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const store = useCatalogData();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const categories = useMemo(
    () => [...new Set(store.products.map((product) => product.category).filter(Boolean))].sort(),
    [store.products],
  );
  const currentSelectedProduct = selectedProduct
    ? store.products.find((product) => product.id === selectedProduct.id) || selectedProduct
    : null;
  const metrics = {
    available: store.products.filter((product) => product.isAvailable !== false && product.stock > 0).length,
    pending: store.orders.filter((order) => order.status === 'Processing').length,
    lowStock: store.products.filter((product) => product.stock < 10).length,
    sales: store.orders
      .filter((order) => order.status !== 'Cancelled')
      .reduce((total, order) => total + Number(order.total || 0), 0),
  };

  const orders = useStoreOrders({
    user, cart, cartTotal, products: store.products, orders: store.orders,
    setOrders: store.setOrders, commitProducts: store.commitProducts,
    setError: store.setError, setNotice: store.setNotice,
    clearCart: () => { setCart([]); setCartOpen(false); },
  });

  function addToCart(product, quantity = 1) {
    const current = store.products.find((item) => item.id === product.id) || product;
    if (current.isAvailable === false || current.stock <= 0) return;
    const amount = Math.max(1, Math.floor(Number(quantity) || 1));
    setCart((previous) => {
      const existing = previous.find((item) => item.product.id === current.id);
      if (existing) {
        return previous.map((item) => item.product.id === current.id
          ? { product: current, quantity: Math.min(current.stock, item.quantity + amount) }
          : item);
      }
      return [...previous, { product: current, quantity: Math.min(current.stock, amount) }];
    });
    setCartOpen(true);
  }

  function updateCartQuantity(productId, quantity) {
    setCart((previous) => previous
      .map((item) => {
        if (item.product.id !== productId) return item;
        const current = store.products.find((product) => product.id === productId) || item.product;
        return { product: current, quantity: Math.min(Math.max(quantity, 0), current.stock) };
      })
      .filter((item) => item.quantity > 0));
  }

  function navigateAdmin(view) {
    setAdminView(view);
    store.setError('');
    store.setNotice('');
    setManagingProduct(null);
  }

  function saveManagedProduct(product) {
    const save = managingProduct.isNew ? store.createProduct : store.saveProduct;
    if (save(product)) setManagingProduct(null);
  }

  function deleteManagedProduct(product) {
    if (store.deleteProduct(product)) setManagingProduct(null);
  }

  return (
    <div className={`mx-auto min-h-screen max-w-[1100px] px-5 py-[30px] max-[600px]:py-5 ${isAdmin ? 'grid grid-cols-[190px_minmax(0,1fr)] content-start gap-x-6 max-[600px]:block' : ''}`}>
      <header className={`mb-5 flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start ${isAdmin ? 'col-span-full' : ''}`}>
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Super Market</p><h1 className="m-0 text-3xl font-bold text-slate-900">{isAdmin ? 'Admin dashboard' : 'Customer catalog'}</h1></div>
        <div className="flex items-center gap-3.5 max-[600px]:flex-wrap">
          <span className="text-sm text-slate-700">Signed in as <strong>{user.username}</strong></span>
          {!isAdmin && (
            <button type="button" className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 font-bold text-white" onClick={() => setCartOpen(true)}>
              Cart <strong className="grid size-5 place-items-center rounded-full bg-slate-200 text-xs text-slate-900">{cartCount}</strong>
            </button>
          )}
          <button type="button" className="rounded-lg bg-slate-900 px-3.5 py-2.5 text-sm font-bold text-white hover:bg-slate-700" onClick={onLogout}>Logout</button>
        </div>
      </header>

      {isAdmin ? (
        <AdminSidebar activeView={adminView} pendingOrders={metrics.pending} onNavigate={navigateAdmin} />
      ) : (
        <div className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-600">{currentSelectedProduct ? 'Product details' : 'Find your next favorite'}</div>
      )}

      {store.notice && <div className="col-start-2 mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 max-[600px]:col-auto" role="status">{store.notice}</div>}
      {store.error && <p className="col-start-2 mb-5 text-red-700 max-[600px]:col-auto" role="alert">{store.error}</p>}
      {store.loading && <p className="col-start-2 mb-5 text-slate-700 max-[600px]:col-auto">Loading products...</p>}

      {isAdmin && adminView !== 'products' && (
        <main className="col-start-2 pb-10 max-[600px]:col-auto">
          <AdminDashboard
            view={adminView}
            products={store.products}
            orders={store.orders}
            metrics={metrics}
            onNavigate={navigateAdmin}
            onRestock={(product) => setManagingProduct(product)}
            onUpdateStatus={orders.updateOrderStatus}
          />
        </main>
      )}

      {(!isAdmin || adminView === 'products') && (
        <main className={isAdmin ? 'col-start-2 pb-10 max-[600px]:col-auto' : ''}>
          {currentSelectedProduct && !isAdmin ? (
            <ProductDetail
              key={currentSelectedProduct.id}
              product={currentSelectedProduct}
              products={store.products}
              onBack={() => setSelectedProduct(null)}
              onSelectProduct={setSelectedProduct}
              onAddToCart={addToCart}
            />
          ) : (
            <>
              {isAdmin && (
                <div className="mb-5 mt-1 flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start">
                  <div><p className="m-0 text-xs font-extrabold uppercase tracking-widest text-slate-500">Catalog management</p><h2 className="mb-0 mt-1 text-3xl font-bold text-slate-900">Products</h2></div>
                  <button type="button" className="rounded-lg bg-slate-800 px-4 py-3 font-bold text-white hover:bg-slate-700" onClick={() => setManagingProduct({ isNew: true })}>
                    + Add product
                  </button>
                </div>
              )}
              <ProductListing
                products={store.products}
                categories={categories}
                isAdmin={isAdmin}
                loading={store.loading}
                onSelectProduct={setSelectedProduct}
                onManageProduct={setManagingProduct}
                onAdjustStock={store.saveProduct}
              />
            </>
          )}
        </main>
      )}

      {managingProduct && isAdmin && (
        <ProductManager
          key={managingProduct.id || 'new-product'}
          product={managingProduct.isNew ? null : managingProduct}
          onSave={saveManagedProduct}
          onDelete={deleteManagedProduct}
          onClose={() => setManagingProduct(null)}
        />
      )}
      {cartOpen && !isAdmin && (
        <ShoppingCart
          cart={cart}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onClose={() => setCartOpen(false)}
          onChangeQuantity={updateCartQuantity}
          onPlaceOrder={orders.placeOrder}
        />
      )}
    </div>
  );
}
