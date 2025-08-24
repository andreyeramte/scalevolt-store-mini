import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
}

const supabase = createClient(supabaseUrl, supabaseKey)

class SupabaseService {
  constructor() {
    this.supabase = supabase
  }

  // Get all mini products
  async getMiniProducts() {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .in('id', [
          'mini-solar-panel-001',
          'mini-power-station-001', 
          'mini-powerwall-001'
        ])
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching mini products:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Failed to fetch mini products:', error)
      return []
    }
  }

  // Get a single product by ID
  async getProductById(id) {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Failed to fetch product:', error)
      return null
    }
  }

  // Get products by category
  async getProductsByCategory(category) {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products by category:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Failed to fetch products by category:', error)
      return []
    }
  }

  // Search products
  async searchProducts(query, language = 'en') {
    try {
      const nameField = language === 'pl' ? 'name_pl' : 'name_en'
      const descField = language === 'pl' ? 'description_pl' : 'description_en'
      
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .or(`${nameField}.ilike.%${query}%,${descField}.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching products:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Failed to search products:', error)
      return []
    }
  }

  // Get featured products
  async getFeaturedProducts() {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching featured products:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Failed to fetch featured products:', error)
      return []
    }
  }

  // Check connection
  async checkConnection() {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select('count')
        .limit(1)

      if (error) {
        return { connected: false, error: error.message }
      }

      return { connected: true, error: null }
    } catch (error) {
      return { connected: false, error: error.message }
    }
  }
}

// Create and export a single instance
const supabaseService = new SupabaseService()
export default supabaseService
