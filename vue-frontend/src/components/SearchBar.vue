<template>
  <div class="search-container" ref="searchContainer">
    <div class="search-input-wrapper" style="width: 100%">
      <input
        type="text"
        :placeholder="t('common.search')"
        v-model="searchTerm"
        @input="onInput"
        @keydown.enter.prevent="onEnter"
        @keydown.down.prevent="highlightNextSuggestion"
        @keydown.up.prevent="highlightPreviousSuggestion"
        aria-label="Search Products"
        @focus="onInput"
        class="search-input"
        style="width: 100%; min-width: 216px"
      />
      <div class="search-icon-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="search-icon"
        >
          <path
            d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
          />
        </svg>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showDropdown" class="results-dropdown">
        <!-- Auto-suggestions section -->
        <div
          v-if="searchResult.length && searchTerm.length >= minSuggestionLength"
          class="suggestions-section"
        >
          <h4 class="suggestions-title">Suggestions</h4>
          <ul class="suggestions-list flex flex-col px-20">
            <li
              class="flex jutify-between w-full suggestions-item"
              v-for="(suggestion, index) in searchResult"
              :key="'sugg-' + index"
            >
              <router-link
                class="flex jutify-between w-full items-center"
                :to="`/product/${suggestion.id}`"
              >
                <div class="flex items-center">
                  <img
                    class="suggestion-img"
                    :src="suggestion.image"
                    :alt="suggestion.defaultName || 'Product Image'"
                  />
                  <div class="flex flex-col">
                    <h5 class="w-[200px] break-all">
                      {{ $t(suggestion.nameKey) }}
                    </h5>
                    <span class="mt-10">{{ suggestion.price }} грн</span>
                  </div>
                </div>
              </router-link>
            </li>
            <!-- <li
              v-for="(suggestion, index) in autoSuggestions"
              :key="'sugg-' + index"
              @mousedown="applySuggestion(suggestion)"
              :class="[
                'suggestion-item',
                { highlighted: highlightedIndex === index },
              ]"
            >
              <div class="suggestion-content">
                <span class="suggestion-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
                <span v-html="highlightMatch(suggestion, searchTerm)"></span>
              </div>
            </li> -->
          </ul>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="dropdown-message">
          <div class="spinner"></div>
          <span>Searching...</span>
        </div>

        <!-- No results message -->
        <div
          v-else-if="noResults && !autoSuggestions.length"
          class="dropdown-message"
        >
          No results found for "{{ searchTerm }}"
        </div>

        <!-- Product results -->
        <div v-if="filteredResults.length" class="products-section">
          <h4 class="products-title" v-if="autoSuggestions.length">Products</h4>
          <ul class="products-list">
            <li
              v-for="product in filteredResults"
              :key="product.id"
              @mousedown="selectProduct(product)"
              class="dropdown-item"
            >
              <div class="product-info">
                <img
                  :src="product.image || '/default-product-image.png'"
                  :alt="product.name"
                  class="product-image"
                  @error="handleImageError"
                />
                <div class="product-details">
                  <span class="product-name">{{ product.name }}</span>
                  <div class="product-meta">
                    <span
                      class="product-price"
                      v-if="product.price !== undefined"
                    >
                      ${{
                        typeof product.price === "number"
                          ? product.price.toFixed(2)
                          : product.price
                      }}
                    </span>
                    <span
                      class="product-stock"
                      v-if="product.stock !== undefined"
                    >
                      {{ product.stock > 0 ? "In Stock" : "Out of Stock" }}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import debounce from "lodash.debounce";
import { useRouter } from "vue-router";
import productService from "@/services/productService";
import { useProductsStore } from "@/stores/products";

export default {
  name: "SearchBar",
  props: {
    allProducts: {
      type: Array,
      required: true,
    },
    // Optional prop to customize search behavior
    searchKeys: {
      type: Array,
      default: () => ["name", "description", "sku", "category"], // Expanded default search keys
    },
    // Minimum characters to trigger search
    minSearchLength: {
      type: Number,
      default: 2,
    },
    // Product detail route name or pattern
    productRoute: {
      type: String,
      default: "/product/",
    },
    // Maximum number of suggestions to show
    maxSuggestions: {
      type: Number,
      default: 5,
    },
    // Minimum characters to show suggestions
    minSuggestionLength: {
      type: Number,
      default: 1,
    },
    // Whether to only show in-stock items
    onlyShowInStock: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["search-selected", "search-performed", "suggestion-selected"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const router = useRouter();
    const store = useProductsStore();

    const searchTerm = ref("");
    const filteredResults = ref([]);
    const autoSuggestions = ref([]);
    const searchResult = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const showDropdown = ref(false);
    const searchContainer = ref(null);
    const noResults = ref(false);
    const highlightedIndex = ref(-1);
    const productList = ref([]);
    const allSearchableProducts = ref([]);
    const isInitialLoading = ref(true);
    const allProducts = computed(() => {
      return store.getProducts;
    });

    // Choose which products list to use
    const effectiveProducts = computed(() => {
      // If we have products from the service, use those
      if (productList.value.length > 0) {
        return productList.value;
      }
      // Otherwise use the props.allProducts as fallback
      return props.allProducts;
    });

    // Log for debugging
    // watch(
    //   () => props.allProducts,
    //   (newProducts) => {
    //     console.log(`SearchBar received ${newProducts?.length || 0} products`);
    //   },
    //   { immediate: true }
    // );

    // Generate auto-suggestions based on search term
    const generateSuggestions = (query) => {
      if (query.length < props.minSuggestionLength) {
        autoSuggestions.value = [];
        return;
      }

      // Set for collecting unique suggestions
      const suggestionsSet = new Set();
      const normalizedQuery = query.trim().toLowerCase();

      // Check if products array is valid
      if (!effectiveProducts.value || !Array.isArray(effectiveProducts.value)) {
        return;
      }

      // Build suggestions from product data
      effectiveProducts.value.forEach((product) => {
        if (!product || typeof product !== "object") return;

        // Skip out-of-stock items if configured
        if (
          props.onlyShowInStock &&
          product.stock !== undefined &&
          product.stock <= 0
        ) {
          return;
        }

        // If we have a searchableText field, use it for suggestions too
        if (product.searchableText) {
          const words = product.searchableText.split(/\s+/);
          words.forEach((word) => {
            if (word.length > 3 && word.includes(normalizedQuery)) {
              suggestionsSet.add(word);
            }
          });
        }

        // Generate suggestions from each searchable field
        props.searchKeys.forEach((key) => {
          // Also check language-specific fields
          const normalKey = key;
          const ukKey = `${key}Uk`;
          const plKey = `${key}Pl`;
          [normalKey, ukKey, plKey].forEach((fieldKey) => {
            if (!(fieldKey in product)) return;

            const value = product[fieldKey];
            if (value === null || value === undefined) return;
            const stringValue = String(value).toLowerCase();

            // Add exact matches
            if (stringValue.includes(normalizedQuery)) {
              suggestionsSet.add(stringValue);
            }
            // Add word-based matches for longer fields
            if (fieldKey.includes("name") || fieldKey.includes("description")) {
              const words = stringValue.split(/\s+/);
              words.forEach((word) => {
                if (word.length > 3 && word.includes(normalizedQuery)) {
                  suggestionsSet.add(word);
                }
              });
            }
          });
        });
      });

      // Convert to array, sort by relevance, limit number
      let suggestions = Array.from(suggestionsSet)
        .filter((sugg) => sugg.includes(normalizedQuery))
        .sort((a, b) => {
          // Prioritize suggestions that start with the query
          const aStartsWith = a.startsWith(normalizedQuery);
          const bStartsWith = b.startsWith(normalizedQuery);

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;

          // Then sort by length (shorter = better match)
          return a.length - b.length;
        })
        .slice(0, props.maxSuggestions);

      // Ensure suggestions aren't too long
      suggestions = suggestions.map((sugg) =>
        sugg.length > 50 ? sugg.substring(0, 50) + "..." : sugg
      );

      autoSuggestions.value = suggestions;
      highlightedIndex.value = -1; // Reset highlighted suggestion
    };

    // Enhanced search function with multiple key support
    const performSearch = debounce(() => {
      const query = searchTerm.value.trim().toLowerCase();
      const lang = localStorage.getItem("userLocale") || "en"; // Get language from localStorage

      // Generate suggestions first
      generateSuggestions(query);

      // Reset state
      noResults.value = false;

      // Clear results if search is too short
      if (query.length < props.minSearchLength) {
        filteredResults.value = [];
        isLoading.value = false;
        return;
      }

      isLoading.value = true;
      error.value = null;

      try {
        console.log(
          `Searching for: "${query}" in ${
            effectiveProducts.value?.length || 0
          } products with language: ${lang}`
        );

        // Check if products array is valid
        if (
          !effectiveProducts.value ||
          !Array.isArray(effectiveProducts.value)
        ) {
          console.error("Products not available:", effectiveProducts.value);
          throw new Error("Product data is not available");
        }

        // Filter products using the searchableText field if available
        const results = effectiveProducts.value.filter((product) => {
          // Skip if product is invalid
          if (!product || typeof product !== "object") {
            return false;
          }

          // Skip out-of-stock items if configured
          if (
            props.onlyShowInStock &&
            product.stock !== undefined &&
            product.stock <= 0
          ) {
            return false;
          }

          // Use searchableText if available (it contains all languages)
          if (product.searchableText) {
            return product.searchableText.includes(query);
          }

          // Fallback to the original search method
          return props.searchKeys.some((key) => {
            if (!(key in product)) return false;
            const value = product[key];
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().includes(query);
          });
        });

        console.log(`Found ${results.length} results`);

        // Set no results flag
        noResults.value = results.length === 0;

        // Limit results to prevent performance issues
        filteredResults.value = results.slice(0, 10);

        // Emit search event
        emit("search-performed", {
          term: query,
          lang: lang,
          resultsCount: results.length,
          limitedResults: filteredResults.value,
        });
      } catch (err) {
        console.error("Search error:", err);
        error.value = t("search_error") || "Error searching products.";
        filteredResults.value = [];
      } finally {
        isLoading.value = false;
      }
    }, 300);

    // Watch for changes in search term
    // watch(searchTerm, (newTerm) => {
    //   // If term is cleared, reset everything
    //   if (!newTerm.trim()) {
    //     filteredResults.value = [];
    //     autoSuggestions.value = [];
    //     noResults.value = false;
    //     return;
    //   }

    //   performSearch();
    // });

    // Product selection method
    const selectProduct = (product) => {
      if (!product || !product.id) {
        console.error("Invalid product selected:", product);
        return;
      }

      console.log("Product selected:", product.name, product.id);
      emit("search-selected", product);

      try {
        // Navigate to product detail
        const routePath = `${props.productRoute}${product.id}`;
        router.push(routePath);
      } catch (err) {
        console.error("Navigation error:", err);
        error.value = "Error navigating to product.";
      }

      // Reset search state
      searchTerm.value = "";
      filteredResults.value = [];
      autoSuggestions.value = [];
      showDropdown.value = false;
    };

    // Apply suggestion to search term
    const applySuggestion = (suggestion) => {
      searchTerm.value = suggestion;
      performSearch();
      emit("suggestion-selected", suggestion);
    };

    // Highlight matched text in suggestions
    const highlightMatch = (text, query) => {
      if (!query || !text) return text;

      const regex = new RegExp(`(${query.trim()})`, "gi");
      return text.replace(regex, '<strong class="highlight">$1</strong>');
    };

    // Keyboard navigation for suggestions
    const highlightNextSuggestion = () => {
      const maxIndex = autoSuggestions.value.length - 1;
      if (maxIndex < 0) return;

      highlightedIndex.value =
        highlightedIndex.value < maxIndex ? highlightedIndex.value + 1 : 0;
    };

    const highlightPreviousSuggestion = () => {
      const maxIndex = autoSuggestions.value.length - 1;
      if (maxIndex < 0) return;

      highlightedIndex.value =
        highlightedIndex.value > 0 ? highlightedIndex.value - 1 : maxIndex;
    };

    // Focus handler
    const onFocus = () => {
      if (searchTerm.value.trim().length >= props.minSuggestionLength) {
        generateSuggestions(searchTerm.value);
      }

      if (searchTerm.value.trim().length >= props.minSearchLength) {
        performSearch();
      }

      showDropdown.value = true;
    };

    const search = () => {
      const result = [];
      if (searchTerm.value.length >= 2) {
        allProducts.value.forEach((product) => {
          if (
            product.defaultName
              .toLowerCase()
              .includes(searchTerm.value.trim().toLowerCase()) ||
            product.brand
              .toLowerCase()
              .includes(searchTerm.value.trim().toLowerCase())
          ) {
            result.push(product);
          }
        });
        const arr = "Сонячна панель забор";
        searchResult.value = result;
        // const result = allProducts.value;
      }
    };

    // Show dropdown on input
    const onInput = () => {
      showDropdown.value = true;
      // If empty search term, clear results
      search();
      // if (!searchTerm.value.trim()) {
      //   filteredResults.value = [];
      //   autoSuggestions.value = [];
      //   noResults.value = false;
      // }
    };

    // Handle enter key press
    const onEnter = () => {
      // If a suggestion is highlighted, apply it
      if (
        highlightedIndex.value >= 0 &&
        autoSuggestions.value.length > highlightedIndex.value
      ) {
        applySuggestion(autoSuggestions.value[highlightedIndex.value]);
        return;
      }

      // Otherwise select the first product result
      if (filteredResults.value.length > 0) {
        selectProduct(filteredResults.value[0]);
      } else if (searchTerm.value.trim().length >= props.minSearchLength) {
        // Emit search event for enter key with no selection
        emit("search-performed", {
          term: searchTerm.value.trim(),
          resultsCount: 0,
          action: "enter-key",
        });
      }
    };

    // Handle image loading errors
    const handleImageError = (event) => {
      event.target.src = "/default-product-image.png";
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (
        searchContainer.value &&
        !searchContainer.value.contains(event.target)
      ) {
        showDropdown.value = false;
      }
    };

    // Add and remove click listeners
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
      autoSuggestions.value = [];
      console.log(
        "SearchBar mounted with products:",
        props.allProducts?.length || 0
      );

      // try {
      //   isLoading.value = true;
      //   // Load products from service
      //   productService.getAllProducts().then(products => {
      //     productList.value = products;
      //     console.log('Loaded', productList.value.length, 'products from service');
      //     isLoading.value = false;
      //   }).catch(error => {
      //     console.error('Error loading products:', error);
      //     isLoading.value = false;
      //   });

      //   // Load searchable products data
      //   isInitialLoading.value = true;
      //   productService.getAllProductsForSearch().then(products => {
      //     allSearchableProducts.value = products;
      //     console.log(`Loaded ${products.length} multilingual products for search`);
      //     isInitialLoading.value = false;
      //   }).catch(error => {
      //     console.error('Error loading products for search:', error);
      //     isInitialLoading.value = false;
      //   });
      // } catch (error) {
      //   console.error('Error in onMounted:', error);
      //   isLoading.value = false;
      //   isInitialLoading.value = false;
      // }
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    // Add this computed property
    const effectiveProductsList = computed(() => {
      if (
        allSearchableProducts.value &&
        allSearchableProducts.value.length > 0
      ) {
        return allSearchableProducts.value;
      }
      return props.allProducts || [];
    });

    return {
      searchTerm,
      filteredResults,
      autoSuggestions,
      searchResult,
      isLoading,
      error,
      selectProduct,
      applySuggestion,
      highlightMatch,
      onInput,
      onEnter,
      onFocus,
      showDropdown,
      searchContainer,
      noResults,
      handleImageError,
      highlightedIndex,
      highlightNextSuggestion,
      highlightPreviousSuggestion,
      minSuggestionLength: props.minSuggestionLength,
      t,
    };
  },
};
</script>

<style scoped>
/* Inherit and enhance existing styles */
.search-container {
  position: relative;
  width: 100%;
  max-width: 216px;
  margin: 0;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 216px;
  padding: 7px 13px 7px 45px;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  outline: none;
  font-size: 18px;
  background-color: #ffffff;
  color: #333333;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.search-icon-wrapper {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-icon {
  width: 24px;
  height: 24px;
  fill: #888;
  transition: fill 0.3s ease;
}

.search-input:focus + .search-icon-wrapper .search-icon {
  fill: #007bff;
}

.results-dropdown {
  position: absolute;
  top: 100%;
  left: -25%;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 15px 15px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: -1px;
  width: 375px;
  border-radius: 22px;
}

.suggestions-section,
.products-section {
  padding: 0;
}

.suggestions-title,
.products-title {
  font-size: 14px;
  color: #666;
  margin: 0;
  padding: 12px 15px 8px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eaeaea;
}

.suggestions-list,
.products-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.suggestion-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 15px;
  color: #333;
}

.suggestion-item.highlighted {
  background-color: #f0f7ff;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

.suggestion-content {
  display: flex;
  align-items: center;
}

.suggestion-icon {
  color: #888;
  margin-right: 10px;
  display: flex;
  align-items: center;
}

.highlight {
  color: #007bff;
  font-weight: 600;
}

.dropdown-item {
  padding: 12px 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-message {
  padding: 20px;
  text-align: center;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.product-info {
  display: flex;
  align-items: center;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
}

.product-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  color: #007bff;
  font-size: 0.9em;
}

.product-stock {
  font-size: 0.8em;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: #e8f5e9;
  color: #2e7d32;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 10px;
  background-color: #ffdddd;
  color: #ff0000;
  border: 1px solid #ff0000;
  border-top: none;
  text-align: center;
  z-index: 1001;
}

/* Fade transition for dropdown */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (min-width: 1200px) {
  .search-container {
    max-width: 100%; /* Keep at 100% on large screens */
  }
}

@media (max-width: 767px) {
  .search-input {
    font-size: 16px;
    padding: 12px 35px 12px 15px;
    min-width: unset !important;
  }

  .search-icon {
    width: 20px;
    height: 20px;
  }

  .product-image {
    width: 40px;
    height: 40px;
  }

  .suggestion-item {
    padding: 8px 12px;
    font-size: 14px;
  }
}
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.suggestion-img {
  width: 100px;
  height: auto;
}
.items-center {
  align-items: center;
}
.jutify-between {
  justify-content: space-between;
}
.w-full {
  width: 100%;
}
.px-20 {
  padding: 0px 20px;
}
.suggestions-item {
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: 4px;
}
.suggestions-item a {
  color: #333;
}
.suggestions-item:hover {
  border: 1px solid gray;
  border-radius: 4px;
}
</style>
