import React, { useState } from 'react';
import { User, MapPin, Heart, ShoppingBag, FolderOpen, RefreshCw, Star, Trash2 } from 'lucide-react';
import { UserProfile, Product, Order } from '../types';
import { products } from '../catalog';
import { triggerToast } from '../utils';

interface UserDashboardProps {
  user: UserProfile;
  orders: Order[];
  toggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onSelectProduct: (product: Product) => void;
  onReorder: (order: Order) => void;
  setView: (view: string) => void;
}

export default function UserDashboard({
  user,
  orders,
  toggleWishlist,
  onAddToCart,
  onSelectProduct,
  onReorder,
  setView
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'wishlist' | 'orders'>('wishlist');

  // Find actual wishlist products from catalog data
  const wishlistProducts = products.filter(p => user.wishlist.includes(p.id));

  const handleReorderClick = (or: Order) => {
    onReorder(or);
    triggerToast("Reorder successful! All items added back to your active shopping bag.", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* VIP Profile Card Summary Column */}
        <div className="space-y-6">
          <div className="glass-panel p-6 text-center space-y-4">
            <div className="w-20 h-20 border-2 border-gold-500 bg-gold-400/5 mx-auto flex items-center justify-center text-gold-500 rounded-none relative">
              <User className="w-10 h-10" />
              <div className="absolute -bottom-2 transform bg-gold-500 text-black font-semibold text-[8px] font-mono tracking-widest px-2.5 py-0.5 rounded-none">
                VIP ELITE
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-base font-serif font-bold text-white uppercase">{user.name}</h3>
              <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase">{user.email}</p>
            </div>

            <div className="border-t border-zinc-900 pt-4 grid grid-cols-2 gap-2">
              <div className="text-center p-2 border border-zinc-900 bg-zinc-950/40">
                <p className="text-[8px] font-mono text-zinc-550 uppercase">LOYAL LEDGER</p>
                <p className="text-sm font-serif font-bold text-gold-500 mt-1">{user.loyaltyPoints} PTS</p>
              </div>
              <div className="text-center p-2 border border-zinc-900 bg-zinc-950/40">
                <p className="text-[8px] font-mono text-zinc-550 uppercase">WISHLISTED</p>
                <p className="text-sm font-serif font-bold text-white mt-1">{user.wishlist.length} PCS</p>
              </div>
            </div>
          </div>

          {/* Quick Tab Selectors */}
          <div className="flex flex-col border border-zinc-900 divide-y divide-zinc-900">
            {[
              { id: 'wishlist', label: 'MY PRIVATE DRESSER', icon: Heart },
              { id: 'orders', label: 'ACQUISITION LOGS', icon: ShoppingBag },
              { id: 'profile', label: 'SHIPPING PROFILE', icon: MapPin }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  id={`m-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full py-3.5 px-4 text-left text-[10px] tracking-widest font-mono font-bold uppercase transition-colors flex items-center space-x-3 ${
                    activeTab === tab.id 
                      ? 'bg-gold-500 text-black font-extrabold' 
                      : 'text-zinc-400 bg-zinc-950/10 hover:bg-zinc-950/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Tabs Main Output Column */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: WISHLIST DRESSER PANEL */}
          {activeTab === 'wishlist' && (
            <div id="wishlist-tab" className="space-y-6">
              <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
                <h3 className="text-sm md:text-lg font-serif font-bold tracking-wider text-white uppercase">
                  MY PRIVATE SAVED DRESSER
                </h3>
                <span className="text-xs font-mono text-zinc-500">{wishlistProducts.length} ITEMS SAVED</span>
              </div>

              {wishlistProducts.length === 0 ? (
                <div id="wishlist-empty" className="text-center py-20 border border-zinc-950">
                  <p className="text-xs font-mono tracking-widest text-zinc-500">YOUR DRESSER IS CURRENTLY VACANT.</p>
                  <button 
                    id="find-garments"
                    onClick={() => setView('shop')} 
                    className="text-xs tracking-widest text-gold-500 underline mt-4 font-mono font-bold"
                  >
                    DISCOVER HIGH-FASHION PIECES
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                  {wishlistProducts.map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => onSelectProduct(p)}
                      className="group cursor-pointer bg-zinc-950 p-4 border border-zinc-900 flex space-x-4 items-center justify-between"
                    >
                      <div className="flex space-x-4 items-center overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-16 h-16 object-cover border border-zinc-900 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[8px] tracking-widest text-zinc-550 font-mono uppercase">{p.brand}</p>
                          <h4 className="text-xs font-semibold text-white truncate uppercase">{p.name}</h4>
                          <p className="text-xs text-gold-500 font-bold font-mono mt-1">${p.price}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2 shrink-0">
                        <button
                          id={`wishlist-to-cart-${p.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(p, p.sizes[0] || "M", p.colors[0] || "Black");
                            triggerToast(`${p.name} successfully transferred to your active bag!`, "success");
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-gold-400 text-black text-[9px] tracking-widest font-mono font-bold uppercase transition-colors"
                        >
                          MOVE TO BAG
                        </button>
                        <button
                          id={`wishlist-delete-${p.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(p.id);
                          }}
                          className="text-[9px] tracking-widest text-zinc-500 hover:text-red-500 font-mono uppercase flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>REMOVE</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACQUISITION ORDERS LOG */}
          {activeTab === 'orders' && (
            <div id="orders-tab" className="space-y-6">
              <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
                <h3 className="text-sm md:text-lg font-serif font-bold tracking-wider text-white uppercase">
                  ACQUISITION LOGS
                </h3>
                <span className="text-xs font-mono text-zinc-500">{orders.length} DISPATCH RECORDS</span>
              </div>

              {orders.length === 0 ? (
                <div id="orders-empty" className="text-center py-20 border border-zinc-950 animate-in fade-in">
                  <p className="text-xs font-mono tracking-widest text-zinc-500">NO SECURE ACQUISITIONS ON FILE.</p>
                  <button 
                    id="orders-browse"
                    onClick={() => setView('shop')} 
                    className="text-xs tracking-widest text-gold-500 underline mt-4 font-mono font-bold"
                  >
                    RECRUIT FIRST COUTURE ATTIRE
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {orders.map((or) => (
                    <div key={or.id} className="border border-zinc-900 bg-zinc-1000/40 p-6 space-y-4">
                      <div className="flex justify-between flex-wrap gap-2 pb-3 border-b border-zinc-900">
                        <div>
                          <p className="text-[9px] tracking-widest font-mono text-zinc-500 uppercase">ACQUISITION ID</p>
                          <h4 className="text-sm font-semibold text-white font-mono">{or.id}</h4>
                        </div>
                        <div>
                          <p className="text-[9px] tracking-widest font-mono text-zinc-500 uppercase">DISPATCH TIME</p>
                          <p className="text-xs text-zinc-300">{new Date(or.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-[9px] tracking-widest font-mono text-zinc-500 uppercase">STATUS LEVEL</p>
                          <span className="px-2 py-0.5 bg-white/5 text-gold-400 font-mono text-[9px] tracking-widest font-bold uppercase">{or.status}</span>
                        </div>
                        <div>
                          <p className="text-[9px] tracking-widest font-mono text-zinc-500 uppercase">LEDGER VALUE</p>
                          <p className="text-xs font-mono font-bold text-white">${or.total}</p>
                        </div>
                      </div>

                      {/* Display Items within this Order */}
                      <div className="space-y-2">
                        {or.items.map((it) => (
                          <div key={it.id} className="flex justify-between text-xs text-zinc-400">
                            <span>{it.product.name} (QTY: {it.quantity})</span>
                            <span className="font-mono">${it.product.price}</span>
                          </div>
                        ))}
                      </div>

                      {/* Utility Action points */}
                      <div className="flex justify-between items-center pt-3 border-t border-zinc-900">
                        <button
                          id={`reorder-btn-${or.id}`}
                          onClick={() => handleReorderClick(or)}
                          className="flex items-center space-x-1.5 text-[10px] tracking-widest font-mono font-bold text-zinc-400 hover:text-white transition-colors uppercase"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-gold-500" />
                          <span>ONE-CLICK REORDER</span>
                        </button>

                        <button
                          id={`track-btn-${or.id}`}
                          onClick={() => setView('tracking')}
                          className="px-4 py-2 bg-gold-500 hover:bg-white text-black text-[9px] tracking-widest font-mono font-bold uppercase transition-colors"
                        >
                          TRACK SECURE CHAIN
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROFILE SHIPPING REGISTER */}
          {activeTab === 'profile' && (
            <div id="profile-tab" className="space-y-6">
              <div className="border-b border-zinc-900 pb-3">
                <h3 className="text-sm md:text-lg font-serif font-bold tracking-wider text-white uppercase">
                  SHIPPING COORDINATES
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                {user.addresses.map((addr) => (
                  <div key={addr.id} className="border border-zinc-900 bg-zinc-950 p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2.5">
                        <MapPin className="w-4.5 h-4.5 text-gold-500" />
                        <h4 className="text-xs tracking-wider font-bold text-white uppercase">{addr.fullName}</h4>
                      </div>
                      <span className="px-2 py-0.5 bg-gold-400/10 text-gold-400 font-mono text-[8px] tracking-widest">DEFAULT DIRECT</span>
                    </div>

                    <div className="space-y-1 text-xs text-zinc-400 tracking-wide">
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.postalCode}</p>
                      <p className="font-mono text-[10px]">{addr.country}</p>
                    </div>

                    <p className="text-[10px] text-zinc-550 font-mono">TEL: {addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
