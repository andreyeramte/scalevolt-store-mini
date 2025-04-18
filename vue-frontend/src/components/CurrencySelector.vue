<template>
    <div class="currency-selector">
      <select v-model="selectedCurrency" @change="changeCurrency" class="currency-dropdown">
        <option value="UAH">₴ UAH</option>
        <option value="PLN">zł PLN</option>
      </select>
    </div>
  </template>
  
  <script setup>
  import { ref, inject, onMounted, watch } from 'vue';
  import { setUserCurrencyPreference } from '@/services/currency';
  
  const currencyStore = inject('currencyStore');
  const selectedCurrency = ref(currencyStore.value.currentCurrency);
  
  // Watch for changes in the currency store
  watch(() => currencyStore.value.currentCurrency, (newValue) => {
    selectedCurrency.value = newValue;
  });
  
  function changeCurrency() {
    currencyStore.value.setCurrency(selectedCurrency.value);
    setUserCurrencyPreference(selectedCurrency.value);
  }
  </script>
  
  <style scoped>
  .currency-selector {
    margin-left: 10px;
  }
  
  .currency-dropdown {
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #fff;
    font-size: 14px;
  }
  </style>