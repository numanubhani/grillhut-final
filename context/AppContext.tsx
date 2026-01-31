
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Product, Category, Order, AppState, OrderItem, Customer, AddOn, OrderTrackingStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../constants';
import { apiService } from '../services/api';

interface AppContextType extends AppState {
  toggleDarkMode: () => void;
  setAdminStatus: (status: boolean) => void;
  addProduct: (product: Omit<Product, 'id' | 'isHidden'>) => void;
  removeProduct: (id: string) => void;
  toggleProductVisibility: (id: string) => void;
  addCategory: (name: string) => void;
  removeCategory: (id: string) => void;
  addToCart: (item: OrderItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCartItemAddOns: (productId: string, addOns: AddOn[]) => void;
  clearCart: () => void;
  placeOrder: (customerName: string, customerPhone: string, customerAddress?: string, paymentMethod?: string, specialInstructions?: string) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderTrackingStatus) => void;
  setDeliveryType: (type: 'pickup' | 'delivery' | null) => void;
  setDeliveryLocation: (location: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  registerCustomer: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  loginCustomer: (email: string, password: string) => Promise<boolean>;
  logoutCustomer: () => void;
  getCustomerOrders: () => Order[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gh_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('gh_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gh_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [lastOrderCount, setLastOrderCount] = useState(0);

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('gh_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('gh_theme') === 'dark';
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    // Check localStorage first, then cookies
    const saved = localStorage.getItem('gh_isAdmin');
    if (saved === 'true') return true;
    
    // Check cookie as fallback
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('gh_isAdmin='))
      ?.split('=')[1];
    return cookieValue === 'true';
  });
  
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('gh_currentCustomer');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing customer from localStorage:', e);
      }
    }
    
    // Check cookie as fallback
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('gh_currentCustomer='))
      ?.split('=')[1];
    if (cookieValue) {
      try {
        return JSON.parse(decodeURIComponent(cookieValue));
      } catch (e) {
        console.error('Error parsing customer from cookie:', e);
      }
    }
    
    return null;
  });
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery' | null>(() => {
    const saved = localStorage.getItem('gh_deliveryType');
    return (saved === 'pickup' || saved === 'delivery') ? saved : null;
  });
  const [deliveryLocation, setDeliveryLocation] = useState<string>(() => {
    return localStorage.getItem('gh_deliveryLocation') || '';
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Helper function to set cookie
  const setCookie = (name: string, value: string, days: number = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  };

  // Helper function to delete cookie
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  };

  useEffect(() => {
    localStorage.setItem('gh_products', JSON.stringify(products));
    localStorage.setItem('gh_categories', JSON.stringify(categories));
    localStorage.setItem('gh_orders', JSON.stringify(orders));
    localStorage.setItem('gh_customers', JSON.stringify(customers));
    localStorage.setItem('gh_theme', isDarkMode ? 'dark' : 'light');
    
    // Persist admin status
    localStorage.setItem('gh_isAdmin', isAdmin ? 'true' : 'false');
    if (isAdmin) {
      setCookie('gh_isAdmin', 'true', 30); // 30 days
    } else {
      deleteCookie('gh_isAdmin');
    }
    
    // Persist customer session
    if (currentCustomer) {
      localStorage.setItem('gh_currentCustomer', JSON.stringify(currentCustomer));
      setCookie('gh_currentCustomer', encodeURIComponent(JSON.stringify(currentCustomer)), 30); // 30 days
    } else {
      localStorage.removeItem('gh_currentCustomer');
      deleteCookie('gh_currentCustomer');
    }
    
    if (deliveryType) localStorage.setItem('gh_deliveryType', deliveryType);
    if (deliveryLocation) localStorage.setItem('gh_deliveryLocation', deliveryLocation);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [products, categories, orders, customers, currentCustomer, isDarkMode, isAdmin, deliveryType, deliveryLocation]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const setAdminStatus = (status: boolean) => {
    setIsAdmin(status);
    // Persist immediately
    localStorage.setItem('gh_isAdmin', status ? 'true' : 'false');
    if (status) {
      setCookie('gh_isAdmin', 'true', 30);
    } else {
      deleteCookie('gh_isAdmin');
    }
  };

  const addProduct = (p: Omit<Product, 'id' | 'isHidden'>) => {
    const newProduct: Product = {
      ...p,
      id: Math.random().toString(36).substr(2, 9),
      isHidden: false
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleProductVisibility = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isHidden: !p.isHidden } : p));
  };

  const addCategory = (name: string) => {
    const newCat: Category = { id: Math.random().toString(36).substr(2, 9), name };
    setCategories(prev => [...prev, newCat]);
  };

  const removeCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addToCart = (item: OrderItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  const updateCartItemAddOns = (productId: string, addOns: AddOn[]) => {
    setCart(prev => prev.map(i => {
      if (i.productId === productId) {
        const product = products.find(p => p.id === productId);
        const basePrice = product?.price || 0;
        // Calculate new add-ons total
        const newAddOnsTotal = addOns.reduce((sum, addOn) => sum + addOn.price, 0);
        // New price = base product price + new add-ons total
        const newPrice = basePrice + newAddOnsTotal;
        // Update name to include add-ons if any
        const baseName = i.name.split(' (')[0]; // Get base product name
        const newName = addOns.length > 0 
          ? `${baseName} (${addOns.map(a => a.name).join(', ')})`
          : baseName;
        return { ...i, name: newName, addOns: addOns.length > 0 ? addOns : undefined, price: newPrice };
      }
      return i;
    }));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (customerName: string, customerPhone: string, customerAddress?: string, paymentMethod?: string, specialInstructions?: string): Promise<string> => {
    try {
      // Prepare order data for backend
      const orderData = {
        customer_id: currentCustomer?.id || null,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress || null,
        delivery_type: deliveryType || 'pickup',
        payment_method: paymentMethod || null,
        special_instructions: specialInstructions || null,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          addOns: item.addOns || []
        }))
      };

      let newOrder: Order;

      try {
        // Try to create order via API
        const response = await apiService.createOrder(orderData);
        
        // Convert backend response to frontend format
        newOrder = {
          id: response.id,
          customerId: response.customer || currentCustomer?.id,
          customerName: response.customer_name,
          customerPhone: response.customer_phone,
          customerAddress: response.customer_address,
          deliveryType: response.delivery_type,
          items: response.items.map((item: any) => ({
            productId: item.product?.id || '',
            name: item.name,
            price: parseFloat(item.price),
            quantity: item.quantity,
            addOns: item.addons?.map((addon: any) => ({
              id: addon.addon?.id || '',
              name: addon.name,
              price: parseFloat(addon.price),
              category: ''
            })) || []
          })),
          total: parseFloat(response.total),
          status: response.status,
          timestamp: new Date(response.timestamp).getTime(),
          statusHistory: response.status_history?.map((sh: any) => ({
            status: sh.status,
            timestamp: new Date(sh.timestamp).getTime()
          })) || [{ status: 'pending' as OrderTrackingStatus, timestamp: Date.now() }]
        };
      } catch (apiError) {
        // Fallback to local storage if API fails
        console.warn('API unavailable, using local storage:', apiError);
        const orderId = 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        newOrder = {
          id: orderId,
          customerId: currentCustomer?.id,
          customerName,
          customerPhone,
          customerAddress,
          deliveryType: deliveryType || 'pickup',
          items: [...cart],
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
          status: 'pending',
          timestamp: Date.now(),
          statusHistory: [{ status: 'pending' as OrderTrackingStatus, timestamp: Date.now() }]
        };
      }
      
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);

      // Show success toast for customer
      toast.success(`Order placed successfully! Order #${newOrder.id}`, {
        duration: 5000,
        icon: '🎉',
      });

      // Send notification to service worker for background notifications
      // This works even when the app is closed (service worker runs in background)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          if (registration.active) {
            registration.active.postMessage({
              type: 'NEW_ORDER',
              order: {
                id: newOrder.id,
                customerName: newOrder.customerName,
                total: newOrder.total,
                timestamp: newOrder.timestamp
              }
            });
          }
        }).catch((err) => {
          console.log('Service worker not ready:', err);
        });
      }

      // Also use BroadcastChannel for cross-tab communication (when app is open)
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const channel = new BroadcastChannel('order-notifications');
          channel.postMessage({
            type: 'NEW_ORDER',
            order: newOrder
          });
          // Don't close immediately, let it stay open for other messages
          setTimeout(() => channel.close(), 1000);
        } catch (err) {
          console.log('BroadcastChannel error:', err);
        }
      }

      // Trigger admin notification (if admin is viewing dashboard)
      // This will be handled by the monitoring mechanism in AdminDashboard

      if (Notification.permission === 'granted') {
        new Notification('GRILL HUT', {
          body: `Order received! We're starting your meal, ${customerName}.`,
          icon: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=100&h=100&q=80'
        });
      }

      return newOrder.id;
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order. Please try again.');
      throw error;
    }
  };

  const registerCustomer = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    // Check if email already exists
    if (customers.some(c => c.email === email)) {
      return false;
    }

    const newCustomer: Customer = {
      id: 'CUST-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      name,
      email,
      phone,
      password, // In production, hash this password
      createdAt: Date.now()
    };

    setCustomers(prev => [...prev, newCustomer]);
    setCurrentCustomer(newCustomer);
    // Persist immediately
    localStorage.setItem('gh_currentCustomer', JSON.stringify(newCustomer));
    setCookie('gh_currentCustomer', encodeURIComponent(JSON.stringify(newCustomer)), 30);
    return true;
  };

  const loginCustomer = async (email: string, password: string): Promise<boolean> => {
    const customer = customers.find(c => c.email === email && c.password === password);
    if (customer) {
      setCurrentCustomer(customer);
      // Persist immediately
      localStorage.setItem('gh_currentCustomer', JSON.stringify(customer));
      setCookie('gh_currentCustomer', encodeURIComponent(JSON.stringify(customer)), 30);
      return true;
    }
    return false;
  };

  const logoutCustomer = () => {
    setCurrentCustomer(null);
    // Clear immediately
    localStorage.removeItem('gh_currentCustomer');
    deleteCookie('gh_currentCustomer');
  };

  const getCustomerOrders = (): Order[] => {
    if (!currentCustomer) return [];
    return orders.filter(order => order.customerId === currentCustomer.id);
  };

  const updateOrderStatus = async (orderId: string, status: OrderTrackingStatus) => {
    try {
      // Try to update via API first
      try {
        const response = await apiService.updateOrderStatus(orderId, status);
        
        // Update local state from API response
        setOrders(prev => prev.map(o => {
          if (o.id === orderId) {
            const orderData = response.order || response;
            return { 
              ...o, 
              status: orderData.status || status,
              statusHistory: orderData.status_history?.map((sh: any) => ({
                status: sh.status,
                timestamp: new Date(sh.timestamp).getTime()
              })) || [...(o.statusHistory || []), { status, timestamp: Date.now() }]
            };
          }
          return o;
        }));
      } catch (apiError) {
        // Fallback to local update if API fails
        console.warn('API unavailable, updating locally:', apiError);
        setOrders(prev => prev.map(o => {
          if (o.id === orderId) {
            const statusHistory = o.statusHistory || [];
            return { 
              ...o, 
              status,
              statusHistory: [...statusHistory, { status, timestamp: Date.now() }]
            };
          }
          return o;
        }));
      }

      // Show success toast for admin
      if (isAdmin) {
        toast.success(`Order ${orderId} status updated to ${status.replace(/_/g, ' ')}`, {
          duration: 3000,
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status.');
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      products, categories, orders, customers, isDarkMode, isAdmin, currentCustomer, cart, deliveryType, deliveryLocation,
      toggleDarkMode, setAdminStatus, addProduct, removeProduct,
      toggleProductVisibility, addCategory, removeCategory,
      addToCart, removeFromCart, updateCartQuantity, updateCartItemAddOns, clearCart, placeOrder, updateOrderStatus,
      setDeliveryType, setDeliveryLocation, isCartOpen, setIsCartOpen,
      registerCustomer, loginCustomer, logoutCustomer, getCustomerOrders
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
