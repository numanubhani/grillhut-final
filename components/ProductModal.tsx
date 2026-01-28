import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, AddOn } from '../types';
import { ADD_ON_CATEGORIES } from '../constants';
import { X, ShoppingCart, Heart, Plus, Minus, Star } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedAddOns([]);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const finalPrice = product.originalPrice ? product.price : product.price;
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
  const totalPrice = (finalPrice * quantity) + (addOnsTotal * quantity);

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(a => a.id === addOn.id);
      if (exists) {
        return prev.filter(a => a.id !== addOn.id);
      }
      return [...prev, addOn];
    });
  };

  const handleAddToCart = () => {
    const itemName = selectedAddOns.length > 0 
      ? `${product.name} (${selectedAddOns.map(a => a.name).join(', ')})`
      : product.name;
    
    addToCart({
      productId: product.id,
      name: itemName,
      price: totalPrice / quantity, // Price per unit including add-ons
      quantity,
      addOns: selectedAddOns.length > 0 ? selectedAddOns : undefined
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl max-h-[95vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Floating */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-zinc-800 hover:scale-110 transition-all shadow-lg"
        >
          <X className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        </button>

        {/* Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Side - Image, Title, Description - Sticky */}
          <div className="lg:w-1/2 p-4 md:p-6 flex flex-col lg:sticky lg:top-0 lg:h-[95vh] lg:overflow-y-auto scrollbar-hide">
            {/* Product Image */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-orange-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 shadow-xl">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/600x600?text=Product+Image';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-700">
                  <span className="text-zinc-400 text-sm">No Image Available</span>
                </div>
              )}
              
              {/* Discount Badge */}
              {(product.discount || discount > 0) && (
                <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1.5 rounded-xl font-black text-xs shadow-xl z-10">
                  {product.discount || discount}% OFF
                  {product.discountText && (
                    <div className="text-[9px] font-normal mt-0.5">{product.discountText}</div>
                  )}
                </div>
              )}
              
              {/* Like Button */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-3 right-3 w-10 h-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg z-10"
              >
                <Heart className={`w-5 h-5 transition-all ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-zinc-400'}`} />
              </button>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl md:text-3xl font-serif font-black mb-2 text-zinc-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating and Category */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                <span className="font-bold text-base">4.9</span>
              </div>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-600 dark:text-zinc-400 font-medium text-sm">{product.category}</span>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
              {product.description}
            </p>

            {/* Price Section */}
            <div className="mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              {product.originalPrice ? (
                <div className="flex items-baseline gap-3">
                  <div>
                    <span className="text-2xl md:text-3xl font-black text-orange-600">Rs. {finalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base text-zinc-400 line-through">Rs. {product.originalPrice.toFixed(2)}</span>
                    <span className="text-xs text-red-600 font-bold">Save Rs. {(product.originalPrice - finalPrice).toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-2xl md:text-3xl font-black text-orange-600">Rs. {finalPrice.toFixed(2)}</div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
              <span className="font-bold text-base">Quantity</span>
              <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-lg p-1.5 border border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Add-ons - Scrollable */}
          <div className="lg:w-1/2 p-6 md:p-8 bg-zinc-50 dark:bg-zinc-800/30 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 overflow-y-auto scrollbar-hide lg:h-[95vh]">
            <h3 className="text-2xl font-serif font-black mb-6 text-zinc-900 dark:text-white">Add-ons</h3>
            
            <div className="space-y-6">
              {ADD_ON_CATEGORIES.map(category => (
                <div key={category.id}>
                  <h4 className="text-lg font-bold mb-4 text-zinc-700 dark:text-zinc-300">{category.name}</h4>
                  <div className="space-y-3">
                    {category.addOns.map(addOn => {
                      const isSelected = selectedAddOns.some(a => a.id === addOn.id);
                      return (
                        <button
                          key={addOn.id}
                          onClick={() => toggleAddOn(addOn)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-white dark:hover:bg-zinc-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'border-orange-600 bg-orange-600 scale-110' : 'border-zinc-300 dark:border-zinc-600'
                            }`}>
                              {isSelected && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <span className="font-medium">{addOn.name}</span>
                          </div>
                          <span className="font-bold text-orange-600">+Rs. {addOn.price.toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer - Total and Add to Cart */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-orange-50/50 to-zinc-50/50 dark:from-zinc-800/50 dark:to-zinc-900/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 block mb-1">Total</span>
              <div className="text-3xl font-black text-orange-600">Rs. {totalPrice.toFixed(2)}</div>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-2xl font-black transition-all shadow-xl shadow-orange-600/30 hover:shadow-2xl hover:shadow-orange-600/40 active:scale-95 transform"
            >
              <ShoppingCart className="w-5 h-5" />
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

