// src/stores/auth.js
import { defineStore } from 'pinia';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
  },
  
  actions: {
    init() {
      console.log('Initializing auth store and connecting to Firebase');
      // Set up Firebase auth state listener
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          this.user = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          };
          console.log('Firebase user authenticated:', this.user);
        } else {
          // User is signed out
          this.user = null;
          console.log('No Firebase user authenticated');
        }
      });
    },
    
    async login(email, password) {
      this.loading = true;
      this.error = null;
      
      try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Firebase auth state change will update the user in the store
        console.log('Login successful');
        return true;
      } catch (error) {
        this.error = error.message || 'Login failed';
        console.error('Login error:', this.error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async register(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const auth = getAuth();
        const { email, password, firstName, lastName } = userData;
        
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with name
        await updateProfile(userCredential.user, {
          displayName: `${firstName} ${lastName}`
        });
        
        // Firebase auth state change will update the user in the store
        console.log('Registration successful');
        return true;
      } catch (error) {
        this.error = error.message || 'Registration failed';
        console.error('Registration error:', this.error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async logout() {
      this.loading = true;
      try {
        const auth = getAuth();
        await signOut(auth);
        // Firebase auth state change will update the user in the store
        console.log('Logout successful');
      } catch (error) {
        this.error = error.message || 'Logout failed';
        console.error('Logout error:', this.error);
      } finally {
        this.loading = false;
      }
    },
    
    checkAuth() {
      const auth = getAuth();
      return !!auth.currentUser;
    }
  }
});