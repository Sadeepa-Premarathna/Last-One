import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/finance_Sidebar';
import Header from './components/finance_Header';
import Dashboard from './components/finance_Dashboard';
import PayrollDashboard from './components/finance_PayrollDashboard';
import RevenueExpenseTracker from './components/finance_RevenueExpenseTracker';
import AdditionalExpenses from './components/finance_AdditionalExpenses';
import ReportGeneration from './components/finance_ReportGeneration';
import AllowanceManager from './components/finance_AllowanceManager';

function FinanceApp() {
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const financeManagerName = 'Finance Manager';

  const handleNavItemClick = (itemId: string) => {
    setActiveNavItem(itemId);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar 
        activeItem={activeNavItem} 
        onItemClick={handleNavItemClick}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      
      <Header 
        userName={financeManagerName} 
        onToggleSidebar={toggleSidebar}
      />
      
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/payroll" element={<PayrollDashboard />} />
          <Route path="/allowances" element={<AllowanceManager />} />
          <Route path="/revenue-expenses" element={<RevenueExpenseTracker />} />
          <Route path="/additional-expenses" element={<AdditionalExpenses />} />
          <Route path="/reports" element={<ReportGeneration />} />
        </Routes>
      </main>
    </div>
  );
}

export default FinanceApp;
