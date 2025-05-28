<template>
  <div class="catalogue-view">
    <!-- Breadcrumb Component with same design classes -->
    <Breadcrumb :breadcrumbs="breadcrumbs" class="breadcrumb-spacing" />

    <h1>{{ pageTitle }}</h1>

    <!-- Product Listing -->
    <div class="products-container">
      <div
        v-for="product in displayedProducts"
        :key="product.uniqueKey"
        class="product-card-wrapper"
      >

        <!-- Wrap ProductCard in <router-link> to /product/:id -->
          <router-link
          :to="`/product/${product.id}`"
          style="text-decoration: none; color: inherit;"
        >

        <!-- Corrected ProductCard component tag -->
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
import { useCartStore } from '@/stores/cart';

export default {
  name: 'PortableSolarPanels',
  components: {
    ProductCard,
    Breadcrumb,
  },
  setup() {
    const cartStore = useCartStore();
    const route = useRoute();
    const categoryId = route.params.id || null;

    const products = ref([
      {
        id: 1,
        name: 'Портативні-Сонячні-панелі-Jackery-SolarSaga-100W',
        price: 1000,
        image: '/images/Categories/solar.panels/Портативні-Сонячні-панелі-Jackery-SolarSaga-100W.png',
        brand: 'Longi',
        categoryId: 12,
      },
      {
        id: 2,
        name: 'Сонячна Панель Longi-420-Black',
        price: 1200,
        image: '/images/Categories/solar.panels/Longi-420-Black.png',
        brand: 'Longi',
        categoryId: 12,
      },
      {
        id: 3,
        name: 'Сонячна Панель Longi-425-Black',
        price: 1000,
        image: '/images/Categories/solar.panels/Longi-425-Black.png',
        brand: 'Longi',
        categoryId: 12,
      },
      {
        id: 4,
        name: 'Сонячна Панель Longi-530-Black',
        price: 1200,
        image: '/images/Categories/solar.panels/Longi-530-Black.png',
        brand: 'Longi',
        categoryId: 12,
      },
      {
        id: 5,
        name: 'Сонячна Панель Longi-630-Bifacial',
        price: 1000,
        image: '/images/Categories/solar.panels/Longi-630-Bifacial.png',
        brand: 'Longi',
        categoryId: 12,
      },
      {
        id: 6,
        name: 'Сонячна Панель Longi-430',
        price: 1200,
        image: '/images/Categories/solar.panels/Longi-430.png',
        brand: 'Longi',
        categoryId: 13,
      },
      {
        id: 7,
        name: 'Сонячна Панель Longi-580',
        price: 1000,
        image: '/images/Categories/solar.panels/Longi-580.png',
        brand: 'Longi',
        categoryId: 14,
      },
      {
        id: 8,
        name: 'Сонячна Панель Longi-585',
        price: 1200,
        image: '/images/Categories/solar.panels/Longi-585.png',
        brand: 'Longi',
        categoryId: 15,
      },
      {
        id: 9,
        name: 'Сонячна Панель Longi-440',
        price: 1000,
        image: '/images/Categories/solar.panels/Longi-440.png',
        brand: 'Longi-440',
        categoryId: 16,
      },
      {
        id: 10,
        name: 'Сонячна Панель Longi-455',
        price: 1200,
        image: '/images/Categories/solar.panels/Longi-455.png',
        brand: 'Longi',
        categoryId: 17,
      },
    ]);

    // Add uniqueKey to each product
    products.value.forEach((product) => {
      product.uniqueKey = product.id;
    });

    // Filter products by categoryId if present
    const displayedProducts = computed(() => {
      if (categoryId) {
        return products.value.filter(
          (product) => product.categoryId === categoryId
        );
      }
      return products.value;
    });

    // Define breadcrumbs
    const breadcrumbs = ref([
      { name: 'Home', link: '/' },
      { name: 'Каталог', link: '/catalogue' },
      { name: 'Портативні сонячні панелі' },
    ]);

    const pageTitle = 'Портативні сонячні панелі';

    return {
      displayedProducts,
      pageTitle,
      breadcrumbs,
    };
  },
};
</script>

<style scoped>

.catalogue-view {
  padding-top: 120px; /* Header height + 10px buffer */
  margin-top: 0 !important;
}

.products-container {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 15px;
  padding: 20px;
  background-color: #f9fafb;
}

/* Match other pages so breadcrumb isn't hidden by a fixed header */
.catalogue-view {
  margin-top: 80px;
}

/* Same class used in Breadcrumb.vue for consistent spacing */
.breadcrumb-spacing {
  margin-bottom: 1rem;
  /* margin-top: 1rem; /* If you want additional top spacing above the breadcrumb */
}

/* Your existing styles */
.products-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Five columns */
  gap: 15px;
  padding: 20px;
  background-color: #f9fafb;
}

/* Responsive styles */
@media (max-width: 1600px) {
  .products-container {
    grid-template-columns: repeat(5, 1fr); /* Four columns */
  }
}

@media (max-width: 1200px) {
  .products-container {
    grid-template-columns: repeat(3, 1fr); /* Three columns */
  }
}

@media (max-width: 992px) {
  .products-container {
    grid-template-columns: repeat(2, 1fr); /* Two columns */
  }
}

@media (max-width: 600px) {
  .products-container {
    grid-template-columns: 1fr; /* One column */
  }
}
</style>