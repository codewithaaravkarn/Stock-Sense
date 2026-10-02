import { Product, RiskLevel, StockStatus, StockoutPrediction, RestockRecommendation } from '../types';

export function calculateDaysRemaining(product: Product): number {
  if (product.avgDailySales === 0) return Infinity;
  return product.currentStock / product.avgDailySales;
}

export function getRiskLevel(daysRemaining: number): RiskLevel {
  if (daysRemaining <= 1) return 'CRITICAL';
  if (daysRemaining <= 3) return 'HIGH';
  if (daysRemaining <= 7) return 'MEDIUM';
  return 'LOW';
}

export function getStockStatus(product: Product): StockStatus {
  if (product.currentStock === 0) return 'Out of Stock';
  const days = calculateDaysRemaining(product);
  if (days <= 1) return 'Critical';
  if (days <= 5) return 'Low Stock';
  return 'In Stock';
}

export function getStockoutPrediction(product: Product): StockoutPrediction {
  const daysRemaining = calculateDaysRemaining(product);
  const risk = getRiskLevel(daysRemaining);
  const stockoutDate = new Date();
  stockoutDate.setDate(stockoutDate.getDate() + Math.floor(daysRemaining));
  return {
    productId: product.id,
    daysRemaining,
    risk,
    estimatedStockoutDate: stockoutDate.toISOString().split('T')[0],
  };
}

export function getRestockRecommendation(product: Product): RestockRecommendation {
  const forecastDemand = product.avgDailySales * (product.leadTimeDays + 7);
  const recommendedQty = Math.max(0, Math.ceil(forecastDemand + product.safetyStock - product.currentStock));
  const daysRemaining = calculateDaysRemaining(product);
  const shouldOrderToday = daysRemaining <= (product.leadTimeDays + 1);

  const orderDate = new Date();
  if (!shouldOrderToday) {
    const daysUntilOrder = Math.max(0, Math.floor(daysRemaining - product.leadTimeDays - 1));
    orderDate.setDate(orderDate.getDate() + daysUntilOrder);
  }

  let reason = '';
  if (daysRemaining <= 1) {
    reason = `Stock is critically low. Current inventory will last less than 1 day at current sales velocity of ${product.avgDailySales} ${product.unit}/day.`;
  } else if (daysRemaining <= product.leadTimeDays) {
    reason = `Current stock (${product.currentStock}) will not last through the supplier lead time of ${product.leadTimeDays} days. Immediate order required.`;
  } else if (daysRemaining <= product.leadTimeDays + 3) {
    reason = `Expected demand during supplier lead time (${product.leadTimeDays} days) plus safety stock (${product.safetyStock}) exceeds current inventory.`;
  } else {
    reason = `Proactive restock to maintain safety buffer. Demand forecast indicates ${Math.round(forecastDemand)} units needed over next ${product.leadTimeDays + 7} days.`;
  }

  return {
    productId: product.id,
    currentStock: product.currentStock,
    dailyDemand: product.avgDailySales,
    leadTimeDays: product.leadTimeDays,
    safetyStock: product.safetyStock,
    recommendedQty,
    recommendedDate: orderDate.toISOString().split('T')[0],
    reason,
    status: 'pending',
  };
}

export function generateForecast(product: Product, days: number) {
  const historicalDays = 14;
  const data = [];
  const now = new Date();

  for (let i = historicalDays - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = product.avgDailySales;
    const weekendMultiplier = isWeekend ? 1.24 : 1;
    const variance = Math.random() * 0.3 - 0.15;
    const actual = Math.max(1, Math.round(base * weekendMultiplier * (1 + variance)));
    data.push({
      date: date.toISOString().split('T')[0],
      actual,
      forecast: actual,
      lower: actual,
      upper: actual,
    });
  }

  const trendFactor = 1 + (Math.random() * 0.04 - 0.01);
  for (let i = 1; i <= days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = product.avgDailySales * Math.pow(trendFactor, i / 7);
    const weekendMultiplier = isWeekend ? 1.24 : 1;
    const forecast = Math.round(base * weekendMultiplier);
    const confidenceWidth = Math.round(forecast * 0.15 * (1 + i * 0.02));
    data.push({
      date: date.toISOString().split('T')[0],
      forecast,
      lower: Math.max(0, forecast - confidenceWidth),
      upper: forecast + confidenceWidth,
    });
  }

  const weekdayAvg = product.avgDailySales;
  const weekendAvg = Math.round(product.avgDailySales * 1.24);
  const weekendIncrease = Math.round(((weekendAvg - weekdayAvg) / weekdayAvg) * 100);
  const trendDirection = trendFactor > 1.01 ? 'upward' : trendFactor < 0.99 ? 'downward' : 'stable';
  const trendPct = Math.abs(Math.round((trendFactor - 1) * 100 * 7));

  let insight = '';
  if (trendDirection === 'upward') {
    insight = `Demand is trending upward (+${trendPct}% week-over-week). Weekend sales are approximately ${weekendIncrease}% higher than weekday sales. Consider increasing restock quantities.`;
  } else if (trendDirection === 'downward') {
    insight = `Demand is slightly declining (-${trendPct}% week-over-week). Weekend sales remain ~${weekendIncrease}% higher. Monitor closely before adjusting stock levels.`;
  } else {
    insight = `Demand is relatively stable. Weekend sales are approximately ${weekendIncrease}% higher than weekday sales. Current stocking levels appear appropriate.`;
  }

  const confidence = Math.round(88 + Math.random() * 8);

  return { productId: product.id, period: days, confidence, data, insight };
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getAIResponse(question: string, products: Product[]): string {
  const q = question.toLowerCase();

  const criticalProducts = products.filter(p => {
    const days = calculateDaysRemaining(p);
    return days <= 3;
  });

  if (q.includes('run out') || q.includes('stockout') || q.includes('stock out') || q.includes('running low')) {
    if (criticalProducts.length === 0) {
      return "Good news! No products are at immediate risk of stockout based on current sales velocity. I'll continue monitoring and alert you if any patterns change.";
    }
    const list = criticalProducts.slice(0, 5).map(p => {
      const days = calculateDaysRemaining(p);
      return `• **${p.name}** — ${days.toFixed(1)} days remaining (${p.currentStock} ${p.unit} left, selling ${p.avgDailySales}/day)`;
    }).join('\n');
    return `Based on current sales velocity, these products may run out soon:\n\n${list}\n\nI recommend placing restock orders for all critical items immediately. Would you like me to generate purchase orders?`;
  }

  if (q.includes('coca-cola') || q.includes('coke')) {
    const coke = products.find(p => p.id === 'p1');
    if (!coke) return "I couldn't find Coca-Cola in the inventory.";
    const days = calculateDaysRemaining(coke);
    return `**Coca-Cola 500ml** is at **${getRiskLevel(days)} risk**.\n\n• Current stock: ${coke.currentStock} bottles\n• Daily sales: ${coke.avgDailySales}/day\n• Estimated stockout: ~${days.toFixed(1)} days\n\nSales velocity has increased by approximately 18% over the last 7 days, likely due to seasonal demand. I recommend ordering at least 50 units immediately to avoid a stockout.`;
  }

  if (q.includes('reorder') || q.includes('restock') || q.includes('order')) {
    const recommendations = criticalProducts.slice(0, 4).map(p => {
      const rec = getRestockRecommendation(p);
      return `• **${p.name}** — Order **${rec.recommendedQty} ${p.unit}** (lead time: ${p.leadTimeDays} days)`;
    }).join('\n');
    return `Here are my top restock recommendations:\n\n${recommendations}\n\nThese quantities account for forecasted demand during lead time plus safety stock buffers. Shall I generate a purchase order?`;
  }

  if (q.includes('fastest') || q.includes('top selling') || q.includes('best seller') || q.includes('popular')) {
    const sorted = [...products].sort((a, b) => b.avgDailySales - a.avgDailySales).slice(0, 5);
    const list = sorted.map((p, i) => `${i + 1}. **${p.name}** — ${p.avgDailySales} units/day`).join('\n');
    return `Your top 5 fastest-selling products:\n\n${list}\n\nThese products account for the highest sales velocity. I recommend maintaining higher safety stock levels for these items.`;
  }

  if (q.includes('revenue') || q.includes('sales today') || q.includes('how much')) {
    const totalRevenue = products.reduce((sum, p) => sum + (p.totalSold * p.price), 0);
    return `Today's estimated revenue is **₹2,84,650** based on 287 items sold across all categories.\n\nTop revenue contributors:\n• Aashirvaad Atta 5kg — ₹12,825\n• Head & Shoulders 340ml — ₹8,500\n• Amul Butter 500g — ₹9,450\n\nOverall revenue is up 8% compared to the same day last week.`;
  }

  return `I understand you're asking about "${question}". Based on the current inventory data:\n\n• **${criticalProducts.length}** products are at high/critical risk of stockout\n• Total inventory value: **₹18.6L**\n• Average daily sales velocity: **287 units/day**\n\nI can help with stockout predictions, restock recommendations, sales analysis, and demand forecasting. What specific insights would you like?`;
}

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
    case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
  }
}

export function getStatusColor(status: StockStatus): string {
  switch (status) {
    case 'Out of Stock': return 'text-red-700 bg-red-100';
    case 'Critical': return 'text-red-600 bg-red-50';
    case 'Low Stock': return 'text-orange-600 bg-orange-50';
    case 'In Stock': return 'text-green-600 bg-green-50';
  }
}
