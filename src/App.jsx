import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

import Login from './components/auth/Login/Login';
import Signup from './components/auth/Signup/Signup';
import ForgotPassword from './components/auth/ForgotPassword/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword/ResetPassword';

import DashboardLayout from './components/layout/DashboardLayout/DashboardLayout';
import Home from './components/dashboard/Home/Home';
import Products from './components/dashboard/Products/Products';
import Orders from './components/dashboard/Orders/Orders';
import Notifications from './components/dashboard/Notifications/Notifications';
import Profile from './components/dashboard/Profile/Profile';
import Checkout from './components/dashboard/Checkout/Checkout';
import AdminSettings from './components/dashboard/AdminSettings/AdminSettings';
import AdminNotifications from './components/dashboard/AdminNotifications/AdminNotifications';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Dashboard Routes */}
          <Route path="/" element={<DashboardLayout><Home /></DashboardLayout>} />
          <Route path="/products" element={<DashboardLayout><Products /></DashboardLayout>} />
          <Route path="/orders" element={<DashboardLayout><Orders /></DashboardLayout>} />
          <Route path="/checkout" element={<DashboardLayout><Checkout /></DashboardLayout>} />
          <Route path="/notifications" element={<DashboardLayout><Notifications /></DashboardLayout>} />
          <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
          
          {/* Admin Only Route */}
          <Route path="/admin-settings" element={<DashboardLayout requireAdmin={true}><AdminSettings /></DashboardLayout>} />
          <Route path="/admin-notifications" element={<DashboardLayout requireAdmin={true}><AdminNotifications /></DashboardLayout>} />
          
          {/* Default route redirects to dashboard root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
