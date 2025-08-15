const express = require('express');
const { body, query, validationResult } = require('express-validator');
const router = express.Router();

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Search products with debouncing
router.get('/products', [
  query('q').optional().isString().trim().isLength({ min: 1, max: 100 }),
  query('category').optional().isString().trim(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { q, category, limit = 10, offset = 0 } = req.query;
    const pool = req.app.locals.pool;

    if (!pool) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database not connected' 
      });
    }

    // Build search query
    let query = `
      SELECT 
        p.id,
        p.sku,
        p.name,
        p.name_ua,
        p.name_pl,
        p.description,
        p.price,
        p.original_price,
        p.currency,
        p.stock_quantity,
        p.brand,
        p.model,
        p.main_image_url,
        p.images,
        p.slug,
        p.status,
        p.is_featured,
        p.is_on_sale,
        p.is_rental,
        p.rental_prices,
        p.installation_available,
        p.installation_price,
        c.name as category_name,
        c.slug as category_slug,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'published'
    `;

    const params = [];
    let paramIndex = 1;

    // Add search term
    if (q && q.trim()) {
      const searchTerm = `%${q.trim().toLowerCase()}%`;
      query += `
        AND (
          LOWER(p.name) LIKE $${paramIndex} OR
          LOWER(p.name_ua) LIKE $${paramIndex} OR
          LOWER(p.name_pl) LIKE $${paramIndex} OR
          LOWER(p.description) LIKE $${paramIndex} OR
          LOWER(p.brand) LIKE $${paramIndex} OR
          LOWER(p.model) LIKE $${paramIndex} OR
          LOWER(p.sku) LIKE $${paramIndex} OR
          LOWER(p.searchable_text) LIKE $${paramIndex}
        )
      `;
      params.push(searchTerm);
      paramIndex++;
    }

    // Add category filter
    if (category && category.trim()) {
      query += ` AND c.slug = $${paramIndex}`;
      params.push(category.trim());
      paramIndex++;
    }

    // Add ordering and pagination
    query += `
      ORDER BY 
        CASE WHEN p.is_featured THEN 1 ELSE 2 END,
        p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    // Execute query
    const result = await pool.query(query, params);
    
    // Process results
    const products = result.rows.map(product => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      name_ua: product.name_ua,
      name_pl: product.name_pl,
      description: product.description,
      price: parseFloat(product.price),
      original_price: product.original_price ? parseFloat(product.original_price) : null,
      currency: product.currency,
      stock_quantity: parseInt(product.stock_quantity),
      brand: product.brand,
      model: product.model,
      main_image_url: product.main_image_url,
      images: product.images ? JSON.parse(product.images) : [],
      slug: product.slug,
      status: product.status,
      is_featured: product.is_featured,
      is_on_sale: product.is_on_sale,
      is_rental: product.is_rental,
      rental_prices: product.rental_prices ? JSON.parse(product.rental_prices) : null,
      installation_available: product.installation_available,
      installation_price: product.installation_price ? parseFloat(product.installation_price) : null,
      category: {
        name: product.category_name,
        slug: product.category_slug
      },
      created_at: product.created_at,
      updated_at: product.updated_at
    }));

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'published'
    `;
    
    const countParams = [];
    let countParamIndex = 1;

    if (q && q.trim()) {
      const searchTerm = `%${q.trim().toLowerCase()}%`;
      countQuery += `
        AND (
          LOWER(p.name) LIKE $${countParamIndex} OR
          LOWER(p.name_ua) LIKE $${countParamIndex} OR
          LOWER(p.name_pl) LIKE $${countParamIndex} OR
          LOWER(p.description) LIKE $${countParamIndex} OR
          LOWER(p.brand) LIKE $${countParamIndex} OR
          LOWER(p.model) LIKE $${countParamIndex} OR
          LOWER(p.sku) LIKE $${countParamIndex} OR
          LOWER(p.searchable_text) LIKE $${countParamIndex}
        )
      `;
      countParams.push(searchTerm);
      countParamIndex++;
    }

    if (category && category.trim()) {
      countQuery += ` AND c.slug = $${countParamIndex}`;
      countParams.push(category.trim());
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total
      },
      search: {
        query: q,
        category,
        results_count: products.length
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Search failed',
      details: error.message 
    });
  }
});

// Search suggestions (for autocomplete)
router.get('/suggestions', [
  query('q').isString().trim().isLength({ min: 1, max: 50 }),
  query('limit').optional().isInt({ min: 1, max: 10 }).toInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { q, limit = 5 } = req.query;
    const pool = req.app.locals.pool;

    if (!pool) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database not connected' 
      });
    }

    const searchTerm = `%${q.trim().toLowerCase()}%`;
    
    const query = `
      SELECT DISTINCT
        p.name,
        p.name_ua,
        p.name_pl,
        p.brand,
        p.model,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'published'
        AND (
          LOWER(p.name) LIKE $1 OR
          LOWER(p.name_ua) LIKE $1 OR
          LOWER(p.name_pl) LIKE $1 OR
          LOWER(p.brand) LIKE $1 OR
          LOWER(p.model) LIKE $1 OR
          LOWER(c.name) LIKE $1
        )
      ORDER BY 
        CASE WHEN LOWER(p.name) LIKE $1 THEN 1 ELSE 2 END,
        p.name
      LIMIT $2
    `;

    const result = await pool.query(query, [searchTerm, limit]);
    
    const suggestions = result.rows.map(row => ({
      name: row.name,
      name_ua: row.name_ua,
      name_pl: row.name_pl,
      brand: row.brand,
      model: row.model,
      category: row.category_name
    }));

    res.json({
      success: true,
      data: suggestions,
      query: q
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Suggestions failed',
      details: error.message 
    });
  }
});

// Search categories
router.get('/categories', [
  query('q').optional().isString().trim().isLength({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { q } = req.query;
    const pool = req.app.locals.pool;

    if (!pool) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database not connected' 
      });
    }

    let query = `
      SELECT 
        id,
        name,
        name_ua,
        name_pl,
        slug,
        description,
        image_url,
        sort_order
      FROM categories
      WHERE is_active = true
    `;

    const params = [];

    if (q && q.trim()) {
      const searchTerm = `%${q.trim().toLowerCase()}%`;
      query += `
        AND (
          LOWER(name) LIKE $1 OR
          LOWER(name_ua) LIKE $1 OR
          LOWER(name_pl) LIKE $1 OR
          LOWER(description) LIKE $1
        )
      `;
      params.push(searchTerm);
    }

    query += ` ORDER BY sort_order, name`;

    const result = await pool.query(query, params);
    
    const categories = result.rows.map(category => ({
      id: category.id,
      name: category.name,
      name_ua: category.name_ua,
      name_pl: category.name_pl,
      slug: category.slug,
      description: category.description,
      image_url: category.image_url,
      sort_order: category.sort_order
    }));

    res.json({
      success: true,
      data: categories,
      query: q
    });

  } catch (error) {
    console.error('Category search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Category search failed',
      details: error.message 
    });
  }
});

module.exports = router;
