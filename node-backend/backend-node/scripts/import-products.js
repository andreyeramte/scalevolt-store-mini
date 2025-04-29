// scripts/import-products.js
const { Pool } = require('pg');
const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Create a new PostgreSQL connection pool
function createPool() {
  return new Pool({
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT) || 5433,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE || 'scalevolt_store',
  });
}

// Test database connection
async function checkPostgresConnection() {
  const pool = createPool();
  try {
    console.log('Testing PostgreSQL connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected successfully:', result.rows[0].now);
    await pool.end();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    console.log('Please check that PostgreSQL is running and your connection details are correct.');
    console.log(`Connection details: host=${process.env.PGHOST || 'localhost'}, port=${process.env.PGPORT || 5433}, database=${process.env.PGDATABASE || 'scalevolt_store'}`);
    await pool.end();
    return false;
  }
}

// Common upsert logic with inserted/updated tracking
async function upsertProduct(pool, columns, values) {
  const cols = columns.join(', ');
  const params = columns.map((_, i) => `$${i + 1}`).join(', ');
  const updates = columns.map(col => `${col} = EXCLUDED.${col}`).join(', ');
  const query = `
    INSERT INTO products (${cols})
    VALUES (${params})
    ON CONFLICT (id)
    DO UPDATE SET ${updates}
    RETURNING (xmax = 0) AS inserted;
  `;
  const res = await pool.query(query, values);
  return res.rows[0].inserted;
}

// Log import operation
async function logImport(pool, supplier, filename, importedCount, updatedCount, errorCount, errors) {
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
    );
  `);
  let status = 'completed';
  if (errorCount > 0 && (importedCount > 0 || updatedCount > 0)) status = 'partial';
  else if (errorCount > 0) status = 'failed';

  await pool.query(
    `INSERT INTO import_logs (supplier, filename, products_imported, products_updated, error_count, error_log, status, imported_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'script')`,
    [supplier, filename, importedCount, updatedCount, errorCount, errors.length ? JSON.stringify(errors) : null, status]
  );
  console.log('Import log saved to database');
}

// Import products from Excel file
async function importProductsFromExcel(filePath, supplierName = 'Unknown Supplier') {
  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return { success: false, message: 'File not found' };
  }

  const pool = createPool();
  let importedCount = 0, updatedCount = 0, errorCount = 0;
  const errors = [];
  
  console.log(`Starting import from file: ${filePath}`);
  console.log(`Supplier: ${supplierName}`);

  try {
    // Read the Excel/CSV file
    const wb = xlsx.readFile(filePath, { 
      cellDates: true,
      cellNF: true,
      cellText: false
    });
    
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
    
    console.log(`Found ${rows.length} products in file`);
    
    if (rows.length === 0) {
      console.error('No data found in file');
      return { success: false, message: 'No data found in file' };
    }

    // Check table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        default_name VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        original_price DECIMAL(10, 2),
        image TEXT,
        images TEXT,
        brand VARCHAR(100),
        type VARCHAR(100),
        model VARCHAR(100),
        quantity VARCHAR(100),
        installation_available BOOLEAN DEFAULT FALSE,
        supplier VARCHAR(100),
        properties JSONB DEFAULT '{}'::jsonb,
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Begin transaction
    await pool.query('BEGIN');
    
    // Process each row
    for (const row of rows) {
      try {
        // Generate ID if not present
        const id = row.id || row.ID || `${supplierName.replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000000)}`;
        
        // Extract standard fields
        const columns = [
          'id', 'title', 'default_name', 'price', 'original_price',
          'image', 'images', 'brand', 'type', 'model', 'quantity',
          'installation_available', 'supplier', 'properties', 'stock'
        ];
        
        // Extract any additional properties not in standard fields
        const standardFields = [
          'id', 'ID', 'Title', 'Name', 'DefaultName', 'Default Name',
          'Price', 'OriginalPrice', 'Original Price', 'Image', 'Images',
          'Brand', 'Type', 'Model', 'Quantity', 'InstallationAvailable',
          'Installation Available', 'Stock'
        ];
        
        const properties = {};
        Object.keys(row).forEach(key => {
          if (!standardFields.includes(key)) {
            properties[key] = row[key];
          }
        });
        
        // Prepare values
        const values = [
          id,
          row.Title || row.Name || '',
          row.DefaultName || row['Default Name'] || row.Name || '',
          Number(row.Price) || 0,
          row.OriginalPrice || row['Original Price'] ? Number(row.OriginalPrice || row['Original Price']) : null,
          row.Image || null,
          row.Images ? JSON.stringify(row.Images) : null,
          row.Brand || '',
          row.Type || '',
          row.Model || '',
          row.Quantity || '1 piece',
          row.InstallationAvailable || row['Installation Available'] || false,
          supplierName,
          JSON.stringify(properties),
          Number(row.Stock) || 0
        ];
        
        // Insert or update
        const inserted = await upsertProduct(pool, columns, values);
        
        if (inserted) {
          importedCount++;
          console.log(`✅ Imported product: ${id}`);
        } else {
          updatedCount++;
          console.log(`🔄 Updated product: ${id}`);
        }
      } catch (err) {
        errorCount++;
        const productId = row.id || row.ID || 'unknown';
        errors.push({ id: productId, error: err.message });
        console.error(`❌ Error with product ${productId}:`, err.message);
      }
    }
    
    // Commit transaction
    await pool.query('COMMIT');
    
    console.log(`\nImport Summary:`);
    console.log(`✅ Products imported: ${importedCount}`);
    console.log(`🔄 Products updated: ${updatedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
    // Log the import
    await logImport(pool, supplierName, path.basename(filePath), importedCount, updatedCount, errorCount, errors);
    
    // Close the pool
    await pool.end();
    
    return { 
      success: true, 
      importedCount, 
      updatedCount, 
      errorCount, 
      errors 
    };
  } catch (error) {
    console.error('Import failed:', error.message);
    
    // Rollback transaction if it was started
    try {
      await pool.query('ROLLBACK');
    } catch (e) {
      // Ignore rollback error
    }
    
    // Close the pool
    await pool.end();
    
    return { 
      success: false, 
      message: error.message,
      importedCount, 
      updatedCount, 
      errorCount, 
      errors 
    };
  }
}

// CLI logic
(async () => {
  const args = process.argv.slice(2);
  
  // Check if we have enough arguments
  if (args.length < 1) {
    console.log('\nUsage: node import-products.js <file-path> [supplier-name]');
    console.log('\nExample:');
    console.log('  node import-products.js products.xlsx "Acme Supplies"');
    console.log('\nThe supplier name is optional. If not provided, "Unknown Supplier" will be used.\n');
    return;
  }
  
  // Check database connection
  if (!(await checkPostgresConnection())) {
    return;
  }
  
  const filePath = args[0];
  const supplierName = args[1] || 'Unknown Supplier';
  
  try {
    const result = await importProductsFromExcel(filePath, supplierName);
    console.log('\nImport process completed.');
    if (result.success) {
      console.log(`Successfully processed ${result.importedCount + result.updatedCount} products with ${result.errorCount} errors.`);
    } else {
      console.error(`Import failed: ${result.message}`);
    }
  } catch (error) {
    console.error('Error during import process:', error.message);
  }
})();