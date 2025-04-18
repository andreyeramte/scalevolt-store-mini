<template>
  <footer class="site-footer">
    <div class="footer-container">
      <!-- Products Section -->
      <div class="footer-section">
        <h3>{{ $t('footer.products') }}</h3>
        <ul>
          <li><a href="#">{{ $t('footer.sale') }}</a></li>
          <li>
            <router-link to="/Sets-of-solar-power-plants">
              {{ $t('footer.solarSets') }}
            </router-link>
          </li>
          <li><a href="#">{{ $t('footer.batteries') }}</a></li>
          <li><a href="#">{{ $t('footer.inverters') }}</a></li>
          <li><a href="#">{{ $t('footer.customerSupport') }}</a></li>
        </ul>
      </div>

      <!-- About Us Section -->
      <div class="footer-section">
        <h3>{{ $t('footer.aboutUs') }}</h3>
        <ul>
          <li>
            <router-link to="/company">{{ $t('footer.about') }}</router-link>
          </li>
          <li><a href="#">{{ $t('footer.ourTeam') }}</a></li>
          <li>
            <router-link to="/customer-cases">{{ $t('footer.cases') }}</router-link>
          </li>
          <li><a href="#">{{ $t('footer.contactUs') }}</a></li>
        </ul>
      </div>

      <!-- Contact Information Section -->
      <div class="footer-section">
        <h3>Kontaktna informacja</h3>
        <ul>
          <li v-if="currentLocale === 'pl'">
            ul. Marszałkowska 142, 00-061 Warszawa, Polska
          </li>
          <li v-else>
            просп. Валерія Лобановского 56 офіс, Київ, 01001, Україна
          </li>
          <li>
            <a :href="'mailto:' + getEmailByLocale()">
              {{ getEmailByLocale() }}
            </a>
          </li>
          <li>
            <a :href="'tel:' + getPhoneByLocale()">
              {{ getPhoneByLocale() }}
            </a>
          </li>
          <li v-if="currentLocale === 'pl'">NIP: PL1234567890</li>
          
          <!-- Telegram for Ukrainian locale only -->
          <li v-if="currentLocale === 'uk'" class="social-contact-item">
            <a href="https://t.me/ScaleVoltUkraineBot" target="_blank" aria-label="Telegram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="inline-svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 13.95 10.7 14 10.49C14.0069 10.4476 14.0032 10.4043 13.9893 10.3636C13.9753 10.323 13.9514 10.2861 13.92 10.26C13.84 10.19 13.73 10.21 13.64 10.23C13.52 10.26 12.14 11.16 9.48 12.94C9.03 13.25 8.63 13.4 8.27 13.39C7.87 13.38 7.1 13.19 6.5 13.02C5.75 12.82 5.17 12.71 5.22 12.33C5.25 12.13 5.54 11.93 6.08 11.72C8.96 10.38 10.92 9.47 11.97 9.01C14.93 7.69 15.53 7.48 15.92 7.48C16 7.48 16.21 7.51 16.34 7.62C16.46 7.72 16.49 7.85 16.5 7.95C16.5 8.02 16.51 8.2 16.49 8.36C16.48 8.53 16.66 8.53 16.64 8.8Z" fill="white"/>
              </svg>
              {{ currentLocale === 'uk' ? 'Напишіть нам' : 'Napisz do nas' }}
            </a>
          </li>
          
          <!-- WhatsApp for Polish locale only -->
          <li v-if="currentLocale === 'pl'" class="social-contact-item">
            <a href="https://wa.me/48780176595" target="_blank" aria-label="WhatsApp">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="inline-svg">
                <path d="M17.6 6.31999C16.8 5.49999 15.8 4.84999 14.7 4.39999C13.6 3.94999 12.3 3.69999 11 3.69999C9.89999 3.69999 8.79999 3.89999 7.79999 4.29999C6.79999 4.69999 5.89999 5.19999 5.09999 5.89999C4.29999 6.59999 3.7 7.49999 3.2 8.39999C2.7 9.39999 2.5 10.4 2.5 11.5C2.5 12.9 2.9 14.2 3.7 15.3L2.4 20.7L8 19.4C9 20 10.2 20.3 11.4 20.3C12.5 20.3 13.6 20.1 14.6 19.7C15.6 19.3 16.5 18.8 17.3 18.1C18.1 17.4 18.7 16.5 19.2 15.6C19.7 14.6 19.9 13.6 19.9 12.5C19.8 10.4 19.1 8.19999 17.6 6.31999ZM11.1 18.3C10 18.3 9 18 8.1 17.5L7.8 17.3L4.7 18.1L5.5 15.1L5.3 14.8C4.6 13.8 4.3 12.6 4.3 11.5C4.3 10.7 4.5 9.89999 4.8 9.09999C5.1 8.29999 5.6 7.69999 6.1 7.09999C6.7 6.49999 7.3 6.09999 8.1 5.79999C8.9 5.49999 9.7 5.29999 10.5 5.29999C11.6 5.29999 12.5 5.49999 13.4 5.89999C14.3 6.29999 15 6.89999 15.7 7.59999C16.4 8.29999 16.9 9.09999 17.2 9.99999C17.5 10.9 17.7 11.7 17.7 12.6C17.7 13.4 17.5 14.2 17.2 15C16.9 15.8 16.4 16.4 15.9 17C15.3 17.6 14.7 18 14 18.3C13.1 18.5 12.1 18.7 11.1 18.3ZM14.8 13.7C14.7 13.6 14.5 13.6 14.2 13.5C13.9 13.4 13.4 13.2 13.2 13.1C12.9 13 12.8 13 12.7 13.1C12.6 13.2 12.4 13.4 12.3 13.5C12.2 13.7 12.1 13.7 11.9 13.6C11.7 13.5 11.3 13.4 10.9 13C10.5 12.7 10.2 12.3 10.1 12.1C10 11.9 10 11.7 10.1 11.6C10.2 11.5 10.3 11.4 10.4 11.3C10.5 11.2 10.5 11.1 10.6 11C10.7 10.9 10.6 10.8 10.6 10.7C10.6 10.6 10.3 9.89999 10.2 9.59999C10.1 9.29999 10 9.29999 9.89999 9.29999H9.69999C9.49999 9.29999 9.39999 9.39999 9.29999 9.39999C9.19999 9.49999 9.10001 9.59999 8.90001 9.79999C8.70001 9.99999 8.60001 10.2 8.60001 10.4C8.60001 10.6 8.70001 10.8 8.79999 11C8.89999 11.2 8.89999 11.3 9.09999 11.5C9.29999 11.7 9.39999 11.8 9.5 12C9.6 12.2 9.89999 12.5 10.2 12.7C10.5 12.9 10.7 13 10.9 13.1C11.1 13.2 11.3 13.3 11.4 13.3C11.5 13.3 11.7 13.4 11.9 13.4C12.1 13.4 12.3 13.3 12.4 13.2C12.5 13.1 12.6 13 12.7 12.9C12.8 12.8 12.9 12.7 13 12.7C13.1 12.7 13.3 12.8 13.4 12.9C13.5 13 14 13.2 14.3 13.4C14.6 13.6 14.8 13.7 14.9 13.7C15 13.7 15 13.6 15 13.5C15 13.8 14.9 13.8 14.8 13.7Z" fill="white"/>
              </svg>
              {{ currentLocale === 'pl' ? 'Napisz do nas' : 'Напишіть нам' }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Support Section -->
      <div class="footer-section">
        <h3>{{ currentLocale === 'pl' ? 'Wsparcie' : 'Підтримка' }}</h3>
        <ul>
          <li>
      <router-link to="/faq">
        {{ currentLocale === 'pl' ? 'Pytania i odpowiedzi' : 'Запитання й відповіді' }}
      </router-link>
    </li>
          <li>
            <router-link to="/delivery-warranty-returns">
              {{ currentLocale === 'pl' ? 'Dostawa, Gwarancja i Zwroty' : 'Доставка, Гарантія та Повернення' }}
            </router-link>
          </li>
          <li>
            <router-link to="/privacy-policy">
              {{ currentLocale === 'pl' ? 'Polityka prywatności' : 'Політика конфіденційності' }}
            </router-link>
          </li>
          <li><a href="#">{{ currentLocale === 'pl' ? 'Obsługa klienta' : 'Підтримка клієнтів' }}</a></li>
        </ul>
      </div>

      <!-- Legal Section -->
      <div class="footer-section">
        <h3>{{ currentLocale === 'pl' ? 'Informacje prawne' : 'Юридична інформація' }}</h3>
        <ul>
          <li>
            <router-link to="/legal-terms">
              {{ currentLocale === 'pl' ? 'Warunki korzystania' : 'Умови використання' }}
            </router-link>
          </li>
          <li>
            <router-link to="/privacy-policy">
              {{ currentLocale === 'pl' ? 'Polityka prywatności' : 'Політика конфіденційності' }}
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Social Media & Apps -->
      <div class="footer-section">
        <h3>{{ currentLocale === 'pl' ? 'Obserwuj nas' : 'Слідкуйте за нами' }}</h3>
        <div class="social-icons">
          <a href="#" aria-label="Telegram">
            <img src="/images/Footer/telegram-icon.svg" alt="Telegram">
          </a>
          <a href="#" aria-label="Instagram">
            <img src="/images/Footer/instagram-icon.svg" alt="Instagram">
          </a>
          <a href="#" aria-label="Youtube">
            <img src="/images/Footer/youtube-icon.svg" alt="Youtube">
          </a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>
        {{ currentLocale === 'pl' 
          ? `© ${new Date().getFullYear()} ScaleVolt. Wszelkie prawa zastrzeżone.`
          : `© ${new Date().getFullYear()} ScaleVolt. Всі права захищені.` 
        }}
      </span>
    </div>
  </footer>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'Footer',
  setup() {
    const { locale } = useI18n();
    const currentLocale = computed(() => locale.value);
    
    // Custom functions to get locale-specific contact info
    const getEmailByLocale = () => {
      return currentLocale.value === 'pl' 
        ? 'scalevolt.info@gmail.com' 
        : 'scalevolt.info@gmail.com';
    };
    
    const getPhoneByLocale = () => {
      return currentLocale.value === 'pl' 
        ? '+48 780 176 595' 
        : '+380 96 747 79 13';
    };
    
    // Debug info
    onMounted(() => {
      console.log('Footer mounted with locale:', currentLocale.value);
    });
    
    return {
      currentLocale,
      getEmailByLocale,
      getPhoneByLocale
    };
  }
};
</script>

<style scoped>
.site-footer {
  background-color: #333;
  color: #ffffff;
  font-size: 14px;
  padding: 20px;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
}

.footer-section {
  flex: 1 1 180px;
  margin: 10px;
}

.footer-section h3 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #1e88e5;
  font-weight: 600; /* Make text slightly more bold */

}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section ul li a {
  color: #ffffff;
  text-decoration: none;
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.footer-section ul li a:hover {
  opacity: 1;
  text-decoration: underline;
}

/* Social Contact Items (TG and WA) */
.social-contact-item {
  margin-top: 10px;
}

.social-contact-item a {
  display: flex;
  align-items: center;
  color: #ffffff;
  text-decoration: none;
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.social-contact-item a:hover {
  opacity: 1;
  text-decoration: underline;
}

.social-contact-item img,
.social-contact-item .inline-svg {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

/* Social Icons */
.social-icons a {
  display: inline-block;
  margin-right: 10px;
}

.social-icons img {
  width: 24px;
  height: 24px;
}

/* Footer bottom */
.footer-bottom {
  border-top: 1px solid #444;
  padding-top: 10px;
  text-align: center;
  font-size: 13px;
  opacity: 0.8;
}

/* Responsive Adjustments */
@media (max-width: 800px) {
  .footer-section {
    flex: 1 1 100%;
  }
  .footer-container {
    justify-content: flex-start;
  }
}
</style>