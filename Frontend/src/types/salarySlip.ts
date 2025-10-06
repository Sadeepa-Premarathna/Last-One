export interface SalarySlip {
  id: string;
  salarySlipId: string;
  employeeId: string;
  employeeName?: string;
  month: string;
  basicSalary: number;
  otAmount: number;
  totalAllowances: number;
  totalDeductions: number;
  epfEmployeeContribution: number;
  epfEmployerContribution: number;
  etfEmployerContribution: number;
  grossSalary: number;
  netSalary: number;
  paymentStatus: 'Pending' | 'Paid' | 'Unpaid';
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: 'Pending' | 'Paid' | 'Unpaid';
}

export interface SalarySlipFilters {
  employeeId?: string;
  month?: string;
  paymentStatus?: 'Pending' | 'Paid' | 'Failed';
}
