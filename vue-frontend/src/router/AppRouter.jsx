// FILE: src/router/AppRouter.jsx
import React, { useEffect, useState, Suspense, lazy } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Navigate, 
  useParams, 
  useNavigate, 
  Outlet,
  useLocation 
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Layout component
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';

// View Imports - Eager loaded for critical routes
import HomeView from '../views/Home/HomeView';
import CartView from '../views/CartView';
import ErrorView from '../views/ErrorView';
import AuthView from '../views/User/AuthView';

// Lazy loaded components for better performance
const SolarPanelsView = lazy(() => import('../views/SolarPanelsView'));
const BatteriesView = lazy(() => import('../views/BatteriesView'));
const InvertersView = lazy(() => import('../views/InvertersView'));
const SolarSetsView = lazy(() => import('../views/SolarSetsView'));
const ChargingStationsView = lazy(() => import('../views/ChargingStationsView'));
const CablesWiresView = lazy(() => import('../views/CablesWiresView'));
const CheckoutView = lazy(() => import('../views/Checkout/CheckoutView'));
const CheckoutSuccess = lazy(() => import('../views/Checkout/CheckoutSuccess'));
const CheckoutCancel = lazy(() => import('../views/Checkout/CheckoutCancel'));
const CheckoutAuthView = lazy(() => import('../views/Checkout/CheckoutAuthView'));
const CategoryView = lazy(() => import('../views/CategoryView'));
const ProductPage = lazy(() => import('../views/ProductPage'));
const PortableSolarPanelsView = lazy(() => import('../views/PortableSolarPanelsView'));
const SolarMountSystemView = lazy(() => import('../views/SolarMountSystemView'));
const PortablePowerStationView = lazy(() => import('../views/PortablePowerStationView'));
const UserProfileView = lazy(() => import('../views/UserProfileView'));
const DeliveryWarrantyReturnsView = lazy(() => import('../views/DeliveryWarrantyReturnsView'));
const CompanyView = lazy(() => import('../views/CompanyView'));
const LiftsAndCranesCategory = lazy(() => import('../views/LiftsAndCranesCategory'));
const PrivacyView = lazy(() => import('../views/PrivacyView'));
const LegalTermsView = lazy(() => import('../views/LegalTermsView'));
const ProductRental = lazy(() => import('../views/ProductRental'));
const CustomerCases = lazy(() => import('../views/CustomerCases'));
const FAQView = lazy(() => import('../views/FAQView'));
const TranslationManager = lazy(() => import('../views/admin/TranslationManager'));

// Utils
import { detectUserLocation, getLanguageFromCountry } from '../utils/locationDetector';
import { checkoutGuard } from './guards/checkoutGuard';

// Constants
const VALID_REGIONS = ['ua', 'pl', 'en'];
const DEFAULT_REGION = 'ua';

// Higher-order component for lazy loading with error boundary
const withLazyLoading = (Component) => {
  return (props) => (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

// Custom hook for region management
const useRegionSetup = (region) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleRegionSetup = async () => {
      try {
        setIsLoading(true);
        
        // If valid region is specified
        if (region && VALID_REGIONS.includes(region)) {
          await i18n.changeLanguage(region);
          localStorage.setItem('userLocale', region);
          document.documentElement.setAttribute('lang', region);
          setIsLoading(false);
          return;
        }
        
        // Handle invalid or missing region
        await handleRegionRedirect();
        
      } catch (err) {
        console.error('Error in region setup:', err);
        setError(err);
        // Fallback to default region
        navigate(`/${DEFAULT_REGION}`, { replace: true });
      }
    };

    const handleRegionRedirect = async () => {
      const savedRegion = localStorage.getItem('userLocale');
      
      // Use saved region if available
      if (savedRegion && VALID_REGIONS.includes(savedRegion)) {
        navigate(`/${savedRegion}`, { replace: true });
        return;
      }

      // Try location detection for new users
      try {
        console.log('Detecting user location...');
        const ipLocation = await detectUserLocation();
        
        if (ipLocation && !ipLocation.error) {
          const detectedLanguage = getLanguageFromCountry(ipLocation.country);
          
          if (detectedLanguage && VALID_REGIONS.includes(detectedLanguage)) {
            console.log(`Setting language to ${detectedLanguage} based on country ${ipLocation.country}`);
            localStorage.setItem('userLocale', detectedLanguage);
            navigate(`/${detectedLanguage}`, { replace: true });
            return;
          }
        }
      } catch (locationError) {
        console.warn('Location detection failed:', locationError);
      }
      
      // Fallback to default region
      navigate(`/${DEFAULT_REGION}`, { replace: true });
    };

    handleRegionSetup();
  }, [region, navigate, i18n]);

  return { isLoading, error };
};

// Region Layout Component
const RegionLayout = () => {
  const { region } = useParams();
  const { isLoading, error } = useRegionSetup(region);

  if (error) {
    return <ErrorView errorCode="500" message="Failed to initialize region" />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// Protected Route Component for Authentication
const ProtectedRoute = ({ children, requireAuth = true }) => {
  // Replace with your actual auth logic
  const isAuthenticated = localStorage.getItem('authToken') !== null;
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    return <Navigate 
      to="/auth" 
      state={{ from: location.pathname }} 
      replace 
    />;
  }

  return children;
};

// Protected Route Component for Checkout
const ProtectedCheckoutRoute = ({ children }) => {
  const [guardState, setGuardState] = useState({ 
    isLoading: true, 
    isAllowed: false, 
    redirectTo: null 
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const result = await checkoutGuard(t, location);
        
        if (result.isAllowed) {
          setGuardState({ isLoading: false, isAllowed: true, redirectTo: null });
        } else {
          setGuardState({ 
            isLoading: false, 
            isAllowed: false, 
            redirectTo: result.redirectTo 
          });
          
          // Handle redirect
          const redirectPath = result.redirectTo || '/cart';
          if (result.query?.redirect) {
            navigate(`${redirectPath}?redirect=${encodeURIComponent(result.query.redirect)}`);
          } else {
            navigate(redirectPath, { replace: true });
          }
        }
      } catch (error) {
        console.error('Checkout guard error:', error);
        setGuardState({ 
          isLoading: false, 
          isAllowed: false, 
          redirectTo: '/cart' 
        });
        navigate('/cart', { replace: true });
      }
    };

    checkAccess();
  }, [navigate, t, location]);

  if (guardState.isLoading) {
    return <LoadingSpinner />;
  }

  if (!guardState.isAllowed) {
    return null; // Will redirect via useEffect
  }

  return children;
};

// Dynamic page title management
const usePageTitle = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const getPageTitle = (pathname) => {
      const pathSegments = pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      
      const titleMap = {
        '': 'Home',
        'solar-panels': 'Solar Panels',
        'batteries': 'Batteries',
        'inverters': 'Inverters',
        'cart': 'Shopping Cart',
        'checkout': 'Checkout',
        'profile': 'User Profile',
        'company': 'Company',
        'auth': 'Authentication'
      };

      const baseTitle = titleMap[lastSegment] || 'SCALEVOLT';
      return `${t(baseTitle)} | SCALEVOLT`;
    };

    document.title = getPageTitle(location.pathname);
  }, [location.pathname, t]);
};

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={`/${DEFAULT_REGION}`} replace />,
  },
  {
    path: "/:region",
    element: <RegionLayout />,
    errorElement: <ErrorView errorCode="500" />,
    children: [
      // Home route
      {
        index: true,
        element: <HomeView />,
      },
      
      // Product category routes
      {
        path: "solar-panels",
        element: withLazyLoading(SolarPanelsView)(),
      },
      {
        path: "batteries",
        element: withLazyLoading(BatteriesView)(),
      },
      {
        path: "inverters",
        element: withLazyLoading(InvertersView)(),
      },
      {
        path: "mounting-systems",
        element: withLazyLoading(SolarMountSystemView)(),
      },
      
      // Charging stations
      {
        path: "dc-charging-stations",
        element: withLazyLoading(CategoryView)(),
      },
      {
        path: "ac-charging-stations",
        element: withLazyLoading(CategoryView)(),
      },
      {
        path: "portable-charging-devices",
        element: withLazyLoading(CategoryView)(),
      },
      
      // Lifts and cranes
      {
        path: "lifts-and-cranes",
        element: withLazyLoading(LiftsAndCranesCategory)(),
        children: [
          {
            path: "scissor-lifts",
            element: withLazyLoading(LiftsAndCranesCategory)(),
          },
          {
            path: "boom-lifts",
            element: withLazyLoading(LiftsAndCranesCategory)(),
          },
        ],
      },
      
      // Admin routes
      {
        path: "admin/translations",
        element: (
          <ProtectedRoute requireAuth={true}>
            {withLazyLoading(TranslationManager)()}
          </ProtectedRoute>
        ),
      },
      
      // Other product routes
      {
        path: "cables-wires",
        element: withLazyLoading(CablesWiresView)(),
      },
      {
        path: "sets-of-solar-power-plants/:id?",
        element: withLazyLoading(SolarSetsView)(),
      },
      {
        path: "портативна-електростанція",
        element: withLazyLoading(PortablePowerStationView)(),
      },
      
      // Authentication routes
      {
        path: "auth",
        element: <AuthView />,
      },
      {
        path: "login",
        element: <Navigate to="../auth" replace />,
      },
      {
        path: "signup",
        element: <Navigate to="../auth" replace />,
      },
      
      // Shopping routes
      {
        path: "cart",
        element: <CartView />,
      },
      {
        path: "checkout",
        element: (
          <ProtectedCheckoutRoute>
            {withLazyLoading(CheckoutView)()}
          </ProtectedCheckoutRoute>
        ),
      },
      {
        path: "checkout/success",
        element: (
          <ProtectedCheckoutRoute>
            {withLazyLoading(CheckoutSuccess)()}
          </ProtectedCheckoutRoute>
        ),
      },
      {
        path: "checkout/cancel",
        element: withLazyLoading(CheckoutCancel)(),
      },
      {
        path: "checkout/auth",
        element: withLazyLoading(CheckoutAuthView)(),
      },
      
      // Dynamic routes
      {
        path: "category/:id",
        element: withLazyLoading(CategoryView)(),
      },
      {
        path: "product/:id",
        element: withLazyLoading(ProductPage)(),
      },
      {
        path: "rent/:id",
        element: withLazyLoading(ProductRental)(),
      },
      
      // Static pages
      {
        path: "customer-cases",
        element: withLazyLoading(CustomerCases)(),
      },
      {
        path: "delivery-warranty-returns",
        element: withLazyLoading(DeliveryWarrantyReturnsView)(),
      },
      {
        path: "portable-solar-panels",
        element: withLazyLoading(PortableSolarPanelsView)(),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute requireAuth={true}>
            {withLazyLoading(UserProfileView)()}
          </ProtectedRoute>
        ),
      },
      
      // Generator categories
      {
        path: "generators",
        element: withLazyLoading(CategoryView)(),
      },
      {
        path: "industrial-generators",
        element: withLazyLoading(CategoryView)(),
      },
      {
        path: "solar-lighting-towers",
        element: withLazyLoading(CategoryView)(),
      },
      
      // Company pages
      {
        path: "company",
        element: withLazyLoading(CompanyView)(),
      },
      {
        path: "privacy-policy",
        element: withLazyLoading(PrivacyView)(),
      },
      {
        path: "legal-terms",
        element: withLazyLoading(LegalTermsView)(),
      },
      {
        path: "faq",
        element: withLazyLoading(FAQView)(),
      },
      
      // Error handling
      {
        path: "error/:errorCode?",
        element: <ErrorView />,
      },
      
      // Catch-all for unknown routes within region
      {
        path: "*",
        element: <ErrorView errorCode="404" />,
      },
    ],
  },
  
  // Global catch-all
  {
    path: "*",
    element: <Navigate to={`/${DEFAULT_REGION}`} replace />,
  },
]);

// Main Router Component
const AppRouter = () => {
  usePageTitle();

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default AppRouter;