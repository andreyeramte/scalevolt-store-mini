// FILE: src/services/productService.js

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

class ProductService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api`;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log(`Making API request to: ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || 
          errorData.message || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`API response from ${endpoint}:`, data);
      
      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server');
      }
      
      throw error;
    }
  }

  // Build query string from parameters
  buildQueryString(params) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item));
      } else if (value !== null && value !== undefined) {
        searchParams.append(key, value);
      }
    });
    
    return searchParams.toString();
  }

  // Get all products with optional filters
  async getProducts(options = {}) {
    const {
      populate = [],
      filters = {},
      sort = [],
      pagination = {},
      locale = 'en',
      ...otherOptions
    } = options;

    const queryParams = {
      ...otherOptions,
      locale,
    };

    // Handle populate parameter
    if (populate.length > 0) {
      queryParams.populate = populate;
    }

    // Handle filters
    if (Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        queryParams[`filters[${key}]`] = value;
      });
    }

    // Handle sorting
    if (sort.length > 0) {
      queryParams.sort = sort;
    }

    // Handle pagination
    if (pagination.page) {
      queryParams['pagination[page]'] = pagination.page;
    }
    if (pagination.pageSize) {
      queryParams['pagination[pageSize]'] = pagination.pageSize;
    }
    if (pagination.start) {
      queryParams['pagination[start]'] = pagination.start;
    }
    if (pagination.limit) {
      queryParams['pagination[limit]'] = pagination.limit;
    }

    const queryString = this.buildQueryString(queryParams);
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Get a single product by ID
  async getProduct(id, options = {}) {
    const {
      populate = [],
      locale = 'en',
      ...otherOptions
    } = options;

    const queryParams = {
      ...otherOptions,
      locale,
    };

    if (populate.length > 0) {
      queryParams.populate = populate;
    }

    const queryString = this.buildQueryString(queryParams);
    const endpoint = `/products/${id}${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Get products by category
  async getProductsByCategory(categoryId, options = {}) {
    const filters = {
      ...options.filters,
      category: categoryId,
    };

    return this.getProducts({
      ...options,
      filters,
    });
  }

  // Search products
  async searchProducts(query, options = {}) {
    const filters = {
      ...options.filters,
      $or: [
        { 'general_information.name': { $containsi: query } },
        { 'general_information.short_description': { $containsi: query } },
        { 'general_information.description': { $containsi: query } },
      ],
    };

    return this.getProducts({
      ...options,
      filters,
    });
  }

  // Get featured products
  async getFeaturedProducts(options = {}) {
    const filters = {
      ...options.filters,
      featured: true,
    };

    return this.getProducts({
      ...options,
      filters,
    });
  }

  // Get products by price range
  async getProductsByPriceRange(minPrice, maxPrice, options = {}) {
    const filters = {
      ...options.filters,
      'pricing_and_inventory.price': {
        $gte: minPrice,
        $lte: maxPrice,
      },
    };

    return this.getProducts({
      ...options,
      filters,
    });
  }

  // Create a new product (admin only)
  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify({ data: productData }),
    });
  }

  // Update a product (admin only)
  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: productData }),
    });
  }

  // Delete a product (admin only)
  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Get product categories
  async getCategories(options = {}) {
    const queryParams = {
      populate: ['products'],
      ...options,
    };

    const queryString = this.buildQueryString(queryParams);
    const endpoint = `/categories${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Get single category
  async getCategory(id, options = {}) {
    const queryParams = {
      populate: ['products'],
      ...options,
    };

    const queryString = this.buildQueryString(queryParams);
    const endpoint = `/categories/${id}${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Upload file/image
  async uploadFile(file, options = {}) {
    const formData = new FormData();
    formData.append('files', file);
    
    if (options.ref) {
      formData.append('ref', options.ref);
    }
    if (options.refId) {
      formData.append('refId', options.refId);
    }
    if (options.field) {
      formData.append('field', options.field);
    }

    return this.request('/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    });
  }

  // Get image URL helper
  getImageUrl(imageData) {
    if (!imageData || !imageData.attributes || !imageData.attributes.url) {
      return '/api/placeholder/300/200';
    }
    
    const url = imageData.attributes.url;
    
    // If it's already a full URL, return as is
    if (url.startsWith('http')) {
      return url;
    }
    
    // Otherwise, prepend the API base URL
    return `${API_BASE_URL}${url}`;
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.request('/');
      return { healthy: true, data: response.data };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }
}

// Create and export a singleton instance
const productService = new ProductService();

export default productService;

// Also export the class for testing or custom instances
export { ProductService };