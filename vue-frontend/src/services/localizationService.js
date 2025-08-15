// FILE: src/services/localizationService.js
// Centralized localization service for consistent language and location handling

import { detectUserLocation, getLanguageFromCountry, getBrowserLanguage } from '../utils/locationDetector';

// Supported languages and their configurations
export const SUPPORTED_LANGUAGES = {
  ua: {
    code: 'ua',
    name: 'Українська',
    flag: '🇺🇦',
    country: 'Ukraine',
    fallback: 'en'
  },
  pl: {
    code: 'pl',
    name: 'Polski',
    flag: '🇵🇱',
    country: 'Poland',
    fallback: 'en'
  },
  en: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    country: 'International',
    fallback: null
  }
};

// Market configurations
export const MARKETS = {
  ukraine: {
    name: 'Ukraine',
    code: 'ua',
    defaultLanguage: 'ua',
    availableLanguages: ['ua', 'en'],
    currency: 'UAH',
    timezone: 'Europe/Kiev'
  },
  poland: {
    name: 'Poland',
    code: 'pl',
    defaultLanguage: 'pl',
    availableLanguages: ['pl', 'en'],
    currency: 'PLN',
    timezone: 'Europe/Warsaw'
  },
  international: {
    name: 'International',
    code: 'en',
    defaultLanguage: 'en',
    availableLanguages: ['en'],
    currency: 'USD',
    timezone: 'UTC'
  }
};

// Country to market mapping
const COUNTRY_TO_MARKET = {
  'UA': 'ukraine',
  'PL': 'poland'
};

class LocalizationService {
  constructor() {
    this.currentLanguage = null;
    this.currentMarket = null;
    this.userLocation = null;
    this.isInitialized = false;
  }

  // Initialize the service with user detection
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Detect user location
      this.userLocation = await detectUserLocation();
      
      // Determine market based on location
      this.currentMarket = this.determineMarket(this.userLocation);
      
      // Get default language for the market
      this.currentLanguage = this.currentMarket.defaultLanguage;
      
      // Check if user has a saved preference
      const savedLanguage = localStorage.getItem('userLanguage');
      if (savedLanguage && this.isLanguageAvailable(savedLanguage)) {
        this.currentLanguage = savedLanguage;
      }
      
      // Check browser language as fallback
      if (!savedLanguage) {
        const browserLanguage = getBrowserLanguage();
        if (this.isLanguageAvailable(browserLanguage)) {
          this.currentLanguage = browserLanguage;
        }
      }

      this.isInitialized = true;
      
      console.log('🌍 Localization initialized:', {
        market: this.currentMarket.name,
        language: this.currentLanguage,
        location: this.userLocation
      });

    } catch (error) {
      console.error('Error initializing localization:', error);
      // Fallback to international
      this.currentMarket = MARKETS.international;
      this.currentLanguage = 'en';
      this.isInitialized = true;
    }
  }

  // Determine market based on user location
  determineMarket(location) {
    if (location.error || !location.country) {
      return MARKETS.international;
    }

    const marketKey = COUNTRY_TO_MARKET[location.country.toUpperCase()];
    return MARKETS[marketKey] || MARKETS.international;
  }

  // Check if language is available in current market
  isLanguageAvailable(language) {
    return this.currentMarket.availableLanguages.includes(language);
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Get current market
  getCurrentMarket() {
    return this.currentMarket;
  }

  // Get available languages for current market
  getAvailableLanguages() {
    return this.currentMarket.availableLanguages.map(lang => SUPPORTED_LANGUAGES[lang]);
  }

  // Switch language
  async switchLanguage(newLanguage) {
    if (!this.isLanguageAvailable(newLanguage)) {
      throw new Error(`Language ${newLanguage} is not available in ${this.currentMarket.name}`);
    }

    this.currentLanguage = newLanguage;
    localStorage.setItem('userLanguage', newLanguage);
    
    // Update i18n
    const { i18n } = await import('react-i18next');
    await i18n.changeLanguage(newLanguage);
    
    // Update document attributes
    document.documentElement.setAttribute('lang', newLanguage);
    document.documentElement.setAttribute('data-market', this.currentMarket.code);
    
    console.log(`🔄 Language switched to: ${newLanguage}`);
    
    return newLanguage;
  }

  // Get language display info
  getLanguageInfo(languageCode) {
    return SUPPORTED_LANGUAGES[languageCode] || null;
  }

  // Get market-specific configuration
  getMarketConfig() {
    return {
      currency: this.currentMarket.currency,
      timezone: this.currentMarket.timezone,
      availableLanguages: this.getAvailableLanguages(),
      defaultLanguage: this.currentMarket.defaultLanguage
    };
  }

  // Get user location info
  getUserLocation() {
    return this.userLocation;
  }

  // Check if user is in specific market
  isUserInMarket(marketCode) {
    return this.currentMarket.code === marketCode;
  }

  // Get localized URL for current language/market
  getLocalizedUrl(path) {
    const basePath = `/${this.currentLanguage}`;
    return path.startsWith('/') ? `${basePath}${path}` : `${basePath}/${path}`;
  }

  // Format currency based on market
  formatCurrency(amount) {
    const formatter = new Intl.NumberFormat(this.currentLanguage, {
      style: 'currency',
      currency: this.currentMarket.currency
    });
    return formatter.format(amount);
  }

  // Format date based on market locale
  formatDate(date, options = {}) {
    const formatter = new Intl.DateTimeFormat(this.currentLanguage, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    });
    return formatter.format(new Date(date));
  }

  // Get market-specific product categories
  getMarketCategories() {
    const categories = {
      ukraine: [
        { id: 'solar-panels', name: { ua: 'Сонячні панелі', en: 'Solar Panels' } },
        { id: 'batteries', name: { ua: 'Акумулятори', en: 'Batteries' } },
        { id: 'inverters', name: { ua: 'Інвертори', en: 'Inverters' } },
        { id: 'ev-chargers', name: { ua: 'Зарядні станції', en: 'EV Chargers' } }
      ],
      poland: [
        { id: 'solar-panels', name: { pl: 'Panele słoneczne', en: 'Solar Panels' } },
        { id: 'batteries', name: { pl: 'Baterie', en: 'Batteries' } },
        { id: 'inverters', name: { pl: 'Inwertery', en: 'Inverters' } },
        { id: 'ev-chargers', name: { pl: 'Stacje ładowania', en: 'EV Chargers' } }
      ],
      international: [
        { id: 'solar-panels', name: { en: 'Solar Panels' } },
        { id: 'batteries', name: { en: 'Batteries' } },
        { id: 'inverters', name: { en: 'Inverters' } },
        { id: 'ev-chargers', name: { en: 'EV Chargers' } }
      ]
    };

    return categories[this.currentMarket.code] || categories.international;
  }

  // Get localized category name
  getLocalizedCategoryName(categoryId) {
    const categories = this.getMarketCategories();
    const category = categories.find(cat => cat.id === categoryId);
    
    if (category && category.name[this.currentLanguage]) {
      return category.name[this.currentLanguage];
    }
    
    return categoryId; // Fallback to ID
  }
}

// Create singleton instance
const localizationService = new LocalizationService();

export default localizationService; 