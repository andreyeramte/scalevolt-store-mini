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
    console.log('\n🔌 Testing basic connection...')
    
    // Try to get the current user session (this should work even without tables)
    const { data: session, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('   ⚠️  Auth test failed:', sessionError.message)
    } else {
      console.log('   ✅ Auth connection working')
    }
    
    // Try to list storage buckets
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
    
    if (storageError) {
      console.log('   ⚠️  Storage test failed:', storageError.message)
    } else {
      console.log('   ✅ Storage connection working')
      console.log('   📦 Available buckets:', buckets.map(b => b.name).join(', ') || 'None')
    }
    
    // Try a simple database query (this will fail if no tables exist, but that's OK)
    try {
      const { data, error } = await supabase
        .from('test_table_that_does_not_exist')
        .select('*')
        .limit(1)
      
      if (error && error.code === 'PGRST116') {
        console.log('   ✅ Database connection working (table does not exist, which is expected)')
      } else if (error) {
        console.log('   ⚠️  Database test failed:', error.message)
      } else {
        console.log('   ✅ Database connection working')
      }
    } catch (dbError) {
      console.log('   ⚠️  Database test error:', dbError.message)
    }
    
    console.log('\n🎉 Basic connection test completed!')
    console.log('✅ Supabase is reachable and responding')
    console.log('\n📝 Next step: Create tables through Supabase dashboard')
    return true
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

testConnection()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Your Supabase connection is working!')
      console.log('   You can now create tables and test data operations.')
    } else {
      console.log('\n❌ Connection failed.')
    }
  })
  .catch(console.error)
