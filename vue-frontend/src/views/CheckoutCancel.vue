<!-- src/views/CheckoutCancel.vue -->
<template>
    <div class="checkout-cancel">
      <h1>Payment Canceled</h1>
      <p>Your payment was canceled. You can try again or continue shopping.</p>
      <router-link to="/checkout">Try Again</router-link> | 
      <router-link to="/">Continue Shopping</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CheckoutCancel',
  };
  </script>
  
  <style scoped>
  .checkout-cancel {
    text-align: center;
    margin-top: 50px;
  }
  </style>
  