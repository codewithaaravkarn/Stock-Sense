import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Search, Filter, Download, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { calculateDaysRemaining, getRiskLevel, getStockStatus, getRiskColor, getStatusColor, getRestockRecommendation } from '../utils/calculations';
import { categories } from '../data/mockData';

const PAGE_SIZE = 10;

export default function Inventory() {
  const { products } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'risk' | 'sales'>('risk');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = products.map(p => {
      const daysRemaining = calculateDaysRemaining(p);
      return { ...p, daysRemaining, risk: getRiskLevel(daysRemaining), status: getStockStatus(p), rec: getRestockRecommendation(p) };
    });

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'All') result = result.filter(p => p.category === categoryFilter);
    if (statusFilter !== 'All') result = result.filter(p => p.status === statusFilter);
    if (riskFilter !== 'All') result = result.filter(p => p.risk === riskFilter);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'stock') cmp = a.currentStock - b.currentStock;
      else if (sortBy === 'risk') cmp = a.daysRemaining - b.daysRemaining;
      else if (sortBy === 'sales') cmp = b.avgDailySales - a.avgDailySales;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [products, search, categoryFilter, statusFilter, riskFilter, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const exportCSV = () => {
    const headers = 'Product,SKU,Category,Current Stock,Daily Sales,Status,Risk,Days Remaining,Recommended Restock\n';
    const rows = filtered.map(p =>
      `"${p.name}",${p.sku},${p.category},${p.currentStock},${p.avgDailySales},${p.status},${p.risk},${p.daysRemaining.toFixed(1)},${p.rec.recommendedQty}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'inventory_report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
          <p className="text-sm text-slate-500 mt-0.5">{products.length} products · {filtered.length} shown</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products or SKU..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
          />
        </div>
        <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-600">
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-600">
          <option value="All">All Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Critical">Critical</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
        <select value={riskFilter} onChange={e => { setRiskFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-600">
          <option value="All">All Risk</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider cursor-pointer hover:text-primary-600" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Product <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">SKU</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Category</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider cursor-pointer hover:text-primary-600" onClick={() => handleSort('stock')}>
                  <div className="flex items-center gap-1 justify-end">Stock <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-right px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider cursor-pointer hover:text-primary-600" onClick={() => handleSort('sales')}>
                  <div className="flex items-center gap-1 justify-end">Daily Sales <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-center px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider cursor-pointer hover:text-primary-600" onClick={() => handleSort('risk')}>
                  <div className="flex items-center gap-1 justify-center">Risk <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-right px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Days Left</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Restock</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paged.map((p) => (
                <tr key={p.id} onClick={() => navigate(`/app/inventory/${p.id}`)}
                  className="hover:bg-primary-50/30 cursor-pointer transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-700">{p.name}</p>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">{p.category}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-slate-700">{p.currentStock}</td>
                  <td className="px-4 py-3.5 text-right text-slate-600">{p.avgDailySales}/day</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getRiskColor(p.risk)}`}>
                      {p.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-slate-600">
                    {p.daysRemaining === Infinity ? '∞' : `${p.daysRemaining.toFixed(1)}d`}
                  </td>
                  <td className="px-4 py-3.5 text-right text-primary-600 font-bold">
                    {p.rec.recommendedQty > 0 ? `${p.rec.recommendedQty} ${p.unit}` : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/app/inventory/${p.id}`); }}
                      className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                  page === p ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                }`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
