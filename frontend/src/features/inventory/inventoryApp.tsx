import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InventoryLayout from './Inventorycomponents/InventoryLayout';
import InventoryProducts from './Inventorypages/InventoryProducts';
import InventoryDashboard from './Inventorypages/InventoryDashboard';
import InventoryAIAnalyzer from './Inventorypages/InventoryAIAnalyzer';
import InventoryMobileForm from './Inventorypages/InventoryMobileForm';
import InventoryShop from './Inventorypages/InventoryShop';
import InventoryRawMaterial from './Inventorypages/InventoryRawMaterial';

function App() {
  return (
    <Router>
      <Routes>
        {/* Mobile form route without layout */}
        <Route path="/add-product-mobile" element={<InventoryMobileForm />} />
        
        {/* Desktop routes with layout */}
        <Route path="*" element={
          <InventoryLayout>
            <Routes>
              <Route path="/" element={<InventoryDashboard />} />
              <Route path="/products" element={<InventoryProducts />} />
              <Route path="/raw-material" element={<InventoryRawMaterial />} />
              <Route path="/shop" element={<InventoryShop />} />
              <Route path="/ai-analyzer" element={<InventoryAIAnalyzer />} />
            </Routes>
          </InventoryLayout>
        } />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}

export default App;
