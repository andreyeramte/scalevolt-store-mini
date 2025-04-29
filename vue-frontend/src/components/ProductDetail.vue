<template>
  <div class="product-detail">
    <!-- Breadcrumb Component -->
    <Breadcrumb :breadcrumbs="breadcrumbs" />

    <!-- Product Details -->
    <div v-if="product" class="product-container">
      <div class="product-image-section">
        <img
          :src="getImageUrl(product.attributes.general_information.images.data[0])"
          alt="Product Image"
          class="product-image"
        />
      </div>
      
      <div class="product-info-section">
        <h1 class="product-title">{{ product.attributes.general_information.name }}</h1>
        
        <div class="product-meta">
          <div v-if="product.attributes.general_information.brand" class="product-brand">
            <span class="meta-label">{{ $t('product.brand') }}:</span> 
            <span class="meta-value">{{ product.attributes.general_information.brand }}</span>
          </div>
          
          <div v-if="product.attributes.general_information.model" class="product-model">
            <span class="meta-label">{{ $t('product.model') }}:</span> 
            <span class="meta-value">{{ product.attributes.general_information.model }}</span>
          </div>
        </div>
        
        <div class="product-price">
          {{ formatPrice(product.attributes.pricing_and_inventory.price) }} грн
        </div>
        
        <div class="product-availability" 
             :class="{ 'in-stock': product.attributes.pricing_and_inventory.in_stock, 
                      'out-of-stock': !product.attributes.pricing_and_inventory.in_stock }">
          {{ product.attributes.pricing_and_inventory.in_stock ? 
             $t('product.available') : $t('product.outOfStock') }}
        </div>

        <!-- Add to Cart Section -->
        <div class="add-to-cart-section">
          <div v-if="product.attributes.pricing_and_inventory.in_stock">
            <div v-if="itemInCart" class="quantity-controls">
              <button @click="decreaseQuantity" class="quantity-btn">-</button>
              <span class="quantity-display">{{ cartQuantity }}</span>
              <button @click="increaseQuantity" class="quantity-btn">+</button>
            </div>
            <button v-else @click="addToCart" class="add-to-cart-btn">
              {{ $t('product.addToCart') }}
            </button>
          </div>
          <button v-else disabled class="out-of-stock-btn">
            {{ $t('product.outOfStock') }}
          </button>
        </div>
        
        <!-- Product Details Tabs -->
        <div class="product-tabs">
          <div class="tab-headers">
            <button 
              @click="activeTab = 'description'" 
              :class="{ active: activeTab === 'description' }" 
              class="tab-btn"
            >
              {{ $t('product.description') }}
            </button>
            <button 
              @click="activeTab = 'specifications'" 
              :class="{ active: activeTab === 'specifications' }" 
              class="tab-btn"
            >
              {{ $t('product.specifications') }}
            </button>
          </div>
          
          <div class="tab-content">
            <div v-if="activeTab === 'description'" class="description-tab">
              <div v-html="product.attributes.general_information.description"></div>
            </div>
            
            <div v-if="activeTab === 'specifications'" class="specifications-tab">
              <div v-if="product.attributes.specifications">
                <div v-for="(value, key) in product.attributes.specifications" :key="key" class="spec-item">
                  <span class="spec-label">{{ formatSpecKey(key) }}:</span>
                  <span class="spec-value">{{ value }}</span>
                </div>
              </div>
              <div v-else class="no-specs">
                {{ $t('product.noSpecifications') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="loading-state">
      <p v-if="loading" class="loading-message">{{ $t('common.loading') }}</p>
      <p v-else class="error-message">{{ $t('product.notFound') }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useHead } from '@vueuse/head'; // Make sure to install this package
import productService from '@/services/productService';
import Breadcrumb from '@/components/Breadcrumb.vue';
import { useCartStore } from '@/stores/cart';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { translateText } from '@/services/api';

export default {
  name: 'ProductDetail',
  components: {
    Breadcrumb,
  },
  setup() {
    const route = useRoute();
    const cartStore = useCartStore();
    const { t } = useI18n();

    // State
    const product = ref(null);
    const loading = ref(true);
    const breadcrumbs = ref([]);
    const cartQuantity = ref(0);
    const activeTab = ref('description');
    const jsonLdScript = ref(null);

    // Computed property to check if item is in cart
    const itemInCart = computed(() => cartQuantity.value > 0);

    // Computed for absolute image URL
    const getAbsoluteImageUrl = (imageData) => {
      if (!imageData || !imageData.attributes || !imageData.attributes.url) return '';
      const baseUrl = window.location.origin;
      const imagePath = `http://localhost:1337${imageData.attributes.url}`;
      // In production, adjust this to your domain
      return imagePath.replace('http://localhost:1337', baseUrl);
    };

    // Generate structured data for the product
    const generateStructuredData = () => {
      if (!product.value) return null;

      const productData = product.value;
      const imageData = productData.attributes.general_information.images.data[0];
      const imageUrl = imageData ? getAbsoluteImageUrl(imageData) : '';

      return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": productData.attributes.general_information.name,
        "image": imageUrl,
        "description": productData.attributes.general_information.description || "",
        "brand": {
          "@type": "Brand",
          "name": productData.attributes.general_information.brand || "ScaleVolt"
        },
        "sku": productData.id.toString(),
        "mpn": productData.attributes.general_information.model || productData.id.toString(),
        "offers": {
          "@type": "Offer",
          "url": window.location.href,
          "priceCurrency": "UAH",
          "price": productData.attributes.pricing_and_inventory.price.toString(),
          "availability": productData.attributes.pricing_and_inventory.in_stock 
            ? "https://schema.org/InStock" 
            : "https://schema.org/OutOfStock"
        }
      };
    };

    // Add JSON-LD script to the page
    const addStructuredData = () => {
      if (!product.value) return;

      const structuredData = generateStructuredData();
      if (!structuredData) return;

      // Remove any existing script
      if (jsonLdScript.value && document.head.contains(jsonLdScript.value)) {
        document.head.removeChild(jsonLdScript.value);
      }

      // Create and add new script
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
      jsonLdScript.value = script;
    };

    // Set Open Graph and meta tags
    const setMetaTags = () => {
      if (!product.value) return {};

      const productData = product.value;
      const imageData = productData.attributes.general_information.images.data[0];
      const imageUrl = imageData ? getAbsoluteImageUrl(imageData) : '';
      const productName = productData.attributes.general_information.name;
      const productDescription = productData.attributes.general_information.description || 
        `${productName} - ${t('common.productDefaultDescription')}`;
      const strippedDescription = productDescription.replace(/<[^>]*>/g, '').substring(0, 160);

      return {
        title: productName,
        meta: [
          // Basic meta tags
          { name: 'description', content: strippedDescription },
          
          // Open Graph meta tags
          { property: 'og:title', content: productName },
          { property: 'og:description', content: strippedDescription },
          { property: 'og:image', content: imageUrl },
          { property: 'og:url', content: window.location.href },
          { property: 'og:type', content: 'product' },
          { property: 'og:site_name', content: 'ScaleVolt' },
          { property: 'og:price:amount', content: productData.attributes.pricing_and_inventory.price.toString() },
          { property: 'og:price:currency', content: 'UAH' },
          
          // Twitter Card meta tags
          { name: 'twitter:card', content: 'product' },
          { name: 'twitter:title', content: productName },
          { name: 'twitter:description', content: strippedDescription },
          { name: 'twitter:image', content: imageUrl }
        ],
        link: [
          { rel: 'canonical', href: window.location.href }
        ]
      };
    };

    // Use vueuse/head to set the page metadata
    const head = computed(() => setMetaTags());
    useHead(head);

    const fetchProduct = async () => {
      try {
        const id = route.params.id;
        const response = await productService.getProductById(id, {
          populate: {
            general_information: {
              populate: ['images'],
            },
            pricing_and_inventory: true,
            specifications: true,
            category: true,
          },
        });
        product.value = response.data.data;

        // Set up breadcrumbs after fetching the product
        if (product.value && product.value.attributes) {
          const productName = product.value.attributes.general_information.name;
          const categoryData =
            product.value.attributes.category &&
            product.value.attributes.category.data;

          if (categoryData && categoryData.attributes) {
            const categoryName = categoryData.attributes.name || t('common.category');
            const categoryId = categoryData.id || '';

            breadcrumbs.value = [
              { name: t('common.home'), link: '/' },
              { name: categoryName, link: `/category/${categoryId}` },
              { name: productName, link: '' },
            ];
          } else {
            // If category data is missing
            breadcrumbs.value = [
              { name: t('common.home'), link: '/' },
              { name: t('common.category'), link: '' },
              { name: productName, link: '' },
            ];
          }
        } else {
          breadcrumbs.value = [{ name: t('common.home'), link: '/' }];
        }

        // Update cart quantity for this product
        updateCartQuantity();
        
        // Add structured data after product is loaded
        addStructuredData();
      } catch (error) {
        console.error('Error fetching product:', error);
        product.value = null;
        breadcrumbs.value = [{ name: t('common.home'), link: '/' }];
      } finally {
        loading.value = false;
      }
    };

    const getImageUrl = (imageData) => {
      if (!imageData || !imageData.attributes || !imageData.attributes.url)
        return '';
      return `http://localhost:1337${imageData.attributes.url}`;
    };

    const formatPrice = (price) => {
      return price ? price.toLocaleString() : '0';
    };

    const formatSpecKey = (key) => {
      // Convert snake_case or camelCase to readable text
      return key
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
    };

    const addToCart = () => {
      if (product.value && product.value.attributes.pricing_and_inventory.in_stock) {
        const imageData = product.value.attributes.general_information.images.data[0];
        const imageUrl = imageData ? getImageUrl(imageData) : '';
        
        const productData = {
          id: product.value.id,
          name: product.value.attributes.general_information.name,
          price: product.value.attributes.pricing_and_inventory.price,
          image: imageUrl,
          brand: product.value.attributes.general_information.brand || '',
          model: product.value.attributes.general_information.model || '',
        };
        
        cartStore.addToCart({ ...productData, quantity: 1 });
        cartQuantity.value = 1;
      }
    };

    const increaseQuantity = () => {
      if (product.value) {
        cartQuantity.value += 1;
        cartStore.updateQuantity(product.value.id, cartQuantity.value);
      }
    };

    const decreaseQuantity = () => {
      if (product.value && cartQuantity.value > 1) {
        cartQuantity.value -= 1;
        cartStore.updateQuantity(product.value.id, cartQuantity.value);
      } else if (product.value && cartQuantity.value === 1) {
        cartStore.removeFromCart(product.value.id);
        cartQuantity.value = 0;
      }
    };

    const updateCartQuantity = () => {
      if (product.value) {
        const quantity = cartStore.getItemQuantity(product.value.id);
        cartQuantity.value = quantity;
      }
    };

    watch(
      () => route.params.id,
      () => {
        loading.value = true;
        fetchProduct();
        cartQuantity.value = 0; // Reset cart quantity when product changes
      },
      { immediate: true }
    );

    watch(
      () => cartStore.cartItems,
      () => {
        updateCartQuantity();
      },
      { deep: true }
    );

    // Add cleanup on component destroy
    onBeforeUnmount(() => {
      if (jsonLdScript.value && document.head.contains(jsonLdScript.value)) {
        document.head.removeChild(jsonLdScript.value);
      }
    });

    return {
      product,
      loading,
      breadcrumbs,
      cartQuantity,
      itemInCart,
      activeTab,
      fetchProduct,
      getImageUrl,
      formatPrice,
      formatSpecKey,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      $t: t
    };
  },
};
</script>

<style scoped>
.product-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.product-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 30px;
}

.product-image-section {
  flex: 1;
  min-width: 300px;
}

.product-image {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.product-info-section {
  flex: 1;
  min-width: 300px;
}

.product-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.product-meta {
  margin-bottom: 20px;
}

.product-brand, .product-model {
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.meta-label {
  font-weight: 500;
  color: #666;
}

.meta-value {
  color: #333;
}

.product-price {
  font-size: 1.8rem;
  font-weight: 600;
  color: #4CAF50;
  margin-bottom: 15px;
}

.product-availability {
  margin-bottom: 20px;
  font-weight: 500;
}

.in-stock {
  color: #4CAF50;
}

.out-of-stock {
  color: #e53935;
}

.add-to-cart-section {
  margin-bottom: 30px;
}

.add-to-cart-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-to-cart-btn:hover {
  background-color: #e04350;
  transform: translateY(-2px);
}

.out-of-stock-btn {
  background-color: #f5f5f5;
  color: #999;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: not-allowed;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #4CAF50;
  background-color: white;
  color: #4CAF50;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}

.quantity-btn:hover {
  background-color: #4CAF50;
  color: white;
}

.quantity-display {
  font-size: 1.1rem;
  font-weight: 500;
  min-width: 30px;
  text-align: center;
}

.product-tabs {
  margin-top: 40px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.tab-headers {
  display: flex;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  padding: 15px 25px;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn.active {
  border-bottom: 3px solid #4CAF50;
  color: #4CAF50;
}

.tab-btn:hover {
  background-color: #f0f0f0;
}

.tab-content {
  padding: 20px;
}

.description-tab {
  line-height: 1.6;
}

.specifications-tab {
  display: grid;
  gap: 15px;
}

.spec-item {
  display: flex;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.spec-label {
  flex: 1;
  font-weight: 500;
  color: #666;
}

.spec-value {
  flex: 2;
  color: #333;
}

.no-specs {
  color: #999;
  font-style: italic;
}

.loading-state {
  text-align: center;
  padding: 50px 0;
}

.loading-message {
  color: #666;
  font-size: 1.1rem;
}

.error-message {
  color: #e53935;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .product-container {
    flex-direction: column;
  }
  
  .product-title {
    font-size: 1.5rem;
  }
  
  .product-price {
    font-size: 1.5rem;
  }
  
  .tab-btn {
    padding: 12px 15px;
    font-size: 0.9rem;
  }
}
</style>