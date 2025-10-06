import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import TopNavigation from './components/TopNavigation';
import Dashboard from './pages/HRDashboard';
import EmployeeRecords from './pages/HREmployeeRecords';
import AttendanceTracking from './pages/HRAttendanceTracking';
import PayrollManagement from './pages/HRPayrollManagement';
import LeaveManagement from './pages/HRLeaveManagement';
import Reports from './pages/HRReports';

import { Employee, DashboardData } from './types';
import { API_ENDPOINTS } from './config/api';

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshEmployees = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.employees);
      const apiEmployees = res.data;
      const empData: Employee[] = Array.isArray(apiEmployees) ? apiEmployees.map((e: any): Employee => ({
        id: e.id ?? e._id ?? crypto.randomUUID(),
        employeeId: e.employee_id ?? e.employeeId ?? '',
        name: e.name ?? '',
        nic: e.NIC ?? e.nic ?? '',
        role: e.role ?? '',
        department: e.department ?? (e.department === undefined ? '' : e.department),
        status: (e.status ?? 'Active') as Employee['status'],
        joinDate: (e.join_date ? new Date(e.join_date).toISOString().slice(0,10) : ''),
        dateOfBirth: (e.date_of_birth ? new Date(e.date_of_birth).toISOString().slice(0,10) : ''),
        phone: e.phone ?? '',
        email: e.email ?? '',
        address: e.address ?? '',
        salary: Number(e.basic_salary ?? 0),
        bankAccount: '',
        epfEligible: false,
        etfEligible: false,
        attendanceRate: 0,
        gender: e.gender ?? '',
      })) : [];
      setEmployees(empData);
      return empData;
    } catch (error) {
      console.error('Error refreshing employees:', error);
      return [];
    }
  };

  // Generate dashboard data from real employee data
  const generateDashboardData = (employees: Employee[]): DashboardData => {
    const activeEmployees = employees.filter(emp => emp.status === 'Active');
    const resignedEmployees = employees.filter(emp => emp.status === 'Resigned');
    const onLeaveEmployees = employees.filter(emp => emp.status === 'On Leave');
    
    // Calculate new hires this month
    const currentDate = new Date();
    const newHiresThisMonth = employees.filter(emp => {
      if (!emp.joinDate) return false;
      const joinDate = new Date(emp.joinDate);
      return joinDate.getMonth() === currentDate.getMonth() && 
             joinDate.getFullYear() === currentDate.getFullYear();
    }).length;

    // Calculate total payroll expense
    const totalPayroll = activeEmployees.reduce((sum, emp) => sum + emp.salary, 0);

    // Get unique departments
    const departments = [...new Set(employees.map(emp => emp.department).filter(dept => dept))];

    return {
      kpis: {
        totalEmployees: employees.length,
        newHires: newHiresThisMonth,
        resignations: resignedEmployees.length,
        payrollExpense: totalPayroll,
        attendanceRate: 94.5, // This could be calculated from attendance data
      },
      employeeGrowth: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        employeeCounts: [employees.length - 2, employees.length - 1, employees.length, employees.length, employees.length, employees.length, employees.length, employees.length, employees.length, employees.length, employees.length, employees.length],
      },
      attendanceTrend: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        attendanceRates: [92.5, 91.8, 93.2, 94.1, 95.3, 93.8, 92.9, 94.7, 95.1, 94.2, 93.6, 94.8],
      },
      insights: {
        activeEmployees: activeEmployees.length,
        departments: departments.length,
        onLeave: onLeaveEmployees.length,
        newHiresThisWeek: Math.min(newHiresThisMonth, 3), // Estimate
      },
      recentEmployees: employees.slice(0, 6).map(emp => ({
        id: emp.id,
        name: emp.name,
        role: emp.role,
        status: emp.status as 'Active' | 'Resigned' | 'On Leave',
        joinDate: emp.joinDate,
        department: emp.department,
      })),
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fetch real employee data from API
        const empData = await refreshEmployees();
        
        // Generate dashboard data from real employee data
        const dashData = generateDashboardData(empData);
        setDashboardData(dashData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMenuItemClick = (itemId: string) => {
    setActiveMenuItem(itemId);
  };

  const handleEmployeeUpdate = (updatedEmployee: Employee) => {
    setEmployees(prev => 
      prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
    
    // Update dashboard data when employee data changes
    if (dashboardData) {
      const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
      const resignedEmployees = employees.filter(emp => emp.status === 'Resigned').length;
      
      setDashboardData({
        ...dashboardData,
        kpis: {
          ...dashboardData.kpis,
          totalEmployees: employees.length,
          resignations: resignedEmployees,
        },
        insights: {
          ...dashboardData.insights,
          activeEmployees: activeEmployees,
        }
      });
    }
  };

  const handleEmployeeDelete = (deletedEmployeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== deletedEmployeeId));
    
    // Update dashboard data when employee is deleted
    if (dashboardData) {
      const updatedEmployees = employees.filter(emp => emp.id !== deletedEmployeeId);
      const activeEmployees = updatedEmployees.filter(emp => emp.status === 'Active').length;
      const resignedEmployees = updatedEmployees.filter(emp => emp.status === 'Resigned').length;
      
      setDashboardData({
        ...dashboardData,
        kpis: {
          ...dashboardData.kpis,
          totalEmployees: updatedEmployees.length,
          resignations: resignedEmployees,
        },
        insights: {
          ...dashboardData.insights,
          activeEmployees: activeEmployees,
        }
      });
    }
  };

  const handlePayrollUpdate = (totalExpense: number) => {
    // Update dashboard data with new payroll expense
    if (dashboardData) {
      setDashboardData({
        ...dashboardData,
        kpis: {
          ...dashboardData.kpis,
          payrollExpense: totalExpense,
        }
      });
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading HR Management System...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return <Dashboard data={dashboardData} />;
      case 'employees':
        return <EmployeeRecords 
          onEmployeeUpdate={handleEmployeeUpdate} 
          onEmployeeDelete={handleEmployeeDelete}
          onEmployeeCreate={async () => {
            // Refresh the employee list from the backend to get the latest data
            await refreshEmployees();
          }} />;
      case 'attendance':
        return <AttendanceTracking />;
      case 'payroll':
        return <PayrollManagement onPayrollUpdate={handlePayrollUpdate} />;
      case 'leaves':
        return <LeaveManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard data={dashboardData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar 
        activeItem={activeMenuItem} 
        onItemClick={handleMenuItemClick} 
      />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation 
          managerName="Alex Martinez" 
          notificationCount={5} 
        />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;