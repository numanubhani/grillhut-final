
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, ChevronLeft, CreditCard, Phone, User, CheckCircle2, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, removeFromCart, placeOrder, deliveryType, deliveryLocation } = useApp();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState(deliveryType === 'delivery' ? deliveryLocation : '');
  const [isOrdered, setIsOrdered] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const address = deliveryType === 'delivery' ? customerAddress : undefined;
    placeOrder(customerName, customerPhone, address);
    setIsOrdered(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (isOrdered) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-serif font-black mb-2">Order Placed Successfully!</h2>
        <p className="text-slate-500 dark:text-zinc-400">Redirecting you to the home page...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-500 transition-colors mb-8 group">
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h2 className="text-3xl font-serif font-black mb-8">Your Order</h2>
          {cart.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-zinc-800">
              <p className="text-slate-400 mb-6">Your cart is feeling a bit light.</p>
              <Link to="/" className="px-8 py-3 bg-primary-500 text-white rounded-xl font-bold">Start Browsing</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.productId} className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
                  <div className="flex-1">
                    <h4 className="font-bold">{item.name.split(' (')[0]}</h4>
                    {item.addOns && item.addOns.length > 0 && (
                      <p className="text-xs text-zinc-500 mt-1">
                        Add-ons: {item.addOns.map(a => a.name).join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-slate-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-500">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-xl shadow-black/5">
            <h3 className="text-2xl font-serif font-bold mb-8">Checkout Details</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="tel"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +1 234 567 890"
                    className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
              {deliveryType === 'delivery' && (
                <div>
                  <label className="block text-sm font-semibold mb-2 ml-1">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      value={customerAddress}
                      onChange={e => setCustomerAddress(e.target.value)}
                      placeholder="Enter your delivery address"
                      className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary-500">Rs. {total.toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 dark:disabled:bg-zinc-800 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-500/20 active:scale-95"
                >
                  <CreditCard className="w-5 h-5" />
                  Confirm & Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
