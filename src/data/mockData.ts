import { Product, Bill, Alert, SalesDataPoint } from '../types';

export const products: Product[] = [
  { id: 'p1', name: 'Coca-Cola 500ml', sku: 'BEV-001', category: 'Beverages', price: 40, openingStock: 100, currentStock: 22, totalSold: 78, avgDailySales: 12, supplier: 'Hindustan Coca-Cola', leadTimeDays: 2, safetyStock: 20, unit: 'bottles' },
  { id: 'p2', name: 'Pepsi 500ml', sku: 'BEV-002', category: 'Beverages', price: 40, openingStock: 120, currentStock: 45, totalSold: 75, avgDailySales: 9, supplier: 'PepsiCo India', leadTimeDays: 2, safetyStock: 18, unit: 'bottles' },
  { id: 'p3', name: 'Amul Milk 1L', sku: 'DAI-001', category: 'Dairy', price: 65, openingStock: 80, currentStock: 18, totalSold: 62, avgDailySales: 14, supplier: 'Amul Dairy', leadTimeDays: 1, safetyStock: 15, unit: 'packets' },
  { id: 'p4', name: "Lay's Classic 50g", sku: 'SNK-001', category: 'Snacks', price: 20, openingStock: 200, currentStock: 85, totalSold: 115, avgDailySales: 15, supplier: 'PepsiCo India', leadTimeDays: 3, safetyStock: 30, unit: 'packets' },
  { id: 'p5', name: 'Maggi 2-Minute Noodles 70g', sku: 'GRO-001', category: 'Grocery', price: 14, openingStock: 300, currentStock: 120, totalSold: 180, avgDailySales: 22, supplier: 'Nestlé India', leadTimeDays: 3, safetyStock: 40, unit: 'packets' },
  { id: 'p6', name: 'Parle-G 250g', sku: 'SNK-002', category: 'Snacks', price: 25, openingStock: 250, currentStock: 95, totalSold: 155, avgDailySales: 18, supplier: 'Parle Products', leadTimeDays: 2, safetyStock: 25, unit: 'packets' },
  { id: 'p7', name: 'Tata Salt 1kg', sku: 'GRO-002', category: 'Grocery', price: 28, openingStock: 150, currentStock: 72, totalSold: 78, avgDailySales: 5, supplier: 'Tata Consumer', leadTimeDays: 3, safetyStock: 15, unit: 'packets' },
  { id: 'p8', name: 'Surf Excel 1kg', sku: 'HOU-001', category: 'Household', price: 220, openingStock: 60, currentStock: 28, totalSold: 32, avgDailySales: 4, supplier: 'Hindustan Unilever', leadTimeDays: 4, safetyStock: 12, unit: 'packets' },
  { id: 'p9', name: 'Aashirvaad Atta 5kg', sku: 'GRO-003', category: 'Grocery', price: 285, openingStock: 80, currentStock: 35, totalSold: 45, avgDailySales: 6, supplier: 'ITC Limited', leadTimeDays: 3, safetyStock: 15, unit: 'packets' },
  { id: 'p10', name: 'Colgate MaxFresh 200g', sku: 'PER-001', category: 'Personal Care', price: 110, openingStock: 100, currentStock: 48, totalSold: 52, avgDailySales: 6, supplier: 'Colgate-Palmolive', leadTimeDays: 4, safetyStock: 15, unit: 'tubes' },
  { id: 'p11', name: 'Thums Up 750ml', sku: 'BEV-003', category: 'Beverages', price: 45, openingStock: 90, currentStock: 12, totalSold: 78, avgDailySales: 10, supplier: 'Hindustan Coca-Cola', leadTimeDays: 2, safetyStock: 18, unit: 'bottles' },
  { id: 'p12', name: 'Mother Dairy Curd 400g', sku: 'DAI-002', category: 'Dairy', price: 35, openingStock: 60, currentStock: 8, totalSold: 52, avgDailySales: 11, supplier: 'Mother Dairy', leadTimeDays: 1, safetyStock: 12, unit: 'cups' },
  { id: 'p13', name: 'Kurkure Masala Munch 90g', sku: 'SNK-003', category: 'Snacks', price: 20, openingStock: 180, currentStock: 65, totalSold: 115, avgDailySales: 13, supplier: 'PepsiCo India', leadTimeDays: 3, safetyStock: 25, unit: 'packets' },
  { id: 'p14', name: 'Dabur Honey 500g', sku: 'GRO-004', category: 'Grocery', price: 250, openingStock: 40, currentStock: 22, totalSold: 18, avgDailySales: 2, supplier: 'Dabur India', leadTimeDays: 5, safetyStock: 8, unit: 'bottles' },
  { id: 'p15', name: 'Dove Soap 100g', sku: 'PER-002', category: 'Personal Care', price: 55, openingStock: 120, currentStock: 55, totalSold: 65, avgDailySales: 7, supplier: 'Hindustan Unilever', leadTimeDays: 4, safetyStock: 18, unit: 'bars' },
  { id: 'p16', name: 'Bisleri Water 1L', sku: 'BEV-004', category: 'Beverages', price: 22, openingStock: 250, currentStock: 90, totalSold: 160, avgDailySales: 20, supplier: 'Bisleri International', leadTimeDays: 1, safetyStock: 25, unit: 'bottles' },
  { id: 'p17', name: 'Vim Liquid 500ml', sku: 'HOU-002', category: 'Household', price: 99, openingStock: 80, currentStock: 38, totalSold: 42, avgDailySales: 5, supplier: 'Hindustan Unilever', leadTimeDays: 4, safetyStock: 12, unit: 'bottles' },
  { id: 'p18', name: 'Amul Butter 500g', sku: 'DAI-003', category: 'Dairy', price: 270, openingStock: 50, currentStock: 15, totalSold: 35, avgDailySales: 5, supplier: 'Amul Dairy', leadTimeDays: 2, safetyStock: 10, unit: 'packets' },
  { id: 'p19', name: 'Head & Shoulders 340ml', sku: 'PER-003', category: 'Personal Care', price: 340, openingStock: 45, currentStock: 20, totalSold: 25, avgDailySales: 3, supplier: 'P&G India', leadTimeDays: 5, safetyStock: 10, unit: 'bottles' },
  { id: 'p20', name: 'Harpic 500ml', sku: 'HOU-003', category: 'Household', price: 89, openingStock: 70, currentStock: 32, totalSold: 38, avgDailySales: 4, supplier: 'Reckitt Benckiser', leadTimeDays: 4, safetyStock: 12, unit: 'bottles' },
  { id: 'p21', name: 'Haldiram Bhujia 200g', sku: 'SNK-004', category: 'Snacks', price: 55, openingStock: 100, currentStock: 42, totalSold: 58, avgDailySales: 7, supplier: 'Haldiram Foods', leadTimeDays: 3, safetyStock: 15, unit: 'packets' },
  { id: 'p22', name: 'Britannia Bread', sku: 'GRO-005', category: 'Grocery', price: 40, openingStock: 60, currentStock: 5, totalSold: 55, avgDailySales: 12, supplier: 'Britannia Industries', leadTimeDays: 1, safetyStock: 10, unit: 'loaves' },
  { id: 'p23', name: 'Red Bull 250ml', sku: 'BEV-005', category: 'Beverages', price: 125, openingStock: 48, currentStock: 18, totalSold: 30, avgDailySales: 4, supplier: 'Red Bull India', leadTimeDays: 3, safetyStock: 10, unit: 'cans' },
  { id: 'p24', name: 'Dettol Soap 125g', sku: 'PER-004', category: 'Personal Care', price: 42, openingStock: 100, currentStock: 45, totalSold: 55, avgDailySales: 6, supplier: 'Reckitt Benckiser', leadTimeDays: 4, safetyStock: 15, unit: 'bars' },
  { id: 'p25', name: 'Fortune Oil 1L', sku: 'GRO-006', category: 'Grocery', price: 155, openingStock: 60, currentStock: 25, totalSold: 35, avgDailySales: 4, supplier: 'Adani Wilmar', leadTimeDays: 3, safetyStock: 10, unit: 'bottles' },
];

export function generateSalesHistory(days: number): SalesDataPoint[] {
  const data: SalesDataPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseSales = isWeekend ? 320 : 260;
    const variance = Math.floor(Math.random() * 80) - 40;
    const sales = baseSales + variance;
    const avgPrice = 85;
    data.push({
      date: date.toISOString().split('T')[0],
      sales,
      revenue: sales * avgPrice + Math.floor(Math.random() * 5000),
    });
  }
  return data;
}

export function generateProductSalesHistory(productId: string, days: number): { date: string; units: number }[] {
  const product = products.find(p => p.id === productId);
  if (!product) return [];
  const data: { date: string; units: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = product.avgDailySales;
    const weekendMultiplier = isWeekend ? 1.24 : 1;
    const variance = Math.random() * 0.4 - 0.2;
    const units = Math.max(1, Math.round(base * weekendMultiplier * (1 + variance)));
    data.push({ date: date.toISOString().split('T')[0], units });
  }
  return data;
}

export const initialBills: Bill[] = [
  {
    id: 'INV-10478',
    date: '2026-10-02T09:15:00',
    customer: 'Walk-in Customer',
    items: [
      { productId: 'p1', productName: 'Coca-Cola 500ml', quantity: 2, price: 40, total: 80 },
      { productId: 'p5', productName: 'Maggi 2-Minute Noodles 70g', quantity: 3, price: 14, total: 42 },
      { productId: 'p7', productName: 'Tata Salt 1kg', quantity: 1, price: 28, total: 28 },
    ],
    subtotal: 150,
    tax: 27,
    total: 177,
    paymentMethod: 'UPI',
    status: 'Completed',
  },
  {
    id: 'INV-10479',
    date: '2026-10-02T09:42:00',
    customer: 'Walk-in Customer',
    items: [
      { productId: 'p3', productName: 'Amul Milk 1L', quantity: 2, price: 65, total: 130 },
      { productId: 'p22', productName: 'Britannia Bread', quantity: 1, price: 40, total: 40 },
      { productId: 'p18', productName: 'Amul Butter 500g', quantity: 1, price: 270, total: 270 },
    ],
    subtotal: 440,
    tax: 79.2,
    total: 519.2,
    paymentMethod: 'Cash',
    status: 'Completed',
  },
  {
    id: 'INV-10480',
    date: '2026-10-02T10:05:00',
    customer: 'Sharma Ji',
    items: [
      { productId: 'p9', productName: 'Aashirvaad Atta 5kg', quantity: 1, price: 285, total: 285 },
      { productId: 'p25', productName: 'Fortune Oil 1L', quantity: 2, price: 155, total: 310 },
      { productId: 'p8', productName: 'Surf Excel 1kg', quantity: 1, price: 220, total: 220 },
      { productId: 'p17', productName: 'Vim Liquid 500ml', quantity: 1, price: 99, total: 99 },
      { productId: 'p7', productName: 'Tata Salt 1kg', quantity: 2, price: 28, total: 56 },
    ],
    subtotal: 970,
    tax: 174.6,
    total: 1144.6,
    paymentMethod: 'Card',
    status: 'Completed',
  },
  {
    id: 'INV-10481',
    date: '2026-10-02T11:30:00',
    customer: 'Priya Mehta',
    items: [
      { productId: 'p15', productName: 'Dove Soap 100g', quantity: 3, price: 55, total: 165 },
      { productId: 'p19', productName: 'Head & Shoulders 340ml', quantity: 1, price: 340, total: 340 },
      { productId: 'p24', productName: 'Dettol Soap 125g', quantity: 2, price: 42, total: 84 },
      { productId: 'p10', productName: 'Colgate MaxFresh 200g', quantity: 1, price: 110, total: 110 },
    ],
    subtotal: 699,
    tax: 125.82,
    total: 824.82,
    paymentMethod: 'UPI',
    status: 'Completed',
  },
  {
    id: 'INV-10482',
    date: '2026-10-02T12:15:00',
    customer: 'Walk-in Customer',
    items: [
      { productId: 'p16', productName: 'Bisleri Water 1L', quantity: 4, price: 22, total: 88 },
      { productId: 'p4', productName: "Lay's Classic 50g", quantity: 5, price: 20, total: 100 },
      { productId: 'p13', productName: 'Kurkure Masala Munch 90g', quantity: 3, price: 20, total: 60 },
      { productId: 'p23', productName: 'Red Bull 250ml', quantity: 2, price: 125, total: 250 },
      { productId: 'p1', productName: 'Coca-Cola 500ml', quantity: 3, price: 40, total: 120 },
      { productId: 'p2', productName: 'Pepsi 500ml', quantity: 2, price: 40, total: 80 },
      { productId: 'p21', productName: 'Haldiram Bhujia 200g', quantity: 2, price: 55, total: 110 },
      { productId: 'p6', productName: 'Parle-G 250g', quantity: 4, price: 25, total: 100 },
    ],
    subtotal: 908,
    tax: 163.44,
    total: 1071.44,
    paymentMethod: 'UPI',
    status: 'Completed',
  },
];

export const initialAlerts: Alert[] = [
  { id: 'a1', type: 'stockout', title: 'Stockout Risk: Britannia Bread', message: 'Britannia Bread may run out within hours. Current stock: 5 loaves, daily sales: 12/day.', productId: 'p22', timestamp: '2026-10-02T08:00:00', read: false },
  { id: 'a2', type: 'stockout', title: 'Stockout Risk: Mother Dairy Curd', message: 'Mother Dairy Curd 400g may run out in less than 1 day. Current stock: 8 cups.', productId: 'p12', timestamp: '2026-10-02T08:05:00', read: false },
  { id: 'a3', type: 'stockout', title: 'Stockout Risk: Thums Up 750ml', message: 'Thums Up 750ml may run out in approximately 1.2 days. Current stock: 12 bottles.', productId: 'p11', timestamp: '2026-10-02T08:10:00', read: false },
  { id: 'a4', type: 'low_stock', title: 'Low Stock: Amul Milk 1L', message: 'Amul Milk 1L stock is running low. Current stock: 18 packets, approximately 1.3 days remaining.', productId: 'p3', timestamp: '2026-10-02T08:15:00', read: false },
  { id: 'a5', type: 'low_stock', title: 'Low Stock: Coca-Cola 500ml', message: 'Coca-Cola 500ml stock is running low. Current stock: 22 bottles, approximately 1.8 days remaining.', productId: 'p1', timestamp: '2026-10-02T08:20:00', read: false },
  { id: 'a6', type: 'demand_spike', title: 'Demand Spike: Maggi Noodles', message: 'Maggi 2-Minute Noodles demand increased 31% this week compared to last week.', productId: 'p5', timestamp: '2026-10-02T07:30:00', read: true },
  { id: 'a7', type: 'demand_spike', title: 'Demand Spike: Bisleri Water', message: 'Bisleri Water 1L demand increased 28% — likely seasonal trend.', productId: 'p16', timestamp: '2026-10-02T07:00:00', read: true },
  { id: 'a8', type: 'restock_complete', title: 'Restock Completed: Parle-G 250g', message: 'Parle-G 250g restocking order of 100 packets has been delivered and inventory updated.', productId: 'p6', timestamp: '2026-10-01T16:00:00', read: true },
  { id: 'a9', type: 'low_stock', title: 'Low Stock: Amul Butter 500g', message: 'Amul Butter 500g stock is low. Current stock: 15 packets, approximately 3 days remaining.', productId: 'p18', timestamp: '2026-10-02T08:30:00', read: false },
  { id: 'a10', type: 'stockout', title: 'Stockout Risk: Coca-Cola 500ml', message: 'Coca-Cola 500ml sales velocity increased 18% over last 7 days. Estimated stockout in ~2 days.', productId: 'p1', timestamp: '2026-10-02T09:00:00', read: false },
];

export const categories = ['Beverages', 'Dairy', 'Snacks', 'Personal Care', 'Household', 'Grocery'];
