import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import Loader from '../../common/Loader/Loader';

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';
  const { getOrders, updateOrderStatus } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated!');
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return { bg: '#dcfce7', text: '#166534' };
      case 'Shipped': return { bg: '#dbeafe', text: '#1e40af' };
      case 'Processing': return { bg: '#fef3c7', text: '#92400e' };
      case 'Cancelled': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>{isAdmin ? 'All User Orders' : 'My Orders'}</h1>
          <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>Track, manage, and view your order history.</p>
        </div>
      </div>

      <div className="content-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No orders found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Product</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Order ID</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Date</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Price</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Status</th>
                  {isAdmin && <th style={{ padding: '16px 24px', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const statusStyle = getStatusColor(order.status);
                  const firstProduct = order.products[0]?.product;
                  
                  return (
                    <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            📦
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, color: '#111827' }}>
                              {firstProduct ? firstProduct.name : 'Unknown Product'}
                            </div>
                            {order.products.length > 1 && (
                              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>+ {order.products.length - 1} more items</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#4b5563', fontSize: '0.875rem' }}>
                        #{order._id.substring(0, 8).toUpperCase()}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#4b5563', fontSize: '0.875rem' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: 500, color: '#111827' }}>
                        ${order.totalAmount.toLocaleString()}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                          backgroundColor: statusStyle.bg, color: statusStyle.text, 
                          padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 
                        }}>
                          {order.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td style={{ padding: '16px 24px' }}>
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
