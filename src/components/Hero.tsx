import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Star, Percent } from 'lucide-react';
import { Product } from '../types';

interface HeroProps {
  onDiscover: () => void;
  onSelectProduct: (product: Product) => void;
  trendingProducts: Product[];
}

export default function Hero({ onDiscover, onSelectProduct, trendingProducts }: HeroProps) {
  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 32, seconds: 45 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 0, seconds: 0 }; // refresh loop
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNum = (num: number) => num.toString().padStart(2, '0');

  const categories = [
    { name: "Outerwear", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400", count: "8 Styles" },
    { name: "Streetwear", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400", count: "12 Styles" },
    { name: "Pants", image: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=400", count: "6 Styles" },
    { name: "Footwear", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=400", count: "10 Styles" }
  ];

  return (
    <div className="w-full pb-24">
      {/* Cinematic Main Hero Frame */}
      <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
        {/* Ambient Darkened Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1600')",
            filter: "brightness(0.25) contrast(1.1)"
          }}
        />

        {/* Diagonal Gold Overlay Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Headline Typography Context */}
        <div className="relative max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold-500/20 bg-black/80 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] font-mono text-gold-400 font-semibold uppercase">NEXT-GEN STYLING PLATFORM</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-serif font-extrabold tracking-[0.2em] leading-tight text-white uppercase">
            REDEFINE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-gold-500 to-amber-300">
              YOUR DRIP
            </span>
          </h1>

          <p className="mt-6 text-zinc-300 text-xs md:text-sm tracking-[0.15em] max-w-xl font-light leading-relaxed">
            Experience ultra-tailored Parisian design paired with predictive AI guidance. Styled uniquely, ordered instantly, delivered with prestige.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onDiscover}
              className="group px-8 py-3.5 rounded-none font-medium text-xs tracking-[0.25em] bg-gold-500 text-black hover:bg-white hover:text-black transition-all duration-300 flex items-center space-x-3 w-64 justify-center"
            >
              <span>ACCESS THE SHOP</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button
              onClick={onDiscover}
              className="px-8 py-3.5 rounded-none font-medium text-xs tracking-[0.25em] border border-white/20 bg-black/60 text-white hover:border-gold-500/50 hover:bg-black/80 transition-all duration-300 w-64"
            >
              BROWSE COUTURE
            </button>
          </div>
        </div>
      </section>

      {/* Live Flash Sales Countdown Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="glass-panel px-6 py-8 md:p-8 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 transform rotate-45 translate-x-12 -translate-y-12" />
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full border border-gold-500/20 bg-gold-500/10 flex items-center justify-center text-gold-500">
              <Percent className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold tracking-widest text-white uppercase">Midnight Club Flash Release</h3>
              <p className="text-xs text-zinc-400 tracking-wider mt-1">Sought-after items, priced for select release windows.</p>
            </div>
          </div>

          {/* Golden Clock */}
          <div className="flex items-center space-x-3">
            <p className="text-[10px] tracking-[0.2em] font-mono text-gold-400 uppercase mr-2">ENDS IN:</p>
            <div className="flex space-x-2">
              {[{ val: timeLeft.hours, tag: 'HRS' }, { val: timeLeft.minutes, tag: 'MIN' }, { val: timeLeft.seconds, tag: 'SEC' }].map((time, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-14 h-12 bg-zinc-900 border border-gold-500/10 text-white font-mono text-lg font-bold flex items-center justify-center leading-none rounded-none">
                    {formatNum(time.val)}
                  </div>
                  <span className="text-[7px] tracking-widest text-zinc-500 mt-1">{time.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Features Statement */}
      <section className="max-w-7xl mx-auto px-4 mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: ShieldCheck, title: "EXQUISITE VERIFICATION", desc: "Every garment goes through strict laser audits for weave structure and custom tag verification." },
          { icon: Truck, title: "REAL-TIME LOGISTICS", desc: "Monitored express dispatches with instant MTN/Airtel SMS trackers and geo-tracking indicators." },
          { icon: RefreshCw, title: "EFFORTLESS REPLACEMENTS", desc: "Complimentary return pickup program for sizing swaps or high fashion collection updates." }
        ].map((feat, i) => (
          <div key={i} className="flex space-x-5 p-4 border border-zinc-900 bg-zinc-950/40">
            <div className="w-10 h-10 border border-gold-500/10 bg-gold-500/5 flex items-center justify-center shrink-0 text-gold-500">
              <feat.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs tracking-[0.15em] font-bold text-white uppercase">{feat.title}</h4>
              <p className="text-xs text-zinc-500 tracking-wide mt-2 font-light leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Styled Bento Grid Category Navigation */}
      <section className="max-w-7xl mx-auto px-4 mt-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-serif font-extrabold tracking-widest text-white uppercase">PREMIER COLLECTIONS</h2>
          <div className="w-12 h-[1px] bg-gold-500 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              onClick={onDiscover}
              className="relative h-64 overflow-hidden group cursor-pointer border border-zinc-800"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('${cat.image}')` }}
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors" />
              
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div>
                  <h3 className="text-xs tracking-[0.2em] font-bold text-white uppercase">{cat.name}</h3>
                  <p className="text-[10px] tracking-wider text-gold-400 mt-1">{cat.count}</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-gold-500 group-hover:text-gold-500 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending / Highlight Products */}
      <section className="max-w-7xl mx-auto px-4 mt-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-widest text-white uppercase">SEASONAL HOT LIST</h2>
          <p className="text-[10px] tracking-widest text-zinc-400 mt-1">High demand items with limited stock runs.</p>
          <div className="w-12 h-[1px] bg-gold-500 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {trendingProducts.slice(0, 4).map((p) => (
            <div 
              key={p.id}
              onClick={() => onSelectProduct(p)}
              className="group cursor-pointer bg-zinc-950/60 border border-zinc-950 hover:border-gold-500/25 transition-all"
            >
              <div className="relative h-80 overflow-hidden bg-zinc-900/60">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {p.isTrending && (
                    <span className="px-3 py-1 bg-gold-500 text-black text-[8px] tracking-widest font-bold font-mono">TRENDS</span>
                  )}
                  {p.isFlashSale && (
                    <span className="px-3 py-1 bg-red-600 text-white text-[8px] tracking-widest font-bold font-mono">-{p.discountRate}%</span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <p className="text-[8px] tracking-[0.2em] text-zinc-500 font-mono uppercase">{p.brand}</p>
                <h3 className="text-xs tracking-wider font-semibold text-white mt-1 group-hover:text-gold-400 transition-colors truncate">{p.name}</h3>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">${p.price}</span>
                    {p.originalPrice && (
                      <span className="text-[10px] text-zinc-500 line-through">${p.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-gold-500 fill-gold-500" />
                    <span className="text-[10px] text-zinc-300 font-semibold">{p.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Couture Video Mock Segment */}
      <section className="max-w-7xl mx-auto px-4 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-zinc-950 p-8 md:p-12 border border-zinc-900">
          <div>
            <div className="inline-flex items-center space-x-2 text-gold-500 mb-4">
              <Star className="w-4 h-4 fill-gold-500" />
              <span className="text-[10px] tracking-widest font-bold">THE COUTURE PROMISE</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-serif font-extrabold tracking-wider text-white leading-tight uppercase">EXPERIENCE PARISIAN STYLING VIRTUALLY</h3>
            <p className="text-xs text-zinc-400 tracking-wider leading-relaxed mt-6">
              Our bespoke, real-time AI advisor utilizes complex clothing semantics to map matching pieces, recommend standard fitting profiles, and recommend tailored color coordination. Engage the private stylist in our next tab to curate your elite wardrobe profile.
            </p>
            <div className="mt-8">
              <div className="flex space-x-8">
                <div>
                  <h4 className="text-xl font-serif text-gold-500 font-bold">18,000+</h4>
                  <p className="text-[9px] tracking-wider text-zinc-500 mt-1 uppercase">STYLED CLIENTS</p>
                </div>
                <div>
                  <h4 className="text-xl font-serif text-gold-500 font-bold">99.2%</h4>
                  <p className="text-[9px] tracking-wider text-zinc-500 mt-1 uppercase">SATISFACTION RATE</p>
                </div>
                <div>
                  <h4 className="text-xl font-serif text-gold-500 font-bold">14+</h4>
                  <p className="text-[9px] tracking-wider text-zinc-500 mt-1 uppercase">GLOBAL CARRIERS</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-96 overflow-hidden border border-gold-500/10 shadow-2xl">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover brightness-50"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40114-large.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-[8px] tracking-widest font-mono text-gold-500">DRIPLY CAMPAIGN 2026</p>
              <p className="text-xs font-serif font-bold tracking-widest text-white uppercase mt-1">THE GOLD METAMORPHOSIS</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
