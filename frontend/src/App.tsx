import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Landing Page
import AdminLanding from './pages/AdminLanding';

// Inventory Module
import InventoryApp from './InventoryApp';

// HR Module
import HRApp from './HRApp';

// Finance Module
import FinanceApp from './FinanceApp';

// Delivery Module
import DeliveryApp from './DeliveryApp';

// Online Shop Module
import ShopApp from './ShopApp';

// Order Management Module
import OrderList from './components/Order/OrderList';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          {/* Admin Landing Page */}
          <Route path="/" element={<AdminLanding />} />

          {/* Inventory Module Routes */}
          <Route path="/inventory/*" element={<InventoryApp />} />

          {/* HR Module Routes */}
          <Route path="/hr/*" element={<HRApp />} />

          {/* Finance Module Routes */}
          <Route path="/finance/*" element={<FinanceApp />} />

          {/* Delivery Module Routes */}
          <Route path="/delivery/*" element={<DeliveryApp />} />

          {/* Order Management */}
          <Route path="/orders" element={<OrderList />} />

          {/* Online Shop Module Routes */}
          <Route path="/shop/*" element={<ShopApp />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;