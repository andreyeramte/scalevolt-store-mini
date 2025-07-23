// FILE: src/router/guards/checkoutGuard.js
// Convert the Vue guard to a React-compatible function
import { auth } from '@/firebase';
import { toast } from 'react-toastify';
import useCartStore from '../../stores/cart';

/**
 * Authentication guard for checkout routes that works with Firebase
 * Returns object with isAllowed boolean and redirect path if needed
 */
export function checkoutGuard() {
  // Get Firebase auth instance from our firebase.js
  const firebaseUser = auth.currentUser;

  // Check if the user is authenticated with Firebase directly
  const isAuthenticated = !!firebaseUser;

  return {
    firebaseUser: !!firebaseUser,
    isAuthenticated,
  };
}

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