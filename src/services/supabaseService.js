import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fallback data for when Supabase is not configured
const fallbackProducts = [
  {
    id: "mini-solar-panel-001",
    name_en: "Portable Solar Panel 100W",
    name_pl: "Przenośny Panel Słoneczny 100W",
    description_en: "High-efficiency portable solar panel perfect for camping, RVs, and emergency power needs. Lightweight and foldable design with built-in kickstand.",
    description_pl: "Wysokowydajny przenośny panel słoneczny idealny do kempingu, kamperów i awaryjnych potrzeb energetycznych. Lekka i składana konstrukcja ze wbudowaną podpórką.",
    price: 299.99,
    currency: "EUR",
    category: "portable-solar",
    images: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400&h=300&fit=crop"
    ],
    specs: {
      power: "100W",
      voltage: "12V",
      efficiency: "22%",
      weight: "2.5kg",
      dimensions: "1200 x 540 x 25mm"
    },
    in_stock: true,
    featured: true
  },
  {
    id: "mini-power-station-001",
    name_en: "Portable Power Station 1000Wh",
    name_pl: "Przenośna Stacja Energetyczna 1000Wh",
    description_en: "Compact and powerful portable power station with 1000Wh capacity. Features multiple output ports, fast charging, and LCD display for easy monitoring.",
    description_pl: "Kompaktowa i wydajna przenośna stacja energetyczna o pojemności 1000Wh. Posiada wiele portów wyjściowych, szybkie ładowanie i wyświetlacz LCD do łatwego monitorowania.",
    price: 899.99,
    currency: "EUR",
    category: "portable-power",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop"
    ],
    specs: {
      capacity: "1000Wh",
      output_power: "1000W",
      ports: "AC, DC, USB-C, USB-A",
      weight: "8.5kg",
      dimensions: "300 x 200 x 150mm"
    },
    in_stock: true,
    featured: true
  },
  {
    id: "mini-powerwall-001",
    name_en: "Home Battery Pack 10kWh",
    name_pl: "Domowy Pakiet Baterii 10kWh",
    description_en: "Professional home energy storage solution with 10kWh capacity. Seamlessly integrates with solar panels and provides backup power during outages.",
    description_pl: "Profesjonalne rozwiązanie do magazynowania energii domowej o pojemności 10kWh. Bezproblemowo integruje się z panelami słonecznymi i zapewnia zasilanie awaryjne podczas przerw.",
    price: 4999.99,
    currency: "EUR",
    category: "home-battery",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop"
    ],
    specs: {
      capacity: "10kWh",
      voltage: "48V",
      cycles: "6000+",
      warranty: "10 years",
      installation: "Wall-mounted"
    },
    in_stock: true,
    featured: true
  }
]

let supabase = null

// Only initialize Supabase if credentials are available
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey)
    console.log('✅ Supabase client initialized successfully')
  } catch (error) {
    console.warn('⚠️ Failed to initialize Supabase client:', error)
  }
} else {
  console.warn('⚠️ Supabase credentials not found. Using fallback data.')
  console.warn('💡 To connect to Supabase, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
}

class SupabaseService {
  constructor() {
    this.supabase = supabase
  }

  // Get all mini products
  async getMiniProducts() {
    try {
      // If Supabase is available, try to fetch from there
      if (this.supabase) {
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
          console.warn('⚠️ Supabase query failed, using fallback data:', error)
          return fallbackProducts
        }

        if (data && data.length > 0) {
          console.log('✅ Products loaded from Supabase')
          return data
        }
      }
      
      // Return fallback data if Supabase is not available or no data found
      console.log('📦 Using fallback product data')
      return fallbackProducts
      
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      console.log('📦 Falling back to local data')
      return fallbackProducts
    }
  }

  // Get a single product by ID
  async getProductById(id) {
    try {
      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.warn('⚠️ Supabase query failed, using fallback data:', error)
          return fallbackProducts.find(p => p.id === id) || null
        }

        return data
      }
      
      return fallbackProducts.find(p => p.id === id) || null
    } catch (error) {
      console.error('Failed to fetch product:', error)
      return fallbackProducts.find(p => p.id === id) || null
    }
  }

  // Get products by category
  async getProductsByCategory(category) {
    try {
      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('products')
          .select('*')
          .eq('category', category)
          .order('created_at', { ascending: false })

        if (error) {
          console.warn('⚠️ Supabase query failed, using fallback data:', error)
          return fallbackProducts.filter(p => p.category === category)
        }

        return data || []
      }
      
      return fallbackProducts.filter(p => p.category === category)
    } catch (error) {
      console.error('Failed to fetch products by category:', error)
      return fallbackProducts.filter(p => p.category === category)
    }
  }

  // Search products
  async searchProducts(query, language = 'en') {
    try {
      if (this.supabase) {
        const nameField = language === 'pl' ? 'name_pl' : 'name_en'
        const descField = language === 'pl' ? 'description_pl' : 'description_en'
        
        const { data, error } = await this.supabase
          .from('products')
          .select('*')
          .or(`${nameField}.ilike.%${query}%,${descField}.ilike.%${query}%`)
          .order('created_at', { ascending: false })

        if (error) {
          console.warn('⚠️ Supabase search failed, using fallback data:', error)
          return this.searchFallbackProducts(query, language)
        }

        return data || []
      }
      
      return this.searchFallbackProducts(query, language)
    } catch (error) {
      console.error('Failed to search products:', error)
      return this.searchFallbackProducts(query, language)
    }
  }

  // Search in fallback data
  searchFallbackProducts(query, language = 'en') {
    const searchTerm = query.toLowerCase()
    const nameField = language === 'pl' ? 'name_pl' : 'name_en'
    const descField = language === 'pl' ? 'description_pl' : 'description_en'
    
    return fallbackProducts.filter(product => 
      product[nameField].toLowerCase().includes(searchTerm) ||
      product[descField].toLowerCase().includes(searchTerm)
    )
  }

  // Get featured products
  async getFeaturedProducts() {
    try {
      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('products')
          .select('*')
          .eq('featured', true)
          .order('created_at', { ascending: false })

        if (error) {
          console.warn('⚠️ Supabase query failed, using fallback data:', error)
          return fallbackProducts.filter(p => p.featured)
        }

        return data || []
      }
      
      return fallbackProducts.filter(p => p.featured)
    } catch (error) {
      console.error('Failed to fetch featured products:', error)
      return fallbackProducts.filter(p => p.featured)
    }
  }

  // Check connection
  async checkConnection() {
    try {
      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('products')
          .select('count')
          .limit(1)

        if (error) {
          return { connected: false, error: error.message }
        }

        return { connected: true, error: null }
      }
      
      return { connected: false, error: 'Supabase not configured' }
    } catch (error) {
      return { connected: false, error: error.message }
    }
  }
}

// Create and export a single instance
const supabaseService = new SupabaseService()
export default supabaseService
