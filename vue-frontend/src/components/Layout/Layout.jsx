// FILE: src/components/Layout/Layout.jsx
import React, { useEffect, useState, createContext, useContext } from 'react';
import { Outlet, useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import SearchBar from '../SearchBar/SearchBar';
// import ConsentBanner from '../ConsentBanner'; // Uncomment when ready

// Create Currency Context
const CurrencyContext = createContext();

// Custom hook to use currency context
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

function Layout() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { region } = useParams();
  const currentRegion = region || 'ua';
  
  // Currency state management
  const [currencyStore, setCurrencyStore] = useState({
    currentCurrency: localStorage.getItem('userCurrency') || 
                    (i18n.language === 'pl' ? 'PLN' : 'UAH'),
    setCurrency: function(currency) {
      setCurrencyStore(prev => ({
        ...prev,
        currentCurrency: currency
      }));
      localStorage.setItem('userCurrency', currency);
    }
  });

  // Products state for SearchBar
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        
        // Replace with your actual API call
        // const response = await fetch('/api/products');
        // const data = await response.json();
        // setProducts(data);
        
        // Temporary mock data for testing
        const mockProducts = [
          {
            id: 1,
            name: t('products.solar_panel_100w', 'Solar Panel 100W'),
            defaultName: "Solar Panel 100W",
            nameKey: "products.solar_panel_100w",
            brand: "ScaleVolt",
            price: 150,
            image: "/api/placeholder/100/100",
            stock: 10,
            searchableText: "solar panel 100w scalevolt renewable energy",
            category: "solar-panels"
          },
          {
            id: 2,
            name: t('products.battery_pack_24v', 'Battery Pack 24V'),
            defaultName: "Battery Pack 24V",
            nameKey: "products.battery_pack_24v",
            brand: "ScaleVolt",
            price: 200,
            image: "/api/placeholder/100/100",
            stock: 5,
            searchableText: "battery pack 24v scalevolt energy storage",
            category: "batteries"
          },
          {
            id: 3,
            name: t('products.inverter_1000w', 'Inverter 1000W'),
            defaultName: "Inverter 1000W",
            nameKey: "products.inverter_1000w",
            brand: "ScaleVolt",
            price: 300,
            image: "/api/placeholder/100/100",
            stock: 8,
            searchableText: "inverter 1000w scalevolt power conversion",
            category: "inverters"
          }
        ];
        
        setProducts(mockProducts);
        
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [t]);

  // Initialize app settings
  useEffect(() => {
    // Set the lang attribute on document
    document.documentElement.setAttribute('lang', i18n.language);
    
    // Auto login from the store if needed
    // You can implement your auth logic here
    // autoLogin();
    
    // Create a function to bypass loading screens (from your Vue app)
    const bypassLoading = () => {
      const loadingElements = document.querySelectorAll('[class*="loading"], [id*="loading"], .loading-container');
      loadingElements.forEach(el => {
        el.style.display = 'none';
      });
      
      // Find elements containing "Loading ScaleVolt Store"
      document.querySelectorAll('*').forEach(el => {
        if (el.textContent && el.textContent.includes('Loading ScaleVolt Store')) {
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
        setCurrencyStore(prev => ({
          ...prev,
          currentCurrency: newCurrency
        }));
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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{t('common.loading', 'Loading ScaleVolt Store...')}</p>
        </div>
      </div>
    );
  }

  return (
    <CurrencyContext.Provider value={currencyStore}>
      <div className="layout-container min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        {/* Search Bar Section - Only show on certain pages or make it toggleable */}
        <div className="search-section bg-white shadow-sm border-b border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                allProducts={products}
                searchKeys={['name', 'defaultName', 'brand', 'description', 'searchableText']}
                minSearchLength={2}
                productRoute={`/${currentRegion}/product/`}
                maxSuggestions={5}
                minSuggestionLength={1}
                onlyShowInStock={false}
                onSearchSelected={handleSearchSelected}
                onSearchPerformed={handleSearchPerformed}
                onSuggestionSelected={handleSuggestionSelected}
              />
            </div>
          </div>
        </div>
        
        <main className="main-content flex-1">
          <Outlet />
        </main>
        
        <Footer />
        
        {/* Uncomment when ConsentBanner is converted to React */}
        {/* <ConsentBanner /> */}
      </div>
    </CurrencyContext.Provider>
  );
}

export default Layout;