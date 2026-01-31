
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  discountText?: string;
  category: string;
  image: string;
  isHidden: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface AddOnCategory {
  id: string;
  name: string;
  addOns: AddOn[];
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  addOns?: AddOn[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // In production, this should be hashed
  createdAt: number;
}

export type OrderTrackingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'out_for_delivery' 
  | 'ready_for_pickup' 
  | 'completed' 
  | 'cancelled';

export interface Order {
  id: string;
  customerId?: string; // Link to customer if logged in
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  deliveryType: 'pickup' | 'delivery';
  items: OrderItem[];
  total: number;
  status: OrderTrackingStatus;
  timestamp: number;
  statusHistory?: { status: OrderTrackingStatus; timestamp: number }[];
}

export interface AppState {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  isDarkMode: boolean;
  isAdmin: boolean;
  currentCustomer: Customer | null;
  cart: OrderItem[];
  deliveryType: 'pickup' | 'delivery' | null;
  deliveryLocation: string;
}
