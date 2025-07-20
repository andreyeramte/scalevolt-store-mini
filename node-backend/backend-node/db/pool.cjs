const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres', // Replace this with your actual password when running
  database: process.env.DB_NAME || 'postgres',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test the connection
pool.on('connect', () => {
  console.log('Successfully connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// Database operations
async function getProducts(filters = {}) {
  let query = 'SELECT * FROM products';
  const params = [];
  
  if (Object.keys(filters).length) {
    const clauses = [];
    if (filters.type) {
      clauses.push(`type = $${params.length + 1}`);
      params.push(filters.type);
    }
    if (filters.categoryId) {
      clauses.push(`category_id = $${params.length + 1}`);
      params.push(filters.categoryId);
    }
    if (filters.brand) {
      clauses.push(`brand = $${params.length + 1}`);
      params.push(filters.brand);
    }
    if (filters.supplier) {
      clauses.push(`supplier = $${params.length + 1}`);
      params.push(filters.supplier);
    }
    if (filters.sku) {
      clauses.push(`sku = $${params.length + 1}`);
      params.push(filters.sku);
    }
    query += ' WHERE ' + clauses.join(' AND ');
  }
  
  // Add sorting and limit if needed
  if (filters.sort) {
    query += ` ORDER BY ${filters.sort} ${filters.order || 'ASC'}`;
  }
  
  if (filters.limit) {
    query += ` LIMIT $${params.length + 1}`;
    params.push(filters.limit);
    
    if (filters.offset) {
      query += ` OFFSET $${params.length + 1}`;
      params.push(filters.offset);
    }
  }
  
  try {
    const res = await pool.query(query, params);
    return res.rows;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
}

async function getProductById(id) {
  try {
    const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return res.rows[0];
  } catch (error) {
    console.error('Error getting product by ID:', error);
    throw error;
  }
}

// Define the function here instead of importing it
function buildSearchableText(product) {
  const fields = [
    product.name,
    product.name_ua,
    product.name_pl,
    product.description,
    product.description_ua,
    product.description_pl,
    product.brand,
    product.model,
    product.type,
    product.sku
  ];
  
  return fields
    .filter(field => field) // Remove null/undefined values
    .join(' ')
    .toLowerCase();
}

async function createProduct(data) {
  try {
    const searchable_text = buildSearchableText(data);
    
    // Generate SKU if not provided
    if (!data.sku) {
      data.sku = `PRD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    const res = await pool.query(
      `INSERT INTO products
      (title, name, price, original_price, quantity, brand, model,
      type, images, image, offers, installation_available,
      category_id, name_ua, name_pl,
      description, description_ua, description_pl, searchable_text, sku, supplier, properties)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
      RETURNING *`,
      [
        data.title, data.name, data.price, data.original_price,
        data.quantity, data.brand, data.model, data.type,
        JSON.stringify(data.images || []), data.image,
        JSON.stringify(data.offers || []), data.installation_available,
        data.category_id, data.name_ua, data.name_pl,
        data.description, data.description_ua, data.description_pl,
        searchable_text, data.sku, data.supplier, 
        JSON.stringify(data.properties || {})
      ]
    );
    return res.rows[0];
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

async function updateProduct(id, data) {
  try {
    const existing = await pool.query('SELECT * FROM products WHERE id=$1', [id]);
    if (!existing.rows.length) throw new Error('Product not found');
    
    const product = { ...existing.rows[0], ...data };
    const searchable_text = buildSearchableText(product);
    
    const fields = Object.keys(data);
    const sets = fields.map((f, i) =>
      ['images', 'offers', 'properties'].includes(f)
        ? `${f}=$${i + 1}::json`
        : `${f}=$${i + 1}`
    );
    sets.push(`searchable_text=$${fields.length + 1}`);
    sets.push(`updated_at=CURRENT_TIMESTAMP`);
    
    const values = fields.map(f =>
      ['images', 'offers', 'properties'].includes(f)
        ? JSON.stringify(data[f])
        : data[f]
    );
    values.push(searchable_text, id);
    
    const res = await pool.query(
      `UPDATE products SET ${sets.join(', ')} WHERE id=$${values.length} RETURNING *`,
      values
    );
    return res.rows[0];
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// Added function to get suppliers
async function getSuppliers() {
  try {
    const res = await pool.query('SELECT DISTINCT supplier FROM products WHERE supplier IS NOT NULL ORDER BY supplier');
    return res.rows.map(row => row.supplier);
  } catch (error) {
    console.error('Error getting suppliers:', error);
    throw error;
  }
}

module.exports = {
  pool,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  getSuppliers
};