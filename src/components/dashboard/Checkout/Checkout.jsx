import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../hooks/useAuth';

const Checkout = ({ user }) => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { createOrder } = useAuth();
  const [placingOrder, setPlacingOrder] = useState(false);

  // Form State
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% mock tax
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + tax + shipping;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Your cart is empty!');
    
    setPlacingOrder(true);
    try {
      await createOrder({
        products: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        shippingAddress: `${address}, ${city} ${zip}`
      });

      toast.success('Payment successful! Order placed.');
      clearCart();
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Secure Checkout</h1>
        <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>Review your items and complete payment.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Form Details & Cart */}
        <div>
          <form id="checkout-form" onSubmit={handleCheckout} className="content-card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>Delivery Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
                <input type="text" value={user?.name || ''} readOnly style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
                <input type="email" value={user?.email || ''} readOnly style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', fontWeight: 500 }}>Street Address</label>
                <input type="text" required value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', fontWeight: 500 }}>City</label>
                <input type="text" required value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', fontWeight: 500 }}>ZIP Code</label>
                <input type="text" required value={zip} onChange={e => setZip(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
            </div>

            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px', marginTop: '30px' }}>Payment Method</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <div style={{ flex: 1, padding: '15px', border: '2px solid #2563eb', borderRadius: '8px', textAlign: 'center', fontWeight: 600, color: '#2563eb', backgroundColor: '#eff6ff', cursor: 'pointer' }}>💳 Credit Card</div>
              <div style={{ flex: 1, padding: '15px', border: '1px solid #d1d5db', borderRadius: '8px', textAlign: 'center', color: '#6b7280', cursor: 'pointer' }}>PayPal</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', fontWeight: 500 }}>Card Number</label>
                <input type="text" required placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', fontWeight: 500 }}>Expiry Date</label>
                <input type="text" required placeholder="MM/YY" value={expiry} onChange={e => setExpiry(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', fontWeight: 500 }}>CVV</label>
                <input type="text" required placeholder="123" value={cvv} onChange={e => setCvv(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
            </div>
          </form>

          <div className="content-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>Shopping Cart</h2>
            {cart.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Your cart is empty.</div>
            ) : (
              cart.map(item => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '60px', height: '60px', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{item.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>${item.price.toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden' }}>
                      <button type="button" onClick={() => updateQuantity(item._id, -1)} style={{ padding: '5px 10px', background: '#f9fafb', border: 'none', borderRight: '1px solid #d1d5db', cursor: 'pointer' }}>-</button>
                      <span style={{ padding: '0 15px', fontSize: '0.875rem' }}>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item._id, 1)} style={{ padding: '5px 10px', background: '#f9fafb', border: 'none', borderLeft: '1px solid #d1d5db', cursor: 'pointer' }}>+</button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="content-card" style={{ position: 'sticky', top: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#4b5563' }}>
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#4b5563' }}>
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#4b5563' }}>
            <span>Estimated Tax</span>
            <span>${tax.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', paddingTop: '15px', borderTop: '1px solid #e5e7eb', fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
            <span>Total</span>
            <span>${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            disabled={placingOrder || cart.length === 0}
            style={{ 
              width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', 
              border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
              opacity: (placingOrder || cart.length === 0) ? 0.7 : 1, transition: 'opacity 0.2s'
            }}
          >
            {placingOrder ? 'Processing...' : `Pay $${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            🔒 Secure encrypted payment
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
