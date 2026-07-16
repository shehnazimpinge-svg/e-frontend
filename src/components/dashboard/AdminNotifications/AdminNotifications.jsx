import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../common/Loader/Loader';

const AdminNotifications = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [selectedUser, setSelectedUser] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!selectedUser || !title || !message) {
      return toast.error('Please fill in all fields');
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/notifications`, 
      {
        user: selectedUser,
        title,
        message
      }, 
      {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Notification sent successfully!');
      setTitle('');
      setMessage('');
      setSelectedUser('');
    } catch (err) {
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Create Notification</h1>
        <p style={{ color: '#6b7280', marginTop: '8px' }}>Send direct system notifications to specific users.</p>
      </div>

      <div className="content-card" style={{ maxWidth: '600px' }}>
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSendNotification}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                Select User
              </label>
              <select 
                value={selectedUser} 
                onChange={e => setSelectedUser(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                required
              >
                <option value="">-- Select a User --</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email}) - {u.role.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                Notification Title
              </label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Account Security Alert"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                Message
              </label>
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Enter the notification content here..."
                rows="4"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', resize: 'vertical' }}
                required
              ></textarea>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit" 
                disabled={sending}
                style={{ 
                  backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', 
                  padding: '10px 24px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s',
                  opacity: sending ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <span>🚀</span> {sending ? 'Sending...' : 'Send Notification'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
