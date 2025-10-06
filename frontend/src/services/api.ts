import axios from 'axios';
import { Product, Cart, ProductFilters, PaginatedResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Product API
export const productAPI = {
  getProducts: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    return api.get<{ success: boolean; data: Product[]; pagination: any }>(`/products?${params}`);
  },

  getFeaturedProducts: () => 
    api.get<{ success: boolean; data: Product[] }>('/products/featured'),

  getProductById: (id: string) => 
    api.get<{ success: boolean; data: Product }>(`/products/${id}`),

  getProductsByCategory: (category: string, page = 1, limit = 12) => 
    api.get<{ success: boolean; data: Product[]; pagination: any }>(`/products/category/${category}?page=${page}&limit=${limit}`),

  searchProducts: (query: string) => 
    api.get<{ success: boolean; data: Product[]; pagination: any }>(`/products/search?q=${query}`),

  getCategories: () => 
    api.get<{ name: string; count: number }[]>('/products/categories'),
};

// Cart API
export const cartAPI = {
  getCart: () => 
    api.get<{ success: boolean; data: Cart }>('/cart'),

  addToCart: (productId: string, quantity: number = 1) => 
    api.post<{ success: boolean; data: Cart; message: string }>('/cart/add', { productId, quantity }),

  updateCartItem: (productId: string, quantity: number) => 
    api.put<{ success: boolean; data: Cart; message: string }>('/cart/update', { productId, quantity }),

  removeFromCart: (productId: string) => 
    api.delete<{ success: boolean; data: Cart; message: string }>(`/cart/remove?productId=${productId}`),

  clearCart: () => 
    api.delete<{ success: boolean; data: Cart; message: string }>('/cart/clear'),

  getCartItemCount: () => 
    api.get<{ success: boolean; itemCount: number }>('/cart/count'),
};

// User API
export const userAPI = {
  register: (userData: any) => 
    api.post('/users/register', userData),

  login: (email: string, password: string) => 
    api.post('/users/login', { email, password }),

  getProfile: () => 
    api.get('/users/profile'),
};

export default api;
