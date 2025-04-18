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
      <!-- In your ProductPage.vue template, add this after the cart control section -->
<div v-if="product && product.installationAvailable" class="installation-section">
  <h3>Professional Installation</h3>
  <div class="installation-toggle">
    <input type="checkbox" v-model="addInstallation" id="add-installation" />
    <label for="add-installation">Add Professional Installation</label>
  </div>
  
  <!-- Installation options appear when checkbox is checked -->
  <div v-if="addInstallation" class="installation-options">
    <div class="form-group">
      <label for="company-name">Company Name (if applicable)</label>
      <input type="text" id="company-name" v-model="installationDetails.companyName" placeholder="Enter company name">
    </div>

    <div class="form-group">
      <label for="installation-address">Installation Address</label>
      <input type="text" id="installation-address" v-model="installationDetails.address" placeholder="Enter installation address" required>
      <span class="required-indicator">Required</span>
    </div>
    
    <!-- Installation provided by messaging -->
    <div class="installation-provider">
      <img src="/images/energy-infrastructure-logo.png" alt="Energy Infrastructure Company" class="provider-logo">
      <span>Installation provided by Energy Infrastructure Company</span>
    </div>
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
    name: "EV Charger Stands",
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
          id: 11, 
          name: "Octa Wall 2 Plug", 
          price: 500, 
          image: "/images/dvushka_connectors0001_white.png", 
          brand: "Delta",
          categoryId: 2 // Example category ID
        },
        { 
          id: 12, 
          name: "Octa Wall 3 Plug", 
          price: 700, 
          image: "/images/treshka_connectors0001_white.png", 
          brand: "ABB",
          categoryId: 2 
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
        { name: "Зарядки" },
      ]);
  
      const pageTitle = "Зарядки";
  // In your setup() function, add these new reactive properties
const addInstallation = ref(false);
const installationDetails = ref({
  companyName: '',
  address: '',
  notes: ''
});

// Modify your addToCart function to include installation if selected
const addToCart = () => {
  if (product.value) {
    const cartItem = {
      id: product.value.id,
      title: product.value.title || product.value.name,
      price: product.value.price,
      image: productImages.value[0] || '/images/placeholder.png',
      quantity: quantity.value,
      // Add installation details if selected
      installation: addInstallation.value ? {
        required: true,
        details: installationDetails.value
      } : null
    };
    cartStore.addItem(cartItem);
    
    // If installation was selected, send data to installation API
    if (addInstallation.value && installationDetails.value.address) {
      sendInstallationRequest(cartItem);
    }
    alert(`Added ${quantity.value} ${product.value.title || product.value.name} to cart${addInstallation.value ? ' with installation' : ''}`);
  }
};

// Add a method to communicate with your installation company's system
const sendInstallationRequest = async (item) => {
  try {
    // This would be an API call to your installation company's system
    // For now we'll just log the data
    console.log('Sending installation request:', {
      product: item,
      installationDetails: installationDetails.value
    });
    
    // In a real implementation, you would send this data to your API
    // const response = await fetch('https://your-installation-api.com/requests', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     product: item,
    //     installationDetails: installationDetails.value
    //   })
    // });
  } catch (error) {
    console.error('Error sending installation request:', error);
  }
};

      return {
        displayedProducts, // Use this if filtering
        pageTitle,
        breadcrumbs,
        addInstallation,
  installationDetails,
  addToCart,
      };
    },
  };
  </script>
  
  <style scoped>
  /* If your header is fixed at ~60px, shift content down. */
  .catalogue-view {
    margin-top: 80px;
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

  /* Add these to your <style> section */
.installation-section {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.installation-toggle {
  margin-bottom: 20px;
}

.installation-options {
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.required-indicator {
  color: #f26e9a;
  font-size: 12px;
  margin-left: 5px;
}

.installation-provider {
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.provider-logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
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
  