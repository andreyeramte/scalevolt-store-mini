// src/components/CurrencyDisplay.vue
<template>
  <span>{{ formattedPrice }}</span>
</template>

<script setup>
import { computed, inject } from 'vue';
import { convertCurrency, formatCurrency } from '../services/currency';

const props = defineProps({
  amount: {
    type: Number,
    required: true
  },
  baseCurrency: {
    type: String,
    default: 'UAH'
  }
});

const currencyStore = inject('currencyStore');

const formattedPrice = computed(() => {
  const targetCurrency = currencyStore.value.currentCurrency;
  
  const convertedAmount = convertCurrency(
    props.amount,
    props.baseCurrency,
    targetCurrency
  );
  
  return formatCurrency(convertedAmount, targetCurrency);
});
</script>