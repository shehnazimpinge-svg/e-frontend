import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user }) => {
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/orders', label: 'Orders', icon: '🛒' },
  ];

  if (isAdmin) {
    menuItems.push({ path: '/admin-notifications', label: 'Send Notifications', icon: '📣' });
    menuItems.push({ path: '/admin-settings', label: 'Admin Settings', icon: '⚙️' });
  }

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <span style={{ fontSize: '1.8rem' }}>❖</span> E-Com
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
          Logged in as:
        </div>
        <div style={{ marginTop: '5px', fontWeight: 'bold' }}>
          {user?.name}
        </div>
        <div style={{ marginTop: '5px' }}>
          <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
            {user?.role?.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
