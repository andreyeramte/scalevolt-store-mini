<template>
  <div class="login-view">
    <h1>Welcome Back</h1>
    <p>Please sign in to continue.</p>
    <div class="login-buttons">
      <button @click="signInWithProvider('google')" class="login-button google">
        <img src="/Login/google-login-icon.svg" alt="Google Icon" />
        Continue with Google
      </button>
      <button @click="signInWithProvider('apple')" class="login-button apple">
        <img src="/Login/apple-login-icon.svg" alt="Apple Icon" />
      </button>

      <!-- Add more buttons for other providers as needed -->
    </div>
    <p class="terms">
      By continuing, you agree to our <a href="#">Terms of Service</a> and
      <a href="#">Privacy Policy</a>.
    </p>
  </div>
</template>
