<template>
    <div class="auth-container">
      <div class="auth-card">
        <h1>{{ $t(isLogin ? 'login.title' : 'register.title') }}</h1>
        <p>{{ $t(isLogin ? 'login.subtitle' : 'register.subtitle') }}</p>
        
        <!-- Auth Tabs -->
        <div class="auth-tabs">
          <button 
            @click="isLogin = true" 
            :class="{ active: isLogin }"
            class="auth-tab"
          >
            {{ $t('login.tabLabel') }}
          </button>
          <button 
            @click="isLogin = false" 
            :class="{ active: !isLogin }"
            class="auth-tab"
          >
            {{ $t('register.tabLabel') }}
          </button>
        </div>
        
        <!-- Social Auth Buttons -->
        <div class="social-buttons">
          <button @click="signInWithGoogle" class="social-button google">
            <!-- Inline Google SVG icon -->
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {{ $t(isLogin ? 'login.googleBtn' : 'register.googleBtn') }}
          </button>
          
          <button @click="signInWithApple" class="social-button apple">
            <!-- Inline Apple SVG icon -->
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.4683 0C16.5452 0 16.6221 0 16.699 0C16.7952 1.68 16.122 2.82 15.4297 3.62C14.7374 4.4 13.8143 5.01 12.3604 4.92C12.283 3.32 12.9373 2.23 13.6296 1.43C14.2445 0.73 15.3445 0.15 16.4683 0Z" fill="white"/>
              <path d="M22 17.25C22 17.32 22 17.39 22 17.46C21.5607 19.54 20.6181 21.46 19.4168 23C18.3939 24.29 17.1926 24.98 15.8339 24.98C14.8495 24.98 14.1572 24.63 13.4264 24.26C12.6572 23.87 11.8495 23.46 10.6481 23.47C9.39724 23.48 8.55904 23.9 7.7592 24.31C7.06687 24.67 6.38327 25.02 5.46227 25C4.1421 24.96 2.99054 24.19 1.96763 22.99C0.0563397 20.67 -0.518932 16.22 0.535631 13.13C1.23566 11.05 2.76871 9.57 4.45294 9.57C5.40674 9.57 6.13177 9.98 6.78151 10.34C7.32647 10.64 7.81847 10.91 8.33597 10.91C8.80073 10.91 9.27422 10.65 9.82947 10.35C10.5334 9.98 11.3568 9.55 12.4375 9.58C13.6774 9.62 14.7387 10.15 15.5079 11.16C13.1304 12.63 13.5504 16.06 16.0051 16.98C15.582 17.86 15.0565 18.63 14.4639 19.26C13.9692 19.78 13.237 20.37 12.3354 20.37C11.5082 20.37 10.9435 20.1 10.3402 19.82C9.71293 19.52 9.0472 19.21 8.04321 19.21C7.00159 19.21 6.30955 19.53 5.6755 19.84C5.09784 20.12 4.57247 20.38 3.83782 20.38C3.84743 20.38 3.83782 20.38 3.82801 20.38C2.96817 20.36 2.24314 19.81 1.67509 18.97C2.31522 18.16 2.76871 17.16 2.98951 16.45C3.21992 15.73 3.27185 15.27 3.27185 15.26C3.27185 15.24 3.30456 15.24 3.31426 15.24C3.60218 15.24 4.05548 15.75 4.63334 15.75C5.29298 15.75 5.80087 15.14 6.44099 14.33C7.20835 13.36 8.15234 12.14 10.0636 12.14C10.6867 12.14 11.8013 12.18 12.9642 12.81C13.0797 12.87 13.1856 12.94 13.2819 13.01C13.6054 13.23 13.8743 13.42 14.0854 13.4C14.5483 13.36 15.582 12.95 16.6821 11.84C17.5806 10.92 18.2209 9.73 18.5185 8.8C18.817 7.87 18.7882 7.2 18.7882 7.19C18.7882 7.17 18.8076 7.17 18.8173 7.17C18.8651 7.17 21.3197 8.13 21.9985 11.09C21.9303 11.24 21.0222 13.51 22 17.25Z" fill="white"/>
            </svg>
            {{ $t(isLogin ? 'login.appleBtn' : 'register.appleBtn') }}
          </button>
        </div>
        
        <div class="divider">{{ $t('common.or') }}</div>
        
        <!-- Auth Form -->
        <form @submit.prevent="submitForm">
          <!-- Name Field (Registration only) -->
          <div v-if="!isLogin" class="form-group">
            <label for="name">{{ $t('register.nameLabel') }}</label>
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              :placeholder="$t('register.namePlaceholder')" 
              required
            />
          </div>
          
          <!-- Email Field -->
          <div class="form-group">
            <label for="email">{{ $t('common.emailLabel') }}</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              :placeholder="$t('login.emailPlaceholder')" 
              required
            />
          </div>
          
          <!-- Password Field -->
          <div class="form-group">
            <label for="password">{{ $t('common.passwordLabel') }}</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              :placeholder="$t('login.passwordPlaceholder')" 
              required
            />
          </div>
          
          <!-- Confirm Password (Registration only) -->
          <div v-if="!isLogin" class="form-group">
            <label for="confirmPassword">{{ $t('register.confirmPasswordLabel') }}</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              :placeholder="$t('register.confirmPasswordPlaceholder')" 
              required
            />
          </div>
          
          <!-- Submit Button -->
          <button type="submit" class="submit-button">
            {{ $t(isLogin ? 'login.emailBtn' : 'register.submitBtn') }}
          </button>
        </form>
        
        <!-- Forgot Password (Login only) -->
        <p v-if="isLogin" class="forgot-password">
          <a href="#" @click.prevent="forgotPassword">{{ $t('login.forgotPassword') }}</a>
        </p>
        
        <!-- Toggle Auth Mode -->
        <p class="toggle-auth">
          {{ $t(isLogin ? 'login.noAccount' : 'register.hasAccount') }}
          <a href="#" @click.prevent="isLogin = !isLogin">
            {{ $t(isLogin ? 'login.signUp' : 'register.signIn') }}
          </a>
        </p>
        
        <!-- Terms and Conditions -->
        <p class="terms-text">
          {{ $t('login.terms') }}
          <a href="#">{{ $t('login.termsLink') }}</a>
          {{ $t('login.and') }}
          <a href="#">{{ $t('login.privacyLink') }}</a>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { auth } from '@/firebase';
  import { useUserStore } from '@/stores/user';
  import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    updateProfile,
    sendPasswordResetEmail
  } from 'firebase/auth';
  
  export default {
    name: 'AuthView',
    setup() {
      // Form data
      const isLogin = ref(true);
      const name = ref('');
      const email = ref('');
      const password = ref('');
      const confirmPassword = ref('');
      
      // Utilities
      const { t } = useI18n();
      const router = useRouter();
      const userStore = useUserStore();
      
      // Handle form submission
      const submitForm = async () => {
        try {
          // For registration, verify passwords match
          if (!isLogin.value && password.value !== confirmPassword.value) {
            alert(t('register.passwordMismatch'));
            return;
          }
          
          let userCredential;
          
          if (isLogin.value) {
            // Handle login
            userCredential = await signInWithEmailAndPassword(
              auth, 
              email.value, 
              password.value
            );
          } else {
            // Handle registration
            userCredential = await createUserWithEmailAndPassword(
              auth, 
              email.value, 
              password.value
            );
            
            // Update profile with name if provided
            if (name.value.trim()) {
              await updateProfile(userCredential.user, {
                displayName: name.value.trim()
              });
            }
          }
          
          // Update user in store
          userStore.setUser(userCredential.user);
          
          // Navigate to homepage
          router.push('/');
        } catch (error) {
          console.error('Authentication error:', error);
          alert(error.message);
        }
      };
      
      // Social sign-in methods
      const signInWithGoogle = async () => {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          userStore.setUser(result.user);
          router.push('/');
        } catch (error) {
          console.error('Google sign-in error:', error);
          alert(error.message);
        }
      };
      
      const signInWithApple = async () => {
        try {
          const provider = new OAuthProvider('apple.com');
          const result = await signInWithPopup(auth, provider);
          userStore.setUser(result.user);
          router.push('/');
        } catch (error) {
          console.error('Apple sign-in error:', error);
          alert(error.message);
        }
      };
      
      // Password recovery
      const forgotPassword = async () => {
        if (!email.value) {
          alert(t('login.enterEmailForReset'));
          return;
        }
        
        try {
          await sendPasswordResetEmail(auth, email.value);
          alert(t('login.resetEmailSent'));
        } catch (error) {
          console.error('Password reset error:', error);
          alert(error.message);
        }
      };
      
      return {
        isLogin,
        name,
        email,
        password,
        confirmPassword,
        submitForm,
        signInWithGoogle,
        signInWithApple,
        forgotPassword
      };
    }
  };
  </script>
  
  <style scoped>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f8f9fa;
  }
  
  .auth-card {
    width: 100%;
    max-width: 450px;
    padding: 30px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
    text-align: center;
  }
  
  p {
    color: #6c757d;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .auth-tabs {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid #dee2e6;
  }
  
  .auth-tab {
    flex: 1;
    padding: 10px;
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #6c757d;
    position: relative;
  }
  
  .auth-tab.active {
    color: #0d6efd;
    font-weight: 500;
  }
  
  .auth-tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #0d6efd;
  }
  
  .social-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #dee2e6;
    background-color: white;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  }
  
  .social-button svg {
    margin-right: 10px;
  }
  
  .social-button.google:hover {
    background-color: #f1f3f5;
  }
  
  .social-button.apple {
    background-color: #000;
    color: white;
    border-color: #000;
  }
  
  .social-button.apple:hover {
    background-color: #333;
  }
  
  .divider {
    text-align: center;
    margin: 20px 0;
    color: #6c757d;
    position: relative;
  }
  
  .divider::before, .divider::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 42%;
    height: 1px;
    background-color: #dee2e6;
  }
  
  .divider::before {
    left: 0;
  }
  
  .divider::after {
    right: 0;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    font-size: 14px;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #dee2e6;
    border-radius: 5px;
    font-size: 14px;
  }
  
  input:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  }
  
  .submit-button {
    width: 100%;
    padding: 10px;
    background-color: #0d6efd;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 10px;
  }
  
  .submit-button:hover {
    background-color: #0b5ed7;
  }
  
  .forgot-password {
    text-align: right;
    font-size: 14px;
    margin-top: 10px;
  }
  
  .forgot-password a {
    color: #0d6efd;
    text-decoration: none;
  }
  
  .toggle-auth {
    margin-top: 20px;
    font-size: 14px;
  }
  
  .toggle-auth a {
    color: #0d6efd;
    text-decoration: none;
    font-weight: 500;
  }
  
  .terms-text {
    margin-top: 20px;
    font-size: 12px;
    color: #6c757d;
  }
  
  .terms-text a {
    color: #0d6efd;
    text-decoration: none;
  }
  
  @media (max-width: 576px) {
    .auth-card {
      padding: 20px;
    }
    
    h1 {
      font-size: 22px;
    }
  }
  </style>