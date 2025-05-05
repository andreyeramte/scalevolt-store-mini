const express = require('express');
const { pool } = require('../db/pool.cjs');
const { buildSearchableText } = require('../utils/helpers.cjs');
const { translateText, translateProduct, getTranslatedContent } = require('../utils/translationService.cjs');



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
      } catch (err) {
        console.error('Auto-translation failed:', err);
      }
    }

    const searchable_text = buildSearchableText(productData);

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
    if (lang === 'ua') {
      result = await pool.query(`
        SELECT
          id,
          COALESCE(name_ua, name) AS name,
          price,
          COALESCE(description_ua, description) AS description,
          created_at,
          updated_at
        FROM products
      `);
    } else if (lang === 'pl') {
      result = await pool.query(`
        SELECT
          id,
          COALESCE(name_pl, name) AS name,
          price,
          COALESCE(description_pl, description) AS description,
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

// Search products
router.get('/search', async (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  const lang = req.query.lang || 'en';

  try {
    let result;
    if (!query) {
      result = await pool.query('SELECT * FROM products ORDER BY name ASC LIMIT 20');
    } else {
      result = await pool.query(
        `SELECT * FROM products
         WHERE searchable_text ILIKE $1
         ORDER BY name ASC
         LIMIT 20`,
        [`%${query}%`]
      );
    }

    let rows = result.rows.map(prod => {
      // translate name/description fields based on lang
      if (lang === 'ua') {
        prod.name = prod.name_ua || prod.name;
        prod.description = prod.description_ua || prod.description;
      } else if (lang === 'pl') {
        prod.name = prod.name_pl || prod.name;
        prod.description = prod.description_pl || prod.description;
      }
      return prod;
    });

    res.json(rows);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Error searching products', message: err.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || 'en';

  try {
    let result;
    if (lang === 'ua') {
      result = await pool.query(
        `SELECT id,
                COALESCE(name_ua, name) AS name,
                price,
                COALESCE(description_ua, description) AS description,
                created_at, updated_at
         FROM products WHERE id = $1`, [id]
      );
    } else if (lang === 'pl') {
      result = await pool.query(
        `SELECT id,
                COALESCE(name_pl, name) AS name,
                price,
                COALESCE(description_pl, description) AS description,
                created_at, updated_at
         FROM products WHERE id = $1`, [id]
      );
    } else {
      result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    }

    if (!result.rows.length) {
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
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (!rows.length) return res.status(404).send('Product not found');

    let product = { ...rows[0] };
    if (name !== undefined)        product.name = name;
    if (price !== undefined)       product.price = price;
    if (description !== undefined) product.description = description;
    if (name_ua !== undefined)     product.name_ua = name_ua;
    if (name_pl !== undefined)     product.name_pl = name_pl;
    if (description_ua !== undefined) product.description_ua = description_ua;
    if (description_pl !== undefined) product.description_pl = description_pl;

    if (auto_translate && (name || description)) {
      try {
        const translated = await translateProduct({
          name: product.name,
          description: product.description
        });
        product.name_ua = product.name_ua || translated.name_ua;
        product.name_pl = product.name_pl || translated.name_pl;
        product.description_ua = product.description_ua || translated.description_ua;
        product.description_pl = product.description_pl || translated.description_pl;
      } catch (err) {
        console.error('Auto-translation failed during update:', err);
      }
    }

    const searchable_text = buildSearchableText(product);

    const updateRes = await pool.query(
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
    res.json(updateRes.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating product');
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
    if (!rows.length) return res.status(404).send('Product not found');
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting product');
  }
});

// Auto-translate missing fields
router.post('/:id/auto-translate', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).send('Product not found');

    const product = rows[0];
    const translated = await translateProduct(product);

    product.name_ua = product.name_ua || translated.name_ua;
    product.name_pl = product.name_pl || translated.name_pl;
    product.description_ua = product.description_ua || translated.description_ua;
    product.description_pl = product.description_pl || translated.description_pl;

    const searchable_text = buildSearchableText(product);

    const upd = await pool.query(
      `UPDATE products SET
         name_ua = $1,
         name_pl = $2,
         description_ua = $3,
         description_pl = $4,
         searchable_text = $5
       WHERE id = $6 RETURNING *`,
      [
        product.name_ua,
        product.name_pl,
        product.description_ua,
        product.description_pl,
        searchable_text,
        req.params.id
      ]
    );
    res.json(upd.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error auto-translating product');
  }
});

// Batch auto-translate
router.post('/batch-translate', async (req, res) => {
  const { productIds = [] } = req.body;
  try {
    const results = [];
    for (const id of productIds) {
      const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      if (!rows.length) {
        results.push({ id, success: false, message: 'Not found' });
        continue;
      }
      const product = rows[0];
      const translated = await translateProduct(product);
      product.name_ua = product.name_ua || translated.name_ua;
      product.name_pl = product.name_pl || translated.name_pl;
      product.description_ua = product.description_ua || translated.description_ua;
      product.description_pl = product.description_pl || translated.description_pl;
      const searchable_text = buildSearchableText(product);

      await pool.query(
        `UPDATE products SET
           name_ua = $1,
           name_pl = $2,
           description_ua = $3,
           description_pl = $4,
           searchable_text = $5
         WHERE id = $6`,
        [
          product.name_ua,
          product.name_pl,
          product.description_ua,
          product.description_pl,
          searchable_text,
          id
        ]
      );
      results.push({ id, success: true });
    }
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error batch translating');
  }
});

module.exports = router;
