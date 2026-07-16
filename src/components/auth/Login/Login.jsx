import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../hooks/useAuth';
import SplitLayout from '../../layout/SplitLayout/SplitLayout';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    try {
      const response = await login(data.email, data.password);
      localStorage.setItem('token', response.token);
      navigate('/');
    } catch (err) {
      // Error handled by toaster in useAuth
    }
  };

  return (
    <SplitLayout>
      <div className="form-container">
        <h2>Sign in to your account</h2>
        <p className="subtitle">Welcome back! Please enter your details.</p>
        
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
          
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="remember" {...register('remember')} />
              <label htmlFor="remember" style={{ margin: 0, fontWeight: 400 }}>Remember me</label>
            </div>
            <Link to="/forgot-password" className="link-text">Forgot password?</Link>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          
          <p style={{ marginTop: '20px', fontSize: '0.875rem', textAlign: 'center', color: '#6b7280' }}>
            Don't have an account? <Link to="/signup" className="link-text">Sign up</Link>
          </p>
        </form>
      </div>
    </SplitLayout>
  );
};

export default Login;
