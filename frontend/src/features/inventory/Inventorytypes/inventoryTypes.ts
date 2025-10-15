export interface Product {
  _id: string;
  name: string;
  category: 'Milk' | 'Yogurt' | 'Cheese' | 'Butter' | 'Ice Cream' | 'Cream' | 'Other';
  description: string;
  price: number;
  stock: number;
  unit: 'Liters' | 'Kilograms' | 'Pieces' | 'Bottles' | 'Packets';
  manufactureDate: string;
  expiryDays: number;
  batchNumber: string;
  supplier: string;
  image: string;
  minStockLevel: number;
  status: 'active' | 'low-stock' | 'out-of-stock' | 'expired';
  // Shop-specific fields
  brand: string;
  isOrganic: boolean;
  fatContent?: number;
  volume?: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: number | string;
  stock: number | string;
  unit: string;
  manufactureDate: string;
  expiryDays: number | string;
  batchNumber: string;
  supplier: string;
  image: string;
  minStockLevel: number | string;
  // Shop-specific fields
  brand: string;
  isOrganic: boolean;
  fatContent?: number | string;
  volume?: number | string;
  featured: boolean;
}

export interface RawMilk {
  _id: string;
  supplierName: string;
  contactNumber: string;
  collectionDate: string;
  quantity: number;
  unit: 'Liters' | 'Kilograms';
  fatContent: number;
  quality: 'A' | 'B' | 'C';
  pricePerLiter: number;
  totalAmount: number;
  location: string;
  notes?: string;
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
  updatedAt: string;
}

export interface RawMilkFormData {
  supplierName: string;
  contactNumber: string;
  collectionDate: string;
  quantity: number | string;
  unit: string;
  fatContent: number | string;
  quality: string;
  pricePerLiter: number | string;
  totalAmount: number | string;
  location: string;
  notes?: string;
  paymentStatus: string;
}

export interface MilkCollection {
  _id: string;
  collectionId: string;
  farmerName: string;
  farmerId: string;
  collectionDate: string;
  collectionTime: 'Morning' | 'Evening';
  quantity: number;
  fatPercentage: number;
  snfPercentage: number;
  lactometerReading: number;
  temperature: number;
  density: number;
  rate: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'partial';
  qualityGrade: 'Premium' | 'Standard' | 'Below Standard';
  collectionCenter: string;
  vehicleNumber?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MilkCollectionFormData {
  collectionId: string;
  farmerName: string;
  farmerId: string;
  collectionDate: string;
  collectionTime: string;
  quantity: number | string;
  fatPercentage: number | string;
  snfPercentage: number | string;
  lactometerReading: number | string;
  temperature: number | string;
  density: number | string;
  rate: number | string;
  totalAmount: number | string;
  paymentStatus: string;
  qualityGrade: string;
  collectionCenter: string;
  vehicleNumber?: string;
  remarks?: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  expiredProducts: number;
  totalInventoryValue: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}
