const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'postgres',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'scalevolt',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
});

const sampleProducts = [
  {
    sku: 'SOLAR-400W-001',
    name: 'Solar Panel 400W',
    description: 'High-efficiency solar panel with 400W output',
    price: 299.99,
    stock: 50,
    category: 'solar_panels',
    brand: 'Longi',
    supplier: 'Longi Solar',
    weight: 25.5,
    dimensions: '1765x1048x35mm',
    properties: {
      power: '400W',
      efficiency: '20.5%',
      warranty: '25 years'
    },
    images: ['/images/solar.panels/Longi-410-Black.png'],
    active: true,
    featured: true
  },
  {
    sku: 'INVERTER-10KW-001',
    name: 'Hybrid Inverter 10kW',
    description: 'Hybrid solar inverter with battery backup capability',
    price: 2499.99,
    stock: 20,
    category: 'inverters',
    brand: 'Deye',
    supplier: 'Deye Solar',
    weight: 45.0,
    dimensions: '600x400x200mm',
    properties: {
      power: '10kW',
      type: 'hybrid',
      phases: '1',
      voltage: '48V'
    },
    images: ['/images/inverters/deye-hybrid-10kw-1ph-48V.png'],
    active: true,
    featured: true
  },
  {
    sku: 'BATTERY-10KWH-001',
    name: 'Battery Storage 10kWh',
    description: 'Lithium battery storage system for solar installations',
    price: 3999.99,
    stock: 15,
    category: 'batteries',
    brand: 'Deye',
    supplier: 'Deye Solar',
    weight: 120.0,
    dimensions: '800x600x400mm',
    properties: {
      capacity: '10.64kWh',
      voltage: '51.2V',
      cycles: '6000',
      warranty: '10 years'
    },
    images: ['/images/batteries/Deye-RW-F10.6-51.2V-208AH-10.64KWH-1.png'],
    active: true,
    featured: true
  },
  {
    sku: 'EV-CHARGER-001',
    name: 'EV Charger Level 2',
    description: 'Level 2 electric vehicle charger for home installation',
    price: 899.99,
    stock: 30,
    category: 'ev_chargers',
    brand: 'Octa',
    supplier: 'Octa Energy',
    weight: 15.0,
    dimensions: '300x200x100mm',
    properties: {
      power: '7.4kW',
      connector: 'Type 2',
      phases: '1',
      protection: 'IP65'
    },
    images: ['/images/ev.charger.level2/Octa Wall - 2 порта - Plug (без фону + білий фон)/dvushka_connectors0001.png'],
    active: true,
    featured: false
  }
];

async function addSampleProducts() {
  try {
    console.log('🌱 Adding sample products to database...');
    
    for (const product of sampleProducts) {
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
    
    console.log('🎉 Sample products added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

addSampleProducts(); 