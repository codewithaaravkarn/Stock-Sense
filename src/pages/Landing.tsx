import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Sparkles, ArrowRight, Receipt, Database, Brain, AlertTriangle, Bell, PackageCheck,
  BarChart3, Shield, Zap, TrendingUp, ShoppingCart, Building2, Store, Truck,
  CheckCircle, ChevronRight, Star
} from 'lucide-react';

const steps = [
  { icon: Receipt, title: 'Bills Generated', desc: 'POS captures every transaction', color: 'from-blue-500 to-blue-600' },
  { icon: Database, title: 'Sales Data Collected', desc: 'Real-time inventory tracking', color: 'from-cyan-500 to-cyan-600' },
  { icon: Brain, title: 'AI Analyzes Patterns', desc: 'Demand forecasting engine', color: 'from-violet-500 to-violet-600' },
  { icon: AlertTriangle, title: 'Stockout Risk Predicted', desc: 'Before it happens', color: 'from-orange-500 to-orange-600' },
  { icon: Bell, title: 'Alert Sent', desc: 'Instant notifications', color: 'from-rose-500 to-rose-600' },
  { icon: PackageCheck, title: 'Smart Restock', desc: 'Optimal quantities calculated', color: 'from-emerald-500 to-emerald-600' },
];

const features = [
  { icon: Brain, title: 'AI-Powered Predictions', desc: 'Machine learning forecasts demand and predicts stockouts days in advance.' },
  { icon: PackageCheck, title: 'Smart Restocking', desc: 'Get exact quantities and optimal timing for every restock order.' },
  { icon: Bell, title: 'Real-Time Alerts', desc: 'Instant notifications when stock drops to critical levels.' },
  { icon: BarChart3, title: 'Sales Analytics', desc: 'Deep insights into sales trends, velocity, and revenue patterns.' },
  { icon: Shield, title: 'Risk Dashboard', desc: 'Visual overview of stockout risks across your entire inventory.' },
  { icon: Zap, title: 'POS Integration', desc: 'Seamlessly captures billing data to feed the intelligence engine.' },
];

const pricing = [
  { name: 'Starter', price: '₹999', period: '/store/month', desc: 'For single-store retailers', features: ['Up to 500 products', 'Stockout predictions', 'Basic analytics', 'Email alerts', 'CSV export'], cta: 'Start Free Trial' },
  { name: 'Professional', price: '₹2,499', period: '/store/month', desc: 'For growing retail chains', features: ['Unlimited products', 'AI demand forecasting', 'Advanced analytics', 'Multi-store support', 'Priority alerts', 'API access'], cta: 'Start Free Trial', popular: true },
  { name: 'Enterprise', price: 'Custom', period: '', desc: 'For large retail operations', features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'SLA guarantee', 'On-premise option', 'Training & onboarding'], cta: 'Contact Sales' },
];

const targets = [
  { icon: Store, title: 'Supermarkets', desc: 'Manage thousands of SKUs with zero stockouts' },
  { icon: Building2, title: 'Retail Chains', desc: 'Multi-store inventory intelligence' },
  { icon: ShoppingCart, title: 'Convenience Stores', desc: 'Never miss a sale on fast-movers' },
  { icon: Truck, title: 'FMCG Retailers', desc: 'Optimize supply chain timing' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { enableDemoMode, login } = useStore();

  const handleDemo = () => {
    enableDemoMode();
    login();
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">Stock<span className="text-primary-600">Sense</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-slate-600 hover:text-primary-600 transition-colors font-medium">How It Works</a>
            <a href="#features" className="text-sm text-slate-600 hover:text-primary-600 transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-sm text-slate-600 hover:text-primary-600 transition-colors font-medium">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm text-slate-600 hover:text-primary-600 font-medium transition-colors px-3 py-2">
              Sign In
            </button>
            <button onClick={handleDemo} className="text-sm bg-primary-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-sm hover:shadow-md">
              View Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-indigo-50/30" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Inventory Intelligence
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Never Let Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                Best-Sellers
              </span>{' '}
              Run Out.
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              StockSense analyzes your billing data, predicts upcoming stockouts, and tells you exactly when and how much to restock.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleDemo}
                className="flex items-center gap-2 px-8 py-3.5 bg-primary-600 text-white rounded-xl font-semibold text-base hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleDemo}
                className="flex items-center gap-2 px-8 py-3.5 bg-white text-slate-700 rounded-xl font-semibold text-base border border-slate-200 hover:border-primary-300 hover:text-primary-700 transition-all shadow-sm"
              >
                View Demo <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-400">No credit card required · 14-day free trial</p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 max-w-5xl mx-auto relative">
            <div className="rounded-2xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 overflow-hidden bg-slate-50">
              <div className="bg-white border-b border-slate-100 px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center text-xs text-slate-400 font-medium">app.stocksense.io/dashboard</div>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Products', value: '1,248', change: '+12%', color: 'text-primary-600' },
                  { label: 'Low Stock', value: '37', change: '-8%', color: 'text-orange-600' },
                  { label: 'Stockout Risk', value: '12', change: '+3', color: 'text-red-600' },
                  { label: "Today's Revenue", value: '₹2.8L', change: '+15%', color: 'text-emerald-600' },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-400 font-medium">{kpi.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
                    <p className="text-xs text-emerald-500 mt-1">{kpi.change}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm h-36 flex items-center justify-center text-sm text-slate-400">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary-400" />
                    Sales Trend Chart
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm h-36 flex items-center justify-center text-sm text-slate-400">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-primary-400" />
                    Inventory Health
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 mb-2">HOW IT WORKS</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">From Bill to Smart Restock in 6 Steps</h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">Every transaction feeds our AI engine, turning raw sales data into actionable inventory intelligence.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="text-center group">
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs font-bold text-primary-600 mb-1">Step {i + 1}</div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 mb-2">KEY FEATURES</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Everything You Need to Eliminate Stockouts</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary-200 hover:shadow-lg hover:shadow-primary-50 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Customers */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 mb-2">BUILT FOR</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Retailers Who Refuse to Lose Sales</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {targets.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-slate-100 text-center hover:border-primary-200 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  <t.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{t.title}</h3>
                <p className="text-sm text-slate-500">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-primary-600 mb-2">WHY STOCKSENSE</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Every Empty Shelf Is a Lost Sale</h2>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                Retailers lose up to 4% of annual revenue to stockouts. StockSense uses AI to predict and prevent them before they happen.
              </p>
              <div className="space-y-4">
                {[
                  'Reduce stockouts by up to 85%',
                  'Cut excess inventory by 20-30%',
                  'Save 10+ hours/week on manual tracking',
                  'Increase revenue per shelf by 15%',
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-50 to-indigo-50 rounded-3xl p-8 border border-primary-100">
                <div className="space-y-4">
                  {[
                    { label: 'Stockout Reduction', value: '85%', width: 'w-[85%]' },
                    { label: 'Forecast Accuracy', value: '92%', width: 'w-[92%]' },
                    { label: 'Time Saved', value: '73%', width: 'w-[73%]' },
                    { label: 'Revenue Impact', value: '+15%', width: 'w-[60%]' },
                  ].map((m, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-medium text-slate-700">{m.label}</span>
                        <span className="text-sm font-bold text-primary-600">{m.value}</span>
                      </div>
                      <div className="h-2.5 bg-white rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full ${m.width} transition-all duration-1000`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 mb-2">PRICING</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-slate-500">Start free. Scale as you grow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 border transition-all duration-300 ${
                  plan.popular
                    ? 'bg-white border-primary-200 shadow-xl shadow-primary-100/50 ring-2 ring-primary-500 relative'
                    : 'bg-white border-slate-200 hover:border-primary-200 hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{plan.desc}</p>
                <div className="mt-5 mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleDemo}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl p-12 sm:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative">
              Ready to Predict. Restock.<br />Never Run Empty?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-xl mx-auto relative">
              Join hundreds of retailers already using StockSense to eliminate stockouts and maximize revenue.
            </p>
            <button
              onClick={handleDemo}
              className="relative px-8 py-3.5 bg-white text-primary-700 rounded-xl font-bold text-base hover:bg-primary-50 transition-all shadow-lg"
            >
              Get Started Free <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-800">Stock<span className="text-primary-600">Sense</span></span>
            </div>
            <p className="text-sm text-slate-400">© 2026 StockSense. Predict. Restock. Never Run Empty.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
