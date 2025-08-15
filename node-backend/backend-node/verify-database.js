const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Import and set fetch polyfill for Node.js
const fetch = require('node-fetch')
global.fetch = fetch

console.log('🔍 Verifying ScaleVolt Database Setup')
console.log('=' .repeat(45))

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials!')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyDatabase() {
  try {
    console.log('🔌 Testing connection...')
    
    // Test connection using auth service
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1
    })
    
    if (authError) {
      console.log('❌ Connection test failed:', authError.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    
    console.log('\n📋 Checking required tables...')
    
    // List of required tables
    const requiredTables = [
      'users',
      'categories', 
      'products',
      'orders',
      'order_items',
      'cart_items',
      'suppliers',
      'product_images'
    ]
    
    const tableStatus = {}
    
    // Check each table
    for (const tableName of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (error && error.code === 'PGRST116') {
          tableStatus[tableName] = { exists: false, error: 'Table does not exist' }
        } else if (error) {
          tableStatus[tableName] = { exists: false, error: error.message }
        } else {
          tableStatus[tableName] = { exists: true, error: null }
        }
      } catch (err) {
        tableStatus[tableName] = { exists: false, error: err.message }
      }
    }
    
    // Display results
    let allTablesExist = true
    console.log('\n📊 Table Status:')
    console.log('─'.repeat(60))
    
    for (const [tableName, status] of Object.entries(tableStatus)) {
      if (status.exists) {
        console.log(`✅ ${tableName.padEnd(20)} - EXISTS`)
      } else {
        console.log(`❌ ${tableName.padEnd(20)} - MISSING: ${status.error}`)
        allTablesExist = false
      }
    }
    
    console.log('─'.repeat(60))
    
    if (allTablesExist) {
      console.log('\n🎉 All required tables exist!')
      
      // Check for sample data
      console.log('\n📊 Checking for sample data...')
      
      // Check categories
      try {
        const { data: categories, error: catError } = await supabase
          .from('categories')
          .select('*')
          .limit(5)
        
        if (catError) {
          console.log('   ⚠️  Error checking categories:', catError.message)
        } else {
          console.log(`   📋 Categories: ${categories.length} found`)
        }
      } catch (err) {
        console.log('   ⚠️  Error checking categories:', err.message)
      }
      
      // Check products
      try {
        const { data: products, error: prodError } = await supabase
          .from('products')
          .select('*')
          .limit(5)
        
        if (prodError) {
          console.log('   ⚠️  Error checking products:', prodError.message)
        } else {
          console.log(`   📋 Products: ${products.length} found`)
        }
      } catch (err) {
        console.log('   ⚠️  Error checking products:', err.message)
      }
      
      // Check users
      try {
        const { data: users, error: userError } = await supabase
          .from('users')
          .select('*')
          .limit(5)
        
        if (userError) {
          console.log('   ⚠️  Error checking users:', userError.message)
        } else {
          console.log(`   📋 Users: ${users.length} found`)
        }
      } catch (err) {
        console.log('   ⚠️  Error checking users:', err.message)
      }
      
      console.log('\n✅ Database verification completed successfully!')
      console.log('\n📋 Next Steps:')
      console.log('   1. Run: node setup-complete-database.js (to add sample data)')
      console.log('   2. Start your backend server: npm run dev')
      console.log('   3. Test your API endpoints')
      console.log('   4. Import your real product data')
      
      return true
      
    } else {
      console.log('\n❌ Some required tables are missing!')
      console.log('\n🔧 Required Actions:')
      console.log('   1. Go to Supabase Dashboard > SQL Editor')
      console.log('   2. Copy and paste the schema from setup-database-steps.md')
      console.log('   3. Execute the SQL to create all tables')
      console.log('   4. Run this verification script again')
      
      return false
    }
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message)
    return false
  }
}

// Run the verification
verifyDatabase()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Your ScaleVolt database is ready for business!')
    } else {
      console.log('\n❌ Database setup incomplete.')
    }
  })
  .catch(console.error)
