<template>
    <div class="category-promotion-box">
      <h3>{{ category.name }}</h3>
      <div class="promotion-content">
        <button class="nav-button" @click="prevPromotion">◀</button>
        <div class="promotion-item" v-if="currentPromotion">
          <img :src="getImageUrl(currentPromotion)" :alt="currentPromotion.attributes.title" />
          <p>{{ currentPromotion.attributes.title }}</p>
        </div>
        <button class="nav-button" @click="nextPromotion">▶</button>
      </div>
    </div>
  </template>
  
  <script>
  import productService from '@/services/productService';
  
  export default {
    props: {
      category: Object,
    },
    data() {
      return {
        promotions: [],
        currentIndex: 0,
      };
    },
    computed: {
      currentPromotion() {
        return this.promotions[this.currentIndex];
      },
    },
    methods: {
      nextPromotion() {
        this.currentIndex = (this.currentIndex + 1) % this.promotions.length;
      },
      prevPromotion() {
        this.currentIndex =
          (this.currentIndex - 1 + this.promotions.length) % this.promotions.length;
      },
      async fetchPromotions() {
        try {
          const response = await productService.getPromotionsByCategory(
            this.category.id
          );
          this.promotions = response.data.data;
        } catch (error) {
          console.error('Error fetching promotions:', error);
        }
      },
      getImageUrl(promotion) {
        const imageData = promotion.attributes.image.data;
        if (!imageData || !imageData.attributes || !imageData.attributes.url) return '';
        return `http://localhost:1337${imageData.attributes.url}`;
      },
    },
    created() {
      this.fetchPromotions();
    },
  };
  </script>
  
  <style scoped>
.category-promotion-box {
  position: relative;
  padding: 10px;
  text-align: center;
  background-color: #e0f7fa; /* Light blue background */
  border: 1px solid #b2ebf2; /* Light blue border */
  transition: transform 0.3s, box-shadow 0.3s; /* Smooth hover effect */
  }

  .category-promotion-box:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 10px rgba(255, 0, 0, 0.2); /* Red shadow on hover */
}
  .promotion-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .nav-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
  .promotion-item {
    flex: 1;
    margin: 0 10px;
  }
  .promotion-item img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
  .promotion-item p {
    margin-top: 10px;
    font-size: 16px;
    color: #333; 
  }

  .category-promotion-box::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  transition: background-color 0.3s;
}

.category-promotion-box:hover::after {
  background-color: rgba(255, 0, 0, 0.1); /* Red overlay */
}

  </style>
  