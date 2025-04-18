// db/pool.js (ES Module version)
import pkg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { buildSearchableText } from './db/pool.js';

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Create the pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Keepongrind7!',
  database: process.env.DB_NAME || 'scalevolt_store',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Helper function to build searchable text for multilingual support
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

// Get all products
const getProducts = async (filters = {}) => {
  try {
    let query = 'SELECT * FROM products';
    const queryParams = [];
    
    // Build WHERE clause based on filters
    if (Object.keys(filters).length > 0) {
      query += ' WHERE ';
      const filterClauses = [];
      
      if (filters.type) {
        filterClauses.push(`type = $${queryParams.length + 1}`);
        queryParams.push(filters.type);
      }
      
      if (filters.categoryId) {
        filterClauses.push(`category_id = $${queryParams.length + 1}`);
        queryParams.push(filters.categoryId);
      }
      
      if (filters.brand) {
        filterClauses.push(`brand = $${queryParams.length + 1}`);
        queryParams.push(filters.brand);
      }
      
      query += filterClauses.join(' AND ');
    }
    
    const result = await pool.query(query, queryParams);
    return result.rows;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Get product by ID
const getProductById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting product by ID:', error);
    throw error;
  }
};

// Create a new product
const createProduct = async (productData) => {
  const {
    title, name, price, original_price, quantity, brand,
    model, type, images, image, offers, installation_available, category_id,
    name_uk, name_pl, description, description_uk, description_pl
  } = productData;
  
  try {
    // Build searchable text for full-text search with multilingual support
    const searchable_text = buildSearchableText({
      name, name_uk, name_pl, description, description_uk, description_pl
    });
    
    const result = await pool.query(
      `INSERT INTO products (
        title, name, price, original_price, quantity, brand, model, 
        type, images, image, offers, installation_available, category_id,
        name_uk, name_pl, description, description_uk, description_pl, searchable_text
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *`,
      [
        title, name, price, original_price, quantity, brand, model, 
        type, JSON.stringify(images || []), image, JSON.stringify(offers || []), 
        installation_available, category_id, name_uk, name_pl, description, 
        description_uk, description_pl, searchable_text
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update a product
const updateProduct = async (id, productData) => {
  try {
    // First get existing product
    const existingProduct = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (existingProduct.rows.length === 0) {
      throw new Error('Product not found');
    }
    
    // Combine existing data with new data
    const product = { ...existingProduct.rows[0], ...productData };
    
    // Build searchable text
    const searchable_text = buildSearchableText(product);
    product.searchable_text = searchable_text;
    
    // Build the update query dynamically based on the fields provided
    const fields = Object.keys(productData).filter(key => productData[key] !== undefined);
    if (fields.length === 0) return existingProduct.rows[0]; // No fields to update
    
    // Prepare the SET clause and values array
    let setClause = fields.map((field, index) => {
      if (field === 'images' || field === 'offers') {
        return `${field} = $${index + 1}::json`;
      }
      return `${field} = $${index + 1}`;
    }).join(', ');
    
    // Add searchable_text to the SET clause
    setClause += ', searchable_text = $' + (fields.length + 1);
    
    // Extract values in the same order as the fields
    const values = fields.map(field => {
      if (field === 'images' || field === 'offers') {
        return JSON.stringify(product[field] || []);
      }
      return product[field];
    });
    
    // Add searchable_text value
    values.push(searchable_text);
    
    // Add the id as the last parameter
    values.push(id);
    
    // Execute the update query
    const result = await pool.query(
      `UPDATE products SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Export the pool and functions
export { pool, buildSearchableText, getProducts, getProductById, createProduct, updateProduct };
export default pool;