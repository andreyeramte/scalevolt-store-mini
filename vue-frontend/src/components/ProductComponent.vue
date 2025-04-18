// src/components/ProductCatalog.vue // This is a reusable component that can be
used for all catalog pages

<template>
  <div class="catalogue-view">
    <!-- Breadcrumb Component with same design classes -->
    <Breadcrumb
      :breadcrumbs="localizedBreadcrumbs"
      class="breadcrumb-spacing"
    />

    <h1>{{ $t(catalogTitle) }}</h1>

    <!-- Product Listing -->
    <div v-if="loading" class="loading-indicator">
      {{ $t("common.loading") }}
    </div>

    <div v-else-if="displayedProducts.length > 0" class="products-container">
      <div
        v-for="product in displayedProducts"
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
            :title="product.name"
            :price="product.price"
            :image-src="product.image"
            :brand="product.brand"
            :isRentalItem="product.isRentalItem"
            :rentalPrices="product.rentalPrices"
          />
        </router-link>
      </div>
    </div>

    <div v-else class="no-products">
      <p>{{ $t("common.noProductsFound") }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import ProductCard from "@/components/ProductCard.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

export default {
  name: "ProductCatalog",
  components: {
    ProductCard,
    Breadcrumb,
  },
  props: {
    // Raw product data array
    products: {
      type: Array,
      required: true,
    },
    // Type key used for translation ('solarPanels', 'batteries', etc.)
    catalogType: {
      type: String,
      required: true,
    },
    // Whether products are rental items
    isRental: {
      type: Boolean,
      default: false,
    },
    // Loading state
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const route = useRoute();

    // Get category ID from the route and ensure it's correctly parsed
    const categoryId = computed(() => {
      return route.params.id ? Number(route.params.id) : null;
    });

    // Catalog title translation key
    const catalogTitle = computed(() => `catalog.${props.catalogType}`);

    // Localized breadcrumbs
    const localizedBreadcrumbs = computed(() => [
      { name: t("common.home"), link: "/" },
      { name: t("common.categories"), link: "/catalogue" },
      { name: t(catalogTitle.value) },
    ]);

    // Process products to add unique keys and translate names
    const processedProducts = computed(() => {
      return props.products.map((product) => {
        // Create translation key for the product
        const nameKey = `products.${product.type || props.catalogType}.id_${
          product.id
        }.name`;

        return {
          ...product,
          uniqueKey: product.id,
          name: t(nameKey, product.name), // Translate or fallback to original
          isRentalItem: props.isRental || product.isRentalItem,
        };
      });
    });

    // Filter products by categoryId if present
    const displayedProducts = computed(() => {
      if (categoryId.value) {
        return processedProducts.value.filter(
          (product) => product.categoryId === categoryId.value
        );
      }
      return processedProducts.value;
    });

    return {
      displayedProducts,
      localizedBreadcrumbs,
      catalogTitle,
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

.loading-indicator {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.no-products {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

/* Same class used in Breadcrumb.vue for consistent spacing */
.breadcrumb-spacing {
  margin-bottom: 1rem;
}

/* Responsive styles */
@media (max-width: 1600px) {
  .products-container {
    grid-template-columns: repeat(4, 1fr);
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
