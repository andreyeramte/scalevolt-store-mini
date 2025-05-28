// FILE: src/components/LoadingSpinner.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ message, size = 'medium' }) => {
  const { t } = useTranslation();
  
  const sizeMap = {
    small: '30px',
    medium: '50px',
    large: '70px'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      minHeight: '200px'
    }}>
      <div style={{
        width: sizeMap[size],
        height: sizeMap[size],
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '16px'
      }}></div>
      
      {message && (
        <p style={{
          color: '#6c757d',
          fontSize: '14px',
          textAlign: 'center',
          margin: 0
        }}>
          {message || t('common.loading', 'Loading...')}
        </p>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;