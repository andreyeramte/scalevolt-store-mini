<!-- src/views/CheckoutSuccess.vue -->
<template>
  <div class="success-view">
    <div class="success-container">
      <div class="success-icon">
        <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
          <circle cx="26" cy="26" r="25" fill="#52c41a" />
          <path d="M14,27.5 L21,34.5 L38,17.5" stroke="white" stroke-width="4" fill="none" />
        </svg>
      </div>
      
      <h1>Thank You for Your Order!</h1>
      <p class="order-number">Order #{{ orderId }}</p>
      <p class="success-message">
        Your order has been successfully processed. We've sent a confirmation email with all the details to {{ orderEmail }}.
      </p>

      <div class="order-details">
        <h2>Order Summary</h2>
        
        <div v-if="orderData" class="summary-container">
          <div class="items-summary">
            <h3>Items Ordered</h3>
            <div v-for="(item, index) in orderData.items" :key="index" class="order-item">
              <div class="item-info">
                <p class="item-name">{{ item.name }}</p>
                <p class="item-quantity">Qty: {{ item.quantity }}</p>
              </div>
              <p class="item-price">{{ formatPrice(item.price * item.quantity) }} грн</p>
            </div>
          </div>
          
          <div class="shipping-summary">
            <h3>Shipping Information</h3>
            <p>{{ orderData.shippingInfo.firstName }} {{ orderData.shippingInfo.lastName }}</p>
            <p>{{ orderData.shippingInfo.address }}</p>
            <p>{{ orderData.shippingInfo.city }}, {{ orderData.shippingInfo.postalCode }}</p>
            <p>{{ orderData.shippingInfo.country }}</p>
            <p><strong>Shipping Method:</strong> {{ getShippingMethodName(orderData.shippingInfo.method) }}</p>
          </div>
          
          <div class="payment-summary">
            <h3>Payment Details</h3>
            <p><strong>Payment Method:</strong> {{ getPaymentMethodName(orderData.paymentMethod) }}</p>
            <div class="total-details">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>{{ formatPrice(orderData.totals.subtotal) }} грн</span>
              </div>
              <div class="total-row">
                <span>Tax:</span>
                <span>{{ formatPrice(orderData.totals.tax) }} грн</span>
              </div>
              <div class="total-row">
                <span>Shipping:</span>
                <span>{{ formatPrice(orderData.totals.shipping) }} грн</span>
              </div>
              <div class="total-row total">
                <span>Total:</span>
                <span>{{ formatPrice(orderData.totals.total) }} грн</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="loading-summary">
          <p>Loading order details...</p>
        </div>
      </div>
      
      <div class="action-buttons">
        <router-link to="/" class="continue-button">Continue Shopping</router-link>
        <button @click="trackOrder" class="track-button">Track Your Order</button>
      </div>
      
      <div class="support-section">
        <h3>Need Help?</h3>
        <p>If you have any questions about your order, please contact our customer support:</p>
        <a href="mailto:support@scalevolt.ua" class="support-link">support@scalevolt.ua</a>
        <p>or call us at: <a href="tel:+380123456789" class="support-link">+38 (012) 345-67-89</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useToast } from 'vue-toastification';

export  default {
  name: 'CheckoutCancel',
  setup() {
    const cartStore = useCartStore();
    const router = useRouter();
    
    // Get cart items
    const cartItems = computed(() => cartStore.cartItems);
    
    // Calculate total price
    const totalPrice = computed(() => cartStore.totalPrice);
    
    // Format price with thousands separator
    const formatPrice = (price) => {
      return price.toLocaleString('en-US');
    };
    
    return {
      cartItems,
      totalPrice,
      formatPrice
    };
  }
};
</script>

<style scoped>
.cancel-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
  color: #333;
}

.cancel-container {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
}

.cancel-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #ff4d4f;
}

.cancel-message {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 40px;
}

.cart-summary {
  margin: 0 auto 40px;
  max-width: 600px;
  text-align: left;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.cart-items {
  margin-top: 20px;
}

.cart-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.item-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.item-details {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.95rem;
}

.item-subtotal {
  font-weight: 500;
  color: #333;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed #ddd;
  font-weight: 600;
  font-size: 1.1rem;
}

.empty-cart-message {
  text-align: center;
  padding: 20px 0;
  color: #999;
}

.help-section {
  margin: 40px 0;
  text-align: left;
}

h3 {
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: center;
}

.help-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.help-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.help-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

h4 {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 10px;
}

.contact-link {
  display: inline-block;
  margin-top: 5px;
  color: #1890ff;
  text-decoration: none;
  font-weight: 500;
}

.contact-link:hover {
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 40px 0;
}

.retry-button, .continue-button {
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
}

.retry-button {
  background-color: #ff4d4f;
  color: #ffffff;
  border: none;
}

.retry-button:hover {
  background-color: #d9363e;
}

.continue-button {
  background-color: #fff;
  color: #333;
  border: 1px solid #d9d9d9;
}

.continue-button:hover {
  background-color: #f5f5f5;
}

.payment-methods {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.payment-methods p {
  margin-bottom: 10px;
  color: #999;
}

.payment-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.payment-icon {
  display: inline-block;
  padding: 5px 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .cancel-container {
    padding: 30px 20px;
  }
  
  .help-content {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .retry-button, .continue-button {
    width: 100%;
  }
}
</style>