import { supabaseUtils } from '../services/supabaseService.js'

// Test Supabase connection from frontend
export async function testSupabaseConnection() {
  console.log('🔧 Testing Supabase Connection from Frontend...')
  
  const results = {
    connection: false,
    auth: false,
    storage: false,
    config: false,
    errors: []
  }

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...')
    const connectionTest = await supabaseUtils.testConnection()
    
    if (connectionTest.connected) {
      console.log('   ✅ Basic connection successful')
      results.connection = true
    } else {
      console.log('   ❌ Basic connection failed:', connectionTest.error?.message)
      results.errors.push('Basic connection failed: ' + connectionTest.error?.message)
    }

    // Test 2: Test authentication functions
    console.log('2. Testing authentication functions...')
    try {
      const { data, error } = await supabase.auth.getSession()
      console.log('   ✅ Auth functions accessible')
      results.auth = true
    } catch (err) {
      console.log('   ❌ Auth functions failed:', err.message)
      results.errors.push('Auth functions failed: ' + err.message)
    }

    // Test 3: Test storage functions
    console.log('3. Testing storage functions...')
    try {
      const { data, error } = await supabase.storage.listBuckets()
      if (error) {
        console.log('   ❌ Storage access failed:', error.message)
        results.errors.push('Storage access failed: ' + error.message)
      } else {
        console.log('   ✅ Storage functions accessible')
        console.log('   Available buckets:', data.map(b => b.name).join(', ') || 'None')
        results.storage = true
      }
    } catch (err) {
      console.log('   ❌ Storage functions failed:', err.message)
      results.errors.push('Storage functions failed: ' + err.message)
    }

    // Test 4: Environment variables check
    console.log('4. Checking environment variables...')
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      console.log('   ❌ VITE_SUPABASE_URL not configured properly')
      console.log('   Current value:', supabaseUrl || 'Not set')
      results.errors.push('VITE_SUPABASE_URL not configured properly')
    } else {
      console.log('   ✅ VITE_SUPABASE_URL configured')
    }

    if (!supabaseKey || supabaseKey.includes('your-supabase')) {
      console.log('   ❌ VITE_SUPABASE_ANON_KEY not configured properly')
      results.errors.push('VITE_SUPABASE_ANON_KEY not configured properly')
    } else {
      console.log('   ✅ VITE_SUPABASE_ANON_KEY configured')
      results.config = true
    }

    // Overall result
    const allTestsPassed = results.connection && results.auth && results.storage && results.config
    
    if (allTestsPassed) {
      console.log('🎉 All Supabase tests passed!')
    } else {
      console.log('⚠️ Some Supabase tests failed. Check the errors above.')
    }

    return {
      success: allTestsPassed,
      results,
      errors: results.errors
    }

  } catch (error) {
    console.error('❌ Unexpected error during connection test:', error)
    results.errors.push('Unexpected error: ' + error.message)
    return {
      success: false,
      results,
      errors: results.errors
    }
  }
}

// Helper function to display connection status in UI
export function getConnectionStatus() {
  return testSupabaseConnection()
}

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  return !!(
    supabaseUrl && 
    supabaseKey && 
    !supabaseUrl.includes('your-project') && 
    !supabaseKey.includes('your-supabase')
  )
}

export default {
  testSupabaseConnection,
  getConnectionStatus,
  isSupabaseConfigured
}
