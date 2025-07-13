import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';
import useAuthStore from '../../stores/auth';

const CheckoutAuthView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const auth = getAuth();
  
  // Zustand store
  const { user, loading, error, login, register, clearError } = useAuthStore();
  
  // Local state
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAlreadyAuthenticated, setIsAlreadyAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [cartItems, setCartItems] = useState([]);
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    remember: false
  });
  
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  // Load cart items
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(savedCart);
  }, []);

  // Check Firebase auth status on mount
  useEffect(() => {
    checkFirebaseAuth();
  }, []);

  // Cart calculations
  const totalQuantity = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  // Check if register form is valid
  const isFormValid = useMemo(() => {
    return registerForm.password === registerForm.confirmPassword &&
           registerForm.password.length >= 6 &&
           registerForm.acceptTerms;
  }, [registerForm]);

  const formatPrice = (price) => {
    return price.toLocaleString('en-US');
  };

  const getRedirectPath = () => {
    const redirectPath = searchParams.get('redirect') || localStorage.getItem('checkoutRedirect') || '/checkout';
    localStorage.removeItem('checkoutRedirect');
    return redirectPath;
  };

  const checkFirebaseAuth = () => {
    setTimeout(() => {
      if (auth.currentUser) {
        console.log('User already authenticated with Firebase', auth.currentUser);
        setIsAlreadyAuthenticated(true);
        
        // Auto-redirect to checkout after a short delay
        setTimeout(() => {
          continueToCheckout();
        }, 1500);
      } else {
        console.log('User not authenticated with Firebase');
        setIsAlreadyAuthenticated(false);
      }
      setCheckingAuth(false);
    }, 1000);
  };

  const continueToCheckout = () => {
    navigate(getRedirectPath());
  };

  const handleLoginFormChange = (field, value) => {
    setLoginForm(prev => ({
      ...prev,
      [field]: value
    }));
    clearError();
  };

  const handleRegisterFormChange = (field, value) => {
    setRegisterForm(prev => ({
      ...prev,
      [field]: value
    }));
    clearError();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const success = await login(loginForm.email, loginForm.password);
    
    if (success) {
      toast.success(t('auth.loginSuccess', 'Login successful'));
      navigate(getRedirectPath());
    } else {
      toast.error(error || t('auth.loginFailed', 'Login failed'));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error(t('auth.passwordsMustMatch', 'Passwords must match'));
      return;
    }
    
    const userData = {
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      email: registerForm.email,
      phone: registerForm.phone,
      password: registerForm.password
    };
    
    const success = await register(userData);
    
    if (success) {
      toast.success(t('auth.registerSuccess', 'Registration successful'));
      navigate(getRedirectPath());
    } else {
      toast.error(error || t('auth.registerFailed', 'Registration failed'));
    }
  };

  return (
    <div className="checkout-auth-view">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{t('checkout.authenticateToCheckout', 'Sign in to Complete Your Order')}</h1>
          <p className="auth-subtitle">
            {t('checkout.authenticateDescription', 'Please sign in or create an account to proceed with checkout')}
          </p>
        </div>

        {/* Check if already authenticated with Firebase */}
        {checkingAuth ? (
          <div className="auth-checking">
            <div className="loading-spinner"></div>
            <p>{t('auth.checking', 'Checking authentication...')}</p>
          </div>
        ) : isAlreadyAuthenticated ? (
          /* If already authenticated with Firebase - No need to login again */
          <div className="already-authenticated">
            <div className="success-icon">
              <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                <circle cx="26" cy="26" r="25" fill="#52c41a" />
                <path d="M14,27.5 L21,34.5 L38,17.5" stroke="white" strokeWidth="4" fill="none" />
              </svg>
            </div>
            <h2>{t('auth.alreadyLoggedIn', 'Already Logged In')}</h2>
            <p>{t('auth.redirectingToCheckout', 'Redirecting to checkout...')}</p>
            <button onClick={continueToCheckout} className="continue-button">
              {t('auth.continueToCheckout', 'Continue to Checkout')}
            </button>
          </div>
        ) : (
          /* If not authenticated with Firebase - Show login form */
          <div>
            {/* Tabs for Login/Register */}
            <div className="auth-tabs">
              <button 
                onClick={() => setActiveTab('login')}
                className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
              >
                {t('common.login', 'Sign In')}
              </button>
              <button 
                onClick={() => setActiveTab('register')}
                className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
              >
                {t('common.register', 'Create Account')}
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <div className="auth-form-container">
                <form onSubmit={handleLogin} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="login-email">{t('auth.email', 'Email')}</label>
                    <input 
                      type="email" 
                      id="login-email" 
                      value={loginForm.email}
                      onChange={(e) => handleLoginFormChange('email', e.target.value)}
                      required 
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="login-password">{t('auth.password', 'Password')}</label>
                    <input 
                      type="password" 
                      id="login-password" 
                      value={loginForm.password}
                      onChange={(e) => handleLoginFormChange('password', e.target.value)}
                      required 
                      autoComplete="current-password"
                    />
                  </div>
                  
                  <div className="form-footer">
                    <div className="remember-me">
                      <input 
                        type="checkbox" 
                        id="remember" 
                        checked={loginForm.remember}
                        onChange={(e) => handleLoginFormChange('remember', e.target.checked)}
                      />
                      <label htmlFor="remember">{t('auth.rememberMe', 'Remember me')}</label>
                    </div>
                    <a href="#" className="forgot-password">
                      {t('auth.forgotPassword', 'Forgot password?')}
                    </a>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-button" 
                    disabled={loading}
                  >
                    {loading ? t('common.loading', 'Loading...') : t('common.login', 'Sign In')}
                  </button>
                </form>
              </div>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <div className="auth-form-container">
                <form onSubmit={handleRegister} className="auth-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="register-firstname">{t('auth.firstName', 'First Name')}</label>
                      <input 
                        type="text" 
                        id="register-firstname" 
                        value={registerForm.firstName}
                        onChange={(e) => handleRegisterFormChange('firstName', e.target.value)}
                        required 
                        autoComplete="given-name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="register-lastname">{t('auth.lastName', 'Last Name')}</label>
                      <input 
                        type="text" 
                        id="register-lastname" 
                        value={registerForm.lastName}
                        onChange={(e) => handleRegisterFormChange('lastName', e.target.value)}
                        required 
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="register-email">{t('auth.email', 'Email')}</label>
                    <input 
                      type="email" 
                      id="register-email" 
                      value={registerForm.email}
                      onChange={(e) => handleRegisterFormChange('email', e.target.value)}
                      required 
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="register-phone">{t('auth.phone', 'Phone Number')}</label>
                    <input 
                      type="tel" 
                      id="register-phone" 
                      value={registerForm.phone}
                      onChange={(e) => handleRegisterFormChange('phone', e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="register-password">{t('auth.password', 'Password')}</label>
                      <input 
                        type="password" 
                        id="register-password" 
                        value={registerForm.password}
                        onChange={(e) => handleRegisterFormChange('password', e.target.value)}
                        required 
                        autoComplete="new-password"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="register-confirm-password">
                        {t('auth.confirmPassword', 'Confirm Password')}
                      </label>
                      <input 
                        type="password" 
                        id="register-confirm-password" 
                        value={registerForm.confirmPassword}
                        onChange={(e) => handleRegisterFormChange('confirmPassword', e.target.value)}
                        required 
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  
                  <div className="form-checkbox">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      checked={registerForm.acceptTerms}
                      onChange={(e) => handleRegisterFormChange('acceptTerms', e.target.checked)}
                      required 
                    />
                    <label htmlFor="terms">
                      {t('auth.acceptTerms', 'I accept the')} 
                      <a href="/terms" target="_blank">{t('auth.termsLink', 'Terms of Service')}</a>
                    </label>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-button" 
                    disabled={loading || !isFormValid}
                  >
                    {loading ? t('common.loading', 'Loading...') : t('common.register', 'Create Account')}
                  </button>
                </form>
              </div>
            )}

            {/* Error message display */}
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Order summary cart preview */}
        <div className="auth-cart-summary">
          <h3>{t('cart.orderSummary', 'Order Summary')}</h3>
          <div className="summary-item">
            <span>{t('cart.items', 'Items')}:</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="summary-total">
            <span>{t('cart.total', 'Total')}:</span>
            <span>{formatPrice(totalPrice)} грн</span>
          </div>
          <Link to="/cart" className="view-cart-link">
            {t('checkout.viewCart', 'View Cart')}
          </Link>
        </div>
      </div>

      <style jsx>{`
        .checkout-auth-view {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Inter', sans-serif;
        }

        .auth-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .auth-header {
          grid-column: 1 / -1;
          padding: 30px;
          background-color: #f9f9f9;
          text-align: center;
        }

        .auth-header h1 {
          margin: 0 0 10px;
          font-size: 1.8rem;
          color: #333;
        }

        .auth-subtitle {
          color: #666;
          margin: 0;
        }

        .auth-checking {
          grid-column: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 50px 0;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #52c41a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .already-authenticated {
          grid-column: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }

        .success-icon {
          width: 60px;
          height: 60px;
          margin-bottom: 20px;
        }

        .already-authenticated h2 {
          margin-top: 0;
          color: #52c41a;
        }

        .continue-button {
          margin-top: 20px;
          padding: 12px 24px;
          background-color: #52c41a;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .continue-button:hover {
          background-color: #46b314;
        }

        .auth-tabs {
          grid-column: 1;
          display: flex;
          border-bottom: 1px solid #eee;
          margin-bottom: 20px;
        }

        .tab-button {
          flex: 1;
          padding: 15px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          color: #666;
          transition: all 0.2s ease;
        }

        .tab-button.active {
          color: #52c41a;
          border-bottom: 2px solid #52c41a;
        }

        .auth-form-container {
          grid-column: 1;
          padding: 0 30px 30px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: flex;
          gap: 15px;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #555;
        }

        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="tel"] {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-family: inherit;
          font-size: 16px;
          transition: border-color 0.2s ease;
        }

        input:focus {
          outline: none;
          border-color: #52c41a;
          box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.1);
        }

        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .forgot-password {
          color: #1890ff;
          text-decoration: none;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .form-checkbox {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          font-size: 14px;
        }

        .form-checkbox a {
          color: #1890ff;
          text-decoration: none;
        }

        .form-checkbox a:hover {
          text-decoration: underline;
        }

        .submit-button {
          padding: 14px;
          background-color: #52c41a;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .submit-button:hover {
          background-color: #46b314;
        }

        .submit-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .auth-error {
          grid-column: 1;
          padding: 0 30px;
          color: #ff4d4f;
          margin-top: 10px;
        }

        .auth-cart-summary {
          grid-column: 2;
          grid-row: 2 / span 4;
          background-color: #f9f9f9;
          padding: 30px;
          border-left: 1px solid #eee;
        }

        .auth-cart-summary h3 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 18px;
          color: #333;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          color: #666;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          font-weight: 600;
          font-size: 18px;
        }

        .view-cart-link {
          display: block;
          margin-top: 30px;
          text-align: center;
          color: #1890ff;
          text-decoration: none;
        }

        .view-cart-link:hover {
          text-decoration: underline;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .auth-container {
            grid-template-columns: 1fr;
          }
          
          .auth-cart-summary {
            grid-column: 1;
            grid-row: auto;
            border-left: none;
            border-top: 1px solid #eee;
          }
          
          .form-row {
            flex-direction: column;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutAuthView;