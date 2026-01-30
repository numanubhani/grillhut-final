
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, Order, AppState, OrderItem, Customer } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../constants';

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
  clearCart: () => void;
  placeOrder: (customerName: string, customerPhone: string, customerAddress?: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
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

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('gh_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('gh_theme') === 'dark';
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    const saved = localStorage.getItem('gh_currentCustomer');
    return saved ? JSON.parse(saved) : null;
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

  useEffect(() => {
    localStorage.setItem('gh_products', JSON.stringify(products));
    localStorage.setItem('gh_categories', JSON.stringify(categories));
    localStorage.setItem('gh_orders', JSON.stringify(orders));
    localStorage.setItem('gh_customers', JSON.stringify(customers));
    localStorage.setItem('gh_theme', isDarkMode ? 'dark' : 'light');
    if (currentCustomer) {
      localStorage.setItem('gh_currentCustomer', JSON.stringify(currentCustomer));
    } else {
      localStorage.removeItem('gh_currentCustomer');
    }
    if (deliveryType) localStorage.setItem('gh_deliveryType', deliveryType);
    if (deliveryLocation) localStorage.setItem('gh_deliveryLocation', deliveryLocation);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [products, categories, orders, customers, currentCustomer, isDarkMode, deliveryType, deliveryLocation]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const setAdminStatus = (status: boolean) => setIsAdmin(status);

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

  const clearCart = () => setCart([]);

  const placeOrder = (customerName: string, customerPhone: string, customerAddress?: string) => {
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      customerId: currentCustomer?.id,
      customerName,
      customerPhone,
      customerAddress,
      deliveryType: deliveryType || 'pickup',
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'pending',
      timestamp: Date.now()
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);

    if (Notification.permission === 'granted') {
      new Notification('GRILL HUT', {
        body: `Order received! We're starting your meal, ${customerName}.`,
        icon: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=100&h=100&q=80'
      });
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
    return true;
  };

  const loginCustomer = async (email: string, password: string): Promise<boolean> => {
    const customer = customers.find(c => c.email === email && c.password === password);
    if (customer) {
      setCurrentCustomer(customer);
      return true;
    }
    return false;
  };

  const logoutCustomer = () => {
    setCurrentCustomer(null);
  };

  const getCustomerOrders = (): Order[] => {
    if (!currentCustomer) return [];
    return orders.filter(order => order.customerId === currentCustomer.id);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <AppContext.Provider value={{
      products, categories, orders, customers, isDarkMode, isAdmin, currentCustomer, cart, deliveryType, deliveryLocation,
      toggleDarkMode, setAdminStatus, addProduct, removeProduct,
      toggleProductVisibility, addCategory, removeCategory,
      addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder, updateOrderStatus,
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
