import { useState, useEffect } from 'react';
import '../App.css';
import Pagination from './Pagination';

const PRODUCTS_PER_PAGE = 8;

export default function ProductCatalog({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://dummyjson.com/products');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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
          <article key={product.id} className="product-card">
            <img src={product.thumbnail} alt={product.title} />
            <div className="product-content">
              <div className="product-meta">
                <span className="category-tag">{product.category}</span>
                <span className="price">${product.price.toFixed(2)}</span>
              </div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              {user.role === 'admin' && (
                <button type="button" className="manage-btn">
                  Manage product
                </button>
              )}
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
    </div>
  );
}


