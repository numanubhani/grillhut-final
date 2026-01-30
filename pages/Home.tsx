
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Star, ChevronRight, Flame, UtensilsCrossed, Pizza, Sandwich, Cherry, ArrowDown, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductModal from '../components/ProductModal';
import CartSidebar from '../components/CartSidebar';
import { Product } from '../types';

const Home: React.FC = () => {
  const { products, categories, addToCart, isCartOpen, setIsCartOpen } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryIcons: Record<string, any> = {
    'Burgers': Flame,
    'Pizza': Pizza,
    'Sandwiches': Sandwich,
    'Nuggets': UtensilsCrossed,
    'All': Cherry
  };

  const filteredProducts = useMemo(() => {
    let list = products.filter(p => !p.isHidden);
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory);
    }
    return list;
  }, [products, activeCategory]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover opacity-40 dark:opacity-20 transition-all duration-1000 group-hover:scale-105"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#fafafa] via-[#fafafa]/80 to-transparent dark:from-[#09090b] dark:via-[#09090b]/80" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest mb-8">
              <Flame className="w-3.5 h-3.5 fill-current" />
              The Best in Town
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-extrabold mb-8 leading-[1] tracking-tight text-zinc-950 dark:text-white">
              FUEL YOUR <br/>
              <span className="text-orange-600 inline-block">FIRE</span> INSIDE.
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-lg leading-relaxed font-medium">
              GRILL HUT brings you the authentic taste of open-flame cooking. No shortcuts, just pure smoke and flavor.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => document.getElementById('menu-anchor')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-8 py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black transition-all shadow-2xl shadow-orange-600/30 active:scale-95 flex items-center gap-2"
              >
                Order Now
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="px-8 py-5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-black border border-zinc-200 dark:border-zinc-700 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-700 active:scale-95">
                Our Story
              </button>
            </div>
          </div>
          
          <div className="hidden lg:block relative animate-float">
             <div className="relative z-10 w-full aspect-square rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800 transform rotate-3 scale-90">
                <img 
                  src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80" 
                  className="w-full h-full object-cover" 
                  alt="Delicious Burger" 
                />
             </div>
             <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-500/20 blur-[100px] -z-10 rounded-full" />
             <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-yellow-500/20 blur-[100px] -z-10 rounded-full" />
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
          <span className="text-[10px] font-black uppercase tracking-widest">Scroll Down</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </section>

      <div id="menu-anchor" className="h-10" />

      {/* Main Content with Fancy Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Fancy Sticky Sidebar */}
          <aside className="lg:sticky lg:top-32 w-full lg:w-72 shrink-0 z-40">
            <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl shadow-zinc-200/20 dark:shadow-none backdrop-blur-xl">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-8 px-2">Menu Categories</h3>
              <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible scrollbar-hide pb-4 lg:pb-0">
                <button
                  onClick={() => setActiveCategory('All')}
                  className={`flex items-center gap-4 px-5 py-4 rounded-[1.5rem] text-sm font-bold transition-all whitespace-nowrap ${
                    activeCategory === 'All' 
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xl scale-105' 
                    : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeCategory === 'All' ? 'bg-zinc-800 dark:bg-zinc-100' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                    <Cherry className="w-4 h-4" />
                  </div>
                  All Dishes
                </button>
                {categories.map(cat => {
                  const Icon = categoryIcons[cat.name] || Flame;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-[1.5rem] text-sm font-bold transition-all whitespace-nowrap ${
                        activeCategory === cat.name 
                        ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/30 scale-105' 
                        : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeCategory === cat.name ? 'bg-orange-500' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {cat.name}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <div className="hidden lg:block mt-8 p-8 bg-zinc-900 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-serif text-2xl font-black mb-2">Join the Club</h4>
                <p className="text-sm text-zinc-400 mb-6 font-medium">Get 20% off your first order at GRILL HUT.</p>
                <button className="w-full py-4 bg-white text-zinc-900 rounded-2xl font-bold text-sm transition-transform active:scale-95 group-hover:scale-105">Sign Me Up</button>
              </div>
              <Flame className="absolute -bottom-10 -right-10 w-40 h-40 text-orange-600/20 group-hover:rotate-12 transition-transform" />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 w-full">
            <div className="mb-10">
              <h2 className="text-4xl md:text-5xl font-serif font-black mb-4 flex items-center gap-4">
                {activeCategory === 'All' ? 'The Whole Kitchen' : activeCategory}
              </h2>
              <p className="text-zinc-500 font-medium">Selected premium ingredients, masterfully grilled.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map(product => {
                const finalPrice = product.originalPrice ? product.price : product.price;
                const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
                const isLiked = likedProducts.has(product.id);
                
                return (
                  <div 
                    key={product.id}
                    className="group bg-white dark:bg-zinc-900 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 hover:border-orange-500/50 dark:hover:border-orange-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1"
                  >
                    <div 
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsModalOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {(product.discount || discount > 0) && (
                          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg font-black text-[10px] sm:text-xs shadow-lg">
                            <div>{product.discount || discount}% OFF</div>
                            {product.discountText && (
                              <div className="text-[8px] sm:text-[9px] font-normal mt-0.5 leading-tight">{product.discountText}</div>
                            )}
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLikedProducts(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(product.id)) {
                                newSet.delete(product.id);
                              } else {
                                newSet.add(product.id);
                              }
                              return newSet;
                            });
                          }}
                          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-10"
                        >
                          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
                        </button>
                        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg flex items-center gap-0.5 sm:gap-1 shadow-lg">
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-orange-500 text-orange-500" />
                          <span className="text-[10px] sm:text-xs font-black">4.9</span>
                        </div>
                      </div>
                      
                      <div className="p-3 sm:p-5">
                        <h3 className="text-sm sm:text-lg font-black font-serif leading-tight mb-1.5 sm:mb-2 text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3 sm:mb-4 font-medium leading-relaxed min-h-[2rem] sm:min-h-[2.5rem]">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                            <span className="text-base sm:text-xl font-black text-orange-600">Rs. {finalPrice.toFixed(2)}</span>
                            {product.originalPrice && (
                              <span className="text-[10px] sm:text-xs text-zinc-400 line-through">Rs. {product.originalPrice.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-md shadow-red-600/30"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Add To Cart</span>
                          <span className="sm:hidden">Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-20 text-center bg-zinc-100 dark:bg-zinc-800/30 rounded-[3rem] border border-dashed border-zinc-300 dark:border-zinc-700">
                <UtensilsCrossed className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">No dishes found</h4>
                <p className="text-zinc-500">We're working on adding more items to this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-zinc-900 py-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
          {[
            { label: 'Fresh Daily', value: '100%', desc: 'Farm to table' },
            { label: 'Fast Delivery', value: '25 Min', desc: 'Average time' },
            { label: 'Flame Grilled', value: 'Wood', desc: 'Authentic fire' },
            { label: 'Happy Guests', value: '15k+', desc: 'Real reviews' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-serif font-black text-white mb-2">{stat.value}</div>
              <div className="text-orange-500 font-black text-xs uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-zinc-500 text-sm font-medium">{stat.desc}</div>
            </div>
          ))}
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-600/5 blur-[120px] rounded-full translate-x-1/2" />
      </section>

      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Home;
