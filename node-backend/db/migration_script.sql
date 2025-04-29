-- db/migration_script.sql
-- This script adds necessary columns to your existing products table

-- Backup the current table (optional but recommended)
CREATE TABLE IF NOT EXISTS products_backup AS 
SELECT * FROM products;

-- Add SKU column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='products' AND column_name='sku') THEN
        ALTER TABLE products ADD COLUMN sku VARCHAR(100);
        -- Generate SKUs for existing products
        UPDATE products 
        SET sku = CONCAT('LEGACY-', id) 
        WHERE sku IS NULL;
        -- Add unique constraint after populating
        ALTER TABLE products ADD CONSTRAINT products_sku_key UNIQUE (sku);
    END IF;
END
$$;

-- Add properties column for additional attributes if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='products' AND column_name='properties') THEN
        ALTER TABLE products ADD COLUMN properties JSONB DEFAULT '{}'::jsonb;
    END IF;
END
$$;

-- Add stock column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='products' AND column_name='stock') THEN
        -- Add stock column with a default value
        ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0;
    END IF;
END
$$;

-- Add updated_at and created_at columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='products' AND column_name='updated_at') THEN
        ALTER TABLE products ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='products' AND column_name='created_at') THEN
        ALTER TABLE products ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END
$$;

-- Create import_logs table if it doesn't exist
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

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_product_timestamp') THEN
        CREATE TRIGGER update_product_timestamp
        BEFORE UPDATE ON products
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp_column();
    END IF;
END
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier);
CREATE INDEX IF NOT EXISTS idx_products_properties ON products USING GIN (properties);