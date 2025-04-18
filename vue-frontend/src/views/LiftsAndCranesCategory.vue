<template>
    <div class="category-page">
      <div class="category-header">
        <h1>Підйомники та Крани</h1>
        <p>Оренда підйомного обладнання для різних потреб</p>
      </div>
  
      <div class="category-subcategories">
        <div 
          v-for="subcategory in subcategories" 
          :key="subcategory.id" 
          class="subcategory-card"
        >
          <router-link :to="subcategory.route">
            <img :src="subcategory.image" :alt="subcategory.name" />
            <h3>{{ subcategory.name }}</h3>
          </router-link>
        </div>
      </div>
  
      <div class="category-products">
        <ProductCard 
          v-for="product in products" 
          :key="product.id"
          :productId="product.id"
          :title="product.title"
          :price="product.price"
          :imageSrc="product.image"
          :brand="product.brand"
          :isRentalItem="true"
          :rentalPrices="product.rentalPrices"
        />
      </div>
    </div>
  </template>
  
  <script>
  import ProductCard from '@/components/ProductCard.vue'
  
  export default {
    name: 'LiftsAndCranesCategory',
    components: {
      ProductCard
    },
    data() {
      return {
        subcategories: [
          {
            id: 1,
            name: 'Ножичні Підйомники',
            route: '/lifts-and-cranes/scissor-lifts',
            image: '/images/categories/scissor-lifts.png'
          },
          {
            id: 2,
            name: 'Самохідні Підйомники',
            route: '/lifts-and-cranes/boom-lifts',
            image: '/images/categories/boom-lifts.png'
          },
          {
            id: 3,
            name: 'Одномісні Підйомники',
            route: '/lifts-and-cranes/single-man-lifts',
            image: '/images/categories/single-man-lifts.png'
          },
          {
            id: 4,
            name: 'Крани',
            route: '/lifts-and-cranes/cranes',
            image: '/images/categories/cranes.png'
          }
        ],
        products: [
          {
            id: 1,
            title: '19\' Ножичний Підйомник',
            image: '/images/equipment/19-scissor-lift.png',
            brand: 'Generic',
            price: 1000,
            rentalPrices: {
              day: 150,
              week: 300,
              month: 600
            }
          },
          {
            id: 2,
            title: '26\' Ножичний Підйомник',
            image: '/images/equipment/26-scissor-lift.png',
            brand: 'Generic',
            price: 1200,
            rentalPrices: {
              day: 250,
              week: 475,
              month: 925
            }
          },
          {
            id: 3,
            title: '32\' Ножичний Підйомник',
            image: '/images/equipment/32-scissor-lift.png',
            brand: 'Generic',
            price: 1500,
            rentalPrices: {
              day: 300,
              week: 600,
              month: 1200
            }
          },
          {
            id: 4,
            title: 'Одномісний Підйомник 12\'',
            image: '/images/equipment/12-vertical-mast-lift.png',
            brand: 'Generic',
            price: 800,
            rentalPrices: {
              day: 100,
              week: 250,
              month: 750
            }
          },
          {
            id: 5,
            title: 'Кран 50 Тонн',
            image: '/images/equipment/50-ton-crane.png',
            brand: 'Generic',
            price: 5000,
            rentalPrices: {
              day: 1500,
              week: 4500,
              month: 13500
            }
          }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .category-page {
    max-width: 1280px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .category-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .category-header h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 10px;
  }
  
  .category-subcategories {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .subcategory-card {
    text-align: center;
    width: 200px;
  }
  
  .subcategory-card img {
    width: 100%;
    height: 200px;
    object-fit: contain;
    margin-bottom: 10px;
  }
  
  .category-products {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }
  </style>