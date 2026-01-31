import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, Phone, User, CheckCircle2, MapPin, ChevronLeft, Mail, MessageSquare, Plus, Minus, ShoppingCart, Trash2, ArrowLeft, Wallet, Smartphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { cart, products, updateCartQuantity, removeFromCart, placeOrder, deliveryType, deliveryLocation, setIsCartOpen } = useApp();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState(deliveryType === 'delivery' ? deliveryLocation : '');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'jazzcash' | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [isOrdered, setIsOrdered] = useState(false);
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = deliveryType === 'delivery' ? 150 : 0;
  const promoDiscount = appliedPromo ? appliedPromo.discount : 0;
  const grandTotal = subtotal + deliveryCharge - promoDiscount;

  // Get product details for images and descriptions
  const getProductDetails = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const handleApplyPromo = () => {
    // Mock promo code validation
    if (promoCode.toUpperCase() === 'SAVE200') {
      setAppliedPromo({ code: promoCode.toUpperCase(), discount: 200 });
      setPromoCode('');
    } else if (promoCode.toUpperCase() === 'WELCOME10') {
      setAppliedPromo({ code: promoCode.toUpperCase(), discount: subtotal * 0.1 });
      setPromoCode('');
    } else {
      alert('Invalid promo code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    const address = deliveryType === 'delivery' ? customerAddress : undefined;
    try {
      setIsOrdered(true);
      const orderId = await placeOrder(
        customerName, 
        `${countryCode} ${customerPhone}`, 
        address,
        paymentMethod,
        specialInstructions
      );
      setTimeout(() => {
        navigate(`/track-order/${orderId}`);
      }, 2000);
    } catch (error) {
      setIsOrdered(false);
      // Error toast is shown in placeOrder function
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-serif font-black mb-2">Order Placed Successfully!</h2>
        <p className="text-slate-500 dark:text-zinc-400">Redirecting you to order tracking...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-serif font-black mb-4">Your cart is empty</h2>
        <Link to="/" className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-colors">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-600 transition-colors mb-6 group">
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Menu
        </Link>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Section */}
            <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
              <h2 className="text-2xl font-serif font-black mb-6">Personal Information</h2>
              
              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      required
                      type="text"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Mobile Number with Country Code */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="relative w-32">
                      <select
                        value={countryCode}
                        onChange={e => setCountryCode(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3.5 pl-4 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none appearance-none cursor-pointer"
                      >
                        <option value="+92">+92 (PK)</option>
                        <option value="+1">+1 (US)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+971">+971 (UAE)</option>
                        <option value="+966">+966 (KSA)</option>
                      </select>
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>
                    <div className="relative flex-1">
                      <input
                        required
                        type="tel"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        placeholder="Enter your mobile number"
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3.5 pl-4 pr-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address (Optional) */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email Address <span className="text-zinc-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Address Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(!showAddressModal)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    {customerAddress ? 'Change Address' : 'Add Address'}
                  </button>
                  
                  {showAddressModal && (
                    <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                      <label className="block text-sm font-semibold mb-2">Delivery Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                        <textarea
                          value={customerAddress}
                          onChange={e => setCustomerAddress(e.target.value)}
                          placeholder="Enter your complete delivery address"
                          rows={3}
                          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  )}
                  
                  {customerAddress && !showAddressModal && (
                    <div className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{customerAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Special Instructions Section */}
            <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
              <label className="block text-sm font-semibold mb-2">
                Special Instructions <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-zinc-400" />
                <textarea
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  placeholder="Add any comment, e.g., about allergies, or delivery instructions here."
                  rows={4}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
              <h2 className="text-2xl font-serif font-black mb-6">Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cash On Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-700'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <Wallet className={`w-8 h-8 ${paymentMethod === 'cash' ? 'text-orange-600' : 'text-zinc-400'}`} />
                    <span className={`font-bold ${paymentMethod === 'cash' ? 'text-orange-600' : 'text-zinc-700 dark:text-zinc-300'}`}>
                      Cash On Delivery
                    </span>
                  </div>
                </button>

                {/* Card on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-700'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <CreditCard className={`w-8 h-8 ${paymentMethod === 'card' ? 'text-orange-600' : 'text-zinc-400'}`} />
                    <span className={`font-bold ${paymentMethod === 'card' ? 'text-orange-600' : 'text-zinc-700 dark:text-zinc-300'}`}>
                      Card on Delivery
                    </span>
                  </div>
                </button>

                {/* JazzCash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('jazzcash')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'jazzcash'
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-700'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <Smartphone className={`w-8 h-8 ${paymentMethod === 'jazzcash' ? 'text-orange-600' : 'text-zinc-400'}`} />
                    <span className={`font-bold ${paymentMethod === 'jazzcash' ? 'text-orange-600' : 'text-zinc-700 dark:text-zinc-300'}`}>
                      JazzCash
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg sticky top-24">
              {/* Add More Items Button */}
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl font-semibold text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add more items
                </button>
              </div>

              {/* Cart Items */}
              <div className="p-4 max-h-[400px] overflow-y-auto scrollbar-hide">
                <h3 className="text-lg font-serif font-black mb-4">Your Order</h3>
                <div className="space-y-4">
                  {cart.map(item => {
                    const product = getProductDetails(item.productId);
                    const productName = item.name.split(' (')[0];
                    
                    return (
                      <div key={item.productId} className="flex gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                        {/* Product Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                          {product?.image ? (
                            <img 
                              src={product.image} 
                              alt={productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="w-6 h-6 text-zinc-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm mb-1 line-clamp-1">{productName}</h4>
                          {product?.description && (
                            <p className="text-xs text-zinc-500 mb-2 line-clamp-1">{product.description}</p>
                          )}
                          {item.addOns && item.addOns.length > 0 && (
                            <p className="text-xs text-orange-600 dark:text-orange-400 mb-2">
                              + {item.addOns.map(a => a.name).join(', ')}
                            </p>
                          )}
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg px-2 py-1">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="font-bold text-orange-600 text-sm">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Promotions Section */}
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="mb-3">
                  <p className="text-xs text-zinc-500 mb-2">
                    Promo Code <span className="text-orange-600">(Login required)</span>
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-sm transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      ✓ Promo code "{appliedPromo.code}" applied!
                    </p>
                  )}
                </div>
              </div>

              {/* Grand Total Section */}
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Subtotal</span>
                    <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Delivery Charges</span>
                    <span className="font-semibold">Rs. {deliveryCharge.toFixed(2)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Discount ({appliedPromo.code})</span>
                      <span className="font-semibold">-Rs. {appliedPromo.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                    <span className="text-lg font-bold">Grand Total</span>
                    <span className="text-2xl font-black text-orange-600">Rs. {grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {appliedPromo && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-400 font-semibold">
                      Great! You saved Rs. {appliedPromo.discount.toFixed(2)}.
                    </p>
                  </div>
                )}

                {/* Place Order Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl font-black transition-all shadow-xl shadow-orange-600/30 hover:shadow-2xl hover:shadow-orange-600/40 active:scale-95 text-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
