// routes/productRoutes.js
import { Router } from 'express';
import { pool } from '../db/pool.js'; // or wherever you export your pg pool
import { translateText, translateProduct } from '../utils/translationService.js'; // Add this import
const router = Router();

// Helper function to build searchable text
function buildSearchableText(product) {
  return [
    product.name, 
    product.name_uk, 
    product.name_pl,
    product.description, 
    product.description_uk, 
    product.description_pl
  ].filter(Boolean).join(' ').toLowerCase();
}

// Create a product
router.post('/', async (req, res) => {
  const { 
    name, price, description,
    name_uk, name_pl,
    description_uk, description_pl,
    auto_translate = true // New parameter to control auto-translation
  } = req.body;
  
  try {
    let productData = {
      name, price, description,
      name_uk, name_pl,
      description_uk, description_pl
    };
    
    // Auto-translate if requested and translation fields are missing
    if (auto_translate) {
      try {
        productData = await translateProduct(productData);
      } catch (error) {
        console.error('Auto-translation failed:', error);
        // Continue with original data if translation fails
      }
    }
    
    // Build searchable text for full-text search
    const searchable_text = buildSearchableText(productData);
    
    const result = await pool.query(
      `INSERT INTO products 
       (name, price, description, name_uk, name_pl, description_uk, description_pl, searchable_text) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        productData.name, 
        price, 
        productData.description, 
        productData.name_uk, 
        productData.name_pl, 
        productData.description_uk, 
        productData.description_pl, 
        searchable_text
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating product');
  }
});

// Get all products
router.get('/', async (req, res) => {
  const lang = req.query.lang || 'en'; // Default to English
  
  try {
    let result;
    if (lang === 'en') {
      // Return default fields for English
      result = await pool.query('SELECT * FROM products');
    } else if (lang === 'uk') {
      // Return Ukrainian translations where available
      result = await pool.query(`
        SELECT 
          id, 
          COALESCE(name_uk, name) as name, 
          price, 
          COALESCE(description_uk, description) as description,
          created_at, 
          updated_at
        FROM products
      `);
    } else if (lang === 'pl') {
      // Return Polish translations where available
      result = await pool.query(`
        SELECT 
          id, 
          COALESCE(name_pl, name) as name, 
          price, 
          COALESCE(description_pl, description) as description,
          created_at, 
          updated_at
        FROM products
      `);
    } else {
      // Default to all fields
      result = await pool.query('SELECT * FROM products');
    }
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching products');
  }
});

// Search products endpoint
router.get('/search', async (req, res) => {
  const query = req.query.q || '';
  const lang = req.query.lang || 'en';
  
  console.log(`Searching for products with query: "${query}" in language: ${lang}`);
  
  try {
    let result;
    
    if (query.trim() === '') {
      // If empty query, return all products
      result = await pool.query('SELECT * FROM products ORDER BY name ASC LIMIT 20');
    } else {
      // If searchable_text column exists, use it
      try {
        result = await pool.query(
          `SELECT * FROM products
           WHERE searchable_text ILIKE $1
           ORDER BY name ASC
           LIMIT 20`,
          [`%${query}%`]
        );
      } catch (err) {
        // Fallback to original search if searchable_text doesn't exist yet
        console.log('Falling back to original search method');
        result = await pool.query(
          `SELECT * FROM products
           WHERE name ILIKE $1
           OR description ILIKE $1
           OR CAST(id AS TEXT) ILIKE $1
           ORDER BY name ASC
           LIMIT 20`,
          [`%${query}%`]
        );
      }
    }
    
    // Format the results based on requested language
    let formattedResults = result.rows;
    
    if (lang === 'uk') {
      formattedResults = result.rows.map(product => ({
        ...product,
        name: product.name_uk || product.name,
        description: product.description_uk || product.description
      }));
    } else if (lang === 'pl') {
      formattedResults = result.rows.map(product => ({
        ...product,
        name: product.name_pl || product.name,
        description: product.description_pl || product.description
      }));
    }
    
    console.log(`Found ${formattedResults.length} products matching the search query`);
    res.json(formattedResults);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({
      error: 'Error searching products',
      message: err.message 
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || 'en';
  
  try {
    let result;
    
    if (lang === 'en') {
      result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    } else if (lang === 'uk') {
      result = await pool.query(`
        SELECT 
          id, 
          COALESCE(name_uk, name) as name, 
          price, 
          COALESCE(description_uk, description) as description,
          created_at, 
          updated_at
        FROM products WHERE id = $1
      `, [id]);
    } else if (lang === 'pl') {
      result = await pool.query(`
        SELECT 
          id, 
          COALESCE(name_pl, name) as name, 
          price, 
          COALESCE(description_pl, description) as description,
          created_at, 
          updated_at
        FROM products WHERE id = $1
      `, [id]);
    } else {
      result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    }
    
    if (result.rows.length === 0) {
      return res.status(404).send('Product not found');
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching product');
  }
});

// Update product
router.put('/:id', async (req, res) => {
  const { 
    name, price, description,
    name_uk, name_pl,
    description_uk, description_pl,
    auto_translate = false // Add auto-translate option to updates too
  } = req.body;
  const { id } = req.params;
  
  try {
    // Check if the product exists
    const existingProduct = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (existingProduct.rows.length === 0) {
      return res.status(404).send('Product not found');
    }
    
    // Combine existing product data with new data
    let product = {
      ...existingProduct.rows[0],
      name: name !== undefined ? name : existingProduct.rows[0].name,
      price: price !== undefined ? price : existingProduct.rows[0].price,
      description: description !== undefined ? description : existingProduct.rows[0].description,
      name_uk: name_uk !== undefined ? name_uk : existingProduct.rows[0].name_uk,
      name_pl: name_pl !== undefined ? name_pl : existingProduct.rows[0].name_pl,
      description_uk: description_uk !== undefined ? description_uk : existingProduct.rows[0].description_uk,
      description_pl: description_pl !== undefined ? description_pl : existingProduct.rows[0].description_pl
    };
    
    // Auto-translate if requested and the name or description has changed
    if (auto_translate && (name !== undefined || description !== undefined)) {
      try {
        // Only translate the fields that need translation
        const fieldsToTranslate = {
          name: product.name,
          description: product.description
        };
        
        const translatedFields = await translateProduct(fieldsToTranslate);
        
        // Only update missing translations or if original content changed
        if (name !== undefined && !name_uk) {
          product.name_uk = translatedFields.name_uk;
        }
        if (name !== undefined && !name_pl) {
          product.name_pl = translatedFields.name_pl;
        }
        if (description !== undefined && !description_uk) {
          product.description_uk = translatedFields.description_uk;
        }
        if (description !== undefined && !description_pl) {
          product.description_pl = translatedFields.description_pl;
        }
      } catch (error) {
        console.error('Auto-translation failed during update:', error);
      }
    }
    
    // Build searchable text
    const searchable_text = buildSearchableText(product);
    
    // Update the product
    const result = await pool.query(
      `UPDATE products SET 
         name = $1, 
         price = $2,
         description = $3,
         name_uk = $4,
         name_pl = $5,
         description_uk = $6,
         description_pl = $7,
         searchable_text = $8
       WHERE id = $9 
       RETURNING *`,
      [
        product.name, 
        product.price, 
        product.description,
        product.name_uk,
        product.name_pl,
        product.description_uk,
        product.description_pl, 
        searchable_text, 
        id
      ]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating product');
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Product not found');
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting product');
  }
});

// Translation-specific endpoint
router.patch('/:id/translations', async (req, res) => {
  const { id } = req.params;
  const { name_uk, name_pl, description_uk, description_pl } = req.body;
  
  try {
    // Get current product data
    const currentProduct = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (currentProduct.rows.length === 0) {
      return res.status(404).send('Product not found');
    }
    
    // Combine existing and new data
    const product = {
      ...currentProduct.rows[0],
      name_uk: name_uk !== undefined ? name_uk : currentProduct.rows[0].name_uk,
      name_pl: name_pl !== undefined ? name_pl : currentProduct.rows[0].name_pl,
      description_uk: description_uk !== undefined ? description_uk : currentProduct.rows[0].description_uk,
      description_pl: description_pl !== undefined ? description_pl : currentProduct.rows[0].description_pl
    };
    
    // Build searchable text
    const searchable_text = buildSearchableText(product);
    
    // Update only translation fields
    const result = await pool.query(
      `UPDATE products SET 
         name_uk = $1,
         name_pl = $2,
         description_uk = $3,
         description_pl = $4,
         searchable_text = $5
       WHERE id = $6 
       RETURNING *`,
      [product.name_uk, product.name_pl, product.description_uk, product.description_pl, searchable_text, id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating translations');
  }
});

// Auto-translate missing fields for a product
router.post('/:id/auto-translate', async (req, res) => {
  const { id } = req.params;
  const { targetLanguages = ['uk', 'pl'], sourceLanguage = 'en' } = req.body;
  
  try {
    // Get current product data
    const currentProduct = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (currentProduct.rows.length === 0) {
      return res.status(404).send('Product not found');
    }
    
    // Auto-translate missing fields
    const product = currentProduct.rows[0];
    const translatedProduct = await translateProduct(product, targetLanguages, sourceLanguage);
    
    // Build searchable text
    const searchable_text = buildSearchableText(translatedProduct);
    
    // Update only translation fields
    const result = await pool.query(
      `UPDATE products SET 
         name_uk = COALESCE($1, name_uk),
         name_pl = COALESCE($2, name_pl),
         description_uk = COALESCE($3, description_uk),
         description_pl = COALESCE($4, description_pl),
         searchable_text = $5
       WHERE id = $6 
       RETURNING *`,
      [
        translatedProduct.name_uk, 
        translatedProduct.name_pl, 
        translatedProduct.description_uk, 
        translatedProduct.description_pl, 
        searchable_text, 
        id
      ]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error auto-translating product');
  }
});

// Batch auto-translate multiple products
router.post('/batch-translate', async (req, res) => {
  const { productIds = [], targetLanguages = ['uk', 'pl'], sourceLanguage = 'en' } = req.body;
  
  try {
    const results = [];
    
    // Process each product
    for (const id of productIds) {
      // Get current product data
      const currentProduct = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      
      if (currentProduct.rows.length === 0) {
        results.push({ id, success: false, message: 'Product not found' });
        continue;
      }
      
      // Auto-translate missing fields
      const product = currentProduct.rows[0];
      const translatedProduct = await translateProduct(product, targetLanguages, sourceLanguage);
      
      // Build searchable text
      const searchable_text = buildSearchableText(translatedProduct);
      
      // Update translation fields
      await pool.query(
        `UPDATE products SET 
           name_uk = COALESCE($1, name_uk),
           name_pl = COALESCE($2, name_pl),
           description_uk = COALESCE($3, description_uk),
           description_pl = COALESCE($4, description_pl),
           searchable_text = $5
         WHERE id = $6`,
        [
          translatedProduct.name_uk, 
          translatedProduct.name_pl, 
          translatedProduct.description_uk, 
          translatedProduct.description_pl, 
          searchable_text, 
          id
        ]
      );
      
      results.push({ id, success: true });
    }
    
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error batch translating products');
  }
});

export default router;