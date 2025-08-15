// FILE: src/components/Layout/Layout.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SearchBar from '../SearchBar/SearchBar';
import useProductsStore from '../../stores/products';
import usePageTitle from '../../Hooks/usePageTitle';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import useUserStore from '../../stores/user';

// Simple currency hook for now
export const useCurrency = () => {
  const [currentCurrency, setCurrentCurrency] = useState(
    localStorage.getItem('userCurrency') || 'UAH'
  );
  
  const setCurrency = (currency) => {
    setCurrentCurrency(currency);
    localStorage.setItem('userCurrency', currency);
  };
  
  return { currentCurrency, setCurrency };
};

function Layout() {
  usePageTitle();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentCurrency, setCurrency: setCurrencyStore } = useCurrency();
  
  // Listen to Firebase Auth state and update Zustand user store
  useEffect(() => {
    if (!auth) {
      console.log('⚠️ Firebase auth not available - skipping auth state listener');
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      useUserStore.getState().setUser(user);
    });
    return () => unsubscribe();
  }, []);
  
  // Get current region from URL or default to 'ua'
  const currentRegion = location.pathname.split('/')[1] || 'ua';
  
  // Products state for SearchBar - use the store instead
  const { products, loading: isLoading, fetchProducts } = useProductsStore();

  // Auto-fetch products on component mount
  useEffect(() => {
    console.log('🔄 Layout: Auto-fetching products...');
    fetchProducts();
  }, [fetchProducts]);

  console.log('🏗️ Layout component rendered');
  console.log('📦 Products from store:', products.length);
  console.log('⏳ Loading state:', isLoading);

  // Load products on mount - use useCallback to prevent infinite re-renders
  const loadProducts = useCallback(() => {
    console.log('🚀 Layout: Starting to fetch products...');
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    loadProducts();
    
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('⏰ Loading timeout reached, proceeding anyway');
      // Force the loading to stop after 10 seconds
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [loadProducts]);

  // Initialize app settings
  useEffect(() => {
    console.log('⚙️ Layout: Initializing app settings');
    // Set the lang attribute on document
    document.documentElement.setAttribute('lang', i18n.language);
    
    // Auto login from the store if needed
    // You can implement your auth logic here
    // autoLogin();
    
    // Create a function to bypass loading screens (from your Vue app)
    const bypassLoading = () => {
      console.log('🔍 Looking for loading elements to hide...');
      const loadingElements = document.querySelectorAll('[class*="loading"], [id*="loading"], .loading-container');
      console.log('📋 Found loading elements:', loadingElements.length);
      loadingElements.forEach(el => {
        el.style.display = 'none';
      });
      
      // Find elements containing "Loading ScaleVolt Store"
      document.querySelectorAll('*').forEach(el => {
        if (el.textContent && el.textContent.includes('Loading ScaleVolt Store')) {
          console.log('🚫 Hiding element with "Loading ScaleVolt Store" text');
          el.style.display = 'none';
          
          // Try to hide parent elements too
          let parent = el.parentElement;
          for (let i = 0; i < 3 && parent; i++) {
            if (parent) {
              parent.style.display = 'none';
              parent = parent.parentElement;
            }
          }
        }
      });
    };

    // Set timeouts to hide loading screens
    const timeouts = [
      setTimeout(bypassLoading, 100),
      setTimeout(bypassLoading, 500),
      setTimeout(bypassLoading, 1000)
    ];
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [i18n.language]);

  // Handle locale changes
  useEffect(() => {
    const handleLocaleChange = (event) => {
      console.log('🌍 Locale changed to:', event.detail);
      document.documentElement.setAttribute('lang', event.detail);
      
      // Update currency based on locale if user hasn't explicitly set it
      if (!localStorage.getItem('userCurrency')) {
        const newCurrency = event.detail === 'pl' ? 'PLN' : 'UAH';
        setCurrencyStore(newCurrency);
        localStorage.setItem('userCurrency', newCurrency);
      }
    };

    window.addEventListener('locale-changed', handleLocaleChange);
    
    return () => {
      window.removeEventListener('locale-changed', handleLocaleChange);
    };
  }, []);

  // Add global utility functions for debugging
  useEffect(() => {
    window.switchLanguage = function(locale) {
      console.log('Manually switching to', locale);
      i18n.changeLanguage(locale);
      localStorage.setItem('userLocale', locale);
      document.documentElement.setAttribute('lang', locale);
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('locale-changed', { detail: locale }));
      
      console.log('After switch - Current locale:', i18n.language);
      return 'Language switched to ' + locale;
    };

    window.checkTranslations = function() {
      const locale = i18n.language;
      console.log('Current locale:', locale);
      console.log('Sample translation:', t('common.loading', 'Loading...'));
      return 'Checked translations for ' + locale;
    };

    window.reloadApp = function() {
      window.location.reload();
      return 'Reloading application...';
    };

    // Cleanup function
    return () => {
      delete window.switchLanguage;
      delete window.checkTranslations;
      delete window.reloadApp;
    };
  }, [i18n, t]);

  // SearchBar event handlers
  const handleSearchSelected = (product) => {
    console.log('Product selected:', product);
    navigate(`/${currentRegion}/product/${product.id}`);
  };

  const handleSearchPerformed = (searchData) => {
    console.log('Search performed:', searchData);
    // Handle search analytics or navigation to search results
    if (searchData.query) {
      navigate(`/${currentRegion}/search?q=${encodeURIComponent(searchData.query)}`);
    }
  };

  const handleSuggestionSelected = (suggestion) => {
    console.log('Suggestion selected:', suggestion);
    // Handle suggestion selection - could navigate to category or perform search
    if (suggestion.type === 'category') {
      navigate(`/${currentRegion}/category/${suggestion.id}`);
    } else {
      navigate(`/${currentRegion}/search?q=${encodeURIComponent(suggestion.text)}`);
    }
  };

  console.log('🎯 Layout: About to render, isLoading:', isLoading);

  // Show loading screen only for a short time, then proceed
  if (isLoading && products.length === 0 && false) { // Temporarily disable loading screen
    console.log('⏳ Layout: Showing loading screen');
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '20px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #e3e3e3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>
          {t('common.loading', 'Loading ScaleVolt Store...')}
        </h2>
        <p style={{ color: '#666', textAlign: 'center' }}>
          Connecting to backend... Please wait.
        </p>
        <button
          onClick={() => {
            console.log('🔄 Manual retry clicked');
            fetchProducts();
          }}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '20px',
            fontSize: '14px'
          }}
        >
          🔄 Retry Connection
        </button>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  console.log('✅ Layout: Rendering main layout with', products.length, 'products');
  return (
    <div className="app-layout" style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header />
      <SearchBar 
        allProducts={products}
        onSearchSelected={handleSearchSelected}
        onSearchPerformed={handleSearchPerformed}
        onSuggestionSelected={handleSuggestionSelected}
      />
      <main className="main-content" style={{ flex: 1, padding: '20px' }}>

        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;