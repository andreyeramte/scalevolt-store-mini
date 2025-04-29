// src/services/geoService.js
import axios from 'axios';

export const detectUserCountry = async () => {
  try {
    // Using a free IP geolocation API
    const response = await axios.get('https://ipapi.co/json/');
    return response.data.country_code; // Returns 'PL', 'UA', etc.
  } catch (error) {
    console.error('Error detecting user country:', error);
    return null;
  }
};

export const mapCountryToLocale = (countryCode) => {
  const countryToLocaleMap = {
    'PL': 'pl',
    'UA': 'ua',
    // Add more countries as needed
  };
    
  return countryToLocaleMap[countryCode] || 'ua'; // Default to Ukrainian
};

// Currency mapping
export const mapCountryToCurrency = (countryCode) => {
  const countryToCurrencyMap = {
    'PL': 'PLN', // Polish Złoty
    'UA': 'UAH', // Ukrainian Hryvnia
  };
    
  return countryToCurrencyMap[countryCode] || 'UAH'; // Default to Hryvnia
};

// Get currency symbol
export const getCurrencySymbol = (currencyCode) => {
  const currencySymbols = {
    'PLN': 'zł', // Polish Złoty
    'UAH': '₴',  // Ukrainian Hryvnia
  };
    
  return currencySymbols[currencyCode] || currencyCode;
};

// Get locale name for display
export const getLocaleName = (localeCode) => {
  const localeNames = {
    'ua': 'Українська',
    'pl': 'Polski',
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
    i18n.locale = savedLocale;
  }
    
  // If no saved preferences and user has granted permission, detect location
  if ((!savedLocale || !savedCurrency) && locationPermission === 'granted') {
    const countryCode = await detectUserCountry();
        
    if (countryCode) {
      // Set language if not already set
      if (!savedLocale) {
        const locale = mapCountryToLocale(countryCode);
        i18n.locale = locale;
        localStorage.setItem('userLocale', locale);
      }
            
      // Set currency if not already set
      if (!savedCurrency) {
        const currency = mapCountryToCurrency(countryCode);
        setCurrency(currency); // This would need to be passed in from your app
        localStorage.setItem('userCurrency', currency);
      }
    }
  }
    
  return {
    locale: i18n.locale,
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