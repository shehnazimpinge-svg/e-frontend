import React, { useState } from 'react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newRegistrations, setNewRegistrations] = useState(true);

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>System Configurations</h1>
        <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>Manage global store preferences, payment gateways, and security.</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Left Sidebar Menu */}
        <div style={{ flex: '0 0 250px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => setActiveTab('general')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'general' ? '#10b981' : '#fff', color: activeTab === 'general' ? '#fff' : '#4b5563', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', boxShadow: activeTab === 'general' ? '0 4px 6px -1px rgba(16, 185, 129, 0.4)' : '0 1px 3px rgba(0,0,0,0.1)' }}>
            ⚙️ General Settings
          </button>
          <button onClick={() => setActiveTab('payments')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'payments' ? '#10b981' : '#fff', color: activeTab === 'payments' ? '#fff' : '#4b5563', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', boxShadow: activeTab === 'payments' ? '0 4px 6px -1px rgba(16, 185, 129, 0.4)' : '0 1px 3px rgba(0,0,0,0.1)' }}>
            💳 Payment Gateways
          </button>
          <button onClick={() => setActiveTab('shipping')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'shipping' ? '#10b981' : '#fff', color: activeTab === 'shipping' ? '#fff' : '#4b5563', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', boxShadow: activeTab === 'shipping' ? '0 4px 6px -1px rgba(16, 185, 129, 0.4)' : '0 1px 3px rgba(0,0,0,0.1)' }}>
            🚚 Shipping & Taxes
          </button>
          <button onClick={() => setActiveTab('security')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'security' ? '#10b981' : '#fff', color: activeTab === 'security' ? '#fff' : '#4b5563', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', boxShadow: activeTab === 'security' ? '0 4px 6px -1px rgba(16, 185, 129, 0.4)' : '0 1px 3px rgba(0,0,0,0.1)' }}>
            🛡️ Security & Access
          </button>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: '1', minWidth: '400px' }}>
          
          {activeTab === 'general' && (
            <div className="content-card" style={{ padding: '30px', animation: 'slideDown 0.3s ease-out' }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#111827' }}>Store Information</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Store Name</label>
                  <input type="text" defaultValue="E-Com Superstore" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Contact Email</label>
                  <input type="email" defaultValue="support@e-com.example" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Store Address (Invoice)</label>
                <textarea rows="3" defaultValue="123 Commerce Blvd, Suite 400, New York, NY 10001" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', resize: 'vertical' }}></textarea>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '30px 0' }} />
              
              <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#111827' }}>System Toggles</h2>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#111827' }}>Maintenance Mode</p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Disables the storefront for non-admins.</p>
                </div>
                <button onClick={() => setMaintenanceMode(!maintenanceMode)} style={{ width: '48px', height: '24px', backgroundColor: maintenanceMode ? '#ef4444' : '#d1d5db', borderRadius: '12px', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background-color 0.3s' }}>
                  <div style={{ position: 'absolute', top: '2px', left: maintenanceMode ? '26px' : '2px', width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', transition: 'all 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#111827' }}>Allow New Registrations</p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Users can create new accounts via the /signup page.</p>
                </div>
                <button onClick={() => setNewRegistrations(!newRegistrations)} style={{ width: '48px', height: '24px', backgroundColor: newRegistrations ? '#10b981' : '#d1d5db', borderRadius: '12px', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background-color 0.3s' }}>
                  <div style={{ position: 'absolute', top: '2px', left: newRegistrations ? '26px' : '2px', width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', transition: 'all 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                </button>
              </div>

              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ backgroundColor: '#111827', color: 'white', border: 'none', borderRadius: '6px', padding: '10px 24px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={e => e.target.style.backgroundColor = '#374151'} onMouseOut={e => e.target.style.backgroundColor = '#111827'}>
                  Save Configuration
                </button>
              </div>
            </div>
          )}

          {activeTab !== 'general' && (
            <div className="content-card" style={{ padding: '40px', textAlign: 'center', animation: 'slideDown 0.3s ease-out' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚧</div>
              <h2 style={{ margin: '0 0 8px 0', color: '#111827' }}>Under Development</h2>
              <p style={{ color: '#6b7280', margin: 0 }}>The {activeTab} settings panel is currently being upgraded.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
