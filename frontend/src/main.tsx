import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

// Import feature-specific CSS
import './features/finance/financeindex.css';
import './features/hr/hrindex.css';
import './features/inventory/inventoryStyles.css';
import './features/delivery/deliveryApp.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
