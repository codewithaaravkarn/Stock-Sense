import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate } from '../utils/calculations';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ShoppingBag,
  Truck,
  Calendar,
  AlertCircle,
  FileText,
  Clock,
  Zap,
} from 'lucide-react';

export default function RestockRecommendations() {
  const products = useStore((s) => s.products);
  const recommendations = useStore((s) => s.recommendations);
  const approveRecommendation = useStore((s) => s.approveRecommendation);
  const ignoreRecommendation = useStore((s) => s.ignoreRecommendation);
  const refreshRecommendations = useStore((s) => s.refreshRecommendations);
  const addToast = useStore((s) => s.addToast);

  const [tab, setTab] = useState<'pending' | 'approved' | 'ignored' | 'all'>('pending');

  const detailedRecs = useMemo(() => {
    return recommendations
      .map((r) => {
        const product = products.find((p) => p.id === r.productId);
        return {
          ...r,
          product,
        };
      })
      .filter((r) => r.product !== undefined);
  }, [recommendations, products]);

  const filteredRecs = useMemo(() => {
    if (tab === 'all') return detailedRecs;
    return detailedRecs.filter((r) => r.status === tab);
  }, [detailedRecs, tab]);

  const pendingRecs = useMemo(() => {
    return detailedRecs.filter((r) => r.status === 'pending');
  }, [detailedRecs]);

  const totalInvestment = useMemo(() => {
    return pendingRecs.reduce((sum, r) => {
      if (!r.product) return sum;
      return sum + r.recommendedQty * (r.product.price * 0.7); // 70% wholesale cost
    }, 0);
  }, [pendingRecs]);

  const handleApproveAll = () => {
    pendingRecs.forEach((r) => {
      approveRecommendation(r.productId);
    });
    addToast(`Approved all ${pendingRecs.length} restock recommendations`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Smart Inventory Replenishment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Restock Recommendations</h1>
            <p className="text-indigo-200/80 text-sm mt-1 max-w-xl">
              Automated reorder calculations factoring in supplier lead times, sales velocity, safety stock buffers, and EOQ principles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshRecommendations}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md border border-white/10 transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recalculate</span>
            </button>

            {pendingRecs.length > 0 && (
              <button
                onClick={handleApproveAll}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 transition flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4" />
                <span>Approve All ({pendingRecs.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Orders
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{pendingRecs.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Products requiring reorder</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Est. Wholesale Cost
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{formatCurrency(totalInvestment)}</p>
            <p className="text-xs text-slate-500 mt-0.5">Approx. PO procurement value</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Approved Orders
            </span>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">
              {detailedRecs.filter((r) => r.status === 'approved').length}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Restocked into inventory</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          {(['pending', 'approved', 'ignored', 'all'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                tab === t
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t} {t === 'pending' && `(${pendingRecs.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      {filteredRecs.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">All caught up!</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            No restock recommendations found for tab "{tab}". All critical stock items have been addressed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRecs.map((rec) => {
            const { product } = rec;
            if (!product) return null;

            const unitCost = Math.round(product.price * 0.7);
            const totalPoCost = rec.recommendedQty * unitCost;

            return (
              <div
                key={rec.productId}
                className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 transition ${
                  rec.status === 'approved'
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : rec.status === 'ignored'
                    ? 'border-slate-200 opacity-60'
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                {/* Top header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                    <span className="text-xs text-slate-500 font-mono">SKU: {product.sku}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border ${
                      rec.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : rec.status === 'ignored'
                        ? 'bg-slate-100 text-slate-500 border-slate-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>

                {/* Key stats row */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Stock</span>
                    <span className="text-sm font-extrabold text-slate-800">{product.currentStock} {product.unit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-500 block">Recommended Qty</span>
                    <span className="text-base font-black text-indigo-600">+{rec.recommendedQty} {product.unit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. PO Value</span>
                    <span className="text-sm font-extrabold text-slate-800">{formatCurrency(totalPoCost)}</span>
                  </div>
                </div>

                {/* AI Explanation Reason Box */}
                <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100/80 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Restock Justification</span>
                  </div>
                  <p className="leading-relaxed text-slate-600">{rec.reason}</p>
                </div>

                {/* Supplier & Lead time info */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Supplier: <strong className="text-slate-700">{product.supplier}</strong></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lead time: <strong className="text-slate-700">{product.leadTimeDays} days</strong></span>
                  </div>
                </div>

                {/* Action Buttons */}
                {rec.status === 'pending' && (
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        approveRecommendation(rec.productId);
                      }}
                      className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Purchase Order</span>
                    </button>
                    <button
                      onClick={() => {
                        ignoreRecommendation(rec.productId);
                      }}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition flex items-center justify-center"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
