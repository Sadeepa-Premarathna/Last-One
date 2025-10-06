// Shared type definitions for the HR Management application

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  nic?: string;
  role: string;
  department: string;
  status: 'Active' | 'Resigned' | 'On Leave' | 'On Probation';
  joinDate: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  salary: number;
  bankAccount: string;
  epfEligible: boolean;
  etfEligible: boolean;
  attendanceRate: number;
  gender?: 'Male' | 'Female' | 'Other' | '';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD format
  clockIn: string | null; // HH:MM format
  clockOut: string | null; // HH:MM format
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
  hoursWorked?: number;
  correctionReason?: string;
  correctedBy?: string;
  correctedAt?: string;
  requiresApproval?: boolean;
  uploadedBy?: string;
  uploadedAt?: string;
}

export interface DashboardData {
  kpis: {
    totalEmployees: number;
    newHires: number;
    resignations: number;
    payrollExpense: number;
    attendanceRate: number;
  };
  employeeGrowth: {
    months: string[];
    employeeCounts: number[];
  };
  attendanceTrend: {
    months: string[];
    attendanceRates: number[];
  };
  insights: {
    activeEmployees: number;
    departments: number;
    onLeave: number;
    newHiresThisWeek: number;
  };
  recentEmployees: Array<{
    id: string;
    name: string;
    role: string;
    status: 'Active' | 'Resigned' | 'On Leave';
    joinDate: string;
    department: string;
  }>;
}