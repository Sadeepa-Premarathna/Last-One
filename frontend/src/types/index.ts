export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'milk' | 'cheese' | 'yogurt' | 'butter' | 'cream' | 'ice-cream' | 'other';
  image: string;
  stock: number;
  unit: string;
  brand: string;
  expiryDays: number;
  isOrganic: boolean;
  fatContent?: number;
  volume?: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  role: 'customer' | 'admin';
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  isOrganic?: boolean;
  search?: string;
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'name';
  page?: number;
  limit?: number;
}
