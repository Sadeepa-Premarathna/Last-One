export interface Product {
  _id: string;
  name: string;
  description: string;
  category: 'milk' | 'yogurt' | 'cheese' | 'butter' | 'cream' | 'ice-cream' | 'other';
  price: number;
  unit: 'ml' | 'l' | 'g' | 'kg' | 'piece';
  stock: number;
  minStock: number;
  brand: string;
  expiryDate: Date;
  manufacturingDate: Date;
  batchNumber: string;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    fat?: number;
    carbohydrates?: number;
    calcium?: number;
    vitamins?: string[];
  };
  images?: string[];
  isActive: boolean;
  supplier?: {
    name?: string;
    contact?: string;
    address?: string;
  };
  tags?: string[];
  rating: {
    average: number;
    count: number;
  };
  isExpired?: boolean;
  isLowStock?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: Product['category'];
  price: number;
  unit: Product['unit'];
  stock: number;
  minStock: number;
  brand: string;
  expiryDate: string;
  manufacturingDate: string;
  batchNumber: string;
  nutritionalInfo?: Product['nutritionalInfo'];
  images?: string[];
  supplier?: Product['supplier'];
  tags?: string[];
}

export interface ProductFilters {
  search?: string;
  category?: Product['category'];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'expiryDate';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}