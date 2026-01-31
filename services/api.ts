// API Service for backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Orders
  async createOrder(orderData: any): Promise<any> {
    return this.request('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(customerId?: string, status?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (customerId) params.append('customer_id', customerId);
    if (status) params.append('status', status);
    const query = params.toString();
    return this.request(`/orders/${query ? `?${query}` : ''}`);
  }

  async getOrder(orderId: string): Promise<any> {
    return this.request(`/orders/${orderId}/`);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    return this.request(`/orders/${orderId}/update_status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Products
  async getProducts(category?: string): Promise<any[]> {
    const query = category ? `?category=${category}` : '';
    return this.request(`/products/${query}`);
  }

  // Categories
  async getCategories(): Promise<any[]> {
    return this.request('/categories/');
  }

  // AddOns
  async getAddOnCategories(): Promise<any[]> {
    return this.request('/addon-categories/');
  }
}

export const apiService = new ApiService();

