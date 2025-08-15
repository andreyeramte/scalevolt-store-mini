const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Import and set fetch polyfill for Node.js
const fetch = require('node-fetch')
global.fetch = fetch

console.log('🧪 Testing SheetDB → Supabase Sync Setup')
console.log('=' .repeat(50))

// Configuration
const SHEETDB_URL = process.env.SHEETDB_URL
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Test results
const tests = {
  supabase: false,
  sheetdb: false,
  database: false,
  tables: false
}

async function testSupabaseConnection() {
  console.log('\n1. 🔌 Testing Supabase Connection...')
  
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.log('   ❌ Missing Supabase credentials in .env file')
      return false
    }
    
    console.log(`   📋 URL: ${SUPABASE_URL}`)
    console.log(`   🔑 Key: ${SUPABASE_KEY ? '[SET]' : '[NOT SET]'}`)
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    
    // Test connection using auth service
    const { error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1
    })
    
    if (authError) {
      console.log('   ❌ Supabase connection failed:', authError.message)
      return false
    }
    
    console.log('   ✅ Supabase connection successful!')
    tests.supabase = true
    return true
    
  } catch (error) {
    console.log('   ❌ Supabase test failed:', error.message)
    return false
  }
}

async function testSheetDBConnection() {
  console.log('\n2. 📥 Testing SheetDB Connection...')
  
  try {
    if (!SHEETDB_URL || SHEETDB_URL.includes('YOUR_API_KEY')) {
      console.log('   ❌ Missing or invalid SheetDB URL in .env file')
      console.log('   📝 Please set SHEETDB_URL=https://sheetdb.io/api/v1/your-actual-key')
      return false
    }
    
    console.log(`   📋 URL: ${SHEETDB_URL}`)
    
    // Test the SheetDB endpoint
    const response = await fetch(SHEETDB_URL)
    
    if (!response.ok) {
      console.log(`   ❌ SheetDB request failed: ${response.status} ${response.statusText}`)
      return false
    }
    
    const data = await response.json()
    
    if (!Array.isArray(data)) {
      console.log('   ❌ SheetDB returned invalid data format. Expected array.')
      return false
    }
    
    console.log(`   ✅ SheetDB connection successful!`)
    console.log(`   📊 Found ${data.length} records in your sheet`)
    
    if (data.length > 0) {
      console.log('   📋 Sample columns found:')
      const sampleRow = data[0]
      Object.keys(sampleRow).slice(0, 5).forEach(column => {
        console.log(`      - ${column}`)
      })
      if (Object.keys(sampleRow).length > 5) {
        console.log(`      ... and ${Object.keys(sampleRow).length - 5} more columns`)
      }
    }
    
    tests.sheetdb = true
    return true
    
  } catch (error) {
    console.log('   ❌ SheetDB test failed:', error.message)
    return false
  }
}

async function testDatabaseTables() {
  console.log('\n3. 📊 Testing Database Tables...')
  
  try {
    if (!tests.supabase) {
      console.log('   ❌ Skipping - Supabase connection failed')
      return false
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    
    // Check if required tables exist
    const requiredTables = ['products', 'categories']
    const tableStatus = {}
    
    for (const tableName of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (error && error.code === 'PGRST116') {
          tableStatus[tableName] = false
        } else {
          tableStatus[tableName] = true
        }
      } catch (err) {
        tableStatus[tableName] = false
      }
    }
    
    // Display results
    let allTablesExist = true
    for (const [tableName, exists] of Object.entries(tableStatus)) {
      if (exists) {
        console.log(`   ✅ Table '${tableName}' exists`)
      } else {
        console.log(`   ❌ Table '${tableName}' missing`)
        allTablesExist = false
      }
    }
    
    if (allTablesExist) {
      console.log('   ✅ All required tables exist!')
      tests.tables = true
      return true
    } else {
      console.log('   ❌ Some required tables are missing')
      console.log('   📝 Please create tables first using setup-database-steps.md')
      return false
    }
    
  } catch (error) {
    console.log('   ❌ Database test failed:', error.message)
    return false
  }
}

async function testDataInsert() {
  console.log('\n4. 📝 Testing Data Insert Capability...')
  
  try {
    if (!tests.supabase || !tests.tables) {
      console.log('   ❌ Skipping - Prerequisites not met')
      return false
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    
    // Try to insert a test product
    const testProduct = {
      sku: 'TEST-SYNC-' + Date.now(),
      name: 'Test Product for Sync',
      description: 'This is a test product to verify insert capability',
      price: 99.99,
      stock_quantity: 1
    }
    
    const { data: insertedProduct, error: insertError } = await supabase
      .from('products')
      .insert(testProduct)
      .select()
    
    if (insertError) {
      console.log('   ❌ Test insert failed:', insertError.message)
      return false
    }
    
    console.log('   ✅ Test insert successful!')
    
    // Clean up test data
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('sku', testProduct.sku)
    
    if (deleteError) {
      console.log('   ⚠️  Could not clean up test data:', deleteError.message)
    } else {
      console.log('   🧹 Test data cleaned up')
    }
    
    tests.database = true
    return true
    
  } catch (error) {
    console.log('   ❌ Data insert test failed:', error.message)
    return false
  }
}

async function runAllTests() {
  console.log('🚀 Running all tests...\n')
  
  await testSupabaseConnection()
  await testSheetDBConnection()
  await testDatabaseTables()
  await testDataInsert()
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(50))
  
  const testResults = [
    { name: 'Supabase Connection', status: tests.supabase },
    { name: 'SheetDB Connection', status: tests.sheetdb },
    { name: 'Database Tables', status: tests.tables },
    { name: 'Data Insert', status: tests.database }
  ]
  
  testResults.forEach(test => {
    const icon = test.status ? '✅' : '❌'
    const status = test.status ? 'PASS' : 'FAIL'
    console.log(`${icon} ${test.name.padEnd(25)} - ${status}`)
  })
  
  const allPassed = Object.values(tests).every(test => test)
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! You\'re ready to sync.')
    console.log('\n📋 Next Steps:')
    console.log('   1. Run the full sync: node sync-sheetdb-to-supabase.js')
    console.log('   2. Verify data in Supabase')
    console.log('   3. Test your backend API')
  } else {
    console.log('\n❌ Some tests failed. Please fix the issues above.')
    console.log('\n🔧 Required Actions:')
    
    if (!tests.supabase) {
      console.log('   - Check your .env file has correct Supabase credentials')
    }
    if (!tests.sheetdb) {
      console.log('   - Set up SheetDB and add SHEETDB_URL to .env')
    }
    if (!tests.tables) {
      console.log('   - Create database tables using setup-database-steps.md')
    }
    if (!tests.database) {
      console.log('   - Fix database table structure issues')
    }
  }
  
  return allPassed
}

// Run the tests
runAllTests()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Your sync setup is ready!')
    } else {
      console.log('\n❌ Setup incomplete. Please fix the issues above.')
    }
  })
  .catch(console.error)
