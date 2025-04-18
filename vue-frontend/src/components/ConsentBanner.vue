<!-- components/ConsentBanner.vue -->
<template>
    <div v-if="showBanner" class="consent-banner">
      <p>{{ $t('consent.message') }}</p>
      <div class="consent-buttons">
        <button @click="acceptConsent" class="accept-btn">{{ $t('consent.accept') }}</button>
        <button @click="rejectConsent" class="reject-btn">{{ $t('consent.reject') }}</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { detectUserCountry, mapCountryToLocale } from '../services/geoService';
  
  export default {
    name: 'ConsentBanner',
    setup() {
      const { locale, t } = useI18n();
      const showBanner = ref(false);
      
      onMounted(() => {
        // Only show the banner if the user hasn't set a preference AND hasn't rejected the consent
        showBanner.value = !localStorage.getItem('userLocale') && 
                           !localStorage.getItem('locationConsentRejected');
      });
      
      const acceptConsent = async () => {
        showBanner.value = false;
        try {
          const country = await detectUserCountry();
          if (country) {
            const detectedLocale = mapCountryToLocale(country);
            locale.value = detectedLocale;
            localStorage.setItem('userLocale', detectedLocale);
            // Reload to apply language changes
            window.location.reload();
          }
        } catch (error) {
          console.error('Error during country detection:', error);
          // Fall back to default locale
          localStorage.setItem('userLocale', 'uk');
        }
      };
      
      const rejectConsent = () => {
        showBanner.value = false;
        localStorage.setItem('locationConsentRejected', 'true');
        // Set default locale
        localStorage.setItem('userLocale', 'uk');
      };
      
      return {
        showBanner,
        acceptConsent,
        rejectConsent
      };
    }
  };
  </script>
  
  <style scoped>
  .consent-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #333;
    color: white;
    padding: 15px;
    z-index: 1000;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .consent-buttons {
    display: flex;
    gap: 10px;
  }
  
  .accept-btn {
    background-color: #4285F4;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .reject-btn {
    background-color: transparent;
    color: white;
    border: 1px solid white;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  @media (max-width: 768px) {
    .consent-banner {
      flex-direction: column;
      gap: 10px;
    }
  }
  </style>