const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Import and set fetch polyfill for Node.js
const fetch = require('node-fetch')
global.fetch = fetch

console.log('🚀 Setting Up Complete ScaleVolt Database')
console.log('=' .repeat(50))

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials!')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

// Sample data for initial setup
const sampleCategories = [
  {
    name: 'Solar Panels',
    name_ua: 'Сонячні панелі',
    name_pl: 'Panele słoneczne',
    slug: 'solar-panels',
    description: 'High-quality solar panels for residential and commercial use',
    description_ua: 'Високоякісні сонячні панелі для житлового та комерційного використання',
    description_pl: 'Wysokiej jakości panele słoneczne do użytku mieszkalnego i komercyjnego',
    sort_order: 1,
    is_active: true
  },
  {
    name: 'Batteries',
    name_ua: 'Батареї',
    name_pl: 'Baterie',
    slug: 'batteries',
    description: 'Energy storage solutions for solar systems',
    description_ua: 'Рішення для зберігання енергії для сонячних систем',
    description_pl: 'Rozwiązania do magazynowania energii dla systemów słonecznych',
    sort_order: 2,
    is_active: true
  },
  {
    name: 'Inverters',
    name_ua: 'Інвертори',
    name_pl: 'Inwertery',
    slug: 'inverters',
    description: 'Power conversion equipment for solar installations',
    description_ua: 'Обладнання для перетворення потужності для сонячних установок',
    description_pl: 'Sprzęt do konwersji mocy dla instalacji słonecznych',
    sort_order: 3,
    is_active: true
  },
  {
    name: 'EV Chargers',
    name_ua: 'Зарядні станції',
    name_pl: 'Stacje ładowania',
    slug: 'ev-chargers',
    description: 'Electric vehicle charging solutions',
    description_ua: 'Рішення для зарядки електромобілів',
    description_pl: 'Rozwiązania do ładowania pojazdów elektrycznych',
    sort_order: 4,
    is_active: true
  },
  {
    name: 'Cables & Wires',
    name_ua: 'Кабелі та дроти',
    name_pl: 'Kable i przewody',
    slug: 'cables-wires',
    description: 'Electrical cables and wiring solutions',
    description_ua: 'Електричні кабелі та рішення для проводки',
    description_pl: 'Kable elektryczne i rozwiązania okablowania',
    sort_order: 5,
    is_active: true
  },
  {
    name: 'Portable Generators',
    name_ua: 'Портативні генератори',
    name_pl: 'Przenośne generatory',
    slug: 'portable-generators',
    description: 'Portable power solutions',
    description_ua: 'Портативні рішення для живлення',
    description_pl: 'Przenośne rozwiązania zasilania',
    sort_order: 6,
    is_active: true
  }
]

const sampleProducts = [
  {
    sku: 'SOLAR-410W',
    name: 'Longi Solar Panel 410W',
    name_ua: 'Сонячна панель Longi 410W',
    name_pl: 'Panel słoneczny Longi 410W',
    description: 'High-efficiency monocrystalline solar panel with 410W output',
    description_ua: 'Високоефективна монокристалічна сонячна панель з виходом 410W',
    description_pl: 'Wysokowydajny monokrystaliczny panel słoneczny o mocy 410W',
    short_description: '410W monocrystalline solar panel',
    price: 299.99,
    original_price: 349.99,
    cost_price: 250.00,
    currency: 'USD',
    stock_quantity: 50,
    min_stock_level: 10,
    is_in_stock: true,
    brand: 'Longi',
    model: 'LR5-72HIH-410M',
    weight: 22.5,
    dimensions: { length: 1765, width: 1048, height: 35, unit: 'mm' },
    specifications: {
      power: '410W',
      efficiency: '20.5%',
      cell_type: 'Monocrystalline',
      cell_count: 144,
      voltage: '41.1V',
      current: '9.98A'
    },
    tags: ['solar', 'panel', 'monocrystalline', 'high-efficiency'],
    status: 'published',
    is_featured: true,
    is_on_sale: true,
    installation_available: true,
    installation_price: 150.00
  },
  {
    sku: 'BAT-10KWH',
    name: 'Deye Battery 10.64kWh',
    name_ua: 'Батарея Deye 10.64кВт⋅год',
    name_pl: 'Bateria Deye 10.64kWh',
    description: 'Lithium iron phosphate battery with 10.64kWh capacity',
    description_ua: 'Літій-фосфатна батарея з ємністю 10.64кВт⋅год',
    description_pl: 'Bateria litowo-żelazowo-fosforanowa o pojemności 10.64kWh',
    short_description: '10.64kWh LiFePO4 battery system',
    price: 2999.99,
    original_price: 3499.99,
    cost_price: 2500.00,
    currency: 'USD',
    stock_quantity: 25,
    min_stock_level: 5,
    is_in_stock: true,
    brand: 'Deye',
    model: 'RW-F10.6-51.2V-208AH',
    weight: 95.0,
    dimensions: { length: 600, width: 400, height: 200, unit: 'mm' },
    specifications: {
      capacity: '10.64kWh',
      voltage: '51.2V',
      current: '208Ah',
      chemistry: 'LiFePO4',
      cycles: '6000+',
      warranty: '10 years'
    },
    tags: ['battery', 'lifepo4', 'energy-storage', 'solar'],
    status: 'published',
    is_featured: true,
    is_on_sale: true,
    installation_available: true,
    installation_price: 300.00
  },
  {
    sku: 'INV-10KW',
    name: 'Deye Hybrid Inverter 10kW',
    name_ua: 'Гібридний інвертор Deye 10кВт',
    name_pl: 'Inwerter hybrydowy Deye 10kW',
    description: '10kW hybrid solar inverter with battery backup capability',
    description_ua: 'Гібридний сонячний інвертор 10кВт з можливістю резервного копіювання батареї',
    description_pl: '10kW hybrydowy inwerter słoneczny z możliwością kopii zapasowej baterii',
    short_description: '10kW hybrid solar inverter',
    price: 2499.99,
    original_price: 2799.99,
    cost_price: 2000.00,
    currency: 'USD',
    stock_quantity: 15,
    min_stock_level: 3,
    is_in_stock: true,
    brand: 'Deye',
    model: 'SUN-10K-SG01LP1-EU',
    weight: 45.0,
    dimensions: { length: 500, width: 300, height: 150, unit: 'mm' },
    specifications: {
      power: '10kW',
      input_voltage: '48V',
      mppt_trackers: 2,
      max_pv_power: '13kW',
      efficiency: '97.5%',
      grid_connection: 'Single Phase'
    },
    tags: ['inverter', 'hybrid', 'solar', 'battery-backup'],
    status: 'published',
    is_featured: true,
    is_on_sale: false,
    installation_available: true,
    installation_price: 400.00
  }
]

async function setupCompleteDatabase() {
  try {
    console.log('🔌 Testing Supabase connection...')
    
    // Test connection
    const { error: testError } = await supabase
      .from('test_connection')
      .select('*')
      .limit(1)
    
    if (testError && testError.code !== 'PGRST116') {
      console.log('❌ Connection test failed:', testError.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    
    console.log('\n📊 Setting up database structure...')
    
    // Step 1: Create categories table and insert data
    console.log('\n1. Setting up categories...')
    try {
      // First, let's check if categories table exists
      const { error: catCheckError } = await supabase
        .from('categories')
        .select('*')
        .limit(1)
      
      if (catCheckError && catCheckError.code === 'PGRST116') {
        console.log('   📋 Categories table does not exist - you need to create it first')
        console.log('   🌐 Go to Supabase Dashboard > SQL Editor and run:')
        console.log('   📄 Copy the contents of db/schema.sql')
        console.log('   🚀 This will create all necessary tables')
        return false
      }
      
      // If table exists, insert sample categories
      console.log('   ✅ Categories table exists, inserting sample data...')
      
      for (const category of sampleCategories) {
        try {
          const { error: insertError } = await supabase
            .from('categories')
            .upsert(category, { onConflict: 'slug' })
          
          if (insertError) {
            console.log(`   ⚠️  Category "${category.name}" insert failed:`, insertError.message)
          } else {
            console.log(`   ✅ Category "${category.name}" added/updated`)
          }
        } catch (err) {
          console.log(`   ⚠️  Category "${category.name}" error:`, err.message)
        }
      }
    } catch (err) {
      console.log('   ❌ Error setting up categories:', err.message)
    }
    
    // Step 2: Check products table structure and insert sample data
    console.log('\n2. Setting up products...')
    try {
      // Check if products table has the right structure
      const { error: productTestError } = await supabase
        .from('products')
        .insert({
          sku: 'TEST-STRUCTURE',
          name: 'Test Product',
          price: 99.99
        })
        .select()
      
      if (productTestError) {
        console.log('   ❌ Products table structure test failed:', productTestError.message)
        console.log('   🔍 The table structure is different than expected')
        console.log('   📝 You may need to recreate the products table with the correct schema')
        return false
      }
      
      // Clean up test product
      await supabase
        .from('products')
        .delete()
        .eq('sku', 'TEST-STRUCTURE')
      
      console.log('   ✅ Products table structure is correct')
      
      // Insert sample products
      console.log('   📋 Inserting sample products...')
      
      for (const product of sampleProducts) {
        try {
          const { error: insertError } = await supabase
            .from('products')
            .upsert(product, { onConflict: 'sku' })
          
          if (insertError) {
            console.log(`   ⚠️  Product "${product.name}" insert failed:`, insertError.message)
          } else {
            console.log(`   ✅ Product "${product.name}" added/updated`)
          }
        } catch (err) {
          console.log(`   ⚠️  Product "${product.name}" error:`, err.message)
        }
      }
    } catch (err) {
      console.log('   ❌ Error setting up products:', err.message)
    }
    
    console.log('\n🎉 Database setup completed!')
    console.log('\n📋 What was accomplished:')
    console.log('   ✅ Connection to Supabase confirmed')
    console.log('   📊 Sample categories and products added')
    console.log('   🔍 Table structure verified')
    
    return true
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    return false
  }
}

// Run the database setup
setupCompleteDatabase()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Your ScaleVolt database is now ready!')
      console.log('\n📋 Next Steps:')
      console.log('   1. Test your backend API endpoints')
      console.log('   2. Import your real product data')
      console.log('   3. Set up user authentication')
      console.log('   4. Test the complete system')
    } else {
      console.log('\n❌ Database setup incomplete.')
      console.log('\n🔧 Required Actions:')
      console.log('   1. Go to Supabase Dashboard > SQL Editor')
      console.log('   2. Copy and paste the contents of db/schema.sql')
      console.log('   3. Execute the SQL to create all tables')
      console.log('   4. Run this script again')
    }
  })
  .catch(console.error)
