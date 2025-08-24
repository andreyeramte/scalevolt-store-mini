require('dotenv').config();
const { supabase, db, utils } = require('./config/supabase');

async function testSupabase() {
  console.log('🔧 Testing Supabase connection...');
  
  // Test basic connection
  const connectionTest = await utils.testConnection();
  console.log('Connection test:', connectionTest);
  
  // Test if products table exists
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Products table error:', error.message);
      
      // Check what tables exist
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_tables');
      
      if (tablesError) {
        console.log('❌ Could not get tables list:', tablesError.message);
      } else {
        console.log('📋 Available tables:', tables);
      }
    } else {
      console.log('✅ Products table exists and accessible');
      console.log('📦 Sample product:', data);
    }
  } catch (error) {
    console.error('❌ Error testing products table:', error);
  }
}

testSupabase().catch(console.error);
