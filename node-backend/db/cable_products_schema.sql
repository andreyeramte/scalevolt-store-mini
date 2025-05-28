-- Database Structure for Tele-Fonika Cable Products with market-specific availability
-- This SQL schema creates a comprehensive database structure for managing
-- cable products across different markets (Poland, Ukraine, etc.)

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS tele_fonika_products;
USE tele_fonika_products;

-- Product Categories table
CREATE TABLE product_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id INT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (parent_category_id) REFERENCES product_categories(category_id) ON DELETE SET NULL
);

-- Markets/Countries table
CREATE TABLE markets (
    market_id INT AUTO_INCREMENT PRIMARY KEY,
    country_code VARCHAR(2) NOT NULL,
    name VARCHAR(100) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    vat_rate DECIMAL(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE (country_code)
);

-- Products table - Core product information
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    model_number VARCHAR(100) NOT NULL,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    technical_description TEXT,
    specifications JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(category_id)
);

-- Product specifications for cable products (extends the products table)
CREATE TABLE cable_specifications (
    product_id INT PRIMARY KEY,
    conductor_type VARCHAR(100),
    conductor_material VARCHAR(100),
    conductor_cross_sectional_area DECIMAL(10,2),
    insulation_type VARCHAR(100),
    insulation_thickness DECIMAL(10,2),
    voltage_rating VARCHAR(50),
    diameter DECIMAL(10,2),
    weight_per_km DECIMAL(10,2),
    min_bending_radius DECIMAL(10,2),
    max_pulling_force DECIMAL(10,2),
    conductor_resistance DECIMAL(10,5),
    operating_temperature_min INT,
    operating_temperature_max INT,
    standards VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Product images
CREATE TABLE product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Product documents (datasheets, manuals, certificates)
CREATE TABLE product_documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    document_type ENUM('datasheet', 'manual', 'certificate', 'technical_drawing', 'other') NOT NULL,
    language_code VARCHAR(2) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Market-specific product information
CREATE TABLE product_market_data (
    product_id INT NOT NULL,
    market_id INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    price DECIMAL(12,2) NULL,
    local_model_number VARCHAR(100) NULL,
    local_name VARCHAR(255) NULL,
    local_description TEXT NULL,
    stock_status ENUM('in_stock', 'out_of_stock', 'backorder', 'discontinued', 'coming_soon') DEFAULT 'out_of_stock',
    min_order_quantity INT DEFAULT 1,
    lead_time_days INT NULL,
    PRIMARY KEY (product_id, market_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (market_id) REFERENCES markets(market_id) ON DELETE CASCADE
);

-- Product alternatives (similar products that can be substituted)
CREATE TABLE product_alternatives (
    product_id INT NOT NULL,
    alternative_product_id INT NOT NULL,
    notes VARCHAR(255),
    PRIMARY KEY (product_id, alternative_product_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (alternative_product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Product applications (industry use cases)
CREATE TABLE product_applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Many-to-many relation between products and applications
CREATE TABLE product_application_map (
    product_id INT NOT NULL,
    application_id INT NOT NULL,
    PRIMARY KEY (product_id, application_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES product_applications(application_id) ON DELETE CASCADE
);

-- Distributors table
CREATE TABLE distributors (
    distributor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    address TEXT,
    country_code VARCHAR(2) NOT NULL,
    notes TEXT
);

-- Distributor market coverage
CREATE TABLE distributor_markets (
    distributor_id INT NOT NULL,
    market_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    notes TEXT,
    PRIMARY KEY (distributor_id, market_id),
    FOREIGN KEY (distributor_id) REFERENCES distributors(distributor_id) ON DELETE CASCADE,
    FOREIGN KEY (market_id) REFERENCES markets(market_id) ON DELETE CASCADE
);

-- Product availability at distributors
CREATE TABLE distributor_products (
    distributor_id INT NOT NULL,
    product_id INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    stock_level INT NULL,
    price DECIMAL(12,2) NULL,
    url VARCHAR(255) NULL,
    PRIMARY KEY (distributor_id, product_id),
    FOREIGN KEY (distributor_id) REFERENCES distributors(distributor_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Sample data insertion
-- Insert Markets
INSERT INTO markets (country_code, name, currency, vat_rate) VALUES 
('PL', 'Poland', 'PLN', 23.00),
('UA', 'Ukraine', 'UAH', 20.00);

-- Insert Sample Categories
INSERT INTO product_categories (name, description) VALUES 
('Medium Voltage Power Cables', 'Cables for medium voltage power applications'),
('XLPE Insulated Cables', 'Cross-linked polyethylene insulated cables');

-- For specific implementation of data import from your catalog PDF, we would need a separate script
-- that can parse the information and insert it into these tables