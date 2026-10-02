import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency, calculateDaysRemaining } from '../utils/calculations';
import {
  FileText,
  Download,
  BarChart2,
  PieChart as PieIcon,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Layers,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export default function Reports() {
  const products = useStore((s) => s.products);
  const bills = useStore((s) => s.bills);
  const addToast = useStore((s) => s.addToast);

  const [activeReport, setActiveReport] = useState<string>('abc');

  const abcAnalysis = useMemo(() => {
    // ABC Analysis based on revenue value: A (Top 70%), B (Next 20%), C (Bottom 10%)
    const sorted = [...products].sort((a, b) => (b.totalSold * b.price) - (a.totalSold * a.price));
    const totalRev = sorted.reduce((sum, p) => sum + p.totalSold * p.price, 0);

    let currentSum = 0;
    return sorted.map((p) => {
      const rev = p.totalSold * p.price;
      currentSum += rev;
      const pct = (currentSum / (totalRev || 1)) * 100;
      let category: 'A' | 'B' | 'C' = 'C';
      if (pct <= 70) category = 'A';
      else if (pct <= 90) category = 'B';
      return { product: p, revenue: rev, category };
    });
  }, [products]);

  const categoryMetrics = useMemo(() => {
    const map: Record<string, { count: number; stockValue: number; sales: number }> = {};
    products.forEach((p) => {
      if (!map[p.category]) map[p.category] = { count: 0, stockValue: 0, sales: 0 };
      map[p.category].count += 1;
      map[p.category].stockValue += p.currentStock * p.price;
      map[p.category].sales += p.totalSold * p.price;
    });
    return Object.entries(map).map(([name, val]) => ({ name, ...val }));
  }, [products]);

  const handleExport = (reportName: string) => {
    addToast(`Exporting ${reportName} to CSV file...`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Reports & Audits</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Exportable inventory valuation, ABC velocity classification, and supplier lead time audits
          </p>
        </div>

        <button
          onClick={() => handleExport('Complete Inventory Summary')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          <Download className="w-4 h-4" />
          <span>Export All Data (.CSV)</span>
        </button>
      </div>

      {/* Report Cards Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          onClick={() => setActiveReport('abc')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            activeReport === 'abc'
              ? 'bg-indigo-900 text-white border-indigo-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${activeReport === 'abc' ? 'text-indigo-200' : 'text-slate-500'}`}>
              ABC Inventory Velocity
            </span>
            <BarChart2 className={`w-5 h-5 ${activeReport === 'abc' ? 'text-indigo-300' : 'text-indigo-600'}`} />
          </div>
          <h3 className="text-lg font-bold mt-2">Class A/B/C Pareto Analysis</h3>
          <p className={`text-xs mt-1 ${activeReport === 'abc' ? 'text-indigo-200/80' : 'text-slate-500'}`}>
            Prioritize high-value SKUs contributing 70% of total store revenue.
          </p>
        </div>

        <div
          onClick={() => setActiveReport('category')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            activeReport === 'category'
              ? 'bg-indigo-900 text-white border-indigo-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${activeReport === 'category' ? 'text-indigo-200' : 'text-slate-500'}`}>
              Category Valuation
            </span>
            <PieIcon className={`w-5 h-5 ${activeReport === 'category' ? 'text-indigo-300' : 'text-indigo-600'}`} />
          </div>
          <h3 className="text-lg font-bold mt-2">Department Stock Value</h3>
          <p className={`text-xs mt-1 ${activeReport === 'category' ? 'text-indigo-200/80' : 'text-slate-500'}`}>
            Financial capital tied up across store departments and categories.
          </p>
        </div>

        <div
          onClick={() => setActiveReport('supplier')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            activeReport === 'supplier'
              ? 'bg-indigo-900 text-white border-indigo-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${activeReport === 'supplier' ? 'text-indigo-200' : 'text-slate-500'}`}>
              Supplier Audit
            </span>
            <Layers className={`w-5 h-5 ${activeReport === 'supplier' ? 'text-indigo-300' : 'text-indigo-600'}`} />
          </div>
          <h3 className="text-lg font-bold mt-2">Vendor Lead Time & Safety Stock</h3>
          <p className={`text-xs mt-1 ${activeReport === 'supplier' ? 'text-indigo-200/80' : 'text-slate-500'}`}>
            Audit distributor lead times and fulfillment risks.
          </p>
        </div>
      </div>

      {/* Active Report View */}
      {activeReport === 'abc' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">ABC Inventory Classification</h2>
              <p className="text-xs text-slate-500">Categorizes products by revenue impact (A: Top 70%, B: Next 20%, C: Bottom 10%)</p>
            </div>
            <button
              onClick={() => handleExport('ABC Analysis Report')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export ABC CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Units Sold</th>
                  <th className="py-3 px-4">Revenue Generated</th>
                  <th className="py-3 px-4">Current Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {abcAnalysis.map(({ product, revenue, category }) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black ${
                          category === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : category === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Class {category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{product.name}</td>
                    <td className="py-3 px-4 capitalize text-slate-500">{product.category}</td>
                    <td className="py-3 px-4 font-semibold">{product.totalSold} {product.unit}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">{formatCurrency(revenue)}</td>
                    <td className="py-3 px-4 font-medium">{product.currentStock} {product.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReport === 'category' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Department Stock Valuation</h2>
              <p className="text-xs text-slate-500">Breakdown of inventory value held in warehouse stock per category</p>
            </div>
            <button
              onClick={() => handleExport('Category Valuation Report')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Category CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">SKU Count</th>
                  <th className="py-3 px-4">Total Inventory Value</th>
                  <th className="py-3 px-4">Historical Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categoryMetrics.map((cat) => (
                  <tr key={cat.name} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 capitalize">{cat.name}</td>
                    <td className="py-3 px-4 font-medium">{cat.count} products</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">{formatCurrency(cat.stockValue)}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-600">{formatCurrency(cat.sales)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReport === 'supplier' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Supplier Lead Time & Safety Buffer Audit</h2>
              <p className="text-xs text-slate-500">Review vendor response times and safety buffer thresholds</p>
            </div>
            <button
              onClick={() => handleExport('Supplier Audit Report')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Supplier CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Lead Time</th>
                  <th className="py-3 px-4">Safety Stock Buffer</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{p.supplier}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{p.name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{p.leadTimeDays} Days</td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">{p.safetyStock} {p.unit}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Optimal
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
