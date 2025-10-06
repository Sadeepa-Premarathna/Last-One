import { ReactNode, useState } from 'react';
import InventorySidebar from './InventorySidebar';
import './InventoryLayout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="layout">
      <InventorySidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
