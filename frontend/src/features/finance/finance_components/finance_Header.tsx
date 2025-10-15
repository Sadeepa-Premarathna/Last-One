import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  activeNavItem: string;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeNavItem, onToggleSidebar }) => {
  const getPageTitle = () => {
    switch (activeNavItem) {
      case 'dashboard':
        return 'Finance Dashboard';
      case 'additional-expenses':
        return 'Additional Expenses';
      case 'calculate-salary':
        return 'Payroll Calculation';
      case 'allowance-management':
        return 'Allowance Management';
      case 'revenue-expenses':
        return 'Revenue & Expenses';
      case 'report-generation':
        return 'Report Generation';
      default:
        return 'Finance Portal';
    }
  };

  const getPageSubtitle = () => {
    switch (activeNavItem) {
      case 'dashboard':
        return 'Here\'s your financial overview for today';
      case 'additional-expenses':
        return 'Track and manage all additional business expenses';
      case 'calculate-salary':
        return 'Calculate and manage employee salaries and benefits';
      case 'allowance-management':
        return 'Manage employee allowances and benefits';
      case 'revenue-expenses':
        return 'Monitor revenue streams and expense categories';
      case 'report-generation':
        return 'Generate comprehensive financial reports';
      default:
        return 'Welcome to the finance management system';
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-600 hover:text-blue-950 transition-colors rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {getPageTitle()}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {getPageSubtitle()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;