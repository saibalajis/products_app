import { LOW_STOCK_THRESHOLD, ORDER_STATUSES } from '../store/storeStorage';

const statusClasses = {
  Processing: 'bg-amber-100 text-amber-800',
  Shipped: 'bg-slate-200 text-slate-700',
  Delivered: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-red-100 text-red-800',
};
const statusBars = {
  Processing: 'bg-amber-600',
  Shipped: 'bg-slate-500',
  Delivered: 'bg-emerald-600',
  Cancelled: 'bg-red-500',
};

function DashboardMetric({ label, value, detail, warning = false }) {
  return (
    <article className={`grid gap-2 rounded-xl border border-slate-200 bg-white p-5 ${warning ? 'border-l-4 border-l-red-500' : ''}`}>
      <span className="text-sm font-bold text-slate-500">{label}</span>
      <strong className={`text-3xl text-slate-900 ${warning ? 'text-red-700' : ''}`}>{value}</strong>
      <small className="text-xs text-slate-500">{detail}</small>
    </article>
  );
}

function Overview({ products, orders, metrics, onNavigate, onRestock }) {
  const attentionProducts = products
    .filter((product) => product.stock < LOW_STOCK_THRESHOLD)
    .sort((left, right) => left.stock - right.stock)
    .slice(0, 6);
  const inventoryValue = products.reduce((total, product) => total + product.price * product.stock, 0);
  const orderStatuses = ORDER_STATUSES.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));
  const categoryStock = Object.entries(products.reduce((totals, product) => {
    const category = product.category || 'Uncategorized';
    totals[category] = (totals[category] || 0) + product.stock;
    return totals;
  }, {})).sort((left, right) => right[1] - left[1]).slice(0, 5);
  const highestCategoryStock = Math.max(1, ...categoryStock.map(([, stock]) => stock));

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start">
        <div><p className="m-0 text-xs font-extrabold uppercase tracking-widest text-slate-500">Store management</p><h2 className="mb-0 mt-1 text-3xl font-bold text-slate-900">Overview</h2></div>
        <button type="button" className="rounded-lg bg-slate-800 px-4 py-3 font-bold text-white hover:bg-slate-700" onClick={() => onNavigate('products')}>Manage products</button>
      </div>
      <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Store metrics">
        <DashboardMetric label="Products" value={products.length} detail={`${metrics.available} available to buy`} />
        <DashboardMetric label="Orders" value={orders.length} detail={`${metrics.pending} need processing`} />
        <DashboardMetric label="Sales" value={`$${metrics.sales.toFixed(2)}`} detail="Excludes cancelled orders" />
        <DashboardMetric label="Low stock" value={metrics.lowStock} detail={`Below ${LOW_STOCK_THRESHOLD} units`} warning={metrics.lowStock > 0} />
      </section>
      <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Additional store metrics">
        <DashboardMetric label="Inventory value" value={`$${inventoryValue.toFixed(2)}`} detail="Retail value of on-hand stock" />
        <DashboardMetric label="Units in stock" value={products.reduce((total, product) => total + product.stock, 0)} detail="Across all products" />
        <DashboardMetric label="Disabled listings" value={products.filter((product) => product.isAvailable === false).length} detail="Hidden from customers" />
        <DashboardMetric label="Avg. order value" value={`$${orders.length ? (metrics.sales / Math.max(1, orders.filter((order) => order.status !== 'Cancelled').length)).toFixed(2) : '0.00'}`} detail="For active orders" />
      </section>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><p className="m-0 text-xs font-extrabold uppercase tracking-widest text-slate-500">Needs attention</p><h3 className="mb-0 mt-1 text-lg font-bold text-slate-900">Low inventory</h3></div>
            <button type="button" className="font-bold text-slate-700 underline" onClick={() => onNavigate('products')}>View products</button>
          </div>
          {attentionProducts.length === 0 ? <p className="py-3 text-slate-500">All products have sufficient stock.</p> : (
            <div>
              {attentionProducts.map((product) => (
                <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-t border-slate-100 py-3 text-sm text-slate-700 max-[600px]:grid-cols-[minmax(0,1fr)_auto]" key={product.id}>
                  <span className="truncate">{product.title}</span><strong className="whitespace-nowrap text-slate-900">{product.stock} left</strong>
                  <button type="button" className="rounded-md bg-slate-800 px-2.5 py-2 text-xs font-bold text-white max-[600px]:col-start-2" onClick={() => onRestock(product)}>Restock</button>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><p className="m-0 text-xs font-extrabold uppercase tracking-widest text-slate-500">Latest activity</p><h3 className="mb-0 mt-1 text-lg font-bold text-slate-900">Recent orders</h3></div>
            <button type="button" className="font-bold text-slate-700 underline" onClick={() => onNavigate('orders')}>View all</button>
          </div>
          {orders.length === 0 ? <p className="py-3 text-slate-500">Customer orders will appear here.</p> : (
            <div>
              {orders.slice(0, 5).map((order) => (
                <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-t border-slate-100 py-3 text-sm text-slate-700 max-[600px]:grid-cols-[minmax(0,1fr)_auto]" key={order.id}>
                  <span className="truncate">{order.id} · {order.customer}</span>
                  <strong className="text-slate-900">${Number(order.total).toFixed(2)}</strong>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold max-[600px]:col-start-2 ${statusClasses[order.status]}`}>{order.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><p className="m-0 text-xs font-extrabold uppercase tracking-widest text-slate-500">Fulfillment</p><h3 className="mb-0 mt-1 text-lg font-bold text-slate-900">Order status</h3></div>
            <button type="button" className="font-bold text-slate-700 underline" onClick={() => onNavigate('orders')}>Manage orders</button>
          </div>
          <div className="grid gap-4">
            {orderStatuses.map(({ status, count }) => (
              <div className="grid grid-cols-[92px_minmax(40px,1fr)_28px] items-center gap-3" key={status}>
                <span className={`rounded-full px-2.5 py-1 text-center text-xs font-bold ${statusClasses[status]}`}>{status}</span>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100" aria-label={`${count} ${status.toLowerCase()} orders`}>
                  <span className={`block h-full rounded-full ${statusBars[status]}`} style={{ width: `${orders.length ? (count / orders.length) * 100 : 0}%` }} />
                </div>
                <strong className="text-right text-sm text-slate-700">{count}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><p className="m-0 text-xs font-extrabold uppercase tracking-widest text-slate-500">Stock distribution</p><h3 className="mb-0 mt-1 text-lg font-bold text-slate-900">Inventory by category</h3></div>
            <button type="button" className="font-bold text-slate-700 underline" onClick={() => onNavigate('products')}>View products</button>
          </div>
          {categoryStock.length === 0 ? <p className="py-3 text-slate-500">Add products to see category stock.</p> : (
            <div className="grid gap-4">
              {categoryStock.map(([category, stock]) => (
                <div className="grid gap-2" key={category}>
                  <div className="flex justify-between gap-3 text-sm text-slate-700"><strong>{category}</strong><span className="text-slate-500">{stock} units</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <span className="block h-full rounded-full bg-linear-to-r from-slate-500 to-slate-300" style={{ width: `${(stock / highestCategoryStock) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function Orders({ orders, onUpdateStatus }) {
  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div><p className="m-0 text-xs font-extrabold uppercase tracking-widest text-slate-500">Store management</p><h2 className="mb-0 mt-1 text-3xl font-bold text-slate-900">Orders</h2></div>
      </div>
      {orders.length === 0 ? <section className="rounded-xl border border-slate-200 bg-white p-5 text-slate-500">No orders yet. Customer checkouts will appear here.</section> : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left">
            <thead><tr>{['Order', 'Customer', 'Items', 'Total', 'Date', 'Status'].map((heading) => <th className="whitespace-nowrap bg-slate-50 px-4 py-3 text-xs uppercase text-slate-500" key={heading}>{heading}</th>)}</tr></thead>
            <tbody>{orders.map((order) => (
              <tr key={order.id}>
                <td className="whitespace-nowrap border-t border-slate-100 px-4 py-3 text-sm text-slate-700"><strong>{order.id}</strong></td>
                <td className="whitespace-nowrap border-t border-slate-100 px-4 py-3 text-sm text-slate-700">{order.customer}</td>
                <td className="whitespace-nowrap border-t border-slate-100 px-4 py-3 text-sm text-slate-700">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td className="whitespace-nowrap border-t border-slate-100 px-4 py-3 text-sm text-slate-700">${Number(order.total).toFixed(2)}</td>
                <td className="whitespace-nowrap border-t border-slate-100 px-4 py-3 text-sm text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="whitespace-nowrap border-t border-slate-100 px-4 py-3 text-sm text-slate-700">
                  <select
                    className={`cursor-pointer rounded-full border-0 px-2.5 py-1.5 text-xs font-bold ${statusClasses[order.status]}`}
                    value={order.status}
                    onChange={(event) => onUpdateStatus(order.id, event.target.value)}
                    aria-label={`Status for order ${order.id}`}
                  >
                    {ORDER_STATUSES.filter((status) => (
                      order.status === 'Cancelled' || order.status === 'Delivered'
                        ? status === order.status
                        : true
                    )).map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function AdminDashboard(props) {
  if (props.view === 'overview') return <Overview {...props} />;
  if (props.view === 'orders') return <Orders {...props} />;
  return null;
}
