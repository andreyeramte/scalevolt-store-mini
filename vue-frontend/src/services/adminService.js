// Admin service for handling admin-specific API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class AdminService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  // Generic API request method
  async makeRequest(endpoint, options = {}) {
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.removeAuthToken();
          throw new Error('Authentication required');
        }
        if (response.status === 403) {
          throw new Error('Admin access required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Admin API request failed:', error);
      throw error;
    }
  }

  // Admin authentication
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      if (data.token) {
        this.setAuthToken(data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Admin login failed:', error);
      throw error;
    }
  }

  // Admin logout
  logout() {
    this.removeAuthToken();
  }

  // Check if user is admin
  async checkAdminStatus() {
    try {
      const response = await this.makeRequest('/auth/me');
      return response.user && response.user.role === 'admin';
    } catch (error) {
      return false;
    }
  }

  // Get admin dashboard stats
  async getDashboardStats() {
    return await this.makeRequest('/admin/stats');
  }

  // Get products for admin (with pagination and filters)
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const endpoint = `/admin/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.makeRequest(endpoint);
  }

  // Create new product
  async createProduct(productData) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(productData).forEach(key => {
      if (key === 'images') {
        // Handle multiple images
        if (productData.images && productData.images.length > 0) {
          productData.images.forEach(image => {
            formData.append('images', image);
          });
        }
      } else {
        formData.append(key, productData[key]);
      }
    });

    return await this.makeRequest('/admin/products', {
      method: 'POST',
      headers: {
        // Remove Content-Type to let browser set it with boundary for FormData
      },
      body: formData
    });
  }

  // Update product
  async updateProduct(productId, productData) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(productData).forEach(key => {
      if (key === 'images') {
        // Handle multiple images
        if (productData.images && productData.images.length > 0) {
          productData.images.forEach(image => {
            formData.append('images', image);
          });
        }
      } else {
        formData.append(key, productData[key]);
      }
    });

    return await this.makeRequest(`/admin/products/${productId}`, {
      method: 'PUT',
      headers: {
        // Remove Content-Type to let browser set it with boundary for FormData
      },
      body: formData
    });
  }

  // Delete product
  async deleteProduct(productId) {
    return await this.makeRequest(`/admin/products/${productId}`, {
      method: 'DELETE'
    });
  }

  // Get categories
  async getCategories() {
    return await this.makeRequest('/admin/categories');
  }

  // Create category
  async createCategory(categoryData) {
    return await this.makeRequest('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  // Get users (admin only)
  async getUsers(params = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const endpoint = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.makeRequest(endpoint);
  }

  // Upload image
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    return await this.makeRequest('/admin/upload', {
      method: 'POST',
      headers: {
        // Remove Content-Type to let browser set it with boundary for FormData
      },
      body: formData
    });
  }

  // Get product by ID
  async getProduct(productId) {
    return await this.makeRequest(`/admin/products/${productId}`);
  }

  // Search products
  async searchProducts(query, filters = {}) {
    const params = { search: query, ...filters };
    return await this.getProducts(params);
  }

  // Get low stock products
  async getLowStockProducts(threshold = 10) {
    return await this.makeRequest(`/admin/products?stock_threshold=${threshold}`);
  }

  // Get recent products
  async getRecentProducts(limit = 10) {
    return await this.makeRequest(`/admin/products?limit=${limit}&sortBy=created_at&sortOrder=DESC`);
  }

  // Export products to CSV
  async exportProducts(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        queryParams.append(key, filters[key]);
      }
    });

    const endpoint = `/admin/products/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      }
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Bulk operations
  async bulkUpdateProducts(productIds, updates) {
    return await this.makeRequest('/admin/products/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({ productIds, updates })
    });
  }

  async bulkDeleteProducts(productIds) {
    return await this.makeRequest('/admin/products/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ productIds })
    });
  }
}

// Create and export a singleton instance
const adminService = new AdminService();
export default adminService; 