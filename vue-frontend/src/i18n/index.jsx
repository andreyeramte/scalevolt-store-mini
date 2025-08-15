// FILE: src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ua from './locales/ua.json';
import pl from './locales/pl.json';
import en from './locales/en.json';

const resources = {
  ua: { translation: ua },
  pl: { translation: pl },
  en: { translation: en },
};

const defaultLocale = 'ua';

i18n
  .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      lng: defaultLocale,
      fallbackLng: 'ua',
      debug: import.meta.env.MODE === 'development',
    resources,
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        lookupLocalStorage: 'userLocale',
        caches: ['localStorage'],
        checkWhitelist: true,
      },
      interpolation: {
      escapeValue: false,
        formatSeparator: ',',
    },
      react: {
        useSuspense: false,
        wait: false,
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span'],
      },
      ns: ['translation'],
      defaultNS: 'translation',
      keySeparator: '.',
  });

// ===== Enhanced Format Helpers =====
export const formatNumber = (value, format, locale) => {
  const currentLocale = locale || i18n.language;
  const localeMap = {
    'ua': 'uk-UA',
    'pl': 'pl-PL',
    'en': 'en-US'
  };
  const intlLocale = localeMap[currentLocale] || 'uk-UA';
  
  const currencyMap = {
    'ua': 'UAH',
    'pl': 'PLN',
    'en': 'USD'
  };
  
  try {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat(intlLocale, {
          style: 'currency',
          currency: currencyMap[currentLocale] || 'UAH',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(value);

      case 'decimal':
        return new Intl.NumberFormat(intlLocale, {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);

      case 'percent':
        return new Intl.NumberFormat(intlLocale, {
          style: 'percent',
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        }).format(value / 100);

      case 'integer':
        return new Intl.NumberFormat(intlLocale, {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);

      default:
        return new Intl.NumberFormat(intlLocale).format(value);
    }
  } catch (error) {
    console.warn('Number formatting error:', error);
    return value?.toString() || '';
  }
};

export const formatDate = (value, format, locale) => {
  const currentLocale = locale || i18n.language;
  const localeMap = {
    'ua': 'uk-UA',
    'pl': 'pl-PL',
    'en': 'en-US'
  };
  const intlLocale = localeMap[currentLocale] || 'uk-UA';
  
  try {
    const date = value instanceof Date ? value : new Date(value);
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    switch (format) {
      case 'short':
        return new Intl.DateTimeFormat(intlLocale, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(date);

      case 'medium':
        return new Intl.DateTimeFormat(intlLocale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(date);

      case 'long':
        return new Intl.DateTimeFormat(intlLocale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        }).format(date);

      case 'time':
        return new Intl.DateTimeFormat(intlLocale, {
          hour: 'numeric',
          minute: 'numeric',
        }).format(date);

      case 'datetime':
        return new Intl.DateTimeFormat(intlLocale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }).format(date);

      default:
        return new Intl.DateTimeFormat(intlLocale).format(date);
    }
  } catch (error) {
    console.warn('Date formatting error:', error);
    return value?.toString() || '';
  }
};

// ===== Enhanced Locale Management =====
export const setLocale = async (locale) => {
  const validLocales = ['ua', 'pl', 'en'];
  
  if (!validLocales.includes(locale)) {
    console.error('Invalid locale:', locale, 'Valid locales:', validLocales);
    return false;
  }

  try {
    await i18n.changeLanguage(locale);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('userLocale', locale);
      document.documentElement.setAttribute('lang', locale);
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('locale-changed', { 
        detail: { locale, timestamp: Date.now() } 
      }));
    }

    console.log('✅ Locale switched to:', locale);
    return true;
  } catch (error) {
    console.error('❌ Failed to switch locale:', error);
    return false;
  }
};

export const getCurrentLocale = () => i18n.language;

export const getSupportedLocales = () => ['ua', 'pl', 'en'];

// ===== Debug Helpers =====
export const debugI18n = () => {
  console.group('🌍 i18n Debug Information');
  console.log('Current locale:', i18n.language);
  console.log('Loaded languages:', i18n.languages);
  console.log('Fallback language:', i18n.options.fallbackLng);
  console.log('Debug mode:', i18n.options.debug);
  
  // Test translations
  const testKeys = [
    'common.home',
    'homeView.solarPanels',
    'login.title',
    'legal.privacyPolicy'
  ];
  
  console.group('Sample translations:');
  testKeys.forEach(key => {
    getSupportedLocales().forEach(locale => {
      const value = i18n.t(key, { lng: locale });
      console.log(`${locale}.${key}:`, value);
    });
  });
  console.groupEnd();
  
  console.groupEnd();
};

// ===== Utility Functions =====
export const translateWithFallback = (key, fallback = '', options = {}) => {
  try {
    const translated = i18n.t(key, options);
    return translated === key ? fallback : translated;
  } catch (error) {
    console.warn(`Translation error for key "${key}":`, error);
    return fallback;
  }
};

export const hasTranslation = (key, locale = null) => {
  return i18n.exists(key, { lng: locale });
};

// Debug in development
if (import.meta.env.MODE === 'development') {
  // Make debug functions available globally
  window.debugI18n = debugI18n;
  window.setLocale = setLocale;
  window.i18n = i18n;
  
  // Auto-debug on load
  setTimeout(debugI18n, 1000);
}

// Auto-initialize with error handling
i18n.on('initialized', (options) => {
  console.log('🌍 i18n initialized with options:', options.lng);
});

i18n.on('languageChanged', (lng) => {
  console.log('🔄 Language changed to:', lng);
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lng);
  }
});

i18n.on('failedLoading', (lng, ns, msg) => {
  console.warn(`⚠️ Failed loading ${lng}/${ns}:`, msg);
});

export default i18n;