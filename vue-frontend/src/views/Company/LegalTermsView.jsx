<template>
    <div class="legal-terms-container">
      <h1 class="page-title">{{ $t('legal.termsAndConditions') }}</h1>
      
      <!-- Rental Service Terms Section -->
      <section class="legal-section">
        <h2>{{ $t('legal.rentalServiceTerms') }}</h2>
        <div class="blue-underline"></div>
        
        <ul class="terms-list">
          <li>
            <a :href="getDocumentUrl('rental-terms-uk.pdf')" target="_blank">
              {{ $t('legal.ukraineRentalTerms') }} ({{ $t('common.ukrainian') }})
            </a>
          </li>
          <li>
            <a :href="getDocumentUrl('rental-terms-pl.pdf')" target="_blank">
              {{ $t('legal.polandRentalTerms') }} ({{ $t('common.polish') }})
            </a>
          </li>
        </ul>
      </section>
      
      <!-- Purchase Terms Section -->
      <section class="legal-section">
        <h2>{{ $t('legal.purchaseTerms') }}</h2>
        <div class="blue-underline"></div>
        
        <ul class="terms-list">
          <li>
            <a :href="getDocumentUrl('purchase-terms-uk.pdf')" target="_blank">
              {{ $t('legal.ukrainePurchaseTerms') }} ({{ $t('common.ukrainian') }})
            </a>
          </li>
          <li>
            <a :href="getDocumentUrl('purchase-terms-pl.pdf')" target="_blank">
              {{ $t('legal.polandPurchaseTerms') }} ({{ $t('common.polish') }})
            </a>
          </li>
        </ul>
      </section>
      
      <!-- Payment Processing Terms -->
      <section class="legal-section">
        <h2>{{ $t('legal.paymentTerms') }}</h2>
        <div class="blue-underline"></div>
        
        <ul class="terms-list">
          <li>
            <a :href="getDocumentUrl('payment-terms-uk.pdf')" target="_blank">
              {{ $t('legal.paymentTermsDoc') }} ({{ $t('common.ukrainian') }})
            </a>
          </li>
          <li>
            <a :href="getDocumentUrl('payment-terms-pl.pdf')" target="_blank">
              {{ $t('legal.paymentTermsDoc') }} ({{ $t('common.polish') }})
            </a>
          </li>
        </ul>
      </section>
      
      <!-- Warranty Terms -->
      <section class="legal-section">
        <h2>{{ $t('legal.warrantyTerms') }}</h2>
        <div class="blue-underline"></div>
        
        <ul class="terms-list">
          <li>
            <a :href="getDocumentUrl('warranty-terms-uk.pdf')" target="_blank">
              {{ $t('legal.warrantyTermsDoc') }} ({{ $t('common.ukrainian') }})
            </a>
          </li>
          <li>
            <a :href="getDocumentUrl('warranty-terms-pl.pdf')" target="_blank">
              {{ $t('legal.warrantyTermsDoc') }} ({{ $t('common.polish') }})
            </a>
          </li>
        </ul>
      </section>
      
      <!-- Privacy Policy -->
      <section class="legal-section">
        <h2>{{ $t('legal.privacyPolicy') }}</h2>
        <div class="blue-underline"></div>
        
        <ul class="terms-list">
          <li>
            <router-link to="privacy-policy">
              {{ $t('legal.viewPrivacyPolicy') }}
            </router-link>
          </li>
        </ul>
      </section>
      
      <!-- Corporate Information -->
      <section class="legal-section">
        <h2>{{ $t('legal.corporateInfo') }}</h2>
        <div class="blue-underline"></div>
        
        <div class="corp-info">
          <p>{{ $t('legal.companyName') }}: SCALEVOLT</p>
          <p>{{ $t('legal.address') }}: {{ $t('legal.companyAddress') }}</p>
          <p>{{ $t('legal.registrationNumber') }}: {{ $t('legal.companyRegNumber') }}</p>
          <p>{{ $t('legal.vatID') }}: {{ $t('legal.companyVAT') }}</p>
          <p>{{ $t('legal.email') }}: scalevolt.info@gmail.com</p>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LegalTermsView',
    methods: {
      getDocumentUrl(filename) {
        return `/documents/${filename}`
      }
    },
    mounted() {
      document.title = this.$t('legal.termsAndConditions') + ' | SCALEVOLT';
    }
  };
  </script>
  
  <style scoped>
  .legal-terms-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
    padding-top: 100px;
    font-family: Arial, sans-serif;
  }
  
  .page-title {
    font-size: 32px;
    margin-bottom: 40px;
    color: #333;
  }
  
  .legal-section {
    margin-bottom: 40px;
  }
  
  .legal-section h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
  }
  
  .blue-underline {
    height: 4px;
    width: 200px;
    background-color: #0066cc;
    margin-bottom: 20px;
  }
  
  .terms-list {
    list-style-type: none;
    padding-left: 20px;
  }
  
  .terms-list li {
    margin-bottom: 15px;
    position: relative;
    padding-left: 20px;
  }
  
  .terms-list li::before {
    content: "•";
    color: #0066cc;
    font-size: 20px;
    position: absolute;
    left: 0;
    top: -2px;
  }
  
  .terms-list a {
    color: #0066cc;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }
  
  .terms-list a:hover {
    color: #004799;
    text-decoration: underline;
  }
  
  .corp-info {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
  }
  
  .corp-info p {
    margin: 10px 0;
    line-height: 1.5;
  }
  
  @media (max-width: 768px) {
    .page-title {
      font-size: 28px;
    }
    
    .legal-section h2 {
      font-size: 22px;
    }
  }
  
  @media (max-width: 480px) {
    .page-title {
      font-size: 24px;
    }
    
    .legal-section h2 {
      font-size: 20px;
    }
    
    .terms-list li {
      padding-left: 15px;
    }
  }
  </style>