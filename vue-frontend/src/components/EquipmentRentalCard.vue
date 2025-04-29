<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-3xl font-bold text-gray-800">Оренда Обладнання</h1>
      <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
        <div class="relative flex-grow md:flex-grow-0">
          <input
            type="text"
            placeholder="Пошук обладнання..."
            class="w-full md:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            v-model="searchQuery"
            @input="applyFilters"
          />
          <span class="absolute left-3 top-2.5 h-5 w-5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        
        <div class="relative flex-grow md:flex-grow-0">
          <select
            class="w-full md:w-auto appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            v-model="sortOption"
            @change="applyFilters"
          >
            <option value="name-asc">Назва (А-Я)</option>
            <option value="name-desc">Назва (Я-А)</option>
            <option value="price-asc">Ціна (від найнижчої)</option>
            <option value="price-desc">Ціна (від найвищої)</option>
          </select>
          <span class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="mb-8 border-b pb-4 flex overflow-x-auto">
      <div class="flex items-center px-3 mr-2">
        <span class="mr-2 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </span>
        <span class="whitespace-nowrap font-medium text-gray-600">Фільтр:</span>
      </div>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="category in categories" 
          :key="category"
          class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all"
          :class="selectedCategory === category 
            ? 'bg-blue-500 text-white shadow-md' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          @click="selectCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredEquipment.length === 0" class="text-center py-16 bg-gray-50 rounded-lg">
      <div class="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6 text-gray-400">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-800">Нічого не знайдено</h3>
      <p class="text-gray-500 mt-2">Спробуйте змінити параметри пошуку</p>
      <button 
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        @click="clearFilters"
      >
        Очистити фільтри
      </button>
    </div>

    <!-- Equipment Grid -->
    <div v-else>
      <p class="text-gray-600 mb-6">Показано {{ filteredEquipment.length }} з {{ equipment.length }} позицій</p>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="item in filteredEquipment" 
          :key="item.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
          @mouseenter="setHoveredItem(item.id)"
          @mouseleave="hoveredItemId = null"
        >
          <div class="relative">
            <img 
              :src="item.image || '/images/placeholder-equipment.jpg'" 
              :alt="item.name" 
              class="w-full h-48 object-cover transition-transform duration-500"
              :style="{ transform: hoveredItemId === item.id ? 'scale(1.05)' : 'scale(1)' }"
            />
            <div class="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs font-medium rounded-bl-lg">
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-3 h-3 mr-1">
                  <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                Доступно
              </span>
            </div>
          </div>
          
          <div class="p-4 flex-grow">
            <div class="mb-2">
              <span class="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">
                {{ item.category }}
              </span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 leading-tight mb-2">{{ item.name }}</h3>

            <div class="mb-4 text-sm text-gray-600">
              <div v-for="(spec, index) in item.specifications" :key="index" class="flex items-start mb-1">
                <span class="text-blue-500 mr-2">•</span>
                <span>{{ spec }}</span>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-100 px-4 py-3 bg-gray-50">
            <div class="mb-3">
              <div class="text-sm text-gray-500 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-3.5 h-3.5 mr-1">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Період оренди:
              </div>
              <div class="flex space-x-2">
                <button
                  v-for="duration in Object.keys(item.pricing)"
                  :key="duration"
                  class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                  :class="selectedDurations[item.id] === duration 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'"
                  @click="selectDuration(item.id, duration)"
                >
                  {{ getDurationLabel(duration) }}
                </button>
              </div>
            </div>

            <div class="flex items-center mb-4">
              <div class="text-sm text-gray-500 mr-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-3.5 h-3.5 mr-1">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Кількість:
              </div>
              <div class="flex items-center border rounded-md">
                <button 
                  class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-l-md"
                  @click="decrementQuantity(item.id)"
                >
                  -
                </button>
                <span class="w-8 text-center">{{ quantities[item.id] || 1 }}</span>
                <button 
                  class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-r-md"
                  @click="incrementQuantity(item.id)"
                >
                  +
                </button>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <div>
                <div class="text-sm text-gray-600">
                  {{ formatPrice(item.pricing[selectedDurations[item.id] || 'day']) }}
                  <span class="text-gray-500">/{{ getDurationFormatted(selectedDurations[item.id] || 'day') }}</span>
                </div>
                <p class="text-lg font-bold text-gray-800">
                  {{ formatPrice(calculateTotalPrice(item)) }}
                </p>
              </div>
              <div class="flex space-x-2">
                <button 
                  class="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-blue-600 transition-colors"
                  @click="reserveItem(item)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span class="whitespace-nowrap">Орендувати</span>
                </button>
                <button
                  class="border border-blue-500 text-blue-500 px-3 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-blue-50 transition-colors"
                  @click="showDetails(item)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="whitespace-nowrap">Деталі</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EquipmentRental',
  data() {
    return {
      equipment: [],
      filteredEquipment: [],
      selectedCategory: 'All',
      isLoading: true,
      searchQuery: '',
      sortOption: 'name-asc',
      hoveredItemId: null,
      selectedDurations: {},
      quantities: {},
      categories: ['All']
    };
  },
  async created() {
    await this.fetchEquipment();
    
    // Initialize the selected durations and quantities
    this.equipment.forEach(item => {
      this.$set(this.selectedDurations, item.id, 'day');
      this.$set(this.quantities, item.id, 1);
    });
  },
  methods: {
    async fetchEquipment() {
      this.isLoading = true;
      try {
        // This would be replaced with an actual API call
        // For demo, we're using the sample data
        this.equipment = [
          {
            id: 1,
            name: 'Генератор 10 кВт',
            category: 'Генератори',
            image: '/images/Categories/equipment/generator-10kw.jpg',
            pricing: {
              day: 150,
              week: 900,
              month: 2700
            },
            specifications: [
              'Потужність: 10 кВт',
              'Паливо: Дизель',
              'Рівень шуму: 65 dB'
            ]
          },
          {
            id: 2,
            name: 'Генератор 20 кВт',
            category: 'Генератори',
            image: '/images/Categories/equipment/generator-20kw.jpg',
            pricing: {
              day: 250,
              week: 1500,
              month: 4500
            },
            specifications: [
              'Потужність: 20 кВт',
              'Паливо: Дизель',
              'Рівень шуму: 68 dB'
            ]
          },
          {
            id: 3,
            name: 'Ножичний підйомник 8м',
            category: 'Підйомники',
            image: '/images/Categories/equipment/scissor-lift-8m.jpg',
            pricing: {
              day: 180,
              week: 1080,
              month: 3240
            },
            specifications: [
              'Висота підйому: 8 метрів',
              'Вантажопідйомність: 450 кг',
              'Електричний привід'
            ]
          },
          {
            id: 4,
            name: 'Компресор повітряний',
            category: 'Компресори',
            image: '/images/Categories/equipment/air-compressor.jpg',
            pricing: {
              day: 120,
              week: 720,
              month: 2160
            },
            specifications: [
              'Продуктивність: 400 л/хв',
              'Тиск: 8 бар',
              'Мобільний'
            ]
          },
          {
            id: 5,
            name: 'Мінінавантажувач Bobcat',
            category: 'Спецтехніка',
            image: '/images/Categories/equipment/bobcat.jpg',
            pricing: {
              day: 350,
              week: 2100,
              month: 6300
            },
            specifications: [
              'Вантажопідйомність: 950 кг',
              'Кабіна закрита',
              'Дизельний двигун'
            ]
          },
          {
            id: 6,
            name: 'Відбійний молоток',
            category: 'Інструменти',
            image: '/images/Categories/equipment/jackhammer.jpg',
            pricing: {
              day: 80,
              week: 480,
              month: 1440
            },
            specifications: [
              'Потужність: 1600 Вт',
              'Енергія удару: 40 Дж',
              'Вага: 15 кг'
            ]
          }
        ];
        
        // Extract unique categories
        this.categories = ['All', ...new Set(this.equipment.map(item => item.category))];
        
        // Apply initial filtering
        this.applyFilters();
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    applyFilters() {
      let result = [...this.equipment];

      // Category filter
      if (this.selectedCategory !== 'All') {
        result = result.filter(item => item.category === this.selectedCategory);
      }

      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(
          item => item.name.toLowerCase().includes(query) || 
                item.category.toLowerCase().includes(query) ||
                item.specifications.some(spec => spec.toLowerCase().includes(query))
        );
      }

      // Sorting
      switch (this.sortOption) {
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'price-asc':
          result.sort((a, b) => a.pricing.day - b.pricing.day);
          break;
        case 'price-desc':
          result.sort((a, b) => b.pricing.day - a.pricing.day);
          break;
        default:
          break;
      }

      this.filteredEquipment = result;
    },
    
    selectCategory(category) {
      this.selectedCategory = category;
      this.applyFilters();
    },
    
    clearFilters() {
      this.selectedCategory = 'All';
      this.searchQuery = '';
      this.applyFilters();
    },
    
    setHoveredItem(id) {
      this.hoveredItemId = id;
    },
    
    selectDuration(itemId, duration) {
      this.$set(this.selectedDurations, itemId, duration);
    },
    
    incrementQuantity(itemId) {
      const currentQuantity = this.quantities[itemId] || 1;
      this.$set(this.quantities, itemId, currentQuantity + 1);
    },
    
    decrementQuantity(itemId) {
      const currentQuantity = this.quantities[itemId] || 1;
      if (currentQuantity > 1) {
        this.$set(this.quantities, itemId, currentQuantity - 1);
      }
    },
    
    calculateTotalPrice(item) {
      const duration = this.selectedDurations[item.id] || 'day';
      const quantity = this.quantities[item.id] || 1;
      return item.pricing[duration] * quantity;
    },
    
    formatPrice(price) {
      try {
        // Use Ukrainian Hryvnia (UAH) as the currency format
        return new Intl.NumberFormat('uk-UA', { 
          style: 'currency', 
          currency: 'UAH',
          minimumFractionDigits: 0
        }).format(price);
      } catch (e) {
        // Fallback formatting if Intl is not supported
        return price + ' ₴';
      }
    },
    
    getDurationLabel(duration) {
      switch(duration) {
        case 'day': return 'День';
        case 'week': return 'Тиждень';
        case 'month': return 'Місяць';
        default: return duration;
      }
    },
    
    getDurationFormatted(duration) {
      switch(duration) {
        case 'day': return 'день';
        case 'week': return 'тиждень';
        case 'month': return 'місяць';
        default: return duration;
      }
    },
    
    reserveItem(item) {
      const duration = this.selectedDurations[item.id] || 'day';
      const quantity = this.quantities[item.id] || 1;
      
      // Implement your reservation logic here
      alert(`Орендовано ${quantity} ${item.name} на ${this.getDurationFormatted(duration)}`);
    },
    
    showDetails(item) {
      // Implement your details view logic here
      alert(`Детальна інформація про ${item.name}`);
    }
  }
};
</script>


<style scoped>
/* Base container styles */
.container {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
}

/* Typography */
h1 {
  font-weight: 700;
  font-size: 1.875rem;
  line-height: 2.25rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

h3 {
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

p {
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

/* Filter section */
.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.filter-tag {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-weight: 500;
}

.filter-tag.active {
  background-color: #3b82f6;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06);
}

.filter-tag:not(.active) {
  background-color: #f3f4f6;
  color: #4b5563;
}

.filter-tag:not(.active):hover {
  background-color: #e5e7eb;
}

/* Search and sort controls */
.controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .controls {
    flex-direction: row;
    align-items: center;
    width: auto;
  }
}

.search-input {
  position: relative;
  flex-grow: 1;
}

.search-input input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #1f2937;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.search-input input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input svg {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.sort-select {
  position: relative;
}

.sort-select select {
  appearance: none;
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #1f2937;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.sort-select select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.sort-select svg {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
  pointer-events: none;
}

/* Equipment cards */
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .equipment-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .equipment-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1536px) {
  .equipment-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.equipment-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.equipment-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-image-container {
  position: relative;
  height: 12rem;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.equipment-card:hover .card-image {
  transform: scale(1.05);
}

.availability-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #3b82f6;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-bottom-left-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-content {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.category-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  margin-bottom: 0.5rem;
}

.specification-list {
  margin-top: 0.75rem;
  margin-bottom: 1rem;
}

.specification-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.spec-bullet {
  color: #3b82f6;
  margin-right: 0.5rem;
}

.card-footer {
  border-top: 1px solid #f3f4f6;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
}

.rental-duration {
  margin-bottom: 0.75rem;
}

.duration-label {
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.duration-buttons {
  display: flex;
  gap: 0.5rem;
}

.duration-button {
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.duration-button.active {
  background-color: #3b82f6;
  color: white;
}

.duration-button:not(.active) {
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #4b5563;
}

.duration-button:not(.active):hover {
  border-color: #93c5fd;
}

.quantity-selector {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.quantity-label {
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-right: 0.75rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
}

.quantity-button {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  background-color: transparent;
  transition: background-color 0.2s ease;
}

.quantity-button:hover {
  background-color: #f3f4f6;
}

.quantity-button:first-child {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.quantity-button:last-child {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.quantity-value {
  width: 2rem;
  text-align: center;
}

.price-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-container {
  display: flex;
  flex-direction: column;
}

.unit-price {
  font-size: 0.875rem;
  color: #6b7280;
}

.total-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.rent-button {
  background-color: #3b82f6;
  color: white;
}

.rent-button:hover {
  background-color: #2563eb;
}

.details-button {
  border: 1px solid #3b82f6;
  color: #3b82f6;
}

.details-button:hover {
  background-color: #ebf5ff;
}

/* Loading state */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 16rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
}

.empty-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  color: #9ca3af;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.empty-description {
  color: #6b7280;
  margin-bottom: 1rem;
}

.clear-filters-button {
  display: inline-block;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
}

.clear-filters-button:hover {
  background-color: #2563eb;
}

/* Hide scrollbar for clean UI */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .card-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
  
  .price-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .price-container {
    text-align: center;
  }
}
</style>