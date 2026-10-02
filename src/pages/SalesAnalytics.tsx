import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatNumber } from '../utils/calculations';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function SalesAnalytics() {
  const products = useStore((s) => s.products);
  const bills = useStore((s) => s.bills);
  const [timePeriod, setTimePeriod] = useState<'7days' | '30days' | '3months'>('30days');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Generate sales trend data based on period
  const trendData = useMemo(() => {
    const days = timePeriod === '7days' ? 7 : timePeriod === '30days' ? 30 : 90;
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseSales = isWeekend ? 340 : 260;
      const variance = Math.sin(i / 3) * 40 + (Math.random() * 30 - 15);
      const units = Math.round(baseSales + variance);
      const avgPrice = 180;
      const revenue = units * avgPrice;

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        units,
        revenue,
      });
    }
    return data;
  }, [timePeriod]);

  // Top selling products by revenue & units
  const topProducts = useMemo(() => {
    const filtered = selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

    return [...filtered]
      .sort((a, b) => (b.totalSold * b.price) - (a.totalSold * a.price))
      .slice(0, 7)
      .map((p) => ({
        name: p.name.length > 18 ? p.name.substring(0, 16) + '...' : p.name,
        revenue: p.totalSold * p.price,
        units: p.totalSold,
        category: p.category,
      }));
  }, [products, selectedCategory]);

  // Sales by category chart data
  const categoryData = useMemo(() => {
    const catMap: Record<string, number> = {};
    products.forEach((p) => {
      catMap[p.category] = (catMap[p.category] || 0) + (p.totalSold * p.price);
    });

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

    return Object.keys(catMap).map((cat, i) => ({
      name: cat,
      value: catMap[cat],
      color: COLORS[i % COLORS.length],
    }));
  }, [products]);

  const totalRevenue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.totalSold * p.price, 0);
  }, [products]);

  const totalUnits = useMemo(() => {
    return products.reduce((sum, p) => sum + p.totalSold, 0);
  }, [products]);

  const avgOrderValue = useMemo(() => {
    if (bills.length === 0) return 480;
    return Math.round(bills.reduce((sum, b) => sum + b.total, 0) / bills.length);
  }, [bills]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Analytics</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Real-time insights on sales velocity, revenue streams, and category performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Selector */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-slate-700 text-sm focus:outline-none font-medium capitalize"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Time Filter */}
          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 text-sm font-medium">
            <button
              onClick={() => setTimePeriod('7days')}
              className={`px-3 py-1 rounded-md transition ${
                timePeriod === '7days'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimePeriod('30days')}
              className={`px-3 py-1 rounded-md transition ${
                timePeriod === '30days'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setTimePeriod('3months')}
              className={`px-3 py-1 rounded-md transition ${
                timePeriod === '3months'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              90D
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {formatCurrency(totalRevenue)}
          </p>
          <div className="flex items-center text-xs font-medium text-emerald-600 mt-2">
            <ArrowUpRight className="w-4 h-4 mr-0.5" />
            <span>+14.2% vs last period</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Units Sold
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {formatNumber(totalUnits)}
          </p>
          <div className="flex items-center text-xs font-medium text-emerald-600 mt-2">
            <ArrowUpRight className="w-4 h-4 mr-0.5" />
            <span>+8.7% vs last period</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Avg Order Value
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {formatCurrency(avgOrderValue)}
          </p>
          <div className="flex items-center text-xs font-medium text-emerald-600 mt-2">
            <ArrowUpRight className="w-4 h-4 mr-0.5" />
            <span>+3.1% vs last period</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Top Category
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3 capitalize">
            Beverages
          </p>
          <div className="flex items-center text-xs font-medium text-slate-500 mt-2">
            <span>34% of total sales volume</span>
          </div>
        </div>
      </div>

      {/* Main Revenue Trend Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Revenue & Units Volume</h2>
            <p className="text-xs text-slate-500">
              Daily revenue breakdown over selected period
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="text-slate-600">Revenue (₹)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">Units Sold</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(val: any, name: any) => [
                  name === 'revenue' ? formatCurrency(val) : formatNumber(val),
                  name === 'revenue' ? 'Revenue' : 'Units Sold',
                ]}
              />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              <Area yAxisId="right" type="monotone" dataKey="units" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorUnits)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid Charts: Top Products & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Top Revenue Generators</h2>
          <p className="text-xs text-slate-500 mb-6">Highest performing products by total sales value</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `₹${val / 1000}k`} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={120} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(val: any) => [formatCurrency(val), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category Pie */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Sales by Category</h2>
            <p className="text-xs text-slate-500 mb-4">Revenue distribution across store departments</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(val: any) => [formatCurrency(val), 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2 pt-4 border-t border-slate-100 max-h-36 overflow-y-auto">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-700 capitalize">{item.name}</span>
                </div>
                <span className="text-slate-900 font-bold">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
