<template>
  <div class="catalogue-view">
    <Breadcrumb
      :breadcrumbs="localizedBreadcrumbs"
      class="breadcrumb-spacing"
    />
    <h1>{{ $t("header.categories.batteries") }}</h1>

    <div class="products-container">
      <div
        v-for="product in products"
        :key="product.uniqueKey"
        class="product-card-wrapper"
      >
        <router-link
          :to="`/product/${product.id}`"
          style="text-decoration: none; color: inherit"
        >
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
  name: "Batteries",
  components: {
    ProductCard,
    Breadcrumb,
  },
  setup() {
    const { t, locale } = useI18n();
    const cartStore = useCartStore();
    const route = useRoute();
    const categoryId = 2;
    const store = useProductsStore();

    // Product data with translation keys
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
      return t(product.nameKey) + " " + product.defaultName;
    };

    // Define localized breadcrumbs
    const localizedBreadcrumbs = computed(() => [
      { name: t("common.home"), link: "/" },
      { name: t("common.categories"), link: "/catalogue" },
      { name: t("header.categories.batteries") },
    ]);

    return {
      products,
      getTranslatedProductName,
      localizedBreadcrumbs,
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
