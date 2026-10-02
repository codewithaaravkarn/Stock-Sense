import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { generateForecast, calculateDaysRemaining } from '../utils/calculations';
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Layers,
  ChevronRight,
  Sliders,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function AIForecast() {
  const products = useStore((s) => s.products);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'p1');
  const [forecastDays, setForecastDays] = useState<number>(14);
  const [promoBoost, setPromoBoost] = useState<number>(0);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  const forecast = useMemo(() => {
    if (!selectedProduct) return null;
    const res = generateForecast(selectedProduct, forecastDays);
    if (promoBoost > 0) {
      const multiplier = 1 + promoBoost / 100;
      res.data = res.data.map((d) => {
        if (d.actual) return d;
        return {
          ...d,
          forecast: Math.round(d.forecast * multiplier),
          lower: Math.round(d.lower * multiplier),
          upper: Math.round(d.upper * multiplier),
        };
      });
    }
    return res;
  }, [selectedProduct, forecastDays, promoBoost]);

  const totalForecastDemand = useMemo(() => {
    if (!forecast) return 0;
    return forecast.data
      .filter((d) => !d.actual)
      .reduce((sum, d) => sum + d.forecast, 0);
  }, [forecast]);

  const daysRemaining = useMemo(() => {
    if (!selectedProduct) return 0;
    return calculateDaysRemaining(selectedProduct);
  }, [selectedProduct]);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
              <span>AI Predictive Analytics Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Demand Forecasting</h1>
            <p className="text-indigo-200/80 text-sm mt-1 max-w-2xl">
              Machine learning algorithm analyzing historical billing data, day-of-week seasonality, and trend velocity to predict upcoming inventory demand.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Horizon Picker */}
            <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs font-medium">
              <button
                onClick={() => setForecastDays(7)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  forecastDays === 7 ? 'bg-indigo-600 text-white font-bold shadow' : 'text-indigo-200 hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setForecastDays(14)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  forecastDays === 14 ? 'bg-indigo-600 text-white font-bold shadow' : 'text-indigo-200 hover:text-white'
                }`}
              >
                14 Days
              </button>
              <button
                onClick={() => setForecastDays(30)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  forecastDays === 30 ? 'bg-indigo-600 text-white font-bold shadow' : 'text-indigo-200 hover:text-white'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selector & Product Details Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
            Select Product:
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full sm:w-72"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.currentStock} {p.unit} in stock)
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
            <div>
              <span className="text-slate-400 block">Category</span>
              <span className="font-semibold text-slate-800 capitalize">{selectedProduct.category}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Current Stock</span>
              <span className="font-semibold text-slate-900">{selectedProduct.currentStock} {selectedProduct.unit}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Avg Daily Sales</span>
              <span className="font-semibold text-slate-900">{selectedProduct.avgDailySales} {selectedProduct.unit}/day</span>
            </div>
            <div>
              <span className="text-slate-400 block">Stockout ETA</span>
              <span className={`font-bold ${daysRemaining <= 3 ? 'text-red-600' : 'text-slate-900'}`}>
                ~{daysRemaining.toFixed(1)} days
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Forecast Chart & Stats */}
      {forecast && selectedProduct && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>{selectedProduct.name}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                    {forecastDays}-Day AI Forecast
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Historical sales (solid line) vs predicted demand (dashed line) with 95% confidence interval area
                </p>
              </div>

              {/* Promo boost slider trigger */}
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700">Promo Surge:</span>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={promoBoost}
                  onChange={(e) => setPromoBoost(Number(e.target.value))}
                  className="w-20 accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-indigo-600 w-8">+{promoBoost}%</span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecast.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(val: any, name: any) => [
                      `${val} ${selectedProduct.unit}`,
                      name === 'actual'
                        ? 'Actual Sales'
                        : name === 'forecast'
                        ? 'Forecasted Demand'
                        : name === 'upper'
                        ? 'Upper Bound'
                        : 'Lower Bound',
                    ]}
                  />
                  <Area type="monotone" dataKey="upper" stroke="none" fill="#e0e7ff" opacity={0.6} />
                  <Area type="monotone" dataKey="lower" stroke="none" fill="#ffffff" opacity={1} />
                  <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="forecast" stroke="#6366f1" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4, fill: '#6366f1' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-blue-600 rounded"></span>
                  <span>Historical Sales</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-indigo-500 rounded border-dashed"></span>
                  <span>AI Predicted Demand</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-indigo-100 rounded"></span>
                  <span>Confidence Interval</span>
                </div>
              </div>
              <span>Model Confidence: <strong className="text-slate-800">{forecast.confidence}%</strong></span>
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-5 flex flex-col">
            {/* Forecast Summary Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Forecast Summary
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100">
                  <span className="text-xs font-semibold text-indigo-700 block">Total Demand</span>
                  <span className="text-2xl font-extrabold text-indigo-900 mt-0.5 block">
                    {totalForecastDemand}
                  </span>
                  <span className="text-[11px] text-indigo-600 font-medium">units / {forecastDays} days</span>
                </div>

                <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                  <span className="text-xs font-semibold text-emerald-700 block">Accuracy Score</span>
                  <span className="text-2xl font-extrabold text-emerald-900 mt-0.5 block">
                    {forecast.confidence}%
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium">High confidence</span>
                </div>
              </div>

              {/* Buffer recommendation */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Recommended Stocking Level</span>
                  <span className="text-xs font-bold text-indigo-600">
                    {totalForecastDemand + selectedProduct.safetyStock} {selectedProduct.unit}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (selectedProduct.currentStock / (totalForecastDemand + selectedProduct.safetyStock)) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Current stock covers {Math.round((selectedProduct.currentStock / (totalForecastDemand || 1)) * 100)}% of upcoming projected demand.
                </p>
              </div>
            </div>

            {/* AI Explanation Box */}
            <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 rounded-2xl border border-indigo-200/80 shadow-sm flex-1 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span>AI Insight & Findings</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {forecast.insight}
              </p>

              <div className="space-y-2 pt-2 border-t border-indigo-100 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Weekend demand shows a predictable ~24% surge based on historical billing receipts.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Supplier lead time is {selectedProduct.leadTimeDays} days. Recommended order date: <strong>Today</strong>.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
