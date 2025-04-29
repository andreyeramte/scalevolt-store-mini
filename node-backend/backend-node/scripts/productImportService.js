// services/productImportService.js
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const pool = require('../db/pool');

class ProductImportService {
  /**
   * Process an Excel file and import products into the database
   * @param {string} filePath - Path to the Excel file
   * @param {string} supplierName - Name of the supplier
   * @param {Object} mappings - Optional column mappings
   * @returns {Object} - Import results
   */
  async importProductsFromExcel(filePath, supplierName, mappings = {}) {
    const client = await pool.connect();
    let importedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    const errors = [];

    try {
      console.log(`Starting product import from Excel file: ${filePath}`);
      
      // Read the Excel file
      const workbook = xlsx.readFile(filePath, {
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
        return { 
          success: false, 
          message: 'No products found in the Excel file',
          importedCount: 0,
          updatedCount: 0,
          errorCount: 0,
          errors: []
        };
      }
      
      console.log(`Found ${products.length} products to import from ${supplierName}`);
      
      // Start a transaction
      await client.query('BEGIN');
      
      for (const product of products) {
        try {
          // Map product fields based on provided mappings or default mapping
          const mappedProduct = this.mapProduct(product, mappings, supplierName);
          
          // Check if product already exists (by SKU)
          const existingProduct = await client.query(
            'SELECT id FROM products WHERE sku = $1',
            [mappedProduct.sku]
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
                installation_available = $11,
                supplier = $12,
                properties = $13,
                stock = $14,
                updated_at = CURRENT_TIMESTAMP
              WHERE sku = $15
            `, [
              mappedProduct.title,
              mappedProduct.default_name,
              mappedProduct.price,
              mappedProduct.original_price,
              mappedProduct.image,
              mappedProduct.images,
              mappedProduct.brand,
              mappedProduct.type,
              mappedProduct.model,
              mappedProduct.quantity,
              mappedProduct.installation_available,
              mappedProduct.supplier,
              mappedProduct.properties,
              mappedProduct.stock,
              mappedProduct.sku
            ]);
            
            updatedCount++;
          } else {
            // Insert new product
            await client.query(`
              INSERT INTO products(
                sku, title, default_name, price, original_price, 
                image, images, brand, type, model, quantity,
                installation_available, supplier, properties, stock
              )
              VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            `, [
              mappedProduct.sku,
              mappedProduct.title,
              mappedProduct.default_name,
              mappedProduct.price,
              mappedProduct.original_price,
              mappedProduct.image,
              mappedProduct.images,
              mappedProduct.brand,
              mappedProduct.type,
              mappedProduct.model,
              mappedProduct.quantity,
              mappedProduct.installation_available,
              mappedProduct.supplier,
              mappedProduct.properties,
              mappedProduct.stock
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
      await this.logImport(client, supplierName, path.basename(filePath), importedCount, updatedCount, errorCount, errors);
      
      return {
        success: true,
        message: `Successfully imported ${importedCount} products, updated ${updatedCount} products`,
        importedCount,
        updatedCount,
        errorCount,
        errors
      };
    } catch (error) {
      console.error('Error in Excel import process:', error);
      
      // Rollback the transaction if there was an error
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Error rolling back transaction:', rollbackError);
      }
      
      return {
        success: false,
        message: `Import failed: ${error.message}`,
        importedCount,
        updatedCount,
        errorCount,
        errors
      };
    } finally {
      client.release();
    }
  }
  
  /**
   * Map product fields based on provided mappings
   * @param {Object} product - Raw product from Excel
   * @param {Object} mappings - Column mappings
   * @param {string} supplierName - Name of the supplier
   * @returns {Object} - Mapped product
   */
  mapProduct(product, mappings, supplierName) {
    // Default mappings - adjust based on your Excel structure
    const defaultMappings = {
      sku: ['SKU', 'sku', 'ProductCode', 'Product Code', 'ItemCode', 'Item Code', 'ID', 'id'],
      title: ['Title', 'Name', 'ProductName', 'Product Name'],
      default_name: ['DefaultName', 'Default Name', 'Name', 'ProductName', 'Product Name'],
      price: ['Price', 'Cost', 'UnitPrice', 'Unit Price'],
      original_price: ['OriginalPrice', 'Original Price', 'MSRP', 'ListPrice', 'List Price'],
      image: ['Image', 'ImageURL', 'Image URL', 'PrimaryImage', 'Primary Image'],
      images: ['Images', 'ImageURLs', 'Image URLs', 'AdditionalImages', 'Additional Images'],
      brand: ['Brand', 'Manufacturer', 'Make'],
      type: ['Type', 'Category', 'ProductType', 'Product Type'],
      model: ['Model', 'ModelNumber', 'Model Number', 'PartNumber', 'Part Number'],
      quantity: ['Quantity', 'QuantityPerUnit', 'Quantity Per Unit', 'Unit'],
      stock: ['Stock', 'Inventory', 'QuantityInStock', 'Quantity In Stock', 'StockLevel', 'Stock Level']
    };
    
    const mappedProduct = {
      sku: '',
      title: '',
      default_name: '',
      price: 0,
      original_price: null,
      image: null,
      images: null,
      brand: '',
      type: '',
      model: '',
      quantity: '1 piece',
      installation_available: false,
      supplier: supplierName,
      properties: '{}',
      stock: 0
    };
    
    // Apply provided mappings if available
    if (Object.keys(mappings).length > 0) {
      Object.keys(mappings).forEach(dbField => {
        const excelColumn = mappings[dbField];
        if (excelColumn && product[excelColumn] !== undefined) {
          mappedProduct[dbField] = product[excelColumn];
        }
      });
    } else {
      // Apply default mappings
      Object.keys(defaultMappings).forEach(dbField => {
        const possibleColumns = defaultMappings[dbField];
        
        // Find the first matching column
        const matchingColumn = possibleColumns.find(col => product[col] !== undefined);
        
        if (matchingColumn) {
          mappedProduct[dbField] = product[matchingColumn];
        }
      });
    }
    
    // Process fields that need special handling
    
    // Generate SKU if not provided
    if (!mappedProduct.sku) {
      const idPart = Math.random().toString(36).substring(2, 10).toUpperCase();
      mappedProduct.sku = `${supplierName.replace(/\s+/g, '-')}-${idPart}`;
    }
    
    // Make sure title and default_name are set
    if (!mappedProduct.title && mappedProduct.default_name) {
      mappedProduct.title = mappedProduct.default_name;
    } else if (!mappedProduct.default_name && mappedProduct.title) {
      mappedProduct.default_name = mappedProduct.title;
    }
    
    // Parse price as float
    if (mappedProduct.price !== undefined) {
      mappedProduct.price = parseFloat(mappedProduct.price) || 0;
    }
    
    // Parse original_price as float
    if (mappedProduct.original_price !== undefined && mappedProduct.original_price !== null) {
      mappedProduct.original_price = parseFloat(mappedProduct.original_price) || null;
    }
    
    // Parse stock as integer
    if (mappedProduct.stock !== undefined) {
      mappedProduct.stock = parseInt(mappedProduct.stock, 10) || 0;
    }
    
    // Handle images array if it's a string
    if (typeof mappedProduct.images === 'string') {
      try {
        // Try to parse as JSON
        mappedProduct.images = JSON.parse(mappedProduct.images);
      } catch (e) {
        // If not valid JSON, treat as comma-separated list
        mappedProduct.images = mappedProduct.images.split(',').map(img => img.trim());
      }
    }
    
    // Convert images array to JSON string
    if (Array.isArray(mappedProduct.images)) {
      mappedProduct.images = JSON.stringify(mappedProduct.images);
    }
    
    // Extract additional properties
    const properties = this.extractAdditionalProperties(product, defaultMappings);
    mappedProduct.properties = JSON.stringify(properties);
    
    return mappedProduct;
  }
  
  /**
   * Extract additional properties from the Excel row
   * @param {Object} product - Raw product from Excel
   * @param {Object} defaultMappings - Default field mappings
   * @returns {Object} - Extracted properties
   */
  extractAdditionalProperties(product, defaultMappings) {
    const properties = {};
    const mappedFields = [];
    
    // Collect all mapped fields
    Object.keys(defaultMappings).forEach(field => {
      defaultMappings[field].forEach(col => {
        mappedFields.push(col);
      });
    });
    
    // Add all remaining fields as properties
    Object.keys(product).forEach(key => {
      if (!mappedFields.includes(key)) {
        properties[key] = product[key];
      }
    });
    
    return properties;
  }
  
  /**
   * Log the import operation to the database
   */
  async logImport(client, supplier, filename, importedCount, updatedCount, errorCount, errors) {
    try {
      // Check if import_logs table exists, if not, create it
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
        supplier,
        filename,
        importedCount,
        updatedCount,
        errorCount,
        errors.length > 0 ? JSON.stringify(errors) : null,
        status,
        'api'
      ]);
      
      console.log('Import log saved to database');
    } catch (error) {
      console.error('Error logging import:', error);
    }
  }
  
  /**
   * Validate an Excel file and suggest column mappings
   * @param {string} filePath - Path to the Excel file
   * @returns {Object} - Validation results with column suggestions
   */
  async validateExcelFile(filePath) {
    try {
      // Read the Excel file
      const workbook = xlsx.readFile(filePath, {
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
        return { 
          success: false, 
          message: 'No data found in the Excel file' 
        };
      }
      
      // Get first few rows as sample data
      const sampleData = products.slice(0, 5);
      
      // Get all columns
      const columns = Object.keys(products[0]);
      
      // Default field mappings
      const defaultMappings = {
        sku: ['SKU', 'sku', 'ProductCode', 'Product Code', 'ItemCode', 'Item Code', 'ID', 'id'],
        title: ['Title', 'Name', 'ProductName', 'Product Name'],
        default_name: ['DefaultName', 'Default Name', 'Name', 'ProductName', 'Product Name'],
        price: ['Price', 'Cost', 'UnitPrice', 'Unit Price'],
        original_price: ['OriginalPrice', 'Original Price', 'MSRP', 'ListPrice', 'List Price'],
        image: ['Image', 'ImageURL', 'Image URL', 'PrimaryImage', 'Primary Image'],
        images: ['Images', 'ImageURLs', 'Image URLs', 'AdditionalImages', 'Additional Images'],
        brand: ['Brand', 'Manufacturer', 'Make'],
        type: ['Type', 'Category', 'ProductType', 'Product Type'],
        model: ['Model', 'ModelNumber', 'Model Number', 'PartNumber', 'Part Number'],
        quantity: ['Quantity', 'QuantityPerUnit', 'Quantity Per Unit', 'Unit'],
        stock: ['Stock', 'Inventory', 'QuantityInStock', 'Quantity In Stock', 'StockLevel', 'Stock Level']
      };
      
      //