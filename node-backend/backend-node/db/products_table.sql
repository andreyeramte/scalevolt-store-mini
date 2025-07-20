-- Updated products_table.sql
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100),
    brand VARCHAR(100),
    supplier VARCHAR(100),
    weight DECIMAL(10, 2),
    dimensions VARCHAR(100),
    properties JSONB DEFAULT '{}'::jsonb,
    images TEXT[],
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_properties ON products USING GIN (properties);

-- Import logs table to track import history
CREATE TABLE IF NOT EXISTS import_logs (
    id SERIAL PRIMARY KEY,
    supplier VARCHAR(100) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    products_imported INTEGER DEFAULT 0,
    products_updated INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    error_log TEXT,
    status VARCHAR(50) NOT NULL,
    import_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    imported_by VARCHAR(100)
);

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();