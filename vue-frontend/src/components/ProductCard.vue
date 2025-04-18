<template>
  <div class="product-card" :class="{ 'rental-mode': isRentalItem }">
    <!-- Only Image & Title Navigate to Product Page -->
    <router-link :to="productLink" class="product-image">
      <img :src="imageSrc" :alt="title || 'Product Image'" />
    </router-link>

    <router-link :to="productLink" class="product-name">
      <h2>{{ $t(title) }}</h2>
    </router-link>

    <!-- Conditionally show brand if not empty -->
    <div v-if="brand" class="product-brand">
      {{ $t("product.brand") }}: {{ brand }}
    </div>

    <!-- Pricing Display -->
    <div v-if="isRentalItem" class="rental-pricing">
      <div class="rental-duration-options">
        <button
          v-for="(price, duration) in rentalPrices"
          :key="duration"
          @click="selectRentalDuration(duration)"
          :class="{ selected: selectedDuration === duration }"
        >
          {{ formatDurationDisplay(duration) }}
        </button>
      </div>
      <h3 class="product-price">
        {{ formatRentalPrice(selectedDuration) }} грн / {{ selectedDuration }}
      </h3>
    </div>
    <h3 v-else class="product-price">{{ price }} грн</h3>

    <!-- Transition between Add-to-Cart and +/- controls -->
    <transition name="fade">
      <div v-if="cartCount > 0" class="quantity-controls">
        <button @click.stop.prevent="decreaseCount" class="decrement-btn">
          -
        </button>
        <span class="quantity-number">{{ cartCount }}</span>
        <button @click.stop.prevent="increaseCount" class="increment-btn">
          +
        </button>
      </div>
      <button v-else class="add-to-cart" @click.stop.prevent="handleAddToCart">
        {{ isRentalItem ? $t("product.rent") : $t("product.addToCart") }}
      </button>
    </transition>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useCartStore } from "@/stores/cart";
import { useI18n } from "vue-i18n";

export default {
  name: "ProductCard",
  props: {
    productId: {
      type: [Number, String],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageSrc: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: false,
      default: "",
    },
    // New prop for rental items
    rentalPrices: {
      type: Object,
      default: () => ({}),
    },
    // Flag to indicate if this is a rental item
    isRentalItem: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const cartStore = useCartStore();
    const { t, locale } = useI18n();

    // State for rental duration
    const selectedDuration = ref("day");

    // Computed property to get the current quantity from the store
    const cartCount = computed(() =>
      cartStore.getItemQuantity(props.productId)
    );

    // Computed property for the product link
    const productLink = computed(() => `/product/${props.productId}`);

    // Method to format rental price
    const formatRentalPrice = (duration) => {
      return props.rentalPrices[duration]
        ? props.rentalPrices[duration].toLocaleString()
        : "N/A";
    };

    // Method to format duration display based on current language
    const formatDurationDisplay = (duration) => {
      // Use translations for durations
      const durationKeys = {
        day: "product.durations.day",
        week: "product.durations.week",
        month: "product.durations.month",
      };

      return durationKeys[duration]
        ? t(durationKeys[duration])
        : duration.charAt(0).toUpperCase() + duration.slice(1);
    };

    // Method to select rental duration
    const selectRentalDuration = (duration) => {
      selectedDuration.value = duration;
    };

    // Method to add product to cart
    const handleAddToCart = () => {
      if (props.isRentalItem) {
        // Special handling for rental items
        cartStore.addToCart({
          id: props.productId,
          name: props.title,
          price: props.rentalPrices[selectedDuration.value],
          image: props.imageSrc,
          brand: props.brand,
          quantity: 1,
          rentalDuration: selectedDuration.value,
          isRental: true,
        });
      } else {
        // Regular product add to cart
        cartStore.addToCart({
          id: props.productId,
          name: props.title,
          price: props.price,
          image: props.imageSrc,
          brand: props.brand,
          quantity: 1,
        });
      }

      // Force UI to update instantly by modifying a reactive property
      cartStore.$patch((state) => {
        state.cartItems = [...state.cartItems];
      });
    };

    // Method to increase quantity
    const increaseCount = () => {
      cartStore.increaseQuantity(props.productId);
    };

    // Method to decrease quantity
    const decreaseCount = () => {
      cartStore.decreaseQuantity(props.productId);
    };

    return {
      cartCount,
      productLink,
      handleAddToCart,
      increaseCount,
      decreaseCount,
      selectedDuration,
      selectRentalDuration,
      formatRentalPrice,
      formatDurationDisplay,
      $t: t,
    };
  },
};
</script>

<style scoped>
/* Product Card Container */
.product-card {
  border: 1px solid #e0e0e0;
  padding: 15px; /* Increased padding for better spacing */
  border-radius: 10px; /* Slightly rounded edges */
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12); /* Slightly stronger shadow */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: white;
  max-width: 250px; /* Ensures uniform card size */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Card Hover Effect */
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Rental Mode Specific Styling */
.product-card.rental-mode {
  border: 2px solid #4caf50;
}

.rental-pricing {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.rental-duration-options {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.rental-duration-options button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rental-duration-options button.selected {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
}

.rental-duration-options button:hover {
  background-color: #e0e0e0;
}

/* Product Image */
.product-image img {
  width: 100%;
  height: 180px; /* Fixed height for consistency */
  object-fit: contain; /* Prevents image distortion */
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

/* Product Name */
.product-name {
  text-decoration: none;
  color: inherit;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  display: block;
  /* Add these new properties for text wrapping */
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  max-width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.product-name h2 {
  margin: 10px 0;
  color: #333; /* Slightly lighter black */
  font-size: 18px;
  /* Add these new properties for text wrapping */
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
}

/* Brand Name */
.product-brand {
  margin-bottom: 8px;
  font-style: italic;
  color: #777;
  font-size: 14px;
}

/* Product Price */
.product-price {
  font-weight: bold;
  font-size: 18px;
  color: #444;
  margin-top: 5px;
}

/* Add to Cart Button */
.add-to-cart {
  background-color: #4caf50;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  width: 90%;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.2s ease, transform 0.1s ease;
  margin-top: 10px;
}

/* Smooth Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.add-to-cart:hover {
  background-color: #e04350;
  transform: scale(1.05);
}

/* Quantity Controls */
.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

/* Buttons for Increasing/Decreasing Quantity */
.decrement-btn,
.increment-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #4caf50; /* Replace with your logo color */
  color: #4caf50; /* Replace with your logo color */
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 18px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.decrement-btn:hover,
.increment-btn:hover {
  background-color: #4caf50;
  color: #fff;
}

/* Quantity Number Display */
.quantity-number {
  color: #000;
  padding: 0 15px;
  font-size: 16px;
  font-weight: bold;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .product-card {
    max-width: 100%;
  }

  .product-image img {
    height: 160px;
  }

  .product-name h2 {
    font-size: 16px;
  }

  .add-to-cart {
    width: 100%;
  }
}
</style>
