import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Package, AlertTriangle, TrendingUp, IndianRupee, Warehouse,
  ArrowUpRight, ArrowDownRight, ChevronRight, Sparkles
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
  calculateDaysRemaining, getRiskLevel, getStockStatus, formatCurrency, getRiskColor
} from '../utils/calculations';
import { generateSalesHistory } from '../data/mockData';
import type { TimePeriod } from '../types';

const periods: TimePeriod[] = [
  { label: 'Today', value: 'today', days: 1 },
  { label: '7 Days', value: '7days', days: 7 },
  { label: '30 Days', value: '30days', days: 30 },
  { label: '3 Months', value: '3months', days: 90 },
];

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#94a3b8'];

export default function Dashboard() {
  const { products } = useStore();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<TimePeriod>(periods[2]);

  const salesData = useMemo(() => generateSalesHistory(period.days), [period]);

  const kpis = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter(p => {
      const s = getStockStatus(p);
      return s === 'Low Stock' || s === 'Critical';
    }).length;
    const stockoutRisk = products.filter(p => {
      const d = calculateDaysRemaining(p);
      return getRiskLevel(d) === 'CRITICAL' || getRiskLevel(d) === 'HIGH';
    }).length;
    const todaySales = salesData.length > 0 ? salesData[salesData.length - 1].revenue : 0;
    const inventoryValue = products.reduce((sum, p) => sum + p.currentStock * p.price, 0);

    return [
      { label: 'Total Products', value: totalProducts.toLocaleString('en-IN'), change: '+12', positive: true, icon: Package, color: 'from-primary-500 to-primary-600' },
      { label: 'Low Stock', value: lowStock.toString(), change: '-3', positive: true, icon: AlertTriangle, color: 'from-orange-500 to-orange-600' },
      { label: 'Stockout Risk', value: stockoutRisk.toString(), change: '+2', positive: false, icon: TrendingUp, color: 'from-red-500 to-red-600' },
      { label: "Today's Sales", value: formatCurrency(todaySales), change: '+15%', positive: true, icon: IndianRupee, color: 'from-emerald-500 to-emerald-600' },
      { label: 'Inventory Value', value: formatCurrency(products.reduce((s, p) => s + p.currentStock * p.price, 0)), change: '-4%', positive: false, icon: Warehouse, color: 'from-violet-500 to-violet-600' },
    ];
  }, [products, salesData]);

  const inventoryHealth = useMemo(() => {
    let healthy = 0, low = 0, critical = 0, outOfStock = 0;
    products.forEach(p => {
      const s = getStockStatus(p);
      if (s === 'In Stock') healthy++;
      else if (s === 'Low Stock') low++;
      else if (s === 'Critical') critical++;
      else outOfStock++;
    });
    return [
      { name: 'Healthy', value: healthy },
      { name: 'Low Stock', value: low },
      { name: 'Critical', value: critical },
      { name: 'Out of Stock', value: outOfStock },
    ];
  }, [products]);

  const topSelling = useMemo(() =>
    [...products].sort((a, b) => b.avgDailySales - a.avgDailySales).slice(0, 6).map(p => ({
      name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
      sales: p.avgDailySales,
      fullName: p.name,
    })),
    [products]
  );

  const stockoutRiskProducts = useMemo(() =>
    products
      .map(p => ({
        ...p,
        daysRemaining: calculateDaysRemaining(p),
        risk: getRiskLevel(calculateDaysRemaining(p)),
      }))
      .filter(p => p.risk !== 'LOW')
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, 5),
    [products]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Good morning, Admin 👋</h1>
          <p className="text-sm text-slate-500 mt-0.5">Here's your inventory intelligence for today.</p>
        </div>
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                period.value === p.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm card-hover animate-fade-in stagger-${i + 1}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-sm`}>
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-semibold ${kpi.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Sales Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Revenue over the last {period.days} days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                interval={Math.max(0, Math.floor(salesData.length / 7) - 1)} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }}
                formatter={(value: any) => [`₹${(value || 0).toLocaleString('en-IN')}`, 'Revenue']}
                labelFormatter={(label: any) => label ? new Date(label).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }) : ''}
              />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} dot={false}
                fill="url(#salesGradient)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Health */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-2">Inventory Health</h3>
          <p className="text-xs text-slate-400 mb-4">Current stock distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={inventoryHealth}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {inventoryHealth.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {inventoryHealth.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-slate-500">{item.name}</span>
                <span className="font-bold text-slate-700 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Selling */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-6">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topSelling} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={130} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(value: any) => [`${value || 0} units/day`, 'Avg Daily Sales']}
              />
              <Bar dataKey="sales" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stockout Risk */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Stockout Risk</h3>
              <p className="text-xs text-slate-400 mt-0.5">Products at highest risk</p>
            </div>
            <button
              onClick={() => navigate('/app/stockout')}
              className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {stockoutRiskProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/app/inventory/${p.id}`)}
                className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 cursor-pointer transition-all"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{p.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Stock: {p.currentStock} · Sales: {p.avgDailySales}/day</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getRiskColor(p.risk)}`}>
                    {p.risk}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{p.daysRemaining.toFixed(1)} days</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Restocking */}
      <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-2xl border border-primary-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Smart Restocking Recommendations</h3>
            <p className="text-xs text-slate-500">AI-powered suggestions based on sales velocity and lead times</p>
          </div>
          <button
            onClick={() => navigate('/app/restock')}
            className="ml-auto text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
          >
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stockoutRiskProducts.slice(0, 3).map((p) => {
            const forecast = p.avgDailySales * (p.leadTimeDays + 7);
            const recQty = Math.ceil(forecast + p.safetyStock - p.currentStock);
            return (
              <div key={p.id} className="bg-white rounded-xl p-4 border border-primary-100/50 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-700 truncate">{p.name}</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getRiskColor(p.risk)}`}>{p.risk}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-slate-400">Current</span>
                    <p className="font-bold text-slate-700">{p.currentStock} {p.unit}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Stockout in</span>
                    <p className="font-bold text-red-600">~{p.daysRemaining.toFixed(1)} days</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-xs">
                    <span className="text-slate-400">Restock: </span>
                    <span className="font-bold text-primary-600">{recQty} {p.unit}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/app/restock'); }}
                    className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Order →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
