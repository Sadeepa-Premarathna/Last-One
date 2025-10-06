import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard.tsx';
import AIAnalyzerPage from './pages/AIAnalyzerPage';
import MobileProductForm from './pages/MobileProductForm';
import Shop from './pages/Shop';
import RawMaterial from './pages/RawMaterial';

function App() {
  return (
    <Router>
      <Routes>
        {/* Mobile form route without layout */}
        <Route path="/add-product-mobile" element={<MobileProductForm />} />
        
        {/* Desktop routes with layout */}
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/raw-material" element={<RawMaterial />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/ai-analyzer" element={<AIAnalyzerPage />} />
            </Routes>
          </Layout>
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
