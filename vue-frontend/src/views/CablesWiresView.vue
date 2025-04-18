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
        <ProductCard
          :title="product.name"
          :price="product.price"
          :image-src="product.image"
          :brand="product.brand"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue' // Keep path correct
import BreadcrumbTest from '@/components/Breadcrumb.vue' // Not used but kept
import ProductCard from '@/components/ProductCard.vue'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'CablesWires',
  components: {
    ProductCard,
    Breadcrumb,
  },
  setup() {
    console.log('CablesWires.vue is being rendered!')

    const cartStore = useCartStore()

    // Define breadcrumb path
    const breadcrumbs = ref([
      { name: 'Головна', link: '/' },
      { name: 'Низьковольтна Продукція', link: '#' },
      { name: 'Кабелі електричні та дроти' },
    ])

    // Products array
    const products = ref([
      {
        id: 1,
        name: 'Сонячні Панелі Ja Solar',
        price: 700,
        image: '/Categories/ja-solar420.jpg',
        brand: 'Ja Solar',
        categoryId: '1',
      },
      // ... (rest of your products)
    ])

    // Assign uniqueKey to each product
    products.value.forEach(product => {
      product.uniqueKey = product.id
    })

    // Track product quantities
    const productQuantities = ref({})
    products.value.forEach(product => {
      productQuantities.value[product.uniqueKey] = 1 // Default quantity is 1
    })

    // Cart-related methods
    const isProductInCart = uniqueKey => {
      return cartStore.cartItems.some(item => item.uniqueKey === uniqueKey)
    }

    const getProductQuantity = uniqueKey => {
      return cartStore.getItemQuantity(uniqueKey)
    }

    const addToCart = product => {
      const quantity = productQuantities.value[product.uniqueKey]
      cartStore.addToCart({
        ...product,
        quantity,
      })
    }

    const increaseQuantity = uniqueKey => {
      cartStore.increaseQuantity(uniqueKey)
    }

    const decreaseQuantity = uniqueKey => {
      cartStore.decreaseQuantity(uniqueKey)
    }

    const validateQuantity = uniqueKey => {
      const qty = productQuantities.value[uniqueKey]
      if (qty < 1 || isNaN(qty)) {
        productQuantities.value[uniqueKey] = 1
      }
    }

    const pageTitle = 'Кабелі електричні та дроти'

    return {
      breadcrumbs,
      products,
      pageTitle,
      productQuantities,
      isProductInCart,
      getProductQuantity,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      validateQuantity,
    }
  },
}
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

/* Existing styles */
.products-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  padding: 20px;
  background-color: #f9fafb;
}

/* Add to Cart Section Styles */
.add-to-cart-section {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.add-to-cart-section button {
  padding: 5px 10px;
  font-size: 14px;
}

.add-to-cart-section span {
  font-size: 14px;
}

.quantity-input {
  width: 60px;
  text-align: center;
}

/* Responsive styles */
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
