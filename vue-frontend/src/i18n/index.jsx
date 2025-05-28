// FILE: src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Enhanced fallback translations
const fallbackTranslations = {
  ua: {
    translation: {
      "common": {
        "home": "Головна",
        "categories": "Категорії",
        "loading": "Завантаження...",
        "category": "Категорія",
        "noProductsFound": "Товари не знайдені",
        "cart": "Кошик",
        "currency": "Валюта",
        "search": "Пошук",
        "email": "Електронна пошта",
        "password": "Пароль",
        "login": "Увійти",
        "signup": "Зареєструватися",
        "logout": "Вийти",
        "profile": "Профіль",
        "settings": "Налаштування",
        "save": "Зберегти",
        "cancel": "Скасувати",
        "delete": "Видалити",
        "edit": "Редагувати",
        "add": "Додати",
        "remove": "Видалити",
        "back": "Назад",
        "next": "Далі",
        "previous": "Попередній",
        "close": "Закрити",
        "open": "Відкрити",
        "yes": "Так",
        "no": "Ні",
        "ok": "ОК",
        "error": "Помилка",
        "success": "Успіх",
        "warning": "Попередження",
        "info": "Інформація"
      },
      "header": {
        "categories": {
          "batteries": "Батареї",
          "solarPanels": "Сонячні панелі",
          "inverters": "Інвертори",
          "generators": "Генератори"
        }
      },
      "homeView": {
        "title": "Ласкаво просимо до ScaleVolt",
        "subtitle": "Професійні енергетичні рішення",
        "generators": "Генератори",
        "industrialGenerators": "Промислові генератори для важких навантажень (100 кВт+)",
        "solarLightingTowers": "Освітлювальні вежі на сонячних батареях",
        "liftsAndCranes": "Підйомники та Крани",
        "dcChargingStations": "Швидкі Зарядні Станції (DC)",
        "acChargingStations": "Зарядні Станції Рівня 2 (AC)",
        "portableChargingDevices": "Портативні/Мобільні Зарядні Пристрої",
        "solarPanels": "Сонячні Панелі",
        "batteries": "Батареї",
        "inverters": "Інвертори",
        "solarSets": "Сонячні комплекти",
        "mountingSystems": "Система монтажу сонячних панелей",
        "chargingStations": "Зарядні станції",
        "cables": "Кабелі та проводи",
        "portablePower": "Портативна енергія",
        "carousel": {
          "solarPanelsDesc": "Високоякісні сонячні панелі для вашого дому",
          "batteriesDesc": "Надійні акумулятори для зберігання енергії",
          "invertersDesc": "Ефективні інвертори для перетворення енергії"
        }
      },
      "products": {
        "solar_panel_100w": "Сонячна панель 100Вт",
        "battery_pack_24v": "Акумулятор 24В",
        "inverter_1000w": "Інвертор 1000Вт",
        "price": "Ціна",
        "stock": "В наявності",
        "outOfStock": "Немає в наявності",
        "addToCart": "Добавити в кошик",
        "buyNow": "Купити зараз",
        "specifications": "Характеристики",
        "description": "Опис",
        "reviews": "Відгуки",
        "relatedProducts": "Схожі товари"
      },
      "cart": {
        "title": "Кошик для покупок",
        "empty": "Ваш кошик порожній",
        "quantity": "Кількість",
        "total": "Всього",
        "subtotal": "Підсумок",
        "shipping": "Доставка",
        "tax": "Податок",
        "checkout": "Оформити замовлення",
        "continueShopping": "Продовжити покупки",
        "removeItem": "Видалити товар",
        "updateQuantity": "Оновити кількість"
      },
      "auth": {
        "signIn": "Увійти",
        "signUp": "Зареєструватися",
        "forgotPassword": "Забули пароль?",
        "rememberMe": "Запам'ятати мене",
        "dontHaveAccount": "Немає акаунту?",
        "alreadyHaveAccount": "Вже є акаунт?",
        "createAccount": "Створити акаунт",
        "resetPassword": "Скинути пароль",
        "newPassword": "Новий пароль",
        "confirmPassword": "Підтвердити пароль"
      },
      "legal": {
        "termsAndConditions": "Умови та положення",
        "rentalServiceTerms": "Умови оренди",
        "purchaseTerms": "Умови покупки",
        "paymentTerms": "Умови оплати",
        "warrantyTerms": "Гарантійні умови",
        "privacyPolicy": "Політика конфіденційності",
        "corporateInfo": "Корпоративна інформація"
      },
      "login": {
        "title": "Вхід"
      },
      "errors": {
        "pageNotFound": "Сторінка не знайдена",
        "serverError": "Помилка сервера",
        "networkError": "Помилка мережі",
        "somethingWentWrong": "Щось пішло не так",
        "pleaseContactSupport": "Будь ласка, зв'яжіться з підтримкою, якщо проблема не зникне",
        "tryAgain": "Спробувати ще раз",
        "goHome": "На головну"
      }
    }
  },
  pl: {
    translation: {
      "common": {
        "home": "Dom",
        "categories": "Kategorie",
        "loading": "Ładowanie...",
        "category": "Kategoria",
        "noProductsFound": "Nie znaleziono produktów",
        "cart": "Koszyk",
        "currency": "Waluta",
        "search": "Szukaj",
        "email": "Email",
        "password": "Hasło",
        "login": "Zaloguj",
        "signup": "Zarejestruj",
        "logout": "Wyloguj",
        "profile": "Profil",
        "settings": "Ustawienia",
        "save": "Zapisz",
        "cancel": "Anuluj",
        "delete": "Usuń",
        "edit": "Edytuj",
        "add": "Dodaj",
        "remove": "Usuń",
        "back": "Wstecz",
        "next": "Dalej",
        "previous": "Poprzedni",
        "close": "Zamknij",
        "open": "Otwórz",
        "yes": "Tak",
        "no": "Nie",
        "ok": "OK",
        "error": "Błąd",
        "success": "Sukces",
        "warning": "Ostrzeżenie",
        "info": "Informacja"
      },
      "header": {
        "categories": {
          "batteries": "Baterie",
          "solarPanels": "Panele słoneczne",
          "inverters": "Falowniki",
          "generators": "Generatory"
        }
      },
      "homeView": {
        "title": "Witamy w ScaleVolt",
        "subtitle": "Profesjonalne rozwiązania energetyczne",
        "generators": "Generatory",
        "industrialGenerators": "Generatory przemysłowe dla ciężkich obciążeń (100 kW+)",
        "solarLightingTowers": "Wieże oświetleniowe zasilane energią słoneczną",
        "liftsAndCranes": "Podnośniki i żurawie",
        "dcChargingStations": "Szybkie stacje ładowania (DC)",
        "acChargingStations": "Stacje ładowania poziomu 2 (AC)",
        "portableChargingDevices": "Przenośne/mobilne urządzenia ładujące",
        "solarPanels": "Panele słoneczne",
        "batteries": "Baterie",
        "inverters": "Falowniki",
        "solarSets": "Zestawy słoneczne",
        "mountingSystems": "System montażu paneli słonecznych",
        "chargingStations": "Stacje ładowania",
        "cables": "Kable i przewody",
        "portablePower": "Energia przenośna",
        "carousel": {
          "solarPanelsDesc": "Wysokiej jakości panele słoneczne dla Twojego domu",
          "batteriesDesc": "Niezawodne baterie do przechowywania energii",
          "invertersDesc": "Wydajne falowniki do konwersji energii"
        }
      },
      "products": {
        "solar_panel_100w": "Panel słoneczny 100W",
        "battery_pack_24v": "Pakiet baterii 24V",
        "inverter_1000w": "Falownik 1000W",
        "price": "Cena",
        "stock": "W magazynie",
        "outOfStock": "Brak w magazynie",
        "addToCart": "Dodaj do koszyka",
        "buyNow": "Kup teraz",
        "specifications": "Specyfikacje",
        "description": "Opis",
        "reviews": "Recenzje",
        "relatedProducts": "Powiązane produkty"
      },
      "cart": {
        "title": "Koszyk zakupowy",
        "empty": "Twój koszyk jest pusty",
        "quantity": "Ilość",
        "total": "Razem",
        "subtotal": "Suma częściowa",
        "shipping": "Wysyłka",
        "tax": "Podatek",
        "checkout": "Finalizuj zamówienie",
        "continueShopping": "Kontynuuj zakupy",
        "removeItem": "Usuń przedmiot",
        "updateQuantity": "Aktualizuj ilość"
      },
      "auth": {
        "signIn": "Zaloguj się",
        "signUp": "Zarejestruj się",
        "forgotPassword": "Zapomniałeś hasła?",
        "rememberMe": "Zapamiętaj mnie",
        "dontHaveAccount": "Nie masz konta?",
        "alreadyHaveAccount": "Masz już konto?",
        "createAccount": "Utwórz konto",
        "resetPassword": "Resetuj hasło",
        "newPassword": "Nowe hasło",
        "confirmPassword": "Potwierdź hasło"
      },
      "legal": {
        "termsAndConditions": "Regulamin",
        "rentalServiceTerms": "Warunki wynajmu",
        "purchaseTerms": "Warunki zakupu",
        "paymentTerms": "Warunki płatności",
        "warrantyTerms": "Warunki gwarancji",
        "privacyPolicy": "Polityka prywatności",
        "corporateInfo": "Informacje korporacyjne"
      },
      "login": {
        "title": "Logowanie"
      },
      "errors": {
        "pageNotFound": "Strona nie znaleziona",
        "serverError": "Błąd serwera",
        "networkError": "Błąd sieci",
        "somethingWentWrong": "Coś poszło nie tak",
        "pleaseContactSupport": "Skontaktuj się z pomocą techniczną, jeśli problem się powtórzy",
        "tryAgain": "Spróbuj ponownie",
        "goHome": "Idź do domu"
      }
    }
  },
  en: {
    translation: {
      "common": {
        "home": "Home",
        "categories": "Categories",
        "loading": "Loading...",
        "category": "Category",
        "noProductsFound": "No products found",
        "cart": "Cart",
        "currency": "Currency",
        "search": "Search",
        "email": "Email",
        "password": "Password",
        "login": "Login",
        "signup": "Sign Up",
        "logout": "Logout",
        "profile": "Profile",
        "settings": "Settings",
        "save": "Save",
        "cancel": "Cancel",
        "delete": "Delete",
        "edit": "Edit",
        "add": "Add",
        "remove": "Remove",
        "back": "Back",
        "next": "Next",
        "previous": "Previous",
        "close": "Close",
        "open": "Open",
        "yes": "Yes",
        "no": "No",
        "ok": "OK",
        "error": "Error",
        "success": "Success",
        "warning": "Warning",
        "info": "Information"
      },
      "header": {
        "categories": {
          "batteries": "Batteries",
          "solarPanels": "Solar Panels",
          "inverters": "Inverters",
          "generators": "Generators"
        }
      },
      "homeView": {
        "title": "Welcome to ScaleVolt",
        "subtitle": "Professional Energy Solutions",
        "generators": "Generators",
        "industrialGenerators": "Industrial generators for heavy loads (100 kW+)",
        "solarLightingTowers": "Solar-powered lighting towers",
        "liftsAndCranes": "Lifts and Cranes",
        "dcChargingStations": "Fast Charging Stations (DC)",
        "acChargingStations": "Level 2 Charging Stations (AC)",
        "portableChargingDevices": "Portable/Mobile Charging Devices",
        "solarPanels": "Solar Panels",
        "batteries": "Batteries",
        "inverters": "Inverters",
        "solarSets": "Solar Sets",
        "mountingSystems": "Solar panel mounting system",
        "chargingStations": "Charging Stations",
        "cables": "Cables and Wires",
        "portablePower": "Portable Power",
        "carousel": {
          "solarPanelsDesc": "High-quality solar panels for your home",
          "batteriesDesc": "Reliable batteries for energy storage",
          "invertersDesc": "Efficient inverters for energy conversion"
        }
      },
      "products": {
        "solar_panel_100w": "Solar Panel 100W",
        "battery_pack_24v": "Battery Pack 24V",
        "inverter_1000w": "Inverter 1000W",
        "price": "Price",
        "stock": "In Stock",
        "outOfStock": "Out of Stock",
        "addToCart": "Add to Cart",
        "buyNow": "Buy Now",
        "specifications": "Specifications",
        "description": "Description",
        "reviews": "Reviews",
        "relatedProducts": "Related Products"
      },
      "cart": {
        "title": "Shopping Cart",
        "empty": "Your cart is empty",
        "quantity": "Quantity",
        "total": "Total",
        "subtotal": "Subtotal",
        "shipping": "Shipping",
        "tax": "Tax",
        "checkout": "Checkout",
        "continueShopping": "Continue Shopping",
        "removeItem": "Remove Item",
        "updateQuantity": "Update Quantity"
      },
      "auth": {
        "signIn": "Sign In",
        "signUp": "Sign Up",
        "forgotPassword": "Forgot Password?",
        "rememberMe": "Remember Me",
        "dontHaveAccount": "Don't have an account?",
        "alreadyHaveAccount": "Already have an account?",
        "createAccount": "Create Account",
        "resetPassword": "Reset Password",
        "newPassword": "New Password",
        "confirmPassword": "Confirm Password"
      },
      "legal": {
        "termsAndConditions": "Terms and Conditions",
        "rentalServiceTerms": "Rental service terms",
        "purchaseTerms": "Purchase terms",
        "paymentTerms": "Payment terms",
        "warrantyTerms": "Warranty terms",
        "privacyPolicy": "Privacy Policy",
        "corporateInfo": "Corporate information"
      },
      "login": {
        "title": "Login"
      },
      "errors": {
        "pageNotFound": "Page Not Found",
        "serverError": "Server Error",
        "networkError": "Network Error",
        "somethingWentWrong": "Something went wrong",
        "pleaseContactSupport": "Please contact support if the problem persists",
        "tryAgain": "Try Again",
        "goHome": "Go Home"
      }
    }
  }
};

// Async translation loader with better error handling
const loadTranslations = async () => {
  const translations = { ...fallbackTranslations };
  
  if (typeof window !== 'undefined') {
    const supportedLocales = ['ua', 'pl', 'en'];
    
    for (const locale of supportedLocales) {
      try {
        const response = await fetch(`/locales/${locale}.json`);
        if (response.ok) {
          const data = await response.json();
          translations[locale] = { translation: data };
          console.log(`✅ Loaded ${locale} translations from file`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to load ${locale} translations, using fallback`);
      }
    }
  }
  
  return translations;
};

// Determine default locale with better logic
const getDefaultLocale = () => {
  if (typeof window === 'undefined') return 'ua';
  
  const savedLocale = localStorage.getItem('userLocale');
  if (savedLocale && ['ua', 'pl', 'en'].includes(savedLocale)) {
    return savedLocale;
  }
  
  const browserLang = navigator.language.split('-')[0];
  const supportedBrowserLangs = { 'uk': 'ua', 'pl': 'pl', 'en': 'en' };
  
  return supportedBrowserLangs[browserLang] || 'ua';
};

const defaultLocale = getDefaultLocale();

// Initialize i18next with better configuration
const initializeI18n = async () => {
  const translations = await loadTranslations();
  
  await i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      lng: defaultLocale,
      fallbackLng: 'ua',
      debug: import.meta.env.MODE === 'development',
      
      // Backend configuration
      backend: {
        loadPath: '/locales/{{lng}}.json',
        addPath: '/locales/add/{{lng}}/{{ns}}',
        crossDomain: false,
        withCredentials: false,
        overrideMimeType: false,
        requestOptions: {
          cache: 'default',
          credentials: 'same-origin',
          mode: 'cors',
        },
      },
      
      // Language detection
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        lookupLocalStorage: 'userLocale',
        caches: ['localStorage'],
        checkWhitelist: true,
      },
      
      // Interpolation
      interpolation: {
        escapeValue: false, // React already escapes
        formatSeparator: ',',
        format: function(value, format, lng) {
          if (format === 'currency') return formatNumber(value, 'currency', lng);
          if (format === 'decimal') return formatNumber(value, 'decimal', lng);
          if (format === 'percent') return formatNumber(value, 'percent', lng);
          if (format === 'date') return formatDate(value, 'short', lng);
          if (format === 'datetime') return formatDate(value, 'long', lng);
          return value;
        }
      },
      
      // React specific
      react: {
        useSuspense: false,
        wait: false,
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span'],
      },
      
      // Resources
      resources: translations,
      
      // Namespaces
      ns: ['translation'],
      defaultNS: 'translation',
      
      // Key handling
      keySeparator: '.',
      nsSeparator: ':',
      
      // Pluralization
      pluralSeparator: '_',
      contextSeparator: '_',
      
      // Loading
      load: 'languageOnly',
      preload: ['ua', 'pl', 'en'],
      
      // Caching
      updateMissing: false,
      saveMissing: false,
    });
    
  // Set document language
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', i18n.language);
  }
  
  return i18n;
};

// Initialize immediately
initializeI18n().catch(console.error);

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

export default i18n;Professional Energy Solutions',
        solarPanels: 'Solar Panels',
        batteries: 'Batteries',
        inverters: 'Inverters',
        generators: 'Generators',
        chargingStations: 'Charging Stations',
        cables: 'Cables & Wires',
        mountingSystems: 'Mounting Systems',
        portablePower: 'Portable Power'
      },
      products: {
        solar_panel_100w: 'Solar Panel 100W',
        battery_pack_24v: 'Battery Pack 24V',
        inverter_1000w: 'Inverter 1000W',
        price: 'Price',
        stock: 'In Stock',
        outOfStock: 'Out of Stock',
        addToCart: 'Add to Cart',
        buyNow: 'Buy Now',
        specifications: 'Specifications',
        description: 'Description',
        reviews: 'Reviews',
        relatedProducts: 'Related Products'
      },
      cart: {
        title: 'Shopping Cart',
        empty: 'Your cart is empty',
        quantity: 'Quantity',
        total: 'Total',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        tax: 'Tax',
        checkout: 'Checkout',
        continueShopping: 'Continue Shopping',
        removeItem: 'Remove Item',
        updateQuantity: 'Update Quantity'
      },
      auth: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        forgotPassword: 'Forgot Password?',
        rememberMe: 'Remember Me',
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: 'Already have an account?',
        createAccount: 'Create Account',
        resetPassword: 'Reset Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password'
      },
      errors: {
        pageNotFound: 'Page Not Found',
        serverError: 'Server Error',
        networkError: 'Network Error',
        somethingWentWrong: 'Something went wrong',
        pleaseContactSupport: 'Please contact support if the problem persists',
        tryAgain: 'Try Again',
        goHome: 'Go Home'
      }
    }
  },
  ua: {
    translation: {
      common: {
        home: 'Головна',
        cart: 'Кошик',
        loading: 'Завантаження...',
        currency: 'Валюта',
        search: 'Пошук',
        email: 'Електронна пошта',
        password: 'Пароль',
        login: 'Увійти',
        signup: 'Зареєструватися',
        logout: 'Вийти',
        profile: 'Профіль',
        settings: 'Налаштування',
        save: 'Зберегти',
        cancel: 'Скасувати',
        delete: 'Видалити',
        edit: 'Редагувати',
        add: 'Додати',
        remove: 'Видалити',
        back: 'Назад',
        next: 'Далі',
        previous: 'Попередній',
        close: 'Закрити',
        open: 'Відкрити',
        yes: 'Так',
        no: 'Ні',
        ok: 'ОК',
        error: 'Помилка',
        success: 'Успіх',
        warning: 'Попередження',
        info: 'Інформація'
      },
      homeView: {
        title: 'Ласкаво просимо до ScaleVolt',
        subtitle: 'Професійні енергетичні рішення',
        solarPanels: 'Сонячні панелі',
        batteries: 'Акумулятори',
        inverters: 'Інвертори',
        generators: 'Генератори',
        chargingStations: 'Зарядні станції',
        cables: 'Кабелі та проводи',
        mountingSystems: 'Системи кріплення',
        portablePower: 'Портативна енергія'
      },
      products: {
        solar_panel_100w: 'Сонячна панель 100Вт',
        battery_pack_24v: 'Акумулятор 24В',
        inverter_1000w: 'Інвертор 1000Вт',
        price: 'Ціна',
        stock: 'В наявності',
        outOfStock: 'Немає в наявності',
        addToCart: 'Добавити в кошик',
        buyNow: 'Купити зараз',
        specifications: 'Характеристики',
        description: 'Опис',
        reviews: 'Відгуки',
        relatedProducts: 'Схожі товари'
      },
      cart: {
        title: 'Кошик для покупок',
        empty: 'Ваш кошик порожній',
        quantity: 'Кількість',
        total: 'Всього',
        subtotal: 'Підсумок',
        shipping: 'Доставка',
        tax: 'Податок',
        checkout: 'Оформити замовлення',
        continueShopping: 'Продовжити покупки',
        removeItem: 'Видалити товар',
        updateQuantity: 'Оновити кількість'
      },
      auth: {
        signIn: 'Увійти',
        signUp: 'Зареєструватися',
        forgotPassword: 'Забули пароль?',
        rememberMe: "Запам'ятати мене",
        dontHaveAccount: 'Немає акаунту?',
        alreadyHaveAccount: 'Вже є акаунт?',
        createAccount: 'Створити акаунт',
        resetPassword: 'Скинути пароль',
        newPassword: 'Новий пароль',
        confirmPassword: 'Підтвердити пароль'
      },
      errors: {
        pageNotFound: 'Сторінка не знайдена',
        serverError: 'Помилка сервера',
        networkError: 'Помилка мережі',
        somethingWentWrong: 'Щось пішло не так',
        pleaseContactSupport: "Будь ласка, зв'яжіться з підтримкою, якщо проблема не зникне",
        tryAgain: 'Спробувати ще раз',
        goHome: 'На головну'
      }
    }
  },
  pl: {
    translation: {
      common: {
        home: 'Dom',
        cart: 'Koszyk',
        loading: 'Ładowanie...',
        currency: 'Waluta',
        search: 'Szukaj',
        email: 'Email',
        password: 'Hasło',
        login: 'Zaloguj',
        signup: 'Zarejestruj',
        logout: 'Wyloguj',
        profile: 'Profil',
        settings: 'Ustawienia',
        save: 'Zapisz',
        cancel: 'Anuluj',
        delete: 'Usuń',
        edit: 'Edytuj',
        add: 'Dodaj',
        remove: 'Usuń',
        back: 'Wstecz',
        next: 'Dalej',
        previous: 'Poprzedni',
        close: 'Zamknij',
        open: 'Otwórz',
        yes: 'Tak',
        no: 'Nie',
        ok: 'OK',
        error: 'Błąd',
        success: 'Sukces',
        warning: 'Ostrzeżenie',
        info: 'Informacja'
      },
      homeView: {
        title: 'Witamy w ScaleVolt',
        subtitle: 'Profesjonalne rozwiązania energetyczne',
        solarPanels: 'Panele słoneczne',
        batteries: 'Baterie',
        inverters: 'Inwertery',
        generators: 'Generatory',
        chargingStations: 'Stacje ładowania',
        cables: 'Kable i przewody',
        mountingSystems: 'Systemy montażowe',
        portablePower: 'Energia przenośna'
      },
      products: {
        solar_panel_100w: 'Panel słoneczny 100W',
        battery_pack_24v: 'Pakiet baterii 24V',
        inverter_1000w: 'Inwerter 1000W',
        price: 'Cena',
        stock: 'W magazynie',
        outOfStock: 'Brak w magazynie',
        addToCart: 'Dodaj do koszyka',
        buyNow: 'Kup teraz',
        specifications: 'Specyfikacje',
        description: 'Opis',
        reviews: 'Recenzje',
        relatedProducts: 'Powiązane produkty'
      },
      cart: {
        title: 'Koszyk zakupowy',
        empty: 'Twój koszyk jest pusty',
        quantity: 'Ilość',
        total: 'Razem',
        subtotal: 'Suma częściowa',
        shipping: 'Wysyłka',
        tax: 'Podatek',
        checkout: 'Finalizuj zamówienie',
        continueShopping: 'Kontynuuj zakupy',
        removeItem: 'Usuń przedmiot',
        updateQuantity: 'Aktualizuj ilość'
      },
      auth: {
        signIn: 'Zaloguj się',
        signUp: 'Zarejestruj się',
        forgotPassword: 'Zapomniałeś hasła?',
        rememberMe: 'Zapamiętaj mnie',
        dontHaveAccount: 'Nie masz konta?',
        alreadyHaveAccount: 'Masz już konto?',
        createAccount: 'Utwórz konto',
        resetPassword: 'Resetuj hasło',
        newPassword: 'Nowe hasło',
        confirmPassword: 'Potwierdź hasło'
      },
      errors: {
        pageNotFound: 'Strona nie znaleziona',
        serverError: 'Błąd serwera',
        networkError: 'Błąd sieci',
        somethingWentWrong: 'Coś poszło nie tak',
        pleaseContactSupport: 'Skontaktuj się z pomocą techniczną, jeśli problem się powtórzy',
        tryAgain: 'Spróbuj ponownie',
        goHome: 'Idź do domu'
      }
    }
  }
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('userLocale') || 'ua', // Default language
    fallbackLng: 'ua', // Fallback language
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    // Detection options
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator'],
      
      // Keys to look for
      lookupLocalStorage: 'userLocale',
      
      // Cache user language
      caches: ['localStorage'],
      
      // Only detect languages that are in the resources
      checkWhitelist: true
    },
    
    // React i18next options
    react: {
      // Wait for all translations to be loaded before rendering
      wait: true,
      
      // Use Suspense for async loading
      useSuspense: false
    },
    
    // Debug mode (set to false in production)
    debug: process.env.NODE_ENV === 'development'
  });

export default i18n;