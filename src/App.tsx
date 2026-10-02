import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import DashboardLayout from './components/layout/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import ProductDetail from './pages/ProductDetail';
import SalesAnalytics from './pages/SalesAnalytics';
import AIForecast from './pages/AIForecast';
import StockoutPredictions from './pages/StockoutPredictions';
import RestockRecommendations from './pages/RestockRecommendations';
import AlertsPage from './pages/AlertsPage';
import Bills from './pages/Bills';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ToastContainer from './components/ui/ToastContainer';
import AIAssistant from './components/ai/AIAssistant';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/inventory/:productId" element={<ProductDetail />} />
                  <Route path="/sales" element={<SalesAnalytics />} />
                  <Route path="/forecast" element={<AIForecast />} />
                  <Route path="/stockout" element={<StockoutPredictions />} />
                  <Route path="/restock" element={<RestockRecommendations />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/bills" element={<Bills />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
      {isAuthenticated && <AIAssistant />}
    </div>
  );
}
