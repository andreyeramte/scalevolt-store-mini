const { Pool } = require('pg');
const fs = require('fs');

// Your hardcoded products data
const productsData = [
  // Copy your mockProducts array from ProductPage.vue
  // Just paste the first ~10 products to test
];

async function importProducts() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'your_password', // Replace with your password
    database: 'scalevolt_store'
  });

  try {
    console.log('Starting product import...');
    
    for (const product of productsData) {
      const query = `
        INSERT INTO products(
          id, title, default_name, price, original_price, 
          image, images, brand, type, model, quantity, 
          installation_available
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          default_name = EXCLUDED.default_name,
          price = EXCLUDED.price,
          original_price = EXCLUDED.original_price, 
          image = EXCLUDED.image,
          images = EXCLUDED.images,
          brand = EXCLUDED.brand,
          type = EXCLUDED.type,
          model = EXCLUDED.model,
          quantity = EXCLUDED.quantity,
          installation_available = EXCLUDED.installation_available,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `;
      
      // Handle the different data structures in your mockProducts
      const images = product.images ? JSON.stringify(product.images) : null;
      const image = product.image && !Array.isArray(product.image) ? product.image : null;
      
      const values = [
        product.id,
        product.title || product.name || '',
        product.defaultName || product.name || product.title || '',
        parseFloat(product.price),
        product.originalPrice ? parseFloat(product.originalPrice) : null,
        image,
        images,
        product.brand || '',
        product.type || '',
        product.model || '',
        product.quantity || '1 piece',
        product.installationAvailable || false
      ];
      
      const result = await pool.query(query, values);
      console.log(`Imported product ID: ${result.rows[0].id}`);
    }
    
    console.log('Product import completed successfully!');
  } catch (error) {
    console.error('Error importing products:', error);
  } finally {
    await pool.end();
  }
}

importProducts();