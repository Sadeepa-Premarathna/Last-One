<<<<<<< HEAD
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
=======
// Common Types and Interfaces

export interface Driver {
  _id: string;
  driverId: string;
  firstName: string;
  lastName: string;
  name?: string; // Computed name (firstName + lastName)
  nic: string;
  contactNumber: string;
  licenseNumber: string;
  vehicleNumber: string;
  vehicleType: 'Van' | 'Truck' | 'Motorcycle' | 'Three-wheeler';
  status: 'Active' | 'Inactive' | 'On Leave';
  address?: {
    street: string;
    city: string;
    district: string;
    postalCode?: string;
  };
  email?: string;
  assignedRoute?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Farmer {
  _id: string;
  farmerId: string;
  firstName: string;
  lastName: string;
  name?: string; // Computed name (firstName + lastName)
  nic: string;
  contactNumber: string;
  address: {
    street: string;
    city: string;
    district: string;
    postalCode?: string;
  };
  numberOfCows: number;
  farmSize?: number;
  location?: string;
  email?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    branch: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Delivery {
  _id: string;
  deliveryId: string;
  driver: Driver | string;
  driverId?: string;
  customerName?: string;
  deliveryAddress?: string;
  deliveryDate: string | Date;
  completedDate?: string | Date;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Failed' | 'Cancelled';
  items?: DeliveryItem[];
  products?: DeliveryItem[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeliveryItem {
  productName: string;
  quantity: number;
  unit: string;
}

export interface QualityMetrics {
  fatContent: number;
  snf: number;
  temperature: number;
  smell: 'Normal' | 'Abnormal';
  grade: 'A' | 'B' | 'C' | 'Rejected';
}

export interface MilkCollection {
  _id: string;
  collectionId: string;
  farmer: Farmer | string;
  farmerId?: string;
  driver?: Driver | string;
  driverId?: string;
  collectionDate: string | Date;
  collectionTime: 'Morning' | 'Evening';
  quantity: number;
  unit: 'Liters' | 'Gallons';
  quality: QualityMetrics;
  pricePerLiter: number;
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Partial';
  notes?: string;
  status: 'Collected' | 'In Transit' | 'Delivered' | 'Rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryAddress?: {
    street?: string;
    city?: string;
    district?: string;
    postalCode?: string;
  };
  customerLocation?: {
    lat: number;
    lng: number;
  };
  items: OrderItem[];
  products?: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Assigned' | 'In Transit' | 'Delivered' | 'Cancelled';
  driver?: Driver | string;
  driverId?: string;
  assignedDriver?: Driver | string;
  paymentStatus?: 'Pending' | 'Paid' | 'Partial' | 'Refunded';
  orderDate: string | Date;
  deliveryDate?: string | Date;
  requestedDeliveryDate?: string | Date;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  branch?: string;
}

export interface Payment {
  _id: string;
  paymentId: string;
  collectionId: MilkCollection | string;
  farmerId: Farmer | string;
  farmerName: string;
  amount: number;
  paymentDate: string | Date;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Check' | 'Mobile Payment';
  paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Cancelled';
  transactionReference?: string;
  bankDetails?: BankDetails;
  receiptNumber?: string;
  paidBy?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentStats {
  totalPaid: number;
  totalPending: number;
  completedPayments: number;
  pendingPayments: number;
}

export interface APIResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
}

export interface FormErrors {
  [key: string]: string;
>>>>>>> origin/delivery
}
