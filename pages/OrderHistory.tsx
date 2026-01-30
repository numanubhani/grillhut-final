import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Package, Clock, CheckCircle2, XCircle, MapPin, Phone, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

const OrderHistory: React.FC = () => {
  const { getCustomerOrders, currentCustomer } = useApp();
  const orders = getCustomerOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentCustomer) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-black mb-4">Please Login</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">You need to be logged in to view your order history</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="px-6 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl font-bold transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-600 transition-colors mb-8 group">
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Menu
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-black mb-2">Order History</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Welcome back, {currentCustomer.name}!
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
            <Package className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Orders Yet</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">Start ordering to see your order history here</p>
            <Link to="/" className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">Order #{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.timestamp)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4" />
                        {order.customerPhone}
                      </div>
                      {order.customerAddress && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-orange-600">Rs. {order.total.toFixed(2)}</p>
                    <p className="text-xs text-zinc-500">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start py-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.name.split(' (')[0]}</p>
                          {item.addOns && item.addOns.length > 0 && (
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                              + {item.addOns.map(a => a.name).join(', ')}
                            </p>
                          )}
                          <p className="text-xs text-zinc-500 mt-1">Qty: {item.quantity} × Rs. {item.price.toFixed(2)}</p>
                        </div>
                        <p className="font-bold text-orange-600">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                {order.customerAddress && order.deliveryType === 'delivery' && (
                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Delivery Address:</p>
                    <p className="text-sm font-medium">{order.customerAddress}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;


