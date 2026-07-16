import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  // General unauthenticated request
  const requestAuth = async (method, endpoint, data) => {
    setLoading(true);
    try {
      const response = await axios({
        method,
        url: `${BASE_URL}${endpoint}`,
        data,
      });
      toast.success(response.data.message || 'Operation successful');
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // General Authenticated Request
  const requestApi = async (method, endpoint, data = null) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios({
        method,
        url: `${BASE_URL}${endpoint}`,
        data,
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  // Auth APIs
  const login = (email, password) => requestAuth('POST', '/auth/login', { email, password });
  const registerAuth = (name, email, password, role) => requestAuth('POST', '/auth/register', { name, email, password, role });
  const forgotPassword = (email) => requestAuth('POST', '/auth/forgotpassword', { email });
  const resetPassword = (token, password, confirmPassword) => requestAuth('PUT', `/auth/resetpassword/${token}`, { password, confirmPassword });
  const getMe = () => requestApi('GET', '/auth/me').then(res => res.data);

  // Dashboard API
  const getDashboardStats = (filter) => requestApi('GET', `/dashboard/stats?filter=${filter}`);

  // Product APIs
  const getProducts = (keyword = '', category = 'All') => requestApi('GET', `/products?keyword=${keyword}&category=${category}`);
  const addProduct = (productData) => requestApi('POST', '/products', productData);
  const editProduct = (id, productData) => requestApi('PUT', `/products/${id}`, productData);
  const deleteProduct = (id) => requestApi('DELETE', `/products/${id}`);

  // Order APIs
  const getOrders = () => requestApi('GET', '/orders');
  const createOrder = (orderData) => requestApi('POST', '/orders', orderData);
  const updateOrderStatus = (id, status) => requestApi('PUT', `/orders/${id}/status`, { status });

  return { 
    login, registerAuth, forgotPassword, resetPassword, getMe, loading,
    getDashboardStats, getProducts, addProduct, editProduct, deleteProduct,
    getOrders, createOrder, updateOrderStatus
  };
};
