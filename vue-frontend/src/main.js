// FILE: vue-frontend/src/main.js
import { createApp, watch, ref } from 'vue';
import App from './App.vue';
import router from '@/router';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { i18n, debugI18n } from './i18n/index.js';
import { auth } from '@/firebase';
import './style.css';
import { getUserCurrencyPreference } from '@/services/currency';
import { useAuthStore } from './stores/auth';
import { createHead } from '@vueuse/head';

// Force hide any loading screens immediately
window.BYPASS_LOADING = true;
document.addEventListener('DOMContentLoaded', () => {
  const loadingElements = document.querySelectorAll('[class*="loading"], [id*="loading"], .loading-container');
  loadingElements.forEach(el => {
    el.style.display = 'none';
  });
});

// ✅ Add favicon programmatically to prevent 404 errors
function addFavicon() {
  var link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/x-icon';
  link.href = '/favicon.ico';
  document.head.appendChild(link);
}

// ✅ Configure the Toast Notifications
var toastOptions = {
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  transition: 'Vue-Toastification__bounce',
  maxToasts: 5,
  newestOnTop: true
};

// ✅ Enhanced Error Handler (Professional Error Page)
function globalErrorHandler(err, instance, info) {
  console.error('🚨 Vue Error:', err, '\nComponent:', instance?.$options?.name, '\nInfo:', info);
  document.getElementById('app').innerHTML = `
    <div style="color: red; padding: 20px;">
      <h2>⚠️ Application Error</h2>
      <p>${err.toString()}</p>
      <p><strong>Component:</strong> ${instance?.$options?.name || 'Unknown'}</p>
    </div>
  `;
}

// ✅ Initialize the Vue App with Plugins
function initializeApp() {
  try {
    const app = createApp(App);
    const pinia = createPinia();
    const head = createHead();
    
    app.use(pinia);
    app.use(head);
    
    // Initialize the auth store to connect with Firebase
    // This needs to happen AFTER pinia is installed but BEFORE app is mounted
    const authStore = useAuthStore();
    
    // IMPORTANT: Don't wait for auth initialization - just try to init
    try {
      authStore.init();
    } catch (e) {
      console.warn('Auth initialization failed, continuing anyway:', e);
    }
    
    // Load saved locale from localStorage and ensure it's applied
    const savedLocale = localStorage.getItem('userLocale');
    if (savedLocale) {
      i18n.global.locale.value = savedLocale;
      console.log('Loaded saved locale:', savedLocale);
    }
    
    // Correctly watch for locale changes
    app.config.globalProperties.$locale = ref(i18n.global.locale.value);
    
    // Enhanced locale change handling
    watch(() => i18n.global.locale.value, (newLocale) => {
      console.log('🌍 Locale changed to:', newLocale);
      document.documentElement.setAttribute('lang', newLocale);
      localStorage.setItem('userLocale', newLocale);
      app.config.globalProperties.$locale.value = newLocale;
      
      // Debug - print a sample translation to verify it's working
      console.log('Sample translation:', i18n.global.t('login.title'));
      
      // Update currency based on locale if user hasn't explicitly set it
      if (!localStorage.getItem('userCurrency')) {
        const newCurrency = newLocale === 'pl' ? 'PLN' : 'UAH';
        app.config.globalProperties.$currencyStore.value.currentCurrency = newCurrency;
        localStorage.setItem('userCurrency', newCurrency);
      }
      
      // Trigger a custom event for components to detect
      window.dispatchEvent(new CustomEvent('locale-changed', { detail: newLocale }));
    });
    
    // Add currency store
    const currencyStore = ref({
      currentCurrency: getUserCurrencyPreference() || 
                      (i18n.global.locale.value === 'pl' ? 'PLN' : 'UAH'),
      setCurrency: function(currency) {
        this.currentCurrency = currency;
        localStorage.setItem('userCurrency', currency);
      }
    });
    
    // Add currency store to both global properties and as provide/inject
    app.config.globalProperties.$currencyStore = currencyStore;
    app.provide('currencyStore', currencyStore);
    
    // Enhanced language switching method
    app.config.globalProperties.$switchLocale = function(locale) {
      console.log('Switching locale to:', locale);
      
      // Change i18n locale
      i18n.global.locale.value = locale;
      
      // Save to localStorage
      localStorage.setItem('userLocale', locale);
      
      // Update document lang attribute
      document.documentElement.setAttribute('lang', locale);
      
      // Dispatch custom event for components
      window.dispatchEvent(new CustomEvent('locale-changed', { detail: locale }));
    };
    
    app.use(router);
    app.use(i18n);
    app.use(Toast, toastOptions);
    
    // ✅ Add a global error handler
    app.config.errorHandler = globalErrorHandler;
    
    // Debug i18n setup
    debugI18n();
    
    // Make i18n available globally for debugging
    window.i18n = i18n;
    
    // ✅ IMPORTANT CHANGE: Mount the app immediately, don't wait for Firebase
    app.mount('#app');
    
    // Still listen for auth changes, but don't block rendering
    auth.onAuthStateChanged(function(user) {
      if (user) {
        console.log('✅ User is logged in:', user);
      } else {
        console.log('🚨 User is signed out');
      }
    });
    
  } catch (error) {
    console.error('🔥 Critical App Error:', error);
    document.getElementById('app').innerHTML = `
      <div style="color: red; padding: 20px;">
        <h2>💀 Application Crash</h2>
        <pre>${error.stack}</pre>
      </div>
    `;
  }
}

// Enhanced global methods for debugging i18n in the browser console
window.switchLanguage = function(locale) {
  console.log('Manually switching to', locale);
  i18n.global.locale.value = locale;
  localStorage.setItem('userLocale', locale);
  document.documentElement.setAttribute('lang', locale);
  
  // Dispatch custom event
  window.dispatchEvent(new CustomEvent('locale-changed', { detail: locale }));
  
  console.log('After switch - Current locale:', i18n.global.locale.value);
  return 'Language switched to ' + locale;
};

window.checkTranslations = function() {
  const locale = i18n.global.locale.value;
  console.log('Current locale:', locale);
  console.log('Sample translation:', i18n.global.t('login.title'));
  console.log('Footer translations available?', 
    !!i18n.global.messages.value[locale]?.footer);
  return 'Checked translations for ' + locale;
};

window.reloadApp = function() {
  window.location.reload();
  return 'Reloading application...';
};

// Add a function to bypass loading screens
window.bypassLoading = function() {
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
        parent.style.display = 'none';
        parent = parent.parentElement;
      }
    }
  });
  
  return 'Attempted to bypass loading screens';
};

// Set a timeout to hide loading screens
setTimeout(window.bypassLoading, 100);
setTimeout(window.bypassLoading, 500);
setTimeout(window.bypassLoading, 1000);

// ✅ 👇 Start everything in the correct order
addFavicon();
initializeApp();
const head = createHead()
// Create and export app before mounting
const app = createApp(App);
app.use(head) 
 