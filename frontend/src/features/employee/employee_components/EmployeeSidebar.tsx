import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Clock, Calendar, X } from 'lucide-react';
import DairyLiciousLogo from '../employee_assest/WhatsApp Image 2025-10-07 at 17.43.54_b4cf94d4.jpg';

interface EmployeeSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({ isOpen, isMobile, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      name: 'Mark Attendance',
      icon: Clock,
      path: '/attendance'
    },
    {
      name: 'Apply for Leave',
      icon: Calendar,
      path: '/leaves'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-sm
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isMobile ? 'shadow-xl' : ''}
      `}>
        {/* Mobile close button */}
        {isMobile && (
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}

        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
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
                Dairy Licious
              </h2>
              <p className="text-gray-500 text-xs mt-1">Employee</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <ul className="space-y-1 px-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                      ${isActive(item.path)
                        ? 'bg-blue-600 text-white border-l-4 border-blue-800 font-medium shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 ${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="text-xs text-gray-400 text-center">
            <p>© 2025 Dairy Factory</p>
            <p>Employee Dashboard v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default EmployeeSidebar;