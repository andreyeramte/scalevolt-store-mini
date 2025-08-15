// FILE: src/main.jsx
import React, { Suspense, createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/index';
import App from './App'; // Simple test App
import { app, auth } from './firebase';
import { autoDetectAndSetLocale } from './services/geoService';
import './style.css'
import './mobile-responsive.css'; // Import the main CSS file

// Force hide any loading screens immediately
window.BYPASS_LOADING = true;

// Add favicon programmatically to prevent 404 errors
function addFavicon() {
  if (document.querySelector('link[rel="icon"]')) return; // Don't add if already exists
  
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/x-icon';
  link.href = '/favicon.ico';
  document.head.appendChild(link);
}

// Create contexts for global state
export const AuthContext = createContext({
  user: null,
  loading: false,
  signIn: () => {},
  signOut: () => {},
  signUp: () => {}
});

export const CurrencyContext = createContext({
  currentCurrency: 'UAH',
  setCurrency: () => {}
});

// Enhanced error boundary component
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 App Error Boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '600px',
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              color: '#dc3545', 
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              ⚠️ Something went wrong
            </h1>
            <p style={{ 
              color: '#6c757d', 
              marginBottom: '1.5rem',
              fontSize: '1rem'
            }}>
              ScaleVolt Store encountered an unexpected error.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginRight: '10px'
              }}
            >
              🔄 Reload Page
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              🏠 Go Home
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ 
                marginTop: '2rem', 
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '4px'
              }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  marginBottom: '1rem',
                  fontWeight: 'bold',
                  color: '#495057'
                }}>
                  🔧 Error Details (Development Mode)
                </summary>
                <pre style={{
                  backgroundColor: '#f1f3f4',
                  padding: '1rem',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#d63384',
                  overflow: 'auto',
                  maxWidth: '100%',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  <strong>Error:</strong> {this.state.error?.toString()}
                  {'\n\n'}
                  <strong>Stack:</strong> {this.state.error?.stack}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      <strong>Component Stack:</strong> {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component for Suspense
const AppLoader = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }}>
    <div style={{
      width: '60px',
      height: '60px',
      border: '4px solid #e3e3e3',
      borderTop: '4px solid #007bff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1.5rem'
    }}></div>
    <h2 style={{ 
      color: '#333', 
      fontSize: '1.5rem', 
      marginBottom: '0.5rem',
      fontWeight: '600'
    }}>
      ScaleVolt Store
    </h2>
    <p style={{ 
      color: '#6c757d', 
      fontSize: '14px',
      margin: 0
    }}>
      Loading your energy solutions...
    </p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Create bypass loading function
function bypassLoading() {
  try {
    const loadingElements = document.querySelectorAll('[class*="loading"], [id*="loading"], .loading-container');
    loadingElements.forEach(el => {
      if (el && el.style) {
        el.style.display = 'none';
      }
    });
    
    // Find elements containing loading text
    const textElements = document.querySelectorAll('*');
    textElements.forEach(el => {
      if (el && el.textContent && el.textContent.includes('Loading ScaleVolt Store')) {
        el.style.display = 'none';
        
        // Try to hide parent elements too
        let parent = el.parentElement;
        for (let i = 0; i < 3 && parent; i++) {
          if (parent && parent.style) {
            parent.style.display = 'none';
            parent = parent.parentElement;
          }
        }
      }
    });
    
    return 'Loading screens bypassed';
  } catch (error) {
    console.warn('Error bypassing loading screens:', error);
    return 'Bypass failed';
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('🚨 Global Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
});

// Make utility functions available globally
window.bypassLoading = bypassLoading;

// Initialize the app
async function initializeReactApp() {
  try {
    // Get the root element
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      throw new Error('Root element not found. Make sure you have a div with id="root" in your HTML.');
    }

    // Auto-detect and set locale on app startup
    try {
      await autoDetectAndSetLocale(i18n);
    } catch (error) {
      console.error('❌ Failed to auto-detect locale:', error);
      // Fallback to default
      i18n.changeLanguage('ua');
    }
    
    // Create React root and render the app
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Listen for auth changes if Firebase is available
    if (auth) {
      // onAuthStateChanged(auth, function(user) {
      //   if (user) {
      //     console.log('✅ User is logged in:', user.email);
      //   } else {
      //     console.log('👤 User is signed out');
      //   }
      // });
    }
    
    console.log('🚀 ScaleVolt React App initialized successfully');
    
  } catch (error) {
    console.error('🔥 Critical App Error:', error);
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          background-color: #f8f9fa;
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
        ">
          <div style="
            max-width: 500px;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          ">
            <h2 style="color: #dc3545; margin-bottom: 1rem;">💀 Application Crash</h2>
            <p style="color: #6c757d; margin-bottom: 1rem;">
              ScaleVolt Store failed to initialize.
            </p>
            <button onclick="window.location.reload()" style="
              padding: 10px 20px;
              background-color: #007bff;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            ">
              🔄 Reload Page
            </button>
            <pre style="
              background-color: #f8f9fa;
              padding: 1rem;
              border-radius: 4px;
              margin-top: 1rem;
              text-align: left;
              font-size: 12px;
              color: #d63384;
              overflow: auto;
              max-width: 100%;
            ">${error.stack || error.toString()}</pre>
          </div>
        </div>
      `;
    }
  }
}

// Development helpers
if (import.meta.env.MODE === 'development') {
  // Make React DevTools work better
  window.React = React;
  
  // Add development utilities
  window.debugApp = () => {
    console.group('🔧 App Debug Info');
    console.log('React version:', React.version);
    console.log('Environment:', import.meta.env.MODE);
    console.log('Base URL:', import.meta.env.BASE_URL);
    console.log('Firebase enabled:', !!auth);
    console.log('Current locale:', i18n.language);
    console.groupEnd();
  };
  
  console.log('🚀 ScaleVolt React App started in development mode');
  console.log('💡 Available debug commands:');
  console.log('  - window.debugApp() - App debug info');
  console.log('  - window.debugI18n() - i18n debug info');
  console.log('  - window.bypassLoading() - Hide loading screens');
}

// DOM ready handler
document.addEventListener('DOMContentLoaded', () => {
  bypassLoading();
});

// Set timeouts to hide loading screens
setTimeout(bypassLoading, 100);
setTimeout(bypassLoading, 500);
setTimeout(bypassLoading, 1000);

// Start everything in the correct order
addFavicon();
initializeReactApp();