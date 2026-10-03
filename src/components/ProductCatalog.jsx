import { useState, useEffect } from 'react';
import '../App.css';
import { getProducts } from '../api/productsApi';
import Pagination from './Pagination';
import ProductDetail from './ProductDetail';

const PRODUCTS_PER_PAGE = 8;

export default function ProductCatalog({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const productList = await getProducts();
        setProducts(productList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const visibleProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || product.category === filter;
    return matchesSearch && matchesFilter;
  });

  const paginatedProducts = visibleProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  function addToCart(product, quantity = 1) {
    setCart((previous) => {
      const existingItem = previous.find((item) => item.product.id === product.id);
      if (existingItem) {
        return previous.map((item) => item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item);
      }
      return [...previous, { product, quantity }];
    });
    setCartOpen(true);
  }

  function updateCartQuantity(productId, quantity) {
    setCart((previous) => previous
      .map((item) => item.product.id === productId ? { ...item, quantity } : item)
      .filter((item) => item.quantity > 0));
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Super Market</p>
          <h1>{user.role === 'admin' ? 'Admin dashboard' : 'Customer catalog'}</h1>
        </div>

        <div className="user-panel">
          <div>
            <span className="user-label">Signed in as : </span>
            <strong>{user.username}</strong>
          </div>
          <button type="button" className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="catalog-cart-bar">
        <span>{selectedProduct ? 'Product details' : 'Find your next favorite'}</span>
        <button type="button" className="cart-trigger" onClick={() => setCartOpen(true)}>
          <span aria-hidden="true">🛒</span> Cart <strong>{cartCount}</strong>
        </button>
      </div>

      {selectedProduct ? (
        <ProductDetail
          key={selectedProduct.id}
          product={selectedProduct}
          products={products}
          onBack={() => setSelectedProduct(null)}
          onSelectProduct={setSelectedProduct}
          onAddToCart={addToCart}
        />
      ) : <>

      <div className="toolbar">
        <label className="search-field">
          <span>Search</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </label>

        <label className="filter-field">
          <span>Category</span>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="beauty">Beauty</option>
            <option value="fragrances">Fragrances</option>
            <option value="furniture">Furniture</option>
            <option value="groceries">Groceries</option>
          </select>
        </label>
      </div>

      {loading && <p className="status-text">Loading products...</p>}
      {error && <p className="status-text status-error">Error: {error}</p>}

      {!loading && !error && visibleProducts.length === 0 && (
        <p className="status-text">No products found for this search.</p>
      )}

      <div className="products-grid">
        {paginatedProducts.map((product) => (
          <article
            key={product.id}
            className="product-card"
            role="button"
            tabIndex={0}
            onClick={() => setSelectedProduct(product)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSelectedProduct(product);
              }
            }}
          >
            <img src={product.thumbnail} alt={product.title} />
            <div className="product-content">
              <div className="product-meta">
                <span className="category-tag">{product.category}</span>
                <span className="price">${product.price.toFixed(2)}</span>
              </div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              {user.role === 'admin' && (
                <button type="button" className="manage-btn" onClick={(event) => event.stopPropagation()}>
                  Manage product
                </button>
              )}
              <span className="view-product-hint">View product details →</span>
            </div>
          </article>
        ))}
      </div>

      {!loading && !error && visibleProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={visibleProducts.length}
          itemsPerPage={PRODUCTS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
      </>}

      {cartOpen && (
        <div className="cart-backdrop" onClick={() => setCartOpen(false)}>
          <aside
            className="cart-drawer"
            aria-label="Shopping cart"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-drawer-header">
              <div><p className="section-kicker">Your order</p><h2>Shopping cart ({cartCount})</h2></div>
              <button type="button" className="close-cart" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button>
            </div>
            {cart.length === 0 ? (
              <div className="empty-cart"><span aria-hidden="true">🛍️</span><h3>Your cart is empty</h3><p>Explore the catalog and add something you love.</p></div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(({ product, quantity }) => (
                    <article className="cart-item" key={product.id}>
                      <img src={product.thumbnail} alt={product.title} />
                      <div className="cart-item-info">
                        <strong>{product.title}</strong>
                        <span>${product.price.toFixed(2)}</span>
                        <div className="cart-quantity">
                          <button type="button" onClick={() => updateCartQuantity(product.id, quantity - 1)} aria-label={`Remove one ${product.title}`}>−</button>
                          <span>{quantity}</span>
                          <button type="button" onClick={() => updateCartQuantity(product.id, quantity + 1)} aria-label={`Add one ${product.title}`}>+</button>
                        </div>
                      </div>
                      <strong>${(product.price * quantity).toFixed(2)}</strong>
                    </article>
                  ))}
                </div>
                <div className="cart-checkout">
                  <div><span>Subtotal</span><strong>${cartTotal.toFixed(2)}</strong></div>
                  <p>Shipping and taxes calculated at checkout.</p>
                  <button type="button" onClick={() => setCartOpen(false)}>Continue shopping</button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}


