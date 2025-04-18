<template>
  <div class="catalogue-view">
    <!-- Breadcrumb Component with same design classes -->
    <Breadcrumb :breadcrumbs="breadcrumbs" class="breadcrumb-spacing" />

    <h1>{{ pageTitle }}</h1>

    <!-- Product Listing -->
    <div class="products-container">
      <div
        v-for="product in products"
        :key="product.uniqueKey"
        class="product-card-wrapper"
      >
        <!-- Wrap ProductCard in <router-link> to /product/:id -->
        <router-link
          :to="`/product/${product.id}`"
          style="text-decoration: none; color: inherit"
        >
          <!-- ProductCard component -->
          <ProductCard
            :productId="product.id"
            :title="getTranslatedProductName(product)"
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
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import ProductCard from "@/components/ProductCard.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { useCartStore } from "@/stores/cart";
import { useProductsStore } from "@/stores/products";

export default {
  name: "SolarSets",
  components: {
    ProductCard,
    Breadcrumb,
  },
  setup() {
    const { t, locale } = useI18n();
    const cartStore = useCartStore();
    const route = useRoute();

    // Get category ID from the route and ensure it's correctly parsed
    const categoryId = 4;
    const store = useProductsStore();

    const products = computed(() => {
      return store.getProducts.filter(
        (product) => +product.categoryId === categoryId
      );
    });

    // Add uniqueKey to each product
    products.value.forEach((product) => {
      product.uniqueKey = product.id;
    });
    // Get translated product name based on current locale
    const getTranslatedProductName = (product) => {
      return t(product.nameKey, product.defaultName);
    };

    // Define breadcrumbs
    const breadcrumbs = ref([
      { name: "Home", link: "/" },
      { name: "Каталог", link: "/catalogue" },
      { name: "SolarSets" },
    ]);

    const pageTitle = "SolarSets";

    return {
      products,
      pageTitle,
      getTranslatedProductName,

      breadcrumbs,
    };
  },
};
</script>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 20px;
}

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

.product-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.product-header {
  position: relative;
  padding: 1rem;
  background: #f8f9fa;
}

.product-checkbox {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  transform: scale(1.2);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  display: block;
}

.product-details {
  padding: 1rem;
}

.brand {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.product-title {
  font-size: 1.1rem;
  margin: 0.5rem 0;
  color: #333;
}

.price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 1rem 0;
}

.add-to-cart {
  width: 100%;
  padding: 0.8rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-to-cart:hover {
  background-color: #359c6d;
}

@media (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
