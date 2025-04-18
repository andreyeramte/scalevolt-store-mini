<template>
    <div class="error-page-container">
      <div class="error-content">
        <img src="/images/404.error.svg" alt="Error" class="error-icon" />
        
        <h1 class="error-title">{{ errorTitle }}</h1>
        <p class="error-message">{{ errorMessage }}</p>
        
        <div class="actions">
          <button @click="goBack" class="btn-back">
            <i class="icon-arrow-left"></i> {{ $t('error.goBack') }}
          </button>
          <router-link to="/" class="btn-home">
            <i class="icon-home"></i> {{ $t('error.goHome') }}
          </router-link>
        </div>
        
        <div class="help-section">
          <h2>{{ $t('error.needHelp') }}</h2>
          <p>{{ $t('error.contactSupport') }}</p>
          <div class="contact-options">
            <a href="mailto:scalevolt.info@gmail.com" class="contact-option">
              <i class="icon-mail"></i>
              <span>scalevolt.info@gmail.com</span>
            </a>
            <a href="#" class="contact-option" @click="openChat">
              <i class="icon-chat"></i>
              <span>{{ $t('error.liveChat') }}</span>
            </a>
            <a href="tel:+380XXXXXXXX" class="contact-option">
              <i class="icon-phone"></i>
              <span>+380 XX XXX XX XX</span>
            </a>
          </div>
        </div>
        
        <div class="suggested-links">
          <h3>{{ $t('error.explorePages') }}</h3>
          <div class="link-grid">
            <router-link to="/shop" class="suggested-link">
              <i class="icon-shop"></i>
              <span>{{ $t('error.shop') }}</span>
            </router-link>
            <router-link to="/delivery-warranty-returns" class="suggested-link">
              <i class="icon-delivery"></i>
              <span>{{ $t('error.delivery') }}</span>
            </router-link>
            <router-link to="/lease-info" class="suggested-link">
              <i class="icon-lease"></i>
              <span>{{ $t('error.leaseInfo') }}</span>
            </router-link>
            <router-link to="/support" class="suggested-link">
              <i class="icon-support"></i>
              <span>{{ $t('error.support') }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ErrorView',
    props: {
      errorCode: {
        type: String,
        default: '404'
      }
    },
    computed: {
      errorTitle() {
        switch (this.errorCode) {
          case '404':
            return this.$t('error.notFound');
          case '500':
            return this.$t('error.serverError');
          case '403':
            return this.$t('error.forbidden');
          default:
            return this.$t('error.somethingWrong');
        }
      },
      errorMessage() {
        switch (this.errorCode) {
          case '404':
            return this.$t('error.pageNotFoundMessage');
          case '500':
            return this.$t('error.serverErrorMessage');
          case '403':
            return this.$t('error.forbiddenMessage');
          default:
            return this.$t('error.generalErrorMessage');
        }
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      openChat() {
        // Implement chat opening functionality
        console.log('Opening chat support');
        alert(this.$t('error.chatNotAvailable'));
      }
    },
    mounted() {
      // Set the page title based on error code
      document.title = this.errorTitle + ' | SCALEVOLT';
    }
  };
  </script>
  
  <style scoped>
  .error-page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f9f9f9;
    font-family: Arial, sans-serif;
  }
  
  .error-content {
    max-width: 800px;
    width: 100%;
    background-color: #ffffff;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .error-icon {
    width: 120px;
    height: 120px;
    margin-bottom: 30px;
  }
  
  .error-title {
    font-size: 32px;
    color: #333;
    margin-bottom: 15px;
  }
  
  .error-message {
    font-size: 18px;
    color: #666;
    margin-bottom: 30px;
    line-height: 1.5;
  }
  
  .actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .btn-back, .btn-home {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-back {
    background-color: #f0f0f0;
    color: #333;
    border: none;
  }
  
  .btn-back:hover {
    background-color: #e0e0e0;
  }
  
  .btn-home {
    background-color: #f26e9a;
    color: white;
    text-decoration: none;
    border: none;
  }
  
  .btn-home:hover {
    background-color: #e05a86;
  }
  
  .btn-back i, .btn-home i {
    margin-right: 8px;
    font-size: 18px;
  }
  
  .help-section {
    margin-top: 40px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  
  .help-section h2 {
    font-size: 22px;
    color: #333;
    margin-bottom: 10px;
  }
  
  .help-section p {
    color: #666;
    margin-bottom: 20px;
  }
  
  .contact-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }
  
  .contact-option {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    color: #333;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .contact-option:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .contact-option i {
    margin-right: 10px;
    font-size: 20px;
    color: #f26e9a;
  }
  
  .suggested-links {
    margin-top: 40px;
  }
  
  .suggested-links h3 {
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
  }
  
  .link-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .suggested-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    border-radius: 8px;
    background-color: #f9f9f9;
    color: #333;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .suggested-link:hover {
    background-color: #f2f2f2;
    transform: translateY(-2px);
  }
  
  .suggested-link i {
    font-size: 24px;
    margin-bottom: 10px;
    color: #f26e9a;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .error-content {
      padding: 30px 20px;
    }
    
    .error-icon {
      width: 100px;
      height: 100px;
    }
    
    .error-title {
      font-size: 28px;
    }
    
    .error-message {
      font-size: 16px;
    }
    
    .actions {
      flex-direction: column;
    }
    
    .btn-back, .btn-home {
      width: 100%;
    }
    
    .contact-options {
      flex-direction: column;
    }
    
    .contact-option {
      width: 100%;
    }
  }
  </style>