<template>
    <div class="translation-manager">
      <h1>Product Translation Management</h1>
      
      <div class="filters">
        <input 
          v-model="searchQuery" 
          placeholder="Search products..." 
          @input="searchProducts"
          class="search-input"
        />
      </div>
      
      <div v-if="loading" class="loading">Loading products...</div>
      
      <div v-else-if="products.length === 0" class="no-products">
        No products found. Please add some products first.
      </div>
      
      <div v-else class="products-list">
        <div v-for="product in products" :key="product.id" class="product-card">
          <h2>{{ product.name }}</h2>
          <p v-if="product.description" class="description">{{ product.description }}</p>
          <p class="price">${{ product.price }}</p>
          
          <div class="translations">
            <!-- Ukrainian Translations -->
            <div class="translation-section">
              <h3>Ukrainian Translation</h3>
              <div class="form-group">
                <label for="name_uk">Name (Ukrainian)</label>
                <input 
                  id="name_uk" 
                  v-model="product.name_uk" 
                  type="text" 
                  placeholder="Ukrainian product name"
                />
              </div>
              
              <div class="form-group">
                <label for="description_uk">Description (Ukrainian)</label>
                <textarea 
                  id="description_uk" 
                  v-model="product.description_uk" 
                  placeholder="Ukrainian product description"
                  rows="3"
                ></textarea>
              </div>
            </div>
            
            <!-- Polish Translations -->
            <div class="translation-section">
              <h3>Polish Translation</h3>
              <div class="form-group">
                <label for="name_pl">Name (Polish)</label>
                <input 
                  id="name_pl" 
                  v-model="product.name_pl" 
                  type="text" 
                  placeholder="Polish product name"
                />
              </div>
              
              <div class="form-group">
                <label for="description_pl">Description (Polish)</label>
                <textarea 
                  id="description_pl" 
                  v-model="product.description_pl" 
                  placeholder="Polish product description"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
          
          <div class="actions">
            <button @click="saveTranslations(product)" class="save-button">
              Save Translations
            </button>
            <button @click="autoTranslate(product)" class="translate-button">
              Auto Translate
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'TranslationManager',
    data() {
      return {
        products: [],
        loading: true,
        searchQuery: '',
        savingProducts: {}
      };
    },
    async created() {
      await this.fetchProducts();
    },
    methods: {
      async fetchProducts() {
        this.loading = true;
        try {
          const response = await axios.get('/api/products');
          this.products = response.data;
        } catch (error) {
          console.error('Error fetching products:', error);
          alert('Failed to load products');
        } finally {
          this.loading = false;
        }
      },
      
      async searchProducts() {
        if (!this.searchQuery.trim()) {
          await this.fetchProducts();
          return;
        }
        
        this.loading = true;
        try {
          const response = await axios.get(`/api/products/search?q=${this.searchQuery}`);
          this.products = response.data;
        } catch (error) {
          console.error('Error searching products:', error);
        } finally {
          this.loading = false;
        }
      },
      
      async saveTranslations(product) {
        this.savingProducts[product.id] = true;
        
        try {
          await axios.patch(`/api/products/${product.id}/translations`, {
            name_uk: product.name_uk,
            name_pl: product.name_pl,
            description_uk: product.description_uk,
            description_pl: product.description_pl
          });
          
          alert(`Translations for "${product.name}" saved successfully!`);
        } catch (error) {
          console.error('Error saving translations:', error);
          alert('Failed to save translations');
        } finally {
          this.savingProducts[product.id] = false;
        }
      },
      async autoTranslate(product) {
        this.savingProducts[product.id] = true;
        
        try {
          const response = await axios.post(`/api/products/${product.id}/auto-translate`, {
            targetLanguages: ['uk', 'pl'],
            sourceLanguage: 'en'
          });
          
          // Update the product in the UI with translated fields
          const translatedProduct = response.data;
          Object.assign(product, {
            name_uk: translatedProduct.name_uk,
            name_pl: translatedProduct.name_pl,
            description_uk: translatedProduct.description_uk,
            description_pl: translatedProduct.description_pl
          });
          
          alert(`Auto-translated "${product.name}" successfully!`);
        } catch (error) {
          console.error('Error auto-translating:', error);
          alert('Failed to auto-translate');
        } finally {
          this.savingProducts[product.id] = false;
        }
      },
    }
  };
  </script>
  
  <style scoped>
  .translation-manager {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .filters {
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .loading, .no-products {
    text-align: center;
    padding: 40px;
    color: #666;
  }
  
  .products-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 20px;
  }
  
  .product-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .description {
    color: #666;
    margin-bottom: 10px;
  }
  
  .price {
    font-weight: bold;
    color: #4caf50;
    margin-bottom: 20px;
  }
  
  .translations {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .translation-section {
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 4px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input, textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .actions {
    text-align: right;
  }
  
  .save-button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .save-button:hover {
    background-color: #45a049;
  }
  
  .translate-button {
    background-color: #2196F3;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
  }
  
  .translate-button:hover {
    background-color: #0b7dda;
  }

  @media (max-width: 768px) {
    .products-list {
      grid-template-columns: 1fr;
    }
    
    .translations {
      grid-template-columns: 1fr;
    }
  }
  </style>