import { useState } from 'react';

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function getReviewDate(date) {
  if (!date) return 'Recent review';
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? 'Recent review'
    : parsedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

function ProductTile({ product, onSelect }) {
  return (
    <button
      type="button"
      className="flex min-w-0 flex-col items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 text-left text-slate-800 transition hover:-translate-y-0.5 hover:shadow-lg"
      onClick={() => onSelect(product)}
    >
      <img className="h-32 w-full object-contain" src={product.thumbnail} alt={product.title} />
      <span className="line-clamp-2 min-h-10 leading-snug">{product.title}</span>
      <span className="text-sm text-amber-700">★ {Number(product.rating || 0).toFixed(1)}</span>
      <strong>{formatPrice(product.price)}</strong>
    </button>
  );
}

export default function ProductDetail({ product, products, onBack, onSelectProduct, onAddToCart }) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const images = product.images?.length ? product.images : [product.thumbnail];
  const reviews = product.reviews || [];
  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.isAvailable !== false && item.category === product.category)
    .slice(0, 4);
  const recommendations = relatedProducts.length
    ? relatedProducts
    : products.filter((item) => item.id !== product.id && item.isAvailable !== false).slice(0, 4);
  const discount = Math.round(product.discountPercentage || 0);
  const stock = Number(product.stock || 0);
  const canPurchase = product.isAvailable !== false && stock > 0;

  return (
    <main className="pb-9 pt-1.5">
      <button type="button" className="mb-4 bg-transparent py-2 font-bold text-slate-700 hover:text-slate-950" onClick={onBack}>
        ← Back to products
      </button>

      <section className="grid grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] items-start gap-[clamp(28px,5vw,64px)] rounded-2xl border border-slate-200 bg-white p-[clamp(20px,4vw,42px)] shadow-sm max-[850px]:grid-cols-[minmax(0,0.9fr)_minmax(300px,1.1fr)] max-[850px]:gap-6 max-[600px]:grid-cols-1 max-[600px]:p-[18px]" aria-label={`${product.title} details`}>
        <div className="min-w-0">
          <div className="relative grid min-h-[400px] place-items-center overflow-hidden rounded-xl bg-slate-50 max-[850px]:min-h-80 max-[600px]:min-h-[280px]">
            <img className="h-[400px] w-full object-contain mix-blend-multiply max-[850px]:h-80 max-[600px]:h-[280px]" src={images[activeImage] || product.thumbnail} alt={product.title} />
            {discount > 0 && <span className="absolute left-4 top-4 rounded-full bg-red-700 px-2.5 py-1.5 text-xs font-extrabold text-white">-{discount}%</span>}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2.5 overflow-x-auto" aria-label="Product images">
              {images.slice(0, 5).map((image, index) => (
                <button
                  type="button"
                  className={`h-[66px] w-[66px] shrink-0 rounded-lg bg-white p-1 ${activeImage === index ? 'border-2 border-slate-700' : 'border border-slate-200'}`}
                  key={`${image}-${index}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={activeImage === index}
                >
                  <img className="size-full object-contain" src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="m-0 text-xs font-extrabold uppercase tracking-widest text-slate-500">{product.category}{product.brand ? ` · ${product.brand}` : ''}</p>
          <h2 className="my-2 text-[clamp(1.6rem,3vw,2.25rem)] font-bold leading-tight text-slate-900">{product.title}</h2>
          <a className="mb-3.5 inline-flex items-center gap-2 text-sm text-slate-700 no-underline" href="#customer-reviews">
            <span className="tracking-widest text-amber-600">{'★'.repeat(Math.max(0, Math.round(product.rating || 0)))}</span>
            <span>{Number(product.rating || 0).toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
          </a>
          <p className="mb-5 leading-relaxed text-slate-600">{product.description}</p>

          <div className="flex items-baseline gap-3">
            <strong className="text-3xl text-slate-900">{formatPrice(product.price)}</strong>
            {discount > 0 && <span className="text-sm font-bold text-emerald-700">Save {discount}% today</span>}
          </div>
          <div className="my-4 h-px bg-slate-200" />

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className={`mb-3.5 font-bold ${canPurchase ? 'text-emerald-700' : 'text-red-700'}`}>
              {product.isAvailable === false
                ? 'This product is currently unavailable'
                : stock > 0 ? `In stock${stock < 10 ? ` — only ${stock} left` : ''}` : 'Currently unavailable'}
            </p>
            <label className="mb-3 flex items-center gap-3 text-sm font-bold text-slate-700">
              Quantity
              <select
                className="rounded-md border border-slate-300 bg-white px-3 py-2 disabled:opacity-50"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                disabled={!canPurchase}
              >
                {Array.from({ length: Math.min(Math.max(stock, 1), 10) }, (_, index) => index + 1).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="w-full rounded-full bg-slate-800 px-3 py-3 font-extrabold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canPurchase}
              onClick={() => onAddToCart(product, quantity)}
            >
              Add to cart
            </button>
            <button
              type="button"
              className="mt-2 w-full rounded-full bg-slate-200 px-3 py-3 font-extrabold text-slate-800 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canPurchase}
              onClick={() => onAddToCart(product, quantity)}
            >
              Buy now
            </button>
            <dl className="mt-4 grid gap-2.5 text-sm text-slate-600">
              <div className="grid grid-cols-[72px_1fr] gap-2"><dt className="text-slate-500">Ships</dt><dd className="m-0">{product.shippingInformation || 'Usually ships in 1–2 days'}</dd></div>
              <div className="grid grid-cols-[72px_1fr] gap-2"><dt className="text-slate-500">Returns</dt><dd className="m-0">{product.returnPolicy || '30-day returns'}</dd></div>
              {product.warrantyInformation && (
                <div className="grid grid-cols-[72px_1fr] gap-2"><dt className="text-slate-500">Warranty</dt><dd className="m-0">{product.warrantyInformation}</dd></div>
              )}
            </dl>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-[clamp(20px,4vw,34px)]">
        <h3 className="my-1 text-2xl font-bold text-slate-900">About this item</h3>
        <p className="max-w-3xl leading-relaxed text-slate-600">{product.description}</p>
        <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
          {product.brand && <div className="grid gap-1 rounded-lg bg-slate-50 p-3"><span className="text-xs text-slate-500">Brand</span><strong className="text-sm text-slate-800">{product.brand}</strong></div>}
          <div className="grid gap-1 rounded-lg bg-slate-50 p-3"><span className="text-xs text-slate-500">Category</span><strong className="text-sm text-slate-800">{product.category}</strong></div>
          {product.sku && <div className="grid gap-1 rounded-lg bg-slate-50 p-3"><span className="text-xs text-slate-500">Product code</span><strong className="text-sm text-slate-800">{product.sku}</strong></div>}
          {product.warrantyInformation && <div className="grid gap-1 rounded-lg bg-slate-50 p-3"><span className="text-xs text-slate-500">Warranty</span><strong className="text-sm text-slate-800">{product.warrantyInformation}</strong></div>}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-[clamp(20px,4vw,34px)]" id="customer-reviews">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="m-0 text-xs font-extrabold uppercase tracking-widest text-slate-500">Customer feedback</p>
            <h3 className="mb-0 mt-1 text-2xl font-bold text-slate-900">Customer reviews</h3>
          </div>
          <div className="grid gap-1 text-right text-xs text-slate-500"><strong className="text-lg text-slate-900">★ {Number(product.rating || 0).toFixed(1)}</strong><span>out of 5</span></div>
        </div>
        {reviews.length > 0 ? (
          <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-3.5">
            {reviews.slice(0, 5).map((review, index) => (
              <article className="rounded-xl border border-slate-200 p-4" key={`${review.reviewerEmail || review.reviewerName}-${index}`}>
                <div className="mb-2.5 flex justify-between gap-2 text-sm text-slate-800">
                  <strong>{review.reviewerName || 'Verified customer'}</strong>
                  <span className="text-xs text-slate-400">{getReviewDate(review.date)}</span>
                </div>
                <div className="tracking-widest text-amber-600" aria-label={`${review.rating || 0} out of 5 stars`}>
                  {'★'.repeat(Math.max(0, Math.round(review.rating || 0)))}
                  <span className="text-slate-300">{'★'.repeat(Math.max(0, 5 - Math.round(review.rating || 0)))}</span>
                </div>
                <p className="mt-2 leading-relaxed text-slate-600">{review.comment}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-slate-600">No written reviews yet. Be the first to share your thoughts.</p>
        )}
      </section>

      {recommendations.length > 0 && (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-[clamp(20px,4vw,34px)]">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-extrabold uppercase tracking-widest text-slate-500">Picked for you</p>
              <h3 className="mb-0 mt-1 text-2xl font-bold text-slate-900">Similar products</h3>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-4 gap-3.5 max-[850px]:grid-cols-2 max-[600px]:grid-cols-2">
            {recommendations.map((item) => (
              <ProductTile key={item.id} product={item} onSelect={onSelectProduct} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
