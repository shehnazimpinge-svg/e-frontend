import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../hooks/useAuth';
import SplitLayout from '../../layout/SplitLayout/SplitLayout';

const Signup = () => {
  const navigate = useNavigate();
  const { registerAuth, register: legacyRegisterAuth, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' });
  const createAccount = registerAuth || legacyRegisterAuth;

  const onSubmit = async (data) => {
    try {
      if (typeof createAccount !== 'function') {
        throw new Error('Signup API is not available');
      }

      await createAccount(data.name, data.email, data.password);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // Error handled by toaster in useAuth
    }
  };

  return (
    <SplitLayout>
      <div className="form-container">
        <h2>Create an account</h2>
        <p className="subtitle">Start your 30-day free trial.</p>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              {...register('name', { required: 'Name is required' })}
              style={{ borderColor: errors.name ? '#ef4444' : '' }}
            />
            {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
              })}
              style={{ borderColor: errors.email ? '#ef4444' : '' }}
            />
            {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.email.message}</span>}
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              style={{ borderColor: errors.password ? '#ef4444' : '' }}
            />
            {errors.password && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.password.message}</span>}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '0.875rem' }}>
            <input 
              type="checkbox" 
              id="terms" 
              {...register('terms', { required: 'You must agree to the terms' })}
            />
            <label htmlFor="terms">
              I agree to Flowbite's <a href="#" className="link-text">Terms of Use</a> and <a href="#" className="link-text">Privacy Policy</a>.
            </label>
          </div>
          {errors.terms && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '-15px', marginBottom: '15px', display: 'block' }}>{errors.terms.message}</span>}
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
          
          <p style={{ marginTop: '20px', fontSize: '0.875rem', textAlign: 'center', color: '#6b7280' }}>
            Already have an account? <Link to="/login" className="link-text">Sign in</Link>
          </p>
        </form>
      </div>
    </SplitLayout>
  );
};

export default Signup;
