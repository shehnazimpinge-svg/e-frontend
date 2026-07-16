import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../../../hooks/useAuth';

const Home = ({ user }) => {
  const isAdmin = user?.role === 'admin';
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Weekly');
  const { getDashboardStats } = useAuth();

  const [revenueData, setRevenueData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const data = await getDashboardStats(filter);
        setStats(data.data);
        setRevenueData(data.data.revenueData);
        if (data.data.salesData) {
          setSalesData(data.data.salesData);
        }
        if (data.data.orderStatusStats) {
          setOrderStatusData(data.data.orderStatusStats);
        }
      } catch (error) {
        console.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, [filter]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading dashboard...</div>;

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>{isAdmin ? 'Store Overview' : 'My Dashboard'}</h1>
          <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>
            {isAdmin ? 'Monitor your revenue, profit, costs, and sales performance.' : 'Track your recent purchases and cashback.'}
          </p>
        </div>
        <div style={{ display: 'flex', backgroundColor: '#e5e7eb', padding: '4px', borderRadius: '8px', gap: '4px' }}>
          {['Weekly', 'Monthly', 'Yearly'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
                backgroundColor: filter === f ? '#ffffff' : 'transparent',
                color: filter === f ? '#111827' : '#6b7280',
                boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isAdmin ? (
        <>
          {/* ADMIN VIEW */}
          {/* Top Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div className="content-card" style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Revenue ({filter})</p>
              <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#111827' }}>${stats?.admin.revenueToday.toLocaleString()}</h2>
            </div>
            <div className="content-card" style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Product Cost</p>
              <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#ef4444' }}>${stats?.admin.totalCost?.toLocaleString(undefined, {maximumFractionDigits: 0})}</h2>
            </div>
            <div className="content-card" style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Net Profit</p>
              <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#10b981' }}>${stats?.admin.totalProfit?.toLocaleString(undefined, {maximumFractionDigits: 0})}</h2>
            </div>
            <div className="content-card" style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Orders</p>
              <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#3b82f6' }}>{stats?.admin.ordersComplete}</h2>
            </div>
          </div>

          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '30px' }}>
            <div className="content-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#374151' }}>Orders & Revenue Analytics</h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer>
                  <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} 
                      labelFormatter={(label) => `Date: ${label}`}
                      formatter={(value, name) => [
                        `$${Number(value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="profit" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div className="content-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#374151' }}>Top Sales by Category</h3>
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart data={salesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <RechartsTooltip 
                      cursor={{ fill: '#f3f4f6' }} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                      formatter={(value, name) => [
                        `$${Number(value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 
                        'Sales'
                      ]}
                    />
                    <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="content-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#374151' }}>Order Fulfillment Status</h3>
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {orderStatusData.map((entry, index) => {
                        const colors = { 'Delivered': '#10b981', 'Shipped': '#3b82f6', 'Pending': '#fbbf24', 'Cancelled': '#ef4444' };
                        return <Cell key={`cell-${index}`} fill={colors[entry.name] || '#9ca3af'} />;
                      })}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* STANDARD USER VIEW */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div className="content-card" style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Orders</p>
              <h2 style={{ margin: 0, fontSize: '2rem', color: '#111827' }}>{stats?.user.totalOrders}</h2>
            </div>
            
            <div className="content-card" style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Spent</p>
              <h2 style={{ margin: 0, fontSize: '2rem', color: '#111827' }}>${stats?.user.totalSpent.toLocaleString()}</h2>
            </div>

            <div className="content-card" style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Earned Cashback</p>
              <h2 style={{ margin: 0, fontSize: '2rem', color: '#10b981' }}>${stats?.user.totalCashback?.toLocaleString(undefined, {maximumFractionDigits: 0})}</h2>
            </div>

            <div className="content-card" style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Deliveries</p>
              <h2 style={{ margin: 0, fontSize: '2rem', color: '#111827' }}>{stats?.user.pendingDeliveries}</h2>
            </div>
          </div>

          <div className="content-card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#374151' }}>Recent Purchases Analytics</h3>
            <p style={{ color: '#6b7280' }}>Your purchase frequency over the last 6 months.</p>
            <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
              <ResponsiveContainer>
                <BarChart data={revenueData.slice(0, 6)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <RechartsTooltip 
                    cursor={{ fill: '#f3f4f6' }} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value) => [
                      `$${Number(value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 
                      'Spent'
                    ]}
                  />
                  <Bar dataKey="profit" name="Spent ($)" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
