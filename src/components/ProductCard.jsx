function StockStepper({ product, onAdjust }) {
  return (
    <div className="mt-3.5 flex items-center justify-between gap-3 text-sm font-bold text-slate-600" onClick={(event) => event.stopPropagation()}>
      <span>Adjust stock</span>
      <div className="inline-flex items-center gap-3.5 rounded-lg border border-slate-200 bg-white p-1" aria-label={`${product.title} stock controls`}>
        <button
          className="grid size-8 place-items-center rounded-md bg-slate-100 text-lg text-slate-800 disabled:cursor-not-allowed disabled:text-slate-400"
          type="button"
          onClick={() => onAdjust({ ...product, stock: Math.max(0, product.stock - 1) })}
          disabled={product.stock <= 0}
          aria-label={`Remove one ${product.title} from stock`}
        >
          −
        </button>
        <strong aria-live="polite">{product.stock}</strong>
        <button
          className="grid size-8 place-items-center rounded-md bg-slate-100 text-lg text-slate-800"
          type="button"
          onClick={() => onAdjust({ ...product, stock: product.stock + 1 })}
          aria-label={`Add one ${product.title} to stock`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function ProductCard({ product, isAdmin, onSelect, onManage, onAdjustStock }) {
  const stockClass = product.isAvailable === false
    ? 'inventory-disabled'
    : product.stock > 0 ? 'inventory-available' : 'inventory-empty';

  function handleKeyDown(event) {
    if (!isAdmin && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onSelect(product);
    }
  }

  return (
    <article
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white transition ${isAdmin ? '' : 'cursor-pointer hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-slate-500'}`}
      role={isAdmin ? undefined : 'button'}
      tabIndex={isAdmin ? undefined : 0}
      onClick={isAdmin ? undefined : () => onSelect(product)}
      onKeyDown={handleKeyDown}
    >
      <img className="block h-60 w-full object-scale-down max-[600px]:h-50" src={product.thumbnail} alt={product.title} />
      <div className="p-4">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs uppercase text-slate-600">{product.category}</span>
          <span className="font-bold text-slate-900">${product.price.toFixed(2)}</span>
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">{product.title}</h3>
        <p className="m-0 line-clamp-3 leading-relaxed text-slate-600">{product.description}</p>
        <span className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-bold ${stockClass === 'inventory-disabled' ? 'bg-red-100 text-red-800' : stockClass === 'inventory-available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
          {product.isAvailable === false ? 'Listing disabled · ' : ''}
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
        {isAdmin ? (
          <>
            <StockStepper product={product} onAdjust={onAdjustStock} />
            <button type="button" className="mt-3.5 w-full rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-bold text-white hover:bg-slate-700" onClick={() => onManage(product)}>
              Manage product details
            </button>
          </>
        ) : <span className="mt-3.5 block text-sm font-bold text-slate-700">View product details →</span>}
      </div>
    </article>
  );
}
