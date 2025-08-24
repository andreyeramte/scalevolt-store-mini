// Authentication service for handling Google Sign-In and other auth methods

class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    this.token = null;
  }

  // Initialize Google Sign-In
  async initGoogleSignIn() {
    try {
      // Load Google Identity Services script
      if (!window.google) {
        await this.loadGoogleScript();
      }

      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com',
        callback: this.handleGoogleSignIn.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the button
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { 
          theme: 'outline', 
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        }
      );

      return true;
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error);
      return false;
    }
  }

  // Load Google Identity Services script
  loadGoogleScript() {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google script'));
      
      document.head.appendChild(script);
    });
  }

  // Handle Google Sign-In callback
  async handleGoogleSignIn(response) {
    try {
      console.log('Google Sign-In response:', response);
      
      // Decode the JWT token to get user info
      const userInfo = this.decodeJwt(response.credential);
      
      // Store user data
      this.user = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        provider: 'google'
      };
      
      this.token = response.credential;
      this.isAuthenticated = true;
      
      // Store in localStorage
      localStorage.setItem('auth_user', JSON.stringify(this.user));
      localStorage.setItem('auth_token', this.token);
      
      // You can send this token to your backend for verification
      // await this.verifyWithBackend(response.credential);
      
      return this.user;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }

  // Decode JWT token (client-side only - don't use for security validation)
  decodeJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }

  // Sign out
  signOut() {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    this.isAuthenticated = false;
    this.user = null;
    this.token = null;
    
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }

  // Check if user is authenticated
  checkAuthStatus() {
    const storedUser = localStorage.getItem('auth_user');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedUser && storedToken) {
      this.user = JSON.parse(storedUser);
      this.token = storedToken;
      this.isAuthenticated = true;
      return true;
    }
    
    return false;
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get auth token
  getAuthToken() {
    return this.token;
  }

  // Verify token with backend (implement when backend is ready)
  async verifyWithBackend(token) {
    try {
      const response = await fetch('/api/auth/verify-google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error('Backend verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Backend verification error:', error);
      throw error;
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
