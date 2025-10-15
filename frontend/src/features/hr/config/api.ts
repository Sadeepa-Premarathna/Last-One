// API Configuration
export const API_BASE_URL = 'http://localhost:8000';
export const API_ENDPOINTS = {
  employees: `${API_BASE_URL}/api/hr/employees`,
  leaves: `${API_BASE_URL}/api/hr/leaves`,
  payroll: `${API_BASE_URL}/api/hr/payroll`,
  attendance: `${API_BASE_URL}/api/hr/attendance`,
  health: `${API_BASE_URL}/health`,
} as const;