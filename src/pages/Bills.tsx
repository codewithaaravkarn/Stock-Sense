import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDateTime } from '../utils/calculations';
import { Bill, BillItem } from '../types';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CreditCard,
  DollarSign,
  User,
  Calendar,
  X,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Printer,
  Sparkles,
  Receipt,
} from 'lucide-react';

export default function Bills() {
  const bills = useStore((s) => s.bills);
  const products = useStore((s) => s.products);
  const addBill = useStore((s) => s.addBill);
  const addToast = useStore((s) => s.addToast);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // New bill state
  const [customerName, setCustomerName] = useState<string>('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card' | 'Wallet'>('UPI');
  const [billItems, setBillItems] = useState<
    { productId: string; quantity: number }[]
  >([{ productId: products[0]?.id || 'p1', quantity: 1 }]);

  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPayment = paymentFilter === 'all' || b.paymentMethod === paymentFilter;
      return matchesSearch && matchesPayment;
    });
  }, [bills, searchQuery, paymentFilter]);

  const totalBillRevenue = useMemo(() => {
    return bills.reduce((sum, b) => sum + b.total, 0);
  }, [bills]);

  const avgBillValue = useMemo(() => {
    if (bills.length === 0) return 0;
    return Math.round(totalBillRevenue / bills.length);
  }, [bills, totalBillRevenue]);

  // Handle adding new POS bill
  const handleAddItemRow = () => {
    setBillItems([...billItems, { productId: products[0]?.id || 'p1', quantity: 1 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity', value: any) => {
    const updated = [...billItems];
    if (field === 'quantity') {
      updated[index].quantity = Math.max(1, Number(value));
    } else {
      updated[index].productId = value;
    }
    setBillItems(updated);
  };

  const newBillSubtotal = useMemo(() => {
    return billItems.reduce((sum, item) => {
      const p = products.find((prod) => prod.id === item.productId);
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);
  }, [billItems, products]);

  const newBillTax = useMemo(() => {
    return Math.round(newBillSubtotal * 0.05); // 5% GST
  }, [newBillSubtotal]);

  const newBillTotal = newBillSubtotal + newBillTax;

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (billItems.length === 0) {
      addToast('Please add at least one product item', 'error');
      return;
    }

    const compiledItems: BillItem[] = billItems.map((item) => {
      const p = products.find((prod) => prod.id === item.productId)!;
      return {
        productId: p.id,
        productName: p.name,
        quantity: item.quantity,
        price: p.price,
        total: p.price * item.quantity,
      };
    });

    const newBill: Bill = {
      id: `INV-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString(),
      customer: customerName || 'Walk-in Customer',
      items: compiledItems,
      subtotal: newBillSubtotal,
      tax: newBillTax,
      total: newBillTotal,
      paymentMethod,
      status: 'Completed',
    };

    addBill(newBill);
    addToast(`Bill ${newBill.id} created successfully! Inventory updated.`, 'success');
    setIsModalOpen(false);

    // Reset form
    setCustomerName('Walk-in Customer');
    setBillItems([{ productId: products[0]?.id || 'p1', quantity: 1 }]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Billing & Receipts</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage store POS bills, customer receipts, and live inventory sync
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New POS Invoice</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Bills Generated
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{bills.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Recorded POS sales</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Revenue Collected
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{formatCurrency(totalBillRevenue)}</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">+12.4% vs last week</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Avg Invoice Value
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{formatCurrency(avgBillValue)}</p>
            <p className="text-xs text-slate-500 mt-0.5">Per transaction</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search invoice # or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Payment:</span>
          {['all', 'UPI', 'Cash', 'Card', 'Wallet'].map((pm) => (
            <button
              key={pm}
              onClick={() => setPaymentFilter(pm)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                paymentFilter === pm
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pm}
            </button>
          ))}
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="py-4 px-6">Invoice ID</th>
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Items</th>
                <th className="py-4 px-4">Payment Method</th>
                <th className="py-4 px-4">Total</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No billing records found.
                  </td>
                </tr>
              ) : (
                filteredBills.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600">
                      {b.id}
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-600">
                      {formatDateTime(b.date)}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-900">
                      {b.customer}
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                      {b.items.reduce((s, i) => s + i.quantity, 0)} items ({b.items.length} skus)
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {b.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-extrabold text-slate-900">
                      {formatCurrency(b.total)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedBill(b)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">New POS Transaction</h3>
                  <p className="text-xs text-slate-500">Live bill generation automatically syncs inventory stock</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Credit/Debit Card</option>
                    <option value="Wallet">Digital Wallet</option>
                  </select>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Bill Items ({billItems.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {billItems.map((item, idx) => {
                    const selProd = products.find((p) => p.id === item.productId);

                    return (
                      <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <select
                          value={item.productId}
                          onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                          className="flex-1 bg-white border border-slate-200 text-slate-900 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} — ₹{p.price} (Stock: {p.currentStock})
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          min="1"
                          max={selProd?.currentStock || 999}
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-20 bg-white border border-slate-200 text-slate-900 text-xs font-bold rounded-lg px-2.5 py-1.5 text-center focus:outline-none"
                        />

                        <span className="w-20 text-right text-xs font-extrabold text-slate-900">
                          {formatCurrency((selProd?.price || 0) * item.quantity)}
                        </span>

                        {billItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="p-1 text-slate-400 hover:text-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total calculations */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Subtotal</span>
                  <span>{formatCurrency(newBillSubtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Tax (5% GST)</span>
                  <span>{formatCurrency(newBillTax)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold pt-2 border-t border-slate-700">
                  <span>Total Amount</span>
                  <span className="text-emerald-400">{formatCurrency(newBillTotal)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Complete Transaction & Print
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt View Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Receipt Details</h3>
                <span className="text-xs text-slate-400 font-mono">{selectedBill.id}</span>
              </div>
              <button
                onClick={() => setSelectedBill(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-3 font-mono text-xs">
              <div className="text-center pb-2 border-b border-slate-200">
                <p className="font-extrabold text-sm text-slate-900">STOCKSENSE SUPERMARKET</p>
                <p className="text-slate-500">Invoice: {selectedBill.id}</p>
                <p className="text-slate-500">{formatDateTime(selectedBill.date)}</p>
              </div>

              <div className="space-y-1.5">
                {selectedBill.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-slate-800">
                    <span>
                      {item.productName} x{item.quantity}
                    </span>
                    <span>{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedBill.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (5%)</span>
                  <span>{formatCurrency(selectedBill.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-1">
                  <span>TOTAL PAID</span>
                  <span>{formatCurrency(selectedBill.total)}</span>
                </div>
                <div className="text-center text-[10px] text-slate-400 pt-2">
                  Payment via {selectedBill.paymentMethod} • Status: {selectedBill.status}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedBill(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
