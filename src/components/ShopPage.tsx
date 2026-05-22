import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Heart, ShoppingCart, Star, Eye, X, Check, ArrowRight } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ShopPageProps {
  products: Product[];
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onSelectProduct: (product: Product) => void;
}

export default function ShopPage({ 
  products, 
  wishlist, 
  toggleWishlist, 
  onAddToCart, 
  onSelectProduct 
}: ShopPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [maxPrice, setMaxPrice] = useState(500);
  
  // Quick Add Overlay state
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [chosenSize, setChosenSize] = useState('');
  const [chosenColor, setChosenColor] = useState('');

  // Collect unique sizing attributes and categories
  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '40', '41', '42', '43', '44'];
  const colors = ['All', 'Black', 'Gold', 'White', 'Gray', 'Sand'];

  // Filtered lists
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSize = selectedSize === 'All' || p.sizes.includes(selectedSize);
      const matchColor = selectedColor === 'All' || p.colors.some(c => c.toLowerCase().includes(selectedColor.toLowerCase()));
      const matchPrice = p.price <= maxPrice;

      return matchSearch && matchCat && matchSize && matchColor && matchPrice;
    });
  }, [products, searchTerm, selectedCategory, selectedSize, selectedColor, maxPrice]);

  const handleQuickAddClick = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    setQuickAddProduct(p);
    setChosenSize(p.sizes[0] || 'S');
    setChosenColor(p.colors[0] || 'Default');
  };

  const submitQuickAdd = () => {
    if (quickAddProduct) {
      onAddToCart(quickAddProduct, chosenSize, chosenColor);
      setQuickAddProduct(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      {/* Page Title Marquee */}
      <div className="mb-12 text-center md:text-left">
        <p className="text-[10px] tracking-[0.3em] font-mono text-gold-500 font-bold uppercase">DRIPLY STOCK COLLECTION</p>
        <h2 className="text-3xl md:text-5xl font-serif font-extrabold tracking-widest text-white mt-2 uppercase">SHOP COUTURE</h2>
        <p className="text-xs text-zinc-500 tracking-wider mt-2">Curated garments styled for modern high fashion enthusiasts.</p>
      </div>

      {/* Main Grid: Filters Sidebar + Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Filters Sidebar Module */}
        <aside id="shop-filters" className="space-y-8 lg:sticky lg:top-28 self-start">
          
          {/* Elegant Search Input */}
          <div className="relative">
            <input 
              id="search-input"
              type="text" 
              placeholder="SEARCH COLLECTION..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-xs tracking-widest text-white px-4 py-3.5 pl-10 focus:outline-none focus:border-gold-500 uppercase transition-colors"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
          </div>

          <div className="border border-zinc-900 bg-zinc-950/20 p-6 space-y-8">
            <div className="flex items-center space-x-2 text-white border-b border-zinc-900 pb-4">
              <SlidersHorizontal className="w-4 h-4 text-gold-500" />
              <span className="text-xs tracking-[0.2em] font-bold uppercase">FILTERS</span>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="text-[10px] tracking-[0.15em] text-zinc-400 font-mono uppercase">COLLECTION LINE</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    id={`filter-cat-${cat}`}
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-[9px] tracking-widest uppercase border transition-all ${
                      selectedCategory === cat 
                        ? 'border-gold-500 bg-gold-500 text-black font-semibold' 
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] tracking-[0.15em] text-zinc-400 font-mono uppercase">
                <span>MAX BUDGET</span>
                <span className="text-gold-500 font-bold font-mono">${maxPrice}</span>
              </div>
              <input 
                id="price-range"
                type="range" 
                min="50" 
                max="500" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold-500 cursor-pointer h-1 bg-zinc-900 rounded-lg appearance-none"
              />
            </div>

            {/* Sizing Filter */}
            <div className="space-y-3">
              <h4 className="text-[10px] tracking-[0.15em] text-zinc-400 font-mono uppercase font-semibold">SIZE MATRIX</h4>
              <div className="grid grid-cols-4 gap-1.5">
                {sizes.map((sz) => (
                  <button
                    id={`filter-size-${sz}`}
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-1.5 text-[9px] font-mono tracking-widest text-center border transition-all ${
                      selectedSize === sz 
                        ? 'border-gold-500 text-gold-500 font-semibold bg-gold-500/5' 
                        : 'border-zinc-900 text-zinc-500 hover:border-zinc-800'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="space-y-3">
              <h4 className="text-[10px] tracking-[0.15em] text-zinc-400 font-mono uppercase font-semibold">PALETTE WAVE</h4>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((col) => (
                  <button
                    id={`filter-color-${col}`}
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-2.5 py-1 text-[9px] tracking-widest border transition-all ${
                      selectedColor === col 
                        ? 'border-gold-500 text-gold-500 font-semibold bg-gold-500/5' 
                        : 'border-zinc-900 text-zinc-500 hover:border-zinc-800'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters Clear Button */}
            {(selectedCategory !== 'All' || selectedSize !== 'All' || selectedColor !== 'All' || searchTerm || maxPrice < 500) && (
              <button
                id="clear-filters"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSize('All');
                  setSelectedColor('All');
                  setSearchTerm('');
                  setMaxPrice(500);
                }}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-[10px] tracking-widest font-bold text-zinc-400 font-mono transition-colors border border-zinc-850"
              >
                RESET SELECTION
              </button>
            )}
          </div>
        </aside>

        {/* Catalog Grid Module */}
        <main id="catalog-grid" className="lg:col-span-3 space-y-8">
          <div className="flex justify-between items-center bg-zinc-950/20 border-b border-zinc-900 pb-4">
            <p className="text-xs font-mono tracking-widest text-zinc-500">
              DISCOVERING <span className="text-white font-bold">{filteredProducts.length}</span> HIGH CLASS ATTIRES
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div id="no-products-view" className="text-center py-20 border border-zinc-950">
              <p className="text-sm font-mono tracking-widest text-zinc-500">NO COUTURE PIECES FIT THESE CRITERIA.</p>
              <button 
                id="reset-filter-link"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSize('All');
                  setSelectedColor('All');
                  setSearchTerm('');
                  setMaxPrice(500);
                }} 
                className="text-xs tracking-widest mt-4 text-gold-500 underline"
              >
                RESTORE COMPLETE COLLECTION
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const isWishlisted = wishlist.includes(p.id);
                return (
                  <div 
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="group cursor-pointer bg-zinc-950/60 border border-zinc-950 hover:border-gold-500/15 transition-all relative flex flex-col justify-between"
                  >
                    {/* Visual Asset Container */}
                    <div className="relative h-80 overflow-hidden bg-zinc-900/40">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Interactive Float Controls */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                        <button
                          id={`view-detail-${p.id}`}
                          onClick={(e) => { e.stopPropagation(); onSelectProduct(p); }}
                          className="w-10 h-10 bg-black/80 hover:bg-gold-500 hover:text-black rounded-full flex items-center justify-center text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          id={`quick-add-${p.id}`}
                          onClick={(e) => handleQuickAddClick(e, p)}
                          className="w-10 h-10 bg-black/80 hover:bg-white hover:text-black rounded-full flex items-center justify-center text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 delay-75"
                          title="Quick Add"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                        {p.isTrending && (
                          <span className="px-2 py-0.5 bg-gold-400 text-black text-[7px] tracking-widest font-mono font-bold">TRENDING</span>
                        )}
                        {p.isFlashSale && (
                          <span className="px-2 py-0.5 bg-red-600 text-white text-[7px] tracking-widest font-mono font-bold">SALE</span>
                        )}
                        {p.stock <= 8 && (
                          <span className="px-2 py-0.5 bg-white text-black text-[7px] tracking-widest font-mono font-bold">FEW PIECES LEFT</span>
                        )}
                      </div>

                      {/* Wishlist Toggle Button */}
                      <button
                        id={`wishlist-toggle-${p.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p.id);
                        }}
                        className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isWishlisted 
                            ? 'bg-gold-500 text-black' 
                            : 'bg-black/60 text-white border border-white/10 hover:border-gold-500'
                        }`}
                        title={isWishlisted ? "Remove from Dresser" : "Save to Dresser"}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-black' : ''}`} />
                      </button>
                    </div>

                    {/* Descriptive Details */}
                    <div className="p-4 border-t border-zinc-900 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[8px] tracking-[0.2em] text-zinc-500 font-mono uppercase">{p.brand}</p>
                        <h3 className="text-xs tracking-wider font-semibold text-white mt-1 group-hover:text-gold-400 transition-colors truncate">{p.name}</h3>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">${p.price}</span>
                          {p.originalPrice && (
                            <span className="text-[10px] text-zinc-550 line-through">${p.originalPrice}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-gold-500 fill-gold-500" />
                          <span className="text-[10px] text-zinc-350 font-bold">{p.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Quick Add Bottom Dialog Overlay */}
      {quickAddProduct && (
        <div id="quick-add-modal" className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel-heavy p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[8px] tracking-widest text-zinc-500 font-mono">{quickAddProduct.brand}</p>
                <h4 className="text-sm font-serif font-bold text-white uppercase mt-0.5">{quickAddProduct.name}</h4>
                <p className="text-xs text-gold-500 font-bold font-mono mt-1">${quickAddProduct.price}</p>
              </div>
              <button 
                id="close-quick-add"
                onClick={() => setQuickAddProduct(null)} 
                className="p-1 hover:text-gold-500 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Select Size Option */}
            <div className="mt-6 space-y-2">
              <label className="text-[9px] tracking-widest text-zinc-400 font-mono font-bold uppercase">SELECT SIZE MATRIX</label>
              <div className="flex flex-wrap gap-2">
                {quickAddProduct.sizes.map((s) => (
                  <button
                    id={`quick-size-${s}`}
                    key={s}
                    onClick={() => setChosenSize(s)}
                    className={`px-3 py-2 text-xs font-mono border transition-colors ${
                      chosenSize === s 
                        ? 'border-gold-500 text-gold-500 font-semibold bg-gold-500/5' 
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Color Option */}
            <div className="mt-6 space-y-2">
              <label className="text-[9px] tracking-widest text-zinc-400 font-mono font-bold uppercase">SELECT DESIRED COLOR</label>
              <div className="flex flex-wrap gap-2">
                {quickAddProduct.colors.map((c) => (
                  <button
                    id={`quick-color-${c}`}
                    key={c}
                    onClick={() => setChosenColor(c)}
                    className={`px-3 py-2 text-xs border transition-colors ${
                      chosenColor === c 
                        ? 'border-gold-500 text-gold-500 font-semibold bg-gold-500/5' 
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Submission */}
            <button
              id="confirm-quick-add"
              onClick={submitQuickAdd}
              className="w-full mt-8 py-3.5 bg-gold-500 hover:bg-white text-black hover:text-black text-[10px] tracking-[0.25em] font-bold font-mono transition-all flex items-center justify-center space-x-2"
            >
              <span>ADD TO SHOPPING BAG</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
