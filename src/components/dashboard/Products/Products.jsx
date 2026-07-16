import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../hooks/useAuth';

const Products = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';
  const { getProducts, addProduct, editProduct, deleteProduct } = useAuth();
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', stock: '', image: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, searchCategory]); // Re-fetch on search/filter changes

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts(searchTerm, searchCategory);
      setProducts(response.data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('Product added to cart!');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted successfully');
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        image: formData.image || 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg'
      };

      if (editProductId) {
        // Edit mode
        const response = await editProduct(editProductId, payload);
        setProducts(products.map(p => p._id === editProductId ? response.data : p));
        toast.success('Product updated successfully!');
      } else {
        // Add mode
        const response = await addProduct(payload);
        setProducts([response.data, ...products]);
        toast.success('Product added successfully!');
      }
      
      handleCloseModal();
    } catch (err) {
      toast.error(`Failed to ${editProductId ? 'update' : 'add'} product`);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (product) => {
    setEditProductId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditProductId(null);
    setFormData({ name: '', description: '', price: '', category: '', stock: '', image: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Products</h1>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, maxWidth: '600px', justifyContent: 'flex-end' }}>
          <input 
            type="text" 
            placeholder="🔍 Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', width: '250px' }}
          />
          <select 
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', backgroundColor: 'white', cursor: 'pointer' }}
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home</option>
            <option value="Sports">Sports</option>
          </select>

          {isAdmin && (
            <button 
              onClick={() => { setEditProductId(null); setShowAddModal(true); }}
              style={{ backgroundColor: '#111827', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              + Add New Product
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading products...</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '24px' 
        }}>
          {products.map(product => (
            <div key={product._id} className="content-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              
              {/* Product Image */}
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '10px' }}>
                <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              </div>

              {/* Product Details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>Up to 15% off!</span>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditModal(product)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }} title="Edit Product">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(product._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Delete Product">
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
                
                <h3 style={{ margin: '12px 0 8px 0', fontSize: '1.1rem', color: '#111827', fontWeight: 600, lineHeight: 1.4 }}>
                  {product.name}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px' }}>
                  <span style={{ color: '#fbbf24' }}>⭐⭐⭐⭐⭐</span>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>5.0 (455)</span>
                </div>
              </div>

              {/* Price & Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
                  ${product.price.toLocaleString()}
                </span>
                {!isAdmin && (
                  product.stock > 0 ? (
                    <button 
                      onClick={() => handleAddToCart(product)}
                      style={{ 
                        backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', 
                        padding: '8px 16px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      <span>🛒</span> Add to cart
                    </button>
                  ) : (
                    <button 
                      disabled
                      style={{ 
                        backgroundColor: '#e5e7eb', color: '#9ca3af', border: 'none', borderRadius: '6px', 
                        padding: '8px 16px', fontWeight: 600, cursor: 'not-allowed'
                      }}
                    >
                      Out of Stock
                    </button>
                  )
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <>
          <div className="dropdown-overlay" onClick={handleCloseModal}></div>
          <div className="modal" style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            backgroundColor: 'white', padding: '30px', borderRadius: '12px', zIndex: 1000,
            width: '90%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', color: '#111827' }}>
              {editProductId ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleAddProduct}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', fontWeight: 500 }}>Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', fontWeight: 500 }}>Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', fontWeight: 500 }}>Price ($)</label>
                  <input required type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', fontWeight: 500 }}>Stock Quantity</label>
                  <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', fontWeight: 500 }}>Category</label>
                <select 
                  required 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white' }}
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home">Home</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', fontWeight: 500 }}>Image URL (Optional)</label>
                <input type="text" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="button" onClick={handleCloseModal} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#10b981', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                  {submitting ? 'Saving...' : (editProductId ? 'Save Changes' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
