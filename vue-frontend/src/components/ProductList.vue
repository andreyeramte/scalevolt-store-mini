<template>
    <div>
      <h1>Product List</h1>
      <div v-if="loading">Loading products...</div>
      <div v-else>
        <div v-for="product in products" :key="product.id" class="product-card">
          <img :src="getImageUrl(product.attributes.general_information.images.data[0])" alt="Product Image" />
          <h2>{{ product.attributes.general_information.name }}</h2>
          <p>{{ product.attributes.general_information.short_description }}</p>
          <p>Price: {{ product.attributes.pricing_and_inventory.price }}</p>
          <router-link :to="`/product/${product.id}`">View Details</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import productService from '@/services/productService';
  
  export default {
    name: 'ProductList',
    data() {
      return {
        products: [],
        loading: true,
      };
    },
    methods: {
      async fetchProducts() {
        try {
          const response = await productService.getProducts({
            populate: [
              'general_information.images',
              'pricing_and_inventory',
            ],
          });
          this.products = response.data.data;
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          this.loading = false;
        }
      },
      getImageUrl(imageData) {
        if (!imageData || !imageData.attributes || !imageData.attributes.url) return '';
        return `http://localhost:1337${imageData.attributes.url}`;
      },
    },
    created() {
      this.fetchProducts();
    },
  };
  </script>
  
  <style scoped>
  .product-card {
    /* Your styles here */
  }
  </style>
  