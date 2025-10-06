// API Configuration
export const API_BASE_URL = 'http://localhost:8003';
export const API_ENDPOINTS = {
  employees: `${API_BASE_URL}/api/employees`,
  leaves: `${API_BASE_URL}/api/leaves`,
  payroll: `${API_BASE_URL}/api/payroll`,
  attendance: `${API_BASE_URL}/api/attendance`,
  health: `${API_BASE_URL}/health`,
} as const;