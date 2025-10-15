// Central API Configuration for Dairy Licious System

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  TIMEOUT: 30000, // 30 seconds
} as const;

export const API_ENDPOINTS = {
  // Finance Module Endpoints
  FINANCE: {
    BASE: `${API_CONFIG.BASE_URL}/api/finance`,
    ALLOWANCES: `${API_CONFIG.BASE_URL}/api/finance/allowances`,
    EXPENSES: `${API_CONFIG.BASE_URL}/api/finance/expenses`,
    SALARY_SLIPS: `${API_CONFIG.BASE_URL}/api/finance/salary-slips`,
  },
  
  // HR Module Endpoints
  HR: {
    BASE: `${API_CONFIG.BASE_URL}/api/hr`,
    EMPLOYEES: `${API_CONFIG.BASE_URL}/api/hr/employees`,
    ATTENDANCE: `${API_CONFIG.BASE_URL}/api/hr/attendance`,
    LEAVES: `${API_CONFIG.BASE_URL}/api/hr/leaves`,
    PAYROLL: `${API_CONFIG.BASE_URL}/api/hr/payroll`,
  },
  
  // Employee Module Endpoints
  EMPLOYEE: {
    BASE: `${API_CONFIG.BASE_URL}/api/employee`,
    EMPLOYEES: `${API_CONFIG.BASE_URL}/api/employee/employees`,
    ATTENDANCE: `${API_CONFIG.BASE_URL}/api/employee/attendance`,
    LEAVES: `${API_CONFIG.BASE_URL}/api/employee/leaves`,
  },
  
  // Inventory Module Endpoints
  INVENTORY: {
    BASE: `${API_CONFIG.BASE_URL}/api/inventory`,
    PRODUCTS: `${API_CONFIG.BASE_URL}/api/inventory/products`,
    MILK_COLLECTION: `${API_CONFIG.BASE_URL}/api/inventory/milk-collection`,
    RAW_MILK: `${API_CONFIG.BASE_URL}/api/inventory/raw-milk`,
    STATS: `${API_CONFIG.BASE_URL}/api/inventory/products/stats`,
    EXPIRING: `${API_CONFIG.BASE_URL}/api/inventory/products/expiring`,
    LOW_STOCK: `${API_CONFIG.BASE_URL}/api/inventory/products/low-stock`,
  },
  
  // Delivery Module Endpoints
  DELIVERY: {
    BASE: `${API_CONFIG.BASE_URL}/api/delivery`,
    DELIVERIES: `${API_CONFIG.BASE_URL}/api/delivery/deliveries`,
    DRIVERS: `${API_CONFIG.BASE_URL}/api/delivery/drivers`,
    FARMERS: `${API_CONFIG.BASE_URL}/api/delivery/farmers`,
    MILK_COLLECTION: `${API_CONFIG.BASE_URL}/api/delivery/milk-collection`,
    ORDERS: `${API_CONFIG.BASE_URL}/api/delivery/orders`,
    PAYMENTS: `${API_CONFIG.BASE_URL}/api/delivery/payments`,
  },
  
  // System Endpoints
  HEALTH: `${API_CONFIG.BASE_URL}/health`,
  ROOT: API_CONFIG.BASE_URL,
} as const;

// Helper function to build URL with query parameters
export const buildUrlWithParams = (baseUrl: string, params?: Record<string, string | number | boolean>): string => {
  if (!params) return baseUrl;
  
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// API Error Handler
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Common fetch wrapper with error handling
export const apiFetch = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `HTTP Error ${response.status}`,
        response.status,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
};

export default API_ENDPOINTS;
