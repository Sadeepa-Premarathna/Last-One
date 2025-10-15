import { SalarySlip, UpdatePaymentStatusRequest, SalarySlipFilters } from '../finance_types/salarySlip';

const API_BASE_URL = 'http://localhost:8000/api/finance/salary-slips';

export const salarySlipService = {
  // Fetch all salary slips with optional filters
  async getAllSalarySlips(filters?: SalarySlipFilters): Promise<SalarySlip[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.employeeId) {
        queryParams.append('employeeId', filters.employeeId);
      }
      if (filters?.month) {
        queryParams.append('month', filters.month);
      }
      if (filters?.paymentStatus) {
        queryParams.append('paymentStatus', filters.paymentStatus);
      }

      const url = `${API_BASE_URL}?${queryParams.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch salary slips: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching salary slips:', error);
      throw error;
    }
  },

  // Update payment status of a salary slip
  async updatePaymentStatus(id: string, updateData: UpdatePaymentStatusRequest): Promise<SalarySlip> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update payment status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Get salary slip by ObjectId (for PDF download)
  async getSalarySlipById(id: string): Promise<SalarySlip> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch salary slip: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching salary slip:', error);
      throw error;
    }
  },

  // Generate bulk salary slips
  async generateBulkSalarySlips(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to generate bulk salary slips: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating bulk salary slips:', error);
      throw error;
    }
  }
};