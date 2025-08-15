const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Import and set fetch polyfill for Node.js
const fetch = require('node-fetch')
global.fetch = fetch

console.log('🧪 Simple Supabase Connection Test')
console.log('=' .repeat(40))

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('📋 Environment Check:')
console.log(`   URL: ${supabaseUrl || '[NOT SET]'}`)
console.log(`   Key: ${supabaseKey ? '[SET]' : '[NOT SET]'}`)

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Missing credentials! Create .env file first.')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('\n🔌 Testing connection...')
    
    // Try to access the auth service to test connection
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1
    })
    
    if (authError) {
      console.log('   ❌ Auth service test failed:', authError.message)
      
      // Try a different approach - test with a simple query to a non-existent table
      console.log('   🔄 Trying alternative connection test...')
      
      const { error: queryError } = await supabase
        .from('test_connection_table')
        .select('*')
        .limit(1)
      
      if (queryError && queryError.code === 'PGRST116') {
        console.log('   ✅ Connection successful! (Table does not exist, but connection works)')
        return true
      } else if (queryError) {
        console.log('   ❌ Connection failed:', queryError.message)
        return false
      }
      
      return false
    }
    
    console.log('   ✅ Connection successful!')
    console.log('   📊 Auth service working')
    return true
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

async function checkExistingTables() {
  console.log('\n📋 Checking existing tables...')
  
  const tablesToCheck = ['users', 'categories', 'products', 'orders', 'cart_items', 'suppliers']
  
  for (const tableName of tablesToCheck) {
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
}

testConnection()
  .then(async (success) => {
    if (success) {
      console.log('\n🎉 Supabase connection is working!')
      await checkExistingTables()
      
      console.log('\n📋 Next Steps:')
      console.log('   1. If no tables exist, you need to create them')
      console.log('   2. Go to Supabase Dashboard > SQL Editor')
      console.log('   3. Copy and paste the contents of db/schema.sql')
      console.log('   4. Execute the SQL to create all tables')
      console.log('   5. Run this test again to verify tables exist')
    } else {
      console.log('\n❌ Connection failed.')
      console.log('\n🔧 Troubleshooting:')
      console.log('   1. Check your .env file has correct credentials')
      console.log('   2. Verify your Supabase project is active')
      console.log('   3. Check if your service role key has correct permissions')
    }
  })
  .catch(console.error)
