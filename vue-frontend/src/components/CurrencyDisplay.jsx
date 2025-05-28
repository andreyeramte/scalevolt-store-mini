// src/contexts/CurrencyContext.js
import React, { createContext, useState } from 'react';

// Create a context with default value
export const CurrencyContext = createContext({
  currentCurrency: 'UAH',
  setCurrency: () => {}
});

// Create a provider component
export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState('UAH');
  
  const setCurrency = (currency) => {
    setCurrentCurrency(currency);
  };
  
  return (
    <CurrencyContext.Provider value={{ currentCurrency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};