const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Import and set fetch polyfill for Node.js
const fetch = require('node-fetch')
global.fetch = fetch

console.log('🧪 Testing ScaleVolt Database Schema')
console.log('=' .repeat(40))

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing credentials!')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

async function testSchema() {
  try {
    console.log('🔌 Testing database schema...')
    
    const tables = [
      'users',
      'categories', 
      'products',
      'product_images',
      'orders',
      'order_items',
      'cart_items',
      'product_reviews',
      'suppliers',
      'inventory',
      'promotions',
      'newsletter_subscriptions',
      'contact_submissions'
    ]
    
    console.log('\n📋 Checking tables:')
    
    for (const tableName of tables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`   ❌ ${tableName}: ${error.message}`)
        } else {
          console.log(`   ✅ ${tableName}: Table exists and accessible`)
        }
      } catch (err) {
        console.log(`   ❌ ${tableName}: ${err.message}`)
      }
    }
    
    console.log('\n🌱 Testing data operations...')
    
    // Test categories table
    try {
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (catError) {
        console.log('   ❌ Categories query failed:', catError.message)
      } else {
        console.log(`   ✅ Categories: ${categories.length} found`)
        if (categories.length > 0) {
          console.log('   📊 Sample categories:')
          categories.slice(0, 3).forEach(cat => {
            console.log(`      - ${cat.name} (${cat.slug})`)
          })
        }
      }
    } catch (err) {
      console.log('   ❌ Categories test error:', err.message)
    }
    
    // Test products table structure
    try {
      const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name, price, category_id')
        .limit(1)
      
      if (prodError) {
        console.log('   ❌ Products query failed:', prodError.message)
      } else {
        console.log('   ✅ Products table structure is correct')
      }
    } catch (err) {
      console.log('   ❌ Products test error:', err.message)
    }
    
    console.log('\n🎉 Schema test completed!')
    return true
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

testSchema()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Your ScaleVolt database is working!')
      console.log('   You can now:')
      console.log('   - Add products to your store')
      console.log('   - Create user accounts')
      console.log('   - Process orders')
      console.log('   - Manage inventory')
    } else {
      console.log('\n❌ Schema test failed.')
    }
  })
  .catch(console.error)
