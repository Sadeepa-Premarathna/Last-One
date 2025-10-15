import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  DollarSign, 
  FileText,
  ClipboardList
} from 'lucide-react';
import DairyLiciousLogo from '../assest/WhatsApp Image 2025-10-07 at 17.43.54_b4cf94d4.jpg';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const navigationItems = [
    { id: 'dashboard', name: 'HR Dashboard', icon: LayoutDashboard },
    { id: 'employees', name: 'Employees', icon: Users },
    { id: 'attendance', name: 'Attendance', icon: Clock },
    { id: 'payroll', name: 'Payroll', icon: DollarSign },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'leaves', name: 'Leaves', icon: ClipboardList },
  ];

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
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
            <h2 className="text-lg font-bold text-blue-600 leading-tight">
              Dairy<br />Licious
            </h2>
            <p className="text-gray-500 text-xs mt-1">HR Manager</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 pt-4 px-3">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 mb-1 rounded-lg text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <IconComponent className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-gray-100">
        <p className="text-gray-400 text-xs">Version 2.1.0</p>
      </div>
    </div>
  );
};

export default Sidebar;