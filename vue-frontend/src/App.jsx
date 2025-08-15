// FILE: src/App.jsx
import React, { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/index';
import AppRouter from './router/AppRouter';
import AIChatbot from './components/Chatbot/AIChatbot';

// Simple loading spinner
const LoadingSpinner = () => (
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
    <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: '600' }}>
      ScaleVolt Store
    </h2>
    <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>
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

// Error boundary for safety
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('🚨 App Error:', error, errorInfo);
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
            <h1 style={{ color: '#dc3545', marginBottom: '1rem', fontSize: '1.5rem' }}>
              ⚠️ Something went wrong
            </h1>
            <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '1rem' }}>
              ScaleVolt Store encountered an error. Please try refreshing the page.
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
                fontWeight: '500'
              }}
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<LoadingSpinner />}>
          <AppRouter />
          <AIChatbot />
        </Suspense>
      </I18nextProvider>
    </ErrorBoundary>
  );
}

export default App;