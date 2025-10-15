import React from 'react';
import { Menu } from 'lucide-react';

interface EmployeeHeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({ onToggleSidebar }) => {

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Menu toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default EmployeeHeader;