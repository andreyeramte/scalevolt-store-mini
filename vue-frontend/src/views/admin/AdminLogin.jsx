import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import './AdminLogin.css';

const AdminLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Try Firebase authentication first
      if (auth) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Admin login successful via Firebase');
      } else {
        // Fallback to simple admin check
        if (email === 'admin@scalevolt.com' && password === 'admin123') {
          console.log('✅ Admin login successful via fallback');
          // Store admin session
          localStorage.setItem('adminSession', 'true');
          localStorage.setItem('adminEmail', email);
        } else {
          throw new Error('Invalid credentials');
        }
      }

      // Redirect to admin dashboard
      const from = location.state?.from || '/admin';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('❌ Admin login failed:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <h1>ScaleVolt Admin</h1>
          <p>Sign in to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@scalevolt.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>Default credentials: admin@scalevolt.com / admin123</p>
          <p>Make sure Firebase is configured for production use</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 