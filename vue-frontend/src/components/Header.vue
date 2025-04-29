<template>
  <header class="header-container" ref="headerRef">
    <!-- Mobile Header (shown only on mobile devices) -->
    <div class="mobile-header">
      <!-- Top Row: Logo and Icons -->
      <div class="mobile-top-row">
        <!-- Left: Hamburger and Logo -->
        <div class="mobile-left-group">
          <div class="hamburger-container" @click.stop="toggleMenu">
            <button class="hamburger-menu" aria-label="Toggle Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <div class="logo-container">
            <router-link to="/">
              <img src="/images/header/scalevolt-logo.png" alt="Scalevolt Logo" class="logo" />
            </router-link>
          </div>
        </div>
        
        <!-- Right: Icons -->
        <div class="mobile-right-group">
         
          
          <!-- Profile -->
          <div class="mobile-icon">
            <router-link v-if="!user" to="/login">
              <img src="/images/header/profile-logo.svg" alt="Account" />
            </router-link>
            <router-link v-else to="/profile">
              <img src="/images/header/profile-logo.svg" alt="Account" />
            </router-link>
          </div>
          
          <!-- Cart -->
          <div class="mobile-icon">
            <router-link to="/cart">
              <img src="/images/header/cart.svg" alt="Cart" />
              <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Bottom Row: Search -->
      <div class="mobile-search-row">
        <div class="search-container-mobile">
          <SearchBar 
            class="my-search-bar full-width-search" 
            :all-products="searchProducts"
            @search-selected="handleSearchSelected" 
          />
        </div>
      </div>
    </div>
    
    <!-- Desktop Header (shown only on desktop devices) -->
    <div class="desktop-header">
      <div class="desktop-content">
        <div class="left-section">
          <div class="hamburger-container" @click.stop="toggleMenu">
            <button class="hamburger-menu" aria-label="Toggle Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <div class="logo-container">
            <router-link to="/">
              <img src="/images/header/scalevolt-logo.png" alt="Scalevolt Logo" class="logo" />
            </router-link>
          </div>
        </div>

        <div class="center-section">
          <div class="search-container">
            <SearchBar
              class="my-search-bar desktop-search"
              :all-products="searchProducts"
              @search-selected="handleSearchSelected"
            />
          </div>
        </div>

        <div class="right-section">
          
          <div class="user-controls">
            <div class="cart-icon">
              <router-link to="/cart">
                <img src="/images/header/cart.svg" alt="Cart" />
                <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
              </router-link>
            </div>
            <div class="user-icon">
              <router-link v-if="!user" to="/login">
                <img src="/images/header/profile-logo.svg" alt="Account" />
              </router-link>
              <router-link v-else to="/profile">
                <img src="/images/header/profile-logo.svg" alt="Account" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Region Dropdown Menu (works for both mobile and desktop) -->
    <div v-if="regionMenuVisible" class="region-dropdown" @click.stop>
      <div class="region-option" @click="selectRegion('ua')">
        <span class="language">Українська</span>
      </div>
      <div class="region-option" @click="selectRegion('pl')">
        <span class="language">Polski</span>
      </div>
    </div>


    <!-- Mega Menu Dropdown -->
    <div v-if="menuVisible" class="dropdown-mega-menu" @click.stop>
   

      <div class="menu-container">
        <!-- Main Categories Column -->
        <div class="menu-categories">
          <!-- Solar System Category -->
          <div
            class="menu-category"
            :class="{ active: activeCategory === 'solar' }"
            @mouseenter="activeCategory = 'solar'"
            @click="activeCategory = 'solar'"
          >
            <div class="category-header">
              <div class="category-icon-placeholder solar-color"></div>
              <h3>{{ $t("header.menu.solarSystem") }}</h3>
            </div>
          </div>

          <!-- EV Chargers Category -->
          <div
            class="menu-category"
            :class="{ active: activeCategory === 'ev' }"
            @mouseenter="activeCategory = 'ev'"
            @click="activeCategory = 'ev'"
          >
            <div class="category-header">
              <div class="category-icon-placeholder ev-color"></div>
              <h3>{{ $t("header.menu.evChargers") }}</h3>
            </div>
          </div>

          <!-- Portable Power Category -->
          <div
            class="menu-category"
            :class="{ active: activeCategory === 'portable' }"
            @mouseenter="activeCategory = 'portable'"
            @click="activeCategory = 'portable'"
          >
            <div class="category-header">
              <div class="category-icon-placeholder portable-color"></div>
              <h3>{{ $t("header.menu.portablePower") }}</h3>
            </div>
          </div>

          <!-- Generators Category -->
          <div
            class="menu-category"
            :class="{ active: activeCategory === 'generators' }"
            @mouseenter="activeCategory = 'generators'"
            @click="activeCategory = 'generators'"
          >
            <div class="category-header">
              <div class="category-icon-placeholder generator-color"></div>
              <h3>{{ $t("header.menu.generators") }}</h3>
            </div>
          </div>

          <!-- Electrical Components Category -->
          <div
            class="menu-category"
            :class="{ active: activeCategory === 'electrical' }"
            @mouseenter="activeCategory = 'electrical'"
            @click="activeCategory = 'electrical'"
          >
            <div class="category-header">
              <div class="category-icon-placeholder electrical-color"></div>
              <h3>{{ $t("header.menu.electricalComponents") }}</h3>
            </div>
          </div>
        </div>

        <!-- Subcategories Panel -->
        <div class="menu-subcategories">
          <!-- Solar System Subcategories -->
          <div class="subcategory-panel" v-if="activeCategory === 'solar'">
            <div class="subcategory-list">
              <router-link
                v-for="item in solarSystemItems"
                :key="item.id"
                :to="getCategoryRoute(item.slug)"
                class="subcategory-item"
                @click.stop="handleMenuItemClick"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="subcategory-image"
                />
                <span>{{ item.name }}</span>
              </router-link>
            </div>
            <div class="featured-category">
              <div class="featured-header">
                <h4>
                  {{ $t("header.featured.solar", "Популярні сонячні рішення") }}
                </h4>
              </div>
              <div class="featured-image">
                <img
                  src="/images/HomeView/solar-farm.png"
                  alt="Solar Solutions"
                />
              </div>
            </div>
          </div>

          <!-- EV Chargers Subcategories -->
          <div class="subcategory-panel" v-if="activeCategory === 'ev'">
            <div class="subcategory-list">
              <router-link
                v-for="item in evChargerItems"
                :key="item.id"
                :to="getCategoryRoute(item.slug)"
                class="subcategory-item"
                @click.stop="handleMenuItemClick"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="subcategory-image"
                />
                <span>{{ item.name }}</span>
              </router-link>
            </div>
            <div class="featured-category">
              <div class="featured-header">
                <h4>
                  {{ $t("header.featured.ev", "Топові зарядні станції") }}
                </h4>
              </div>
              <div class="featured-image">
                <img
                  src="/images/HomeView/ev-charger-city.png"
                  alt="EV Charging Stations"
                />
              </div>
            </div>
          </div>

          <!-- Portable Power Subcategories -->
          <div class="subcategory-panel" v-if="activeCategory === 'portable'">
            <div class="subcategory-list">
              <router-link
                v-for="item in portablePowerItems"
                :key="item.id"
                :to="getCategoryRoute(item.slug)"
                class="subcategory-item"
                @click.stop="handleMenuItemClick"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="subcategory-image"
                />
                <span>{{ item.name }}</span>
              </router-link>
            </div>
            <div class="featured-category">
              <div class="featured-header">
                <h4>
                  {{
                    $t(
                      "header.featured.portable",
                      "Портативні рішення для енергії"
                    )
                  }}
                </h4>
              </div>
              <div class="featured-image">
                <img
                  src="/images/HomeView/solar-panel.png"
                  alt="Portable Power Solutions"
                />
              </div>
            </div>
          </div>

          <!-- Generators Subcategories -->
          <div class="subcategory-panel" v-if="activeCategory === 'generators'">
            <div class="subcategory-list">
              <router-link
                v-for="item in generatorItems"
                :key="item.id"
                :to="getCategoryRoute(item.slug)"
                class="subcategory-item"
                @click.stop="handleMenuItemClick"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="subcategory-image"
                />
                <span>{{ item.name }}</span>
              </router-link>
            </div>
            <div class="featured-category">
              <div class="featured-header">
                <h4>
                  {{
                    $t(
                      "header.featured.generators",
                      "Генератори для будь-яких потреб"
                    )
                  }}
                </h4>
              </div>
              <div class="featured-image">
                <img
                  src="/images/HomeView/генератори.png"
                  alt="Generators"
                />
              </div>
            </div>
          </div>

          <!-- Electrical Components Subcategories -->
          <div class="subcategory-panel" v-if="activeCategory === 'electrical'">
            <div class="subcategory-list">
              <router-link
                v-for="item in electricalItems"
                :key="item.id"
                :to="getCategoryRoute(item.slug)"
                class="subcategory-item"
                @click.stop="handleMenuItemClick"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="subcategory-image"
                />
                <span>{{ item.name }}</span>
              </router-link>
            </div>
            <div class="featured-category">
              <div class="featured-header">
                <h4>
                  {{
                    $t(
                      "header.featured.electrical",
                      "Електричні компоненти та кабелі"
                    )
                  }}
                </h4>
              </div>
              <div class="featured-image">
                <img
                  src="/images/HomeView/Electrical-cables-and-wires.jpg"
                  alt="Electrical Components"
                />
              </div>
            </div>
          </div>
          <!-- Add this to the bottom of dropdown-mega-menu -->




<!-- Tesla-style language selector at bottom -->
<div class="tesla-language-selector">
  <div class="language-selector-item" @click="selectRegion('pl')">
    <div class="globe-icon-container">
      <img src="/images/header/globe-icon.svg" alt="Region Icon" class="globe-icon" />
    </div>
    <div class="language-info">
      <div class="country-name">Poland</div>
      <div class="language-name">Polish</div>
    </div>
    <div class="selector-indicator" :class="{ active: currentLocale === 'pl' }"></div>
  </div>
  
  <div class="language-selector-item" @click="selectRegion('ua')">
    <div class="globe-icon-container">
      <img src="/images/header/globe-icon.svg" alt="Region Icon" class="globe-icon" />
    </div>
    <div class="language-info">
      <div class="country-name">Ukraine</div>
      <div class="language-name">Ukrainian</div>
    </div>
    <div class="selector-indicator" :class="{ active: currentLocale === 'ua' }"></div>
  </div>
</div>


        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import SearchBar from "@/components/SearchBar.vue";
import { useCartStore } from "@/stores/cart";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
import productService from "@/services/productService";

export default {
  name: "Header",
  components: { SearchBar },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const menuVisible = ref(false);
    const regionMenuVisible = ref(false);
    const searchVisible = ref(false);
    const selectedRegion = ref("United States");
    const searchProducts = ref([]);
    const headerRef = ref(null);
    const searchQuery = ref("");
    const activeCategory = ref("solar"); // Default active category

    // Initialize stores and i18n
    const cartStore = useCartStore();
    const userStore = useUserStore();
    const { t, locale } = useI18n(); // Make sure to get the t function

    // Computed properties
    const user = computed(() => userStore.user);
    const cartCount = computed(() => cartStore.totalQuantity);
    const isHomePage = computed(() => route.path === "/");
    const currentLocale = computed(() => {
      // Add a default value if locale.value is undefined
      return locale.value || "ua";
    });

    // Update CSS variable to reflect header height
    const updateHeaderHeight = () => {
      const root = document.documentElement;
      const headerContainer = headerRef.value;
      
      if (headerContainer) {
        // Get actual header height
        const headerHeight = headerContainer.offsetHeight;
        
        // Set the CSS variable
        root.style.setProperty('--header-height', `${headerHeight}px`);
        
        // Set different variable for mega menu positioning
        const menuTopPosition = window.innerWidth < 768 ? headerHeight : 110;
        root.style.setProperty('--menu-top-position', `${menuTopPosition}px`);
        
        // Force mobile icons to display properly
        if (window.innerWidth < 768) {
          const mobileIcons = document.querySelectorAll('.mobile-icon');
          mobileIcons.forEach(icon => {
            icon.style.display = 'flex';
          });
        }
        
        // Update breadcrumbs position if they exist
        const breadcrumbsContainer = document.querySelector('.breadcrumbs-container');
        if (breadcrumbsContainer) {
          breadcrumbsContainer.style.display = 'block';
          breadcrumbsContainer.scrollLeft = 0; // Reset horizontal scroll position
        }
        
        // If on product page, update its padding
        const productPage = document.querySelector('.product-page-container');
        if (productPage) {
          productPage.style.paddingTop = `${headerHeight + 10}px`;
        }
      }
    };

    const currentCurrency = ref(localStorage.getItem("userCurrency") || "UAH");

    const selectCurrency = (currency) => {
      currentCurrency.value = currency;
      localStorage.setItem("userCurrency", currency);
    };

    // Toggle functions
    const toggleMenu = (event) => {
      if (event) event.stopPropagation();
      menuVisible.value = !menuVisible.value;
      // Close region menu if open
      if (regionMenuVisible.value) regionMenuVisible.value = false;
      // Close search if open
      if (searchVisible.value) searchVisible.value = false;
    };

    const toggleRegionMenu = (event) => {
      if (event) event.stopPropagation();
      regionMenuVisible.value = !regionMenuVisible.value;
      // Close hamburger menu if open
      if (menuVisible.value) menuVisible.value = false;
      // Close search if open
      if (searchVisible.value) searchVisible.value = false;
    };
    
    // New function to toggle search visibility
    const toggleSearch = (event) => {
      if (event) event.stopPropagation();
      searchVisible.value = !searchVisible.value;
      // Close hamburger menu if open
      if (menuVisible.value) menuVisible.value = false;
      // Close region menu if open
      if (regionMenuVisible.value) regionMenuVisible.value = false;
    };

    // Handler functions
    const handleMenuItemClick = () => {
      // Close the menu when an item is clicked
      menuVisible.value = false;
    };

    const closeMenusOnOutsideClick = (event) => {
      // Only close menus if click is outside the header element
      if (headerRef.value && !headerRef.value.contains(event.target)) {
        menuVisible.value = false;
        regionMenuVisible.value = false;
        searchVisible.value = false;
      }
    };

    const selectRegion = (region) => {
      // Map 'uk' from UI to 'ua' for the i18n system
      const localeCode = region === 'uk' ? 'ua' : region;
      
      console.log("Changing locale to:", region, "-> mapping to locale code:", localeCode);

      // Update the i18n locale with the MAPPED code
      locale.value = localeCode;

      // Store in localStorage with the MAPPED code
      localStorage.setItem("userLocale", localeCode);

      // Update document language
      document.documentElement.setAttribute("lang", localeCode);
      
      // If navigating to a new URL, use the MAPPED code
      const newUrl = `${window.location.origin}/${localeCode}`;
      window.location.href = newUrl;
      
      // Close the dropdown (won't execute with page navigation)
      regionMenuVisible.value = false;
    };

    const performSearch = () => {
      if (!searchQuery.value.trim()) return;

      console.log(`Performing search for: ${searchQuery.value}`);

      // Simple filtering of products
      const query = searchQuery.value.toLowerCase();
      const results = (
        searchProducts.value.length > 0
          ? searchProducts.value
          : allProducts.value
      ).filter((p) => p.name.toLowerCase().includes(query));

      console.log(`Found ${results.length} results`);

      if (results.length > 0) {
        handleSearchSelected(results[0]);
      }
    };

    const handleSearchSelected = (product) => {
      router.push(`/products/${product.id}`);
      // Close search after selection
      searchVisible.value = false;
    };

    // Lifecycle hooks
    onMounted(async () => {
      document.addEventListener("click", closeMenusOnOutsideClick);
      updateHeaderHeight();
      window.addEventListener('resize', updateHeaderHeight);
      
      // Check if this page load was from a language switch
      const isLanguageSwitch = localStorage.getItem("isLanguageSwitch");
      if (isLanguageSwitch === "true") {
        // Clear the flag
        localStorage.removeItem("isLanguageSwitch");
        console.log("Page loaded after language switch");
      }
      
      // Add event listener for orientation changes
      window.addEventListener('orientationchange', () => {
        // Short delay to allow the browser to complete the orientation change
        setTimeout(updateHeaderHeight, 100);
      });
      
      // Add a CSS class to the body tag to handle mobile-specific styling
      if (window.innerWidth < 768) {
        document.body.classList.add('mobile-view');
      } else {
        document.body.classList.remove('mobile-view');
      }
      
      // Hide search bar on mobile by default
      if (window.innerWidth < 768) {
        searchVisible.value = false;
      } else {
        searchVisible.value = true; // Always visible on desktop
      }
      
      // Force update for product pages
      setTimeout(() => {
        const productPage = document.querySelector('.product-page-container');
        if (productPage) {
          updateHeaderHeight();
        }
      }, 500);
      
      // Debug i18n state
      console.log("Current locale on mount:", locale.value);
      console.log("Current locale in computed:", currentLocale.value);
      console.log("Sample translation:", t("header.menu.solarSystem"));
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", closeMenusOnOutsideClick);
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('orientationchange', updateHeaderHeight);
    });

    // Keep all your existing data - just adding it back with the same object structure
    const solarSystemItems = computed(() => [
      {
        id: 1,
        name: t("header.categories.solarPanels"),
        slug: "solar-panels",
        image: "/images/HomeView/solar-farm.png",
      },
      {
        id: 2,
        name: t("header.categories.batteries"),
        slug: "batteries",
        image: "/images/HomeView/solar-battery.png",
      },
      {
        id: 3,
        name: t("header.categories.inverters"),
        slug: "inverters",
        image: "/images/HomeView/інвертер.png",
      },
      {
        id: 4,
        name: t("header.categories.solarSets"),
        slug: "Sets-of-solar-power-plants",
        image: "/images/HomeView/комплект-сонячних.png",
      },
      {
        id: 6,
        name: t("header.categories.mountingSystems"),
        slug: "mounting-systems",
        image: "/images/HomeView/solar-mount-system.png",
      },
    ]);

    // EV Charger Categories
    const evChargerItems = computed(() => [
      {
        id: 1,
        name: t("header.categories.evChargers"),
        slug: "ev-chargers",
        image: "/images/HomeView/otcta-стійка-02.png",
      },
      {
        id: 2,
        name: t("header.categories.cablesAdapters"),
        slug: "cables-adapters",
        image: "/images/HomeView/electric-charging-adapters.png",
      },
      {
        id: 3,
        name: t("header.categories.chargingStations"),
        slug: "charging-stations",
        image: "/images/HomeView/ev-charger-city.png",
      },
    ]);

    // Portable Power Categories
    const portablePowerItems = computed(() => [
      {
        id: 1,
        name: t("header.categories.portablePowerStations"),
        slug: "portable-power-stations",
        image: "/images/HomeView/solar-panel.png",
      },
      {
        id: 2,
        name: t("header.categories.solarGenerators"),
        slug: "solar-generators",
        image: "/images/HomeView/Charging-station-ND-EVC-UR40.jpg",
      },
      {
        id: 3,
        name: t("header.categories.portableSolarPanels"),
        slug: "portable-solar-panels",
        image:
          "/images/Categories/portable.solar.panels/Портативні-Сонячні-панелі-Jackery-SolarSaga-100W.png",
      },
    ]);

    // Generator Categories
    const generatorItems = computed(() => [
      {
        id: 1,
        name: t("header.categories.generators"),
        slug: "generators",
        image: "/images/HomeView/генератори.png",
      },
      {
        id: 2,
        name: t("header.categories.industrialGenerators"),
        slug: "industrial-generators",
        image:
          "/images/HomeView/Промислові-генератори-для-важких-навантажень.png",
      },
      {
        id: 3,
        name: t("header.categories.solarLightingTowers"),
        slug: "solar-lighting-towers",
        image: "/images/HomeView/Освітлювальні-вежі-на-сонячних-батареях.png",
      },
    ]);

    // Electrical Component Categories
    const electricalItems = computed(() => [
      {
        id: 1,
        name: t("header.categories.automaticSwitches"),
        slug: "automatic-switches",
        image: "/images/HomeView/інвертер.png",
      },
      {
        id: 2,
        name: t("header.categories.cablesWires"),
        slug: "cables-wires",
        image: "/images/HomeView/Electrical-cables-and-wires.jpg",
      },
    ]);

    // Example products for search
    const allProducts = ref([
      { id: 1, name: "Сонячна Панель A" },
      { id: 2, name: "Зарядка X" },
      { id: 3, name: "Автоматичний вимикач Y" },
    ]);

    // Helper for category routing
    const getCategoryRoute = (slug) => {
      return `/${slug.toLowerCase().replace(/ /g, "-")}`;
    };

    return {
      // Refs
      menuVisible,
      regionMenuVisible,
      searchVisible,
      selectedRegion,
      searchProducts,
      allProducts,
      searchQuery,
      headerRef,
      activeCategory,

      // Computed properties
      cartCount,
      isHomePage,
      user,
      currentLocale,

      // Data
      solarSystemItems,
      evChargerItems,
      portablePowerItems,
      generatorItems,
      electricalItems,

      // Functions
      toggleMenu,
      toggleRegionMenu,
      toggleSearch,
      selectRegion,
      handleSearchSelected,
      performSearch,
      handleMenuItemClick,
      getCategoryRoute,
      updateHeaderHeight,
      currentCurrency,
      selectCurrency
    };
  }
};
</script>


<style scoped>
.header-container {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 0;
}

/* Desktop Header Styles - Match Image 1 */
.desktop-header {
  display: none; /* Hidden by default, shown via media query */
  width: 100%; /* Ensure it takes full width */
  overflow: hidden; /* Prevent overflow */
}

.desktop-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px; /* Fixed height for desktop header */
  max-width: 1440px;
  margin: 0 auto;
  box-sizing: border-box;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0; /* Prevent shrinking */
}

.center-section {
  flex: 1; /* Take available space */
  max-width: 600px;
  margin: 0 20px;
  display: flex; /* Ensure content aligns properly */
  justify-content: center; /* Center the search bar */
}

.right-section {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0; /* Prevent shrinking */
  justify-content: flex-end; /* Align to right */
}

.language-options, .currency-options {
  display: flex;
  gap: 10px;
}

.lang-option, .currency-option {
  cursor: pointer;
  color: #888;
  font-size: 14px;
  padding: 2px 5px;
}

.lang-option.active, .currency-option.active {
  color: #333;
  font-weight: bold;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.cart-icon, .user-icon {
  position: relative;
}

.cart-icon img, .user-icon img {
  width: 24px;
  height: 24px;
}

/* Mobile Header Styles */
.mobile-header {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.mobile-top-row {
  display: flex;
  justify-content: space-between; /* This creates space between left and right groups */
  align-items: center;
  padding: 10px 24px; /* Match this padding with hamburger position */
  height: 50px;
  width: 100%;
  box-sizing: border-box;
}

.mobile-left-group {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 0; /* Remove any potential left padding */
  position: relative; /* Enable positioning context */
}

.mobile-right-group {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: flex-end; /* Align items to the right */
  margin-left: auto; /* Push to the right edge */
}

.mobile-search-row {
  padding: 0 24px 10px; /* Match left/right padding with mobile-top-row */
  width: 100%;
  box-sizing: border-box; /* Ensures padding doesn't add to width */
}

.search-container-mobile {
  display: flex;
  width: 100%;
  background-color: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box; /* Ensures padding doesn't add to width */
}

.full-width-search {
  width: 100% !important;
  min-width: 100% !important; /* Force it to take full width */
  flex: 1;
  box-sizing: border-box;
}

/* Make mobile search bar full width */
.mobile-header .my-search-bar {
  width: 100% !important;
  flex: 1;
}

.search-button {
  background-color: #f0c14b;
  border: none;
  width: 45px;
  display: none; /* Hide the extra search button */
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.search-button img {
  width: 18px;
  height: 18px;
}

.mobile-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-icon img {
  width: 22px;
  height: 22px;
}

/* Breadcrumbs Styling */
.breadcrumbs-row {
  width: 100%;
  min-height: 25px;
  padding: 5px 10px;
  box-sizing: border-box;
  background-color: #f9f9f9;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.breadcrumbs-container {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none; /* For Firefox */
  -ms-overflow-style: none; /* For IE and Edge */
  display: block !important;
}

.breadcrumbs-container::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}

/* Logo Styles */
.logo-container {
  height: 40px;
  display: flex;
  align-items: center;
}

.logo {
  height: 25px;
}

/* Hamburger Menu */
.hamburger-container {
  cursor: pointer;
  padding-left: 0; /* Remove any potential left padding */
  display: flex;
  align-items: center;
  margin-left: 0; /* Remove any margin that might offset the hamburger */
  position: relative; /* Enable positioning context */
}

.hamburger-menu {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 18px;
  padding: 0;
  margin: 0;
}

.hamburger-menu span {
  display: block;
  width: 20px;
  height: 2px;
  background-color: #333333;
  transition: 0.2s;
  margin: 2px 0;
}

/* Language Selector Styles */
.lang-code {
  font-size: 12px;
  color: #333333;
  font-weight: 500;
}

.region-icon-container {
  width: 22px;
  height: 22px;
  border: 1px solid #333333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.region-icon {
  width: 14px;
  height: 14px;
}

.region-selector-mobile {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

/* Cart Badge */
.cart-count {
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 1px 5px;
  font-size: 9px;
  position: absolute;
  top: -5px;
  right: -8px;
}

/* Region Dropdown */
.region-dropdown {
  position: absolute;
  top: 50px;
  right: 10px;
  width: 150px;
  background-color: white;
  z-index: 101;
  padding: 15px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.region-option {
  padding: 8px 0;
  cursor: pointer;
}

.region-option:hover {
  text-decoration: underline;
}

/* Mega Menu - New Zoom-Responsive Approach */
.dropdown-mega-menu {
  position: absolute;
  top: var(--menu-top-position, 110px);
  left: 0;
  right: 0;
  background-color: white;
  z-index: 99;
  width: 100%;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid #e0e0e0;
  overflow-y: auto;
  max-height: calc(100vh - var(--menu-top-position, 110px) - 20px);
  display: flex;
  flex-direction: column;
}

/* Container for menu content - with position property */
.menu-container {
  display: flex;
  flex-direction: column;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  padding: 0;
  position: relative; /* Enable positioning context */
}

/* Fix menu categories for zoom-responsive alignment */
.menu-categories {
  width: 100%;
  background-color: #f8f8f8;
  border-right: 0;
  border-bottom: 1px solid #e0e0e0;
  padding: 0;
  position: relative;
}

/* Fix zoom responsiveness with matching left position */
.menu-category {
  padding: 12px 24px; /* Default padding */
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
  border-bottom: 1px solid #eaeaea;
  position: relative;
}

.menu-category:hover,
.menu-category.active {
  background-color: #ffffff;
  border-left-color: #0066cc;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* Category Icons */
.category-icon-placeholder {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
}

.solar-color {
  background-color: #ffd700; /* Gold for solar */
}

.ev-color {
  background-color: #3498db; /* Blue for EV */
}

.portable-color {
  background-color: #e74c3c; /* Red for portable */
}

.generator-color {
  background-color: #27ae60;
}

.electrical-color {
  background-color: #9b59b6; /* Purple for electrical */
}

/* Subcategories */
.menu-subcategories {
  width: 100%;
  background-color: white;
  padding: 15px 24px; /* Match padding for alignment */
  overflow-y: auto;
}

.subcategory-panel {
  display: flex;
  flex-direction: column;
}

/* Featured section is hidden on mobile */
.featured-category {
  display: none;
}

/* Product Grid Style */
.subcategory-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  width: 100%;
}

/* Product Card Style */
.subcategory-item {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s ease;
  overflow: hidden;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.subcategory-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.subcategory-image {
  width: 100%;
  height: 80px;
  object-fit: contain;
  padding: 8px;
}

/* Helper classes */
.profile-name {
  display: none;
}

.mobile-only {
  display: block;
}

/* Language Options in Menu */
.language-options {
  padding: 15px;
  border-top: 1px solid #eee;
}

.language-options h3 {
  color: #333; /* Dark color for the header */
  font-size: 16px;
  margin-bottom: 10px;
}

.language-option {
  display: flex;
  padding: 8px 15px;
  cursor: pointer;
}

.language-option .language {
  color: #000; /* Black text for better visibility */
  font-weight: normal;
}

.language-option:hover {
  background-color: #f5f5f5;
}

/* Menu Top Section */
.menu-top-section {
  padding: 10px 15px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #e0e0e0;
}

/* Tesla-style language selector at bottom of dropdown menu */
.tesla-language-selector {
  width: 100%;
  border-top: 1px solid #e0e0e0;
  padding: 0;
  margin-top: auto; /* Push to bottom */
}

.language-selector-item {
  display: flex;
  align-items: center;
  padding: 16px 24px; /* Match padding with menu-category */
  cursor: pointer;
  position: relative;
  border-bottom: 1px solid #f0f0f0;
}

.language-selector-item:hover {
  background-color: #f9f9f9;
}

.globe-icon-container {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.globe-icon {
  width: 20px;
  height: 20px;
}

.language-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.country-name {
  color: #171a20;
  font-size: 15px;
  font-weight: 500;
}

.language-name {
  font-size: 12px;
  color: #5c5e62;
  margin-top: 2px;
}

.selector-indicator {
  width: 16px;
  height: 16px;
  border: 2px solid #d0d1d2;
  border-radius: 50%;
  margin-left: auto;
}

.selector-indicator.active {
  border-color: #3e6ae1;
  background-color: #3e6ae1;
}

/* Desktop Styles - IMPORTANT: Restore layout from Image 1 */
@media (min-width: 768px) {
  .menu-bottom-section.mobile-only {
    display: none !important;
  }
  
  .mobile-header {
    display: none !important; /* Ensure mobile header is hidden */
  }
  
  .desktop-header {
    display: block !important;
    width: 100% !important;
  }
  
  .mobile-only {
    display: none !important;
  }
  
  /* Desktop Browser-Style Header (from Image 1) */
  .desktop-content {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 0 24px !important;
    height: 60px !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  
  /* Remove separate search row */
  .header-search-row {
    display: none !important;
  }
  
  /* Structure header into three sections */
  .left-section {
    display: flex !important;
    align-items: center !important;
    gap: 20px !important;
    width: auto !important;
    flex-shrink: 0 !important;
  }
  
  .center-section {
    flex: 1 !important;
    display: flex !important;
    justify-content: center !important;
    max-width: 600px !important;
    margin: 0 20px !important;
  }
  
  .search-container {
    width: 100% !important;
    max-width: none !important;
  }
  
  .right-section {
    display: flex !important;
    align-items: center !important;
    gap: 20px !important;
    width: auto !important;
    flex-shrink: 0 !important;
    margin-left: auto !important;
  }
  
  /* Add language/region options to desktop header */
  .right-section .language-options,
  .right-section .currency-options {
    display: flex !important;
    gap: 15px !important;
    margin-right: 15px !important;
  }
  
  /* Icon Links */
  .icon-links {
    display: flex !important;
    align-items: center !important;
    gap: 20px !important;
    list-style: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  .header-item {
    display: flex !important;
    align-items: center !important;
    position: relative !important;
  }
  
  .icon-text {
    display: flex !important;
    align-items: center !important;
    text-decoration: none !important;
    color: #333333 !important;
  }
  
  .icon-text img {
    width: 22px !important;
    height: 22px !important;
  }
  
  /* Search container - single search on desktop */
  .search-inner-container {
    display: flex !important;
    align-items: center !important;
    width: 100% !important;
    background-color: #f8f8f8 !important;
    border-radius: 8px !important;
    overflow: hidden !important;
  }
  
  .my-search-bar {
    flex: 1 !important;
    height: 40px !important;
    width: 100% !important;
  }
  
  /* Ensure breadcrumbs display properly */
  .breadcrumbs-row {
    margin-top: 60px !important; /* Match desktop header height */
  }
  
  /* Menu dropdown positioning */
  .dropdown-mega-menu {
    top: 60px !important;
  }
  
  /* Ensure language selector in mega menu is visible on desktop */
  .dropdown-mega-menu .tesla-language-selector {
    display: block !important; /* Show in dropdown menu */
    margin-top: auto !important; /* Push to bottom */
    border-top: 1px solid #e0e0e0 !important;
  }
  
  /* Make language selector items visible */
  .dropdown-mega-menu .language-selector-item {
    display: flex !important;
    align-items: center !important;
    padding: 16px 24px !important;
    cursor: pointer !important;
    border-bottom: 1px solid #f0f0f0 !important;
  }
  
  /* Fix position of language selector in desktop mode */
  .dropdown-mega-menu .tesla-language-selector {
    position: relative !important;
    z-index: 100 !important;
    width: 100% !important;
  }
  
  .menu-container {
    display: flex !important;
    flex-direction: row !important;
    max-width: 1280px !important;
    margin: 0 auto !important;
  }
  
  .menu-categories {
    width: 280px !important;
    border-right: 1px solid #e0e0e0 !important;
    border-bottom: 0 !important;
  }
  
  .menu-subcategories {
    flex: 1 !important;
  }
  
  .subcategory-list {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
    flex: 1 !important;
  }
  
  .featured-category {
    display: block !important;
    width: 30% !important;
    padding: 0 0 0 20px !important;
  }
  
  .subcategory-panel {
    flex-direction: row !important;
  }
  
  /* Fix for duplicated content */
  .desktop-header + .desktop-header,
  .desktop-header ~ .desktop-header,
  body > .desktop-header:not(:first-child),
  .header-container + .header-container {
    display: none !important;
  }
}

@media (min-width: 1024px) {
  .icon-text img {
    width: 24px !important;
    height: 24px !important;
  }
  
  .profile-name {
    font-size: 14px !important;
    display: inline-block !important;
    margin-left: 5px !important;
  }
  
  .region-icon-container {
    width: 24px !important;
    height: 24px !important;
  }
  
  .region-icon {
    width: 16px !important;
    height: 16px !important;
  }
  
  .subcategory-image {
    height: 120px !important;
  }
  
  .subcategory-list {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
  }
  
  .category-header h3 {
    font-size: 16px !important;
  }
}

/* Landscape orientation fix */
@media (orientation: landscape) and (max-width: 932px) {
  .mobile-header {
    height: 90px !important;
  }
  
  .mobile-top-row {
    height: 45px !important;
  }
  
  .dropdown-mega-menu {
    display: flex;
    flex-direction: column;
    /* Keep your existing styles */
  }
  
  .region-dropdown {
    top: 45px !important;
  }
  
  /* Adjust breadcrumbs for landscape */
  .breadcrumbs-row {
    margin-top: 90px !important;
  }
}

/* Fix for various mobile devices */
@media (max-width: 767px) {
  /* Force mobile header to use 100% width for search bar */
  .search-container-mobile {
    width: 100% !important;
  }
  
  .mobile-header .my-search-bar {
    width: 100% !important;
  }
  
  /* Ensure proper spacing for product pages on mobile */
  .product-page-container {
    padding-top: 110px !important;
  }
  
  /* Breadcrumbs positioning for mobile */
  .breadcrumbs-row {
    margin-top: 90px !important;
  }
  
  .mobile-right-group {
    gap: 10px !important;
    display: flex !important;
  }
  
  .mobile-icon {
    position: relative;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-direction: row !important; /* Make sure it's horizontal */
    gap: 5px; /* Add space between language code and icon */
  }

  /* Make sure items in top row are correctly spaced */
  .mobile-top-row {
    display: flex !important;
    justify-content: space-between !important; /* Key for proper spacing */
    width: 100% !important;
    box-sizing: border-box !important;
    padding: 10px 24px !important; /* Ensure consistency with hamburger menu */
  }

  /* Ensure right group takes proper space */
  .mobile-right-group {
    margin-left: auto !important; /* Push to right side */
    width: auto !important; /* Don't restrict width */
    flex-shrink: 0; /* Prevent shrinking */
  }

  /* Reset any width constraints on left group */
  .mobile-left-group {
    width: auto !important;
    flex-shrink: 0; /* Prevent shrinking */
    padding-left: 0 !important; /* Remove any padding that might offset alignment */
  }
  
  .mobile-icon img {
    width: 20px !important;
    height: 20px !important;
  }
  
  .region-icon-container {
    width: 18px !important;
    height: 18px !important;
  }
  
  .lang-code {
    font-size: 11px !important;
  }
  
  /* Show Tesla-style language selector on mobile */
  .tesla-language-selector {
    display: block !important;
  }
  
  /* Keep desktop header hidden on mobile */
  .desktop-header {
    display: none !important;
  }
  
  /* Extra specificity to ensure proper alignment of menu items */
  .dropdown-mega-menu .menu-category {
    padding-left: 24px !important;
    padding-right: 24px !important;
  }
  
  .dropdown-mega-menu .language-selector-item {
    padding-left: 24px !important;
    padding-right: 24px !important;
  }
  
  .dropdown-mega-menu .menu-subcategories {
    padding-left: 24px !important;
    padding-right: 24px !important;
  }
  
  /* Critical fix: Ensure hamburger has no offset */
  .hamburger-container {
    margin-left: 0 !important;
    padding-left: 0 !important;
  }
  
  /* Ensure search row padding matches */
  .mobile-search-row {
    padding: 0 24px 10px !important;
  }
  
  /* Zoom-responsive approach for menu - fix for all zoom levels */
  .hamburger-container::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 1px;
    opacity: 0;
  }
  
  /* Make menu items align with hamburger at all zoom levels */
  .dropdown-mega-menu .menu-categories::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 1px;
    background-color: transparent;
  }
}

/* Support for extra small devices */
@media (max-width: 320px) {
  .mobile-right-group {
    gap: 8px !important;
  }
  
  .mobile-left-group {
    gap: 5px !important;
  }
  
  .logo {
    height: 20px !important;
  }
  
  .hamburger-menu span {
    width: 18px !important;
  }
  
  /* Even on smallest screens, maintain hamburger alignment */
  .mobile-top-row {
    padding: 8px 24px !important;
  }
  
  .mobile-search-row {
    padding: 0 24px 8px !important;
  }
}

/* Update header height variable for JavaScript use */
:root {
  --header-height: 110px; /* Default for mobile */
  --header-height-desktop: 60px; /* Desktop value */
  --menu-top-position: 60px; /* For mega menu positioning */
  --hamburger-padding: 24px; /* Store hamburger padding for reference */
}

/* Force visibility for mobile elements */
@media (max-width: 767px) {
  .mobile-header {
    display: flex !important;
    flex-direction: column !important;
  }
  
  .desktop-header {
    display: none !important;
  }
}

/* Fix for zoom scaling variations */
@media (min-width: 320px) and (max-width: 767px) {
  /* Create consistent alignment across zoom levels */
  .hamburger-container {
    position: relative;
  }
  
  /* Establish fixed position reference */
  .mobile-left-group::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 1px;
    width: 1px;
    opacity: 0;
  }
  
  /* Scale-independent menu alignment */
  .dropdown-mega-menu .menu-category,
  .dropdown-mega-menu .language-selector-item,
  .dropdown-mega-menu .menu-subcategories {
    box-sizing: border-box !important;
  }
}
</style>