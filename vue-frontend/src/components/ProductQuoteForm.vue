<template>
    <div class="quote-form-container" :class="{ 'solar-form': isSolar, 'charger-form': isCharger }">
      <h3 class="form-title">{{ isSolar ? 'Отримати безкоштовний розрахунок' : 'Стати хостом зарядної станції' }}</h3>
      
      <form @submit.prevent="submitForm" class="quote-form">
        <!-- Спільні поля для обох типів форм -->
        <div class="form-section contact-info">
          <h4>Ваші контакти</h4>
          <div class="form-row">
            <div class="form-group">
              <label for="name">Ім'я</label>
              <input 
                type="text" 
                id="name" 
                v-model="formData.name" 
                required
                placeholder="Введіть ваше ім'я"
              >
            </div>
            <div class="form-group">
              <label for="phone">Телефон</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="formData.phone" 
                required
                placeholder="+380"
              >
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              required
              placeholder="your@email.com"
            >
          </div>
        </div>
        
        <!-- Поля специфічні для сонячних панелей -->
        <div v-if="isSolar" class="form-section solar-specific">
          <h4>Дані для розрахунку</h4>
          <div class="form-group">
            <label for="address">Адреса встановлення</label>
            <input 
              type="text" 
              id="address" 
              v-model="formData.address" 
              required
              placeholder="Вкажіть адресу об'єкта"
            >
          </div>
          <div class="form-group">
            <label for="consumption">Середньомісячне споживання (кВт)</label>
            <input 
              type="number" 
              id="consumption" 
              v-model="formData.consumption" 
              required
              placeholder="Наприклад: 300"
            >
          </div>
        </div>
        
        <!-- Поля специфічні для зарядних станцій -->
        <div v-if="isCharger" class="form-section charger-specific">
          <div class="form-group">
            <label for="applicantType">Тип заявника</label>
            <select id="applicantType" v-model="formData.applicantType" required>
              <option value="" disabled selected>Виберіть тип заявника</option>
              <option value="business">Бізнес</option>
              <option value="individual">Приватна особа</option>
              <option value="government">Державна установа</option>
            </select>
          </div>
          <div class="form-group">
            <label for="reason">Чому ви зацікавлені стати хостом зарядної станції Tesla?</label>
            <textarea 
              id="reason" 
              v-model="formData.reason" 
              rows="3" 
              required
              placeholder="Опишіть ваші мотиви та очікування"
            ></textarea>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="submit-button" :disabled="isSubmitting">
            <span v-if="isSubmitting">Відправляємо...</span>
            <span v-else>Отримати розрахунок</span>
          </button>
        </div>
        
        <div v-if="formMessage" class="form-message" :class="{ 'success': formSuccess, 'error': !formSuccess }">
          {{ formMessage }}
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import axios from 'axios';
  
  export default {
    name: 'ProductQuoteForm',
    props: {
      productType: {
        type: String,
        required: true,
        validator: (value) => ['solar', 'charger'].includes(value)
      },
      productId: {
        type: [String, Number],
        required: true
      },
      productName: {
        type: String,
        required: true
      }
    },
    
    setup(props) {
      // Реактивні змінні
      const formData = ref({
        name: '',
        phone: '',
        email: '',
        address: '',
        consumption: '',
        applicantType: '',
        reason: '',
        productId: props.productId,
        productName: props.productName,
        source: 'web_store', // Ідентифікатор для розрізнення джерела запиту
        timestamp: new Date().toISOString()
      });
      
      const isSubmitting = ref(false);
      const formMessage = ref('');
      const formSuccess = ref(false);
      
      // Обчислювані властивості
      const isSolar = computed(() => props.productType === 'solar');
      const isCharger = computed(() => props.productType === 'charger');
      
      // Методи
      const submitForm = async () => {
        isSubmitting.value = true;
        formMessage.value = '';
        
        try {
          // Використовуйте вашу API адресу для відправки даних
          const response = await axios.post('/api/quote-requests', formData.value);
          
          if (response.status === 200 || response.status === 201) {
            formSuccess.value = true;
            formMessage.value = 'Дякуємо! Ваш запит успішно надіслано. Наші менеджери зв\'яжуться з вами найближчим часом.';
            
            // Очищення форми після успішної відправки
            formData.value = {
              name: '',
              phone: '',
              email: '',
              address: '',
              consumption: '',
              applicantType: '',
              reason: '',
              productId: props.productId,
              productName: props.productName,
              source: 'web_store',
              timestamp: new Date().toISOString()
            };
          } else {
            throw new Error('Не вдалося відправити запит');
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          formSuccess.value = false;
          formMessage.value = 'Виникла помилка при відправці запиту. Будь ласка, спробуйте пізніше або зв\'яжіться з нами за телефоном.';
        } finally {
          isSubmitting.value = false;
        }
      };
      
      return {
        formData,
        isSubmitting,
        formMessage,
        formSuccess,
        isSolar,
        isCharger,
        submitForm
      };
    }
  };
  </script>
  
  <style scoped>
  .quote-form-container {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .form-title {
    font-size: 1.2rem;
    margin-top: 0;
    margin-bottom: 20px;
    color: #333;
    font-weight: 600;
  }
  
  .form-section {
    margin-bottom: 20px;
  }
  
  .form-section h4 {
    font-size: 1rem;
    margin-bottom: 15px;
    color: #555;
    font-weight: 500;
  }
  
  .form-row {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
  }
  
  .form-group {
    margin-bottom: 15px;
    flex: 1;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 0.9rem;
    color: #666;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  }
  
  .form-actions {
    margin-top: 20px;
  }
  
  .submit-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 12px 24px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%;
  }
  
  .submit-button:hover {
    background-color: #45a049;
  }
  
  .submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .form-message {
    margin-top: 15px;
    padding: 10px;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  
  .form-message.success {
    background-color: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #c8e6c9;
  }
  
  .form-message.error {
    background-color: #ffebee;
    color: #c62828;
    border: 1px solid #ffcdd2;
  }
  
  @media (max-width: 768px) {
    .form-row {
      flex-direction: column;
      gap: 0;
    }
  }
  </style>