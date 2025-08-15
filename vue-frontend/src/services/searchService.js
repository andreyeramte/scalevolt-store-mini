// FILE: src/services/searchService.js
// Comprehensive search service with debouncing, fuzzy matching, and real-time suggestions

import axios from 'axios';
import { debounce } from 'lodash';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

class SearchService {
  constructor() {
    this.searchCache = new Map();
    this.recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    this.searchHistory = new Set();
  }

  // Debounced search function
  debouncedSearch = debounce(async (query, options = {}) => {
    return this.performSearch(query, options);
  }, 300);

  // Perform actual search
  async performSearch(query, options = {}) {
    const {
      language = 'en',
      limit = 20,
      includeCategories = true,
      includeSuggestions = true
    } = options;

    try {
      // Check cache first
      const cacheKey = `${query}-${language}-${limit}`;
      if (this.searchCache.has(cacheKey)) {
        return this.searchCache.get(cacheKey);
      }

      // Build search URL
      const searchParams = new URLSearchParams({
        q: query,
        lang: language,
        limit: limit.toString()
      });

      console.log('🔍 Performing search:', query, 'with params:', searchParams.toString());
      const response = await axios.get(`${API_BASE_URL}/products/search?${searchParams}`);
      
      console.log('✅ Search results:', response.data);
      
      // Add to cache
      this.searchCache.set(cacheKey, response.data);
      
      // Add to recent searches
      this.addToRecentSearches(query);
      
      return response.data;
    } catch (error) {
      console.error('❌ Search error:', error);
      
      // Fallback to local search if API fails
      console.log('🔄 Falling back to local search...');
      return this.fallbackLocalSearch(query, options);
    }
  }

  // Fuzzy search implementation
  fuzzySearch(query, products) {
    if (!query) return products;

    const searchTerm = query.toLowerCase();
    const results = [];

    products.forEach(product => {
      let score = 0;
      const searchableFields = [
        product.name,
        product.description,
        product.brand,
        product.category,
        product.sku
      ].filter(Boolean);

      searchableFields.forEach(field => {
        const fieldLower = field.toLowerCase();
        
        // Exact match gets highest score
        if (fieldLower === searchTerm) {
          score += 100;
        }
        // Starts with gets high score
        else if (fieldLower.startsWith(searchTerm)) {
          score += 50;
        }
        // Contains gets medium score
        else if (fieldLower.includes(searchTerm)) {
          score += 25;
        }
        // Partial word match gets lower score
        else {
          const words = fieldLower.split(' ');
          words.forEach(word => {
            if (word.startsWith(searchTerm)) {
              score += 10;
            } else if (word.includes(searchTerm)) {
              score += 5;
            }
          });
        }
      });

      if (score > 0) {
        results.push({ ...product, searchScore: score });
      }
    });

    // Sort by score and return top results
    return results
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 10);
  }

  // Fallback local search when API fails
  async fallbackLocalSearch(query, options = {}) {
    const { language = 'en', limit = 20 } = options;
    
    try {
      // Get all products from the store or API
      const response = await axios.get(`${API_BASE_URL}/products`);
      const allProducts = response.data || [];
      
      // Apply fuzzy search
      const searchResults = this.fuzzySearch(query, allProducts);
      
      // Apply language filtering
      let filteredResults = searchResults;
      if (language === 'ua') {
        filteredResults = searchResults.map(p => ({
          ...p,
          name: p.name_ua || p.name,
          description: p.description_ua || p.description
        }));
      } else if (language === 'pl') {
        filteredResults = searchResults.map(p => ({
          ...p,
          name: p.name_pl || p.name,
          description: p.description_pl || p.description
        }));
      }
      
      return filteredResults.slice(0, limit);
    } catch (error) {
      console.error('❌ Fallback search also failed:', error);
      return [];
    }
  }

  // Get search suggestions
  async getSearchSuggestions(query, language = 'en') {
    if (!query || query.length < 2) return [];

    try {
      // Get recent searches that match
      const recentMatches = this.recentSearches
        .filter(search => search.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3);

      // Get popular searches (could be from analytics)
      const popularSearches = [
        'solar panels',
        'batteries',
        'inverters',
        'ev chargers',
        'portable power'
      ].filter(search => search.toLowerCase().includes(query.toLowerCase()));

      // Get category suggestions
      const categorySuggestions = this.getCategorySuggestions(query, language);

      return [
        ...recentMatches.map(term => ({ type: 'recent', text: term })),
        ...popularSearches.map(term => ({ type: 'popular', text: term })),
        ...categorySuggestions.map(cat => ({ type: 'category', text: cat.name, id: cat.id }))
      ].slice(0, 8);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  // Get category suggestions
  getCategorySuggestions(query, language) {
    const categories = {
      en: [
        { id: 'solar-panels', name: 'Solar Panels' },
        { id: 'batteries', name: 'Batteries' },
        { id: 'inverters', name: 'Inverters' },
        { id: 'ev-chargers', name: 'EV Chargers' },
        { id: 'portable-power', name: 'Portable Power' }
      ],
      ua: [
        { id: 'solar-panels', name: 'Сонячні панелі' },
        { id: 'batteries', name: 'Акумулятори' },
        { id: 'inverters', name: 'Інвертори' },
        { id: 'ev-chargers', name: 'Зарядні станції' },
        { id: 'portable-power', name: 'Портативна енергія' }
      ],
      pl: [
        { id: 'solar-panels', name: 'Panele słoneczne' },
        { id: 'batteries', name: 'Baterie' },
        { id: 'inverters', name: 'Inwertery' },
        { id: 'ev-chargers', name: 'Stacje ładowania' },
        { id: 'portable-power', name: 'Przenośna energia' }
      ]
    };

    const langCategories = categories[language] || categories.en;
    return langCategories.filter(cat => 
      cat.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Add search to recent searches
  addToRecentSearches(query) {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(search => search !== trimmedQuery);
    
    // Add to beginning
    this.recentSearches.unshift(trimmedQuery);
    
    // Keep only last 10 searches
    this.recentSearches = this.recentSearches.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
  }

  // Get recent searches
  getRecentSearches() {
    return this.recentSearches;
  }

  // Clear search cache
  clearCache() {
    this.searchCache.clear();
  }

  // Get search analytics
  getSearchAnalytics() {
    return {
      totalSearches: this.recentSearches.length,
      recentSearches: this.recentSearches.slice(0, 5),
      cacheSize: this.searchCache.size
    };
  }

  // Advanced search with filters
  async advancedSearch(params) {
    const {
      query = '',
      category = '',
      priceRange = {},
      brand = '',
      inStock = false,
      language = 'en',
      sortBy = 'relevance',
      page = 1,
      limit = 20
    } = params;

    try {
      const searchParams = new URLSearchParams({
        q: query,
        lang: language,
        limit: limit.toString(),
        page: page.toString(),
        sort: sortBy
      });

      if (category) searchParams.append('category', category);
      if (brand) searchParams.append('brand', brand);
      if (inStock) searchParams.append('inStock', 'true');
      if (priceRange.min) searchParams.append('minPrice', priceRange.min);
      if (priceRange.max) searchParams.append('maxPrice', priceRange.max);

      const response = await axios.get(`${API_BASE_URL}/products/search?${searchParams}`);
      return response.data;
    } catch (error) {
      console.error('Advanced search error:', error);
      throw error;
    }
  }

  // Search with autocomplete
  async searchWithAutocomplete(query, options = {}) {
    const { language = 'en', includeSuggestions = true } = options;

    const [searchResults, suggestions] = await Promise.all([
      this.performSearch(query, { language, limit: 5 }),
      includeSuggestions ? this.getSearchSuggestions(query, language) : []
    ]);

    return {
      products: searchResults,
      suggestions,
      query
    };
  }

  // Search by category
  async searchByCategory(categoryId, language = 'en') {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/search`, {
        params: {
          category: categoryId,
          lang: language,
          limit: 50
        }
      });
      return response.data;
    } catch (error) {
      console.error('Category search error:', error);
      throw error;
    }
  }

  // Search by brand
  async searchByBrand(brand, language = 'en') {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/search`, {
        params: {
          brand: brand,
          lang: language,
          limit: 50
        }
      });
      return response.data;
    } catch (error) {
      console.error('Brand search error:', error);
      throw error;
    }
  }
}

// Create singleton instance
const searchService = new SearchService();

export default searchService; 