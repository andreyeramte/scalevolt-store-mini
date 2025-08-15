const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Import and set fetch polyfill for Node.js
const fetch = require('node-fetch')
global.fetch = fetch

console.log('🚀 ScaleVolt Supabase Setup')
console.log('=' .repeat(50))

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('📋 Environment Check:')
console.log(`   URL: ${supabaseUrl || '[NOT SET]'}`)
console.log(`   Key: ${supabaseKey ? '[SET]' : '[NOT SET]'}`)

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Missing Supabase credentials!')
  console.log('\n📝 Please create a .env file with:')
  console.log('   SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co')
  console.log('   SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]')
  console.log('\n🔗 Get these from: https://supabase.com/dashboard')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('\n🔌 Testing connection...')
    
    // Test basic connection by trying to create a simple table
    console.log('1. Testing basic connection...')
    
    // First, try to create the countries table
    console.log('   📊 Creating countries table...')
    
    // Use SQL to create the table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS countries (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          code VARCHAR(3) UNIQUE,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    })
    
    if (createError) {
      console.log('   ⚠️  Could not create table via RPC, trying direct approach...')
      
      // Try to insert data directly (this will create the table if it doesn't exist)
      const { error: insertError } = await supabase
        .from('countries')
        .insert([
          { name: 'Ukraine', code: 'UA' },
          { name: 'Poland', code: 'PL' },
          { name: 'United States', code: 'US' }
        ])
        .select()
      
      if (insertError) {
        console.log('   ❌ Could not create table:', insertError.message)
        return false
      }
      
      console.log('   ✅ Table created via direct insert')
    } else {
      console.log('   ✅ Table created via SQL')
      
      // Now insert the data
      const { error: insertError } = await supabase
        .from('countries')
        .insert([
          { name: 'Ukraine', code: 'UA' },
          { name: 'Poland', code: 'PL' },
          { name: 'United States', code: 'US' }
        ])
        .select()
      
      if (insertError) {
        console.log('   ⚠️  Data insert failed:', insertError.message)
      }
    }
    
    console.log('   ✅ Database schema created successfully!')
    
    // Test the created table
    console.log('\n2. Testing data retrieval...')
    const { data: testData, error: testError } = await supabase
      .from('countries')
      .select('*')
      .order('name')
    
    if (testError) {
      console.log('   ❌ Data retrieval failed:', testError.message)
      return false
    }
    
    console.log('   ✅ Data retrieved successfully!')
    console.log('   📊 Sample data retrieved:', testData.length, 'countries')
    testData.forEach(country => {
      console.log(`      - ${country.name} (${country.code})`)
    })
    
    console.log('\n🎉 Supabase setup completed successfully!')
    console.log('✅ Your ScaleVolt store is ready to use Supabase!')
    return true
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    return false
  }
}

// Run the setup
setupDatabase()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Next steps:')
      console.log('   1. Your Supabase connection is working')
      console.log('   2. Basic schema is created')
      console.log('   3. You can now integrate with your app')
    } else {
      console.log('\n❌ Setup failed. Please check your configuration.')
    }
  })
  .catch(console.error)
