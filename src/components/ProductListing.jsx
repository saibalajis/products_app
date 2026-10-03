import { useState } from 'react';
import Pagination from './Pagination';
import ProductCard from './ProductCard';

const PAGE_SIZE = 8;

export default function ProductListing({
  products, categories, isAdmin, loading, onSelectProduct, onManageProduct, onAdjustStock,
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const visibleProducts = products.filter((product) => (
    product.title.toLowerCase().includes(search.toLowerCase())
    && (category === 'all' || product.category === category)
    && (isAdmin || product.isAvailable !== false)
  ));
  const pageProducts = visibleProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const inventory = {
    available: products.filter((product) => product.isAvailable !== false && product.stock > 0).length,
    empty: products.filter((product) => product.isAvailable !== false && product.stock <= 0).length,
    disabled: products.filter((product) => product.isAvailable === false).length,
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-4">
        <label className="flex min-w-45 flex-1 flex-col gap-2 font-semibold text-slate-800">
          <span>Search products</span>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
          />
        </label>
        <label className="flex min-w-45 flex-1 flex-col gap-2 font-semibold text-slate-800">
          <span>Category</span>
          <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}>
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      {isAdmin && (
        <section className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3" aria-label="Inventory summary">
          {[
            ['Total products', products.length],
            ['Available to buy', inventory.available],
            ['Out of stock', inventory.empty],
            ['Listings disabled', inventory.disabled],
          ].map(([label, value]) => (
            <div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500" key={label}>
              <span>{label}</span><strong className="text-2xl text-slate-900">{value}</strong>
            </div>
          ))}
        </section>
      )}

      {loading && <p className="mb-5 text-slate-700">Loading products...</p>}
      {!loading && pageProducts.length === 0 && <p className="mb-5 text-slate-700">No products found.</p>}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        {pageProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdmin={isAdmin}
            onSelect={onSelectProduct}
            onManage={onManageProduct}
            onAdjustStock={onAdjustStock}
          />
        ))}
      </div>
      {!loading && visibleProducts.length > 0 && (
        <Pagination
          currentPage={page}
          totalItems={visibleProducts.length}
          itemsPerPage={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
