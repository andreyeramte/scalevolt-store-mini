const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Import and set fetch polyfill for Node.js
const fetch = require('node-fetch')
global.fetch = fetch

console.log('🔧 Creating Test Table in Supabase')
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

async function createTestTable() {
  try {
    console.log('📊 Creating test table...')
    
    // Method 1: Try to create via SQL function (if available)
    const { error: rpcError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS test_countries (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          code VARCHAR(3) UNIQUE,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    })
    
    if (rpcError) {
      console.log('   ⚠️  RPC method failed, trying direct approach...')
      
      // Method 2: Try to create by inserting data (this might auto-create the table)
      const { error: insertError } = await supabase
        .from('test_countries')
        .insert([
          { name: 'Ukraine', code: 'UA' },
          { name: 'Poland', code: 'PL' }
        ])
        .select()
      
      if (insertError) {
        console.log('   ❌ Could not create table automatically')
        console.log('   📝 Error:', insertError.message)
        console.log('\n💡 Solution: Create the table manually in Supabase dashboard')
        console.log('   1. Go to: https://supabase.com/dashboard/project/xkkiybeiktoqzbmlorja')
        console.log('   2. Go to SQL Editor')
        console.log('   3. Run this SQL:')
        console.log(`
          CREATE TABLE test_countries (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(3) UNIQUE,
            created_at TIMESTAMP DEFAULT NOW()
          );
          
          INSERT INTO test_countries (name, code) VALUES 
            ('Ukraine', 'UA'),
            ('Poland', 'PL'),
            ('United States', 'US');
        `)
        return false
      }
      
      console.log('   ✅ Table created via data insertion')
    } else {
      console.log('   ✅ Table created via SQL')
      
      // Insert sample data
      const { error: insertError } = await supabase
        .from('test_countries')
        .insert([
          { name: 'Ukraine', code: 'UA' },
          { name: 'Poland', code: 'PL' },
          { name: 'United States', code: 'US' }
        ])
        .select()
      
      if (insertError) {
        console.log('   ⚠️  Data insertion failed:', insertError.message)
      }
    }
    
    // Test the table
    console.log('\n🧪 Testing the created table...')
    const { data, error } = await supabase
      .from('test_countries')
      .select('*')
      .order('name')
    
    if (error) {
      console.log('   ❌ Table test failed:', error.message)
      return false
    }
    
    console.log('   ✅ Table test successful!')
    console.log('   📊 Data retrieved:', data.length, 'countries')
    data.forEach(country => {
      console.log(`      - ${country.name} (${country.code})`)
    })
    
    console.log('\n🎉 Test table created and working!')
    return true
    
  } catch (error) {
    console.error('❌ Failed:', error.message)
    return false
  }
}

createTestTable()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Your Supabase is fully functional!')
    } else {
      console.log('\n📝 Please create the table manually as shown above.')
    }
  })
  .catch(console.error)
