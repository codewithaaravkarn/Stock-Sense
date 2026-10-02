export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  openingStock: number;
  currentStock: number;
  totalSold: number;
  avgDailySales: number;
  supplier: string;
  leadTimeDays: number;
  safetyStock: number;
  unit: string;
  image?: string;
}

export type StockStatus = 'In Stock' | 'Low Stock' | 'Critical' | 'Out of Stock';
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface StockoutPrediction {
  productId: string;
  daysRemaining: number;
  risk: RiskLevel;
  estimatedStockoutDate: string;
}

export interface RestockRecommendation {
  productId: string;
  currentStock: number;
  dailyDemand: number;
  leadTimeDays: number;
  safetyStock: number;
  recommendedQty: number;
  recommendedDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'ignored';
}

export interface Alert {
  id: string;
  type: 'stockout' | 'low_stock' | 'demand_spike' | 'restock_complete';
  title: string;
  message: string;
  productId?: string;
  timestamp: string;
  read: boolean;
}

export interface Bill {
  id: string;
  date: string;
  customer: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Wallet';
  status: 'Completed' | 'Pending' | 'Cancelled';
}

export interface BillItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface SalesDataPoint {
  date: string;
  sales: number;
  revenue: number;
}

export interface ForecastDataPoint {
  date: string;
  actual?: number;
  forecast: number;
  lower: number;
  upper: number;
}

export interface DemandForecast {
  productId: string;
  period: number;
  confidence: number;
  data: ForecastDataPoint[];
  insight: string;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
}

export interface TimePeriod {
  label: string;
  value: 'today' | '7days' | '30days' | '3months';
  days: number;
}
