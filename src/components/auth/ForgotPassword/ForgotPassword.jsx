import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../hooks/useAuth';
import SplitLayout from '../../layout/SplitLayout/SplitLayout';

const ForgotPassword = () => {
  const { forgotPassword, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
    } catch (err) {}
  };

  return (
    <SplitLayout>
      <div className="form-container">
        <h2>Forgot your password?</h2>
        <p className="subtitle">
          Don't fret! Just type in your email and we will send you a code to reset your password!
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)}>
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
            {loading ? 'Sending email...' : 'Reset password'}
          </button>

          <p style={{ marginTop: '20px', fontSize: '0.875rem', textAlign: 'center', color: '#6b7280' }}>
            Remember your password? <Link to="/login" className="link-text">Sign in</Link>
          </p>
        </form>
      </div>
    </SplitLayout>
  );
};

export default ForgotPassword;
