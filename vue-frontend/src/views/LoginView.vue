<template>
  <div id="app">
    <header class="header">
      <h1>App Name</h1>
    </header>
    <main class="login-view">
      <h1>{{ $t('login.title') }}</h1>
      <p>{{ $t('login.subtitle') }}</p>
      <div class="login-buttons">
        <!-- Google Sign-In Button -->
        <button @click="signInWithGoogle" class="login-button google" aria-label="Sign in with Google">
          <img src="/images/Login/google-login-icon.svg" alt="Google Icon" />
          {{ $t('login.googleBtn') }}
        </button>

        <!-- Apple Sign-In Button -->
        <button @click="signInWithApple" class="login-button apple" aria-label="Sign in with Apple">
          <img src="/images/Login/apple-login-icon.svg" alt="Apple Icon" />
          {{ $t('login.appleBtn') }}
        </button>

        <!-- Divider -->
        <div class="divider">or</div>

        <!-- Email Sign-In Form -->
        <form @submit.prevent="signInWithEmail">
          <input type="email" v-model="email" :placeholder="$t('login.emailPlaceholder')" required />
          <input type="password" v-model="password" :placeholder="$t('login.passwordPlaceholder')" required />
          <button type="submit" class="login-button email">{{ $t('login.emailBtn') }}</button>
        </form>

        <!-- Sign-Up Link -->
        <p class="signup-link">
          {{ $t('login.noAccount') }} <router-link to="/signup">{{ $t('login.signUp') }}</router-link>
        </p>
      </div>
      <p class="terms">
        {{ $t('login.terms') }}
        <a href="#">{{ $t('login.termsLink') }}</a> {{ $t('login.and') }} <a href="#">{{ $t('login.privacyLink') }}</a>.
      </p>
    </main>
  </div>
</template>

<script>
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { useUserStore } from '@/stores/user';
import { useI18n } from 'vue-i18n';

export default {
  name: 'LoginView',
  setup() {
    const { t } = useI18n(); // Access the i18n composition API
    
    return { t };
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      // Get a reference to the store
      const userStore = useUserStore();
      
      signInWithPopup(auth, provider)
        .then((result) => {
          // Use the store's setUser method instead of directly modifying user.value
          userStore.setUser(result.user);
          alert(`Welcome ${result.user.displayName || 'User'}`);
          this.$router.push('/');
        })
        .catch((error) => {
          console.error('Google Sign-In Error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          alert('Failed to sign in with Google: ' + error.message);
        });
    },
    signInWithApple() {
      const provider = new OAuthProvider('apple.com');
      // Get a reference to the store
      const userStore = useUserStore();
      
      signInWithPopup(auth, provider)
        .then((result) => {
          // Use the store's setUser method
          userStore.setUser(result.user);
          alert(`Welcome ${result.user.displayName || result.user.email || 'User'}`);
          this.$router.push('/');
        })
        .catch((error) => {
          console.error('Apple Sign-In Error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          alert('Failed to sign in with Apple: ' + error.message);
        });
    },
    signInWithEmail() {
      // Get a reference to the store
      const userStore = useUserStore();
      
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((result) => {
          // Use the store's setUser method
          userStore.setUser(result.user);
          alert(`Welcome ${result.user.email || 'User'}`);
          this.$router.push('/');
        })
        .catch((error) => {
          console.error('Email Sign-In Error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          alert('Failed to sign in with email: ' + error.message);
        });
    },
  },
};
</script>

<style scoped>
/* Your existing styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  font-family: Arial, sans-serif;
  background-color: #f9fafb;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

header h1 {
  font-size: 1.5rem;
  color: #333333;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 170px 20px 20px;
}

.login-view {
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.google {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #e5e7eb;
}

.apple {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #e5e7eb;
}

.email {
  background-color: #007bff;
  color: #ffffff;
}

.login-button:hover {
  opacity: 0.9;
}

.divider {
  text-align: center;
  margin: 20px 0;
  font-size: 0.9em;
  color: #6b7280;
}

form input {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  margin-bottom: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
}

form button {
  width: 100%;
}

.signup-link {
  margin-top: 10px;
  font-size: 0.9em;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}

.terms {
  margin-top: 20px;
  font-size: 0.9em;
  color: #6b7280;
}

.terms a {
  color: #1d4ed8;
  text-decoration: none;
}

.terms a:hover {
  text-decoration: underline;
}

.footer {
  text-align: center;
  padding: 10px;
  background-color: #f1f5f9;
  color: #6b7280;
  font-size: 0.8em;
}
</style>