import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  LayoutDashboard, Package, BarChart3, Brain, AlertTriangle,
  ShoppingCart, Bell, FileText, Settings, ChevronLeft,
  TrendingUp, PackageCheck, Receipt, LogOut, Sparkles
} from 'lucide-react';

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/inventory', icon: Package, label: 'Inventory' },
  { to: '/app/sales', icon: BarChart3, label: 'Sales Analytics' },
  { to: '/app/forecast', icon: Brain, label: 'AI Forecast' },
  { to: '/app/stockout', icon: AlertTriangle, label: 'Stockout Predictions' },
  { to: '/app/restock', icon: PackageCheck, label: 'Restock' },
  { to: '/app/alerts', icon: Bell, label: 'Alerts' },
  { to: '/app/bills', icon: Receipt, label: 'Bills / POS' },
  { to: '/app/reports', icon: FileText, label: 'Reports' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, logout, alerts } = useStore();
  const navigate = useNavigate();
  const unreadAlerts = alerts.filter(a => !a.read).length;

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${
        sidebarOpen ? 'w-64' : 'w-[72px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-lg text-slate-800 whitespace-nowrap">
              Stock<span className="text-primary-600">Sense</span>
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`
            }
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            {sidebarOpen && (
              <span className="whitespace-nowrap">{item.label}</span>
            )}
            {item.label === 'Alerts' && unreadAlerts > 0 && (
              <span className={`bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ${
                sidebarOpen ? 'ml-auto w-5 h-5' : 'absolute -top-1 -right-1 w-4 h-4'
              }`}>
                {unreadAlerts > 9 ? '9+' : unreadAlerts}
              </span>
            )}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-2.5 border-t border-slate-100">
        {sidebarOpen && (
          <div className="mb-2 mx-1 p-3 rounded-xl bg-gradient-to-br from-primary-50 to-indigo-50 border border-primary-100">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-semibold text-primary-700">Demo Mode</span>
            </div>
            <p className="text-[11px] text-primary-600/70 leading-relaxed">
              Using sample retail data
            </p>
          </div>
        )}
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
