import React, { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar && user.avatar !== 'no-photo.jpg' ? `${(import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '')}${user.avatar}` : null);
  
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    if (file) {
      formData.append('avatar', file);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/updatedetails`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(response.data.data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>My Profile</h1>
      </div>

      <div className="content-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        {/* Small Edit Icon Button */}
        <button 
          onClick={() => setIsEditing(true)} 
          style={{ 
            position: 'absolute', top: '20px', right: '20px', 
            background: '#f3f4f6', border: 'none', borderRadius: '50%', 
            width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 0.2s'
          }}
          title="Edit Profile"
        >
          <span style={{ fontSize: '1.2rem' }}>✏️</span>
        </button>

        <div style={{ 
          width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', 
          backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '3rem', color: 'white', fontWeight: 'bold', marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {user?.avatar && user.avatar !== 'no-photo.jpg' ? (
            <img src={`${(import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '')}${user.avatar}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            user?.name?.charAt(0)?.toUpperCase()
          )}
        </div>
        
        <div>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '1.75rem', color: '#111827' }}>{user?.name}</h2>
          <div style={{ color: '#4b5563', marginBottom: '10px', fontSize: '1.1rem' }}>{user?.email}</div>
          
          {(user?.phone || user?.address) && (
            <div style={{ color: '#4b5563', marginBottom: '15px', fontSize: '0.9rem', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
              {user?.phone && <div style={{ marginBottom: '5px' }}><strong>Phone:</strong> {user.phone}</div>}
              {user?.address && <div><strong>Address:</strong> {user.address}</div>}
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`} style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '20px' }}>
            Member since: {new Date(user?.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="dropdown-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100 }}>
          <div className="content-card" style={{ width: '100%', maxWidth: '600px', margin: '20px', animation: 'slideDown 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>General Information</h2>
              <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>

            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Upload avatar</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#f3f4f6', overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                    {preview ? (
                      <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>?</div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <button type="button" onClick={() => fileInputRef.current.click()} style={{ padding: '8px 16px', backgroundColor: '#111827', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', alignSelf: 'flex-start' }}>Choose file</button>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>JPG, PNG or GIF (MAX. 5MB)</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>First Name / Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    placeholder="+1 555-555-5555"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Address</label>
                  <input 
                    type="text" 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                    placeholder="123 Main St, City, Country"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                <button type="submit" disabled={loading} style={{ 
                  backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', 
                  padding: '10px 24px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s',
                  opacity: loading ? 0.7 : 1
                }}>
                  {loading ? 'Saving changes...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
