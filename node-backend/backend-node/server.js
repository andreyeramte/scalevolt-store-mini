// File: server.js
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import pool from '../db/pool.js';

// Load environment variables
dotenv.config();

const { Pool } = pg;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Products API endpoints
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



// Simple test route
app.get('/', (req, res) => {
  res.send('Server is running. Try /api/products to get the product list.');
});

// Start server
const PORT = process.env.PORT || 3005;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api/products`);
});