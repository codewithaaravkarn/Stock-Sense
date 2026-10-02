import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { formatDateTime } from '../utils/calculations';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Package,
  CheckCheck,
  Trash2,
  Search,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AlertsPage() {
  const navigate = useNavigate();
  const alerts = useStore((s) => s.alerts);
  const markAlertRead = useStore((s) => s.markAlertRead);
  const deleteAlert = useStore((s) => s.deleteAlert);
  const markAllAlertsRead = useStore((s) => s.markAllAlertsRead);
  const addToast = useStore((s) => s.addToast);

  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const matchesType = filterType === 'all'
        ? true
        : filterType === 'unread'
        ? !a.read
        : a.type === filterType;

      const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.message.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [alerts, filterType, searchQuery]);

  const unreadCount = useMemo(() => {
    return alerts.filter((a) => !a.read).length;
  }, [alerts]);

  const handleMarkAllRead = () => {
    markAllAlertsRead();
    addToast('Marked all notifications as read', 'info');
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'stockout':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'low_stock':
        return <Package className="w-5 h-5 text-orange-500" />;
      case 'demand_spike':
        return <TrendingUp className="w-5 h-5 text-indigo-500" />;
      case 'restock_complete':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Alerts & Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold shadow-sm">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            Real-time automated warnings for predicted stockouts, demand surges, and restock status
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-sm transition"
          >
            <CheckCheck className="w-4 h-4 text-slate-500" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Category:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'stockout', label: 'Stockouts' },
            { id: 'demand_spike', label: 'Demand Spikes' },
            { id: 'restock_complete', label: 'Restocked' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterType === item.id
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts list */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Bell className="w-12 h-12 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-700">No alerts found</p>
            <p className="text-xs text-slate-500">There are no notifications matching your current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-5 transition flex items-start gap-4 ${
                  !alert.read ? 'bg-indigo-50/30' : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Icon wrapper */}
                <div className={`p-3 rounded-2xl shrink-0 ${!alert.read ? 'bg-white shadow-sm border border-slate-200' : 'bg-slate-100'}`}>
                  {getAlertIcon(alert.type)}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm font-bold ${!alert.read ? 'text-slate-900' : 'text-slate-700'}`}>
                      {alert.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {formatDateTime(alert.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {alert.message}
                  </p>

                  {alert.productId && (
                    <button
                      onClick={() => navigate(`/app/inventory/${alert.productId}`)}
                      className="inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-800 pt-1"
                    >
                      View Product details &rarr;
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-center">
                  {!alert.read && (
                    <button
                      onClick={() => markAlertRead(alert.id)}
                      className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-lg text-xs font-medium transition"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg text-xs font-medium transition"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
