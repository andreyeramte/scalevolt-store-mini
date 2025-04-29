// routes/suppliers.js
const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

/**
 * @route GET /api/suppliers
 * @desc Get all suppliers
 * @access Private
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM suppliers WHERE active = TRUE ORDER BY name'
    );
    
    res.status(200).json({
      success: true,
      suppliers: result.rows
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({
      success: false,
      message: `Failed to fetch suppliers: ${error.message}`
    });