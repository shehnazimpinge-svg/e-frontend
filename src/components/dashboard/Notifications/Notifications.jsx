import React, { useEffect } from 'react';
import { useNotifications } from '../../../hooks/useNotifications';
import Loader from '../../common/Loader/Loader';

const Notifications = () => {
  const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>All Notifications</h1>
        <button 
          onClick={markAllAsRead} 
          className="btn-primary" 
          style={{ width: 'auto', padding: '8px 16px', backgroundColor: '#4b5563' }}
        >
          Mark all as read
        </button>
      </div>

      <div className="content-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <Loader />
        ) : notifications.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>You have no notifications.</div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif._id} 
              className={`notification-page-item ${!notif.isRead ? 'unread' : ''}`}
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              style={{ cursor: !notif.isRead ? 'pointer' : 'default' }}
            >
              <div className="notification-meta">
                <span className="notification-title">{notif.title}</span>
                <span className="notification-time">{formatDate(notif.createdAt)}</span>
              </div>
              <div className="notification-message">{notif.message}</div>
              {!notif.isRead && (
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
                  Click to mark as read
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
