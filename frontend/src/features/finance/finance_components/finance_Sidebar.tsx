import React from 'react';
import { BarChart3, Plus, Calculator, TrendingUp, FileText, X, CreditCard } from 'lucide-react';
import { NavigationItem } from '../finance_types';
import DairyLiciousLogo from '../finance_assets/DairyLiciousLogo.jpg';

interface SidebarProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick, isOpen, onClose }) => {
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Finance Dashboard',
      path: '/finance/dashboard'
    },
    {
      id: 'additional-expenses',
      label: 'Additional Expenses',
      path: '/finance/additional-expenses'
    },
    {
      id: 'calculate-salary',
      label: 'Calculate Salary',
      path: '/finance/calculate-salary'
    },
    {
      id: 'allowance-management',
      label: 'Allowance Management',
      path: '/finance/allowance-management'
    },
    {
      id: 'revenue-expenses',
      label: 'Revenue & Expenses',
      path: '/finance/revenue-expenses'
    },
    {
      id: 'report-generation',
      label: 'Report Generation',
      path: '/finance/reports'
    }
  ];

  const getIcon = (itemId: string) => {
    switch (itemId) {
      case 'dashboard':
        return <BarChart3 size={20} />;
      case 'additional-expenses':
        return <Plus size={20} />;
      case 'calculate-salary':
        return <Calculator size={20} />;
      case 'allowance-management':
        return <CreditCard size={20} />;
      case 'revenue-expenses':
        return <TrendingUp size={20} />;
      case 'report-generation':
        return <FileText size={20} />;
      default:
        return <BarChart3 size={20} />;
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`bg-white text-gray-700 h-screen w-64 fixed left-0 top-0 z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Close button for mobile */}
        <div className="flex justify-end p-4 lg:hidden">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Header Section - Matching the image design */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* Logo and Text Section */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="w-12 h-12 flex-shrink-0">
                <img 
                  src={DairyLiciousLogo} 
                  alt="Dairy Licious Logo" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              
              {/* Text Section */}
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-blue-600  leading-tight">
                  Dairy<br />Licious
                </h2>
                <p className="text-gray-500 text-xs mt-1">Finance Manager</p>
              </div>
            </div>
            
            
            
          </div>
        </div>
      
        <nav className="mt-6">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-all duration-200 hover:bg-blue-50 ${
                activeItem === item.id 
                  ? 'bg-blue-600 text-white font-medium' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <span className={activeItem === item.id ? 'text-white' : ''}>
                {getIcon(item.id)}
              </span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
