import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import { useAuth } from '../../../hooks/useAuth';
import Loader from '../../common/Loader/Loader';
import '../../../Dashboard.css';

const DashboardLayout = ({ children, requireAdmin }) => {
  const { getMe } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const userData = await getMe();
        if (requireAdmin && userData.role !== 'admin') {
          navigate('/'); // Redirect non-admins away
        } else {
          setUser(userData);
        }
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate, requireAdmin]);

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><Loader /></div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar user={user} />
      <main className="dashboard-main">
        <Header user={user} />
        <div className="dashboard-content">
          {React.cloneElement(children, { user, setUser })}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
