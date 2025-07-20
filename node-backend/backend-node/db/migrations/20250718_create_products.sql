-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    category VARCHAR(100),
    brand VARCHAR(100),
    sku VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Insert sample products
INSERT INTO products (name, description, price, stock, category, brand, sku) VALUES
('Solar Panel 100W', 'High efficiency solar panel for residential use', 150.00, 10, 'solar-panels', 'ScaleVolt', 'SP-100W-001'),
('Battery Pack 24V 100Ah', 'Lithium battery pack for solar systems', 800.00, 5, 'batteries', 'ScaleVolt', 'BP-24V-100Ah-001'),
('Charge Controller MPPT 40A', 'Maximum Power Point Tracking charge controller', 120.00, 15, 'charge-controllers', 'ScaleVolt', 'CC-MPPT-40A-001'),
('Inverter 2000W Pure Sine Wave', 'Pure sine wave inverter for home use', 300.00, 8, 'inverters', 'ScaleVolt', 'INV-2000W-001'),
('Solar Cable 4mm Red', 'Red solar cable for positive connections', 2.50, 100, 'cables', 'ScaleVolt', 'SC-4MM-RED-001'),
('Solar Cable 4mm Black', 'Black solar cable for negative connections', 2.50, 100, 'cables', 'ScaleVolt', 'SC-4MM-BLACK-001')
ON CONFLICT (sku) DO NOTHING;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();