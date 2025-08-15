const { supabase, db, auth, storage, utils } = require('../config/supabase')

// Authentication service (admin operations)
const authService = {
  // Create user (admin only)
  async createUser(email, password, metadata = {}) {
    const result = await auth.createUser(email, password, metadata)
    
    if (result.user && !result.error) {
      // Create user profile
      await this.createUserProfile(result.user.id, {
        email: result.user.email,
        ...metadata
      })
    }
    
    return result
  },

  // Get user by ID
  async getUserById(userId) {
    return await auth.getUserById(userId)
  },

  // Update user
  async updateUser(userId, updates) {
    return await auth.updateUser(userId, updates)
  },

  // Delete user
  async deleteUser(userId) {
    // First delete user profile
    await db.delete('profiles', { id: userId })
    // Then delete auth user
    return await auth.deleteUser(userId)
  },

  // List users
  async listUsers(page = 1, perPage = 50) {
    return await auth.listUsers(page, perPage)
  },

  // Verify JWT token
  async verifyToken(token) {
    return await auth.verifyToken(token)
  },

  // Create user profile
  async createUserProfile(userId, profileData) {
    return await db.insert('profiles', {
      id: userId,
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { select: '*' })
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    return await db.update('profiles', {
      ...updates,
      updated_at: new Date().toISOString()
    }, { id: userId }, { select: '*' })
  },

  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await db.select('profiles', '*', { id: userId })
    return { profile: data?.[0] || null, error }
  }
}

// Product service
const productService = {
  // Get all products
  async getProducts(filters = {}, options = {}) {
    return await db.select('products', '*', filters, options)
  },

  // Get product by ID
  async getProduct(id) {
    const { data, error } = await db.select('products', '*', { id })
    return { product: data?.[0] || null, error }
  },

  // Get products by category
  async getProductsByCategory(categoryId, options = {}) {
    return await db.select('products', '*', { category_id: categoryId }, options)
  },

  // Search products
  async searchProducts(query, options = {}) {
    return await db.select('products', '*', {
      name: { ilike: `%${query}%` }
    }, options)
  },

  // Create product
  async createProduct(productData) {
    return await db.insert('products', {
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { select: '*' })
  },

  // Update product
  async updateProduct(id, updates) {
    return await db.update('products', {
      ...updates,
      updated_at: new Date().toISOString()
    }, { id }, { select: '*' })
  },

  // Delete product
  async deleteProduct(id) {
    return await db.delete('products', { id })
  },

  // Bulk create products
  async bulkCreateProducts(products) {
    const productsWithTimestamps = products.map(product => ({
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))
    
    return await db.insert('products', productsWithTimestamps, { select: '*' })
  },

  // Update product stock
  async updateProductStock(id, stockQuantity) {
    return await db.update('products', {
      stock_quantity: stockQuantity,
      updated_at: new Date().toISOString()
    }, { id }, { select: '*' })
  },

  // Get low stock products
  async getLowStockProducts(threshold = 10) {
    return await db.select('products', '*', {
      stock_quantity: { lte: threshold }
    })
  },

  // Get categories
  async getCategories() {
    return await db.select('categories', '*', {}, { 
      orderBy: { column: 'name' } 
    })
  },

  // Create category
  async createCategory(categoryData) {
    return await db.insert('categories', {
      ...categoryData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { select: '*' })
  },

  // Update category
  async updateCategory(id, updates) {
    return await db.update('categories', {
      ...updates,
      updated_at: new Date().toISOString()
    }, { id }, { select: '*' })
  }
}

// Order service
const orderService = {
  // Get all orders
  async getAllOrders(filters = {}, options = {}) {
    return await db.select('orders', '*', filters, {
      orderBy: { column: 'created_at', ascending: false },
      ...options
    })
  },

  // Get order by ID
  async getOrder(id) {
    const { data, error } = await db.select('orders', `
      *,
      profiles!inner(email, full_name),
      order_items(
        *,
        products(name, price, image_url)
      )
    `, { id })
    return { order: data?.[0] || null, error }
  },

  // Create order
  async createOrder(orderData) {
    return await db.insert('orders', {
      ...orderData,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { select: '*' })
  },

  // Update order
  async updateOrder(id, updates) {
    return await db.update('orders', {
      ...updates,
      updated_at: new Date().toISOString()
    }, { id }, { select: '*' })
  },

  // Update order status
  async updateOrderStatus(id, status) {
    return await db.update('orders', {
      status,
      updated_at: new Date().toISOString()
    }, { id }, { select: '*' })
  },

  // Get user orders
  async getUserOrders(userId, options = {}) {
    return await db.select('orders', '*', { user_id: userId }, {
      orderBy: { column: 'created_at', ascending: false },
      ...options
    })
  },

  // Get order items
  async getOrderItems(orderId) {
    return await db.select('order_items', `
      *,
      products(name, price, image_url)
    `, { order_id: orderId })
  },

  // Add items to order
  async addOrderItems(orderId, items) {
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      created_at: new Date().toISOString()
    }))
    
    return await db.insert('order_items', orderItems, { select: '*' })
  },

  // Calculate order total
  async calculateOrderTotal(orderId) {
    const { data, error } = await db.select('order_items', `
      quantity,
      price
    `, { order_id: orderId })

    if (error) return { total: 0, error }

    const total = data.reduce((sum, item) => {
      return sum + (item.quantity * item.price)
    }, 0)

    return { total, error: null }
  },

  // Get orders by status
  async getOrdersByStatus(status, options = {}) {
    return await db.select('orders', '*', { status }, options)
  },

  // Get orders by date range
  async getOrdersByDateRange(startDate, endDate, options = {}) {
    return await db.select('orders', '*', {
      created_at: {
        gte: startDate,
        lte: endDate
      }
    }, options)
  }
}

// Analytics service
const analyticsService = {
  // Get sales analytics
  async getSalesAnalytics(startDate, endDate) {
    try {
      const { data, error } = await db.rpc('get_sales_analytics', {
        start_date: startDate,
        end_date: endDate
      })
      
      if (error) throw error
      return { analytics: data, error: null }
    } catch (error) {
      console.error('Get sales analytics error:', error)
      return { analytics: null, error }
    }
  },

  // Get product analytics
  async getProductAnalytics() {
    try {
      const { data, error } = await db.rpc('get_product_analytics')
      
      if (error) throw error
      return { analytics: data, error: null }
    } catch (error) {
      console.error('Get product analytics error:', error)
      return { analytics: null, error }
    }
  },

  // Get user analytics
  async getUserAnalytics() {
    try {
      const { data, error } = await db.rpc('get_user_analytics')
      
      if (error) throw error
      return { analytics: data, error: null }
    } catch (error) {
      console.error('Get user analytics error:', error)
      return { analytics: null, error }
    }
  },

  // Get top selling products
  async getTopSellingProducts(limit = 10) {
    return await db.select('order_items', `
      product_id,
      products(name, price, image_url),
      sum(quantity) as total_sold
    `, {}, {
      limit,
      orderBy: { column: 'total_sold', ascending: false }
    })
  },

  // Get revenue by period
  async getRevenueByPeriod(period = 'month') {
    try {
      const { data, error } = await db.rpc('get_revenue_by_period', {
        period_type: period
      })
      
      if (error) throw error
      return { revenue: data, error: null }
    } catch (error) {
      console.error('Get revenue by period error:', error)
      return { revenue: null, error }
    }
  }
}

// File storage service
const storageService = {
  // Upload file
  async uploadFile(bucket, path, file, options = {}) {
    return await storage.upload(bucket, path, file, options)
  },

  // Download file
  async downloadFile(bucket, path) {
    return await storage.download(bucket, path)
  },

  // Get public URL
  getPublicUrl(bucket, path) {
    return storage.getPublicUrl(bucket, path)
  },

  // Delete file
  async deleteFile(bucket, paths) {
    return await storage.remove(bucket, paths)
  },

  // List files
  async listFiles(bucket, path = '', options = {}) {
    return await storage.list(bucket, path, options)
  },

  // Create bucket
  async createBucket(id, options = {}) {
    return await storage.createBucket(id, options)
  },

  // Upload product image
  async uploadProductImage(file, productId) {
    const fileExt = file.originalname.split('.').pop()
    const fileName = `${productId}_${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    return await this.uploadFile('product-images', filePath, file)
  },

  // Upload user avatar
  async uploadUserAvatar(file, userId) {
    const fileExt = file.originalname.split('.').pop()
    const fileName = `avatar_${userId}.${fileExt}`
    const filePath = `avatars/${fileName}`

    return await this.uploadFile('user-avatars', filePath, file)
  }
}

// Utility service
const utilityService = {
  // Test Supabase connection
  async testConnection() {
    return await utils.testConnection()
  },

  // Format error
  formatError(error) {
    return utils.formatError(error)
  },

  // Validate data
  validateData(data, schema) {
    // Basic validation - you can extend this with a validation library
    const errors = []
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field]
      
      if (rules.required && (!value || value === '')) {
        errors.push(`${field} is required`)
      }
      
      if (rules.type && value && typeof value !== rules.type) {
        errors.push(`${field} must be of type ${rules.type}`)
      }
      
      if (rules.minLength && value && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`)
      }
      
      if (rules.maxLength && value && value.length > rules.maxLength) {
        errors.push(`${field} must be no more than ${rules.maxLength} characters`)
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Generate unique ID
  generateId() {
    return crypto.randomUUID()
  },

  // Hash password
  async hashPassword(password) {
    const bcrypt = require('bcryptjs')
    return await bcrypt.hash(password, 12)
  },

  // Compare password
  async comparePassword(password, hash) {
    const bcrypt = require('bcryptjs')
    return await bcrypt.compare(password, hash)
  }
}

module.exports = {
  authService,
  productService,
  orderService,
  analyticsService,
  storageService,
  utilityService,
  supabase
}
