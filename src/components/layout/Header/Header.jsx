import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNotifications } from '../../../hooks/useNotifications';
import { useCart } from '../../../context/CartContext';

const Header = ({ user }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  
  const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotifications();
  const { cartCount } = useCart();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const closeMenus = () => {
    setShowProfileMenu(false);
    setShowNotifMenu(false);
  };

  const handleNotifClick = (id) => {
    markAsRead(id);
  };

  const displayNotifications = notifications.slice(0, 5);

  return (
    <header className="header">
      <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#374151' }}>
        Welcome back, {user?.name}!
      </div>
      
      <div className="header-actions">
        {/* Cart Icon */}
        <Link to="/checkout" className="bell-icon-container" style={{ textDecoration: 'none', color: 'inherit', marginRight: '10px' }}>
          <span className="bell-icon">🛒</span>
          {cartCount > 0 && (
            <div className="notification-badge" style={{ backgroundColor: '#2563eb' }}>{cartCount}</div>
          )}
        </Link>

        {/* Notification Bell */}
        <div className="bell-icon-container" onClick={() => { setShowNotifMenu(!showNotifMenu); setShowProfileMenu(false); }}>
          <span className="bell-icon">🔔</span>
          {unreadCount > 0 && (
            <div className="notification-badge">{unreadCount}</div>
          )}
        </div>

        {/* User Avatar */}
        <div className="avatar" onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifMenu(false); }} style={{ overflow: 'hidden' }}>
          {user?.avatar && user.avatar !== 'no-photo.jpg' ? (
            <img 
              src={`http://localhost:3000${user.avatar}`} 
              alt="Avatar" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            user?.name?.charAt(0)?.toUpperCase()
          )}
        </div>
      </div>

      {/* Modals & Overlays */}
      {(showProfileMenu || showNotifMenu) && (
        <div className="dropdown-overlay" onClick={closeMenus}></div>
      )}

      {/* Profile Menu */}
      {showProfileMenu && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <div>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 400 }}>{user?.email}</div>
          </div>
          <Link to="/profile" className="dropdown-item" onClick={closeMenus} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>👤</span> Profile
          </Link>
          <div className="dropdown-item" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444' }}>
            <span>🚪</span> Logout
          </div>
        </div>
      )}

      {/* Notifications Menu */}
      {showNotifMenu && (
        <div className="dropdown-menu notifications-menu">
          <div className="dropdown-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Notifications</span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>{unreadCount} new</span>
          </div>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {displayNotifications.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                No notifications
              </div>
            ) : (
              displayNotifications.map(notif => (
                <div 
                  key={notif._id} 
                  className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotifClick(notif._id)}
                >
                  <div className="notification-title">{notif.title}</div>
                  <div className="notification-time" style={{ color: !notif.isRead ? '#2563eb' : '#6b7280' }}>
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div style={{ borderTop: '1px solid #f3f4f6' }}>
            <Link to="/notifications" className="dropdown-item text-center" onClick={closeMenus}>
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
