# 🚀 Complete Database Setup Guide for ScaleVolt Store

## Current Status
✅ **Supabase Connection**: Working perfectly  
✅ **Products Table**: Exists but needs proper structure  
❌ **Missing Tables**: categories, users, orders, cart_items, suppliers, etc.  

## Step 1: Create Database Tables

### Option A: Use Supabase Dashboard (Recommended)
1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `scalevolt-store`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the Schema**
   - Copy the entire contents of `db/schema.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute

### Option B: Use the Simplified Schema (Alternative)
If the full schema has issues, use this simplified version:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_ua VARCHAR(255),
    name_pl VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    description_ua TEXT,
    description_pl TEXT,
    parent_id UUID REFERENCES categories(id),
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table (recreate with proper structure)
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_ua VARCHAR(255),
    name_pl VARCHAR(255),
    description TEXT,
    description_ua TEXT,
    description_pl TEXT,
    short_description TEXT,
    short_description_ua TEXT,
    short_description_pl TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER,
    is_in_stock BOOLEAN DEFAULT TRUE,
    allow_backorders BOOLEAN DEFAULT FALSE,
    brand VARCHAR(100),
    model VARCHAR(100),
    weight DECIMAL(8,2),
    dimensions JSONB,
    specifications JSONB,
    category_id UUID REFERENCES categories(id),
    tags TEXT[],
    main_image_url VARCHAR(500),
    images JSONB,
    slug VARCHAR(255) UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    is_on_sale BOOLEAN DEFAULT FALSE,
    is_rental BOOLEAN DEFAULT FALSE,
    rental_prices JSONB,
    installation_available BOOLEAN DEFAULT FALSE,
    installation_price DECIMAL(10,2),
    searchable_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(500) NOT NULL,
    product_sku VARCHAR(100),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    website VARCHAR(500),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_searchable_text ON products USING GIN(to_tsvector('english', searchable_text));
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_specifications ON products USING GIN(specifications);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES ('admin@scalevolt.com', '$2b$10$rQZ8K9LmN2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N', 'Admin', 'User', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, name_ua, name_pl, slug, description, sort_order) VALUES
('Solar Panels', 'Сонячні панелі', 'Panele słoneczne', 'solar-panels', 'High-quality solar panels for residential and commercial use', 1),
('Batteries', 'Батареї', 'Baterie', 'batteries', 'Energy storage solutions for solar systems', 2),
('Inverters', 'Інвертори', 'Inwertery', 'inverters', 'Power conversion equipment for solar installations', 3),
('EV Chargers', 'Зарядні станції', 'Stacje ładowania', 'ev-chargers', 'Electric vehicle charging solutions', 4),
('Cables & Wires', 'Кабелі та дроти', 'Kable i przewody', 'cables-wires', 'Electrical cables and wiring solutions', 5),
('Portable Generators', 'Портативні генератори', 'Przenośne generatory', 'portable-generators', 'Portable power solutions', 6)
ON CONFLICT (slug) DO NOTHING;
```

## Step 2: Verify Tables Created
After running the SQL:
1. Go to "Table Editor" in Supabase
2. Verify these tables exist:
   - ✅ users
   - ✅ categories  
   - ✅ products
   - ✅ orders
   - ✅ order_items
   - ✅ cart_items
   - ✅ suppliers
   - ✅ product_images

## Step 3: Run the Setup Script
Once tables are created, run:
```bash
node setup-complete-database.js
```

This will:
- ✅ Verify connection
- ✅ Insert sample categories
- ✅ Insert sample products
- ✅ Test table structure

## Step 4: Test Your Backend
After successful setup:
1. Start your backend server: `npm run dev`
2. Test API endpoints
3. Import your real product data
4. Set up authentication

## Troubleshooting

### "Table already exists" errors
- Use `CREATE TABLE IF NOT EXISTS` (already included)
- Or drop existing tables first with `DROP TABLE IF EXISTS table_name CASCADE;`

### Permission errors
- Ensure you're using the service role key (not anon key)
- Check your Supabase project settings

### Connection issues
- Verify your `.env` file has correct credentials
- Check if your Supabase project is active

## Next Steps After Setup
1. **Import Real Data**: Use your existing product catalogs
2. **Set Up Authentication**: Configure user registration/login
3. **Test API Endpoints**: Verify all CRUD operations work
4. **Connect Frontend**: Link your Vue/React frontend
5. **Deploy**: Move to production environment

---

**Need Help?** Check the Supabase docs: https://supabase.com/docs
