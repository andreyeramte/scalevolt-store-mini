-- Enhanced Database Schema for ScaleVolt E-commerce Platform
-- This schema supports multi-language products, admin management, and comprehensive product data

-- Create database if not exists (PostgreSQL)
-- CREATE DATABASE scalevolt_store;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
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
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table with comprehensive fields
CREATE TABLE IF NOT EXISTS products (
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
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Inventory
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER,
    is_in_stock BOOLEAN DEFAULT TRUE,
    allow_backorders BOOLEAN DEFAULT FALSE,
    
    -- Product details
    brand VARCHAR(100),
    model VARCHAR(100),
    weight DECIMAL(8,2),
    dimensions JSONB, -- {length, width, height, unit}
    specifications JSONB, -- Flexible specifications storage
    
    -- Categories and tags
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[], -- Array of tags
    
    -- Images and media
    main_image_url VARCHAR(500),
    images JSONB, -- Array of image URLs
    
    -- SEO and visibility
    slug VARCHAR(255) UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    
    -- Status and visibility
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    is_on_sale BOOLEAN DEFAULT FALSE,
    
    -- Rental properties (for rental products)
    is_rental BOOLEAN DEFAULT FALSE,
    rental_prices JSONB, -- {daily, weekly, monthly}
    
    -- Installation and services
    installation_available BOOLEAN DEFAULT FALSE,
    installation_price DECIMAL(10,2),
    
    -- Search and indexing
    searchable_text TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

-- Product variants (for products with multiple options like size, color, etc.)
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255),
    price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    attributes JSONB, -- {color: "red", size: "L", etc.}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product images table for better image management
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Import logs for tracking data imports
CREATE TABLE IF NOT EXISTS import_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    supplier VARCHAR(100),
    total_rows INTEGER DEFAULT 0,
    imported_count INTEGER DEFAULT 0,
    updated_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    errors JSONB, -- Array of error messages
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    imported_by UUID REFERENCES users(id)
);

-- Admin activity logs
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_searchable_text ON products USING GIN(to_tsvector('english', searchable_text));
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_specifications ON products USING GIN(specifications);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update searchable_text
CREATE OR REPLACE FUNCTION update_product_searchable_text()
RETURNS TRIGGER AS $$
BEGIN
    NEW.searchable_text = COALESCE(NEW.name, '') || ' ' || 
                         COALESCE(NEW.name_ua, '') || ' ' || 
                         COALESCE(NEW.name_pl, '') || ' ' ||
                         COALESCE(NEW.description, '') || ' ' ||
                         COALESCE(NEW.description_ua, '') || ' ' ||
                         COALESCE(NEW.description_pl, '') || ' ' ||
                         COALESCE(NEW.brand, '') || ' ' ||
                         COALESCE(NEW.model, '') || ' ' ||
                         COALESCE(array_to_string(NEW.tags, ' '), '');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for searchable_text
CREATE TRIGGER update_product_searchable_text_trigger 
    BEFORE INSERT OR UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_product_searchable_text();

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
