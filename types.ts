
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

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  deliveryType: 'pickup' | 'delivery';
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  timestamp: number;
}

export interface AppState {
  products: Product[];
  categories: Category[];
  orders: Order[];
  isDarkMode: boolean;
  isAdmin: boolean;
  cart: OrderItem[];
  deliveryType: 'pickup' | 'delivery' | null;
  deliveryLocation: string;
}
