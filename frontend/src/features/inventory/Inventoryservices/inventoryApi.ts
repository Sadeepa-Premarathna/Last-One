import axios from 'axios';
import { Product, ProductFormData, DashboardStats, ApiResponse, RawMilk, RawMilkFormData, MilkCollection, MilkCollectionFormData } from '../Inventorytypes/inventoryTypes';

// Configure axios defaults
const isDevelopment = window.location.hostname === 'localhost';
axios.defaults.baseURL = isDevelopment ? 'http://localhost:8000' : '';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const API_URL = '/api/inventory/products';
const RAW_MILK_URL = '/api/inventory/rawmilk';

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

export const milkCollectionService = {
  // Get all milk collections
  getAllMilkCollections: async (): Promise<MilkCollection[]> => {
    const response = await axios.get<ApiResponse<MilkCollection[]>>('/api/inventory/milk-collection');
    return response.data.data || [];
  },

  // Get milk collection by ID
  getMilkCollectionById: async (id: string): Promise<MilkCollection> => {
    const response = await axios.get<ApiResponse<MilkCollection>>(`/api/inventory/milk-collection/${id}`);
    return response.data.data!;
  },

  // Create milk collection
  createMilkCollection: async (data: MilkCollectionFormData): Promise<MilkCollection> => {
    const response = await axios.post<ApiResponse<MilkCollection>>('/api/inventory/milk-collection', data);
    return response.data.data!;
  },

  // Update milk collection
  updateMilkCollection: async (id: string, data: Partial<MilkCollectionFormData>): Promise<MilkCollection> => {
    const response = await axios.put<ApiResponse<MilkCollection>>(`/api/inventory/milk-collection/${id}`, data);
    return response.data.data!;
  },

  // Delete milk collection
  deleteMilkCollection: async (id: string): Promise<void> => {
    await axios.delete(`/api/inventory/milk-collection/${id}`);
  },

  // Get statistics
  getMilkCollectionStats: async (): Promise<any> => {
    const response = await axios.get('/api/inventory/milk-collection/stats');
    return response.data.data;
  }
};
