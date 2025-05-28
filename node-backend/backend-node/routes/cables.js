const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Database connection configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get all cable products for Polish market
router.get('/', async (req, res) => {
  const { search, category } = req.query;
  
  try {
    // Default to Polish market (ID 1)
    const marketId = 1; // Poland
    
    let query = `
      SELECT 
        p.product_id, 
        p.sku, 
        p.model_number, 
        p.name, 
        p.description, 
        p.specifications,
        cs.conductor_type,
        cs.conductor_material,
        cs.conductor_cross_sectional_area,
        cs.insulation_type,
        cs.voltage_rating,
        cs.diameter,
        cs.weight_per_km,
        cs.min_bending_radius,
        cs.max_pulling_force,
        pmd.is_available,
        pmd.price,
        pmd.stock_status,
        pmd.lead_time_days,
        pi.file_path AS image_url
      FROM 
        products p
      LEFT JOIN 
        product_market_data pmd ON p.product_id = pmd.product_id
      LEFT JOIN 
        cable_specifications cs ON p.product_id = cs.product_id
      LEFT JOIN 
        product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
      WHERE 
        pmd.market_id = ?
    `;
    
    const queryParams = [marketId];
    
    if (category) {
      query += ' AND p.category_id = ?';
      queryParams.push(category);
    }
    
    if (search) {
      query += ' AND (p.name LIKE ? OR p.sku LIKE ? OR p.model_number LIKE ?)';
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }
    
    query += ' ORDER BY p.name';
    
    const [rows] = await pool.query(query, queryParams);
    
    // Format the response
    const formattedRows = rows.map(row => ({
      id: row.product_id,
      sku: row.sku,
      name: row.name,
      model_number: row.model_number,
      description: row.description,
      specifications: {
        conductor_type: row.conductor_type,
        conductor_material: row.conductor_material,
        conductor_cross_sectional_area: row.conductor_cross_sectional_area,
        insulation_type: row.insulation_type,
        voltage_rating: row.voltage_rating,
        diameter: row.diameter,
        weight_per_km: row.weight_per_km,
        min_bending_radius: row.min_bending_radius,
        max_pulling_force: row.max_pulling_force
      },
      market_data: {
        is_available: row.is_available === 1,
        price: row.price,
        stock_status: row.stock_status,
        lead_time_days: row.lead_time_days
      },
      image_url: row.image_url
    }));
    
    res.json(formattedRows);
  } catch (error) {
    console.error('Error fetching cable products:', error);
    res.status(500).json({ error: 'Failed to fetch cable products' });
  }
});

// Get cable product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Default to Polish market (ID 1)
    const marketId = 1; // Poland
    
    // Get product with market-specific data
    const [productRows] = await pool.query(`
      SELECT 
        p.product_id, 
        p.sku, 
        p.model_number, 
        p.name, 
        p.description, 
        p.technical_description,
        p.specifications,
        pc.name AS category_name,
        cs.*,
        pmd.is_available,
        pmd.price,
        pmd.stock_status,
        pmd.lead_time_days,
        pmd.local_name,
        pmd.local_description
      FROM 
        products p
      LEFT JOIN 
        product_categories pc ON p.category_id = pc.category_id
      LEFT JOIN 
        product_market_data pmd ON p.product_id = pmd.product_id
      LEFT JOIN 
        cable_specifications cs ON p.product_id = cs.product_id
      WHERE 
        p.product_id = ? AND pmd.market_id = ?
    `, [id, marketId]);
    
    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = productRows[0];
    
    // Get product images
    const [imageRows] = await pool.query(`
      SELECT file_path, alt_text, is_primary
      FROM product_images
      WHERE product_id = ?
      ORDER BY is_primary DESC, sort_order
    `, [id]);
    
    // Get product documents
    const [documentRows] = await pool.query(`
      SELECT document_id, title, file_path, document_type, language_code
      FROM product_documents
      WHERE product_id = ?
      ORDER BY document_type, title
    `, [id]);
    
    // Format response
    const response = {
      id: product.product_id,
      sku: product.sku,
      name: product.name,
      model_number: product.model_number,
      description: product.description,
      technical_description: product.technical_description,
      category_name: product.category_name,
      specifications: {
        conductor_type: product.conductor_type,
        conductor_material: product.conductor_material,
        conductor_cross_sectional_area: product.conductor_cross_sectional_area,
        insulation_type: product.insulation_type,
        voltage_rating: product.voltage_rating,
        diameter: product.diameter,
        weight_per_km: product.weight_per_km,
        min_bending_radius: product.min_bending_radius,
        max_pulling_force: product.max_pulling_force,
        conductor_resistance: product.conductor_resistance,
        operating_temperature_min: product.operating_temperature_min,
        operating_temperature_max: product.operating_temperature_max,
        standards: product.standards
      },
      market_data: {
        is_available: product.is_available === 1,
        price: product.price,
        stock_status: product.stock_status,
        lead_time_days: product.lead_time_days,
        local_name: product.local_name,
        local_description: product.local_description
      },
      images: imageRows.map(img => ({
        url: img.file_path,
        alt_text: img.alt_text,
        is_primary: img.is_primary === 1
      })),
      documents: documentRows.map(doc => ({
        id: doc.document_id,
        title: doc.title,
        url: doc.file_path,
        type: doc.document_type,
        language: doc.language_code
      }))
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching cable product details:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

module.exports = router;