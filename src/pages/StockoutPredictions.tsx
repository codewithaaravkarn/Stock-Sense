import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import {
  calculateDaysRemaining,
  getRiskLevel,
  getRiskColor,
  formatCurrency,
  formatDate,
} from '../utils/calculations';
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StockoutPredictions() {
  const navigate = useNavigate();
  const products = useStore((s) => s.products);
  const approveRecommendation = useStore((s) => s.approveRecommendation);
  const recommendations = useStore((s) => s.recommendations);
  const addToast = useStore((s) => s.addToast);

  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const predictions = useMemo(() => {
    return products
      .map((p) => {
        const daysRemaining = calculateDaysRemaining(p);
        const risk = getRiskLevel(daysRemaining);
        const stockoutDate = new Date();
        stockoutDate.setDate(stockoutDate.getDate() + Math.floor(daysRemaining));

        const rec = recommendations.find((r) => r.productId === p.id);

        return {
          product: p,
          daysRemaining,
          risk,
          stockoutDate: stockoutDate.toISOString().split('T')[0],
          recommendation: rec,
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [products, recommendations]);

  const filteredPredictions = useMemo(() => {
    return predictions.filter((item) => {
      const matchesSearch = item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRisk = riskFilter === 'all' || item.risk === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [predictions, searchQuery, riskFilter]);

  const stats = useMemo(() => {
    const critical = predictions.filter((p) => p.risk === 'CRITICAL').length;
    const high = predictions.filter((p) => p.risk === 'HIGH').length;
    const medium = predictions.filter((p) => p.risk === 'MEDIUM').length;
    const low = predictions.filter((p) => p.risk === 'LOW').length;

    const riskRevenue = predictions
      .filter((p) => p.risk === 'CRITICAL' || p.risk === 'HIGH')
      .reduce((sum, p) => sum + p.product.currentStock * p.product.price, 0);

    return { critical, high, medium, low, riskRevenue };
  }, [predictions]);

  const handleRestock = (productId: string, name: string) => {
    approveRecommendation(productId);
    addToast(`Approved restock order for ${name}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Stockout Predictions</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              <Sparkles className="w-3 h-3 text-red-500" />
              AI Powered
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            Predictive stockout dates calculated using current sales velocity and lead time buffers
          </p>
        </div>

        <button
          onClick={() => navigate('/app/restock')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm transition"
        >
          <span>View Restock Recommendations</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setRiskFilter(riskFilter === 'CRITICAL' ? 'all' : 'CRITICAL')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            riskFilter === 'CRITICAL'
              ? 'bg-red-500 text-white border-red-600 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-red-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${riskFilter === 'CRITICAL' ? 'text-red-100' : 'text-slate-500'}`}>
              Critical Risk (&lt;1 Day)
            </span>
            <AlertTriangle className={`w-5 h-5 ${riskFilter === 'CRITICAL' ? 'text-white' : 'text-red-600'}`} />
          </div>
          <p className="text-3xl font-black mt-2">{stats.critical}</p>
          <p className={`text-xs mt-1 ${riskFilter === 'CRITICAL' ? 'text-red-100' : 'text-slate-500'}`}>
            Immediate action required
          </p>
        </div>

        <div
          onClick={() => setRiskFilter(riskFilter === 'HIGH' ? 'all' : 'HIGH')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            riskFilter === 'HIGH'
              ? 'bg-orange-500 text-white border-orange-600 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-orange-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${riskFilter === 'HIGH' ? 'text-orange-100' : 'text-slate-500'}`}>
              High Risk (1-3 Days)
            </span>
            <Clock className={`w-5 h-5 ${riskFilter === 'HIGH' ? 'text-white' : 'text-orange-600'}`} />
          </div>
          <p className="text-3xl font-black mt-2">{stats.high}</p>
          <p className={`text-xs mt-1 ${riskFilter === 'HIGH' ? 'text-orange-100' : 'text-slate-500'}`}>
            Order within 24 hours
          </p>
        </div>

        <div
          onClick={() => setRiskFilter(riskFilter === 'MEDIUM' ? 'all' : 'MEDIUM')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            riskFilter === 'MEDIUM'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-amber-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${riskFilter === 'MEDIUM' ? 'text-amber-100' : 'text-slate-500'}`}>
              Medium Risk (3-7 Days)
            </span>
            <ShieldAlert className={`w-5 h-5 ${riskFilter === 'MEDIUM' ? 'text-white' : 'text-amber-600'}`} />
          </div>
          <p className="text-3xl font-black mt-2">{stats.medium}</p>
          <p className={`text-xs mt-1 ${riskFilter === 'MEDIUM' ? 'text-amber-100' : 'text-slate-500'}`}>
            Monitor daily velocity
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Value at Risk
            </span>
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{formatCurrency(stats.riskRevenue)}</p>
          <p className="text-xs text-slate-500 mt-1">Stock value in high/critical items</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search product or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Filter Risk:</span>
          {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
            <button
              key={risk}
              onClick={() => setRiskFilter(risk)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                riskFilter === risk
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>

      {/* Predictions Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-4">Current Stock</th>
                <th className="py-4 px-4">Daily Sales</th>
                <th className="py-4 px-4">Est. Days Remaining</th>
                <th className="py-4 px-4">Est. Stockout Date</th>
                <th className="py-4 px-4">Risk Level</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPredictions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No products matching your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPredictions.map((item) => {
                  const { product, daysRemaining, risk, stockoutDate, recommendation } = item;
                  const riskColorClass = getRiskColor(risk);

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6">
                        <div
                          onClick={() => navigate(`/app/inventory/${product.id}`)}
                          className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer flex items-center gap-2"
                        >
                          <span>{product.name}</span>
                          <span className="text-xs text-slate-400 font-mono font-normal">({product.sku})</span>
                        </div>
                        <span className="text-xs text-slate-500 capitalize">{product.category}</span>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {product.currentStock} {product.unit}
                      </td>

                      <td className="py-4 px-4 font-medium text-slate-600">
                        {product.avgDailySales} {product.unit}/day
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-900">
                        ~{daysRemaining === Infinity ? 'N/A' : daysRemaining.toFixed(1)} days
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                        {formatDate(stockoutDate)}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${riskColorClass}`}>
                          {risk}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        {recommendation?.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRestock(product.id, product.name)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold transition shadow-sm"
                          >
                            <span>Quick Restock</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
