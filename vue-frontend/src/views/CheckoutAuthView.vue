<!-- src/views/CheckoutAuthView.vue -->
<template>
    <div class="checkout-auth-view">
      <div class="auth-container">
        <div class="auth-header">
          <h1>{{ $t('checkout.authenticateToCheckout') }}</h1>
          <p class="auth-subtitle">{{ $t('checkout.authenticateDescription') }}</p>
        </div>
  
        <!-- Check if already authenticated with Firebase -->
        <div v-if="checkingAuth" class="auth-checking">
          <div class="loading-spinner"></div>
          <p>{{ $t('auth.checking') }}</p>
        </div>
        
        <div v-else>
          <!-- If already authenticated with Firebase - No need to login again -->
          <div v-if="isAlreadyAuthenticated" class="already-authenticated">
            <div class="success-icon">
              <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                <circle cx="26" cy="26" r="25" fill="#52c41a" />
                <path d="M14,27.5 L21,34.5 L38,17.5" stroke="white" stroke-width="4" fill="none" />
              </svg>
            </div>
            <h2>{{ $t('auth.alreadyLoggedIn') }}</h2>
            <p>{{ $t('auth.redirectingToCheckout') }}</p>
            <button @click="continueToCheckout" class="continue-button">
              {{ $t('auth.continueToCheckout') }}
            </button>
          </div>
          
          <!-- If not authenticated with Firebase - Show login form -->
          <div v-else>
            <!-- Tabs for Login/Register -->
            <div class="auth-tabs">
              <button 
                @click="activeTab = 'login'" 
                :class="{ active: activeTab === 'login' }"
                class="tab-button"
              >
                {{ $t('common.login') }}
              </button>
              <button 
                @click="activeTab = 'register'" 
                :class="{ active: activeTab === 'register' }"
                class="tab-button"
              >
                {{ $t('common.register') }}
              </button>
            </div>
  
            <!-- Login Form -->
            <div v-if="activeTab === 'login'" class="auth-form-container">
              <form @submit.prevent="handleLogin" class="auth-form">
                <div class="form-group">
                  <label for="login-email">{{ $t('auth.email') }}</label>
                  <input 
                    type="email" 
                    id="login-email" 
                    v-model="loginForm.email" 
                    required 
                    autocomplete="email"
                  />
                </div>
                
                <div class="form-group">
                  <label for="login-password">{{ $t('auth.password') }}</label>
                  <input 
                    type="password" 
                    id="login-password" 
                    v-model="loginForm.password" 
                    required 
                    autocomplete="current-password"
                  />
                </div>
                
                <div class="form-footer">
                  <div class="remember-me">
                    <input type="checkbox" id="remember" v-model="loginForm.remember" />
                    <label for="remember">{{ $t('auth.rememberMe') }}</label>
                  </div>
                  <a href="#" class="forgot-password">{{ $t('auth.forgotPassword') }}</a>
                </div>
                
                <button 
                  type="submit" 
                  class="submit-button" 
                  :disabled="authStore.loading"
                >
                  {{ authStore.loading ? $t('common.loading') : $t('common.login') }}
                </button>
              </form>
            </div>
  
            <!-- Register Form -->
            <div v-if="activeTab === 'register'" class="auth-form-container">
              <form @submit.prevent="handleRegister" class="auth-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="register-firstname">{{ $t('auth.firstName') }}</label>
                    <input 
                      type="text" 
                      id="register-firstname" 
                      v-model="registerForm.firstName" 
                      required 
                      autocomplete="given-name"
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="register-lastname">{{ $t('auth.lastName') }}</label>
                    <input 
                      type="text" 
                      id="register-lastname" 
                      v-model="registerForm.lastName" 
                      required 
                      autocomplete="family-name"
                    />
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="register-email">{{ $t('auth.email') }}</label>
                  <input 
                    type="email" 
                    id="register-email" 
                    v-model="registerForm.email" 
                    required 
                    autocomplete="email"
                  />
                </div>
                
                <div class="form-group">
                  <label for="register-phone">{{ $t('auth.phone') }}</label>
                  <input 
                    type="tel" 
                    id="register-phone" 
                    v-model="registerForm.phone" 
                    autocomplete="tel"
                  />
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="register-password">{{ $t('auth.password') }}</label>
                    <input 
                      type="password" 
                      id="register-password" 
                      v-model="registerForm.password" 
                      required 
                      autocomplete="new-password"
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="register-confirm-password">{{ $t('auth.confirmPassword') }}</label>
                    <input 
                      type="password" 
                      id="register-confirm-password" 
                      v-model="registerForm.confirmPassword" 
                      required 
                      autocomplete="new-password"
                    />
                  </div>
                </div>
                
                <div class="form-checkbox">
                  <input type="checkbox" id="terms" v-model="registerForm.acceptTerms" required />
                  <label for="terms">
                    {{ $t('auth.acceptTerms') }} 
                    <a href="/terms" target="_blank">{{ $t('auth.termsLink') }}</a>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  class="submit-button" 
                  :disabled="authStore.loading || !isFormValid"
                >
                  {{ authStore.loading ? $t('common.loading') : $t('common.register') }}
                </button>
              </form>
            </div>
  
            <!-- Error message display -->
            <div v-if="authStore.error" class="auth-error">
              {{ authStore.error }}
            </div>
          </div>
        </div>
  
        <!-- Order summary cart preview -->
        <div class="auth-cart-summary">
          <h3>{{ $t('cart.orderSummary') }}</h3>
          <div class="summary-item">
            <span>{{ $t('cart.items') }}:</span>
            <span>{{ cartStore.totalQuantity }}</span>
          </div>
          <div class="summary-total">
            <span>{{ $t('cart.total') }}:</span>
            <span>{{ formatPrice(cartStore.totalPrice) }} грн</span>
          </div>
          <router-link to="/cart" class="view-cart-link">
            {{ $t('checkout.viewCart') }}
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useCartStore } from '@/stores/cart';
  import { useRouter, useRoute } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import { useI18n } from 'vue-i18n';
  import { getAuth } from 'firebase/auth';
  
  export default {
    name: 'CheckoutAuthView',
    
    setup() {
      const authStore = useAuthStore();
      const cartStore = useCartStore();
      const router = useRouter();
      const route = useRoute();
      const toast = useToast();
      const { t } = useI18n();
      
      // State for checking Firebase auth status
      const checkingAuth = ref(true);
      const isAlreadyAuthenticated = ref(false);
      
      // Active tab state
      const activeTab = ref('login');
      
      // Login form state
      const loginForm = ref({
        email: '',
        password: '',
        remember: false
      });
      
      // Register form state
      const registerForm = ref({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      });
      
      // Check if register form is valid
      const isFormValid = computed(() => {
        return registerForm.value.password === registerForm.value.confirmPassword &&
               registerForm.value.password.length >= 6 &&
               registerForm.value.acceptTerms;
      });
      
      // Get redirect path from query or localStorage
      const getRedirectPath = () => {
        const redirectPath = route.query.redirect || localStorage.getItem('checkoutRedirect') || '/checkout';
        localStorage.removeItem('checkoutRedirect'); // Clean up
        return redirectPath;
      };
      
      // Format price with thousands separator
      const formatPrice = (price) => {
        return price.toLocaleString('en-US');
      };
      
      // Check Firebase auth status when component mounts
      onMounted(() => {
        checkFirebaseAuth();
      });
      
      // Check if user is already authenticated with Firebase
      const checkFirebaseAuth = () => {
        const auth = getAuth();
        
        // Set timeout to ensure Firebase has time to initialize
        setTimeout(() => {
          if (auth.currentUser) {
            console.log('User already authenticated with Firebase', auth.currentUser);
            isAlreadyAuthenticated.value = true;
            
            // Auto-redirect to checkout after a short delay
            setTimeout(() => {
              continueToCheckout();
            }, 1500);
          } else {
            console.log('User not authenticated with Firebase');
            isAlreadyAuthenticated.value = false;
          }
          checkingAuth.value = false;
        }, 1000);
      };
      
      // Continue to checkout if already authenticated
      const continueToCheckout = () => {
        router.push(getRedirectPath());
      };
      
      // Handle login form submission
      const handleLogin = async () => {
        const success = await authStore.login(loginForm.value.email, loginForm.value.password);
        
        if (success) {
          toast.success(t('auth.loginSuccess'));
          router.push(getRedirectPath());
        } else {
          toast.error(authStore.error || t('auth.loginFailed'));
        }
      };
      
      // Handle register form submission
      const handleRegister = async () => {
        if (registerForm.value.password !== registerForm.value.confirmPassword) {
          toast.error(t('auth.passwordsMustMatch'));
          return;
        }
        
        const userData = {
          firstName: registerForm.value.firstName,
          lastName: registerForm.value.lastName,
          email: registerForm.value.email,
          phone: registerForm.value.phone,
          password: registerForm.value.password
        };
        
        const success = await authStore.register(userData);
        
        if (success) {
          toast.success(t('auth.registerSuccess'));
          router.push(getRedirectPath());
        } else {
          toast.error(authStore.error || t('auth.registerFailed'));
        }
      };
      
      return {
        activeTab,
        loginForm,
        registerForm,
        authStore,
        cartStore,
        isFormValid,
        checkingAuth,
        isAlreadyAuthenticated,
        handleLogin,
        handleRegister,
        continueToCheckout,
        formatPrice,
        $t: t
      };
    }
  };
  </script>
  
  <style scoped>
  .checkout-auth-view {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: 'Inter', sans-serif;
  }
  
  .auth-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .auth-header {
    grid-column: 1 / -1;
    padding: 30px;
    background-color: #f9f9f9;
    text-align: center;
  }
  
  .auth-header h1 {
    margin: 0 0 10px;
    font-size: 1.8rem;
    color: #333;
  }
  
  .auth-subtitle {
    color: #666;
    margin: 0;
  }
  
  .auth-checking {
    grid-column: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4CAF50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .already-authenticated {
    grid-column: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    text-align: center;
  }
  
  .success-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
  }
  
  .already-authenticated h2 {
    margin-top: 0;
    color: #4CAF50;
  }
  
  .continue-button {
    margin-top: 20px;
    padding: 12px 24px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .continue-button:hover {
    background-color: #45a049;
  }
  
  .auth-tabs {
    grid-column: 1;
    display: flex;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }
  
  .tab-button {
    flex: 1;
    padding: 15px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    color: #666;
    transition: all 0.2s ease;
  }
  
  .tab-button.active {
    color: #4CAF50;
    border-bottom: 2px solid #4CAF50;
  }
  
  .auth-form-container {
    grid-column: 1;
    padding: 0 30px 30px;
  }
  
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-row {
    display: flex;
    gap: 15px;
  }
  
  .form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  label {
    font-size: 14px;
    font-weight: 500;
    color: #555;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="tel"] {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: inherit;
    font-size: 16px;
    transition: border-color 0.2s ease;
  }
  
  input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  }
  
  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }
  
  .remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .forgot-password {
    color: #1890ff;
    text-decoration: none;
  }
  
  .forgot-password:hover {
    text-decoration: underline;
  }
  
  .form-checkbox {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    font-size: 14px;
  }
  
  .form-checkbox a {
    color: #1890ff;
    text-decoration: none;
  }
  
  .form-checkbox a:hover {
    text-decoration: underline;
  }
  
  .submit-button {
    padding: 14px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .submit-button:hover {
    background-color: #45a049;
  }
  
  .submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .auth-error {
    grid-column: 1;
    padding: 0 30px;
    color: #ff4d4f;
    margin-top: 10px;
  }
  
  .auth-cart-summary {
    grid-column: 2;
    grid-row: 2 / span 4;
    background-color: #f9f9f9;
    padding: 30px;
    border-left: 1px solid #eee;
  }
  
  .auth-cart-summary h3 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    color: #333;
  }
  
  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    color: #666;
  }
  
  .summary-total {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    font-weight: 600;
    font-size: 18px;
  }
  
  .view-cart-link {
    display: block;
    margin-top: 30px;
    text-align: center;
    color: #1890ff;
    text-decoration: none;
  }
  
  .view-cart-link:hover {
    text-decoration: underline;
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .auth-container {
      grid-template-columns: 1fr;
    }
    
    .auth-cart-summary {
      grid-column: 1;
      grid-row: auto;
      border-left: none;
      border-top: 1px solid #eee;
    }
    
    .form-row {
      flex-direction: column;
      gap: 20px;
    }
  }
  </style>