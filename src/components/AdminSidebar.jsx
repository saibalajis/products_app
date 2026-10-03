const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'products', label: 'Products' },
  { id: 'orders', label: 'Orders' },
];

function NavIcon({ name }) {
  const paths = {
    overview: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="4" rx="1.5" /><rect x="13.5" y="10.5" width="7" height="10" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /></>,
    products: <><path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z" /><path d="m3.8 7.7 8.2 4.5 8.2-4.5M12 12.2V21M7.8 5.2l8.4 4.6" /></>,
    orders: <><path d="M6 3.5h9l4 4V20a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" /><path d="M14.5 3.8V8h4M8 12h8M8 16h8" /></>,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function AdminSidebar({ activeView, pendingOrders, onNavigate }) {
  return (
    <nav className="fixed left-[max(calc((100vw-1100px)/2+20px),10px)] top-[120px] z-5 flex max-h-[calc(100vh-140px)] w-[170px] flex-col gap-1.5 overflow-y-auto rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-3 shadow-lg shadow-slate-900/5 max-[600px]:static max-[600px]:mb-5 max-[600px]:max-h-none max-[600px]:w-full max-[600px]:flex-row max-[600px]:overflow-x-auto" aria-label="Admin dashboard">
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-2 pb-4 max-[600px]:hidden">
        <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-slate-500 to-slate-800 text-lg font-extrabold text-white shadow-md shadow-slate-500/20" aria-hidden="true">S</span>
        <span className="grid gap-1"><strong className="text-sm text-slate-800">Storefront</strong><small className="text-[10px] font-extrabold tracking-widest text-slate-400">ADMIN WORKSPACE</small></span>
      </div>
      <p className="mx-2 mb-1 mt-3 text-[10px] font-extrabold tracking-widest text-slate-400 max-[600px]:hidden">MANAGE STORE</p>
      {NAV_ITEMS.map(({ id, label }) => (
        <button
          type="button"
          key={id}
          className={`relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm font-bold transition hover:translate-x-0.5 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 max-[600px]:w-auto max-[600px]:shrink-0 max-[600px]:px-2 ${activeView === id ? 'bg-slate-200 text-slate-800 shadow-[inset_3px_0_#596273] max-[600px]:shadow-[inset_0_-3px_#596273]' : 'bg-transparent text-slate-600'}`}
          aria-current={activeView === id ? 'page' : undefined}
          onClick={() => onNavigate(id)}
        >
          <span className={`grid size-7 shrink-0 place-items-center rounded-lg ${activeView === id ? 'bg-slate-300 text-slate-800' : 'bg-slate-100 text-slate-500'}`}><NavIcon name={id} /></span>
          <span>{label}</span>
          {id === 'orders' && pendingOrders > 0 && <span className="ml-auto grid min-h-5 min-w-5 place-items-center rounded-full bg-orange-100 px-1 text-xs font-extrabold text-orange-800">{pendingOrders}</span>}
        </button>
      ))}
      <div className="mt-3 flex items-center gap-2.5 border-t border-slate-200 px-2 pt-3 max-[600px]:hidden">
        <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_#e2f5e9]" aria-hidden="true" />
        <span className="grid gap-1"><strong className="text-xs text-slate-700">Store is live</strong><small className="text-[11px] text-slate-400">Inventory & orders</small></span>
      </div>
    </nav>
  );
}
