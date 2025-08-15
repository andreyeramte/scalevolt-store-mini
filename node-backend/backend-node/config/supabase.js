const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

// Create Supabase client with service role key for backend operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database operations
const db = {
  // Generic select query
  select: async (table, columns = '*', filters = {}, options = {}) => {
    try {
      let query = supabase.from(table).select(columns)
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query = query.in(key, value)
        } else if (typeof value === 'object' && value !== null) {
          // Handle complex filters like { gte: 100 }, { like: '%search%' }
          Object.entries(value).forEach(([operator, operatorValue]) => {
            query = query[operator](key, operatorValue)
          })
        } else {
          query = query.eq(key, value)
        }
      })
      
      // Apply options like ordering, limiting
      if (options.orderBy) {
        const { column, ascending = true } = options.orderBy
        query = query.order(column, { ascending })
      }
      
      if (options.limit) {
        query = query.limit(options.limit)
      }
      
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error(`Select from ${table} error:`, error)
      return { data: null, error }
    }
  },

  // Insert data
  insert: async (table, data, options = {}) => {
    try {
      let query = supabase.from(table).insert(data)
      
      if (options.select) {
        query = query.select(options.select)
      }
      
      const result = await query
      
      if (result.error) throw result.error
      return { data: result.data, error: null }
    } catch (error) {
      console.error(`Insert into ${table} error:`, error)
      return { data: null, error }
    }
  },

  // Update data
  update: async (table, data, filters = {}, options = {}) => {
    try {
      let query = supabase.from(table).update(data)
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
      
      if (options.select) {
        query = query.select(options.select)
      }
      
      const result = await query
      
      if (result.error) throw result.error
      return { data: result.data, error: null }
    } catch (error) {
      console.error(`Update ${table} error:`, error)
      return { data: null, error }
    }
  },

  // Delete data
  delete: async (table, filters = {}) => {
    try {
      let query = supabase.from(table).delete()
      
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
      
      const { data, error } = await query
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error(`Delete from ${table} error:`, error)
      return { data: null, error }
    }
  },

  // Upsert data
  upsert: async (table, data, options = {}) => {
    try {
      let query = supabase.from(table).upsert(data, options)
      
      if (options.select) {
        query = query.select(options.select)
      }
      
      const result = await query
      
      if (result.error) throw result.error
      return { data: result.data, error: null }
    } catch (error) {
      console.error(`Upsert into ${table} error:`, error)
      return { data: null, error }
    }
  },

  // Execute raw SQL (use with caution)
  rpc: async (functionName, params = {}) => {
    try {
      const { data, error } = await supabase.rpc(functionName, params)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error(`RPC ${functionName} error:`, error)
      return { data: null, error }
    }
  }
}

// Auth operations (admin functions)
const auth = {
  // Create user (admin only)
  createUser: async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: metadata,
        email_confirm: true
      })
      
      if (error) throw error
      return { user: data.user, error: null }
    } catch (error) {
      console.error('Create user error:', error)
      return { user: null, error }
    }
  },

  // Get user by ID (admin only)
  getUserById: async (userId) => {
    try {
      const { data, error } = await supabase.auth.admin.getUserById(userId)
      
      if (error) throw error
      return { user: data.user, error: null }
    } catch (error) {
      console.error('Get user by ID error:', error)
      return { user: null, error }
    }
  },

  // Update user (admin only)
  updateUser: async (userId, updates) => {
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(userId, updates)
      
      if (error) throw error
      return { user: data.user, error: null }
    } catch (error) {
      console.error('Update user error:', error)
      return { user: null, error }
    }
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    try {
      const { data, error } = await supabase.auth.admin.deleteUser(userId)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Delete user error:', error)
      return { data: null, error }
    }
  },

  // List users (admin only)
  listUsers: async (page = 1, perPage = 50) => {
    try {
      const { data, error } = await supabase.auth.admin.listUsers({
        page,
        perPage
      })
      
      if (error) throw error
      return { users: data.users, error: null }
    } catch (error) {
      console.error('List users error:', error)
      return { users: null, error }
    }
  },

  // Verify JWT token
  verifyToken: async (token) => {
    try {
      const { data, error } = await supabase.auth.getUser(token)
      
      if (error) throw error
      return { user: data.user, error: null }
    } catch (error) {
      console.error('Verify token error:', error)
      return { user: null, error }
    }
  }
}

// Storage operations
const storage = {
  // Upload file
  upload: async (bucket, path, file, options = {}) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, options)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Storage upload error:', error)
      return { data: null, error }
    }
  },

  // Download file
  download: async (bucket, path) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Storage download error:', error)
      return { data: null, error }
    }
  },

  // Get public URL
  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  // Delete file
  remove: async (bucket, paths) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove(paths)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Storage remove error:', error)
      return { data: null, error }
    }
  },

  // List files
  list: async (bucket, path = '', options = {}) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path, options)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Storage list error:', error)
      return { data: null, error }
    }
  },

  // Create bucket
  createBucket: async (id, options = {}) => {
    try {
      const { data, error } = await supabase.storage.createBucket(id, options)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Create bucket error:', error)
      return { data: null, error }
    }
  }
}

// Utility functions
const utils = {
  // Test connection
  testConnection: async () => {
    try {
      const { data, error } = await supabase
        .from('_supabase_info')
        .select('*')
        .limit(1)
      
      return { connected: !error, error }
    } catch (error) {
      console.error('Supabase connection test failed:', error)
      return { connected: false, error }
    }
  },

  // Get table schema
  getTableSchema: async (tableName) => {
    try {
      const { data, error } = await supabase
        .rpc('get_table_schema', { table_name: tableName })
      
      if (error) throw error
      return { schema: data, error: null }
    } catch (error) {
      console.error(`Get ${tableName} schema error:`, error)
      return { schema: null, error }
    }
  },

  // Format error message
  formatError: (error) => {
    if (!error) return null
    
    // Handle common Supabase errors
    switch (error.code) {
      case '23505':
        return 'Record already exists'
      case '23503':
        return 'Referenced record does not exist'
      case '23502':
        return 'Required field is missing'
      case '42P01':
        return 'Table does not exist'
      default:
        return error.message || 'An unexpected error occurred'
    }
  }
}

module.exports = {
  supabase,
  db,
  auth,
  storage,
  utils
}
