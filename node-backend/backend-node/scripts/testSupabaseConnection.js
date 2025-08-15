#!/usr/bin/env node

const { supabase, utilityService } = require('../services/supabaseService')
const chalk = require('chalk')

console.log(chalk.blue('🔧 Testing Supabase Connection...'))
console.log(chalk.gray('='.repeat(50)))

async function testSupabaseConnection() {
  try {
    // Test 1: Basic connection
    console.log(chalk.yellow('1. Testing basic connection...'))
    const connectionTest = await utilityService.testConnection()
    
    if (connectionTest.connected) {
      console.log(chalk.green('   ✅ Basic connection successful'))
    } else {
      console.log(chalk.red('   ❌ Basic connection failed:'), connectionTest.error?.message)
      return false
    }

    // Test 2: Check if we can query system tables
    console.log(chalk.yellow('2. Testing database access...'))
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(5)
      
      if (error) {
        console.log(chalk.red('   ❌ Database access failed:'), error.message)
      } else {
        console.log(chalk.green('   ✅ Database access successful'))
        console.log(chalk.gray('   Found tables:'), data.map(t => t.table_name).join(', '))
      }
    } catch (err) {
      console.log(chalk.red('   ❌ Database access failed:'), err.message)
    }

    // Test 3: Test authentication functions
    console.log(chalk.yellow('3. Testing authentication functions...'))
    try {
      const { data, error } = await supabase.auth.getSession()
      console.log(chalk.green('   ✅ Auth functions accessible'))
    } catch (err) {
      console.log(chalk.red('   ❌ Auth functions failed:'), err.message)
    }

    // Test 4: Test storage functions
    console.log(chalk.yellow('4. Testing storage functions...'))
    try {
      const { data, error } = await supabase.storage.listBuckets()
      if (error) {
        console.log(chalk.red('   ❌ Storage access failed:'), error.message)
      } else {
        console.log(chalk.green('   ✅ Storage functions accessible'))
        console.log(chalk.gray('   Available buckets:'), data.map(b => b.name).join(', ') || 'None')
      }
    } catch (err) {
      console.log(chalk.red('   ❌ Storage functions failed:'), err.message)
    }

    // Test 5: Environment variables check
    console.log(chalk.yellow('5. Checking environment variables...'))
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      console.log(chalk.red('   ❌ SUPABASE_URL not configured properly'))
      console.log(chalk.gray('   Current value:'), supabaseUrl || 'Not set')
    } else {
      console.log(chalk.green('   ✅ SUPABASE_URL configured'))
    }

    if (!supabaseKey || supabaseKey.includes('your-supabase')) {
      console.log(chalk.red('   ❌ SUPABASE_SERVICE_ROLE_KEY not configured properly'))
      console.log(chalk.gray('   Current value:'), supabaseKey ? '[HIDDEN]' : 'Not set')
    } else {
      console.log(chalk.green('   ✅ SUPABASE_SERVICE_ROLE_KEY configured'))
    }

    console.log(chalk.gray('='.repeat(50)))
    
    if (connectionTest.connected) {
      console.log(chalk.green.bold('🎉 Supabase connection test completed!'))
      console.log(chalk.blue('📝 Next steps:'))
      console.log(chalk.gray('   1. Update your .env files with actual Supabase credentials'))
      console.log(chalk.gray('   2. Create your database tables'))
      console.log(chalk.gray('   3. Set up Row Level Security (RLS) policies'))
      console.log(chalk.gray('   4. Configure authentication providers'))
      return true
    } else {
      console.log(chalk.red.bold('❌ Supabase connection test failed'))
      return false
    }

  } catch (error) {
    console.log(chalk.red('❌ Unexpected error during connection test:'))
    console.error(error)
    return false
  }
}

// Run the test
if (require.main === module) {
  testSupabaseConnection()
    .then((success) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error(chalk.red('Fatal error:'), error)
      process.exit(1)
    })
}

module.exports = { testSupabaseConnection }
