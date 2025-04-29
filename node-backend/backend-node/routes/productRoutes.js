const express = require('express');
const { pool } = require('../db/pool');
//const { buildSearchableText } = require('../utils/helpers');
const { translateText, translateProduct } = require('../../../vue-frontend/src/utils/translationService');

const router = express.Router();

// Create a product
router.post('/', async (req, res) => {
  const {
    name, price, description,
    name_ua, name_pl,
    description_ua, description_pl,
    auto_translate = true
  } = req.body;

  try {
    let productData = {
      name, price, description,
      name_ua, name_pl,
      description_ua, description_pl
    };

    if (auto_translate) {
      try {
        productData = await translateProduct(productData);
      } catch (error) {
        console.error('Auto-translation failed:', error);
      }
    }

    //const searchable_text = buildSearchableText(productData);

    const result = await pool.query(
      `INSERT INTO products 
       (name, price, description, name_ua, name_pl, description_ua, description_pl, searchable_text) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        productData.name,
        price,
        productData.description,
        productData.name_ua,
        productData.name_pl,
        productData.description_ua,
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
  const lang = req.query.lang || 'en';

  try {
    let result;
    if (lang === 'en') {
      result = await pool.query('SELECT * FROM products');
    } else if (lang === 'ua') {
      result = await pool.query(`
        SELECT 
          id, 
          COALESCE(name_ua, name) as name, 
          price, 
          COALESCE(description_ua, description) as description,
          created_at, 
          updated_at
        FROM products
      `);
    } else if (lang === 'pl') {
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
      result = await pool.query('SELECT * FROM products ORDER BY name ASC LIMIT 20');
    } else {
      try {
        result = await pool.query(
          `SELECT * FROM products
           WHERE searchable_text ILIKE $1
           ORDER BY name ASC
           LIMIT 20`,
          [`%${query}%`]
        );
      } catch (err) {
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

    let formattedResults = result.rows;

    if (lang === 'ua') {
      formattedResults = result.rows.map(product => ({
        ...product,
        name: product.name_ua || product.name,
        description: product.description_ua || product.description
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
    } else if (lang === 'ua') {
      result = await pool.query(`
        SELECT 
          id, 
          COALESCE(name_ua, name) as name, 
          price, 
          COALESCE(description_ua, description) as description,
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
    name_ua, name_pl,
    description_ua, description_pl,
    auto_translate = false
  } = req.body;
  const { id } = req.params;

  try {
    const existingProduct = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (existingProduct.rows.length === 0) {
      return res.status(404).send('Product not found');
    }

    let product = {
      ...existingProduct.rows[0],
      name: name !== undefined ? name : existingProduct.rows[0].name,
      price: price !== undefined ? price : existingProduct.rows[0].price,
      description: description !== undefined ? description : existingProduct.rows[0].description,
      name_ua: name_ua !== undefined ? name_ua : existingProduct.rows[0].name_ua,
      name_pl: name_pl !== undefined ? name_pl : existingProduct.rows[0].name_pl,
      description_ua: description_ua !== undefined ? description_ua : existingProduct.rows[0].description_ua,
      description_pl: description_pl !== undefined ? description_pl : existingProduct.rows[0].description_pl
    };

    if (auto_translate && (name !== undefined || description !== undefined)) {
      try {
        const fieldsToTranslate = {
          name: product.name,
          description: product.description
        };

        const translatedFields = await translateProduct(fieldsToTranslate);

        if (name !== undefined && !name_ua) {
          product.name_ua = translatedFields.name_ua;
        }
        if (name !== undefined && !name_pl) {
          product.name_pl = translatedFields.name_pl;
        }
        if (description !== undefined && !description_ua) {
          product.description_ua = translatedFields.description_ua;
        }
        if (description !== undefined && !description_pl) {
          product.description_pl = translatedFields.description_pl;
        }
      } catch (error) {
        console.error('Auto-translation failed during update:', error);
      }
    }

    //const searchable_text = buildSearchableText(product);

    const result = await pool.query(
      `UPDATE products SET 
         name = $1, 
         price = $2,
         description = $3,
         name_ua = $4,
         name_pl = $5,
         description_ua = $6,
         description_pl = $7,
         searchable_text = $8
       WHERE id = $9 
       RETURNING *`,
      [
        product.name,
        product.price,
        product.description,
        product.name_ua,
        product.name_pl,
        product.description_ua,
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
  const { name_ua, name_pl, description_ua, description_pl } = req.body;

  try {
    const currentProduct = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (currentProduct.rows.length === 0) {
      return res.status(404).send('Product not found');
    }

    const product = {
      ...currentProduct.rows[0],
      name_ua: name_ua !== undefined ? name_ua : currentProduct.rows[0].name_ua,
      name_pl: name_pl !== undefined ? name_pl : currentProduct.rows[0].name_pl,
      description_ua: description_ua !== undefined ? description_ua : currentProduct.rows[0].description_ua,
      description_pl: description_pl !== undefined ? description_pl : currentProduct.rows[0].description_pl
    };

    //const searchable_text = buildSearchableText(product);

    const result = await pool.query(
      `UPDATE products SET 
         name_ua = $1,
         name_pl = $2,
         description_ua = $3,
         description_pl = $4,
         searchable_text = $5
       WHERE id = $6 
       RETURNING *`,
      [product.name_ua, product.name_pl, product.description_ua, product.description_pl, searchable_text, id]
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
  const { targetLanguages = ['ua', 'pl'], sourceLanguage = 'en' } = req.body;

  try {
    const currentProduct = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (currentProduct.rows.length === 0) {
      return res.status(404).send('Product not found');
    }

    const product = currentProduct.rows[0];
    const translatedProduct = await translateProduct(product, targetLanguages, sourceLanguage);

    //const searchable_text = buildSearchableText(translatedProduct);

    const result = await pool.query(
      `UPDATE products SET 
         name_ua = COALESCE($1, name_ua),
         name_pl = COALESCE($2, name_pl),
         description_ua = COALESCE($3, description_ua),
         description_pl = COALESCE($4, description_pl),
         searchable_text = $5
       WHERE id = $6 
       RETURNING *`,
      [
        translatedProduct.name_ua,
        translatedProduct.name_pl,
        translatedProduct.description_ua,
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
  const { productIds = [], targetLanguages = ['ua', 'pl'], sourceLanguage = 'en' } = req.body;

  try {
    const results = [];

    for (const id of productIds) {
      const currentProduct = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

      if (currentProduct.rows.length === 0) {
        results.push({ id, success: false, message: 'Product not found' });
        continue;
      }

      const product = currentProduct.rows[0];
      const translatedProduct = await translateProduct(product, targetLanguages, sourceLanguage);

     // const searchable_text = buildSearchableText(translatedProduct);

      await pool.query(
        `UPDATE products SET 
           name_ua = COALESCE($1, name_ua),
           name_pl = COALESCE($2, name_pl),
           description_ua = COALESCE($3, description_ua),
           description_pl = COALESCE($4, description_pl),
           searchable_text = $5
         WHERE id = $6`,
        [
          translatedProduct.name_ua,
          translatedProduct.name_pl,
          translatedProduct.description_ua,
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

module.exports = router;