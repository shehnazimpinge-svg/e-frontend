import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../hooks/useAuth';
import SplitLayout from '../../layout/SplitLayout/SplitLayout';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuth();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onChange' });
  
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await resetPassword(token, data.password, data.confirmPassword);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {}
  };

  return (
    <SplitLayout>
      <div className="form-container">
        <h2>Reset your password</h2>
        <p className="subtitle">Your new password must be different from previous used passwords.</p>
        
        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="form-group">
            <label>New Password</label>
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
          
          <div className="form-group">
            <label>Confirm password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              {...register('confirmPassword', { 
                required: 'Confirm password is required',
                validate: value => value === password || 'Passwords do not match'
              })}
              style={{ borderColor: errors.confirmPassword ? '#ef4444' : '' }}
            />
            {errors.confirmPassword && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.confirmPassword.message}</span>}
          </div>
          

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      </div>
    </SplitLayout>
  );
};

export default ResetPassword;
