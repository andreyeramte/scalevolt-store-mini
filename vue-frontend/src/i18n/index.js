// src/i18n/index.js
import { createI18n } from 'vue-i18n';
import uaMessages from '@/i18n/locales/ua.json';
import plMessages from '@/i18n/locales/pl.json';

// Get user's saved locale or use browser language as fallback
// Get user's saved locale or use browser language as fallback
const savedLocale = localStorage.getItem('userLocale');
const browserLang = navigator.language.split('-')[0];
const defaultLocale = savedLocale || (browserLang === 'pl' ? 'pl' : 'ua');

// Create i18n instance
export const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: defaultLocale,
  fallbackLocale: 'ua',
  messages: {
    ua: uaMessages,
    pl: plMessages,
  },
  numberFormats: {
    ua: {
      currency: {
        style: 'currency',
        currency: 'UAH',
        notation: 'standard',
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
      percent: {
        style: 'percent',
        useGrouping: false,
      },
    },
    pl: {
      currency: {
        style: 'currency',
        currency: 'PLN',
        notation: 'standard',
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
      percent: {
        style: 'percent',
        useGrouping: false,
      },
    },
  },
  datetimeFormats: {
    ua: {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
    pl: {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
  },
});

// Helper function to debug i18n issues
export const debugI18n = () => {
  console.log('i18n Configuration:');
  console.log('Current locale:', i18n.global.locale.value);
  console.log('Available locales:', Object.keys(i18n.global.messages.value));
  console.log('Sample translation (UA):', i18n.global.t('login.title', [], { locale: 'ua' }));
  console.log('Sample translation (PL):', i18n.global.t('login.title', [], { locale: 'pl' }));
  console.log('Carousel translation (UA):', i18n.global.t('homeView.carousel.solarPanelsDesc', [], { locale: 'ua' }));
  console.log('Carousel translation (PL):', i18n.global.t('homeView.carousel.solarPanelsDesc', [], { locale: 'pl' }));
  console.log('i18n initialized with locale:', i18n.global.locale.value);
console.log('Available locales:', i18n.global.availableLocales);
};

// Set document language attribute
document.documentElement.setAttribute('lang', defaultLocale);

// Provide a function to switch locales
export const setLocale = (locale) => {
  if (locale !== 'ua' && locale !== 'pl') {
    console.error('Invalid locale:', locale);
    return;
  }
  
  i18n.global.locale.value = locale;
  localStorage.setItem('userLocale', locale);
  document.documentElement.setAttribute('lang', locale);
  
  // Dispatch an event that components can listen for
  window.dispatchEvent(
    new CustomEvent('locale-changed', {
      detail: { locale: locale },
    })
  );
  
  console.log('Locale switched to:', locale);
  return locale;
};

export default i18n;