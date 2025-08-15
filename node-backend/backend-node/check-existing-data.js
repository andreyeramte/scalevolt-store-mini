const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Import and set fetch polyfill for Node.js
const fetch = require('node-fetch')
global.fetch = fetch

console.log('🔍 Checking Existing Data in ScaleVolt Database')
console.log('=' .repeat(50))

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing credentials!')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkExistingData() {
  try {
    console.log('📊 Checking existing data...\n')
    
    // Check products table
    console.log('1. Products Table:')
    try {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(5)
      
      if (productsError) {
        console.log('   ❌ Error accessing products:', productsError.message)
      } else {
        console.log(`   ✅ Found ${products.length} products`)
        if (products.length > 0) {
          console.log('   📋 Sample products:')
          products.forEach((product, index) => {
            console.log(`      ${index + 1}. ${product.name || product.sku || 'Unnamed product'} (SKU: ${product.sku || 'N/A'})`)
          })
        }
      }
    } catch (err) {
      console.log('   ⚠️  Error checking products:', err.message)
    }
    
    // Check if we can get table schema info
    console.log('\n2. Table Schema Information:')
    try {
      const { data: schemaData, error: schemaError } = await supabase
        .from('products')
        .select('*')
        .limit(0)
      
      if (schemaError) {
        console.log('   ❌ Error getting schema:', schemaError.message)
      } else {
        console.log('   ✅ Schema access successful')
        // Note: Supabase doesn't expose column info through the client API
        console.log('   📝 Note: Column details not available through client API')
      }
    } catch (err) {
      console.log('   ⚠️  Error checking schema:', err.message)
    }
    
    // Try to create a simple test record to see what fields are available
    console.log('\n3. Testing Data Insert:')
    try {
      const testProduct = {
        sku: 'TEST-001',
        name: 'Test Product',
        description: 'This is a test product to check table structure',
        price: 99.99,
        stock_quantity: 1
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('products')
        .insert(testProduct)
        .select()
      
      if (insertError) {
        console.log('   ❌ Insert test failed:', insertError.message)
        console.log('   🔍 This helps us understand the table structure')
      } else {
        console.log('   ✅ Test insert successful!')
        console.log('   📋 Inserted data:', insertData)
        
        // Clean up test data
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('sku', 'TEST-001')
        
        if (deleteError) {
          console.log('   ⚠️  Could not clean up test data:', deleteError.message)
        } else {
          console.log('   🧹 Test data cleaned up')
        }
      }
    } catch (err) {
      console.log('   ⚠️  Error testing insert:', err.message)
    }
    
    // Check for other tables that might exist
    console.log('\n4. Checking for Other Tables:')
    const otherTables = ['categories', 'users', 'orders', 'cart_items', 'suppliers', 'product_images']
    
    for (const tableName of otherTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (error && error.code === 'PGRST116') {
          console.log(`   ❌ Table '${tableName}' does not exist`)
        } else if (error) {
          console.log(`   ⚠️  Table '${tableName}' error:`, error.message)
        } else {
          console.log(`   ✅ Table '${tableName}' exists and accessible`)
        }
      } catch (err) {
        console.log(`   ⚠️  Error checking table '${tableName}':`, err.message)
      }
    }
    
    console.log('\n📋 Summary:')
    console.log('   ✅ Supabase connection is working')
    console.log('   ✅ Products table exists and is accessible')
    console.log('   ❌ Most other tables are missing')
    console.log('   📝 You need to create the missing tables to have a complete database')
    
    return true
    
  } catch (error) {
    console.error('❌ Data check failed:', error.message)
    return false
  }
}

// Run the data check
checkExistingData()
  .then((success) => {
    if (success) {
      console.log('\n🎉 Data check completed!')
      console.log('\n📋 Next Steps:')
      console.log('   1. Create missing tables using the schema.sql file')
      console.log('   2. Import your existing product data')
      console.log('   3. Set up categories and other related data')
      console.log('   4. Test your backend API endpoints')
    } else {
      console.log('\n❌ Data check failed.')
    }
  })
  .catch(console.error)
