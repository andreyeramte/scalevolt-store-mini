const { pool } = require('../db/pool');
require('dotenv').config();

console.log('🔍 Testing connections...\n');

// Test Supabase connection
async function testSupabase() {
  console.log('📊 Testing Supabase connection...');
  
  try {
    const result = await pool.query('SELECT 1 as test');
    console.log('✅ Supabase connection successful');
    console.log('   Database: Connected');
    console.log('   Project: xkkiybeiktoqzbmlorja.supabase.co');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    console.log('   💡 Make sure you have:');
    console.log('   1. Updated SUPABASE_DB_URL with your actual password');
    console.log('   2. Removed square brackets from SUPABASE_URL');
    console.log('   3. Removed square brackets from API keys');
    return false;
  }
}

// Test environment variables
function testEnvironmentVariables() {
  console.log('\n🔧 Testing environment variables...');
  
  const requiredVars = [
    'SUPABASE_DB_URL',
    'SUPABASE_URL', 
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  let allGood = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      console.error(`❌ Missing: ${varName}`);
      allGood = false;
    } else if (value.includes('[YOUR') || value.includes('[postgres]')) {
      console.error(`❌ Placeholder value: ${varName}`);
      allGood = false;
    } else {
      console.log(`✅ ${varName}: ${value.substring(0, 50)}...`);
    }
  });
  
  return allGood;
}

// Test Firebase variables (for frontend)
function testFirebaseVariables() {
  console.log('\n🔥 Testing Firebase variables (for frontend)...');
  
  const firebaseVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
  ];
  
  let firebaseConfigured = true;
  
  firebaseVars.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.includes('your-') || value.includes('placeholder')) {
      console.warn(`⚠️  ${varName}: Not configured (optional for backend)`);
      firebaseConfigured = false;
    } else {
      console.log(`✅ ${varName}: Configured`);
    }
  });
  
  return firebaseConfigured;
}

// Main test function
async function runTests() {
  console.log('🚀 ScaleVolt Connection Tests\n');
  
  const envVarsOk = testEnvironmentVariables();
  const supabaseOk = await testSupabase();
  const firebaseOk = testFirebaseVariables();
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 Test Results:');
  console.log('='.repeat(50));
  
  if (envVarsOk && supabaseOk) {
    console.log('✅ All backend connections successful!');
    console.log('🎉 Your backend is ready to use with Supabase');
  } else {
    console.log('❌ Some connections failed');
    console.log('🔧 Please fix the issues above and try again');
  }
  
  if (firebaseOk) {
    console.log('🔥 Firebase is configured for frontend');
  } else {
    console.log('⚠️  Firebase not configured (optional)');
  }
  
  console.log('\n📝 Next steps:');
  console.log('1. If Supabase is connected, run the database schema');
  console.log('2. Start your backend: npm start');
  console.log('3. Configure Firebase for frontend authentication');
  
  process.exit(envVarsOk && supabaseOk ? 0 : 1);
}

// Run the tests
runTests().catch(console.error);
