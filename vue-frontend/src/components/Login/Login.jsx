import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // or use Login.module.css if you prefer CSS Modules

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Temporary mock login function
  const signInWithProvider = async (provider) => {
    setIsLoading(true);
    console.log(`Signing in with ${provider}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    localStorage.setItem('user', JSON.stringify({
      id: 'mock-user-123',
      email: 'user@example.com',
      name: 'Demo User',
      provider: provider
    }));
    
    setIsLoading(false);
    
    // Navigate to home page
    navigate('/ua');
    
    // Show success message
    alert(`Successfully logged in with ${provider}! (This is a demo - no real authentication)`);
  };

  return (
    <div className="login-view">
      <h1>Welcome Back</h1>
      <p>Please sign in to continue.</p>

      <div className="login-buttons">
        <button
          onClick={() => signInWithProvider('google')}
          className="login-button google"
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1 }}
        >
          <img
            src="/Login/google-login-icon.svg"
            alt="Google Icon"
          />
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <button
          onClick={() => signInWithProvider('apple')}
          className="login-button apple"
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1 }}
        >
          <img
            src="/Login/apple-login-icon.svg"
            alt="Apple Icon"
          />
          {isLoading ? 'Signing in...' : 'Continue with Apple'}
        </button>
      </div>

      <p className="terms">
        By continuing, you agree to our{' '}
        <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </p>
    </div>
  );
}
