import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Auth helpers
export const auth = {
  // Sign up with email and password
  signUp: async (email, password, options = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          ...options,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      return { user: data.user, session: data.session, error: null }
    } catch (error) {
      console.error('Supabase sign up error:', error)
      return { user: null, session: null, error }
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { user: data.user, session: data.session, error: null }
    } catch (error) {
      console.error('Supabase sign in error:', error)
      return { user: null, session: null, error }
    }
  },

  // Sign in with OAuth provider
  signInWithProvider: async (provider, options = {}) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          ...options
        }
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error(`Supabase ${provider} sign in error:`, error)
      return { data: null, error }
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Supabase sign out error:', error)
      return { error }
    }
  },

  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  // Get current session
  getCurrentSession: () => {
    return supabase.auth.getSession()
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Supabase password reset error:', error)
      return { data: null, error }
    }
  },

  // Update password
  updatePassword: async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      return { user: data.user, error: null }
    } catch (error) {
      console.error('Supabase password update error:', error)
      return { user: null, error }
    }
  }
}

// Database helpers
export const db = {
  // Generic select query
  select: (table, columns = '*', filters = {}) => {
    let query = supabase.from(table).select(columns)
    
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
    
    return query
  },

  // Insert data
  insert: (table, data) => {
    return supabase.from(table).insert(data)
  },

  // Update data
  update: (table, data, filters = {}) => {
    let query = supabase.from(table).update(data)
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
    
    return query
  },

  // Delete data
  delete: (table, filters = {}) => {
    let query = supabase.from(table).delete()
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
    
    return query
  },

  // Upsert data
  upsert: (table, data, options = {}) => {
    return supabase.from(table).upsert(data, options)
  }
}

// Storage helpers
export const storage = {
  // Upload file
  upload: async (bucket, path, file, options = {}) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, options)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Supabase storage upload error:', error)
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
      console.error('Supabase storage download error:', error)
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
      console.error('Supabase storage remove error:', error)
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
      console.error('Supabase storage list error:', error)
      return { data: null, error }
    }
  }
}

// Realtime helpers
export const realtime = {
  // Subscribe to table changes
  subscribe: (table, callback, filters = {}) => {
    let subscription = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: table,
        ...filters
      }, callback)
      .subscribe()
    
    return subscription
  },

  // Unsubscribe from channel
  unsubscribe: (subscription) => {
    return supabase.removeChannel(subscription)
  },

  // Subscribe to specific events
  subscribeToInserts: (table, callback, filters = {}) => {
    return supabase
      .channel(`public:${table}:insert`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: table,
        ...filters
      }, callback)
      .subscribe()
  },

  subscribeToUpdates: (table, callback, filters = {}) => {
    return supabase
      .channel(`public:${table}:update`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: table,
        ...filters
      }, callback)
      .subscribe()
  },

  subscribeToDeletes: (table, callback, filters = {}) => {
    return supabase
      .channel(`public:${table}:delete`)
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: table,
        ...filters
      }, callback)
      .subscribe()
  }
}

// Utility functions
export const utils = {
  // Check if user is authenticated
  isAuthenticated: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return { profile: data, error: null }
    } catch (error) {
      console.error('Get user profile error:', error)
      return { profile: null, error }
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return { profile: data, error: null }
    } catch (error) {
      console.error('Update user profile error:', error)
      return { profile: null, error }
    }
  },

  // Format error message
  formatError: (error) => {
    if (!error) return null
    
    // Handle common Supabase errors
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password'
      case 'Email not confirmed':
        return 'Please check your email and click the confirmation link'
      case 'User already registered':
        return 'An account with this email already exists'
      default:
        return error.message || 'An unexpected error occurred'
    }
  }
}

export default supabase
