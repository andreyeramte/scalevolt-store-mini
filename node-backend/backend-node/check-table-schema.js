require('dotenv').config();
const { supabase } = require('./config/supabase');

async function checkTableSchema() {
  try {
    console.log('🔧 Checking products table schema...');
    
    // Try to get one row to see the structure
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error accessing products table:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Products table accessible');
      console.log('📋 Table columns:');
      Object.keys(data[0]).forEach(column => {
        console.log(`  - ${column}: ${typeof data[0][column]}`);
      });
    } else {
      console.log('📋 Products table is empty but accessible');
      
      // Try to insert a minimal product to see what columns are required
      const testProduct = {
        name: 'Test Product',
        sku: 'TEST-001',
        slug: 'test-product',
        category: 'test',
        price: 100,
        wholesale_price: 80,
        currency: 'USD',
        stock: 10,
        brand: { en: 'TestBrand', ua: 'TestBrand', pl: 'TestBrand' },
        description: { en: 'Test description', ua: 'Test description', pl: 'Test description' },
        weight_kg: 5.0,
        dimensions_cm: { en: '10x10x10', ua: '10x10x10', pl: '10x10x10' },
        image_url: { en: '/test.jpg', ua: '/test.jpg', pl: '/test.jpg' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: inserted, error: insertError } = await supabase
        .from('products')
        .insert(testProduct)
        .select();
      
      if (insertError) {
        console.log('❌ Error inserting test product:', insertError.message);
      } else {
        console.log('✅ Test product inserted successfully');
        console.log('📋 Available columns:');
        Object.keys(inserted[0]).forEach(column => {
          console.log(`  - ${column}: ${typeof inserted[0][column]}`);
        });
        
        // Clean up test product
        await supabase
          .from('products')
          .delete()
          .eq('name', 'Test Product');
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking table schema:', error);
  }
}

checkTableSchema();
