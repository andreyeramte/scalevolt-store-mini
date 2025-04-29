<template>
    <div class="product-rental-container">
      <!-- Loading and Error States -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Завантаження...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchEquipment" class="retry-button">Спробувати знову</button>
      </div>
      
      <div v-else-if="!product" class="not-found-state">
        <p>Товар не знайдено</p>
        <router-link to="/catalogue" class="back-button">Повернутися до каталогу</router-link>
      </div>
      
      <!-- Product Detail Section -->
      <div v-else class="product-detail-wrapper">
        <!-- Product Images Section -->
        <div class="product-images-section">
          <!-- Main Product Image -->
          <div class="main-image-container">
            <img :src="currentImage" :alt="product.name" class="main-product-image" />
          </div>
          
          <!-- Thumbnail Gallery -->
          <div class="thumbnail-gallery">
            <div 
              v-for="(image, index) in product.images" 
              :key="index" 
              class="thumbnail-item"
              :class="{ active: currentImageIndex === index }"
              @click="setCurrentImage(index)"
            >
              <img :src="image" :alt="`${product.name} thumbnail ${index + 1}`" />
            </div>
          </div>
          
          <!-- Product Media Controls -->
          <div class="product-media-controls">
            <div class="media-control-item">
              <span>🔄</span>
              <span>Rotate 360° (Photo)</span>
            </div>
            <div class="media-control-item">
              <span>🎬</span>
              <span>Video</span>
            </div>
            <div class="media-control-item">
              <span>📤</span>
              <span>Share</span>
            </div>
          </div>
        </div>
        
        <!-- Product Info Section -->
        <div class="product-info-section">
          <h1 class="product-title">{{ product.name }}</h1>
          
          <!-- Product Status -->
          <div class="product-status">
            <div class="availability-indicator">
              <span class="availability-dot" :class="{ available: product.isAvailable }"></span>
              <span class="availability-text">{{ availabilityText }}</span>
            </div>
        
          </div>
          
          <!-- Delivery Info -->
          <div class="delivery-info">
            <div class="delivery-option">
              <span>🚚</span>
              <span>Доставка до {{ estimatedDeliveryDate }}</span>
            </div>
            <div class="stock-info" v-if="product.inStock">
              <span>✅</span>
              <span>В наявності</span>
            </div>
          </div>
          
          <!-- Price Section -->
          <div class="price-section">
            <div class="price-from">від</div>
            <div class="current-price">{{ formatPrice(product.price) }} ₴</div>
            <div class="price-period">за один день</div>
          </div>
          
          <!-- Rental Period Selection -->
          <div class="rental-period-section">
            <h3>Термін оренди:</h3>
            
            <div class="rental-periods">
              <div 
                v-for="period in rentalPeriods" 
                :key="period.value"
                class="rental-period-option"
                :class="{ active: selectedPeriod === period.value }"
                @click="selectPeriod(period.value)"
              >
                <div class="period-days">{{ period.days }}</div>
                <div class="period-label">{{ period.label }}</div>
              </div>
            </div>
            
            <!-- Calendar Section (toggle visibility) -->
            <div class="calendar-section" v-if="showCalendar">
              <div class="calendar-header">
                <button @click="prevMonth" class="calendar-nav-btn">&lt;</button>
                <div class="current-month">{{ currentMonthName }} {{ currentYear }}</div>
                <button @click="nextMonth" class="calendar-nav-btn">&gt;</button>
              </div>
              
              <div class="calendar-weekdays">
                <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
              </div>
              
              <div class="calendar-days">
                <div 
                  v-for="day in calendarDays" 
                  :key="day.date"
                  class="calendar-day"
                  :class="{ 
                    'empty': !day.inMonth, 
                    'today': day.isToday,
                    'selected': isSelectedDate(day.date),
                    'in-range': isInDateRange(day.date),
                    'disabled': day.disabled
                  }"
                  @click="selectDate(day)"
                >
                  {{ day.dayNumber }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Guarantee & Delivery -->
          <div class="guarantee-delivery-section">
            <h3>Гарантія та доставка:</h3>
            
            <div class="guarantee-options">
              <div class="guarantee-option">
                <input type="checkbox" id="guarantee-option1" v-model="hasInsurance" />
                <label for="guarantee-option1">Застрахувати товар на час доставки (безкоштовно)</label>
              </div>
              
              <div class="guarantee-option">
                <input type="checkbox" id="guarantee-option2" v-model="hasExtendedGuarantee" />
                <label for="guarantee-option2">Офіційна гарантія від виробника</label>
              </div>
              
              <div class="guarantee-option">
                <input type="checkbox" id="guarantee-option3" v-model="hasDeliveryInsurance" />
                <label for="guarantee-option3">Офіційний дилер із перевіреною репутацією 14 років</label>
              </div>
            </div>
          </div>
          
          <!-- Payment Methods -->
          <div class="payment-methods-section">
            <h3>Оплату можна здійснити:</h3>
            
            <div class="payment-options">
              <div v-for="(method, index) in paymentMethods" :key="index" class="payment-method">
                <!-- Replace with simple text placeholders -->
                <span>{{ method.name }}</span>
              </div>
            </div>
          </div>
          
          <!-- Specifications -->
          <div class="specifications-section">
            <h3>Основні характеристики:</h3>
            
            <div class="specifications-list">
              <div v-for="(spec, index) in product.specifications" :key="index" class="specification-item">
                <div class="spec-name">{{ spec.name }}</div>
                <div class="spec-value">{{ spec.value }}</div>
              </div>
            </div>
          </div>
          
          <!-- Quantity and Add to Cart -->
          <div class="add-to-cart-section">
            <div class="quantity-selector">
              <button @click="decrementQuantity" class="quantity-btn">-</button>
              <input type="number" v-model.number="quantity" min="1" class="quantity-input" />
              <button @click="incrementQuantity" class="quantity-btn">+</button>
            </div>
            
            <button @click="addToCart" class="add-to-cart-btn">
              <span>🛒</span>
              Додати в кошик
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>

  
  <script>
export default {
  name: 'ProductRentalPage',
  data() {
    return {
      product: null,
      isLoading: true,
      error: null,
      currentImageIndex: 0,
      selectedPeriod: 'day',
      showCalendar: false,
      quantity: 1,
      startDate: null,
      endDate: null,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      hasInsurance: true,
      hasExtendedGuarantee: false,
      hasDeliveryInsurance: false,
      // Use relative URL with no leading slash
      paymentMethods: [
        { name: 'Visa', icon: './assets/payment/visa.svg' },
        { name: 'Mastercard', icon: './assets/payment/mastercard.svg' },
        { name: 'Apple Pay', icon: './assets/payment/apple-pay.svg' },
        { name: 'Google Pay', icon: './assets/payment/google-pay.svg' },
        { name: 'PayPal', icon: './assets/payment/paypal.svg' },
        { name: 'Bitcoin', icon: './assets/payment/bitcoin.svg' },
      ],
      rentalPeriods: [
        { value: 'day', days: '1-5', label: 'днів' },
        { value: 'week', days: '5-14', label: 'днів' },
        { value: 'twoweeks', days: '2-4', label: 'тижні' },
        { value: 'month', days: '1-6', label: 'місяців' },
        { value: 'custom', days: '10-30', label: 'днів' }
      ],
      weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']
    };
  },
  computed: {
    currentImage() {
      return this.product && this.product.images ? this.product.images[this.currentImageIndex] : '';
    },
    availabilityText() {
      return this.product && this.product.isAvailable ? 'Доступний для оренди' : 'Недоступний';
    },
    estimatedDeliveryDate() {
      const today = new Date();
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + 3); // Estimated delivery in 3 days
      
      // Format date as DD.MM.YYYY
      const day = String(deliveryDate.getDate()).padStart(2, '0');
      const month = String(deliveryDate.getMonth() + 1).padStart(2, '0');
      const year = deliveryDate.getFullYear();
      
      return `${day}.${month}.${year}`;
    },
    currentMonthName() {
      const months = [
        'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 
        'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
      ];
      return months[this.currentMonth];
    },
    calendarDays() {
      const days = [];
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      
      // Get first day of month (0 = Sunday, 1 = Monday, etc)
      let firstDayOfWeek = firstDay.getDay() || 7; // Convert Sunday from 0 to 7
      firstDayOfWeek = firstDayOfWeek - 1; // Adjust to start week from Monday (0)
      
      // Add days from previous month
      const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(this.currentYear, this.currentMonth - 1, prevMonthLastDay - i);
        days.push({
          date: date,
          dayNumber: prevMonthLastDay - i,
          inMonth: false,
          isToday: this.isToday(date),
          disabled: date < new Date()
        });
      }
      
      // Add days from current month
      const today = new Date();
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(this.currentYear, this.currentMonth, i);
        days.push({
          date: date,
          dayNumber: i,
          inMonth: true,
          isToday: this.isToday(date),
          disabled: date < today
        });
      }
      
      // Add days from next month
      const totalCells = Math.ceil(days.length / 7) * 7;
      const nextMonthDays = totalCells - days.length;
      for (let i = 1; i <= nextMonthDays; i++) {
        const date = new Date(this.currentYear, this.currentMonth + 1, i);
        days.push({
          date: date,
          dayNumber: i,
          inMonth: false,
          isToday: this.isToday(date),
          disabled: false
        });
      }
      
      return days;
    }
  },
  created() {
    // Fetch product data when component is created
    this.fetchEquipment();
  },
  methods: {
    async fetchEquipment() {
      this.isLoading = true;
      this.error = null;
      
      try {
        // In production, replace this with an actual API call
        // For example:
        // const response = await fetch(`/api/products/${this.$route.params.id}`);
        // const data = await response.json();
        
        // For demo purposes, we'll use a timeout to simulate API loading
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - replace with actual API data
        this.product = {
          id: 'EU30IS',
          name: 'Оренда генератора бензинового (інверторного) HONDA EU 30 IS (2,7)',
          images: [
            // Using placeholder images since you mentioned the path error
            // You should use URLs that actually exist on your server
            './assets/generator-honda-1.jpg',
            './assets/generator-honda-2.jpg',
            './assets/generator-honda-3.jpg',
            './assets/generator-honda-4.jpg',
            './assets/generator-honda-5.jpg'
          ],
          price: 650,
          oldPrice: 700,
          isAvailable: true,
          inStock: true,
          rating: 4.8,
          specifications: [
            { name: 'Номінальна потужність, (Вт)', value: '3000' },
            { name: 'Тип палива', value: 'Бензин' },
            { name: 'Напруга при номінальній потужності, (В)', value: '230±1' },
            { name: 'Струм при номінальній потужності, (А)', value: '13.0' },
            { name: 'Напруга постійного струму, (В)', value: '12' },
            { name: 'Струм короткого замикання (А)', value: '8.3' },
            { name: 'Клас', value: 'Інверторний бензин' },
            { name: 'Вага, (кг)', value: '35.0' },
            { name: 'Об\'єм баку, (л)', value: '13.0' },
            { name: 'Напруга постійного струму, (В)', value: '12.0' },
          ]
        };
      } catch (error) {
        console.error('Error fetching equipment:', error);
        this.error = 'Failed to load product data. Please try again later.';
      } finally {
        this.isLoading = false;
      }
    },
    setCurrentImage(index) {
      this.currentImageIndex = index;
    },
    formatPrice(price) {
      return new Intl.NumberFormat('uk-UA').format(price);
    },
    selectPeriod(period) {
      this.selectedPeriod = period;
      this.showCalendar = period === 'custom';
    },
    incrementQuantity() {
      this.quantity++;
    },
    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    addToCart() {
      // Implement add to cart functionality
      // You might want to call your store's action here
      if (!this.product) return;
      
      const cartItem = {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        image: this.product.images[0],
        quantity: this.quantity,
        rentalPeriod: this.selectedPeriod,
        startDate: this.startDate,
        endDate: this.endDate
      };
      
      // If using Vuex, dispatch an action
      // this.$store.dispatch('addToCart', cartItem);
      
      // For now, just show an alert
      alert(`Added ${this.quantity} ${this.product.name} to cart for ${this.selectedPeriod} rental`);
    },
    isToday(date) {
      const today = new Date();
      return date.getDate() === today.getDate() && 
             date.getMonth() === today.getMonth() && 
             date.getFullYear() === today.getFullYear();
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    selectDate(day) {
      if (day.disabled) return;
      
      if (!this.startDate || (this.startDate && this.endDate)) {
        // Start new selection
        this.startDate = day.date;
        this.endDate = null;
      } else {
        // Complete selection
        if (day.date < this.startDate) {
          this.endDate = this.startDate;
          this.startDate = day.date;
        } else {
          this.endDate = day.date;
        }
      }
    },
    isSelectedDate(date) {
      if (!this.startDate) return false;
      
      const isSameAsStart = date.getDate() === this.startDate.getDate() && 
                          date.getMonth() === this.startDate.getMonth() && 
                          date.getFullYear() === this.startDate.getFullYear();
                          
      const isSameAsEnd = this.endDate && 
                         date.getDate() === this.endDate.getDate() && 
                         date.getMonth() === this.endDate.getMonth() && 
                         date.getFullYear() === this.endDate.getFullYear();
                         
      return isSameAsStart || isSameAsEnd;
    },
    isInDateRange(date) {
      if (!this.startDate || !this.endDate) return false;
      
      return date > this.startDate && date < this.endDate;
    }
  }
};
</script>
  
  <style scoped>
  .product-rental-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
  }
  
  .product-detail-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
  }
  
  /* Product Images Section */
  .product-images-section {
    flex: 1;
    min-width: 300px;
    max-width: 500px;
    padding: 20px;
    border-right: 1px solid #e0e0e0;
  }
  
  .main-image-container {
    width: 100%;
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    overflow: hidden;
  }
  
  .main-product-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  .thumbnail-gallery {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    overflow-x: auto;
  }
  
  .thumbnail-item {
    width: 80px;
    height: 80px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
  }
  
  .thumbnail-item.active {
    border-color: #007bff;
  }
  
  .thumbnail-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .product-media-controls {
    display: flex;
    justify-content: space-between;
    padding-top: 15px;
    border-top: 1px solid #e0e0e0;
  }
  
  .media-control-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #666;
    cursor: pointer;
  }
  
  .media-control-item img {
    width: 20px;
    height: 20px;
  }
  
  /* Product Info Section */
  .product-info-section {
    flex: 1;
    min-width: 300px;
    padding: 20px;
  }
  
  .product-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
  }
  
  .product-status {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
    font-size: 14px;
    color: #666;
  }
  
  .availability-indicator {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .availability-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ccc;
  }
  
  .availability-dot.available {
    background-color: #4caf50;
  }
  
  .product-rating {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .delivery-info {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #666;
  }
  
  .delivery-option, .stock-info {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .price-section {
    display: flex;
    align-items: baseline;
    margin-bottom: 20px;
  }
  
  .price-from {
    font-size: 16px;
    color: #666;
    margin-right: 5px;
  }
  
  .current-price {
    font-size: 32px;
    font-weight: bold;
    color: #333;
  }
  
  .price-period {
    margin-left: 8px;
    font-size: 14px;
    color: #666;
  }
  
  /* Rental Period Section */
  .rental-period-section {
    margin-bottom: 25px;
  }
  
  .rental-period-section h3 {
    font-size: 18px;
    margin-bottom: 15px;
    color: #333;
  }
  
  .rental-periods {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    overflow-x: auto;
  }
  
  .rental-period-option {
    min-width: 70px;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .rental-period-option.active {
    border-color: #007bff;
    background-color: #e6f3ff;
  }
  
  .period-days {
    font-weight: bold;
    font-size: 16px;
    color: #333;
  }
  
  .period-label {
    font-size: 12px;
    color: #666;
  }
  
  /* Calendar Section */
  .calendar-section {
    margin-top: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 15px;
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .calendar-nav-btn {
    width: 30px;
    height: 30px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: white;
    cursor: pointer;
  }
  
  .current-month {
    font-weight: bold;
  }
  
  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    margin-bottom: 5px;
  }
  
  .weekday {
    text-align: center;
    font-weight: bold;
    font-size: 12px;
    color: #666;
  }
  
  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }
  
  .calendar-day {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .calendar-day:not(.empty):not(.disabled):hover {
    background-color: #f0f0f0;
  }
  
  .calendar-day.empty {
    color: #ccc;
  }
  
  .calendar-day.today {
    font-weight: bold;
    color: #007bff;
  }
  
  .calendar-day.selected {
    background-color: #007bff;
    color: white;
  }
  
  .calendar-day.in-range {
    background-color: #e6f3ff;
  }
  
  .calendar-day.disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  
  /* Guarantee Section */
  .guarantee-delivery-section {
    margin-bottom: 25px;
  }
  
  .guarantee-delivery-section h3 {
    font-size: 18px;
    margin-bottom: 15px;
    color: #333;
  }
  
  .guarantee-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .guarantee-option {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #333;
  }
  
  /* Payment Methods Section */
  .payment-methods-section {
    margin-bottom: 25px;
  }
  
  .payment-methods-section h3 {
    font-size: 18px;
    margin-bottom: 15px;
    color: #333;
  }
  
  .payment-options {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .payment-method {
    width: 40px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .payment-method img {
    max-width: 100%;
    max-height: 100%;
  }
  
  /* Specifications Section */
  .specifications-section {
    margin-bottom: 25px;
  }
  
  .specifications-section h3 {
    font-size: 18px;
    margin-bottom: 15px;
    color: #333;
  }
  
  .specifications-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .specification-item {
    display: flex;
    justify-content: space-between;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
    font-size: 14px;
  }
  
  .spec-name {
    color: #666;
  }
  
  .spec-value {
    font-weight: bold;
    color: #333;
  }
  
  /* Add to Cart Section */
  .add-to-cart-section {
    display: flex;
    gap: 15px;
    margin-top: 30px;
  }
  
  .quantity-selector {
    display: flex;
    align-items: center;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .quantity-btn {
    width: 40px;
    height: 40px;
    background: white;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }
  
  .quantity-input {
    width: 50px;
    height: 40px;
    border: none;
    text-align: center;
    font-size: 16px;
  }
  
  .add-to-cart-btn {
    flex: 1;
    height: 42px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background-color 0.2s;
  }
  
  .add-to-cart-btn:hover {
    background-color: #0056b3;
  }
  
  .add-to-cart-btn img {
    width: 20px;
    height: 20px;
  }
  
  /* Responsive Styles */
  @media (max-width: 768px) {
    .product-detail-wrapper {
      flex-direction: column;
    }
    
    .product-images-section {
      max-width: 100%;
      border-right: none;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .add-to-cart-section {
      flex-direction: column;
    }
  }
  </style>