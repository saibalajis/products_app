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
      className="recommendation-card"
      onClick={() => onSelect(product)}
    >
      <img src={product.thumbnail} alt={product.title} />
      <span className="recommendation-title">{product.title}</span>
      <span className="recommendation-rating">★ {Number(product.rating || 0).toFixed(1)}</span>
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
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);
  const recommendations = relatedProducts.length
    ? relatedProducts
    : products.filter((item) => item.id !== product.id).slice(0, 4);
  const discount = Math.round(product.discountPercentage || 0);
  const stock = Number(product.stock || 0);

  return (
    <main className="product-detail-page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Back to products
      </button>

      <section className="product-detail-layout" aria-label={`${product.title} details`}>
        <div className="detail-gallery">
          <div className="detail-image-frame">
            <img src={images[activeImage] || product.thumbnail} alt={product.title} />
            {discount > 0 && <span className="discount-badge">-{discount}%</span>}
          </div>
          {images.length > 1 && (
            <div className="image-thumbnails" aria-label="Product images">
              {images.slice(0, 5).map((image, index) => (
                <button
                  type="button"
                  className={`thumbnail-button ${activeImage === index ? 'selected' : ''}`}
                  key={`${image}-${index}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={activeImage === index}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-copy">
          <p className="detail-category">{product.category}{product.brand ? ` · ${product.brand}` : ''}</p>
          <h2>{product.title}</h2>
          <a className="review-jump" href="#customer-reviews">
            <span className="stars">{'★'.repeat(Math.max(0, Math.round(product.rating || 0)))}</span>
            <span>{Number(product.rating || 0).toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
          </a>
          <p className="detail-description">{product.description}</p>

          <div className="detail-price-row">
            <strong>{formatPrice(product.price)}</strong>
            {discount > 0 && <span>Save {discount}% today</span>}
          </div>
          <div className="detail-divider" />

          <div className="purchase-card">
            <p className={`stock-status ${stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {stock > 0 ? `In stock${stock < 10 ? ` — only ${stock} left` : ''}` : 'Currently unavailable'}
            </p>
            <label className="quantity-field">
              Quantity
              <select
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                disabled={stock === 0}
              >
                {Array.from({ length: Math.min(Math.max(stock, 1), 10) }, (_, index) => index + 1).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="add-cart-btn"
              disabled={stock === 0}
              onClick={() => onAddToCart(product, quantity)}
            >
              Add to cart
            </button>
            <button
              type="button"
              className="buy-now-btn"
              disabled={stock === 0}
              onClick={() => onAddToCart(product, quantity)}
            >
              Buy now
            </button>
            <dl className="delivery-details">
              <div><dt>Ships</dt><dd>{product.shippingInformation || 'Usually ships in 1–2 days'}</dd></div>
              <div><dt>Returns</dt><dd>{product.returnPolicy || '30-day returns'}</dd></div>
              {product.warrantyInformation && (
                <div><dt>Warranty</dt><dd>{product.warrantyInformation}</dd></div>
              )}
            </dl>
          </div>
        </div>
      </section>

      <section className="description-section">
        <h3>About this item</h3>
        <p>{product.description}</p>
        <div className="product-facts">
          {product.brand && <div><span>Brand</span><strong>{product.brand}</strong></div>}
          <div><span>Category</span><strong>{product.category}</strong></div>
          {product.sku && <div><span>Product code</span><strong>{product.sku}</strong></div>}
          {product.warrantyInformation && <div><span>Warranty</span><strong>{product.warrantyInformation}</strong></div>}
        </div>
      </section>

      <section className="reviews-section" id="customer-reviews">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Customer feedback</p>
            <h3>Customer reviews</h3>
          </div>
          <div className="review-summary"><strong>★ {Number(product.rating || 0).toFixed(1)}</strong><span>out of 5</span></div>
        </div>
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.slice(0, 5).map((review, index) => (
              <article className="review-card" key={`${review.reviewerEmail || review.reviewerName}-${index}`}>
                <div className="review-card-top">
                  <strong>{review.reviewerName || 'Verified customer'}</strong>
                  <span>{getReviewDate(review.date)}</span>
                </div>
                <div className="stars" aria-label={`${review.rating || 0} out of 5 stars`}>
                  {'★'.repeat(Math.max(0, Math.round(review.rating || 0)))}
                  <span className="empty-stars">{'★'.repeat(Math.max(0, 5 - Math.round(review.rating || 0)))}</span>
                </div>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-reviews">No written reviews yet. Be the first to share your thoughts.</p>
        )}
      </section>

      {recommendations.length > 0 && (
        <section className="recommendations-section">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Picked for you</p>
              <h3>Similar products</h3>
            </div>
          </div>
          <div className="recommendations-grid">
            {recommendations.map((item) => (
              <ProductTile key={item.id} product={item} onSelect={onSelectProduct} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
