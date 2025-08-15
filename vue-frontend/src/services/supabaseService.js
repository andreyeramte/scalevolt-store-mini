import { supabase, auth, db, storage, realtime, utils } from '../supabase.js'

// Authentication service
export const authService = {
  // Sign up new user
  async signUp(email, password, userData = {}) {
    const result = await auth.signUp(email, password, {
      data: userData
    })
    
    if (result.user && !result.error) {
      // Create user profile
      await this.createUserProfile(result.user.id, {
        email: result.user.email,
        ...userData
      })
    }
    
    return result
  },

  // Sign in user
  async signIn(email, password) {
    return await auth.signIn(email, password)
  },

  // Sign in with OAuth provider
  async signInWithProvider(provider) {
    return await auth.signInWithProvider(provider)
  },

  // Sign out user
  async signOut() {
    return await auth.signOut()
  },

  // Get current user
  async getCurrentUser() {
    return await auth.getCurrentUser()
  },

  // Get current session
  async getCurrentSession() {
    return await auth.getCurrentSession()
  },

  // Reset password
  async resetPassword(email) {
    return await auth.resetPassword(email)
  },

  // Update password
  async updatePassword(newPassword) {
    return await auth.updatePassword(newPassword)
  },

  // Create user profile
  async createUserProfile(userId, profileData) {
    return await db.insert('profiles', {
      id: userId,
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    return await db.update('profiles', {
      ...updates,
      updated_at: new Date().toISOString()
    }, { id: userId })
  },

  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await db.select('profiles', '*', { id: userId })
    return { profile: data?.[0] || null, error }
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return auth.onAuthStateChange((event, session) => {
      callback(event, session)
    })
  }
}

// Product service
export const productService = {
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

  // Create product (admin only)
  async createProduct(productData) {
    return await db.insert('products', {
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  },

  // Update product (admin only)
  async updateProduct(id, updates) {
    return await db.update('products', {
      ...updates,
      updated_at: new Date().toISOString()
    }, { id })
  },

  // Delete product (admin only)
  async deleteProduct(id) {
    return await db.delete('products', { id })
  },

  // Get product categories
  async getCategories() {
    return await db.select('categories', '*', {}, { orderBy: { column: 'name' } })
  },

  // Get featured products
  async getFeaturedProducts(limit = 10) {
    return await db.select('products', '*', { featured: true }, { limit })
  }
}

// Order service
export const orderService = {
  // Create new order
  async createOrder(orderData) {
    return await db.insert('orders', {
      ...orderData,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  },

  // Get user orders
  async getUserOrders(userId, options = {}) {
    return await db.select('orders', '*', { user_id: userId }, {
      orderBy: { column: 'created_at', ascending: false },
      ...options
    })
  },

  // Get order by ID
  async getOrder(id) {
    const { data, error } = await db.select('orders', '*', { id })
    return { order: data?.[0] || null, error }
  },

  // Update order status
  async updateOrderStatus(id, status) {
    return await db.update('orders', {
      status,
      updated_at: new Date().toISOString()
    }, { id })
  },

  // Get order items
  async getOrderItems(orderId) {
    return await db.select('order_items', '*', { order_id: orderId })
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
    
    return await db.insert('order_items', orderItems)
  }
}

// Cart service
export const cartService = {
  // Get user cart
  async getCart(userId) {
    return await db.select('cart_items', `
      *,
      products (
        id,
        name,
        price,
        image_url,
        stock_quantity
      )
    `, { user_id: userId })
  },

  // Add item to cart
  async addToCart(userId, productId, quantity = 1) {
    // Check if item already exists in cart
    const { data: existing } = await db.select('cart_items', '*', {
      user_id: userId,
      product_id: productId
    })

    if (existing && existing.length > 0) {
      // Update quantity
      return await db.update('cart_items', {
        quantity: existing[0].quantity + quantity,
        updated_at: new Date().toISOString()
      }, {
        user_id: userId,
        product_id: productId
      })
    } else {
      // Add new item
      return await db.insert('cart_items', {
        user_id: userId,
        product_id: productId,
        quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
  },

  // Update cart item quantity
  async updateCartItem(userId, productId, quantity) {
    if (quantity <= 0) {
      return await this.removeFromCart(userId, productId)
    }

    return await db.update('cart_items', {
      quantity,
      updated_at: new Date().toISOString()
    }, {
      user_id: userId,
      product_id: productId
    })
  },

  // Remove item from cart
  async removeFromCart(userId, productId) {
    return await db.delete('cart_items', {
      user_id: userId,
      product_id: productId
    })
  },

  // Clear cart
  async clearCart(userId) {
    return await db.delete('cart_items', { user_id: userId })
  },

  // Get cart total
  async getCartTotal(userId) {
    const { data, error } = await db.select('cart_items', `
      quantity,
      products!inner(price)
    `, { user_id: userId })

    if (error) return { total: 0, error }

    const total = data.reduce((sum, item) => {
      return sum + (item.quantity * item.products.price)
    }, 0)

    return { total, error: null }
  }
}

// File upload service
export const uploadService = {
  // Upload product image
  async uploadProductImage(file, productId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${productId}_${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    return await storage.upload('product-images', filePath, file)
  },

  // Upload user avatar
  async uploadUserAvatar(file, userId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `avatar_${userId}.${fileExt}`
    const filePath = `avatars/${fileName}`

    return await storage.upload('user-avatars', filePath, file)
  },

  // Get file URL
  getFileUrl(bucket, path) {
    return storage.getPublicUrl(bucket, path)
  },

  // Delete file
  async deleteFile(bucket, path) {
    return await storage.remove(bucket, [path])
  }
}

// Real-time subscriptions
export const realtimeService = {
  // Subscribe to product updates
  subscribeToProducts(callback) {
    return realtime.subscribe('products', callback)
  },

  // Subscribe to order updates
  subscribeToOrderUpdates(userId, callback) {
    return realtime.subscribe('orders', callback, {
      filter: `user_id=eq.${userId}`
    })
  },

  // Subscribe to cart updates
  subscribeToCartUpdates(userId, callback) {
    return realtime.subscribe('cart_items', callback, {
      filter: `user_id=eq.${userId}`
    })
  },

  // Unsubscribe from channel
  unsubscribe(subscription) {
    return realtime.unsubscribe(subscription)
  }
}

// Admin service
export const adminService = {
  // Get all orders
  async getAllOrders(options = {}) {
    return await db.select('orders', `
      *,
      profiles!inner(email, full_name)
    `, {}, {
      orderBy: { column: 'created_at', ascending: false },
      ...options
    })
  },

  // Get order analytics
  async getOrderAnalytics(startDate, endDate) {
    return await db.rpc('get_order_analytics', {
      start_date: startDate,
      end_date: endDate
    })
  },

  // Get product analytics
  async getProductAnalytics() {
    return await db.rpc('get_product_analytics')
  },

  // Get user analytics
  async getUserAnalytics() {
    return await db.rpc('get_user_analytics')
  }
}

// Utility functions
export const supabaseUtils = {
  // Check if user is authenticated
  async isAuthenticated() {
    return await utils.isAuthenticated()
  },

  // Format error message
  formatError(error) {
    return utils.formatError(error)
  },

  // Test connection
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
      
      return { connected: !error, error }
    } catch (error) {
      return { connected: false, error }
    }
  }
}

export default {
  authService,
  productService,
  orderService,
  cartService,
  uploadService,
  realtimeService,
  adminService,
  supabaseUtils
}
