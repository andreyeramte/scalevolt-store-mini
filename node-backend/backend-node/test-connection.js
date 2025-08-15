const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Import and set fetch polyfill for Node.js
const fetch = require('node-fetch')
global.fetch = fetch

console.log('🧪 Quick Supabase Connection Test')
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
    
    const { data, error } = await supabase
      .from('countries')
      .select('name')
      .limit(1)
    
    if (error) {
      console.log('   ❌ Connection failed:', error.message)
      return false
    }
    
    console.log('   ✅ Connection successful!')
    console.log('   📊 Data:', data)
    return true
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

testConnection()
  .then((success) => {
    if (success) {
      console.log('\n🎉 Supabase is working!')
    } else {
      console.log('\n❌ Connection failed.')
    }
  })
  .catch(console.error)
