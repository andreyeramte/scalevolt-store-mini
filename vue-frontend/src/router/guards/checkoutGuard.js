// src/router/guards/checkoutGuard.js
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { getAuth } from 'firebase/auth';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

/**
 * Authentication guard for checkout routes that works with Firebase
 * Redirects unauthenticated users to login/register page
 */
export function checkoutGuard(to, from, next) {
  // Get Firebase auth instance directly
  const auth = getAuth();
  const firebaseUser = auth.currentUser;
  
  // Get store instances (may return undefined if pinia not initialized yet)
  let cartStore;
  let authStore;
  let toast;
  let t;

  try {
    cartStore = useCartStore();
    authStore = useAuthStore(); 
    toast = useToast();
    t = useI18n().t;
  } catch (error) {
    console.error('Error getting stores in checkout guard:', error);
  }
  
  // Check if the user is authenticated with Firebase directly
  // This is the most reliable check and doesn't depend on the Pinia store
  const isAuthenticated = !!firebaseUser;
  
  // Store the intended destination to redirect after login
  const redirectPath = to.fullPath;
  
  console.log('Checkout guard running', {
    firebaseUser: !!firebaseUser,
    isAuthenticated,
    cartItems: cartStore?.cartItems?.length || 0
  });
  
  // Check if cart is empty
  if (cartStore && cartStore.cartItems.length === 0) {
    console.log('Cart is empty, redirecting to cart page');
    if (toast && t) {
      toast.error(t('cart.emptyCartError'));
    }
    next({ name: 'Cart' });
    return;
  }
  
  // Check if user is authenticated with Firebase
  if (!isAuthenticated) {
    console.log('User not authenticated with Firebase, redirecting to auth page');
    
    // Store the intended destination to redirect after login
    localStorage.setItem('checkoutRedirect', redirectPath);
    
    // Redirect to checkout-auth page with return URL
    next({ 
      name: 'CheckoutAuth',
      query: { redirect: redirectPath }
    });
  } else {
    console.log('User authenticated with Firebase, proceeding to checkout');
    // User is authenticated, proceed to checkout
    next();
  }
}