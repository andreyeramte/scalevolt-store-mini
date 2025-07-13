const express = require('express');
const router = express.Router();
const { pool } = require('../../db/pool.cjs'); // Adjust path if needed

// Get all cable products
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = `
      SELECT 
        p.id, 
        p.sku, 
        p.name, 
        p.model_number, 
        p.description, 
        p.category_id,
        p.price,
        p.stock_status,
        p.is_available,
        p.lead_time_days,
        p.image_url,
        p.specifications
      FROM cable_products p
    `;
    
    const queryParams = [];
    
    // Add WHERE clauses if category or search are provided
    if (category || search) {
      query += ' WHERE';
      
      if (category) {
        query += ' p.category_id = $1';
        queryParams.push(category);
      }
      
      if (search) {
        if (category) {
          query += ' AND';
        }
        
        query += ` (p.name ILIKE $${queryParams.length + 1} OR p.sku ILIKE $${queryParams.length + 1} OR p.model_number ILIKE $${queryParams.length + 1})`;
        queryParams.push(`%${search}%`);
      }
    }
    
    query += ' ORDER BY p.name';
    
    const { rows } = await pool.query(query, queryParams);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cable products:', error);
    res.status(500).json({ error: 'Failed to fetch cable products' });
  }
});

// Get cable product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        p.id, 
        p.sku, 
        p.name, 
        p.model_number, 
        p.description, 
        p.technical_description,
        p.category_id,
        p.price,
        p.stock_status,
        p.is_available,
        p.lead_time_days,
        p.image_url,
        p.specifications
      FROM cable_products p
      WHERE p.id = $1
    `;
    
    const { rows } = await pool.query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching cable product:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// Update cable product's market data
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_available, price, stock_status, lead_time_days } = req.body;
    
    const query = `
      UPDATE cable_products 
      SET 
        is_available = $1,
        price = $2,
        stock_status = $3,
        lead_time_days = $4,
        updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [
      is_available, 
      price, 
      stock_status, 
      lead_time_days, 
      id
    ]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating cable product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Import cable products from CSV (basic implementation)
router.post('/import', async (req, res) => {
  // This would need file upload middleware and CSV parsing logic
  // For now, we'll just return a message
  res.json({ message: 'Import functionality would be implemented here' });
});

module.exports = router;