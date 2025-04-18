<!-- src/views/SignUpView.vue -->
<template>
    <div class="sign-up-container">
      <h1>Create an Account</h1>
      <form @submit.prevent="handleSignUp">
        <input type="text" v-model="name" placeholder="Full Name" required />
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <router-link to="/login">Log In</router-link></p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SignUpView',
    data() {
      return {
        name: '',
        email: '',
        password: '',
      };
    },
    methods: {
      async handleSignUp() {
        // Implement sign-up logic here
        // For example, send a request to your backend API
        try {
          // Example API call using fetch
          const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: this.name,
              email: this.email,
              password: this.password,
            }),
          });
          const data = await response.json();
          if (response.ok) {
            // Sign-up successful, redirect to user page or home
            this.$router.push('/user');
          } else {
            // Handle errors
            alert(data.message || 'An error occurred during sign-up.');
          }
        } catch (error) {
          console.error('Sign-Up Error:', error);
          alert('An error occurred during sign-up.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .sign-up-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    /* Add your styles here */
  }
  .sign-up-container form {
    display: flex;
    flex-direction: column;
  }
  .sign-up-container input {
    margin-bottom: 10px;
    padding: 10px;
  }
  .sign-up-container button {
    padding: 10px;
  }
  </style>
  