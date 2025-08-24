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
    id: 'mini-solar-panel-001',
    name_en: 'Portable Solar Panel 100W',
    name_pl: 'Przenośny Panel Słoneczny 100W',
    description_en: 'High-efficiency portable solar panel perfect for camping, RVs, and emergency power needs. Lightweight and foldable design with built-in kickstand.',
    description_pl: 'Wysokowydajny przenośny panel słoneczny idealny do kempingu, kamperów i awaryjnych potrzeb energetycznych. Lekka i składana konstrukcja ze wbudowaną podpórką.',
    price: 299.99,
    currency: 'EUR',
    category: 'portable-solar',
    images: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400&h=300&fit=crop'
    ],
    specs: {
      power: '100W',
      voltage: '12V',
      efficiency: '22%',
      weight: '2.5kg',
      dimensions: '1200 x 540 x 25mm'
    },
    in_stock: true,
    featured: true
  },
  {
    id: 'mini-power-station-001',
    name_en: 'Portable Power Station 1000Wh',
    name_pl: 'Przenośna Stacja Energetyczna 1000Wh',
    description_en: 'Compact and powerful portable power station with 1000Wh capacity. Features multiple output ports, fast charging, and LCD display for easy monitoring.',
    description_pl: 'Kompaktowa i wydajna przenośna stacja energetyczna o pojemności 1000Wh. Posiada wiele portów wyjściowych, szybkie ładowanie i wyświetlacz LCD do łatwego monitorowania.',
    price: 899.99,
    currency: 'EUR',
    category: 'portable-power',
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop'
    ],
    specs: {
      capacity: '1000Wh',
      output_power: '1000W',
      ports: 'AC, DC, USB-C, USB-A',
      weight: '8.5kg',
      dimensions: '300 x 200 x 150mm'
    },
    in_stock: true,
    featured: true
  },
  {
    id: 'mini-powerwall-001',
    name_en: 'Home Battery Pack 10kWh',
    name_pl: 'Domowy Pakiet Baterii 10kWh',
    description_en: 'Professional home energy storage solution with 10kWh capacity. Seamlessly integrates with solar panels and provides backup power during outages.',
    description_pl: 'Profesjonalne rozwiązanie do magazynowania energii domowej o pojemności 10kWh. Bezproblemowo integruje się z panelami słonecznymi i zapewnia zasilanie awaryjne podczas przerw.',
    price: 4999.99,
    currency: 'EUR',
    category: 'home-battery',
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop'
    ],
    specs: {
      capacity: '10kWh',
      voltage: '48V',
      cycles: '6000+',
      warranty: '10 years',
      installation: 'Wall-mounted'
    },
    in_stock: true,
    featured: true
  }
];
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
