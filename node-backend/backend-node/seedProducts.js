// seedProducts.js
const db = require('./db/pool');
const mockProducts = require('../vue-frontend/src/data/mockProducts');

const seedProducts = async () => {
  try {
    console.log('Starting product seeding...');
    
    // Clear existing products
    await db.query('TRUNCATE TABLE products RESTART IDENTITY CASCADE');
    console.log('Cleared existing products');
    
    // Insert each product from mockProducts
    for (const product of mockProducts) {
      const {
        id, title, name, price, originalPrice, quantity, brand,
        model, type, images, image, offers, installationAvailable, categoryId
      } = product;
      
      await db.createProduct({
        title: title || name,
        name,
        price,
        original_price: originalPrice,
        quantity,
        brand,
        model,
        type,
        images,
        image,
        offers,
        installation_available: installationAvailable || false,
        category_id: categoryId
      });
      
      console.log(`Added product: ${title || name}`);
    }
    
    console.log('Product seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();