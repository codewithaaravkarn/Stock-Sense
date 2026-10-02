import { create } from 'zustand';
import { Product, Bill, Alert, RestockRecommendation } from '../types';
import { products as initialProducts, initialBills, initialAlerts } from '../data/mockData';
import { getRestockRecommendation, calculateDaysRemaining, getRiskLevel } from '../utils/calculations';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface StoreState {
  products: Product[];
  bills: Bill[];
  alerts: Alert[];
  recommendations: RestockRecommendation[];
  toasts: Toast[];
  isDemoMode: boolean;
  isAuthenticated: boolean;
  sidebarOpen: boolean;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  login: () => void;
  logout: () => void;
  enableDemoMode: () => void;

  // Product actions
  updateProductStock: (productId: string, quantitySold: number) => void;

  // Bill actions
  addBill: (bill: Bill) => void;

  // Alert actions
  addAlert: (alert: Alert) => void;
  markAlertRead: (alertId: string) => void;
  deleteAlert: (alertId: string) => void;
  markAllAlertsRead: () => void;

  // Recommendation actions
  approveRecommendation: (productId: string) => void;
  ignoreRecommendation: (productId: string) => void;
  refreshRecommendations: () => void;

  // Toast actions
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

function generateRecommendations(products: Product[]): RestockRecommendation[] {
  return products
    .filter(p => {
      const days = calculateDaysRemaining(p);
      return days <= 10;
    })
    .map(p => getRestockRecommendation(p))
    .sort((a, b) => {
      const pa = products.find(p => p.id === a.productId)!;
      const pb = products.find(p => p.id === b.productId)!;
      return calculateDaysRemaining(pa) - calculateDaysRemaining(pb);
    });
}

export const useStore = create<StoreState>((set, get) => ({
  products: initialProducts,
  bills: initialBills,
  alerts: initialAlerts,
  recommendations: generateRecommendations(initialProducts),
  toasts: [],
  isDemoMode: true,
  isAuthenticated: false,
  sidebarOpen: true,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),

  enableDemoMode: () => {
    set({
      products: initialProducts,
      bills: initialBills,
      alerts: initialAlerts,
      isDemoMode: true,
      isAuthenticated: true,
    });
    const state = get();
    set({ recommendations: generateRecommendations(state.products) });
  },

  updateProductStock: (productId, quantitySold) => {
    set((state) => ({
      products: state.products.map(p =>
        p.id === productId
          ? {
              ...p,
              currentStock: Math.max(0, p.currentStock - quantitySold),
              totalSold: p.totalSold + quantitySold,
              avgDailySales: Math.round(((p.avgDailySales * 6 + quantitySold) / 7) * 10) / 10,
            }
          : p
      ),
    }));

    // Check if product is now at risk
    const updatedProduct = get().products.find(p => p.id === productId);
    if (updatedProduct) {
      const daysRemaining = calculateDaysRemaining(updatedProduct);
      const risk = getRiskLevel(daysRemaining);
      if (risk === 'CRITICAL' || risk === 'HIGH') {
        const newAlert: Alert = {
          id: `a-${Date.now()}-${productId}`,
          type: 'stockout',
          title: `Stockout Risk: ${updatedProduct.name}`,
          message: `${updatedProduct.name} may run out in ~${daysRemaining.toFixed(1)} days. Current stock: ${updatedProduct.currentStock} ${updatedProduct.unit}.`,
          productId,
          timestamp: new Date().toISOString(),
          read: false,
        };
        get().addAlert(newAlert);
      }
    }

    // Refresh recommendations
    set({ recommendations: generateRecommendations(get().products) });
  },

  addBill: (bill) => {
    set((state) => ({ bills: [bill, ...state.bills] }));
    // Update stock for each item
    bill.items.forEach(item => {
      get().updateProductStock(item.productId, item.quantity);
    });
  },

  addAlert: (alert) => {
    set((state) => ({ alerts: [alert, ...state.alerts] }));
  },

  markAlertRead: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map(a =>
        a.id === alertId ? { ...a, read: true } : a
      ),
    }));
  },

  deleteAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.filter(a => a.id !== alertId),
    }));
  },

  markAllAlertsRead: () => {
    set((state) => ({
      alerts: state.alerts.map(a => ({ ...a, read: true })),
    }));
  },

  approveRecommendation: (productId) => {
    const rec = get().recommendations.find(r => r.productId === productId);
    if (!rec) return;

    set((state) => ({
      recommendations: state.recommendations.map(r =>
        r.productId === productId ? { ...r, status: 'approved' as const } : r
      ),
      products: state.products.map(p =>
        p.id === productId
          ? { ...p, currentStock: p.currentStock + rec.recommendedQty }
          : p
      ),
    }));

    const product = get().products.find(p => p.id === productId);
    if (product) {
      const newAlert: Alert = {
        id: `a-${Date.now()}-restock`,
        type: 'restock_complete',
        title: `Restock Approved: ${product.name}`,
        message: `Restock order for ${rec.recommendedQty} ${product.unit} of ${product.name} has been approved.`,
        productId,
        timestamp: new Date().toISOString(),
        read: false,
      };
      get().addAlert(newAlert);
      get().addToast(`Restock of ${rec.recommendedQty} ${product.unit} approved for ${product.name}`, 'success');
    }
  },

  ignoreRecommendation: (productId) => {
    set((state) => ({
      recommendations: state.recommendations.map(r =>
        r.productId === productId ? { ...r, status: 'ignored' as const } : r
      ),
    }));
    get().addToast('Recommendation dismissed', 'info');
  },

  refreshRecommendations: () => {
    set({ recommendations: generateRecommendations(get().products) });
  },

  addToast: (message, type) => {
    const id = `toast-${Date.now()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id),
    }));
  },
}));
