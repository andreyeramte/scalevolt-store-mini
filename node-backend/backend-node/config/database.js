// FILE: config/database.js
// Database configuration and connection management

const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Database configuration
const dbConfig = {
  development: {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE || 'scalevolt_dev',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  },
  production: {
    host: process.env.PGHOST,
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  test: {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE || 'scalevolt_test',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    ssl: false,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 1000,
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';
const config = dbConfig[environment];

// Create pool instance
let pool = null;

// Initialize database connection
function initializeDatabase() {
  try {
    console.log(`🔧 Initializing database connection for ${environment} environment...`);
    
    pool = new Pool(config);
    
    // Test the connection
    return pool.query('SELECT NOW() as current_time, version() as db_version')
      .then(result => {
        console.log('✅ Database connected successfully');
        console.log('📅 Database time:', result.rows[0].current_time);
        console.log('🗄️  Database version:', result.rows[0].db_version.split(' ')[0]);
        
        // Initialize database schema
        return initializeSchema();
      })
      .catch(error => {
        console.error('❌ Database connection failed:', error.message);
        console.log('⚠️  Running in mock mode - database not connected');
        pool = null;
        return false;
      });
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.log('⚠️  Running in mock mode - database not connected');
    pool = null;
    return false;
  }
}

// Initialize database schema
async function initializeSchema() {
  if (!pool) return false;
  
  try {
    console.log('🔧 Initializing database schema...');
    
    // Create tables if they don't exist
    await createTables();
    
    // Insert initial data if tables are empty
    await insertInitialData();
    
    console.log('✅ Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Schema initialization failed:', error);
    return false;
  }
}

// Create database tables
async function createTables() {
  const tables = [
    // Categories table
    `CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      name_ua VARCHAR(255),
      name_pl VARCHAR(255),
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      description_ua TEXT,
      description_pl TEXT,
      image_url VARCHAR(500),
      parent_id INTEGER REFERENCES categories(id),
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Products table
    `CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      sku VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      name_ua VARCHAR(255),
      name_pl VARCHAR(255),
      description TEXT,
      description_ua TEXT,
      description_pl TEXT,
      short_description VARCHAR(500),
      short_description_ua VARCHAR(500),
      short_description_pl VARCHAR(500),
      price DECIMAL(10,2) NOT NULL,
      sale_price DECIMAL(10,2),
      cost_price DECIMAL(10,2),
      stock_quantity INTEGER DEFAULT 0,
      min_stock_level INTEGER DEFAULT 0,
      weight DECIMAL(8,3),
      dimensions JSONB,
      category_id INTEGER REFERENCES categories(id),
      brand VARCHAR(100),
      model VARCHAR(100),
      specifications JSONB,
      images JSONB,
      is_featured BOOLEAN DEFAULT false,
      is_active BOOLEAN DEFAULT true,
      meta_title VARCHAR(255),
      meta_description TEXT,
      meta_keywords TEXT,
      searchable_text TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      role VARCHAR(50) DEFAULT 'user',
      is_active BOOLEAN DEFAULT true,
      email_verified BOOLEAN DEFAULT false,
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Orders table
    `CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_number VARCHAR(50) UNIQUE NOT NULL,
      user_id INTEGER REFERENCES users(id),
      status VARCHAR(50) DEFAULT 'pending',
      total_amount DECIMAL(10,2) NOT NULL,
      shipping_address JSONB,
      billing_address JSONB,
      payment_method VARCHAR(50),
      payment_status VARCHAR(50) DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Order items table
    `CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Search history table
    `CREATE TABLE IF NOT EXISTS search_history (
      id SERIAL PRIMARY KEY,
      query VARCHAR(255) NOT NULL,
      user_id INTEGER REFERENCES users(id),
      results_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];
  
  for (const tableQuery of tables) {
    await pool.query(tableQuery);
  }
  
  // Create indexes for better performance
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)',
    'CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active)',
    'CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured)',
    'CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector(\'english\', searchable_text))',
    'CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)',
    'CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)',
    'CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query)',
    'CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id)'
  ];
  
  for (const indexQuery of indexes) {
    await pool.query(indexQuery);
  }
}

// Insert initial data
async function insertInitialData() {
  try {
    // Check if categories table is empty
    const categoryCount = await pool.query('SELECT COUNT(*) FROM categories');
    if (parseInt(categoryCount.rows[0].count) === 0) {
      console.log('📝 Inserting initial categories...');
      
      const categories = [
        {
          name: 'Solar Panels',
          name_ua: 'Сонячні панелі',
          name_pl: 'Panele słoneczne',
          slug: 'solar-panels',
          description: 'High-efficiency solar panels for residential and commercial installations',
          description_ua: 'Високоефективні сонячні панелі для житлового та комерційного використання',
          description_pl: 'Wysokowydajne panele słoneczne do zastosowań mieszkalnych i komercyjnych'
        },
        {
          name: 'Batteries',
          name_ua: 'Акумулятори',
          name_pl: 'Baterie',
          slug: 'batteries',
          description: 'Lithium batteries for solar energy storage',
          description_ua: 'Літієві акумулятори для зберігання сонячної енергії',
          description_pl: 'Baterie litowe do magazynowania energii słonecznej'
        },
        {
          name: 'Inverters',
          name_ua: 'Інвертори',
          name_pl: 'Inwertery',
          slug: 'inverters',
          description: 'Solar inverters for converting DC to AC power',
          description_ua: 'Сонячні інвертори для перетворення постійного струму в змінний',
          description_pl: 'Inwertery słoneczne do konwersji prądu stałego na przemienny'
        },
        {
          name: 'EV Chargers',
          name_ua: 'Зарядні станції',
          name_pl: 'Stacje ładowania',
          slug: 'ev-chargers',
          description: 'Electric vehicle charging stations',
          description_ua: 'Зарядні станції для електромобілів',
          description_pl: 'Stacje ładowania pojazdów elektrycznych'
        }
      ];
      
      for (const category of categories) {
        await pool.query(`
          INSERT INTO categories (name, name_ua, name_pl, slug, description, description_ua, description_pl)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [category.name, category.name_ua, category.name_pl, category.slug, 
            category.description, category.description_ua, category.description_pl]);
      }
    }
    
    // Check if products table is empty
    const productCount = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(productCount.rows[0].count) === 0) {
      console.log('📝 Inserting initial products...');
      
      const products = [
        {
          sku: 'SP-100W-001',
          name: 'Solar Panel 100W',
          name_ua: 'Сонячна панель 100W',
          name_pl: 'Panel słoneczny 100W',
          description: 'High-efficiency solar panel for residential use',
          description_ua: 'Високоефективна сонячна панель для домашнього використання',
          description_pl: 'Wysokowydajny panel słoneczny do użytku domowego',
          price: 150.00,
          stock_quantity: 10,
          brand: 'ScaleVolt',
          model: 'SP-100W'
        },
        {
          sku: 'BP-24V-100Ah-001',
          name: 'Battery Pack 24V 100Ah',
          name_ua: 'Акумуляторна батарея 24V 100Ah',
          name_pl: 'Pakiet baterii 24V 100Ah',
          description: 'Lithium battery pack for solar systems',
          description_ua: 'Літієва акумуляторна батарея для сонячних систем',
          description_pl: 'Pakiet baterii litowych do systemów słonecznych',
          price: 800.00,
          stock_quantity: 5,
          brand: 'ScaleVolt',
          model: 'BP-24V-100Ah'
        },
        {
          sku: 'INV-1000W-001',
          name: 'Inverter 1000W Pure Sine Wave',
          name_ua: 'Інвертор 1000W чиста синусоїда',
          name_pl: 'Inwerter 1000W czysta sinusoida',
          description: 'Pure sine wave inverter for sensitive electronics',
          description_ua: 'Інвертор з чистою синусоїдою для чутливої електроніки',
          description_pl: 'Inwerter z czystą sinusoidą dla wrażliwej elektroniki',
          price: 300.00,
          stock_quantity: 8,
          brand: 'ScaleVolt',
          model: 'INV-1000W'
        },
        {
          sku: 'EV-L2-001',
          name: 'EV Charging Station Level 2',
          name_ua: 'Зарядна станція рівня 2',
          name_pl: 'Stacja ładowania poziom 2',
          description: 'Level 2 electric vehicle charging station',
          description_ua: 'Зарядна станція рівня 2 для електромобілів',
          description_pl: 'Stacja ładowania poziom 2 dla pojazdów elektrycznych',
          price: 1200.00,
          stock_quantity: 3,
          brand: 'ScaleVolt',
          model: 'EV-L2'
        }
      ];
      
      for (const product of products) {
        await pool.query(`
          INSERT INTO products (sku, name, name_ua, name_pl, description, description_ua, description_pl, 
                              price, stock_quantity, brand, model, searchable_text)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [product.sku, product.name, product.name_ua, product.name_pl, 
            product.description, product.description_ua, product.description_pl,
            product.price, product.stock_quantity, product.brand, product.model,
            `${product.name} ${product.description} ${product.brand} ${product.model}`.toLowerCase()]);
      }
    }
    
    // Check if admin user exists
    const userCount = await pool.query('SELECT COUNT(*) FROM users WHERE email = $1', ['admin@scalevolt.com']);
    if (parseInt(userCount.rows[0].count) === 0) {
      console.log('📝 Creating admin user...');
      
      // In production, you should hash the password properly
      await pool.query(`
        INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, ['admin@scalevolt.com', 'admin123', 'Admin', 'User', 'admin', true]);
    }
    
  } catch (error) {
    console.error('❌ Error inserting initial data:', error);
  }
}

// Get database pool
function getPool() {
  return pool;
}

// Check if database is connected
function isConnected() {
  return pool !== null;
}

// Close database connection
async function closeConnection() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('🔌 Database connection closed');
  }
}

module.exports = {
  initializeDatabase,
  getPool,
  isConnected,
  closeConnection,
  config
}; 