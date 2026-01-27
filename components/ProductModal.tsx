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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-6xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-serif font-black">Customize Your Order</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
          {/* Left Side - Product Info */}
          <div className="lg:w-1/2 p-8 flex flex-col">
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-zinc-100 dark:bg-zinc-900">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {(product.discount || discount > 0) && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-xl font-black text-sm">
                  {product.discount || discount}% OFF
                  {product.discountText && (
                    <div className="text-[10px] font-normal mt-0.5">{product.discountText}</div>
                  )}
                </div>
              )}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 w-12 h-12 bg-white/90 dark:bg-zinc-900/90 backdrop-blur rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
              </button>
            </div>

            <h1 className="text-4xl font-serif font-black mb-3">{product.name}</h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                <span className="font-bold">4.9</span>
              </div>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-500">{product.category}</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              {product.originalPrice ? (
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-3xl font-black text-orange-600">Rs. {finalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg text-zinc-400 line-through">Rs. {product.originalPrice.toFixed(2)}</span>
                    <span className="text-sm text-red-600 font-bold">Save Rs. {(product.originalPrice - finalPrice).toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-3xl font-black text-orange-600">Rs. {finalPrice.toFixed(2)}</div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-bold">Quantity:</span>
              <div className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Add-ons */}
          <div className="lg:w-1/2 p-8 bg-zinc-50 dark:bg-zinc-800/50 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800">
            <h3 className="text-2xl font-serif font-black mb-6">Add-ons</h3>
            
            <div className="space-y-8">
              {ADD_ON_CATEGORIES.map(category => (
                <div key={category.id}>
                  <h4 className="text-lg font-bold mb-4">{category.name}</h4>
                  <div className="space-y-3">
                    {category.addOns.map(addOn => {
                      const isSelected = selectedAddOns.some(a => a.id === addOn.id);
                      return (
                        <button
                          key={addOn.id}
                          onClick={() => toggleAddOn(addOn)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? 'border-orange-600 bg-orange-600' : 'border-zinc-300 dark:border-zinc-600'
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
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Total</span>
              <div className="text-2xl font-black text-orange-600">Rs. {totalPrice.toFixed(2)}</div>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-orange-600/20 active:scale-95"
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

