import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, Truck, Ticket, TrendingUp, DollarSign, Package, Users, Plus, Check, Power, RefreshCw, X } from 'lucide-react';
import { Product, Order } from '../types';
import { triggerToast } from '../utils';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onUpdateProducts: (newProducts: Product[]) => void;
  onUpdateOrders: (updatedOrders: Order[]) => void;
}

export default function AdminPanel({
  products,
  orders,
  onUpdateProducts,
  onUpdateOrders
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'inventory' | 'orders' | 'discounts'>('analytics');
  
  // Analytics data
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 132700,
    monthlyGrowth: "+24.5%",
    totalOrders: 642,
    activeUsers: 1840,
    loyaltyDisbursed: 42000
  });

  // Adding new product state
  const [newProd, setNewProd] = useState({
    id: '',
    name: '',
    brand: 'DRIPLY STUDIOS',
    price: 150,
    category: 'Outerwear',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
    description: ''
  });

  const [coupons, setCoupons] = useState([
    { code: 'DRIP40', discountPercent: 40, active: true },
    { code: 'GOLD20', discountPercent: 20, active: true },
    { code: 'PRESTIGE', discountPercent: 15, active: false }
  ]);

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(15);

  useEffect(() => {
    // Dynamically retrieve statistics from our Express server safely
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(data => {
        if (data.salesSummary) {
          setRevenueStats(data.salesSummary);
        }
      })
      .catch(err => console.error("Could not fetch database stats:", err));
  }, []);

  const handleUpdateStock = (prodId: string, newStock: number) => {
    const updated = products.map(p => p.id === prodId ? { ...p, stock: Math.max(0, newStock) } : p);
    onUpdateProducts(updated);
  };

  const handleUpdatePrice = (prodId: string, newPrice: number) => {
    const updated = products.map(p => p.id === prodId ? { ...p, price: Math.max(1, newPrice) } : p);
    onUpdateProducts(updated);
  };

  const handleDispatchStatusChange = (orderId: string, newStatus: any) => {
    const updated = orders.map(or => or.id === orderId ? { ...or, status: newStatus } : or);
    onUpdateOrders(updated);
    triggerToast(`Order dispatch status updated to ${newStatus.toUpperCase()}`, "success");
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.id) {
      triggerToast("Provide a design department ID and product title.", "error");
      return;
    }

    const compiled: Product = {
      id: newProd.id.trim().toLowerCase(),
      name: newProd.name,
      description: newProd.description || "A custom curated release styled by DRIPLY Paris.",
      price: Number(newProd.price),
      originalPrice: Number(newProd.price) + 50,
      rating: 4.8,
      reviewsCount: 1,
      image: newProd.image,
      images: [newProd.image],
      category: newProd.category,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Midnight Obsidian", "Prestige Gold"],
      brand: newProd.brand,
      stock: Number(newProd.stock),
      isNew: true
    };

    onUpdateProducts([compiled, ...products]);
    triggerToast("New curated garment recorded on directories successfully.", "success");
    setNewProd({
      id: '',
      name: '',
      brand: 'DRIPLY STUDIOS',
      price: 150,
      category: 'Outerwear',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
      description: ''
    });
  };

  const handleAddCoupon = () => {
    if (!newCouponCode.trim()) return;
    setCoupons([
      ...coupons,
      { code: newCouponCode.trim().toUpperCase(), discountPercent: newCouponPercent, active: true }
    ]);
    setNewCouponCode('');
  };

  const handleToggleCoupon = (idx: number) => {
    const dup = [...coupons];
    dup[idx].active = !dup[idx].active;
    setCoupons(dup);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      {/* Top Main Banner Card Header */}
      <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-900">
        <div>
          <p className="text-[10px] tracking-[0.3em] font-mono text-gold-500 font-bold uppercase">ADMINISTRATIVE TELEMETRY AREA</p>
          <h2 className="text-3xl md:text-5xl font-serif font-extrabold tracking-widest text-white mt-1 uppercase">DRIPLY SYSTEM COMMANDS</h2>
        </div>

        {/* Action sub tabs */}
        <div className="flex border border-zinc-850 p-1 bg-zinc-950">
          {[
            { id: 'analytics', label: 'ANALYTICS', icon: TrendingUp },
            { id: 'inventory', label: 'STOCK LOCK', icon: Package },
            { id: 'orders', label: 'DISPATCH CHAIN', icon: Truck },
            { id: 'discounts', label: 'CAMPAIGNS', icon: Ticket }
          ].map((subTab) => {
            const Icon = subTab.icon;
            return (
              <button
                id={`admin-btn-${subTab.id}`}
                key={subTab.id}
                onClick={() => setActiveSubTab(subTab.id as any)}
                className={`px-4 py-2 text-[9px] tracking-widest font-mono font-bold uppercase transition-all flex items-center space-x-1.5 ${
                  activeSubTab === subTab.id ? 'bg-gold-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{subTab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB TAB RENDER 1: ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div id="analytics-subview" className="space-y-12">
          
          {/* Bento statisticians cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "ACCRUED LEDGER REVENUE", val: `$${revenueStats.totalRevenue}`, labelRate: revenueStats.monthlyGrowth, icon: DollarSign },
              { label: "CUMULATIVE ORDER MARGINS", val: `${revenueStats.totalOrders} ORDERS`, labelRate: "+18% WEEKLY", icon: ShoppingBag },
              { label: "DRESSER ACCOUNT RATIO", val: `${revenueStats.activeUsers} USERS`, labelRate: "+32.4% MONTHLY", icon: Users },
              { label: "VIP LOYALTY POINTS ACTIVE", val: `${revenueStats.loyaltyDisbursed} LP`, labelRate: "88% DISBURSED", icon: Package }
            ].map((st, i) => (
              <div key={i} className="p-6 border border-zinc-900 bg-zinc-950/40 relative">
                <p className="text-[9px] tracking-widest text-zinc-500 font-mono uppercase">{st.label}</p>
                <h4 className="text-2xl font-serif text-white font-extrabold mt-3 tracking-widest">{st.val}</h4>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[10px] font-mono text-zinc-400 font-bold">{st.labelRate}</span>
                  <st.icon className="w-5 h-5 text-gold-500" />
                </div>
              </div>
            ))}
          </div>

          {/* Simulated Chart */}
          <div className="glass-panel p-6 md:p-8 space-y-6">
            <h4 className="text-xs tracking-[0.15em] font-bold text-white uppercase font-mono border-b border-zinc-900 pb-3 flex justify-between">
              <span>FISCAL MONTHLY REVENUE SPREAD</span>
              <span className="text-gold-500">2026 AUDITS</span>
            </h4>

            {/* Custom chart grid rendered manually with tailwind bars */}
            <div className="relative h-60 w-full flex items-end justify-around border-b border-zinc-900/80 pt-10">
              {[
                { m: 'Jan', h: '30%', rev: '$12,400' },
                { m: 'Feb', h: '45%', rev: '$18,900' },
                { m: 'Mar', h: '60%', rev: '$25,400' },
                { m: 'Apr', h: '75%', rev: '$31,200' },
                { m: 'May', h: '95%', rev: '$44,800' }
              ].map((bar, bIdx) => (
                <div key={bIdx} className="flex flex-col items-center w-16 group">
                  <span className="text-[9px] font-mono text-gold-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity mb-2">{bar.rev}</span>
                  <div 
                    className="w-12 bg-gradient-to-t from-gold-700 via-gold-500 to-yellow-300 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(212,175,55,0.2)]" 
                    style={{ height: bar.h }} 
                  />
                  <span className="text-[10px] text-zinc-500 font-mono font-bold mt-3 uppercase">{bar.m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB RENDER 2: INVENTORY STOCK CONTROL */}
      {activeSubTab === 'inventory' && (
        <div id="inventory-subview" className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Add curated clothing item */}
          <div className="space-y-6">
            <form id="add-product-form" onSubmit={handleAddProductSubmit} className="border border-zinc-900 bg-zinc-950/20 p-6 space-y-5">
              <h3 className="text-xs tracking-[0.15em] font-bold text-gold-500 uppercase border-b border-zinc-900 pb-3 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>INJECT GARMENT DESIGNS</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-[8px] tracking-widest text-zinc-500 font-mono font-bold uppercase">STOCK DEPT ID(E.G. drip-009)</label>
                <input 
                  id="add-prod-id"
                  type="text" 
                  required
                  placeholder="DRIP-xxx" 
                  value={newProd.id}
                  onChange={(e) => setNewProd({ ...newProd, id: e.target.value })}
                  className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-3 py-2.5 focus:outline-none focus:border-gold-500 uppercase w-full font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] tracking-widest text-zinc-500 font-mono font-bold uppercase">GARMENT LABEL TITLE</label>
                <input 
                  id="add-prod-name"
                  type="text" 
                  required
                  placeholder="EXACT GARMENT TITLE" 
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-3 py-2.5 focus:outline-none focus:border-gold-500 uppercase w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] tracking-widest text-zinc-500 font-mono font-bold uppercase">USD PRICE ($)</label>
                  <input 
                    id="add-prod-price"
                    type="number" 
                    required
                    placeholder="220" 
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-3 py-2.5 focus:outline-none focus:border-gold-500 w-full font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] tracking-widest text-zinc-500 font-mono font-bold uppercase">ALLOCATED PIECES</label>
                  <input 
                    id="add-prod-stock"
                    type="number" 
                    required
                    placeholder="20" 
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-3 py-2.5 focus:outline-none focus:border-gold-500 w-full font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] tracking-widest text-zinc-500 font-mono font-bold uppercase">CATEGORY GROUP</label>
                <select 
                  id="add-prod-cat"
                  value={newProd.category}
                  onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-zinc-400 px-3 py-2.5 focus:outline-none focus:border-gold-500 uppercase w-full"
                >
                  <option value="Outerwear">Outerwear</option>
                  <option value="Streetwear">Streetwear</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Pants">Pants</option>
                  <option value="Footwear">Footwear</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] tracking-widest text-zinc-500 font-mono font-bold uppercase">DESIGN COMPOSITE DETAILS</label>
                <textarea 
                  id="add-prod-desc"
                  rows={2}
                  placeholder="ENTER MATERIAL DESCRIPTION DETAILS..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white p-3 focus:outline-none focus:border-gold-500 uppercase font-mono"
                />
              </div>

              <button
                id="sumbit-new-product"
                type="submit"
                className="w-full py-3 bg-gold-500 hover:bg-white text-black font-semibold text-xs tracking-[0.2em] font-mono transition-colors"
              >
                RECORD DIRECTORY INJECTION
              </button>
            </form>
          </div>

          {/* Current products editable spreadsheet */}
          <div className="lg:col-span-2 border border-zinc-900 bg-zinc-950/20 p-6 space-y-6">
            <h3 className="text-xs tracking-[0.15em] font-bold text-white uppercase border-b border-zinc-900 pb-3">
              LIVE STOCK LEDGER RECTIFICATIONS
            </h3>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {products.map((p) => (
                <div key={p.id} className="p-4 border border-zinc-900 bg-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex space-x-4 items-center">
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover border border-zinc-900 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase truncate max-w-xs">{p.name}</h4>
                      <p className="text-[9px] text-zinc-500 font-mono mt-0.5">LINE: {p.category.toUpperCase()} | SKU: {p.id.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Price modifier */}
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold">PRICE ($)</span>
                      <input 
                        id={`edit-price-${p.id}`}
                        type="number" 
                        value={p.price} 
                        onChange={(e) => handleUpdatePrice(p.id, Number(e.target.value))}
                        className="w-16 bg-zinc-900 border border-zinc-800 text-xs text-center font-mono py-1 mt-1 text-white focus:border-gold-500"
                      />
                    </div>

                    {/* Stock modifier */}
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold">STOCK ITEMS</span>
                      <input 
                        id={`edit-stock-${p.id}`}
                        type="number" 
                        value={p.stock} 
                        onChange={(e) => handleUpdateStock(p.id, Number(e.target.value))}
                        className="w-16 bg-zinc-900 border border-zinc-800 text-xs text-center font-mono py-1 mt-1 text-white focus:border-gold-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB RENDER 3: DISPATCH CHAIN SIMULATOR */}
      {activeSubTab === 'orders' && (
        <div id="orders-subview" className="border border-zinc-900 bg-zinc-950/20 p-6 md:p-8 space-y-6">
          <h3 className="text-xs tracking-[0.15em] font-bold text-white uppercase border-b border-zinc-900 pb-3">
            LOGISTICS CENTER & COURIER DISPATCH SIMULATOR
          </h3>

          {orders.length === 0 ? (
            <div id="admin-orders-empty" className="text-center py-20 border border-zinc-950">
              <p className="text-xs font-mono tracking-widest text-zinc-500">NO PENDING DELIVERIES OR ORDERS UNDER ROUTING DISPATCH.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((or) => (
                <div key={or.id} className="p-6 border border-zinc-905 bg-black flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white font-mono">{or.id}</h4>
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase">DELIVER TO: <span className="text-gold-500 font-bold">{or.address.fullName}</span>, {or.address.street}, {or.address.city}</p>
                    <p className="text-[9px] text-zinc-500 font-mono mt-1 uppercase">ITEMS: {or.items.length} PACKAGES | TOTAL: ${or.total}</p>
                  </div>

                  {/* Manual route driver */}
                  <div className="space-y-2">
                    <p className="text-[8px] font-mono text-zinc-500 tracking-widest uppercase font-bold text-left lg:text-right">UPDATE TRANSIT DISPATCH LEVEL</p>
                    <div className="flex flex-wrap gap-2">
                      {['ordered', 'processing', 'shipped', 'out_for_delivery', 'delivered'].map((st) => (
                        <button
                          id={`dispatch-${or.id}-${st}`}
                          key={st}
                          onClick={() => handleDispatchStatusChange(or.id, st as any)}
                          className={`px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase border transition-colors ${
                            or.status === st 
                              ? 'border-gold-500 bg-gold-400/5 text-gold-500 font-bold' 
                              : 'border-zinc-850 hover:border-zinc-700 text-zinc-500 hover:text-white'
                          }`}
                        >
                          {st.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB TAB RENDER 4: PROMO CAMPAIGNS & DISCOUNTS */}
      {activeSubTab === 'discounts' && (
        <div id="discounts-subview" className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Create new Coupon */}
          <div className="space-y-6">
            <form id="add-coupon-form" onSubmit={(e) => { e.preventDefault(); handleAddCoupon(); }} className="border border-zinc-900 bg-zinc-950/20 p-6 space-y-5">
              <h3 className="text-xs tracking-[0.15em] font-bold text-gold-500 uppercase border-b border-zinc-900 pb-3 flex items-center space-x-2">
                <Ticket className="w-4 h-4" />
                <span>INVENT MARKETING CODES</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-[8px] tracking-widest text-zinc-500 font-mono font-bold uppercase">PROMO COUPON CODE</label>
                <input 
                  id="coupon-code-field"
                  type="text" 
                  required
                  placeholder="E.G. SUMMER40" 
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-3 py-2.5 focus:outline-none focus:border-gold-500 uppercase w-full font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] tracking-widest text-zinc-500 font-mono font-bold uppercase">PERCENT OFF (%)</label>
                <input 
                  id="coupon-percent-field"
                  type="number" 
                  required
                  min="5"
                  max="95"
                  placeholder="30" 
                  value={newCouponPercent}
                  onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                  className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-3 py-2.5 focus:outline-none focus:border-gold-500 w-full font-mono"
                />
              </div>

              <button
                id="submit-coupon-btn"
                type="submit"
                className="w-full py-3 bg-gold-500 hover:bg-white text-black font-semibold text-xs tracking-[0.2em] font-mono transition-colors"
              >
                DISPOSE PROMOTIONAL CODE
              </button>
            </form>
          </div>

          {/* List existing active campaigns */}
          <div className="lg:col-span-2 border border-zinc-900 bg-zinc-950/20 p-6 space-y-6">
            <h3 className="text-xs tracking-[0.15em] font-bold text-white uppercase border-b border-zinc-900 pb-3">
              ACTIVE PUBLIC CAMPAIGNS
            </h3>

            <div className="space-y-4">
              {coupons.map((cop, idx) => (
                <div key={idx} className="p-4 border border-zinc-909 bg-black flex items-center justify-between">
                  <div className="flex space-x-4 items-center">
                    <div className="w-10 h-10 border border-gold-500/10 bg-gold-500/5 flex items-center justify-center text-gold-550 shrink-0">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono tracking-widest uppercase">{cop.code}</h4>
                      <p className="text-[9px] text-zinc-500 font-mono mt-0.5">DEDUCTS {cop.discountPercent}% OFF EVERY DIRECT CHECKOUT</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className={`text-[8px] font-mono tracking-widest font-bold px-2 py-0.5 ${cop.active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {cop.active ? 'ACTIVE' : 'DEACTIVATED'}
                    </span>
                    <button
                      id={`toggle-coupon-${idx}`}
                      type="button"
                      onClick={() => handleToggleCoupon(idx)}
                      className={`p-2 border transition-colors ${
                        cop.active ? 'border-red-900 text-red-500 hover:bg-red-900/10' : 'border-green-900 text-green-500 hover:bg-green-900/10'
                      }`}
                      title={cop.active ? "Deactivate" : "Activate"}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
