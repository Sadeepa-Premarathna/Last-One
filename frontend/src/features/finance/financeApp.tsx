import React, { useState } from 'react';
import Sidebar from './finance_components/finance_Sidebar';
import Header from './finance_components/finance_Header';
import Dashboard from './finance_components/finance_Dashboard';
import PayrollDashboard from './finance_components/finance_PayrollDashboard';
import RevenueExpenseTracker from './finance_components/finance_RevenueExpenseTracker';
import AdditionalExpenses from './finance_components/finance_AdditionalExpenses';
import ReportGeneration from './finance_components/finance_ReportGeneration';
import AllowanceManager from './finance_components/finance_AllowanceManager';

function App() {
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavItemClick = (itemId: string) => {
    setActiveNavItem(itemId);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
    // In a real app, this would handle routing to different pages
    console.log(`Navigating to: ${itemId}`);
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
        activeNavItem={activeNavItem}
        onToggleSidebar={toggleSidebar}
      />
      
      <main>
        {activeNavItem === 'dashboard' && <Dashboard />}
        {activeNavItem === 'calculate-salary' && <PayrollDashboard />}
        {activeNavItem === 'allowance-management' && <AllowanceManager />}
        {activeNavItem === 'revenue-expenses' && <RevenueExpenseTracker />}
        {activeNavItem === 'additional-expenses' && <AdditionalExpenses />}
        {activeNavItem === 'report-generation' && <ReportGeneration />}
        {!['dashboard', 'calculate-salary', 'allowance-management', 'revenue-expenses', 'additional-expenses', 'report-generation'].includes(activeNavItem) && (
          <div className="p-6">
            <div className="bg-white rounded-xl p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {activeNavItem.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Module
              </h2>
              <p className="text-gray-600">
                This module will be implemented as part of the complete MERN stack application.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;