import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, Package, TrendingUp, AlertTriangle, Brain, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { calculateDaysRemaining, getRiskLevel, getStockStatus, getRiskColor, getStatusColor, getRestockRecommendation, generateForecast, formatCurrencyFull } from '../utils/calculations';
import { generateProductSalesHistory } from '../data/mockData';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, addToast } = useStore();
  const product = products.find(p => p.id === productId);

  const salesHistory = useMemo(() => product ? generateProductSalesHistory(product.id, 30) : [], [product]);
  const forecast = useMemo(() => product ? generateForecast(product, 7) : null, [product]);
  const inventoryHistory = useMemo(() => {
    if (!product) return [];
    const data = [];
    let stock = product.openingStock;
    for (let i = 0; i < salesHistory.length; i++) {
      stock = Math.max(0, stock - salesHistory[i].units);
      data.push({ date: salesHistory[i].date, stock });
    }
    return data;
  }, [product, salesHistory]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <Package className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">Product Not Found</h2>
        <button onClick={() => navigate('/app/inventory')} className="text-sm text-primary-600 font-semibold">← Back to Inventory</button>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(product);
  const risk = getRiskLevel(daysRemaining);
  const status = getStockStatus(product);
  const recommendation = getRestockRecommendation(product);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/app/inventory')} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">{product.name}</h1>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${getRiskColor(risk)}`}>{risk} RISK</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${getStatusColor(status)}`}>{status}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
            <span>SKU: {product.sku}</span>
            <span>·</span>
            <span>{product.category}</span>
            <span>·</span>
            <span>Supplier: {product.supplier}</span>
          </div>
        </div>
        <button
          onClick={() => { addToast('Restock order placed successfully!', 'success'); }}
          className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <Package className="w-4 h-4" /> Restock Now
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Opening Stock', value: product.openingStock, sub: product.unit },
          { label: 'Units Sold', value: product.totalSold, sub: 'total' },
          { label: 'Current Stock', value: product.currentStock, sub: product.unit, highlight: true },
          { label: 'Avg Daily Sales', value: product.avgDailySales, sub: '/day' },
          { label: 'Days Remaining', value: daysRemaining === Infinity ? '∞' : daysRemaining.toFixed(1), sub: 'days', warn: daysRemaining <= 3 },
          { label: 'Restock Qty', value: recommendation.recommendedQty, sub: product.unit, primary: true },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.warn ? 'text-red-600' : s.primary ? 'text-primary-600' : s.highlight ? 'text-slate-800' : 'text-slate-700'}`}>
              {s.value}
            </p>
            <p className="text-xs text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales History */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-1">Sales History</h3>
          <p className="text-xs text-slate-400 mb-4">Units sold per day (last 30 days)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesHistory}>
              <defs>
                <linearGradient id="salesArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} interval={6} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Area type="monotone" dataKey="units" stroke="#6366f1" fill="url(#salesArea)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory History */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-1">Inventory Level</h3>
          <p className="text-xs text-slate-400 mb-4">Stock depletion over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={inventoryHistory}>
              <defs>
                <linearGradient id="stockArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} interval={6} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Area type="monotone" dataKey="stock" stroke="#f59e0b" fill="url(#stockArea)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demand Forecast */}
      {forecast && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-primary-600" />
            <div>
              <h3 className="text-base font-bold text-slate-800">Demand Forecast</h3>
              <p className="text-xs text-slate-400">7-day forecast with confidence range · {forecast.confidence}% accuracy</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={forecast.data}>
              <defs>
                <linearGradient id="confRange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confRange)" />
              <Area type="monotone" dataKey="lower" stroke="none" fill="white" />
              <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={2} dot={{ r: 2 }} name="Actual" />
              <Line type="monotone" dataKey="forecast" stroke="#6366f1" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 2 }} name="Forecast" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-2xl border border-primary-100 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary-800 mb-1">AI Insight</h3>
            <p className="text-sm text-primary-700/80 leading-relaxed">
              Sales velocity for {product.name} has increased by approximately 18% over the last 7 days.
              Based on recent demand patterns, current inventory of {product.currentStock} {product.unit} may last
              approximately {daysRemaining.toFixed(1)} days. {recommendation.recommendedQty > 0 &&
                `We recommend ordering ${recommendation.recommendedQty} ${product.unit} ${daysRemaining <= product.leadTimeDays + 1 ? 'immediately' : 'within the next ' + Math.max(1, Math.floor(daysRemaining - product.leadTimeDays - 1)) + ' day(s)'} to prevent stockout.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
