require('dotenv').config();
const { supabase } = require('./config/supabase');

// Sample products data
const products = [
  {
    name: 'Solar Panel 100W',
    sku: 'SP-100W-001',
    slug: 'solar-panel-100w',
    category: 'solar-panels',
    brand: 'ScaleVolt',
    description: 'High efficiency solar panel for residential use',
    price: 150.00,
    wholesale_price: 120.00,
    currency: 'USD',
    stock: 10,
    weight_kg: 8.5,
    dimensions_cm: '100 x 50 x 3',
    image_url: '/images/solar-panel-100w.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: 'Battery Pack 24V 100Ah',
    sku: 'BP-24V-100Ah-001',
    slug: 'battery-pack-24v-100ah',
    category: 'batteries',
    brand: 'ScaleVolt',
    description: 'Lithium battery pack for solar systems',
    price: 800.00,
    wholesale_price: 640.00,
    currency: 'USD',
    stock: 5,
    weight_kg: 25.0,
    dimensions_cm: '30 x 20 x 15',
    image_url: '/images/battery-pack-24v-100ah.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: 'Inverter 1000W Pure Sine Wave',
    sku: 'INV-1000W-001',
    slug: 'inverter-1000w-pure-sine-wave',
    category: 'inverters',
    brand: 'ScaleVolt',
    description: 'Pure sine wave inverter for sensitive electronics',
    price: 300.00,
    wholesale_price: 240.00,
    currency: 'USD',
    stock: 8,
    weight_kg: 2.5,
    dimensions_cm: '20 x 15 x 8',
    image_url: '/images/inverter-1000w.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: 'EV Charging Station Level 2',
    sku: 'EV-L2-001',
    slug: 'ev-charging-station-level-2',
    category: 'ev-chargers',
    brand: 'ScaleVolt',
    description: 'Level 2 electric vehicle charging station',
    price: 1200.00,
    wholesale_price: 960.00,
    currency: 'USD',
    stock: 3,
    weight_kg: 15.0,
    dimensions_cm: '40 x 25 x 10',
    image_url: '/images/ev-charging-station-l2.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function populateProducts() {
  try {
    console.log('🔧 Populating products table with sample data...');
    
    // First, let's check if the table exists and has the right structure
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.log('❌ Error checking products table:', checkError.message);
      console.log('This might mean the table needs to be created first.');
      return;
    }
    
    console.log('✅ Products table exists and is accessible');
    
    // Check if products already exist
    if (existingProducts && existingProducts.length > 0) {
      console.log('⚠️ Products table already has data. Clearing existing data...');
      
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .neq('id', 0); // Delete all records
      
      if (deleteError) {
        console.error('❌ Error clearing products:', deleteError);
        return;
      }
      
      console.log('✅ Existing products cleared');
    }
    
    // Insert new products
    const { data: insertedProducts, error: insertError } = await supabase
      .from('products')
      .insert(products)
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting products:', insertError);
      return;
    }
    
    console.log('✅ Successfully inserted', insertedProducts.length, 'products');
    console.log('📦 Products added:');
    insertedProducts.forEach(product => {
      console.log(`  - ${product.name} (${product.sku}) - $${product.price}`);
    });
    
  } catch (error) {
    console.error('❌ Error populating products:', error);
  }
}

populateProducts();
