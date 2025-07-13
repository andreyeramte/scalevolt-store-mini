import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CurrencySelector = ({ currentCurrency, onCurrencyChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currencies = [
    { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' }
  ];

  const currentCurrencyData = currencies.find(c => c.code === currentCurrency) || currencies[0];

  const handleCurrencySelect = (currencyCode) => {
    if (onCurrencyChange) {
      onCurrencyChange(currencyCode);
    }
    setIsOpen(false);
  };

  return (
    <div className="currency-selector relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="text-sm font-medium">{currentCurrencyData.symbol}</span>
        <span className="text-sm text-gray-600">{currentCurrencyData.code}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <div className="py-1">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencySelect(currency.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  currency.code === currentCurrency ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{currency.symbol} {currency.code}</span>
                  <span className="text-xs text-gray-500">{currency.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CurrencySelector; 