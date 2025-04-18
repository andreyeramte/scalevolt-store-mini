<!-- src/views/CheckoutView.vue -->
<template>
  <div class="checkout-view">
    <h1>Checkout</h1>

    <div class="checkout-container">
      <!-- Checkout Steps -->
      <div class="checkout-steps">
        <div class="step" :class="{ active: currentStep === 1 }">1. Shipping</div>
        <div class="step" :class="{ active: currentStep === 2 }">2. Payment</div>
        <div class="step" :class="{ active: currentStep === 3 }">3. Review</div>
      </div>

      <!-- Step 1: Shipping Information -->
      <div v-if="currentStep === 1" class="checkout-section shipping-info">
        <h2>Shipping Information</h2>
        
        <!-- Saved Addresses Section -->
        <div class="saved-addresses" v-if="savedAddresses.length > 0">
          <h3>Your Saved Addresses</h3>
          <div class="address-selection">
            <div 
              v-for="(address, index) in savedAddresses" 
              :key="index"
              class="address-option"
              :class="{ selected: selectedAddressIndex === index }"
              @click="selectSavedAddress(index)"
            >
              <div class="address-info">
                <div class="address-name">
                  {{ address.label }} 
                  <span v-if="address.isDefault" class="default-badge">Default</span>
                </div>
                <p>{{ address.fullName }}</p>
                <p>{{ address.street }}, {{ address.apartment }}</p>
                <p>{{ address.city }}, {{ address.postalCode }}</p>
                <p>{{ address.country }}</p>
                <p>{{ address.phone }}</p>
              </div>
              <div class="address-select">
                <input 
                  type="radio" 
                  :id="`address-${index}`" 
                  name="saved-address" 
                  :checked="selectedAddressIndex === index" 
                />
              </div>
            </div>
          </div>
          <div class="or-separator">
            <span>or enter a new address</span>
          </div>
        </div>
        
        <form @submit.prevent="nextStep" class="shipping-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                v-model="shippingInfo.firstName" 
                required
              />
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                v-model="shippingInfo.lastName" 
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="shippingInfo.email" 
              required
            />
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="shippingInfo.phone" 
              required
            />
          </div>

          <div class="form-group">
            <label for="address">Address</label>
            <input 
              type="text" 
              id="address" 
              v-model="shippingInfo.address" 
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="city">City</label>
              <input 
                type="text" 
                id="city" 
                v-model="shippingInfo.city" 
                required
              />
            </div>
            <div class="form-group">
              <label for="postalCode">Postal Code</label>
              <input 
                type="text" 
                id="postalCode" 
                v-model="shippingInfo.postalCode" 
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="country">Country</label>
            <select id="country" v-model="shippingInfo.country" required>
              <option value="Ukraine">Ukraine</option>
              <option value="Poland">Poland</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="form-group shipping-options">
            <h3>Shipping Method</h3>
            <div class="shipping-option">
              <input 
                type="radio" 
                id="standard" 
                value="standard" 
                v-model="shippingInfo.method"
              />
              <label for="standard">
                <div class="shipping-option-details">
                  <span class="option-name">Standard Shipping</span>
                  <span class="option-time">3-5 Business Days</span>
                </div>
                <span class="option-price">{{ formatPrice(standardShippingCost) }} грн</span>
              </label>
            </div>
            <div class="shipping-option">
              <input 
                type="radio" 
                id="express" 
                value="express" 
                v-model="shippingInfo.method"
              />
              <label for="express">
                <div class="shipping-option-details">
                  <span class="option-name">Express Shipping</span>
                  <span class="option-time">1-2 Business Days</span>
                </div>
                <span class="option-price">{{ formatPrice(expressShippingCost) }} грн</span>
              </label>
            </div>
          </div>

          <div class="form-buttons">
            <button type="button" @click="goToCart" class="back-button">Back to Cart</button>
            <button type="submit" class="next-button">Continue to Payment</button>
          </div>
        </form>
      </div>

      <!-- Step 2: Payment Method -->
      <div v-if="currentStep === 2" class="checkout-section payment-info">
        <h2>Payment Method</h2>
        <div class="payment-options">
          <div class="payment-option">
            <input 
              type="radio" 
              id="card-payment" 
              value="card" 
              v-model="paymentMethod"
            />
            <label for="card-payment">
              <span class="option-name">Credit/Debit Card</span>
              <div class="card-icons">
                <span class="card-icon">Visa</span>
                <span class="card-icon">Mastercard</span>
              </div>
            </label>
          </div>
          <div class="payment-option">
            <input 
              type="radio" 
              id="bank-transfer" 
              value="transfer" 
              v-model="paymentMethod"
            />
            <label for="bank-transfer">
              <span class="option-name">Bank Transfer</span>
            </label>
          </div>
          <div class="payment-option">
            <input 
              type="radio" 
              id="pay-on-delivery" 
              value="pod" 
              v-model="paymentMethod"
            />
            <label for="pay-on-delivery">
              <span class="option-name">Pay on Delivery</span>
              <span class="option-price">+50 грн</span>
            </label>
          </div>
        </div>

        <div class="form-buttons">
          <button type="button" @click="prevStep" class="back-button">Back to Shipping</button>
          <button type="button" @click="nextStep" class="next-button">Review Order</button>
        </div>
      </div>

      <!-- Step 3: Order Review -->
      <div v-if="currentStep === 3" class="checkout-section order-review">
        <h2>Review Your Order</h2>
        
        <div class="review-section">
          <h3>Shipping Information</h3>
          <div class="review-info">
            <p>{{ shippingInfo.firstName }} {{ shippingInfo.lastName }}</p>
            <p>{{ shippingInfo.email }}</p>
            <p>{{ shippingInfo.phone }}</p>
            <p>{{ shippingInfo.address }}</p>
            <p>{{ shippingInfo.city }}, {{ shippingInfo.postalCode }}</p>
            <p>{{ shippingInfo.country }}</p>
            <p><strong>Shipping Method:</strong> {{ getShippingMethodName() }}</p>
          </div>
          <button type="button" @click="editSection(1)" class="edit-button">Edit</button>
        </div>
        
        <div class="review-section">
          <h3>Payment Method</h3>
          <div class="review-info">
            <p><strong>{{ getPaymentMethodName() }}</strong></p>
          </div>
          <button type="button" @click="editSection(2)" class="edit-button">Edit</button>
        </div>
        
        <div class="review-section">
          <h3>Order Items</h3>
          <div class="order-items">
            <div v-for="item in cartItems" :key="item.uniqueKey" class="review-item">
              <div class="item-image">
                <img :src="item.image" :alt="item.name" />
              </div>
              <div class="item-details">
                <p class="item-name">{{ item.name }}</p>
                <p class="item-quantity">Qty: {{ item.quantity }}</p>
              </div>
              <p class="item-price">{{ formatPrice(item.price * item.quantity) }} грн</p>
            </div>
          </div>
        </div>

        <div class="form-buttons">
          <button type="button" @click="prevStep" class="back-button">Back to Payment</button>
          <button type="button" @click="handleCheckout" class="checkout-button">Place Order</button>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="order-summary">
        <h2>Order Summary</h2>
        <div class="summary-item">
          <span>Items ({{ totalQuantity }}):</span>
          <span>{{ formatPrice(totalPrice) }} грн</span>
        </div>
        <div class="summary-item">
          <span>Tax (20%):</span>
          <span>{{ formatPrice(tax) }} грн</span>
        </div>
        <div class="summary-item">
          <span>Shipping:</span>
          <span>{{ formatPrice(shippingCost) }} грн</span>
        </div>
        <div v-if="paymentMethod === 'pod'" class="summary-item">
          <span>Pay on Delivery Fee:</span>
          <span>50 грн</span>
        </div>
        <hr />
        <div class="summary-total">
          <span>Total:</span>
          <span>{{ formatPrice(orderTotal) }} грн</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { loadStripe } from '@stripe/stripe-js';
import { getAuth } from 'firebase/auth';

export default {
  name: 'CheckoutView',
  setup() {
    const cartStore = useCartStore();
    const userStore = useUserStore();
    const router = useRouter();
    const toast = useToast();
    const auth = getAuth();
    
    // Current step in checkout process
    const currentStep = ref(1);
    
    // Add this to store saved addresses
    const savedAddresses = ref([]);
    const selectedAddressIndex = ref(-1);
    
    // Shipping information
    const shippingInfo = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'Ukraine',
      method: 'standard'
    });
    
    // Payment method
    const paymentMethod = ref('card');
    
    // Cart data
    const cartItems = computed(() => cartStore.cartItems);
    const totalPrice = computed(() => cartStore.totalPrice);
    const totalQuantity = computed(() => cartStore.totalQuantity);
    
    // Shipping costs
    const standardShippingCost = computed(() => 
      totalPrice.value > 5000 ? 0 : 200 // Free shipping over 5000 грн
    );
    
    const expressShippingCost = computed(() => 
      totalPrice.value > 10000 ? 0 : 350 // Free express shipping over 10000 грн
    );
    
    // Calculate shipping cost based on selected method
    const shippingCost = computed(() => {
      if (shippingInfo.value.method === 'express') {
        return expressShippingCost.value;
      }
      return standardShippingCost.value;
    });
    
    // Tax calculation (20%)
    const tax = computed(() => totalPrice.value * 0.2);
    
    // Total order cost
    const orderTotal = computed(() => {
      let total = totalPrice.value + tax.value + shippingCost.value;
      if (paymentMethod.value === 'pod') {
        total += 50; // Pay on delivery fee
      }
      return total;
    });
    
    // Function to select a saved address
    const selectSavedAddress = (index) => {
      selectedAddressIndex.value = index;
      const address = savedAddresses.value[index];
      
      // Extract first and last name from full name
      const nameParts = address.fullName.split(' ');
      
      // Update shipping information
      shippingInfo.value.firstName = nameParts[0] || '';
      shippingInfo.value.lastName = nameParts.slice(1).join(' ') || '';
      shippingInfo.value.phone = address.phone || '';
      shippingInfo.value.address = `${address.street}, ${address.apartment}`;
      shippingInfo.value.city = address.city || '';
      shippingInfo.value.postalCode = address.postalCode || '';
      shippingInfo.value.country = address.country || 'Ukraine';
    };
    
    // Navigate between steps
    const nextStep = () => {
      if (currentStep.value < 3) {
        currentStep.value++;
        window.scrollTo(0, 0);
      }
    };
    
    const prevStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--;
        window.scrollTo(0, 0);
      }
    };
    
    const editSection = (step) => {
      currentStep.value = step;
      window.scrollTo(0, 0);
    };
    
    const goToCart = () => {
      router.push({ name: 'Cart' });
    };
    
    // Get shipping method display name
    const getShippingMethodName = () => {
      return shippingInfo.value.method === 'express' 
        ? 'Express Shipping (1-2 Business Days)' 
        : 'Standard Shipping (3-5 Business Days)';
    };
    
    // Get payment method display name
    const getPaymentMethodName = () => {
      switch (paymentMethod.value) {
        case 'card':
          return 'Credit/Debit Card';
        case 'transfer':
          return 'Bank Transfer';
        case 'pod':
          return 'Pay on Delivery';
        default:
          return 'Credit/Debit Card';
      }
    };
    
    // Format price with thousands separator
    const formatPrice = (price) => {
      return price.toLocaleString('en-US');
    };
    
    // Handle checkout process with Stripe
    const handleCheckout = async () => {
      if (cartItems.value.length === 0) {
        toast.error('Your cart is empty.');
        return;
      }
      
      try {
        // Show loading notification
        toast.info('Processing your order...');
        
        // Initialize Stripe
        const stripe = await loadStripe('YOUR_PUBLISHABLE_KEY');
        
        // Prepare order data
        const orderData = {
          items: cartItems.value.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          shippingInfo: { ...shippingInfo.value },
          paymentMethod: paymentMethod.value,
          totals: {
            subtotal: totalPrice.value,
            tax: tax.value,
            shipping: shippingCost.value,
            total: orderTotal.value
          }
        };
        
        // Create a checkout session on the server
        const response = await fetch('http://localhost:4242/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
        
        const session = await response.json();
        
        if (session.id) {
          // For card payments, redirect to Stripe
          if (paymentMethod.value === 'card') {
            const result = await stripe.redirectToCheckout({
              sessionId: session.id,
            });
            
            if (result.error) {
              toast.error(result.error.message);
            }
          } else {
            // For other payment methods, redirect to success page directly
            // In a real implementation, you'd handle this differently
            localStorage.setItem('orderData', JSON.stringify(orderData));
            router.push({ name: 'CheckoutSuccess', query: { orderId: session.orderId } });
          }
        } else if (session.url) {
          // Alternative Stripe redirect method
          window.location.href = session.url;
        } else {
          toast.error('Unable to process your order. Please try again.');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        toast.error('An error occurred during checkout. Please try again.');
      }
    };
    
    // Load user data on component mount
    onMounted(async () => {
      // Check if cart is empty
      if (cartItems.value.length === 0) {
        toast.error('Your cart is empty.');
        router.push({ name: 'Cart' });
        return;
      }
      
      // Load user data if authenticated
      const user = auth.currentUser;
      if (user) {
        // Pre-fill basic information
        const nameParts = user.displayName ? user.displayName.split(' ') : ['', ''];
        shippingInfo.value.firstName = nameParts[0] || '';
        shippingInfo.value.lastName = nameParts.slice(1).join(' ') || '';
        shippingInfo.value.email = user.email || '';
        
        // Load saved addresses from user store or Firestore
        try {
          // This is a placeholder - in a real app, you'd load from Firestore
          // For now, we'll use sample data similar to what's in the profile view
          savedAddresses.value = [
            {
              id: 'addr1',
              label: 'Home',
              type: 'shipping',
              fullName: 'Ivan Petrenko',
              street: 'Khreshchatyk Street 12',
              apartment: 'Apt 45',
              city: 'Kyiv',
              postalCode: '01001',
              country: 'Ukraine',
              phone: '+380991234567',
              isDefault: true
            },
            {
              id: 'addr2',
              label: 'Office',
              type: 'shipping',
              fullName: 'Ivan Petrenko',
              street: 'Business Center',
              apartment: 'Floor 3, Office 302',
              city: 'Kyiv',
              postalCode: '01004',
              country: 'Ukraine',
              phone: '+380991234567',
              isDefault: false
            }
          ];
          
          // If addresses were loaded and there's a default, select it
          const defaultIndex = savedAddresses.value.findIndex(addr => addr.isDefault);
          if (defaultIndex >= 0) {
            selectSavedAddress(defaultIndex);
          }
        } catch (error) {
          console.error('Error loading saved addresses:', error);
        }
      }
    });
    
    return {
      currentStep,
      shippingInfo,
      paymentMethod,
      cartItems,
      totalPrice,
      totalQuantity,
      tax,
      standardShippingCost,
      expressShippingCost,
      shippingCost,
      orderTotal,
      savedAddresses,
      selectedAddressIndex,
      selectSavedAddress,
      nextStep,
      prevStep,
      editSection,
      goToCart,
      getShippingMethodName,
      getPaymentMethodName,
      formatPrice,
      handleCheckout
    };
  }
};
</script>

<style scoped>
/* Root Styles */
.checkout-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  color: #333;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
  font-weight: 600;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
}

h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 15px;
}

/* Checkout Steps */
.checkout-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;
}

.checkout-steps::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #eee;
  z-index: 1;
}

.step {
  position: relative;
  z-index: 2;
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 500;
  color: #999;
  border: 2px solid #eee;
}

.step.active {
  color: #333;
  border-color: #52c41a;
  background-color: #f6ffed;
}

/* Checkout Container */
.checkout-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.checkout-section {
  flex: 2;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

/* Form Styles */
.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
  flex: 1;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

input:focus, select:focus {
  outline: none;
  border-color: #52c41a;
  box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.2);
}

/* Shipping Options */
.shipping-options {
  margin-top: 30px;
}

.shipping-option {
  margin-bottom: 15px;
}

.shipping-option input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.shipping-option label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.shipping-option input[type="radio"]:checked + label {
  border-color: #52c41a;
  background-color: #f6ffed;
}

.shipping-option-details {
  display: flex;
  flex-direction: column;
}

.option-name {
  font-weight: 600;
}

.option-time {
  font-size: 0.9rem;
  color: #666;
}

.option-price {
  font-weight: 600;
}

/* Payment Options */
.payment-options {
  margin-bottom: 30px;
}

.payment-option {
  margin-bottom: 15px;
}

.payment-option input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.payment-option label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-option input[type="radio"]:checked + label {
  border-color: #52c41a;
  background-color: #f6ffed;
}

.card-icons {
  display: flex;
  gap: 10px;
}

.card-icon {
  font-size: 0.9rem;
  color: #666;
}

/* Review Section */
.review-section {
  margin-bottom: 30px;
  position: relative;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.review-info p {
  margin: 5px 0;
}

.edit-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 0.9rem;
}

.order-items {
  max-height: 300px;
  overflow-y: auto;
  margin-top: 15px;
}

.review-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.item-image img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  flex: 1;
  margin-left: 15px;
}

.item-name {
  font-weight: 500;
}

.item-quantity {
  font-size: 0.9rem;
  color: #666;
}

.item-price {
  font-weight: 600;
}

/* Order Summary */
.order-summary {
  flex: 1;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  align-self: flex-start;
  position: sticky;
  top: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 1rem;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 20px 0;
}

hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
}

/* Button Styles */
.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.back-button {
  padding: 12px 24px;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.next-button, .checkout-button {
  padding: 12px 24px;
  background-color: #52c41a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.next-button:hover, .checkout-button:hover {
  background-color: #41a516;
}

/* Saved Addresses Styles */
.saved-addresses {
  margin-bottom: 30px;
}

.address-selection {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.address-option {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.2s ease;
}

.address-option:hover {
  border-color: #52c41a;
}

.address-option.selected {
  border-color: #52c41a;
  background-color: #f6ffed;
}

.address-info {
  flex: 1;
}

.address-info p {
  margin: 5px 0;
  font-size: 0.9rem;
}

.address-name {
  font-weight: 600;
  margin-bottom: 8px;
}

.default-badge {
  background-color: #e7f5ff;
  color: #0066cc;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 5px;
}

.address-select {
  padding-top: 5px;
}

.or-separator {
  position: relative;
  text-align: center;
  margin: 30px 0;
}

.or-separator::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #eee;
}

.or-separator span {
  position: relative;
  background-color: #fff;
  padding: 0 15px;
  color: #666;
  font-size: 0.9rem;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .checkout-container {
    flex-direction: column;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .order-summary {
    position: static;
    width: 100%;
  }
  
  .address-selection {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  h1 {
    font-size: 1.75rem;
  }
  
  .checkout-section, .order-summary {
    padding: 20px;
  }
  
  .checkout-steps {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .checkout-steps::before {
    display: none;
  }
  
  .form-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .back-button, .next-button, .checkout-button {
    width: 100%;
  }
}
</style>