import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InventoryLayout from './components/InventoryLayout';
import InventoryProducts from './pages/InventoryProducts';
import InventoryDashboard from './pages/InventoryDashboard';
import InventoryAIAnalyzer from './pages/InventoryAIAnalyzer';
import InventoryMobileForm from './pages/InventoryMobileForm';
import InventoryShop from './pages/InventoryShop';
import InventoryRawMaterial from './pages/InventoryRawMaterial';

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
