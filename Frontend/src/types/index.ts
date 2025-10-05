export interface Employee {
  employee_id: string;
  name: string;
  NIC: string;
  email: string;
  phone: string;
  role: string;
  date_of_birth: string;
  basic_salary: number;
  status: string;
  department: string;
  join_date: string;
  address: string;
  gender: string;
}

export interface AttendanceRecord {
  attendance_id: string;
  employee_id: string;
  month: string;
  working_days: number;
  ot_hours: number;
}

export interface LeaveRecord {
  leave_id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}


export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}