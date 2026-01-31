import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  Package, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Truck, 
  MapPin, 
  XCircle,
  Phone,
  Calendar,
  ShoppingBag,
  UtensilsCrossed
} from 'lucide-react';
import { OrderTrackingStatus } from '../types';

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, currentCustomer } = useApp();
  const navigate = useNavigate();
  const [order, setOrder] = useState(orders.find(o => o.id === orderId));

  // Simulate real-time status updates (in production, this would come from backend/websocket)
  useEffect(() => {
    if (!order) return;
    
    // Auto-progress order status for demo purposes
    const statusProgression: OrderTrackingStatus[] = [
      'pending',
      'confirmed',
      'preparing',
      order.deliveryType === 'delivery' ? 'out_for_delivery' : 'ready',
      order.deliveryType === 'delivery' ? 'completed' : 'ready_for_pickup',
      'completed'
    ];

    const currentIndex = statusProgression.indexOf(order.status);
    if (currentIndex < statusProgression.length - 1 && order.status !== 'completed' && order.status !== 'cancelled') {
      const timer = setTimeout(() => {
        // In production, this would be updated via API/websocket
        // For now, we'll just show the current status
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [order]);

  useEffect(() => {
    // Update order if it changes in context (real-time updates from admin)
    const updatedOrder = orders.find(o => o.id === orderId);
    if (updatedOrder) {
      // Check if status changed
      const previousStatus = order?.status;
      const newStatus = updatedOrder.status;
      
      if (previousStatus && previousStatus !== newStatus) {
        // Status was updated by admin - order will update automatically
        setOrder(updatedOrder);
      } else {
        setOrder(updatedOrder);
      }
    }
  }, [orders, orderId, order?.status]);

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-black mb-2">Order Not Found</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">The order you're looking for doesn't exist.</p>
          <Link to="/orders" className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors">
            View Order History
          </Link>
        </div>
      </div>
    );
  }

  // Check if user has access to this order
  if (currentCustomer && order.customerId && order.customerId !== currentCustomer.id) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-black mb-2">Access Denied</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">You don't have permission to view this order.</p>
          <Link to="/orders" className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors">
            View Your Orders
          </Link>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: OrderTrackingStatus) => {
    const configs: Record<OrderTrackingStatus, { label: string; icon: React.ReactNode; color: string; bgColor: string; description: string }> = {
      pending: {
        label: 'Order Received',
        icon: <Package className="w-5 h-5 sm:w-6 sm:h-6" />,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-100 dark:bg-orange-900/20',
        description: 'We\'ve received your order and are confirming it.'
      },
      confirmed: {
        label: 'Order Confirmed',
        icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        description: 'Your order has been confirmed and we\'re starting to prepare it.'
      },
      preparing: {
        label: 'Preparing Your Order',
        icon: <ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20',
        description: 'Our chefs are preparing your delicious meal.'
      },
      ready: {
        label: 'Ready',
        icon: <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        description: 'Your order is ready!'
      },
      out_for_delivery: {
        label: 'Out for Delivery',
        icon: <Truck className="w-5 h-5 sm:w-6 sm:h-6" />,
        color: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
        description: 'Your order is on the way to you.'
      },
      ready_for_pickup: {
        label: 'Ready for Pickup',
        icon: <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        description: 'Your order is ready for pickup at the restaurant.'
      },
      completed: {
        label: 'Order Completed',
        icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        description: 'Your order has been delivered/picked up. Enjoy your meal!'
      },
      cancelled: {
        label: 'Order Cancelled',
        icon: <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        description: 'This order has been cancelled.'
      }
    };
    return configs[status];
  };

  const getStatusSteps = (): OrderTrackingStatus[] => {
    // Only show steps relevant to the delivery type
    if (order.deliveryType === 'delivery') {
      // For delivery: show delivery-specific steps only
      return ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed'];
    } else {
      // For pickup: show pickup-specific steps only
      return ['pending', 'confirmed', 'preparing', 'ready', 'ready_for_pickup', 'completed'];
    }
  };

  const statusSteps = getStatusSteps();
  // Find current status index, handling cases where status might not be in the filtered steps
  let currentStatusIndex = statusSteps.indexOf(order.status);
  
  // If current status is not in the filtered steps (edge case), find the closest match
  if (currentStatusIndex === -1) {
    // Map status to appropriate step based on delivery type
    if (order.deliveryType === 'delivery') {
      // If pickup status found on delivery order, map to closest delivery step
      if (order.status === 'ready' || order.status === 'ready_for_pickup') {
        currentStatusIndex = statusSteps.indexOf('preparing'); // Map to preparing
      }
    } else {
      // If delivery status found on pickup order, map to closest pickup step
      if (order.status === 'out_for_delivery') {
        currentStatusIndex = statusSteps.indexOf('preparing'); // Map to preparing
      }
    }
    // Default to first step if still not found
    if (currentStatusIndex === -1) {
      currentStatusIndex = 0;
    }
  }
  
  const isCancelled = order.status === 'cancelled';

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentStatusConfig = getStatusConfig(order.status);

  // Get latest status update timestamp
  const latestStatusUpdate = order.statusHistory && order.statusHistory.length > 0
    ? order.statusHistory[order.statusHistory.length - 1]?.timestamp
    : order.timestamp;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Link to="/orders" className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-600 transition-colors mb-3 sm:mb-4 md:mb-6 group text-sm sm:text-base">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Back to Orders</span>
            <span className="sm:hidden">Back</span>
          </Link>
          
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black mb-1 sm:mb-2 leading-tight">Order Tracking</h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 truncate">Order #{order.id}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl sm:text-2xl font-black text-orange-600">Rs. {order.total.toFixed(2)}</p>
                <p className="text-[10px] sm:text-xs text-zinc-500">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Status Card */}
        <div className={`bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border-2 border-zinc-200 dark:border-zinc-800 shadow-xl mb-4 sm:mb-6 md:mb-8 ${currentStatusConfig.bgColor} border-opacity-50`}>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={`${currentStatusConfig.bgColor} ${currentStatusConfig.color} p-3 sm:p-4 rounded-xl sm:rounded-2xl shrink-0 relative`}>
              <div className="w-5 h-5 sm:w-6 sm:h-6">
                {currentStatusConfig.icon}
              </div>
              {/* Status update indicator - shows when admin updates status */}
              {order.statusHistory && order.statusHistory.length > 1 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse" title="Status updated" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
                <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-black leading-tight">{currentStatusConfig.label}</h2>
                {order.statusHistory && order.statusHistory.length > 1 && (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-bold rounded-full">
                    Updated
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mb-3 sm:mb-4 leading-relaxed">{currentStatusConfig.description}</p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">{formatDate(order.timestamp)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">{order.customerPhone}</span>
                </div>
                {order.deliveryType === 'delivery' && order.customerAddress && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Delivery</span>
                  </div>
                )}
                {order.deliveryType === 'pickup' && (
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Pickup</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-zinc-200 dark:border-zinc-800 shadow-lg mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-lg sm:text-xl font-serif font-black mb-4 sm:mb-6">Order Progress</h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 sm:left-5 md:left-6 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800"></div>
            
            <div className="space-y-5 sm:space-y-6 md:space-y-8">
              {statusSteps.map((status, index) => {
                const statusConfig = getStatusConfig(status);
                const isCompleted = index < currentStatusIndex || (order.status === 'completed' && index === statusSteps.length - 1);
                const isCurrent = index === currentStatusIndex && !isCancelled;
                const isCancelledStep = isCancelled && status === 'cancelled';
                
                return (
                  <div key={status} className="relative flex items-start gap-3 sm:gap-4">
                    {/* Status Icon */}
                    <div className={`relative z-10 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCancelledStep
                        ? 'bg-red-100 dark:bg-red-900/20 border-red-600 text-red-600'
                        : isCompleted
                        ? 'bg-green-100 dark:bg-green-900/20 border-green-600 text-green-600'
                        : isCurrent
                        ? `${statusConfig.bgColor} border-orange-600 ${statusConfig.color} animate-pulse`
                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-400'
                    }`}>
                      {isCompleted && !isCancelledStep ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      ) : (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
                          {statusConfig.icon}
                        </div>
                      )}
                    </div>
                    
                    {/* Status Content */}
                    <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
                      <h4 className={`font-bold text-base sm:text-lg mb-0.5 sm:mb-1 leading-tight ${
                        isCurrent || isCompleted
                          ? 'text-zinc-900 dark:text-white'
                          : 'text-zinc-500 dark:text-zinc-400'
                      }`}>
                        {statusConfig.label}
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {statusConfig.description}
                      </p>
                      {isCurrent && (
                        <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-[10px] sm:text-xs font-bold">
                          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          Current Status
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-zinc-200 dark:border-zinc-800 shadow-lg mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-lg sm:text-xl font-serif font-black mb-4 sm:mb-6">Order Details</h3>
          
          <div className="space-y-3 sm:space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start gap-3 sm:gap-4 py-2 sm:py-3 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base leading-tight">{item.name.split(' (')[0]}</p>
                  {item.addOns && item.addOns.length > 0 && (
                    <p className="text-[10px] sm:text-xs text-orange-600 dark:text-orange-400 mt-0.5 sm:mt-1 leading-relaxed">
                      + {item.addOns.map(a => a.name).join(', ')}
                    </p>
                  )}
                  <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1">Qty: {item.quantity} × Rs. {item.price.toFixed(2)}</p>
                </div>
                <p className="font-bold text-orange-600 text-sm sm:text-base shrink-0">Rs. {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {order.deliveryType === 'delivery' && order.customerAddress && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <h4 className="font-bold mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Delivery Address</span>
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed break-words">{order.customerAddress}</p>
            </div>
          )}

          {order.deliveryType === 'pickup' && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <h4 className="font-bold mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Pickup Location</span>
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">GRILL HUT Restaurant</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 mt-1 leading-relaxed">Please come to our restaurant to pick up your order.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/orders"
            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold transition-colors text-center text-sm sm:text-base"
          >
            View All Orders
          </Link>
          <Link
            to="/"
            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors text-center text-sm sm:text-base shadow-lg shadow-orange-600/20"
          >
            Order Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

