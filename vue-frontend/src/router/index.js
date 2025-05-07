// FILE: vue-frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { i18n } from '@/i18n/index.js';
import { detectUserLocation, getLanguageFromCountry } from '@/utils/locationDetector'; // Add this import

// View Imports
import HomeView from '@/views/HomeView.vue';
import SolarPanelsView from '@/views/SolarPanelsView.vue';
import BatteriesView from '@/views/BatteriesView.vue';
import InvertersView from '@/views/InvertersView.vue';
import SolarSetsView from '@/views/SolarSetsView.vue';
import ChargingStationsView from '@/views/ChargingStationsView.vue';
import CablesWiresView from '@/views/CablesWiresView.vue';
import LoginView from '@/views/LoginView.vue';
import CartView from '@/views/CartView.vue';
import SignUpView from '@/views/SignUpView.vue';
import CheckoutView from '@/views/CheckoutView.vue';
import CheckoutSuccess from '@/views/CheckoutSuccess.vue';
import CheckoutCancel from '@/views/CheckoutCancel.vue';
import CheckoutAuthView from '@/views/CheckoutAuthView.vue'; // Added checkout auth view
import CategoryView from '@/views/CategoryView.vue';
import ProductPage from '@/views/ProductPage.vue';
import PortableSolarPanelsView from '@/views/PortableSolarPanelsView.vue';
import SolarMountSystemView from '@/views/SolarMountSystemView.vue';
import PortablePowerStationView from '@/views/PortablePowerStationView.vue';
import UserProfileView from '@/views/UserProfileView.vue';
// Import the layout component
import Layout from '@/components/Layout.vue';
import DeliveryWarrantyReturnsView from '@/views/DeliveryWarrantyReturnsView.vue';
import CompanyView from '@/views/CompanyView.vue';
import LiftsAndCranesCategory from '@/views/LiftsAndCranesCategory.vue';
import PrivacyView from '@/views/PrivacyView.vue';
import ErrorView from '@/views/ErrorView.vue';
import LegalTermsView from '@/views/LegalTermsView.vue';
//import { translateText, translateProduct } from '../utils/translationService.js';
import { checkoutGuard } from './guards/checkoutGuard'; // Import the checkout guard
import AuthView from '@/views/AuthView.vue';
import ProductRental from '@/views/ProductRental.vue';


// Define your routes for use within the region layout
const productRoutes = [
  { path: '', name: 'Home', component: HomeView },
  { path: 'solar-panels', name: 'SolarPanels', component: SolarPanelsView },
  { path: 'batteries', name: 'Batteries', component: BatteriesView },
  { path: 'inverters', name: 'Inverters', component: InvertersView },
  {
    path: 'mounting-systems',
    name: 'SolarMountSystem',
    component: SolarMountSystemView
  },
  {
    path: 'dc-charging-stations',
    name: 'DCChargingStations',
    component: () => import('../views/CategoryView.vue')
  },
  {
    path: 'ac-charging-stations',
    name: 'ACChargingStations',
    component: () => import('../views/CategoryView.vue')
  },
  {
    path: 'portable-charging-devices',
    name: 'PortableChargingDevices',
    component: () => import('../views/CategoryView.vue')
  },
  {
    path: 'lifts-and-cranes',
    name: 'LiftsAndCranes',
    component: LiftsAndCranesCategory
  },
  {
    path: 'lifts-and-cranes/scissor-lifts',
    name: 'ScissorLifts',
    component: LiftsAndCranesCategory
  },
  {
    path: 'lifts-and-cranes/boom-lifts',
    name: 'BoomLifts',
    component: LiftsAndCranesCategory
  },
  {
    path: 'admin/translations',
    name: 'TranslationManager',
    component: () => import('../views/admin/TranslationManager.vue'),
    meta: { requiresAuth: true }
  },
  { path: 'cables-wires', name: 'CablesWires', component: CablesWiresView },
  {
    path: 'sets-of-solar-power-plants/:id?',
    name: 'SolarSets',
    component: SolarSetsView,
    props: true
  },
  {
    path: 'портативна-електростанція',
    name: 'portable-power-station',
    component: PortablePowerStationView
  },
  // Updated auth routes to use the new AuthView component
  { path: 'auth', name: 'Auth', component: AuthView },
  { path: 'login', redirect: 'auth' },
  { path: 'signup', redirect: 'auth' },
  
  { path: 'cart', name: 'Cart', component: CartView },
  
  // Updated Checkout routes with checkout guard
  { 
    path: 'checkout', 
    name: 'Checkout', 
    component: CheckoutView, 
    beforeEnter: checkoutGuard 
  },
  { 
    path: 'checkout/success', 
    name: 'CheckoutSuccess', 
    component: CheckoutSuccess, 
    beforeEnter: checkoutGuard 
  },
  { 
    path: 'checkout/cancel', 
    name: 'CheckoutCancel', 
    component: CheckoutCancel 
  },
  // New checkout authentication route
  { 
    path: 'checkout/auth', 
    name: 'CheckoutAuth', 
    component: CheckoutAuthView 
  },
  
  { path: 'category/:id', name: 'Category', component: CategoryView, props: true },
  { path: 'product/:id', name: 'Product', component: ProductPage, props: true },
  {
    path: 'customer-cases',
    name: 'CustomerCases',
    component: () => import('@/views/CustomerCases.vue')
  },
  {
    path: 'delivery-warranty-returns',
    name: 'DeliveryWarrantyReturns',
    component: DeliveryWarrantyReturnsView
  },
  { 
    path: 'portable-solar-panels', 
    name: 'PortableSolarPanels', 
    component: PortableSolarPanelsView 
  },
  { 
    path: 'profile', 
    name: 'UserProfile', 
    component: UserProfileView
  },
  {
    path: 'generators',
    name: 'Generators',
    component: CategoryView  // Use a generic CategoryView or create specific views
  },
  {
    path: 'industrial-generators',
    name: 'IndustrialGenerators',
    component: CategoryView
  },
  {
    path: 'solar-lighting-towers',
    name: 'SolarLightingTowers',
    component: CategoryView
  },
  {
    path: 'company',
    name: 'Company',
    component: CompanyView,
    meta: {
      title: 'Компанія | SCALEVOLT'
    }
  },
  {
    path: 'privacy-policy',
    name: 'Privacy',
    component: PrivacyView
  },
  {
    path: 'error/:errorCode?',
    name: 'Error',
    component: ErrorView,
    props: true
  },
  {
    path: 'legal-terms',
    name: 'LegalTerms',
    component: LegalTermsView
  },
  {
    path: 'faq',
    name: 'FAQ',
    component: () => import('../views/FAQView.vue')
  },
  // Catch-all route at the end of this section
  {
    path: ':pathMatch(.*)*',
    name: 'NotFound',
    component: ErrorView,
    props: { errorCode: '404' }
  },
  {
    path: '/rent/:id',
    name: 'ProductRental',
    component: ProductRental,
    props: true
  }
];

// Main routes array
const routes = [
  // Region-specific routing
  {
    path: '/:region?',
    component: Layout,
    beforeEnter: async (to, from, next) => {
      // FIXED: Update valid regions to match what you're using in URLs
      const validRegions = ['ua', 'pl', 'en'];
      
      // If valid region is specified
      if (to.params.region && validRegions.includes(to.params.region)) {
        // Set the locale based on URL region
        i18n.global.locale.value = to.params.region;
        localStorage.setItem('userLocale', to.params.region);
        document.documentElement.setAttribute('lang', to.params.region);
        next();
      } 
      // If no region specified (root path)
      else if (!to.params.region || to.path === '/') {
        // Try to detect user's location if accessing root path for the first time
        if (!localStorage.getItem('userLocale') && (to.path === '/' || to.fullPath === '/')) {
          try {
            console.log('Detecting user location...');
            const ipLocation = await detectUserLocation();
            console.log('Location detected by IP:', ipLocation);
            
            if (!ipLocation.error) {
              const detectedLanguage = getLanguageFromCountry(ipLocation.country);
              if (detectedLanguage && validRegions.includes(detectedLanguage)) {
                console.log(`Setting language to ${detectedLanguage} based on detected country ${ipLocation.country}`);
                localStorage.setItem('userLocale', detectedLanguage);
                next({ path: `/${detectedLanguage}` });
                return;
              }
            }
          } catch (error) {
            console.error('Error in location detection:', error);
          }
        }
        
        // No region specified or location detection failed, redirect to default or stored region
        const savedRegion = localStorage.getItem('userLocale') || 'ua';
        // Avoid redirect loop on root path
        if (to.path === '/') {
          next({ path: `/${savedRegion}` });
        } else {
          next({ path: `/${savedRegion}${to.path}` });
        }
      } 
      // If invalid region
      else {
        // Invalid region, redirect to default
        next({ path: '/ua' });
      }
    },
    children: productRoutes
  },
  // Remove redundant routes that are creating conflicts
  // REMOVED: localized-home and localized-category routes
  
  // Fallback route
  {
    path: '/:pathMatch(.*)*',
    redirect: () => {
      const locale = localStorage.getItem('userLocale') || i18n.global.locale.value || 'ua';
      return `/${locale}`;
    }
  }
];

const router = createRouter({
  history: createWebHistory(), // ← switch from hash to web history
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// FIXED: Simplify the navigation guard
router.beforeEach((to, from, next) => {
  // Set page title if available
  const title = to.meta.title;
  if (title) {
    document.title = title;
  } else {
    document.title = 'SCALEVOLT';
  }
  
  // The region handling is done in the route beforeEnter above,
  // so we don't need additional language redirects here
  next();
});

export default router;