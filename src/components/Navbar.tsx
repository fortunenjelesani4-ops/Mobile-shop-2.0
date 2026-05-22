import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Sparkles, 
  LayoutDashboard, 
  Search, 
  Bell, 
  X,
  Menu,
  Home as HomeIcon,
  Compass
} from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  cart: CartItem[];
  wishlistCount: number;
}

export default function Navbar({ currentView, setView, cart, wishlistCount }: NavbarProps) {
  const [promoClosed, setPromoClosed] = useState(false);
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { label: 'HOME', view: 'home', icon: HomeIcon },
    { label: 'DISCOVER SHOP', view: 'shop', icon: Compass },
    { label: 'AI STYLIST', view: 'stylist', icon: Sparkles },
    { label: 'MY DRESSER', view: 'dashboard', icon: User },
    { label: 'ADMIN HQ', view: 'admin', icon: LayoutDashboard },
  ];

  return (
    <div className="z-50 w-full">
      {/* Dynamic Promotion Banner */}
      {!promoClosed && (
        <div id="promo-banner" className="relative flex items-center justify-between px-4 py-2 text-xs font-medium tracking-widest text-black bg-gradient-to-r from-amber-400 via-gold-500 to-yellow-300">
          <div className="flex-1 text-center font-serif text-[10px] md:text-xs">
            ✨ UNLEASH THE EXTRAVAGANCE: ENJOY 40% OFF FLASH SECTIONS — USE CODE <span className="font-bold underline">DRIP40</span>
          </div>
          <button 
            id="close-promo"
            onClick={() => setPromoClosed(true)} 
            className="p-1 hover:opacity-70 transition-opacity"
            aria-label="Close promo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Glassmorphic Header */}
      <header id="main-header" className="sticky top-0 z-40 w-full px-4 py-4 border-b border-gold-500/10 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div 
            id="brand-logo"
            onClick={() => setView('home')} 
            className="cursor-pointer select-none"
          >
            <h1 className="text-2xl font-serif tracking-[0.25em] font-extrabold text-white hover:text-gold-500 transition-colors">
              DRIP<span className="text-gold-500">LY</span>
            </h1>
            <p className="text-[7px] tracking-[0.34em] text-white/50 -mt-0.5 font-mono">PARISIAN COUTURE</p>
          </div>

          {/* Desktop Luxury Navigation Tabs */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  id={`nav-tab-${item.view}`}
                  key={item.view}
                  onClick={() => setView(item.view)}
                  className={`text-xs tracking-[0.2em] font-medium transition-all duration-300 relative py-1 ${
                    isActive ? 'text-gold-500 font-semibold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Top Right Quick Action Badges */}
          <div id="quick-actions" className="flex items-center space-x-5">
            {/* Wishlist Button */}
            <button 
              id="action-wishlist"
              onClick={() => setView('dashboard')} 
              className="relative p-1.5 text-zinc-400 hover:text-gold-500 transition-colors"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center min-w-4 h-4 px-1 text-[9px] font-bold text-black bg-gold-500 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button 
              id="action-cart"
              onClick={() => setView('cart')} 
              className="relative p-1.5 text-zinc-400 hover:text-gold-500 transition-colors"
              title="My Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center min-w-4 h-4 px-1 text-[9px] font-bold text-black bg-white rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Quick Drawer */}
            <button 
              id="action-user"
              onClick={() => setView('dashboard')} 
              className="p-1.5 text-zinc-400 hover:text-white transition-colors"
              title="User Portal"
            >
              <User className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Sticky Bottom Navigation (TikTok Shop Inspired) */}
      <nav id="mobile-bottom-nav" className="md:hidden fixed bottom-0 left-0 z-50 w-full bg-black/95 backdrop-blur-lg border-t border-zinc-800/80 py-1.5 px-4 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              id={`m-nav-${item.view}`}
              key={item.view}
              onClick={() => setView(item.view)}
              className="flex flex-col items-center justify-center p-1 relative"
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-gold-500' : 'text-zinc-400'}`} />
              <span className={`text-[8px] tracking-wider mt-1 ${isActive ? 'text-gold-500 font-medium' : 'text-zinc-500'}`}>
                {item.label.split(' ')[0]}
              </span>
              {item.view === 'cart' && cartItemsCount > 0 && (
                <span className="absolute -top-1 right-2 min-w-4 h-4 px-1 flex items-center justify-center text-[9px] font-bold text-black bg-gold-500 rounded-full scale-90">
                  {cartItemsCount}
                </span>
              )}
              {item.view === 'stylist' && (
                <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
