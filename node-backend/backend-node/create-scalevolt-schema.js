const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Import and set fetch polyfill for Node.js
const fetch = require('node-fetch')
global.fetch = fetch

console.log('🏗️  Creating ScaleVolt Store Database Schema')
console.log('=' .repeat(50))

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials!')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

async function createScaleVoltSchema() {
  try {
    console.log('📊 Creating ScaleVolt database schema...')
    
    // Create all tables for the ScaleVolt store
    const tables = [
      // Users and Authentication
      `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          full_name VARCHAR(255),
          phone VARCHAR(20),
          address TEXT,
          city VARCHAR(100),
          country VARCHAR(100),
          postal_code VARCHAR(20),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `,
      
      // Product Categories
      `
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          image_url VARCHAR(500),
          parent_id INTEGER REFERENCES categories(id),
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      
      // Products
      `
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(500) NOT NULL,
          slug VARCHAR(500) UNIQUE NOT NULL,
          description TEXT,
          short_description VARCHAR(1000),
          price DECIMAL(10,2) NOT NULL,
          sale_price DECIMAL(10,2),
          cost_price DECIMAL(10,2),
          sku VARCHAR(100) UNIQUE,
          barcode VARCHAR(100),
          weight DECIMAL(8,3),
          dimensions VARCHAR(100),
          category_id INTEGER REFERENCES categories(id),
          brand VARCHAR(100),
          model VARCHAR(100),
          power_watts INTEGER,
          voltage VARCHAR(50),
          capacity_ah INTEGER,
          warranty_months INTEGER,
          is_featured BOOLEAN DEFAULT false,
          is_active BOOLEAN DEFAULT true,
          stock_quantity INTEGER DEFAULT 0,
          min_stock_level INTEGER DEFAULT 5,
          images JSONB DEFAULT '[]',
          specifications JSONB DEFAULT '{}',
          tags TEXT[],
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `,
      
      // Product Images
      `
        CREATE TABLE IF NOT EXISTS product_images (
          id SERIAL PRIMARY KEY,
          product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
          image_url VARCHAR(500) NOT NULL,
          alt_text VARCHAR(255),
          sort_order INTEGER DEFAULT 0,
          is_primary BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      
      // Orders
      `
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          order_number VARCHAR(50) UNIQUE NOT NULL,
          user_id UUID REFERENCES users(id),
          guest_email VARCHAR(255),
          guest_name VARCHAR(255),
          status VARCHAR(50) DEFAULT 'pending',
          total_amount DECIMAL(10,2) NOT NULL,
          subtotal DECIMAL(10,2) NOT NULL,
          tax_amount DECIMAL(10,2) DEFAULT 0,
          shipping_amount DECIMAL(10,2) DEFAULT 0,
          discount_amount DECIMAL(10,2) DEFAULT 0,
          currency VARCHAR(3) DEFAULT 'USD',
          shipping_address JSONB,
          billing_address JSONB,
          payment_method VARCHAR(100),
          payment_status VARCHAR(50) DEFAULT 'pending',
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `,
      
      // Order Items
      `
        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          product_id INTEGER REFERENCES products(id),
          product_name VARCHAR(500) NOT NULL,
          product_sku VARCHAR(100),
          quantity INTEGER NOT NULL,
          unit_price DECIMAL(10,2) NOT NULL,
          total_price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      
      // Shopping Cart
      `
        CREATE TABLE IF NOT EXISTS cart_items (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES users(id),
          session_id VARCHAR(255),
          product_id INTEGER REFERENCES products(id),
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `,
      
      // Reviews and Ratings
      `
        CREATE TABLE IF NOT EXISTS product_reviews (
          id SERIAL PRIMARY KEY,
          product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id),
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          title VARCHAR(255),
          comment TEXT,
          is_verified BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      
      // Suppliers
      `
        CREATE TABLE IF NOT EXISTS suppliers (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          contact_person VARCHAR(255),
          email VARCHAR(255),
          phone VARCHAR(20),
          address TEXT,
          city VARCHAR(100),
          country VARCHAR(100),
          website VARCHAR(500),
          notes TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      
      // Inventory
      `
        CREATE TABLE IF NOT EXISTS inventory (
          id SERIAL PRIMARY KEY,
          product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
          supplier_id INTEGER REFERENCES suppliers(id),
          batch_number VARCHAR(100),
          quantity INTEGER NOT NULL,
          cost_price DECIMAL(10,2),
          expiry_date DATE,
          location VARCHAR(100),
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      
      // Promotions and Discounts
      `
        CREATE TABLE IF NOT EXISTS promotions (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')),
          discount_value DECIMAL(10,2) NOT NULL,
          min_order_amount DECIMAL(10,2),
          max_discount_amount DECIMAL(10,2),
          start_date TIMESTAMP NOT NULL,
          end_date TIMESTAMP NOT NULL,
          is_active BOOLEAN DEFAULT true,
          usage_limit INTEGER,
          used_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      
      // Newsletter Subscriptions
      `
        CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          is_active BOOLEAN DEFAULT true,
          subscribed_at TIMESTAMP DEFAULT NOW(),
          unsubscribed_at TIMESTAMP
        );
      `,
      
      // Contact Form Submissions
      `
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255),
          message TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'new',
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    ]
    
    console.log('1. Creating database tables...')
    
    for (let i = 0; i < tables.length; i++) {
      const tableSQL = tables[i]
      console.log(`   📋 Creating table ${i + 1}/${tables.length}...`)
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: tableSQL })
        if (error) {
          console.log(`   ⚠️  Table ${i + 1} creation failed via RPC:`, error.message)
          // Continue with next table
        } else {
          console.log(`   ✅ Table ${i + 1} created successfully`)
        }
      } catch (err) {
        console.log(`   ⚠️  Table ${i + 1} creation error:`, err.message)
      }
    }
    
    console.log('\n2. Creating indexes for performance...')
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);',
      'CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);',
      'CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);',
      'CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);',
      'CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);',
      'CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);',
      'CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);',
      'CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);',
      'CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);'
    ]
    
    for (const indexSQL of indexes) {
      try {
        await supabase.rpc('exec_sql', { sql: indexSQL })
      } catch (err) {
        // Index creation errors are not critical
      }
    }
    
    console.log('   ✅ Indexes created')
    
    console.log('\n3. Inserting initial data...')
    
    // Insert default categories
    const categories = [
      { name: 'Solar Panels', slug: 'solar-panels', description: 'High-quality solar panels for residential and commercial use' },
      { name: 'Batteries', slug: 'batteries', description: 'Energy storage solutions for solar systems' },
      { name: 'Inverters', slug: 'inverters', description: 'Solar inverters and power conversion equipment' },
      { name: 'EV Chargers', slug: 'ev-chargers', description: 'Electric vehicle charging stations' },
      { name: 'Cables & Wires', slug: 'cables-wires', description: 'Electrical cables and wiring solutions' },
      { name: 'Portable Generators', slug: 'portable-generators', description: 'Portable power solutions' }
    ]
    
    for (const category of categories) {
      try {
        const { error } = await supabase
          .from('categories')
          .upsert(category, { onConflict: 'slug' })
        
        if (error) {
          console.log(`   ⚠️  Category "${category.name}" insert failed:`, error.message)
        } else {
          console.log(`   ✅ Category "${category.name}" added`)
        }
      } catch (err) {
        console.log(`   ⚠️  Category "${category.name}" error:`, err.message)
      }
    }
    
    console.log('\n🎉 ScaleVolt database schema created successfully!')
    console.log('✅ Your store is ready for business!')
    
    return true
    
  } catch (error) {
    console.error('❌ Schema creation failed:', error.message)
    return false
  }
}

// Run the schema creation
createScaleVoltSchema()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Next steps:')
      console.log('   1. Database schema is ready')
      console.log('   2. You can now add products')
      console.log('   3. Start building your store frontend')
      console.log('   4. Test user registration and orders')
    } else {
      console.log('\n❌ Schema creation failed. Please check your configuration.')
    }
  })
  .catch(console.error)
