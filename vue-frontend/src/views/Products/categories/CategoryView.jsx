<template>
  <div class="category-view">
    <h1>{{ displayCategoryName }}</h1>

    <!-- Show Loading Indicator -->
    <div v-if="loading" class="loading-indicator">
      {{ $t('common.loading') }}
    </div>

    <!-- Show Products Only When Data is Loaded -->
    <div v-if="!loading && filteredProducts.length > 0" class="products-container">
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
    <div v-if="!loading && filteredProducts.length === 0" class="no-products">
      <p>{{ $t('common.noProductsFound') }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ProductCard from '../components/ProductCard.vue'; // Adjust path as needed

export default {
  name: 'CategoryView',
  components: {
    ProductCard
  },
  props: {
    categoryName: {
      type: String,
      default: ''
    },
    currentPath: {
      type: String,
      default: ''
    },
    categoryId: {
      type: [String, Number],
      default: null
    }
  },
  setup(props) {
    const { t } = useI18n();
    const route = useRoute();
    
    const products = ref([]);
    const loading = ref(true);
    const currentCategoryName = ref('');

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

    // Mock products (replace with your actual mock data import)
    const mockProducts = [
      {
        id: 1,
        name: 'Дизельний генератор 50кВт',
        type: 'Генератори',
        price: 25000,
        image: '/images/generator-1.jpg',
        brand: 'ScaleVolt',
        rentalPrices: { day: 150, week: 800, month: 2500 }
      },
      {
        id: 2,
        name: 'Промисловий генератор 150кВт',
        type: 'Промислові генератори для важких навантажень (100 кВт+)',
        price: 85000,
        image: '/images/generator-2.jpg',
        brand: 'ScaleVolt Pro',
        rentalPrices: { day: 350, week: 2000, month: 7500 }
      }
    ];

    // Mock product service (replace with your actual service)
    const productService = {
      getProducts: async (options = {}) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          data: mockProducts,
          data: {
            data: mockProducts // For category ID response structure
          }
        };
      }
    };

    // Determine if we should use API or mock data based on route
    const isCustomRoute = computed(() => {
      return props.currentPath && Object.keys(routeToTypeKey).includes(props.currentPath);
    });

    // Get display name - from props or route mapping (now translated)
    const displayCategoryName = computed(() => {
      if (props.categoryName) {
        return props.categoryName;
      }
      
      if (isCustomRoute.value) {
        const translationKey = routeToTypeKey[props.currentPath];
        return translationKey ? t(translationKey) : currentCategoryName.value;
      }
      
      return currentCategoryName.value;
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
            const processedProducts = response.data.map(product => {
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
            products.value = processedProducts;
            return;
          }
        } catch (apiError) {
          console.warn('API fetch failed, falling back to mock products', apiError);
        }

        // Fallback to mock data with rental information
        const mockFilteredProducts = mockProducts
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
        
        products.value = mockFilteredProducts;
      } catch (error) {
        console.error('Error fetching products by type:', error);
        products.value = [];
      } finally {
        loading.value = false;
      }
    };

    // Fetch products by category ID
    const fetchProductsByCategory = async (catId) => {
      loading.value = true;
      try {
        const response = await productService.getProducts({
          populate: ['general_information.images', 'pricing_and_inventory'],
          filters: {
            categoryId: {
              $eq: catId,
            },
          },
        });

        const processedProducts = response.data.data.map((product) => ({
          id: product.id,
          name: product.attributes.name,
          price: product.attributes.pricing_and_inventory?.price || 0,
          image: product.attributes.general_information.images?.data?.[0]?.attributes?.url || '/default-image.jpg',
          brand: product.attributes.general_information.brand || 'No Brand',
        }));

        products.value = processedProducts;
        currentCategoryName.value = processedProducts.length > 0 ? processedProducts[0].attributes.categoryName : t('common.category');
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        loading.value = false;
      }
    };

    // Helper function to get product image
    const getProductImage = (product) => {
      if (product.images && product.images.length > 0) {
        return product.images[0];
      } else if (product.image) {
        return Array.isArray(product.image) ? product.image[0] : product.image;
      }
      return '/images/placeholder.png';
    };

    const filteredProducts = computed(() => products.value);

    // Watch for route changes and fetch appropriate products
    watch([isCustomRoute, () => props.currentPath, () => props.categoryId], () => {
      if (isCustomRoute.value) {
        const typeKey = routeToTypeKey[props.currentPath];
        if (typeKey) {
          fetchProductsByType(typeKey);
        }
      } else {
        if (props.categoryId) {
          fetchProductsByCategory(props.categoryId);
        }
      }
    }, { immediate: true });

    return {
      products,
      loading,
      currentCategoryName,
      displayCategoryName,
      filteredProducts,
      getProductImage
    };
  }
};
</script>

<style scoped>
.category-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.category-view h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.loading-indicator {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.no-products {
  text-align: center;
  padding: 40px;
  color: #666;
}

.no-products p {
  font-size: 18px;
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .category-view {
    padding: 15px;
  }
  
  .category-view h1 {
    font-size: 1.5rem;
  }
  
  .products-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .products-container {
    grid-template-columns: 1fr;
  }
}
</style>