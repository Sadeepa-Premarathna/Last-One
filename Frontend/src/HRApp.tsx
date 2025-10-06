import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HRDashboard from './pages/HRDashboard';
import HREmployeeRecords from './pages/HREmployeeRecords';
import HRAttendanceTracking from './pages/HRAttendanceTracking';
import HRLeaveManagement from './pages/HRLeaveManagement';
import HRPayrollManagement from './pages/HRPayrollManagement';
import HRReports from './pages/HRReports';

function HRApp() {
  return (
    <Routes>
      <Route path="/" element={<HRDashboard />} />
      <Route path="/employees" element={<HREmployeeRecords />} />
      <Route path="/attendance" element={<HRAttendanceTracking />} />
      <Route path="/leaves" element={<HRLeaveManagement />} />
      <Route path="/payroll" element={<HRPayrollManagement />} />
      <Route path="/reports" element={<HRReports />} />
    </Routes>
  );
}

export default HRApp;
