import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Phone, ShieldCheck, Mail, Calendar, ArrowRight, Compass, Navigation } from 'lucide-react';
import { Order, TrackingStep } from '../types';

interface TrackingProps {
  order: Order | null;
  setView: (view: string) => void;
}

export default function Tracking({ order, setView }: TrackingProps) {
  // If no order exists, provide a sample premium tracked order for immediate feedback
  const [activeOrder, setActiveOrder] = useState<Order | null>(order);
  const [timelineStatus, setTimelineStatus] = useState<'ordered' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered'>('ordered');
  
  // Custom interactive simulated coordinates for the moving map courier
  const [courierPosition, setCourierPosition] = useState({ x: 30, y: 70 });

  useEffect(() => {
    if (order) {
      setActiveOrder(order);
      setTimelineStatus(order.status);
    } else {
      // Create detailed default mock order
      const defaultOrder: Order = {
        id: "DRIP-624239",
        items: [],
        subtotal: 150,
        discount: 0,
        shipping: 25,
        total: 175,
        status: 'ordered',
        paymentMethod: 'mtn',
        paymentStatus: 'success',
        address: {
          id: "addr_1",
          fullName: "Fortune Njelesani",
          phone: "+260 97 123456",
          street: "Golden Gate Avenue, Plot 14",
          city: "Lusaka",
          postalCode: "10101",
          country: "Zambia"
        },
        createdAt: new Date().toISOString(),
        riderName: "Mwamba Chilufya",
        riderPhone: "+260 97 810425",
        estimatedDelivery: new Date(Date.now() + 25 * 60000).toISOString()
      };
      setActiveOrder(defaultOrder);
      setTimelineStatus('ordered');
    }
  }, [order]);

  // Simulate delivery tracker progression over time
  useEffect(() => {
    if (!activeOrder) return;

    // Ordered -> Processing -> Shipped -> Out for Delivery -> Delivered (simulated progress step increments)
    const timers = [
      setTimeout(() => { setTimelineStatus('processing'); setCourierPosition({ x: 45, y: 55 }); }, 5000),
      setTimeout(() => { setTimelineStatus('shipped'); setCourierPosition({ x: 60, y: 40 }); }, 15000),
      setTimeout(() => { setTimelineStatus('out_for_delivery'); setCourierPosition({ x: 75, y: 30 }); }, 28000),
      setTimeout(() => { setTimelineStatus('delivered'); setCourierPosition({ x: 90, y: 15 }); }, 42000)
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [activeOrder]);

  if (!activeOrder) return null;

  // Timesteps mapping
  const steps: TrackingStep[] = [
    {
      status: 'ordered',
      title: 'COUTURE CONFIRMED',
      description: 'Transaction cleared. Garment allocation has been locked.',
      timestamp: new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completed: true
    },
    {
      status: 'processing',
      title: 'STYLING AUDIT & PREPARATION',
      description: 'Weave integrity scans and gold aglet adjustments completed in packing hubs.',
      timestamp: timelineStatus !== 'ordered' ? 'Just Now' : 'Pending',
      completed: timelineStatus !== 'ordered'
    },
    {
      status: 'shipped',
      title: 'HANDED TO PRESTIGE CARRIER',
      description: 'Assigned to supreme courier line container with temp and humidity regulation.',
      timestamp: ['shipped', 'out_for_delivery', 'delivered'].includes(timelineStatus) ? 'En Route' : 'Awaiting',
      completed: ['shipped', 'out_for_delivery', 'delivered'].includes(timelineStatus)
    },
    {
      status: 'out_for_delivery',
      title: 'COURIER EN ROUTE',
      description: 'Rider is traversing the last mile grid checkpoint with your order container.',
      timestamp: ['out_for_delivery', 'delivered'].includes(timelineStatus) ? 'Active' : 'Awaiting',
      completed: ['out_for_delivery', 'delivered'].includes(timelineStatus)
    },
    {
      status: 'delivered',
      title: 'HANDOVER SEALED',
      description: 'Couture securely collected at destination. Dynamic loyalty ledger disbursed.',
      timestamp: timelineStatus === 'delivered' ? 'Completed' : 'Awaiting',
      completed: timelineStatus === 'delivered'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-900">
        <div>
          <p className="text-[10px] tracking-[0.3em] font-mono text-gold-500 font-bold uppercase">SECURED TRANSPORTS</p>
          <h2 className="text-3xl md:text-5xl font-serif font-extrabold tracking-widest text-white mt-1 uppercase">LIVE DISPATCH TRACKING</h2>
          <p className="text-xs text-zinc-500 tracking-wider mt-2">TRACKING REGISTER: <span className="text-white font-mono font-bold">{activeOrder.id}</span></p>
        </div>
        <button
          id="btn-return-shop"
          onClick={() => setView('shop')}
          className="px-6 py-3 border border-zinc-800 hover:border-gold-500 bg-zinc-950 text-[10px] tracking-widest text-zinc-400 hover:text-white font-mono transition-all uppercase self-start md:self-auto"
        >
          BROWSE DESIRED ADDITIONS
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Step-by-Step Logistics Timeline Card */}
        <div className="space-y-8">
          <div className="glass-panel p-6 md:p-8 space-y-6">
            <h3 className="text-xs tracking-[0.15em] font-bold text-white uppercase border-b border-zinc-900 pb-3 flex justify-between items-center">
              <span>DISPATCH CHRONOLOGY</span>
              <span className="px-2 py-0.5 bg-gold-500/10 text-gold-500 font-mono text-[8px] tracking-widest font-bold">STATUS: {timelineStatus.replace(/_/g, ' ').toUpperCase()}</span>
            </h3>

            <div className="relative space-y-8 before:absolute before:left-3 px-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-850">
              {steps.map((st, idx) => {
                const isActive = timelineStatus === st.status;
                const isLineActive = st.completed;
                return (
                  <div key={idx} className="flex space-x-6 items-start relative">
                    {/* Bullet Indicator */}
                    <div className={`w-6 h-6 border rounded-full flex items-center justify-center shrink-0 z-10 ${
                      isLineActive 
                        ? 'bg-gold-500 text-black border-gold-500' 
                        : isActive 
                          ? 'bg-zinc-950 text-gold-500 border-gold-500 animate-pulse' 
                          : 'bg-zinc-950 text-zinc-600 border-zinc-900'
                    }`}>
                      {isLineActive ? (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-gold-500' : 'bg-transparent'}`} />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className={`text-xs tracking-[0.15em] font-bold font-mono ${st.completed ? 'text-white' : 'text-zinc-500'}`}>
                          {st.title}
                        </h4>
                        <span className="text-[10px] font-mono text-gold-500 font-semibold">{st.timestamp}</span>
                      </div>
                      <p className="text-xs text-zinc-500 tracking-wide mt-1.5 font-light leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Courier GPS Simulation Map Panel */}
        <div className="space-y-8">
          <div className="glass-panel p-6 md:p-8 space-y-6">
            <h3 className="text-xs tracking-[0.15em] font-bold text-white uppercase border-b border-zinc-900 pb-3 flex justify-between items-center">
              <span>GPS COURIER GEO-TRAIL</span>
              {timelineStatus !== 'delivered' ? (
                <span className="flex items-center space-x-1.5 blink">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                  <span className="text-[8px] font-mono font-semibold tracking-widest text-red-500">LIVE SATELLITE DISPATCH</span>
                </span>
              ) : (
                <span className="text-[8px] font-mono font-semibold tracking-widest text-green-500">SECURELY TRANSFERRED</span>
              )}
            </h3>

            {/* Simulated Vector Canvas Map */}
            <div id="logistic-map" className="relative h-72 bg-zinc-950 border border-zinc-900 flex items-center justify-center overflow-hidden">
              {/* Decorative City Grid Lines */}
              <div className="absolute inset-0 opacity-10 bg-grid-pattern pointer-events-none" 
                   style={{ backgroundImage: "linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
              
              {/* Dashboard coordinates */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Gold Route Line Path */}
                <path 
                  d="M 120 220 Q 200 180 250 120 T 360 40" 
                  fill="none" 
                  stroke="#d4af37" 
                  strokeWidth="2.5" 
                  strokeDasharray="6,4" 
                  className="animate-route-dash" 
                />
                
                {/* Origin Pin */}
                <circle cx="120" cy="220" r="5" fill="#f3f4f6" />
                
                {/* Destination Nest */}
                <g transform="translate(360, 40)">
                  <circle r="7" fill="none" stroke="#d4af37" strokeWidth="2" className="animate-ping" />
                  <circle r="4" fill="#d4af37" />
                </g>
              </svg>

              {/* Dynamic Courier Bike Icon */}
              {timelineStatus !== 'delivered' && (
                <div 
                  id="map-courier-bike"
                  className="absolute w-8 h-8 bg-gold-500 border-2 border-black rounded-full flex items-center justify-center text-black shadow-lg transition-all duration-[2000ms] ease-out-sine z-10"
                  style={{ 
                    left: `${courierPosition.x}%`, 
                    top: `${courierPosition.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Navigation className="w-4 h-4 rotate-45 animate-pulse" />
                </div>
              )}

              {/* Float Map Overlay */}
              <div className="absolute top-4 left-4 bg-zinc-900/90 border border-zinc-800 p-2.5 space-y-1">
                <p className="text-[8px] font-mono font-bold tracking-widest text-zinc-550 uppercase">COURIER DISPATCH VESSEL</p>
                <p className="text-[10px] tracking-wide text-white font-serif uppercase">Driply Cargo Cycle x14</p>
              </div>
            </div>

            {/* Rider Credentials Cards */}
            <div className="border border-zinc-900 bg-zinc-950/20 p-5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-11 h-11 border border-gold-500/10 bg-gold-500/5 flex items-center justify-center text-gold-500 rounded-none shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs tracking-wider font-bold text-white uppercase">{activeOrder.riderName}</h4>
                  <p className="text-[8px] tracking-widest text-zinc-500 font-mono mt-1">MTN & AIRTEL CARRIER AGENT</p>
                </div>
              </div>
              <a 
                id="call-rider"
                href={`tel:${activeOrder.riderPhone}`}
                className="flex items-center space-x-2 px-4 py-2 border border-zinc-850 hover:border-gold-500 text-[10px] tracking-widest font-bold font-mono text-zinc-300 hover:text-white transition-colors"
                title={`Call Mwamba`}
              >
                <Phone className="w-3.5 h-3.5 text-gold-500" />
                <span>HOTLINE</span>
              </a>
            </div>

            {/* Estimate Block */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-zinc-900 bg-zinc-950/40">
                <p className="text-[8px] tracking-widest text-zinc-500 font-mono uppercase">LATEST COMMITTAL WINDOW</p>
                <p className="text-sm font-serif font-bold text-gold-500 uppercase mt-1">35 MINS EST.</p>
              </div>
              <div className="p-4 border border-zinc-900 bg-zinc-950/40">
                <p className="text-[8px] tracking-widest text-zinc-500 font-mono uppercase">DECLARED RECEIVER</p>
                <p className="text-sm font-serif font-bold text-white uppercase mt-1 truncate">{activeOrder.address.fullName}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
