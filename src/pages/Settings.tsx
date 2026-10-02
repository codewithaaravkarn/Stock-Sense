import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  Settings as SettingsIcon,
  Store,
  Sliders,
  BellRing,
  RotateCcw,
  ShieldCheck,
  Save,
  Check,
} from 'lucide-react';

export default function Settings() {
  const enableDemoMode = useStore((s) => s.enableDemoMode);
  const addToast = useStore((s) => s.addToast);

  const [storeName, setStoreName] = useState<string>('StockSense Supermarket #04');
  const [gstin, setGstin] = useState<string>('29AAAAA0000A1Z5');
  const [safetyBufferPct, setSafetyBufferPct] = useState<number>(15);
  const [leadTimeBufferDays, setLeadTimeBufferDays] = useState<number>(2);
  const [enableAutoAlerts, setEnableAutoAlerts] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    addToast('Store configuration & AI parameters saved successfully!', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDemo = () => {
    enableDemoMode();
    addToast('Reset mock data to initial demo state', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings & AI Tuning</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Configure store details, automated alert thresholds, and AI prediction parameters
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Profile */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Store Profile & Billing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Store / Outlet Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                GSTIN / Tax Identification
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* AI Model Tuning */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">AI Forecasting & Safety Buffers</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Safety Buffer Multiplier (%)
                </label>
                <span className="text-xs font-bold text-indigo-600">{safetyBufferPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={safetyBufferPct}
                onChange={(e) => setSafetyBufferPct(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Extra safety buffer calculated during restock recommendations to guard against unexpected demand spikes.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Lead Time Safety Padding (Days)
                </label>
                <span className="text-xs font-bold text-indigo-600">+{leadTimeBufferDays} Days</span>
              </div>
              <input
                type="range"
                min="0"
                max="7"
                value={leadTimeBufferDays}
                onChange={(e) => setLeadTimeBufferDays(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Additional buffer added to supplier delivery times to handle transit delays.
              </p>
            </div>
          </div>
        </div>

        {/* Notifications & Automation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BellRing className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Automation & Alerts</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Automated Stockout Warnings</h3>
              <p className="text-xs text-slate-500">Generate high-priority alerts when products fall under 3-day stockout window</p>
            </div>
            <input
              type="checkbox"
              checked={enableAutoAlerts}
              onChange={(e) => setEnableAutoAlerts(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Demo State Control */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-indigo-400" />
              <span>Reset Demo Sandbox Data</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Restore default mock products, historical billing receipts, and recommendations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetDemo}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition shrink-0"
          >
            Reset Demo Data
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            {saved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved Successfully!' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
