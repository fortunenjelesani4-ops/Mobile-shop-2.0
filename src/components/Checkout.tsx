import React, { useState } from 'react';
import { CreditCard, Phone, ArrowLeft, ShieldCheck, Ticket, Check, Loader2, Sparkles } from 'lucide-react';
import { CartItem, DeliveryAddress, Order } from '../types';
import { triggerToast } from '../utils';

interface CheckoutProps {
  cart: CartItem[];
  subtotal: number;
  discount: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  onPlaceOrder: (order: Order) => void;
  goBackToCart: () => void;
}

export default function Checkout({
  cart,
  subtotal,
  discount,
  couponCode,
  applyCoupon,
  onPlaceOrder,
  goBackToCart
}: CheckoutProps) {
  // Billing and shipping address
  const [address, setAddress] = useState<DeliveryAddress>({
    id: `addr_${Math.floor(1000 + Math.random() * 9000)}`,
    fullName: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "Zambia" // default representative target for Airtel/MTN integration
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'airtel' | 'mtn'>('card');
  const [paymentNumber, setPaymentNumber] = useState('');
  
  // Credit Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Promo coupon application
  const [promoInput, setPromoInput] = useState(couponCode);
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(
    couponCode ? { text: "Coupon applied successfully!", success: true } : null
  );

  // States for simulated processing gates
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinNumber, setPinNumber] = useState('');
  const [pinError, setPinError] = useState('');

  const shipping = subtotal > 300 ? 0 : 25;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const ok = applyCoupon(promoInput.trim().toUpperCase());
    if (ok) {
      setPromoMessage({ text: `Success! Code "${promoInput.toUpperCase()}" applied.`, success: true });
    } else {
      setPromoMessage({ text: "Invalid or expired luxury code.", success: false });
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street || !address.city) {
      triggerToast("Please complete your delivery address coordinates.", "error");
      return;
    }

    if (paymentMethod !== 'card' && !paymentNumber) {
      triggerToast("Please enter your mobile phone number for the network carrier.", "error");
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'card') {
      // Simulate credit card processing delay
      setTimeout(() => {
        setIsProcessing(false);
        finalizeOrder();
      }, 2500);
    } else {
      // Trigger Carrier USSD PIN simulation model
      setTimeout(() => {
        setIsProcessing(false);
        setShowPinPrompt(true);
      }, 1500);
    }
  };

  const handlePinSubmit = () => {
    if (pinNumber.length < 4) {
      setPinError("Carrier PIN must be 4 digits.");
      return;
    }
    setPinError('');
    setIsProcessing(true);
    setShowPinPrompt(false);

    // Simulate carrier authorization after PIN entry
    setTimeout(() => {
      setIsProcessing(false);
      finalizeOrder();
    }, 2000);
  };

  const finalizeOrder = () => {
    const generatedOrder: Order = {
      id: `DRIP-${Math.floor(100000 + Math.random() * 900000)}`,
      items: cart,
      subtotal,
      discount,
      shipping,
      total: grandTotal,
      status: 'ordered',
      paymentMethod,
      paymentStatus: 'success',
      paymentNumber: paymentMethod !== 'card' ? paymentNumber : undefined,
      address,
      createdAt: new Date().toISOString(),
      riderName: "Mwamba Chilufya",
      riderPhone: "+260 97 810425",
      estimatedDelivery: new Date(Date.now() + 35 * 60000).toISOString(), // 35 minutes
      couponCode: promoInput || undefined
    };
    onPlaceOrder(generatedOrder);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      <button
        id="btn-back-to-cart"
        onClick={goBackToCart}
        className="flex items-center space-x-2 text-zinc-400 hover:text-white text-xs tracking-widest uppercase transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 text-gold-500" />
        <span>BACK TO SHOPPING BAG</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Checkout Billing & Payment Column */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-xl md:text-3xl font-serif font-bold tracking-widest text-white uppercase border-b border-zinc-900 pb-4">
            SECURE COUTURE CHECKOUT
          </h2>

          <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-8">
            
            {/* Section 1: Delivery Coordinates */}
            <div className="space-y-4">
              <h3 className="text-xs tracking-[0.2em] font-bold text-gold-500 uppercase flex items-center space-x-2">
                <span>01. DELIVERY COORDINATES</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  id="checkout-fullName"
                  type="text" 
                  placeholder="FULL NAME"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-4 py-3.5 focus:outline-none focus:border-gold-500 uppercase w-full"
                />
                <input 
                  id="checkout-phone"
                  type="tel" 
                  placeholder="CONTACT PHONE"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-4 py-3.5 focus:outline-none focus:border-gold-500 uppercase w-full"
                />
              </div>

              <input 
                id="checkout-street"
                type="text" 
                placeholder="STREET ADDRESS (SUITE, APARTMENT)"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-4 py-3.5 focus:outline-none focus:border-gold-500 uppercase w-full"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  id="checkout-city"
                  type="text" 
                  placeholder="CITY"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-4 py-3.5 focus:outline-none focus:border-gold-500 uppercase w-full"
                />
                <input 
                  id="checkout-postal"
                  type="text" 
                  placeholder="POSTAL / ZIP CODE"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-4 py-3.5 focus:outline-none focus:border-gold-500 uppercase w-full"
                />
                <select 
                  id="checkout-country"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-zinc-400 px-4 py-3.5 focus:outline-none focus:border-gold-500 uppercase w-full"
                >
                  <option value="Zambia">Zambia (Airtel+MTN Available)</option>
                  <option value="South Africa">South Africa</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                </select>
              </div>
            </div>

            {/* Section 2: Premium Payment Channel */}
            <div className="space-y-4">
              <h3 className="text-xs tracking-[0.2em] font-bold text-gold-500 uppercase">
                02. HYBRID PAYMENT CHANNEL
              </h3>

              <div className="grid grid-cols-3 gap-4">
                {/* Stripe Card */}
                <button
                  id="payment-method-card"
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border text-center flex flex-col items-center justify-center space-y-2 transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-gold-500 bg-gold-500/5 text-gold-500' 
                      : 'border-zinc-900 bg-zinc-950/20 text-zinc-400 hover:border-zinc-800'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[9px] tracking-widest font-mono">VISA / MASTERCARD</span>
                </button>

                {/* Airtel Money */}
                <button
                  id="payment-method-airtel"
                  type="button"
                  onClick={() => { setPaymentMethod('airtel'); setPaymentNumber(''); }}
                  className={`p-4 border text-center flex flex-col items-center justify-center space-y-2 transition-all ${
                    paymentMethod === 'airtel' 
                      ? 'border-red-600 bg-red-600/5 text-red-500' 
                      : 'border-zinc-900 bg-zinc-950/20 text-zinc-400 hover:border-zinc-800'
                  }`}
                >
                  <div className="w-5 h-5 font-bold text-xs bg-red-600 text-white flex items-center justify-center rounded-full">A</div>
                  <span className="text-[9px] tracking-widest font-mono">AIRTEL MONEY</span>
                </button>

                {/* MTN Money */}
                <button
                  id="payment-method-mtn"
                  type="button"
                  onClick={() => { setPaymentMethod('mtn'); setPaymentNumber(''); }}
                  className={`p-4 border text-center flex flex-col items-center justify-center space-y-2 transition-all ${
                    paymentMethod === 'mtn' 
                      ? 'border-yellow-500 bg-yellow-500/5 text-yellow-500' 
                      : 'border-zinc-900 bg-zinc-950/20 text-zinc-400 hover:border-zinc-800'
                  }`}
                >
                  <div className="w-5 h-5 font-bold text-xs bg-yellow-400 text-black flex items-center justify-center rounded-full">M</div>
                  <span className="text-[9px] tracking-widest font-mono">MTN MONEY</span>
                </button>
              </div>

              {/* Stripe Credit Card Form inputs */}
              {paymentMethod === 'card' && (
                <div id="stripe-inputs" className="border border-zinc-900 bg-zinc-950/20 p-5 space-y-4 animate-in fade-in duration-300">
                  <p className="text-[9px] tracking-widest text-zinc-500 font-mono">STRIPE HOSTED COMPLIANT LAYOUT</p>
                  
                  <input 
                    id="stripe-cardNumber"
                    type="text" 
                    placeholder="CARD NUMBER (4111 2222 3333 4444)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    maxLength={19}
                    className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-4 py-3.5 focus:outline-none focus:border-gold-500 w-full font-mono"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      id="stripe-expiry"
                      type="text" 
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      maxLength={5}
                      className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-4 py-3.5 focus:outline-none focus:border-gold-500 w-full font-mono"
                    />
                    <input 
                      id="stripe-cvv"
                      type="password" 
                      placeholder="CVV"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength={3}
                      className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-4 py-3.5 focus:outline-none focus:border-gold-500 w-full font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Mobile Money configuration fields */}
              {(paymentMethod === 'airtel' || paymentMethod === 'mtn') && (
                <div id="momo-inputs" className="border border-zinc-900 bg-zinc-950/20 p-5 space-y-4 animate-in fade-in duration-300">
                  <p className="text-[9px] tracking-widest text-zinc-500 font-mono uppercase">
                    {paymentMethod.toUpperCase()} INSTANT DEBIT SETTINGS
                  </p>
                  
                  <div className="relative">
                    <input 
                      id="momo-number"
                      type="tel" 
                      required
                      placeholder="ENTER AIRTEL/MTN MOBILE NUMBER (E.G. +260 97 ...)"
                      value={paymentNumber}
                      onChange={(e) => setPaymentNumber(e.target.value)}
                      className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-4 py-3.5 pl-10 focus:outline-none focus:border-gold-500 w-full font-mono"
                    />
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  </div>
                  <p className="text-[8px] tracking-wide text-zinc-500">
                    * Make sure your mobile terminal is unlocked. You will receive a direct carrier popup context modal requesting your Mobile Money Wallet PIN to complete transaction instantly.
                  </p>
                </div>
              )}
            </div>

            {/* Custom Payment Action Button */}
            <button
              id="submit-checkout"
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-gold-500 hover:bg-white text-black font-semibold text-xs tracking-[0.25em] font-mono transition-all flex items-center justify-center space-x-3 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AUTHORIZING TRANSACTION SYSTEMS...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>APPROVE AND AUTHORIZE ORDER</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div id="checkout-summary-sidebar" className="space-y-6">
          <div className="border border-zinc-900 bg-zinc-1000/60 p-6 space-y-6">
            <h3 className="text-xs tracking-[0.15em] font-bold text-white uppercase border-b border-zinc-900 pb-3">
              YOUR CART RECTIFICATION
            </h3>

            {/* Scrolled Items */}
            <div className="max-h-60 overflow-y-auto space-y-4 pr-1.5">
              {cart.map((item) => (
                <div key={item.id} className="flex space-x-3 items-center">
                  <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover border border-zinc-900" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-semibold text-white truncate uppercase">{item.product.name}</h4>
                    <p className="text-[9px] text-zinc-500 font-mono mt-0.5">SIZE: {item.size} | QTY: {item.quantity}</p>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-white">${item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Coupon Code Entry */}
            <div className="space-y-2 border-t border-b border-zinc-900 py-4">
              <label className="text-[9px] tracking-widest text-zinc-400 font-mono font-bold uppercase">PROMO COUPON</label>
              <div className="flex space-x-2">
                <input 
                  id="promo-code-input"
                  type="text" 
                  placeholder="ENTER ACCESS CODE (DRIP40)" 
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-3 py-2 w-full uppercase focus:outline-none focus:border-gold-500 font-mono"
                />
                <button
                  id="apply-promo-btn"
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 bg-gold-400 text-black hover:bg-white text-[10px] tracking-widest font-bold font-mono transition-colors"
                >
                  APPLY
                </button>
              </div>
              {promoMessage && (
                <p className={`text-[9px] tracking-widest font-mono ${promoMessage.success ? 'text-green-500' : 'text-red-500'}`}>
                  {promoMessage.text}
                </p>
              )}
            </div>

            {/* Calculations Balance Sheet */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>SUBTOTAL</span>
                <span>${subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>DISCOUNT CARD</span>
                  <span>-${discount}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>PRESTIGE DELIVERY</span>
                <span>{shipping === 0 ? "FREE" : `$${shipping}`}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm border-t border-zinc-900 pt-3">
                <span>TOTAL PRICE</span>
                <span className="text-gold-500">${grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operator SIM/USSD Checkout Overlay (Pure Delight / Interactive High Fidelity) */}
      {showPinPrompt && (
        <div id="carrier-ussd-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-zinc-950 border-2 border-gold-500 p-6 shadow-2xl rounded-none text-center transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-gold-500 text-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            
            <h4 className="text-sm font-serif font-bold tracking-widest text-white uppercase">{paymentMethod.toUpperCase()} WALLET PUSH DEBIT</h4>
            <p className="text-xs text-zinc-400 tracking-wider mt-2">
              We have initiated a carrier handshake. Enter your secure Mobile Money PIN to authorize billing amount:
            </p>
            <p className="text-lg font-mono font-bold text-gold-500 mt-4">${grandTotal} USD</p>

            <div className="mt-6 space-y-4">
              <input 
                id="momo-pin-input"
                type="password" 
                maxLength={4}
                placeholder="••••"
                required
                value={pinNumber}
                onChange={(e) => setPinNumber(e.target.value.replace(/\D/g, ''))}
                className="w-32 bg-zinc-900 border border-gold-500/30 text-white font-bold text-xl text-center py-2.5 tracking-[0.5em] focus:outline-none focus:border-gold-500 rounded-none h-12 font-mono"
              />
              {pinError && <p className="text-[10px] tracking-widest text-red-500 font-mono">{pinError}</p>}

              <div className="flex gap-4">
                <button
                  id="cancel-pin-btn"
                  type="button"
                  onClick={() => setShowPinPrompt(false)}
                  className="w-1/2 py-2.5 border border-zinc-800 text-zinc-400 text-[10px] tracking-widest font-bold uppercase hover:bg-zinc-900 transition-colors"
                >
                  ABORT
                </button>
                <button
                  id="submit-pin-btn"
                  type="button"
                  onClick={handlePinSubmit}
                  className="w-1/2 py-2.5 bg-gold-500 text-black text-[10px] tracking-widest font-bold uppercase hover:bg-white transition-colors"
                >
                  ALLOW
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
