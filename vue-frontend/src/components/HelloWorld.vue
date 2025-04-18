<template>
  <div class="product-card">
    <img :src="imageSrc" alt="Product Image" class="product-image" />
    <h2 class="product-name">{{ title }}</h2>
    <h3 class="product-brand">{{ brand }}</h3> <!-- Added brand display -->
    <h3 class="product-price">{{ price }} грн</h3>

    <!-- Add to Cart Button Logic -->
    <div v-if="cartCount === 0">
      <button class="add-to-cart" @click="addToCart">Add to Cart</button>
    </div>
    <div v-else class="quantity-controls">
      <button @click="decreaseCount">-</button>
      <span>{{ cartCount }}</span>
      <button @click="increaseCount">+</button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'ProductCard',
  props: {
    title: String,
    price: Number,
    imageSrc: String,
    brand: String,
  },
  data() {
    return {
      cartCount: 0,
    };
  },
  methods: {
    addToCart() {
      this.cartCount = 1;
    },
    increaseCount() {
      this.cartCount++;
    },
    decreaseCount() {
      if (this.cartCount > 1) {
        this.cartCount--;
      } else {
        this.cartCount = 0;
      }
    },
  },
};
</script>

<style scoped>
.product-card {
  background-color: #f9f9f9; /* Light gray background */
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  margin: 10px;
  font-family: 'Roboto', sans-serif;
    transition: box-shadow 0.3s ease;

}

.product-image {
  width: 100%;
  height: auto;
  margin-bottom: 12px;
  border-radius: 4px;
}

.product-brand {
  font-size: 1em;
  color: #666;
  margin-bottom: 8px;
}

.product-name {
  font-size: 1.2em;
  color: #333; /* Dark text color */
  margin-bottom: 8px;
}

.product-price {
  font-size: 1em;
  color: #666; /* Slightly lighter text color */
  margin-bottom: 16px;
}

.add-to-cart,
.quantity-controls button {
  background-color: #007bff; /* Blue button background */
  color: #fff; /* White text */
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.add-to-cart:hover,
.quantity-controls button:hover {
  background-color: #0056b3; /* Darker blue on hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.quantity-controls span {
  font-size: 1.2em;
  color: #333;
}

.quantity-controls button {
  width: 32px;
  height: 32px;
  font-size: 1.2em;
}

/* Additional Styles for Better Visibility */
body {
  background-color: #fff;
}

button {
  font-family: inherit;
}

h2, h3 {
  font-weight: normal;
}
</style>
