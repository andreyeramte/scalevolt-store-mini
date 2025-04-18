<template>
    <div class="faq-container">
      <h1 class="faq-title">{{ $t('faq.pageTitle') }}</h1>
      
      <div class="faq-intro">
        <p>{{ $t('faq.introText') }}</p>
      </div>
  
      <div class="faq-categories">
        <!-- General Questions -->
        <div class="faq-category">
          <h2 class="category-title">{{ $t('faq.categories.general.title') }}</h2>
          
          <div v-for="(question, index) in generalQuestions" :key="'general-' + index" class="faq-item">
            <div class="faq-question" @click="toggleQuestion('general', index)">
              <h3>{{ $t(question.questionKey) }}</h3>
              <span class="toggle-icon">{{ isOpen('general', index) ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" v-show="isOpen('general', index)" v-html="$t(question.answerKey)"></div>
          </div>
        </div>
  
        <!-- Products -->
        <div class="faq-category">
          <h2 class="category-title">{{ $t('faq.categories.products.title') }}</h2>
          
          <div v-for="(question, index) in productQuestions" :key="'product-' + index" class="faq-item">
            <div class="faq-question" @click="toggleQuestion('product', index)">
              <h3>{{ $t(question.questionKey) }}</h3>
              <span class="toggle-icon">{{ isOpen('product', index) ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" v-show="isOpen('product', index)" v-html="$t(question.answerKey)"></div>
          </div>
        </div>
  
        <!-- Orders & Shipping -->
        <div class="faq-category">
          <h2 class="category-title">{{ $t('faq.categories.orders.title') }}</h2>
          
          <div v-for="(question, index) in orderQuestions" :key="'order-' + index" class="faq-item">
            <div class="faq-question" @click="toggleQuestion('order', index)">
              <h3>{{ $t(question.questionKey) }}</h3>
              <span class="toggle-icon">{{ isOpen('order', index) ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" v-show="isOpen('order', index)" v-html="$t(question.answerKey)"></div>
          </div>
        </div>
  
        <!-- Support -->
        <div class="faq-category">
          <h2 class="category-title">{{ $t('faq.categories.support.title') }}</h2>
          
          <div v-for="(question, index) in supportQuestions" :key="'support-' + index" class="faq-item">
            <div class="faq-question" @click="toggleQuestion('support', index)">
              <h3>{{ $t(question.questionKey) }}</h3>
              <span class="toggle-icon">{{ isOpen('support', index) ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" v-show="isOpen('support', index)" v-html="$t(question.answerKey)"></div>
          </div>
        </div>
      </div>
  
      <!-- Contact section -->
      <div class="faq-contact">
        <h2>{{ $t('faq.stillHaveQuestions') }}</h2>
        <p>{{ $t('faq.contactUs') }}</p>
        <div class="contact-options">
          <a :href="'mailto:' + contactEmail" class="contact-button">
            <i class="email-icon"></i> {{ $t('faq.contactEmail') }}
          </a>
          <a :href="'tel:' + contactPhone" class="contact-button">
            <i class="phone-icon"></i> {{ $t('faq.contactPhone') }}
          </a>
  
          <!-- Telegram for Ukrainian locale only -->
          <a v-if="currentLocale === 'uk'" 
             href="https://t.me/ScaleVoltUkraineBot" 
             target="_blank" 
             class="contact-button telegram-button">
            <i class="telegram-icon"></i> {{ $t('faq.contactTelegram') }}
          </a>
            
          <!-- WhatsApp for Polish locale only -->
          <a v-if="currentLocale === 'pl'" 
             href="https://wa.me/48780176595" 
             target="_blank" 
             class="contact-button whatsapp-button">
            <i class="whatsapp-icon"></i> {{ $t('faq.contactWhatsApp') }}
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  
  export default {
    name: 'FAQPage',
    setup() {
      const { locale, t } = useI18n();
      const currentLocale = computed(() => locale.value);
      
      // Debug log to check the locale
      console.log('FAQPage initializing with locale:', locale.value);
      
      // State for tracking open/closed questions
      const openQuestions = ref({
        general: [],
        product: [],
        order: [],
        support: []
      });
      
      // Contact information based on locale
      const contactEmail = computed(() => {
        return currentLocale.value === 'pl' 
          ? 'scalevolt.info@gmail.com' 
          : 'scalevolt.info@gmail.com';
      });
  
      const contactPhone = computed(() => {
        return currentLocale.value === 'pl' 
          ? '+48 780 176 595' 
          : '+380 96 747 79 13';
      });
  
      // Question definitions (using translation keys)
      const generalQuestions = [
        {
          questionKey: 'faq.categories.general.questions.aboutUs.question',
          answerKey: 'faq.categories.general.questions.aboutUs.answer'
        },
        {
          questionKey: 'faq.categories.general.questions.countries.question',
          answerKey: 'faq.categories.general.questions.countries.answer'
        },
        {
          questionKey: 'faq.categories.general.questions.benefits.question',
          answerKey: 'faq.categories.general.questions.benefits.answer'
        }
      ];
  
      const productQuestions = [
        {
          questionKey: 'faq.categories.products.questions.solarPanels.question',
          answerKey: 'faq.categories.products.questions.solarPanels.answer'
        },
        {
          questionKey: 'faq.categories.products.questions.batteries.question',
          answerKey: 'faq.categories.products.questions.batteries.answer'
        },
        {
          questionKey: 'faq.categories.products.questions.warranty.question',
          answerKey: 'faq.categories.products.questions.warranty.answer'
        },
        {
          questionKey: 'faq.categories.products.questions.rentals.question',
          answerKey: 'faq.categories.products.questions.rentals.answer'
        }
      ];
  
      const orderQuestions = [
        {
          questionKey: 'faq.categories.orders.questions.shipping.question',
          answerKey: 'faq.categories.orders.questions.shipping.answer'
        },
        {
          questionKey: 'faq.categories.orders.questions.delivery.question',
          answerKey: 'faq.categories.orders.questions.delivery.answer'
        },
        {
          questionKey: 'faq.categories.orders.questions.returns.question',
          answerKey: 'faq.categories.orders.questions.returns.answer'
        },
        {
          questionKey: 'faq.categories.orders.questions.payment.question',
          answerKey: 'faq.categories.orders.questions.payment.answer'
        }
      ];
  
      const supportQuestions = [
        {
          questionKey: 'faq.categories.support.questions.installation.question',
          answerKey: 'faq.categories.support.questions.installation.answer'
        },
        {
          questionKey: 'faq.categories.support.questions.maintenance.question',
          answerKey: 'faq.categories.support.questions.maintenance.answer'
        },
        {
          questionKey: 'faq.categories.support.questions.technicalIssues.question',
          answerKey: 'faq.categories.support.questions.technicalIssues.answer'
        }
      ];
  
      // Functions for managing question state
      const toggleQuestion = (category, index) => {
        if (openQuestions.value[category].includes(index)) {
          openQuestions.value[category] = openQuestions.value[category].filter(i => i !== index);
        } else {
          openQuestions.value[category].push(index);
        }
      };
  
      const isOpen = (category, index) => {
        return openQuestions.value[category].includes(index);
      };
      
      // Watch for locale changes
      watch(() => locale.value, (newLocale) => {
        console.log('FAQPage detected locale change to:', newLocale);
      });
      
      // Also listen for custom locale-changed event
      const handleLocaleChange = (event) => {
        console.log('FAQPage received locale-changed event:', event.detail);
      };
      
      window.addEventListener('locale-changed', handleLocaleChange);
      
      // Clean up event listener when component is unmounted
      onUnmounted(() => {
        window.removeEventListener('locale-changed', handleLocaleChange);
      });
  
      return {
        currentLocale,
        contactEmail,
        contactPhone,
        generalQuestions,
        productQuestions,
        orderQuestions,
        supportQuestions,
        toggleQuestion,
        isOpen
      };
    }
  };
  </script>
  
  <style scoped>
  .faq-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .faq-title {
    font-size: 32px;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .faq-intro {
    text-align: center;
    margin-bottom: 40px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }
  
  .faq-categories {
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .faq-category {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .category-title {
    color: #1e88e5; /* Ocean blue color to match footer headings */
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: 600;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 10px;
  }
  
  .faq-item {
    margin-bottom: 15px;
    border-bottom: 1px solid #eeeeee;
  }
  
  .faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 15px 0;
  }
  
  .faq-question h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
    color: #424242;
    flex: 1;
  }
  
  .toggle-icon {
    font-size: 24px;
    color: #1e88e5;
    font-weight: bold;
  }
  
  .faq-answer {
    padding: 0 0 20px 0;
    line-height: 1.6;
    color: #616161;
  }
  
  .faq-contact {
    margin-top: 50px;
    text-align: center;
    background-color: #f1f8fe;
    padding: 30px;
    border-radius: 8px;
  }
  
  .faq-contact h2 {
    color: #1e88e5;
    margin-bottom: 15px;
    font-weight: 600;
  }
  
  .contact-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
  }
  
  .contact-button {
    display: inline-flex;
    align-items: center;
    padding: 12px 24px;
    background-color: #1e88e5;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    transition: background-color 0.3s;
  }
  
  .contact-button:hover {
    background-color: #1565c0;
  }
  
  .telegram-button {
    background-color: #0088cc;
  }
  
  .telegram-button:hover {
    background-color: #006699;
  }
  
  .whatsapp-button {
    background-color: #25D366;
  }
  
  .whatsapp-button:hover {
    background-color: #128C7E;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .faq-categories {
      grid-template-columns: 1fr;
    }
    
    .faq-category {
      padding: 20px 15px;
    }
    
    .contact-options {
      flex-direction: column;
    }
  }
  
  /* Add icons (you can replace with your actual icons) */
  .email-icon, .phone-icon, .telegram-icon, .whatsapp-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 8px;
    background-size: contain;
    background-repeat: no-repeat;
  }
  
  .email-icon {
    background-image: url('/images/email-icon.svg');
  }
  
  .phone-icon {
    background-image: url('/images/phone-icon.svg');
  }
  
  .telegram-icon {
    background-image: url('/images/Footer/telegram-icon.svg');
  }
  
  .whatsapp-icon {
    background-image: url('/images/Footer/whatsapp-icon.svg');
  }
  </style>