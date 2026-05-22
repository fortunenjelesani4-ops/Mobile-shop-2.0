import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Trash2, 
  Heart, 
  Plus, 
  Minus, 
  ArrowRight, 
  Star, 
  X, 
  Truck, 
  ChevronRight, 
  Sparkles,
  Award,
  ArrowLeft
} from 'lucide-react';

// Import Types and Catalog
import { Product, CartItem, UserProfile, Order } from './types';
import { triggerToast } from './utils';
import { products as initialProducts } from './catalog';

// Import Modular Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShopPage from './components/ShopPage';
import Checkout from './components/Checkout';
import Tracking from './components/Tracking';
import UserDashboard from './components/UserDashboard';
import AIFeatures from './components/AIFeatures';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [currentView, setView] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  
  // App-level Shared States representing our local "Firestore" persistence layer
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(["drip-001", "drip-004"]); // Default mock
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTrackOrder, setActiveTrackOrder] = useState<Order | null>(null);

  // Global luxury toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync / Listen to the custom toast event
  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type?: 'success' | 'info' | 'error' }>;
      if (customEvent.detail) {
        setToast({
          message: customEvent.detail.message,
          type: customEvent.detail.type || 'success'
        });
      }
    };
    window.addEventListener('driply-toast', handleToastEvent);
    return () => window.removeEventListener('driply-toast', handleToastEvent);
  }, []);

  // Toast self-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // VIP active profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Fortune Njelesani",
    email: "fortunenjelesani4@gmail.com",
    phone: "+260 97 125439",
    loyaltyPoints: 2400,
    addresses: [
      {
        id: "addr_1",
        fullName: "Fortune Njelesani",
        phone: "+260 97 125439",
        street: "Golden Gate Avenue, Plot 14",
        city: "Lusaka",
        postalCode: "10101",
        country: "Zambia"
      }
    ],
    wishlist: ["drip-001", "drip-004"]
  });

  // active selected product overlay details
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Obsidian Black');

  // Active Promo Settings
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Auto-Sync User Model Wishlist on state update
  useEffect(() => {
    setUserProfile(prev => ({ ...prev, wishlist }));
  }, [wishlist]);

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color: string) => {
    const itemKey = `${product.id}_${size}_${color}`;
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === itemKey);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      } else {
        return [...prev, {
          id: itemKey,
          product,
          size,
          color,
          quantity: 1
        }];
      }
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Wishlist toggle
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Promo card application
  const applyCoupon = (code: string) => {
    if (code === 'DRIP40') {
      setCouponCode('DRIP40');
      setDiscountAmount(Math.round(cartSubtotal * 0.40));
      return true;
    } else if (code === 'GOLD20') {
      setCouponCode('GOLD20');
      setDiscountAmount(Math.round(cartSubtotal * 0.20));
      return true;
    }
    return false;
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    setActiveTrackOrder(newOrder);
    setCart([]);
    setCouponCode('');
    setDiscountAmount(0);
    
    // Add dynamic VIP Loyalty Points
    setUserProfile(prev => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + Math.round(newOrder.total * 0.10)
    }));

    setView('tracking');
  };

  const handleReorder = (or: Order) => {
    // transfer items back
    const reconstructed = or.items.map(it => ({
      ...it,
      id: `${it.product.id}_${it.size}_${it.color}`
    }));
    setCart([...cart, ...reconstructed]);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Immersive background luxury glow effects */}
      <div className="absolute top-[10%] left-[-15%] w-[60vw] h-[60vw] bg-[#C5A059]/5 rounded-full filter blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[50%] right-[-15%] w-[50vw] h-[50vw] bg-[#C5A059]/3 rounded-full filter blur-[180px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] bg-zinc-800/20 rounded-full filter blur-[130px] pointer-events-none z-0" />
      
      {/* Global Header */}
      <Navbar 
        currentView={currentView} 
        setView={setView} 
        cart={cart}
        wishlistCount={wishlist.length}
      />

      {/* Main Adaptive Screen Routers */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <Hero 
                onDiscover={() => setView('shop')}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setActiveImageIdx(0);
                  setSelectedSize(p.sizes[0] || 'M');
                  setSelectedColor(p.colors[0] || 'Obsidian Black');
                }}
                trendingProducts={products.filter(p => p.isTrending)}
              />
            </motion.div>
          )}

          {currentView === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ShopPage 
                products={products}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                onAddToCart={handleAddToCart}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setActiveImageIdx(0);
                  setSelectedSize(p.sizes[0] || 'M');
                  setSelectedColor(p.colors[0] || 'Obsidian Black');
                }}
              />
            </motion.div>
          )}

          {currentView === 'stylist' && (
            <motion.div
              key="stylist"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <AIFeatures 
                cart={cart}
                wishlist={wishlist}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setActiveImageIdx(0);
                  setSelectedSize(p.sizes[0] || 'M');
                  setSelectedColor(p.colors[0] || 'Obsidian Black');
                }}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          )}

          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <UserDashboard 
                user={userProfile}
                orders={orders}
                toggleWishlist={toggleWishlist}
                onAddToCart={handleAddToCart}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setActiveImageIdx(0);
                  setSelectedSize(p.sizes[0] || 'M');
                  setSelectedColor(p.colors[0] || 'Obsidian Black');
                }}
                onReorder={handleReorder}
                setView={setView}
              />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel 
                products={products}
                orders={orders}
                onUpdateProducts={setProducts}
                onUpdateOrders={setOrders}
              />
            </motion.div>
          )}

          {/* ACQUISITION CART SHOPPING BAG */}
          {currentView === 'cart' && (
            <motion.div
              className="max-w-4xl mx-auto px-4 py-12 pb-32 animate-in fade-in duration-300"
              key="cart"
            >
              <div className="flex justify-between items-end border-b border-zinc-900 pb-4 mb-8">
                <div>
                  <p className="text-[9px] tracking-widest text-gold-500 font-mono font-bold uppercase">SHOPPING VECTOR</p>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-widest text-white uppercase">YOUR SHOPPING BAG</h2>
                </div>
                <button
                  id="checkout-cart-clear-btn"
                  onClick={() => setView('shop')}
                  className="text-xs text-zinc-400 hover:text-white underline tracking-wider font-mono font-bold uppercase"
                >
                  ADD MORE DESIGNS
                </button>
              </div>

              {cart.length === 0 ? (
                <div id="cart-vacant" className="text-center py-20 border border-zinc-950">
                  <p className="text-sm font-mono tracking-widest text-zinc-500">YOUR SHOPPING BAG IS CURRENTLY EMPTY.</p>
                  <button 
                    id="cart-shop-now"
                    onClick={() => setView('shop')} 
                    className="px-6 py-3.5 bg-gold-500 text-black text-xs tracking-widest font-mono font-bold mt-6 hover:bg-white uppercase transition-colors"
                  >
                    ACQUIRE LUXURY STYLES NOW
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  
                  {/* Cart Items List */}
                  <div className="md:col-span-2 space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="p-4 border border-zinc-900 bg-zinc-950/20 flex space-x-4 items-center justify-between">
                        <div className="flex space-x-4 items-center overflow-hidden">
                          <img src={item.product.image} alt={item.product.name} className="w-16 h-20 object-cover border border-zinc-900 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[8px] tracking-widest text-zinc-550 font-mono uppercase">{item.product.brand}</p>
                            <h4 className="text-xs font-semibold text-white truncate uppercase">{item.product.name}</h4>
                            <p className="text-[10px] text-zinc-400 font-mono uppercase mt-1">SIZE: {item.size} | COLOR: {item.color}</p>
                            <p className="text-xs text-gold-500 font-bold font-mono mt-1">${item.product.price}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-3 shrink-0">
                          {/* Quantity control */}
                          <div className="flex items-center space-x-2 border border-zinc-850 bg-black p-1">
                            <button 
                              id={`qty-minus-${item.id}`}
                              onClick={() => updateCartQty(item.id, -1)} 
                              className="p-1 hover:text-gold-500 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-semibold px-2">{item.quantity}</span>
                            <button 
                              id={`qty-plus-${item.id}`}
                              onClick={() => updateCartQty(item.id, 1)} 
                              className="p-1 hover:text-gold-500 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            id={`cart-remove-${item.id}`}
                            onClick={() => removeCartItem(item.id)}
                            className="text-[9px] tracking-widest font-mono text-zinc-500 hover:text-red-500 flex items-center space-x-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>DELETE</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Balance Checklist */}
                  <div className="space-y-6">
                    <div className="border border-zinc-909 bg-zinc-1000/60 p-6 space-y-6">
                      <h3 className="text-xs tracking-[0.15em] font-bold text-white uppercase border-b border-zinc-900 pb-3">
                        PRICE SUMMARY
                      </h3>

                      <div className="space-y-3.5 font-mono text-xs">
                        <div className="flex justify-between text-zinc-400">
                          <span>SUB-TOTAL</span>
                          <span>${cartSubtotal}</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>SHIPPING TRANSPORTS</span>
                          <span>{cartSubtotal > 300 ? "FREE" : "$25"}</span>
                        </div>
                        <div className="flex justify-between text-white font-bold text-sm border-t border-zinc-900 pt-4">
                          <span>SUBTOTAL PRICE</span>
                          <span className="text-gold-500">${cartSubtotal + (cartSubtotal > 300 ? 0 : 25)}</span>
                        </div>
                      </div>

                      <button
                        id="btn-trigger-checkout"
                        onClick={() => setView('checkout')}
                        className="w-full py-4 bg-gold-400 hover:bg-white text-black font-semibold text-xs tracking-[0.25em] font-mono transition-all flex items-center justify-center space-x-2"
                      >
                        <span>PROCEED TO SECURE PAY</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </motion.div>
          )}

          {currentView === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Checkout 
                cart={cart}
                subtotal={cartSubtotal}
                discount={discountAmount}
                couponCode={couponCode}
                applyCoupon={applyCoupon}
                onPlaceOrder={handlePlaceOrder}
                goBackToCart={() => setView('cart')}
              />
            </motion.div>
          )}

          {currentView === 'tracking' && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Tracking 
                order={activeTrackOrder}
                setView={setView}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* GRAND PRODUCT DETAILS INTERACTIVE SLIDE-OUT OVERLAY */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            id="product-details-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm"
          >
            {/* Modal dismiss action */}
            <div className="absolute inset-0" onClick={() => setSelectedProduct(null)} />

            <motion.div 
              id="details-card-body"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative w-full max-w-2xl h-full glass-panel-heavy border-l border-gold-550/15 overflow-y-auto z-10 flex flex-col justify-between shadow-2xl"
            >
              {/* Product close header */}
              <div className="p-4 bg-black/40 backdrop-blur-md border-b border-white/5 sticky top-0 flex justify-between items-center z-10">
                <button
                  id="btn-back-to-shop"
                  onClick={() => setSelectedProduct(null)}
                  className="flex items-center space-x-2 text-zinc-400 hover:text-white text-[10px] tracking-widest font-mono uppercase"
                >
                  <ArrowLeft className="w-4 h-4 text-gold-500" />
                  <span>BACK TO THE GALLERY</span>
                </button>
                <button
                  id="btn-close-product"
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 bg-zinc-900 text-white hover:text-gold-500 rounded-full"
                  aria-label="Close product details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Central Information Body */}
              <div className="p-6 md:p-8 space-y-8 flex-grow">
                
                {/* Images grid coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Miniature selectors */}
                  <div className="hidden md:flex flex-col space-y-3">
                    {(selectedProduct.images || [selectedProduct.image]).map((img, index) => (
                      <button
                        id={`gallery-thumb-${index}`}
                        key={index}
                        onClick={() => setActiveImageIdx(index)}
                        className={`aspect-square overflow-hidden border transition-transform ${
                          activeImageIdx === index ? 'border-gold-500 scale-95' : 'border-zinc-900 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="miniature" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  {/* Primary magnified main image */}
                  <div className="md:col-span-3 aspect-square overflow-hidden border border-zinc-900 bg-zinc-950 flex justify-center items-center relative group">
                    <img 
                      src={(selectedProduct.images || [selectedProduct.image])[activeImageIdx]} 
                      alt={selectedProduct.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-zinc-850 px-2 py-0.5 text-[8px] font-mono text-gold-500 tracking-widest uppercase">
                      MAGNIFY ACTIVE
                    </div>
                  </div>
                </div>

                {/* Garment Title header */}
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-zinc-550 uppercase">{selectedProduct.brand}</span>
                  <h3 className="text-xl md:text-3xl font-serif tracking-wider font-extrabold text-white mt-1 uppercase leading-snug">{selectedProduct.name}</h3>
                  
                  <div className="flex items-center space-x-4 mt-3">
                    <span className="text-lg font-mono font-bold text-gold-500">${selectedProduct.price}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-xs text-zinc-550 line-through font-mono">${selectedProduct.originalPrice}</span>
                    )}
                    <span className="w-[1px] h-3 bg-zinc-800" />
                    <div className="flex items-center space-x-1 text-gold-500">
                      <Star className="w-3.5 h-3.5 fill-gold-500" />
                      <span className="text-xs font-mono font-bold text-zinc-300">{selectedProduct.rating} ({selectedProduct.reviewsCount} REVIEWS)</span>
                    </div>
                  </div>
                </div>

                {/* Craft details material profile */}
                <div className="space-y-3 p-4 border border-zinc-900 bg-zinc-950/20">
                  <h4 className="text-[9px] tracking-widest font-mono font-bold text-gold-500 uppercase">CRAFT & MATERIAL COMPOSITE</h4>
                  <p className="text-xs tracking-wider text-zinc-400 font-light leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Sizes and options triggers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                  <div className="space-y-3">
                    <label className="text-[9px] tracking-widest text-zinc-500 font-mono font-bold uppercase">SIZE COUTURE</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((sz) => (
                        <button
                          id={`detail-size-${sz}`}
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`w-11 h-9 flex items-center justify-center text-xs font-mono border transition-colors ${
                            selectedSize === sz 
                              ? 'border-gold-500 text-gold-500 font-semibold bg-gold-500/5' 
                              : 'border-zinc-900 text-zinc-400 hover:border-zinc-805'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] tracking-widest text-zinc-500 font-mono font-bold uppercase">COLOUR BLEND</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors.map((cl) => (
                        <button
                          id={`detail-color-${cl}`}
                          key={cl}
                          onClick={() => setSelectedColor(cl)}
                          className={`px-3 py-2 text-[10px] border transition-colors ${
                            selectedColor === cl 
                              ? 'border-gold-500 text-gold-500 font-semibold bg-gold-500/5' 
                              : 'border-zinc-900 text-zinc-400 hover:border-zinc-805'
                          }`}
                        >
                          {cl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Standard Shipping estimation banner info */}
                <div className="p-4 border border-zinc-900 bg-zinc-950 flex items-center space-x-3 text-xs tracking-wider text-zinc-400 font-light">
                  <Truck className="w-5 h-5 text-gold-500 shrink-0" />
                  <p>Estimated dispatch: Standard Same Day Express to Lusaka or regional hubs. (Free on purchases exceeding $300).</p>
                </div>

                {/* Detailed reviews card logs */}
                <div className="space-y-4">
                  <h4 className="text-[10px] tracking-widest text-zinc-500 font-mono uppercase font-bold border-b border-zinc-900 pb-2">PRESTIGE REVIEWS ({selectedProduct.reviewsCount})</h4>
                  
                  {[
                    { id: 1, name: "Sipho K.", r: 5, c: "The heavy loop-knit structure of this is exceptional. The golden details have pristine sheen. Absolute gold standards." },
                    { id: 2, name: "Mwila M.", r: 5, c: "Magnificent drape. Best luxury purchase this season, parcel was trackable live and dispatched instantly." }
                  ].map((rev) => (
                    <div key={rev.id} className="text-xs space-y-1.5 p-3.5 border border-zinc-950">
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="font-semibold uppercase">{rev.name}</span>
                        <div className="flex text-gold-500 space-x-0.5">
                          {Array.from({ length: rev.r }).map((_, rIdx) => (
                            <Star key={rIdx} className="w-3 h-3 fill-gold-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-zinc-500 tracking-wide font-light">{rev.c}</p>
                    </div>
                  ))}
                </div>

              </div>

              {/* CONVERSION BOTTOM COCKPIT (Sticky buy banner) */}
              <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex space-x-4 sticky bottom-0 z-10 w-full items-center">
                <button
                  id="btn-detail-add-to-cart"
                  onClick={() => {
                    handleAddToCart(selectedProduct, selectedSize, selectedColor);
                    triggerToast(`${selectedProduct.name} (${selectedSize} / ${selectedColor}) successfully packed in your luxury bag.`);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-4 bg-gold-400 hover:bg-white text-black font-semibold text-xs tracking-[0.25em] font-mono transition-colors flex justify-center items-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>PACK IN THE BAG</span>
                </button>

                <button
                  id="btn-detail-wishlist"
                  onClick={() => {
                    toggleWishlist(selectedProduct.id);
                  }}
                  className={`p-4 border transition-colors ${
                    wishlist.includes(selectedProduct.id) 
                      ? 'border-gold-500 bg-gold-500/5 text-gold-500' 
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-4 h-4 ${wishlist.includes(selectedProduct.id) ? 'fill-gold-500' : ''}`} />
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Luxury Brand Footer Coordinates */}
      <footer id="global-footer" className="bg-black/95 border-t border-zinc-900 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-serif tracking-[0.25em] font-extrabold text-white">DRIP<span className="text-gold-500">LY</span></h4>
            <p className="text-xs text-zinc-500 tracking-wider font-light leading-relaxed">
              Bespoke, premium fashion solutions bridging Parisian craftsmanship with cutting edge artificial intelligence models. High style, secure dispatches.
            </p>
          </div>

          <div>
            <h5 className="text-[10px] tracking-widest text-gold-500 font-mono font-bold uppercase mb-4">DRIP LINES</h5>
            <ul className="space-y-2 text-xs text-zinc-400 tracking-wide font-light">
              <li className="hover:text-gold-400 cursor-pointer" onClick={() => setView('shop')}>VELVET & SILK COUTURE</li>
              <li className="hover:text-gold-400 cursor-pointer" onClick={() => setView('shop')}>MILITARY UTILITY SERIES</li>
              <li className="hover:text-gold-400 cursor-pointer" onClick={() => setView('shop')}>HEAVY CORE SWEATSHIRTS</li>
              <li className="hover:text-gold-400 cursor-pointer" onClick={() => setView('shop')}>PRESTIGE COMBAT BOOTS</li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] tracking-widest text-gold-500 font-mono font-bold uppercase mb-4">INTEGRITY & SERVICES</h5>
            <ul className="space-y-2 text-xs text-zinc-400 tracking-wide font-light">
              <li className="hover:text-gold-400 cursor-pointer" onClick={() => setView('dashboard')}>DRESSER SAVED STYLES</li>
              <li className="hover:text-gold-400 cursor-pointer" onClick={() => setView('tracking')}>MONITORED EXPRESS CHAINS</li>
              <li className="hover:text-gold-400 cursor-pointer" onClick={() => setView('dashboard')}>LOYAL VIP BENEFITS</li>
              <li className="hover:text-gold-400 cursor-pointer" onClick={() => setView('admin')}>DISTRIBUTOR COMMAND HQ</li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] tracking-widest text-gold-500 font-mono font-bold uppercase mb-4">HOTLINES</h5>
            <ul className="space-y-2 text-xs text-zinc-400 tracking-wide font-light font-mono">
              <li>TRANSIT: +260 97 810425</li>
              <li>OFFICES: CHUBAKA ROAD, LUSAKA</li>
              <li>ENVELOPE: HELP@DRIPLY.COUTURE</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-zinc-900/60 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-zinc-550">
          <p>© 2026 DRIPLY FRANCE S.A. ALL COUTURE SHAPED SECURELY.</p>
          <p className="tracking-widest uppercase mt-4 sm:mt-0 text-white">VISA • MASTERCARD • AIRTEL MONEY • MTN MOBILE MONEY</p>
        </div>
      </footer>

      {/* Dynamic luxury notification toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            id="driply-notification-toast"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`fixed bottom-24 right-6 md:bottom-12 md:right-12 z-50 p-4 rounded-none border max-w-sm flex items-start space-x-3.5 shadow-2xl backdrop-blur-xl ${
              toast.type === 'success' 
                ? 'bg-black/95 border-gold-500/30 border-l-[4px] border-l-gold-500 text-white animate-pulse' 
                : toast.type === 'error'
                  ? 'bg-black/95 border-red-650/30 border-l-[4px] border-l-red-500 text-white' 
                  : 'bg-black/95 border-zinc-805/50 border-l-[4px] border-l-zinc-500 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <Sparkles className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
            ) : toast.type === 'error' ? (
              <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            ) : (
              <Truck className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-grow min-w-0">
              <span className="text-[8px] font-mono tracking-widest text-[#C5A059] font-bold uppercase block mb-1">
                {toast.type === 'success' ? 'COUTURE UPDATE' : toast.type === 'error' ? 'SYSTEM ALARM' : 'LOGISTICAL FEED'}
              </span>
              <p className="text-xs tracking-wide text-zinc-200 leading-relaxed font-light">{toast.message}</p>
            </div>
            <button 
              id="close-toast-btn"
              onClick={() => setToast(null)}
              className="text-zinc-500 hover:text-white p-0.5 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
