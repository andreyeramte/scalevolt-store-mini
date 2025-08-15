-- ScaleVolt Products Database Schema
-- Migration: 001_create_products_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
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
);

-- Products table with multi-language support
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
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
    sale_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Inventory
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 5,
    max_stock_level INTEGER DEFAULT 1000,
    is_in_stock BOOLEAN DEFAULT true,
    allow_backorders BOOLEAN DEFAULT false,
    
    -- Product details
    weight DECIMAL(8,2),
    dimensions VARCHAR(100), -- "LxWxH in cm"
    brand VARCHAR(100),
    model VARCHAR(100),
    warranty_months INTEGER,
    
    -- Technical specifications
    power_output VARCHAR(50), -- "100W", "1kW", etc.
    voltage VARCHAR(50), -- "12V", "24V", "220V", etc.
    efficiency VARCHAR(50), -- "95%", etc.
    certifications TEXT[], -- Array of certifications
    features TEXT[], -- Array of features
    features_ua TEXT[],
    features_pl TEXT[],
    
    -- Images and media
    main_image_url VARCHAR(500),
    image_urls TEXT[], -- Array of image URLs
    video_url VARCHAR(500),
    documents TEXT[], -- Array of document URLs (manuals, datasheets)
    
    -- SEO and marketing
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    url_slug VARCHAR(255) UNIQUE,
    
    -- Status and visibility
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    
    -- Categories and tags
    category_id INTEGER REFERENCES categories(id),
    tags TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product variants table (for different configurations)
CREATE TABLE IF NOT EXISTS product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_ua VARCHAR(255),
    name_pl VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    attributes JSONB, -- Flexible attributes like color, size, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product specifications table
CREATE TABLE IF NOT EXISTS product_specifications (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    spec_name VARCHAR(255) NOT NULL,
    spec_name_ua VARCHAR(255),
    spec_name_pl VARCHAR(255),
    spec_value TEXT NOT NULL,
    spec_value_ua TEXT,
    spec_value_pl TEXT,
    spec_unit VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER, -- Can be null for anonymous reviews
    customer_name VARCHAR(255),
    email VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    title_ua VARCHAR(255),
    title_pl VARCHAR(255),
    review_text TEXT,
    review_text_ua TEXT,
    review_text_pl TEXT,
    is_approved BOOLEAN DEFAULT false,
    is_verified_purchase BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    alt_text_ua VARCHAR(255),
    alt_text_pl VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_main BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product documents table (manuals, datasheets, etc.)
CREATE TABLE IF NOT EXISTS product_documents (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    document_url VARCHAR(500) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_name_ua VARCHAR(255),
    document_name_pl VARCHAR(255),
    document_type VARCHAR(50), -- 'manual', 'datasheet', 'warranty', etc.
    file_size INTEGER, -- in bytes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search index table for better search performance
CREATE TABLE IF NOT EXISTS product_search_index (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    searchable_text TEXT,
    searchable_text_ua TEXT,
    searchable_text_pl TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_url_slug ON products(url_slug);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_specifications_product_id ON product_specifications(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_documents_product_id ON product_documents(product_id);
CREATE INDEX IF NOT EXISTS idx_product_search_index_product_id ON product_search_index(product_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_products_search_ua ON products USING gin(to_tsvector('ukrainian', name_ua || ' ' || COALESCE(description_ua, '')));
CREATE INDEX IF NOT EXISTS idx_products_search_pl ON products USING gin(to_tsvector('polish', name_pl || ' ' || COALESCE(description_pl, '')));

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update search index
CREATE OR REPLACE FUNCTION update_product_search_index()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO product_search_index (product_id, searchable_text, searchable_text_ua, searchable_text_pl, updated_at)
    VALUES (
        NEW.id,
        NEW.name || ' ' || COALESCE(NEW.description, '') || ' ' || COALESCE(NEW.brand, ''),
        NEW.name_ua || ' ' || COALESCE(NEW.description_ua, '') || ' ' || COALESCE(NEW.brand, ''),
        NEW.name_pl || ' ' || COALESCE(NEW.description_pl, '') || ' ' || COALESCE(NEW.brand, ''),
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (product_id) DO UPDATE SET
        searchable_text = EXCLUDED.searchable_text,
        searchable_text_ua = EXCLUDED.searchable_text_ua,
        searchable_text_pl = EXCLUDED.searchable_text_pl,
        updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_search_index_trigger AFTER INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_product_search_index();

-- Insert default categories
INSERT INTO categories (name, name_ua, name_pl, slug, description, description_ua, description_pl, sort_order) VALUES
('Solar Panels', 'Сонячні панелі', 'Panele słoneczne', 'solar-panels', 'High-efficiency solar panels for residential and commercial installations', 'Високоефективні сонячні панелі для житлового та комерційного використання', 'Wysokowydajne panele słoneczne do zastosowań mieszkalnych i komercyjnych', 1),
('Battery Storage', 'Акумуляторні системи', 'Systemy bateryjne', 'battery-storage', 'Lithium battery storage systems for solar installations', 'Літієві акумуляторні системи для сонячних установок', 'Systemy baterii litowych dla instalacji słonecznych', 2),
('Solar Inverters', 'Сонячні інвертори', 'Inwertery słoneczne', 'solar-inverters', 'High-efficiency inverters for solar power systems', 'Високоефективні інвертори для сонячних енергетичних систем', 'Wysokowydajne inwertery dla systemów energii słonecznej', 3),
('EV Chargers', 'Зарядні станції для електромобілів', 'Stacje ładowania EV', 'ev-chargers', 'Fast and smart electric vehicle charging solutions', 'Швидкі та розумні рішення для зарядки електромобілів', 'Szybkie i inteligentne rozwiązania ładowania pojazdów elektrycznych', 4),
('Portable Power', 'Портативні електростанції', 'Przenośne elektrownie', 'portable-power', 'Portable power stations and generators', 'Портативні електростанції та генератори', 'Przenośne elektrownie i generatory', 5),
('Solar Accessories', 'Аксесуари для сонячних систем', 'Akcesoria do systemów słonecznych', 'solar-accessories', 'Mounting systems, cables, and solar accessories', 'Системи кріплення, кабелі та аксесуари для сонячних систем', 'Systemy montażowe, kable i akcesoria słoneczne', 6),
('Industrial Solutions', 'Промислові рішення', 'Rozwiązania przemysłowe', 'industrial-solutions', 'Large-scale industrial solar and power solutions', 'Крупномасштабні промислові сонячні та енергетичні рішення', 'Rozwiązania słoneczne i energetyczne na dużą skalę', 7),
('Monitoring Systems', 'Системи моніторингу', 'Systemy monitoringu', 'monitoring-systems', 'Smart monitoring and control systems for solar installations', 'Розумні системи моніторингу та контролю для сонячних установок', 'Inteligentne systemy monitoringu i kontroli dla instalacji słonecznych', 8);

-- Sample products data
INSERT INTO products (sku, name, name_ua, name_pl, description, description_ua, description_pl, price, category_id, brand, power_output, voltage, efficiency, features, is_featured, url_slug) VALUES
('SP-100W-001', 'Solar Panel 100W Monocrystalline', 'Сонячна панель 100W монокристалічна', 'Panel słoneczny 100W monokrystaliczny', 'High-efficiency 100W monocrystalline solar panel with 25-year warranty', 'Високоефективна 100W монокристалічна сонячна панель з 25-річною гарантією', 'Wysokowydajny 100W monokrystaliczny panel słoneczny z 25-letnią gwarancją', 150.00, 1, 'ScaleVolt', '100W', '12V', '21%', ARRAY['High efficiency', 'Durable construction', '25-year warranty', 'Easy installation'], true, 'solar-panel-100w-monocrystalline'),
('SP-300W-001', 'Solar Panel 300W Polycrystalline', 'Сонячна панель 300W полікристалічна', 'Panel słoneczny 300W polikrystaliczny', 'Efficient 300W polycrystalline solar panel for residential installations', 'Ефективна 300W полікристалічна сонячна панель для житлових установок', 'Wydajny 300W polikrystaliczny panel słoneczny do instalacji mieszkalnych', 280.00, 1, 'ScaleVolt', '300W', '24V', '18%', ARRAY['Cost-effective', 'Reliable performance', '20-year warranty', 'Weather resistant'], false, 'solar-panel-300w-polycrystalline'),
('BP-24V-100Ah', 'Battery Pack 24V 100Ah Lithium', 'Акумуляторна батарея 24V 100Ah літієва', 'Pakiet baterii 24V 100Ah litowy', 'High-capacity 24V 100Ah lithium battery pack for solar storage', 'Високоємна 24V 100Ah літієва акумуляторна батарея для сонячного накопичення', 'Wysokopojemny 24V 100Ah litowy pakiet baterii do magazynowania energii słonecznej', 1200.00, 2, 'ScaleVolt', '2400Wh', '24V', '95%', ARRAY['High capacity', 'Long cycle life', 'Smart BMS', 'Scalable design'], true, 'battery-pack-24v-100ah-lithium'),
('INV-3000W', 'Solar Inverter 3000W Pure Sine Wave', 'Сонячний інвертор 3000W чиста синусоїда', 'Inwerter słoneczny 3000W czysty sinus', '3000W pure sine wave inverter for solar power systems', '3000W інвертор з чистою синусоїдою для сонячних енергетичних систем', '3000W inwerter z czystym sinusem dla systemów energii słonecznej', 450.00, 3, 'ScaleVolt', '3000W', '12V/24V', '90%', ARRAY['Pure sine wave', 'High efficiency', 'Overload protection', 'LCD display'], false, 'solar-inverter-3000w-pure-sine-wave'),
('EV-22kW', 'EV Charger 22kW Level 2', 'Зарядка для електромобіля 22kW рівень 2', 'Ładowarka EV 22kW poziom 2', '22kW Level 2 EV charger with smart scheduling and mobile app control', '22kW зарядка рівня 2 для електромобіля з розумним плануванням та контролем через мобільний додаток', '22kW ładowarka poziomu 2 EV z inteligentnym planowaniem i kontrolą aplikacji mobilnej', 800.00, 4, 'ScaleVolt', '22kW', '220V', '95%', ARRAY['Fast charging', 'Smart scheduling', 'Mobile app control', 'Load management'], true, 'ev-charger-22kw-level-2');

-- Update search index for sample products
SELECT update_product_search_index(); 