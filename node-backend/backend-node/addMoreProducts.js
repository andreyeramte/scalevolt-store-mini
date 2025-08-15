const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'postgres',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'scalevolt',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
});

const moreProducts = [
  {
    sku: 'SOLAR-500W-001',
    name: 'Solar Panel 500W Premium',
    description: 'High-efficiency premium solar panel with 500W output and 25-year warranty',
    price: 399.99,
    stock: 25,
    category: 'solar_panels',
    brand: 'Longi',
    supplier: 'Longi Solar',
    weight: 28.0,
    dimensions: '1850x1100x35mm',
    properties: {
      power: '500W',
      efficiency: '21.2%',
      warranty: '25 years',
      type: 'monocrystalline'
    },
    images: ['/images/solar.panels/Longi-420-Black.png'],
    active: true,
    featured: true
  },
  {
    sku: 'INVERTER-12KW-001',
    name: 'Hybrid Inverter 12kW 3-Phase',
    description: 'Three-phase hybrid inverter for commercial solar installations',
    price: 3499.99,
    stock: 10,
    category: 'inverters',
    brand: 'Deye',
    supplier: 'Deye Solar',
    weight: 55.0,
    dimensions: '700x450x250mm',
    properties: {
      power: '12kW',
      type: 'hybrid',
      phases: '3',
      voltage: '48V',
      grid_tie: true
    },
    images: ['/images/inverters/deye-hybrid-12kw-3ph-48V.png'],
    active: true,
    featured: true
  },
  {
    sku: 'BATTERY-20KWH-001',
    name: 'Battery Storage 20kWh Commercial',
    description: 'Commercial-grade lithium battery storage system for large installations',
    price: 7999.99,
    stock: 8,
    category: 'batteries',
    brand: 'Deye',
    supplier: 'Deye Solar',
    weight: 240.0,
    dimensions: '1200x800x600mm',
    properties: {
      capacity: '20.48kWh',
      voltage: '51.2V',
      cycles: '8000',
      warranty: '10 years',
      type: 'lithium_iron_phosphate'
    },
    images: ['/images/batteries/Deye-RW-F20.48-51.2V-400AH-20.48KWH-1.png'],
    active: true,
    featured: false
  },
  {
    sku: 'EV-CHARGER-3PORT-001',
    name: 'EV Charger Level 2 - 3 Ports',
    description: 'Three-port electric vehicle charger for commercial installations',
    price: 1299.99,
    stock: 15,
    category: 'ev_chargers',
    brand: 'Octa',
    supplier: 'Octa Energy',
    weight: 25.0,
    dimensions: '400x300x150mm',
    properties: {
      power: '22kW',
      connector: 'Type 2',
      phases: '3',
      protection: 'IP65',
      ports: '3'
    },
    images: ['/images/ev.charger.level2/Octa Wall - 3 порта Plug (без фону + білий фон)/treshka_connectors.png'],
    active: true,
    featured: false
  },
  {
    sku: 'SOLAR-MOUNTING-001',
    name: 'Solar Panel Mounting System',
    description: 'Complete mounting system for rooftop solar installations',
    price: 299.99,
    stock: 40,
    category: 'accessories',
    brand: 'SolarMount',
    supplier: 'SolarMount Systems',
    weight: 45.0,
    dimensions: '2000x1000x100mm',
    properties: {
      capacity: '10_panels',
      material: 'aluminum',
      warranty: '10 years',
      tilt_adjustable: true
    },
    images: ['/images/accessories/solar-mounting-system.png'],
    active: true,
    featured: false
  },
  {
    sku: 'SOLAR-CABLE-001',
    name: 'Solar Panel Cable Set',
    description: 'High-quality cables for solar panel connections',
    price: 89.99,
    stock: 100,
    category: 'accessories',
    brand: 'SolarCable',
    supplier: 'SolarCable Pro',
    weight: 5.0,
    dimensions: '100x50x20mm',
    properties: {
      length: '10m',
      gauge: '4mm²',
      voltage: '1000V',
      weather_resistant: true
    },
    images: ['/images/accessories/solar-cable-set.png'],
    active: true,
    featured: false
  }
];

async function addMoreProducts() {
  try {
    console.log('🌱 Adding more products to database...');
    
    for (const product of moreProducts) {
      const query = `
        INSERT INTO products (
          sku, name, description, price, stock, category, brand, 
          supplier, weight, dimensions, properties, images, active, featured
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id
      `;
      
      const values = [
        product.sku,
        product.name,
        product.description,
        product.price,
        product.stock,
        product.category,
        product.brand,
        product.supplier,
        product.weight,
        product.dimensions,
        JSON.stringify(product.properties),
        product.images,
        product.active,
        product.featured
      ];
      
      const result = await pool.query(query, values);
      console.log(`✅ Added product: ${product.name} (ID: ${result.rows[0].id})`);
    }
    
    console.log('🎉 More products added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

addMoreProducts(); 