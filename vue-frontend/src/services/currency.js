// src/services/currency.js
import { getCurrencySymbol } from './geoService';

// Exchange rates (as of a certain date - you may want to use an API for live rates)
const exchangeRates = {
  'PLN': 1,      // Base: 1 PLN
  'UAH': 7.42,   // Example: 1 PLN = 7.42 UAH (you should use current rates)
};

// Convert amount between currencies
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  // If same currency, no conversion needed
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  // Convert to PLN first (our base currency in this example)
  const amountInPLN = fromCurrency === 'PLN' 
    ? amount 
    : amount / exchangeRates[fromCurrency];
  
  // Then convert to target currency
  return toCurrency === 'PLN'
    ? amountInPLN
    : amountInPLN * exchangeRates[toCurrency];
};

// Format currency for display
export const formatCurrency = (amount, currencyCode) => {
  const symbol = getCurrencySymbol(currencyCode);
  
  // Format with appropriate decimal places
  const formattedAmount = amount.toLocaleString(
    currencyCode === 'PLN' ? 'pl-PL' : 'uk-UA', 
    { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  );
  
  // Position symbol appropriately according to currency conventions
  if (currencyCode === 'PLN') {
    return `${formattedAmount} ${symbol}`;  // 100,00 zł
  } else {
    return `${formattedAmount} ${symbol}`;  // 100,00 ₴
  }
};

// Store user's currency preference
export const setUserCurrencyPreference = (currencyCode) => {
  localStorage.setItem('userCurrency', currencyCode);
};

// Get user's currency preference
export const getUserCurrencyPreference = () => {
  return localStorage.getItem('userCurrency') || 'UAH'; // Default to Hryvnia
};