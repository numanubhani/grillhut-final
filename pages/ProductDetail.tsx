import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingCart, ChevronLeft, Heart, Star, Plus, Minus } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart } = useApp();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-serif font-black mb-4">Product Not Found</h2>
        <Link to="/" className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold">
          Back to Menu
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity
    });
    navigate('/cart');
  };

  const finalPrice = product.originalPrice ? product.price : product.price;
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-600 transition-colors mb-8 group">
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative">
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount && (
              <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-xl font-black text-sm">
                {product.discount}% OFF
              </div>
            )}
            {product.discountText && (
              <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-xl font-black text-xs">
                {product.discountText}
              </div>
            )}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/90 dark:bg-zinc-900/90 backdrop-blur rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-5xl font-serif font-black mb-4">{product.name}</h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
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
          </div>

          {/* Price */}
          <div className="mb-8">
            {product.originalPrice ? (
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-4xl font-black text-orange-600">Rs. {finalPrice.toFixed(2)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl text-zinc-400 line-through">Rs. {product.originalPrice.toFixed(2)}</span>
                  <span className="text-sm text-red-600 font-bold">Save Rs. {(product.originalPrice - finalPrice).toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="text-4xl font-black text-orange-600">Rs. {finalPrice.toFixed(2)}</div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-8">
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

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-3 py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-orange-600/20 active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

