<template>
  <div class="category-view">
    <h1>{{ displayCategoryName }}</h1>

    <!-- Show Loading Indicator -->
    <div v-if="loading" class="loading-indicator">{{ $t('common.loading') }}</div>

    <!-- Show Products Only When Data is Loaded -->
    <div v-else-if="filteredProducts.length > 0" class="products-container">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :productId="product.id"
        :title="product.name || product.title"
        :price="product.price"
        :imageSrc="getProductImage(product)"
        :brand="product.brand"
        :isRentalItem="product.isRentalItem"
        :rentalPrices="product.rentalPrices"
      />
    </div>
    
    <!-- No products found message -->
    <div v-else class="no-products">
      <p>{{ $t('common.noProductsFound') }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n'; // Import the i18n composable
import ProductCard from '@/components/ProductCard.vue';
import productService from '@/services/productService';
import mockProducts from '@/data/mockProducts';  // Import the mock products

export default {
  name: 'CategoryView',
  components: {
    ProductCard,
  },
  props: {
    categoryName: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const route = useRoute();
    const { t } = useI18n(); // Get the translation function
    const products = ref([]);
    const loading = ref(true);
    const categoryName = ref('');
    
    // Map routes to translation keys instead of hardcoded strings
    const routeToTypeKey = {
      '/generators': 'homeView.generators',
      '/industrial-generators': 'homeView.industrialGenerators',
      '/solar-lighting-towers': 'homeView.solarLightingTowers',
      '/lifts-and-cranes': 'homeView.liftsAndCranes',
      '/dc-charging-stations': 'homeView.dcChargingStations',
      '/ac-charging-stations': 'homeView.acChargingStations',
      '/portable-charging-devices': 'homeView.portableChargingDevices',
      '/solar-panels': 'homeView.solarPanels',
      '/batteries': 'homeView.batteries',
      '/inverters': 'homeView.inverters',
      '/solar-sets': 'homeView.solarSets',
      '/mounting-systems': 'homeView.mountingSystems'
    };

    // Map for untranslated type values that need to match the database
    const typeMapping = {
      'homeView.generators': 'Генератори',
      'homeView.industrialGenerators': 'Промислові генератори для важких навантажень (100 кВт+)',
      'homeView.solarLightingTowers': 'Освітлювальні вежі на сонячних батареях',
      'homeView.liftsAndCranes': 'Підйомники та Крани',
      'homeView.dcChargingStations': 'Швидкі Зарядні Станції (DC)',
      'homeView.acChargingStations': 'Зарядні Станції Рівня 2 (AC)',
      'homeView.portableChargingDevices': 'Портативні/Мобільні Зарядні Пристрої',
      'homeView.solarPanels': 'Сонячні Панелі',
      'homeView.batteries': 'Батареї',
      'homeView.inverters': 'Інвертори',
      'homeView.solarSets': 'SolarSets',
      'homeView.mountingSystems': 'Система монтажу сонячних панелей'
    };

    // Rental categories that should use rental item display (using translation keys)
    const rentalCategoryKeys = [
      'homeView.generators', 
      'homeView.industrialGenerators', 
      'homeView.solarLightingTowers',
      'homeView.liftsAndCranes'
    ];

    // Determine if we should use API or mock data based on route
    const isCustomRoute = computed(() => {
      return Object.keys(routeToTypeKey).includes(route.path);
    });

    // Get display name - from props or route mapping (now translated)
    const displayCategoryName = computed(() => {
      if (props.categoryName) {
        return props.categoryName;
      }
      
      if (isCustomRoute.value) {
        const translationKey = routeToTypeKey[route.path];
        return translationKey ? t(translationKey) : categoryName.value;
      }
      
      return categoryName.value;
    });

    // Fetch products by type
    const fetchProductsByType = async (typeKey) => {
      loading.value = true;
      
      // Get the database type from the translation key
      const databaseType = typeMapping[typeKey];
      
      try {
        // First, try API
        try {
          const response = await productService.getProducts({ 
            filters: { 
              type: { $eq: databaseType } 
            },
            populate: ['general_information.images', 'pricing_and_inventory']
          });
          
          if (response.data && response.data.length > 0) {
            products.value = response.data.map(product => {
              const isRental = rentalCategoryKeys.includes(typeKey);
              return {
                id: product.id,
                name: product.attributes?.name || product.name,
                price: product.attributes?.pricing_and_inventory?.price || product.price,
                image: product.attributes?.general_information?.images?.data?.[0]?.attributes?.url || product.image,
                brand: product.attributes?.general_information?.brand || product.brand,
                // Add rental-specific properties
                isRentalItem: isRental,
                rentalPrices: isRental ? {
                  day: product.attributes?.pricing_and_inventory?.day_price || 150,
                  week: product.attributes?.pricing_and_inventory?.week_price || 300,
                  month: product.attributes?.pricing_and_inventory?.month_price || 600
                } : {}
              };
            });
            return;
          }
        } catch (apiError) {
          console.warn('API fetch failed, falling back to mock products', apiError);
        }

        // Fallback to mock data with rental information
        products.value = mockProducts
          .filter(product => 
            product.type === databaseType || 
            product.type?.toLowerCase() === databaseType.toLowerCase()
          )
          .map(product => {
            const isRental = rentalCategoryKeys.includes(typeKey);
            return {
              ...product,
              isRentalItem: isRental,
              rentalPrices: isRental ? (product.rentalPrices || {
                day: 150,
                week: 300,
                month: 600
              }) : {}
            };
          });
      } catch (error) {
        console.error('Error fetching products by type:', error);
        products.value = [];
      } finally {
        loading.value = false;
      }
    };

    // Fetch products by category ID
    const fetchProductsByCategory = async (categoryId) => {
      loading.value = true;
      try {
        const response = await productService.getProducts({
          populate: ['general_information.images', 'pricing_and_inventory'],
          filters: {
            categoryId: {
              $eq: categoryId,
            },
          },
        });

        products.value = response.data.data.map((product) => ({
          id: product.id,
          name: product.attributes.name,
          price: product.attributes.pricing_and_inventory?.price || 0,
          image: product.attributes.general_information.images?.data?.[0]?.attributes?.url || '/default-image.jpg',
          brand: product.attributes.general_information.brand || 'No Brand',
        }));

        categoryName.value = products.value.length > 0 ? products.value[0].attributes.categoryName : t('common.category');
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        loading.value = false;
      }
    };

    // Watch for route changes and fetch appropriate products
    watchEffect(() => {
      if (isCustomRoute.value) {
        const typeKey = routeToTypeKey[route.path];
        if (typeKey) {
          fetchProductsByType(typeKey);
        }
      } else {
        const categoryId = route.params.id;
        if (categoryId) {
          fetchProductsByCategory(categoryId);
        }
      }
    });

    // Helper function to get product image
    const getProductImage = (product) => {
      if (product.images && product.images.length > 0) {
        return product.images[0];
      } else if (product.image) {
        return Array.isArray(product.image) ? product.image[0] : product.image;
      }
      return '/images/placeholder.png';
    };

    return {
      filteredProducts: computed(() => products.value),
      displayCategoryName,
      loading,
      getProductImage
    };
  },
};
</script>