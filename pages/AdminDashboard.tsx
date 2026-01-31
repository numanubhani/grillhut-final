
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { Package, Plus, Trash2, Eye, EyeOff, CheckCircle, Clock, XCircle, PlusCircle, LayoutGrid, Tag, ChefHat, Truck, ShoppingBag, UtensilsCrossed, ChevronDown, ExternalLink } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { OrderTrackingStatus, Order } from '../types';
import { apiService } from '../services/api';

// Order Status Dropdown Component
const OrderStatusDropdown: React.FC<{ order: Order; onStatusChange: (status: OrderTrackingStatus) => void }> = ({ order, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; vertical: 'bottom' | 'top'; horizontal: 'right' | 'left' }>({ top: 0, left: 0, vertical: 'bottom', horizontal: 'right' });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 256; // max-h-64 = 256px
      const dropdownWidth = 224; // w-56 = 224px (sm:w-56)
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const spaceRight = window.innerWidth - buttonRect.right;
      const spaceLeft = buttonRect.left;
      
      const vertical = (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) ? 'top' as const : 'bottom' as const;
      const horizontal = (spaceRight < dropdownWidth && spaceLeft > dropdownWidth) ? 'left' as const : 'right' as const;
      
      // Calculate absolute position
      let top = 0;
      let left = 0;
      
      if (vertical === 'bottom') {
        top = buttonRect.bottom + window.scrollY + 8; // mt-2 = 8px
      } else {
        top = buttonRect.top + window.scrollY - dropdownHeight - 8; // mb-2 = 8px
      }
      
      if (horizontal === 'right') {
        left = buttonRect.right + window.scrollX - dropdownWidth;
      } else {
        left = buttonRect.left + window.scrollX;
      }
      
      setDropdownPosition({ top, left, vertical, horizontal });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      updatePosition();
      
      // Update position on scroll/resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const getStatusOptions = (): { value: OrderTrackingStatus; label: string; icon: React.ReactNode; color: string }[] => {
    const allOptions: { value: OrderTrackingStatus; label: string; icon: React.ReactNode; color: string }[] = [
      { value: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" />, color: 'text-amber-600' },
      { value: 'confirmed', label: 'Confirmed', icon: <CheckCircle className="w-4 h-4" />, color: 'text-blue-600' },
      { value: 'preparing', label: 'Preparing', icon: <ChefHat className="w-4 h-4" />, color: 'text-purple-600' },
    ];

    if (order.deliveryType === 'delivery') {
      allOptions.push(
        { value: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck className="w-4 h-4" />, color: 'text-indigo-600' }
      );
    } else {
      allOptions.push(
        { value: 'ready', label: 'Ready', icon: <UtensilsCrossed className="w-4 h-4" />, color: 'text-green-600' },
        { value: 'ready_for_pickup', label: 'Ready for Pickup', icon: <ShoppingBag className="w-4 h-4" />, color: 'text-green-600' }
      );
    }

    allOptions.push(
      { value: 'completed', label: 'Completed', icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600' },
      { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-4 h-4" />, color: 'text-red-600' }
    );

    return allOptions;
  };

  const statusOptions = getStatusOptions();
  const currentStatus = statusOptions.find(opt => opt.value === order.status);

  const getStatusColor = (status: OrderTrackingStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30';
      case 'cancelled':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30';
      case 'confirmed':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30';
      case 'preparing':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30';
      case 'out_for_delivery':
        return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30';
      case 'ready_for_pickup':
      case 'ready':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30';
      default:
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30';
    }
  };

  const handleStatusChange = (status: OrderTrackingStatus) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all hover:shadow-md ${
          getStatusColor(order.status)
        }`}
      >
        {currentStatus?.icon}
        <span className="hidden sm:inline">{currentStatus?.label || order.status.replace(/_/g, ' ')}</span>
        <span className="sm:hidden">{currentStatus?.label.charAt(0) || order.status.charAt(0)}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown - Rendered via Portal to escape table overflow */}
          <div 
            ref={dropdownMenuRef}
            className="fixed w-48 sm:w-56 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 overflow-hidden"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              maxHeight: 'min(16rem, calc(100vh - 2rem))',
            }}
          >
            <div className="py-1 max-h-64 overflow-y-auto scrollbar-hide">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  disabled={order.status === option.value}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                    order.status === option.value
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 cursor-not-allowed'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer active:bg-zinc-100 dark:active:bg-zinc-700'
                  }`}
                >
                  <span className={option.color}>{option.icon}</span>
                  <span className="flex-1 text-left">{option.label}</span>
                  {order.status === option.value && (
                    <CheckCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { 
    isAdmin, orders, products, categories, 
    updateOrderStatus, addProduct, removeProduct, 
    toggleProductVisibility, addCategory, removeCategory 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'in-progress' | 'completed' | 'cancelled'>('all');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, category: '', image: '' });
  const [newCatName, setNewCatName] = useState('');
  const [lastOrderCount, setLastOrderCount] = useState(orders.length);

  // Listen for BroadcastChannel messages (cross-tab communication)
  useEffect(() => {
    if (!isAdmin) return;

    let channel: BroadcastChannel | null = null;
    
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('order-notifications');
        
        channel.onmessage = (event) => {
          if (event.data.type === 'NEW_ORDER') {
            const order = event.data.order;
            // Show toast notification
            toast.success(
              `🔔 New Order Received!\nOrder #${order.id}\nFrom: ${order.customerName}\nTotal: Rs. ${order.total.toFixed(2)}`,
              {
                duration: 6000,
                position: 'top-right',
                icon: '🔔',
                style: {
                  whiteSpace: 'pre-line',
                },
              }
            );
          }
        };
      }
    } catch (err) {
      console.log('BroadcastChannel error:', err);
    }

    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, [isAdmin]);

  // Listen for service worker messages (for when app is in background)
  useEffect(() => {
    if (!isAdmin) return;

    if ('serviceWorker' in navigator) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'NEW_ORDER') {
          const order = event.data.order;
          toast.success(
            `🔔 New Order Received!\nOrder #${order.id}\nFrom: ${order.customerName}\nTotal: Rs. ${order.total.toFixed(2)}`,
            {
              duration: 6000,
              position: 'top-right',
              icon: '🔔',
              style: {
                whiteSpace: 'pre-line',
              },
            }
          );
        }
      };

      navigator.serviceWorker.addEventListener('message', handleMessage);

      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, [isAdmin]);

  // Monitor for new orders when admin is viewing orders tab
  useEffect(() => {
    if (!isAdmin || activeTab !== 'orders') return;

    // Check if new orders were added (orders are sorted newest first)
    if (orders.length > lastOrderCount && lastOrderCount > 0) {
      const newOrdersCount = orders.length - lastOrderCount;
      // Get the newest orders (first in array since sorted by timestamp desc)
      const newOrders = orders.slice(0, newOrdersCount);
      
      // Show toast for each new order
      newOrders.forEach((order) => {
        toast.success(
          `🔔 New Order Received!\nOrder #${order.id}\nFrom: ${order.customerName}\nTotal: Rs. ${order.total.toFixed(2)}`,
          {
            duration: 6000,
            position: 'top-right',
            icon: '🔔',
            style: {
              whiteSpace: 'pre-line',
            },
          }
        );
      });
      
      setLastOrderCount(orders.length);
    }
  }, [isAdmin, activeTab, orders.length, lastOrderCount]);

  // Initialize lastOrderCount when component mounts
  useEffect(() => {
    if (isAdmin && activeTab === 'orders') {
      setLastOrderCount(orders.length);
    }
  }, [isAdmin, activeTab]);

  if (!isAdmin) return <Navigate to="/admin/login" />;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(newProduct);
    setShowAddProduct(false);
    setNewProduct({ name: '', description: '', price: 0, category: '', image: '' });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    addCategory(newCatName);
    setNewCatName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-serif font-black mb-2">Management Hub</h1>
          <p className="text-slate-500 dark:text-zinc-400">Manage orders, products and categories in real-time.</p>
        </div>
        
        <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
          {[
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'products', label: 'Inventory', icon: LayoutGrid },
            { id: 'categories', label: 'Categories', icon: Tag }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'orders' && (() => {
        // Sort orders by timestamp (newest first) and filter based on selected filter
        const sortedOrders = [...orders].sort((a, b) => b.timestamp - a.timestamp);
        const filteredOrders = sortedOrders.filter(order => {
          switch (orderFilter) {
            case 'in-progress':
              return order.status !== 'completed' && order.status !== 'cancelled';
            case 'completed':
              return order.status === 'completed';
            case 'cancelled':
              return order.status === 'cancelled';
            default:
              return true; // 'all'
          }
        });

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Active Orders</p>
                <h3 className="text-3xl font-black">{orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}</h3>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Completed Today</p>
                <h3 className="text-3xl font-black">{orders.filter(o => o.status === 'completed').length}</h3>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Revenue</p>
                <h3 className="text-3xl font-black text-primary-500">${orders.reduce((sum, o) => o.status === 'completed' ? sum + o.total : sum, 0).toFixed(2)}</h3>
              </div>
            </div>

            {/* Order Filter Tabs */}
            <div className="bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-slate-100 dark:border-zinc-800 flex gap-2 overflow-x-auto scrollbar-hide">
              {[
                { id: 'all', label: 'All Orders', count: orders.length, icon: Package },
                { id: 'in-progress', label: 'In Progress', count: orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length, icon: Clock },
                { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length, icon: CheckCircle },
                { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length, icon: XCircle }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setOrderFilter(tab.id as any)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                    orderFilter === tab.id
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    orderFilter === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800">
                    <th className="px-8 py-5 text-sm font-black uppercase tracking-wider text-slate-400">Order ID</th>
                    <th className="px-8 py-5 text-sm font-black uppercase tracking-wider text-slate-400">Customer</th>
                    <th className="px-8 py-5 text-sm font-black uppercase tracking-wider text-slate-400">Delivery</th>
                    <th className="px-8 py-5 text-sm font-black uppercase tracking-wider text-slate-400">Total</th>
                    <th className="px-8 py-5 text-sm font-black uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-8 py-5 text-sm font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center text-slate-500">
                        {orderFilter === 'all' && 'No orders placed yet.'}
                        {orderFilter === 'in-progress' && 'No orders in progress.'}
                        {orderFilter === 'completed' && 'No completed orders.'}
                        {orderFilter === 'cancelled' && 'No cancelled orders.'}
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, index) => {
                      // Check if order is new (placed within last 30 seconds)
                      const isNewOrder = Date.now() - order.timestamp < 30000;
                      
                      return (
                        <tr 
                          key={order.id} 
                          className={`hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors ${
                            isNewOrder ? 'bg-green-50/50 dark:bg-green-900/10' : ''
                          }`}
                        >
                      <td className="px-8 py-6">
                        <Link 
                          to={`/track-order/${order.id}`}
                          className="font-bold font-mono text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors inline-flex items-center gap-1.5 group"
                        >
                          {order.id}
                          {isNewOrder && (
                            <span className="px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                              NEW
                            </span>
                          )}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold">{order.customerName}</div>
                        <div className="text-xs text-slate-500">{order.customerPhone}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold capitalize">{order.deliveryType}</div>
                        {order.deliveryType === 'delivery' && order.customerAddress && (
                          <div className="text-xs text-slate-500 mt-1">{order.customerAddress}</div>
                        )}
                      </td>
                      <td className="px-8 py-6 font-black text-primary-500">${order.total.toFixed(2)}</td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                          order.status === 'preparing' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' :
                          order.status === 'out_for_delivery' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30' :
                          order.status === 'ready_for_pickup' || order.status === 'ready' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                          'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                        }`}>
                          {order.status === 'pending' && <Clock className="w-3 h-3" />}
                          {order.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                          {order.status === 'preparing' && <ChefHat className="w-3 h-3" />}
                          {order.status === 'out_for_delivery' && <Truck className="w-3 h-3" />}
                          {order.status === 'ready_for_pickup' && <ShoppingBag className="w-3 h-3" />}
                          {order.status === 'ready' && <UtensilsCrossed className="w-3 h-3" />}
                          {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                          {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                          {order.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Link
                            to={`/track-order/${order.id}`}
                            className="p-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
                            title="View Order Tracking"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <OrderStatusDropdown 
                            order={order} 
                            onStatusChange={(status) => updateOrderStatus(order.id, status)} 
                          />
                        </div>
                      </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {activeTab === 'products' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-serif font-bold">Manage Inventory</h3>
            <button 
              onClick={() => setShowAddProduct(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20"
            >
              <PlusCircle className="w-5 h-5" />
              New Product
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map(product => (
              <div key={product.id} className="flex gap-6 bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800 group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                  <img src={product.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h4 className="font-bold text-lg">{product.name}</h4>
                      <span className="text-primary-500 font-black">${product.price.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-2">{product.description}</p>
                    <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleProductVisibility(product.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        product.isHidden 
                        ? 'bg-slate-100 text-slate-600 dark:bg-zinc-800' 
                        : 'bg-primary-50 text-primary-600 dark:bg-primary-900/20'
                      }`}
                    >
                      {product.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {product.isHidden ? 'Hidden' : 'Visible'}
                    </button>
                    <button 
                      onClick={() => removeProduct(product.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 rounded-xl text-xs font-bold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="max-w-2xl">
          <h3 className="text-2xl font-serif font-bold mb-8">Product Categories</h3>
          
          <form onSubmit={handleAddCategory} className="flex gap-4 mb-10">
            <input 
              required
              type="text"
              placeholder="Enter category name..."
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <button className="px-8 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold">Add</button>
          </form>

          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800">
                <span className="font-bold text-lg">{cat.name}</span>
                <button 
                  onClick={() => removeCategory(cat.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-3xl font-serif font-black mb-8">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">Product Name</label>
                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-6 outline-none" placeholder="Royal Feast Burger" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea required rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-6 outline-none resize-none" placeholder="Brief description of the dish..." />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Price ($)</label>
                <input required type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-6 outline-none" placeholder="12.99" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Category</label>
                <select required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-6 outline-none appearance-none">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">Image URL (Unsplash or direct link)</label>
                <input required type="text" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-6 outline-none" placeholder="https://images.unsplash.com/..." />
              </div>
              
              <div className="md:col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setShowAddProduct(false)} className="flex-1 py-4 border border-slate-200 dark:border-zinc-800 rounded-2xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20">Create Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
