import { useState } from 'react';

export default function ProductManager({ product, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(product?.title || '');
  const [category, setCategory] = useState(product?.category || '');
  const [description, setDescription] = useState(product?.description || '');
  const [thumbnail, setThumbnail] = useState(product?.thumbnail || '');
  const [stock, setStock] = useState(String(product?.stock ?? 0));
  const [price, setPrice] = useState(String(product?.price ?? ''));
  const [isAvailable, setIsAvailable] = useState(product?.isAvailable !== false);

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      ...product,
      title: title.trim(),
      category: category.trim().toLowerCase(),
      description: description.trim(),
      thumbnail: thumbnail.trim(),
      stock: Number(stock),
      price: Number(price),
      isAvailable,
    });
  }

  return (
    <div className="fixed inset-0 z-10 grid place-items-center bg-slate-900/55 p-5" onClick={onClose}>
      <section
        className="max-h-[calc(100vh-40px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl max-[600px]:p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manager-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex justify-between gap-4">
          <div>
            <p className="m-0 text-xs font-extrabold uppercase tracking-widest text-slate-500">{product ? 'Inventory management' : 'Product catalog'}</p>
            <h2 id="manager-title" className="my-1.5 text-2xl font-bold text-slate-900">{product ? 'Manage product' : 'Add product'}</h2>
            {product && <p className="m-0 text-slate-500">{product.title}</p>}
          </div>
          <button type="button" className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-xl text-slate-700 hover:bg-slate-200" onClick={onClose} aria-label="Close product manager">×</button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 font-semibold text-slate-800">
            <span>Product name</span>
            <input className="w-full rounded-lg border border-slate-300 px-3.5 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" required maxLength="120" value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label className="flex flex-col gap-2 font-semibold text-slate-800">
            <span>Category</span>
            <input className="w-full rounded-lg border border-slate-300 px-3.5 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" required maxLength="60" value={category} onChange={(event) => setCategory(event.target.value)} />
          </label>
          <label className="flex flex-col gap-2 font-semibold text-slate-800">
            <span>Description</span>
            <textarea className="w-full resize-y rounded-lg border border-slate-300 px-3.5 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" required rows="3" maxLength="1000" value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>
          <label className="flex flex-col gap-2 font-semibold text-slate-800">
            <span>Image URL (optional)</span>
            <input className="w-full rounded-lg border border-slate-300 px-3.5 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" type="url" value={thumbnail} onChange={(event) => setThumbnail(event.target.value)} />
          </label>
          <label className="flex flex-col gap-2 font-semibold text-slate-800">
            <span>Stock quantity</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3.5 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              type="number"
              min="0"
              step="1"
              required
              value={stock}
              onChange={(event) => setStock(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-2 font-semibold text-slate-800">
            <span>Price ($)</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3.5 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              type="number"
              min="0"
              step="0.01"
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </label>
          <label className="flex items-start gap-2.5 text-slate-800">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(event) => setIsAvailable(event.target.checked)}
            />
            <span className="grid gap-1">
              <strong className="text-sm">Listing enabled</strong>
              <small className="text-sm leading-relaxed text-slate-500">Customers can see this product when the listing is enabled.</small>
            </span>
          </label>
          <div className="flex flex-wrap justify-end gap-2.5">
            {product && onDelete && (
              <button type="button" className="mr-auto rounded-lg bg-red-100 px-3.5 py-2.5 font-bold text-red-800 max-[600px]:mr-0 max-[600px]:basis-full" onClick={() => onDelete(product)}>Delete</button>
            )}
            <button type="button" className="rounded-lg border border-slate-300 px-3.5 py-2.5 font-bold text-slate-700 max-[600px]:flex-1" onClick={onClose}>Cancel</button>
            <button type="submit" className="rounded-lg bg-slate-900 px-3.5 py-2.5 font-bold text-white hover:bg-slate-700 max-[600px]:flex-1">{product ? 'Save changes' : 'Add product'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
