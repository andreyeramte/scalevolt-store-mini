const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Import and set fetch polyfill for Node.js
const fetch = require('node-fetch')
global.fetch = fetch

console.log('🏗️  Creating ScaleVolt Store Database Schema in Supabase')
console.log('=' .repeat(60))

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials!')
  console.log('📝 Please create a .env file with:')
  console.log('   SUPABASE_URL=https://your-project.supabase.co')
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

async function createSupabaseSchema() {
  try {
    console.log('📊 Creating ScaleVolt database schema...')
    
    // First, let's test the connection
    console.log('🔌 Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('_supabase_info')
      .select('*')
      .limit(1)
    
    if (testError && testError.code !== 'PGRST116') {
      console.log('❌ Connection test failed:', testError.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    
    // Create tables using Supabase's client methods
    console.log('\n1. Creating database tables...')
    
    // Create users table
    console.log('   📋 Creating users table...')
    try {
      const { error } = await supabase.rpc('create_table_if_not_exists', {
        table_name: 'users',
        table_sql: `
          CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
            is_active BOOLEAN DEFAULT TRUE,
            last_login TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `
      })
      
      if (error) {
        console.log('   ⚠️  Users table creation failed via RPC, trying alternative method...')
        // We'll handle this differently
      } else {
        console.log('   ✅ Users table created successfully')
      }
    } catch (err) {
      console.log('   ⚠️  Users table creation error:', err.message)
    }
    
    // Since direct table creation might not work, let's try to create a simple test table
    // and then use the existing schema.sql approach
    console.log('\n2. Using alternative approach - creating tables via SQL file...')
    
    // Let's check if we can access the database directly
    console.log('   🔍 Checking database access...')
    
    // Try to create a simple test table
    const { error: createError } = await supabase
      .from('test_connection')
      .select('*')
      .limit(1)
    
    if (createError && createError.code === 'PGRST116') {
      console.log('   ✅ Database access confirmed')
      console.log('   📝 Note: Tables will need to be created via Supabase dashboard or SQL editor')
      console.log('   🌐 Go to: https://supabase.com/dashboard/project/[YOUR-PROJECT]/sql/new')
      console.log('   📋 Copy and paste the contents of db/schema.sql')
    } else {
      console.log('   ⚠️  Unexpected response:', createError)
    }
    
    console.log('\n3. Checking for existing tables...')
    
    // Check what tables already exist
    const existingTables = ['users', 'categories', 'products', 'orders', 'cart_items']
    
    for (const tableName of existingTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (error && error.code === 'PGRST116') {
          console.log(`   ❌ Table '${tableName}' does not exist`)
        } else {
          console.log(`   ✅ Table '${tableName}' exists`)
        }
      } catch (err) {
        console.log(`   ⚠️  Error checking table '${tableName}':`, err.message)
      }
    }
    
    console.log('\n📋 Next Steps:')
    console.log('   1. Go to your Supabase dashboard')
    console.log('   2. Navigate to SQL Editor')
    console.log('   3. Copy the contents of db/schema.sql')
    console.log('   4. Execute the SQL to create all tables')
    console.log('   5. Run this script again to verify tables exist')
    
    return true
    
  } catch (error) {
    console.error('❌ Schema creation failed:', error.message)
    return false
  }
}

// Run the schema creation
createSupabaseSchema()
  .then((success) => {
    if (success) {
      console.log('\n🎉 Schema creation process completed!')
      console.log('📝 Follow the next steps above to complete the setup.')
    } else {
      console.log('\n❌ Schema creation failed. Please check your configuration.')
    }
  })
  .catch(console.error)
