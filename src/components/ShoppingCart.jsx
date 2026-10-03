export default function ShoppingCart({
  cart, cartCount, cartTotal, onClose, onChangeQuantity, onPlaceOrder,
}) {
  return (
    <div className="fixed inset-0 z-10 flex justify-end bg-slate-900/45" onClick={onClose}>
      <aside className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white p-7 shadow-2xl max-[600px]:p-5" aria-label="Shopping cart" onClick={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div><p className="m-0 text-xs font-extrabold uppercase tracking-widest text-slate-500">Your order</p><h2 className="mb-0 mt-1 text-xl font-bold text-slate-900">Shopping cart ({cartCount})</h2></div>
          <button type="button" className="grid size-9 place-items-center rounded-full bg-slate-100 text-xl text-slate-700 hover:bg-slate-200" onClick={onClose} aria-label="Close cart">×</button>
        </div>
        {cart.length === 0 ? (
          <div className="grid flex-1 content-center justify-items-center text-center text-slate-500">
            <span className="text-5xl" aria-hidden="true">🛍️</span><h3 className="mb-1 mt-4 text-lg font-bold text-slate-800">Your cart is empty</h3>
            <p className="max-w-65 leading-relaxed">Explore the catalog and add something you love.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {cart.map(({ product, quantity }) => (
                <article className="grid grid-cols-[68px_minmax(0,1fr)_auto] items-start gap-3 border-b border-slate-100 py-4 text-sm text-slate-800" key={product.id}>
                  <img className="size-[68px] rounded-lg bg-slate-50 object-contain" src={product.thumbnail} alt={product.title} />
                  <div className="grid min-w-0 gap-2">
                    <strong className="leading-snug">{product.title}</strong>
                    <span className="text-slate-500">${product.price.toFixed(2)}</span>
                    <div className="inline-flex w-fit items-center gap-3 rounded-md border border-slate-200 px-2 py-1">
                      <button className="text-lg text-slate-700" type="button" onClick={() => onChangeQuantity(product.id, quantity - 1)} aria-label={`Remove one ${product.title}`}>−</button>
                      <span>{quantity}</span>
                      <button
                        className="text-lg text-slate-700 disabled:text-slate-400"
                        type="button"
                        onClick={() => onChangeQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock || product.isAvailable === false}
                        aria-label={`Add one ${product.title}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <strong>${(product.price * quantity).toFixed(2)}</strong>
                </article>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between text-lg text-slate-800"><span>Subtotal</span><strong>${cartTotal.toFixed(2)}</strong></div>
              <p className="text-sm text-slate-500">Shipping and taxes calculated at checkout.</p>
              <button className="w-full rounded-full bg-slate-800 px-3 py-3 font-extrabold text-white hover:bg-slate-700" type="button" onClick={onPlaceOrder}>Place order</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
