// FILE: src/router/guards/checkoutGuard.js
// Convert the Vue guard to a React-compatible function
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import useCartStore from '../../stores/cart';

/**
 * Authentication guard for checkout routes that works with Firebase
 * Returns object with isAllowed boolean and redirect path if needed
 */
export const checkoutGuard = async (t, location) => {
  try {
    // Get Firebase auth instance directly
    const auth = getAuth();
    const firebaseUser = auth.currentUser;
    // Zustand cart store
    const cartStore = useCartStore.getState();
    const cartItems = cartStore.getCartItems();

    // Check if the user is authenticated with Firebase directly
    const isAuthenticated = !!firebaseUser;

    console.log('Checkout guard running', {
      firebaseUser: !!firebaseUser,
      isAuthenticated,
      currentPath: location?.pathname
    });

    // Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
      console.log('Cart is empty, redirecting to cart page');
      if (t && toast) {
        toast.error(t('cart.emptyCartError', 'Your cart is empty'));
      }
      return {
        isAllowed: false,
        redirectTo: '/cart',
        reason: 'emptyCart',
        message: t ? t('cart.emptyCartError', 'Your cart is empty') : 'Cart is empty'
      };
    }

    // Validate cart items have required fields
    const invalidItems = cartItems.filter(item => 
      !item.id || !item.name || !item.price || !item.quantity || item.quantity <= 0
    );

    if (invalidItems.length > 0) {
      console.log('Invalid items in cart:', invalidItems);
      if (t && toast) {
        toast.error(t('cart.invalidItemsError', 'Some items in your cart are invalid'));
      }
      return {
        isAllowed: false,
        redirectTo: '/cart',
        reason: 'invalidItems',
        message: t ? t('cart.invalidItemsError', 'Some items in your cart are invalid') : 'Invalid items in cart'
      };
    }

    // For success/cancel pages, allow without authentication check
    const isSuccessOrCancel = location?.pathname?.includes('/success') || 
                             location?.pathname?.includes('/cancel');
    if (isSuccessOrCancel) {
      console.log('Success/Cancel page - allowing access');
      return {
        isAllowed: true,
        reason: 'successOrCancel'
      };
    }

    // Check if user is authenticated with Firebase for checkout process
    if (!isAuthenticated) {
      console.log('User not authenticated with Firebase, redirecting to auth page');
      // Store the intended destination to redirect after login
      const currentPath = location?.pathname || window.location.pathname;
      localStorage.setItem('checkoutRedirect', currentPath);
      return {
        isAllowed: false,
        redirectTo: '/auth', // or '/checkout/auth' based on your routing
        reason: 'notAuthenticated',
        query: { 
          redirect: currentPath,
          message: 'Please login to continue with checkout'
        }
      };
    }

    // Additional validation: Check if user profile is complete (optional)
    if (firebaseUser && !firebaseUser.displayName && !firebaseUser.email) {
      console.log('User profile incomplete');
      return {
        isAllowed: false,
        redirectTo: '/profile/complete',
        reason: 'incompleteProfile',
        message: 'Please complete your profile to continue'
      };
    }

    return {
      isAllowed: true,
      reason: 'validated'
    };
  } catch (error) {
    console.error('Error in checkout guard:', error);
    return {
      isAllowed: false,
      redirectTo: '/cart',
      reason: 'error'
    };
  }
};

// Alternative simpler version if you don't want Firebase dependency
export const simpleCheckoutGuard = async (t, location) => {
  try {
    // Zustand cart store
    const cartStore = useCartStore.getState();
    const cartItems = cartStore.getCartItems();
    if (!cartItems || cartItems.length === 0) {
      console.log('Cart is empty, redirecting to cart page');
      return {
        isAllowed: false,
        redirectTo: '/cart',
        reason: 'emptyCart'
      };
    }
    // Validate cart items
    const invalidItems = cartItems.filter(item => 
      !item.id || !item.price || !item.quantity || item.quantity <= 0
    );
    if (invalidItems.length > 0) {
      return {
        isAllowed: false,
        redirectTo: '/cart',
        reason: 'invalidItems'
      };
    }
    // Check if user is logged in (if required)
    const authToken = localStorage.getItem('authToken');
    const isAuthenticated = !!authToken;
    // For success/cancel pages, different rules might apply
    const isSuccessOrCancel = location?.pathname?.includes('/success') || 
                             location?.pathname?.includes('/cancel');
    if (!isSuccessOrCancel && !isAuthenticated) {
      return {
        isAllowed: false,
        redirectTo: '/auth',
        reason: 'notAuthenticated'
      };
    }
    return {
      isAllowed: true,
      reason: 'validated'
    };
  } catch (error) {
    console.error('Error in checkout guard:', error);
    return {
      isAllowed: false,
      redirectTo: '/cart',
      reason: 'error'
    };
  }
};

// Hook version for use in React components
export const useCheckoutGuard = () => {
  const guardCheck = async (t, location) => {
    return await checkoutGuard(t, location);
  };

  return { guardCheck };
};