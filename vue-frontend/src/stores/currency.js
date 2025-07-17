import create from 'zustand';

const useCurrencyStore = create((set, get) => ({
  currentCurrency: localStorage.getItem('userCurrency') || 'UAH',
  
  setCurrency: (currency) => {
    set({ currentCurrency: currency });
    localStorage.setItem('userCurrency', currency);
  },
  
  getCurrency: () => get().currentCurrency,
  
  // Currency conversion rates (you can update these)
  rates: {
    UAH: 1,
    USD: 0.027,
    EUR: 0.025,
    PLN: 0.11
  },
  
  convertCurrency: (amount, fromCurrency, toCurrency) => {
    const { rates } = get();
    if (fromCurrency === toCurrency) return amount;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / rates[fromCurrency];
    return usdAmount * rates[toCurrency];
  },
  
  formatPrice: (price, currency = null) => {
    const currentCurrency = currency || get().currentCurrency;
    const { rates } = get();
    
    // Convert price to current currency if it's in USD
    const convertedPrice = get().convertCurrency(price, 'USD', currentCurrency);
    
    const formatters = {
      UAH: new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }),
      USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
      PLN: new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })
    };
    
    return formatters[currentCurrency]?.format(convertedPrice) || `${convertedPrice} ${currentCurrency}`;
  }
}));

export default useCurrencyStore; 