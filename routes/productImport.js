// routes/productImport.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { pool } = require('../db/pool');
const xlsx = require('xlsx');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow Excel files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.oasis.opendocument.spreadsheet'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max file size
});

/**
 * @route POST /api/import/products
 * @desc Import products from Excel file
 * @access Private
 */
router.post('/products', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Get supplier name from form
    const supplierName = req.body.supplier || 'Unknown Supplier';
    
    // Read the Excel file
    const workbook = xlsx.readFile(req.file.path, {
      cellStyles: true,
      cellDates: true,
      cellNF: true
    });
    
    // Assume the first sheet contains products
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const products = xlsx.utils.sheet_to_json(worksheet);
    
    if (!products || products.length === 0) {
      // Clean up file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: 'No data found in the Excel file' 
      });
    }
    
    // Process and import products
    const client = await pool.connect();
    let importedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    const errors = [];
    
    try {
      await client.query('BEGIN');
      
      for (const product of products) {
        try {
          // Generate a unique SKU if not provided
          const sku = product.SKU || product.sku || 
                    `${supplierName.replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000000)}`;
          
          // Map product fields - adjust based on your Excel structure
          const title = product.Title || product.Name || product.ProductName || '';
          const default_name = product.DefaultName || product.Name || product.ProductName || '';
          const price = parseFloat(product.Price || product.Cost || 0);
          const original_price = product.OriginalPrice ? parseFloat(product.OriginalPrice) : null;
          const image = product.Image || product.ImageURL || null;
          const images = typeof product.Images === 'string' ? product.Images : null;
          const brand = product.Brand || product.Manufacturer || '';
          const type = product.Type || product.Category || '';
          const model = product.Model || product.ModelNumber || '';
          const quantity = product.Quantity || '1 piece';
          const stock = parseInt(product.Stock || product.Inventory || 0, 10);
          
          // Extract remaining properties
          const properties = {};
          Object.keys(product).forEach(key => {
            if (!['SKU', 'sku', 'Title', 'Name', 'ProductName', 'DefaultName', 
                 'Price', 'Cost', 'OriginalPrice', 'Image', 'ImageURL', 
                 'Images', 'Brand', 'Manufacturer', 'Type', 'Category', 
                 'Model', 'ModelNumber', 'Quantity', 'Stock', 'Inventory'].includes(key)) {
              properties[key] = product[key];
            }
          });
          
          // Check if product already exists (by SKU)
          const existingProduct = await client.query(
            'SELECT id FROM products WHERE sku = $1',
            [sku]
          );
          
          if (existingProduct.rows.length > 0) {
            // Update existing product
            await client.query(`
              UPDATE products SET
                title = $1,
                default_name = $2,
                price = $3,
                original_price = $4,
                image = $5,
                images = $6,
                brand = $7,
                type = $8,
                model = $9,
                quantity = $10,
                supplier = $11,
                properties = $12,
                stock = $13,
                updated_at = CURRENT_TIMESTAMP
              WHERE sku = $14
            `, [
              title,
              default_name,
              price,
              original_price,
              image,
              images,
              brand,
              type,
              model,
              quantity,
              supplierName,
              JSON.stringify(properties),
              stock,
              sku
            ]);
            
            updatedCount++;
          } else {
            // Insert new product
            await client.query(`
              INSERT INTO products(
                sku, title, default_name, price, original_price, 
                image, images, brand, type, model, quantity,
                supplier, properties, stock
              )
              VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            `, [
              sku,
              title,
              default_name,
              price,
              original_price,
              image,
              images,
              brand,
              type,
              model,
              quantity,
              supplierName,
              JSON.stringify(properties),
              stock
            ]);
            
            importedCount++;
          }
        } catch (error) {
          errorCount++;
          errors.push({
            product: JSON.stringify(product).substring(0, 100),
            error: error.message
          });
          console.error(`Error importing product:`, error);
        }
      }
      
      // Commit the transaction
      await client.query('COMMIT');
      
      // Log the import
      await client.query(`
        CREATE TABLE IF NOT EXISTS import_logs (
          id SERIAL PRIMARY KEY,
          supplier VARCHAR(100) NOT NULL,
          filename VARCHAR(255) NOT NULL,
          products_imported INTEGER DEFAULT 0,
          products_updated INTEGER DEFAULT 0,
          error_count INTEGER DEFAULT 0,
          error_log TEXT,
          status VARCHAR(50) NOT NULL,
          import_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          imported_by VARCHAR(100)
        )
      `);
      
      // Determine status
      let status = 'completed';
      if (errorCount > 0 && (importedCount > 0 || updatedCount > 0)) {
        status = 'partial';
      } else if (errorCount > 0 && importedCount === 0 && updatedCount === 0) {
        status = 'failed';
      }
      
      // Insert log entry
      await client.query(`
        INSERT INTO import_logs (
          supplier, filename, products_imported, products_updated, 
          error_count, error_log, status, imported_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        supplierName,
        req.file.originalname,
        importedCount,
        updatedCount,
        errorCount,
        errors.length > 0 ? JSON.stringify(errors) : null,
        status,
        'api'
      ]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
    // Clean up the file after processing
    fs.unlinkSync(req.file.path);
    
    return res.status(200).json({
      success: true,
      message: `Successfully imported ${importedCount} products, updated ${updatedCount} products`,
      importedCount,
      updatedCount,
      errorCount,
      errors
    });
  } catch (error) {
    console.error('Error in product import route:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({ 
      success: false, 
      message: `Import failed: ${error.message}` 
    });
  }
});

/**
 * @route GET /api/import/suppliers
 * @desc Get list of suppliers from database
 * @access Private
 */
router.get('/suppliers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT supplier FROM products 
      WHERE supplier IS NOT NULL 
      ORDER BY supplier
    `);
    
    return res.status(200).json({
      success: true,
      suppliers: result.rows.map(row => row.supplier)
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch suppliers: ${error.message}`
    });
  }
});

/**
 * @route GET /api/import/logs
 * @desc Get import history logs
 * @access Private
 */
router.get('/logs', async (req, res) => {
  try {
    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS import_logs (
        id SERIAL PRIMARY KEY,
        supplier VARCHAR(100) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        products_imported INTEGER DEFAULT 0,
        products_updated INTEGER DEFAULT 0,
        error_count INTEGER DEFAULT 0,
        error_log TEXT,
        status VARCHAR(50) NOT NULL,
        import_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        imported_by VARCHAR(100)
      )
    `);
    
    const result = await pool.query(`
      SELECT * FROM import_logs 
      ORDER BY import_date DESC 
      LIMIT 100
    `);
    
    return res.status(200).json({
      success: true,
      logs: result.rows
    });
  } catch (error) {
    console.error('Error fetching import logs:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch import logs: ${error.message}`
    });
  }
});

module.exports = router;