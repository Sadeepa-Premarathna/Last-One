import api from './api';
import { Product, ProductFormData, ProductFilters, ProductsResponse } from '../types/product';

export const productService = {
  async getProducts(filters: ProductFilters = {}, page = 1, limit = 12): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  async getProduct(id: string): Promise<{ product: Product }> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(data: ProductFormData): Promise<{ product: Product }> {
    const response = await api.post('/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<{ product: Product }> {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async getCategories(): Promise<{ categories: string[] }> {
    const response = await api.get('/products/meta/categories');
    return response.data;
  },

  async getLowStockProducts(): Promise<{ products: Product[] }> {
    const response = await api.get('/products/alerts/low-stock');
    return response.data;
  },

  async getExpiredProducts(): Promise<{ products: Product[] }> {
    const response = await api.get('/products/alerts/expired');
    return response.data;
  },

  async getProductStats(): Promise<{
    statistics: {
      totalProducts: number;
      outOfStock: number;
      lowStock: number;
      expired: number;
      categoryDistribution: { _id: string; count: number }[];
    };
  }> {
    const response = await api.get('/products/stats/overview');
    return response.data;
  },
};