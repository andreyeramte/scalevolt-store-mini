<template>
    <div class="layout-container">
      <router-view />
    </div>
  </template>
  
  <script>
  export default {
    name: 'Layout'
  }
  </script>
  
  <style scoped>
  .layout-container {
    min-height: 100vh;
    width: 100%;
  }
  </style>