import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import OrderList from './components/Order/OrderList';
import DriverList from './components/Driver/DriverList';
import FarmerList from './components/Farmer/FarmerList';
import MilkCollectionList from './components/MilkCollection/MilkCollectionList';
import DeliveryList from './components/Delivery/DeliveryList';
import PaymentList from './components/Payment/PaymentList';

function DeliveryApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/orders" element={<OrderList />} />
      <Route path="/drivers" element={<DriverList />} />
      <Route path="/farmers" element={<FarmerList />} />
      <Route path="/milk-collections" element={<MilkCollectionList />} />
      <Route path="/deliveries" element={<DeliveryList />} />
      <Route path="/payments" element={<PaymentList />} />
    </Routes>
  );
}

export default DeliveryApp;
