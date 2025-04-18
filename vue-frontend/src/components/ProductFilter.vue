<template>
    <div class="filter-sidebar">
      <h3>Filters</h3>
  
      <!-- Price Range Filter -->
      <div class="filter-group">
        <h4>Price Range</h4>
        <input type="range" v-model="priceRange" :min="minPrice" :max="maxPrice" />
        <div>
          <span>{{ minPrice }} грн</span> - <span>{{ priceRange }} грн</span>
        </div>
      </div>
  
      <!-- Brand Filter -->
      <div class="filter-group">
        <h4>Brand</h4>
        <div v-for="brand in brands" :key="brand">
          <label>
            <input type="checkbox" :value="brand" v-model="selectedBrands" />
            {{ brand }}
          </label>
        </div>
      </div>
  
      <!-- Apply Filters Button -->
      <button @click="applyFilters">Apply Filters</button>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  defineProps({
    minPrice: Number,
    maxPrice: Number,
    brands: Array,
  });
  
  defineEmits(['filter-changed']);
  
  const priceRange = ref(maxPrice);
  const selectedBrands = ref([]);
  
  function applyFilters() {
    emit('filter-changed', {
      priceRange: priceRange.value,
      selectedBrands: selectedBrands.value,
    });
  }
  </script>
  
  <style scoped>
  .filter-sidebar {
    padding: 20px;
    background-color: #f8f8f8;
    width: 250px;
  }
  
  .filter-group {
    margin-bottom: 20px;
  }
  
  .filter-group h4 {
    margin-bottom: 10px;
  }
  
  .filter-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  button {
    padding: 10px 15px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
  }
  </style>
  