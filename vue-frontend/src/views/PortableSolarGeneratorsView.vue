<template>
    <div class="catalogue-view">
      <Breadcrumb :breadcrumbs="breadcrumbs" class="breadcrumb-spacing" />
  
      <h1>{{ pageTitle }}</h1>
  
      <!-- Updated Product Listing with router-link and productId -->
      <div class="products-container">
        <div
          v-for="product in displayedProducts"
          :key="product.id"
          class="product-card-wrapper"
        >
          <router-link
            :to="`/product/${product.id}`"
            style="text-decoration: none; color: inherit;"
        >
            <ProductCard
              :productId="product.id"
              :title="product.name"
              :price="product.price"
              :image-src="product.image"
              :brand="product.brand"
            />
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import ProductCard from '@/components/ProductCard.vue';
  import Breadcrumb from '@/components/Breadcrumb.vue';
  import { useCartStore } from '@/stores/cart'; // Import cart store if needed
  
  export default {
    name: "Портативна електростанція",
    components: {
      ProductCard,
      Breadcrumb,
    },
    setup() {
      const route = useRoute();
      const categoryId = route.params.id || null; // Optional: For filtering
  
      // Sample products with categoryId (if needed)
      const products = ref([
        { 
          id: 90, 
          name: "Портативна.електростанція.Jackery.Explorer.240-1", 
          price: 500, 
          image: "/images/Categories/переносні.електростанції/Jackery/Портативна.електростанція.Jackery.Explorer.240-1.jpg",
          brand: "Delta",
          categoryId: 9 // Example category ID
        },
        { 
          id: 91, 
          name: "Портативна.електростанція.Jackery.Explorer.100.Plus-1", 
          price: 700, 
          image: "/images/Categories/переносні.електростанції/Jackery/Портативна.електростанція.Jackery.Explorer.100.Plus-1.jpg",
          brand: "ABB",
          categoryId: 9 
        },
        { 
          id: 92, 
          name: "Портативна.електростанція.Jackery.Explorer.240.v2-1", 
          price: 700, 
          image: "/images/Categories/переносні.електростанції/Jackery/Портативна.електростанція.Jackery.Explorer.240.v2-1.png",
          brand: "ABB",
          categoryId: 9 
        },
        { 
          id: 93, 
          name: "Портативна.електростанція.Jackery.Explorer.240.v2-1", 
          price: 700, 
          image: "/images/Categories/переносні.електростанції/Jackery/Портативна.електростанція.Jackery.Explorer.240.v2-1.png",
          brand: "ABB",
          categoryId: 9 
        },
        { 
          id: 94, 
          name: "Портативна.електростанція.Jackery.Explorer.240.v2-1", 
          price: 700, 
          image: "/images/Categories/переносні.електростанції/Jackery/Портативна.електростанція.Jackery.Explorer.240.v2-1.png",
          brand: "ABB",
          categoryId: 9 
        },
      ]);
  
      // Optional: Filter products by category (like SolarPanels)
      const displayedProducts = computed(() => {
        if (categoryId) {
          return products.value.filter(
            (product) => product.categoryId === Number(categoryId)
          );
        }
        return products.value;
      });
  
      // Breadcrumbs
      const breadcrumbs = ref([
        { name: "Головна", link: "/" },
        { name: "Низьковольтна Продукція", link: "/low-voltage" },
        { name: "Портативна електростанція" },
      ]);
  
      const pageTitle = "Портативна електростанція";
  
      return {
        displayedProducts, // Use this if filtering
        pageTitle,
        breadcrumbs,
      };
    },
  };
  </script>
  
  <style scoped>
  /* If your header is fixed at ~60px, shift content down. */
  .catalogue-view {
    margin-top: 120px;
  }
  
  /* Optional spacing for the breadcrumb. */
  .breadcrumb-spacing {
    margin-bottom: 1rem;
  }
  
  .products-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
    padding: 20px;
    background-color: #f9fafb;
  }
  
  @media (max-width: 1600px) {
    .products-container {
      grid-template-columns: repeat(5, 1fr);
    }
  }
  
  @media (max-width: 1200px) {
    .products-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (max-width: 992px) {
    .products-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 600px) {
    .products-container {
      grid-template-columns: 1fr;
    }
  }
  </style>
  