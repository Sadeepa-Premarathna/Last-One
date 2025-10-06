import axios from 'axios';
import { Product, ProductFormData, DashboardStats, ApiResponse, RawMilk, RawMilkFormData } from '../Inventorytypes';

// Configure axios defaults
const isDevelopment = window.location.hostname === 'localhost';
axios.defaults.baseURL = isDevelopment ? 'http://localhost:5000' : '';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const API_URL = '/api/products';
const RAW_MILK_URL = '/api/rawmilk';

export const productService = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    const response = await axios.get<ApiResponse<Product[]>>(API_URL);
    return response.data.data || [];
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await axios.get<ApiResponse<Product>>(`${API_URL}/${id}`);
    return response.data.data!;
  },

  // Create product
  createProduct: async (productData: ProductFormData): Promise<Product> => {
    const response = await axios.post<ApiResponse<Product>>(API_URL, productData);
    return response.data.data!;
  },

  // Update product
  updateProduct: async (id: string, productData: Partial<ProductFormData>): Promise<Product> => {
    const response = await axios.put<ApiResponse<Product>>(`${API_URL}/${id}`, productData);
    return response.data.data!;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },

  // Get expiring products
  getExpiringProducts: async (): Promise<Product[]> => {
    const response = await axios.get<ApiResponse<Product[]>>(`${API_URL}/expiring`);
    return response.data.data || [];
  },

  // Get low stock products
  getLowStockProducts: async (): Promise<Product[]> => {
    const response = await axios.get<ApiResponse<Product[]>>(`${API_URL}/low-stock`);
    return response.data.data || [];
  },

  // Get dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axios.get<ApiResponse<DashboardStats>>(`${API_URL}/stats`);
    return response.data.data!;
  }
};

export const rawMilkService = {
  // Get all raw milk collections
  getAllRawMilk: async (): Promise<RawMilk[]> => {
    const response = await axios.get<RawMilk[]>(RAW_MILK_URL);
    return response.data;
  },

  // Get raw milk by ID
  getRawMilkById: async (id: string): Promise<RawMilk> => {
    const response = await axios.get<RawMilk>(`${RAW_MILK_URL}/${id}`);
    return response.data;
  },

  // Create raw milk collection
  createRawMilk: async (data: RawMilkFormData): Promise<RawMilk> => {
    const response = await axios.post<RawMilk>(RAW_MILK_URL, data);
    return response.data;
  },

  // Update raw milk collection
  updateRawMilk: async (id: string, data: Partial<RawMilkFormData>): Promise<RawMilk> => {
    const response = await axios.put<RawMilk>(`${RAW_MILK_URL}/${id}`, data);
    return response.data;
  },

  // Delete raw milk collection
  deleteRawMilk: async (id: string): Promise<void> => {
    await axios.delete(`${RAW_MILK_URL}/${id}`);
  },

  // Get statistics
  getRawMilkStats: async (): Promise<any> => {
    const response = await axios.get(`${RAW_MILK_URL}/stats`);
    return response.data;
  }
};
