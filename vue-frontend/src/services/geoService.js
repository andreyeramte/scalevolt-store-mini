// src/services/geoService.js
import axios from 'axios';

// Enhanced country detection with multiple fallback APIs
export const detectUserCountry = async () => {
  const apis = [
    'https://ipapi.co/json/',
    'https://api.ipify.org?format=json',
    'https://httpbin.org/ip'
  ];

  for (const api of apis) {
    try {
      if (api.includes('ipapi.co')) {
        const response = await axios.get(api, { timeout: 5000 });
        return response.data.country_code; // Returns 'PL', 'UA', etc.
      } else if (api.includes('ipify')) {
        const response = await axios.get(api, { timeout: 5000 });
        const ip = response.data.ip;
        // Use ipapi.co to get country from IP
        const geoResponse = await axios.get(`https://ipapi.co/${ip}/json/`, { timeout: 5000 });
        return geoResponse.data.country_code;
      }
    } catch (error) {
      console.warn(`Failed to detect country using ${api}:`, error.message);
      continue;
    }
  }
  
  console.warn('All country detection APIs failed, using browser language fallback');
  return null;
};

export const mapCountryToLocale = (countryCode) => {
  const countryToLocaleMap = {
    'PL': 'pl',
    'UA': 'ua',
    'US': 'en',
    'GB': 'en',
    'CA': 'en',
    'AU': 'en',
    // Add more countries as needed
  };
    
  return countryToLocaleMap[countryCode] || 'ua'; // Default to Ukrainian
};

// Enhanced locale detection with browser fallback
export const detectUserLocale = async () => {
  try {
    // First try IP-based detection
    const countryCode = await detectUserCountry();
    if (countryCode) {
      const locale = mapCountryToLocale(countryCode);
      console.log(`🌍 Detected country: ${countryCode}, setting locale to: ${locale}`);
      return locale;
    }
  } catch (error) {
    console.warn('IP detection failed, using browser language:', error.message);
  }

  // Fallback to browser language
  const browserLang = navigator.language || navigator.userLanguage || 'en';
  const browserLocale = browserLang.split('-')[0].toLowerCase();
  
  const browserToLocaleMap = {
    'pl': 'pl',
    'uk': 'ua',
    'ua': 'ua',
    'en': 'en'
  };
  
  const detectedLocale = browserToLocaleMap[browserLocale] || 'ua';
  console.log(`🌐 Browser language: ${browserLang}, setting locale to: ${detectedLocale}`);
  return detectedLocale;
};

// Currency mapping
export const mapCountryToCurrency = (countryCode) => {
  const countryToCurrencyMap = {
    'PL': 'PLN', // Polish Złoty
    'UA': 'UAH', // Ukrainian Hryvnia
    'US': 'USD', // US Dollar
    'GB': 'GBP', // British Pound
    'CA': 'CAD', // Canadian Dollar
    'AU': 'AUD', // Australian Dollar
  };
    
  return countryToCurrencyMap[countryCode] || 'UAH'; // Default to Hryvnia
};

// Get currency symbol
export const getCurrencySymbol = (currencyCode) => {
  const currencySymbols = {
    'PLN': 'zł', // Polish Złoty
    'UAH': '₴',  // Ukrainian Hryvnia
    'USD': '$',  // US Dollar
    'GBP': '£',  // British Pound
    'CAD': 'C$', // Canadian Dollar
    'AUD': 'A$', // Australian Dollar
  };
    
  return currencySymbols[currencyCode] || currencyCode;
};

// Get locale name for display
export const getLocaleName = (localeCode) => {
  const localeNames = {
    'ua': 'Українська',
    'pl': 'Polski',
    'en': 'English',
  };
  
  return localeNames[localeCode] || localeCode;
};

// Check if user has already set preferences
export const hasUserSetPreferences = () => {
  return {
    locale: !!localStorage.getItem('userLocale'),
    currency: !!localStorage.getItem('userCurrency'),
    locationPermission: localStorage.getItem('locationPermission'),
  };
};

// Initialize both language and currency based on location
export const initializeLocalization = async (i18n, setCurrency) => {
  const savedLocale = localStorage.getItem('userLocale');
  const savedCurrency = localStorage.getItem('userCurrency');
  const locationPermission = localStorage.getItem('locationPermission');
    
  // If user has already set preferences, use those
  if (savedLocale) {
    await i18n.changeLanguage(savedLocale);
    console.log('✅ Using saved locale:', savedLocale);
  } else {
    // Auto-detect locale
    const detectedLocale = await detectUserLocale();
    await i18n.changeLanguage(detectedLocale);
    localStorage.setItem('userLocale', detectedLocale);
    console.log('✅ Auto-detected and set locale:', detectedLocale);
  }
    
  // If no saved preferences and user has granted permission, detect location
  if (!savedCurrency && locationPermission === 'granted') {
    const countryCode = await detectUserCountry();
        
    if (countryCode) {
      const currency = mapCountryToCurrency(countryCode);
      setCurrency(currency); // This would need to be passed in from your app
      localStorage.setItem('userCurrency', currency);
      console.log('✅ Auto-detected and set currency:', currency);
    }
  }
    
  return {
    locale: i18n.language,
    currency: savedCurrency || mapCountryToCurrency(await detectUserCountry()) || 'UAH'
  };
};

// Function to check if we should show the location consent banner
export const shouldShowLocationConsent = () => {
  const userLocale = localStorage.getItem('userLocale');
  const locationPermission = localStorage.getItem('locationPermission');
  
  // Only show if user hasn't set preferences and hasn't explicitly accepted/rejected permission
  return !userLocale && locationPermission !== 'granted' && locationPermission !== 'denied';
};

// Save user's location preference
export const saveLocationPreference = (accept = true) => {
  if (accept) {
    localStorage.setItem('locationPermission', 'granted');
    return true;
  } else {
    localStorage.setItem('locationPermission', 'denied');
    // Set default locale if rejecting location detection
    if (!localStorage.getItem('userLocale')) {
      localStorage.setItem('userLocale', 'ua');
    }
    return false;
  }
};

// Enhanced function to automatically detect and set locale on app startup
export const autoDetectAndSetLocale = async (i18n) => {
  try {
    const savedLocale = localStorage.getItem('userLocale');
    
    if (savedLocale) {
      await i18n.changeLanguage(savedLocale);
      console.log('✅ Using saved locale:', savedLocale);
      return savedLocale;
    }
    
    const detectedLocale = await detectUserLocale();
    await i18n.changeLanguage(detectedLocale);
    localStorage.setItem('userLocale', detectedLocale);
    console.log('✅ Auto-detected and set locale:', detectedLocale);
    return detectedLocale;
  } catch (error) {
    console.error('❌ Failed to auto-detect locale:', error);
    // Fallback to default
    const fallbackLocale = 'ua';
    await i18n.changeLanguage(fallbackLocale);
    localStorage.setItem('userLocale', fallbackLocale);
    console.log('✅ Using fallback locale:', fallbackLocale);
    return fallbackLocale;
  }
};