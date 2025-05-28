import React from 'react';
import './Login.css'; // or use Login.module.css if you prefer CSS Modules

export default function Login() {
  // Replace these with your actual auth logic:
  const signInWithProvider = (provider) => {
    console.log(`Signing in with ${provider}`);
    // e.g. auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  };

  return (
    <div className="login-view">
      <h1>Welcome Back</h1>
      <p>Please sign in to continue.</p>

      <div className="login-buttons">
        <button
          onClick={() => signInWithProvider('google')}
          className="login-button google"
        >
          <img
            src="/Login/google-login-icon.svg"
            alt="Google Icon"
          />
          Continue with Google
        </button>

        <button
          onClick={() => signInWithProvider('apple')}
          className="login-button apple"
        >
          <img
            src="/Login/apple-login-icon.svg"
            alt="Apple Icon"
          />
          Continue with Apple
        </button>
      </div>

      <p className="terms">
        By continuing, you agree to our{' '}
        <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </p>
    </div>
  );
}
