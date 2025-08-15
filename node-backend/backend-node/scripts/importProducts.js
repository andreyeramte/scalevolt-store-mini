#!/usr/bin/env node

/**
 * Product Import Script for ScaleVolt Store
 * 
 * Usage:
 * node scripts/importProducts.js --file products.csv --supplier "ScaleVolt" --dry-run
 * node scripts/importProducts.js --file products.xlsx --supplier "External Supplier" --update-existing
 * 
 * Features:
 * - CSV and Excel file support
 * - Upsert functionality (insert or update)
 * - Validation and error handling
 * - Import logging
 * - Dry-run mode for testing
 * - Multi-language support
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const ExcelJS = require('exceljs');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import database connection
const { pool } = require('../db/pool');

// Command line argument parsing
const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i += 2) {
  if (args[i].startsWith('--')) {
    const key = args[i].slice(2);
    const value = args[i + 1];
    options[key] = value;
  }
}

// Default values
const config = {
  file: options.file || 'data/products.csv',
  supplier: options.supplier || 'ScaleVolt',
  dryRun: options['dry-run'] === 'true' || options.dryRun === 'true',
  updateExisting: options['update-existing'] === 'true' || options.updateExisting === 'true',
  validateOnly: options['validate-only'] === 'true' || options.validateOnly === 'true',
  verbose: options.verbose === 'true' || options.v === 'true'
};

// CSV Template structure
const CSV_TEMPLATE = {
  headers: [
    'sku', 'name', 'name_ua', 'name_pl', 'description', 'description_ua', 'description_pl',
    'price', 'original_price', 'cost_price', 'currency', 'stock_quantity', 'min_stock_level',
    'brand', 'model', 'weight', 'dimensions', 'specifications', 'category_slug',
    'tags', 'main_image_url', 'images', 'slug', 'meta_title', 'meta_description',
    'status', 'is_featured', 'is_on_sale', 'is_rental', 'rental_prices',
    'installation_available', 'installation_price'
  ],
  required: ['sku', 'name', 'price', 'category_slug'],
  optional: [
    'name_ua', 'name_pl', 'description', 'description_ua', 'description_pl',
    'original_price', 'cost_price', 'currency', 'stock_quantity', 'min_stock_level',
    'brand', 'model', 'weight', 'dimensions', 'specifications', 'tags',
    'main_image_url', 'images', 'slug', 'meta_title', 'meta_description',
    'status', 'is_featured', 'is_on_sale', 'is_rental', 'rental_prices',
    'installation_available', 'installation_price'
  ]
};

class ProductImporter {
  constructor(config) {
    this.config = config;
    this.stats = {
      total: 0,
      imported: 0,
      updated: 0,
      errors: 0,
      skipped: 0
    };
    this.errors = [];
    this.importLogId = null;
  }

  async init() {
    console.log('🚀 Starting ScaleVolt Product Import');
    console.log(`📁 File: ${this.config.file}`);
    console.log(`🏢 Supplier: ${this.config.supplier}`);
    console.log(`🔍 Dry Run: ${this.config.dryRun}`);
    console.log(`🔄 Update Existing: ${this.config.updateExisting}`);
    console.log('');

    // Create import log entry
    if (!this.config.dryRun) {
      this.importLogId = await this.createImportLog();
    }
  }

  async createImportLog() {
    try {
      const result = await pool.query(
        `INSERT INTO import_logs (filename, supplier, status, started_at) 
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id`,
        [path.basename(this.config.file), this.config.supplier, 'processing']
      );
      return result.rows[0].id;
    } catch (error) {
      console.error('❌ Error creating import log:', error);
      return null;
    }
  }

  async updateImportLog(status, errors = null) {
    if (!this.importLogId) return;

    try {
      await pool.query(
        `UPDATE import_logs 
         SET status = $1, imported_count = $2, updated_count = $3, error_count = $4, 
             errors = $5, completed_at = CURRENT_TIMESTAMP 
         WHERE id = $6`,
        [
          status,
          this.stats.imported,
          this.stats.updated,
          this.stats.errors,
          errors ? JSON.stringify(errors) : null,
          this.importLogId
        ]
      );
    } catch (error) {
      console.error('❌ Error updating import log:', error);
    }
  }

  async readFile() {
    const filePath = path.resolve(this.config.file);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.csv') {
      return this.readCSV(filePath);
    } else if (ext === '.xlsx' || ext === '.xls') {
      return this.readExcel(filePath);
    } else {
      throw new Error(`Unsupported file format: ${ext}`);
    }
  }

  async readCSV(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    return records;
  }

  async readExcel(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.getWorksheet(1);
    const records = [];
    
    let headers = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        headers = row.values.slice(1);
      } else {
        const record = {};
        row.values.slice(1).forEach((value, index) => {
          record[headers[index]] = value;
        });
        records.push(record);
      }
    });
    
    return records;
  }

  validateRecord(record, index) {
    const errors = [];
    
    // Check required fields
    CSV_TEMPLATE.required.forEach(field => {
      if (!record[field] || record[field].toString().trim() === '') {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate SKU format
    if (record.sku && !/^[A-Z0-9-_]+$/.test(record.sku)) {
      errors.push('SKU must contain only uppercase letters, numbers, hyphens, and underscores');
    }

    // Validate price
    if (record.price && isNaN(parseFloat(record.price))) {
      errors.push('Price must be a valid number');
    }

    // Validate stock quantity
    if (record.stock_quantity && (isNaN(parseInt(record.stock_quantity)) || parseInt(record.stock_quantity) < 0)) {
      errors.push('Stock quantity must be a non-negative integer');
    }

    // Validate JSON fields
    ['dimensions', 'specifications', 'rental_prices', 'images'].forEach(field => {
      if (record[field]) {
        try {
          JSON.parse(record[field]);
        } catch (e) {
          errors.push(`${field} must be valid JSON`);
        }
      }
    });

    return errors;
  }

  async getCategoryId(slug) {
    try {
      const result = await pool.query('SELECT id FROM categories WHERE slug = $1', [slug]);
      return result.rows[0]?.id || null;
    } catch (error) {
      console.error('Error getting category ID:', error);
      return null;
    }
  }

  async processRecord(record, index) {
    const errors = this.validateRecord(record, index);
    
    if (errors.length > 0) {
      this.stats.errors++;
      this.errors.push(`Row ${index + 1}: ${errors.join(', ')}`);
      return null;
    }

    try {
      // Get category ID
      const categoryId = await this.getCategoryId(record.category_slug);
      if (!categoryId) {
        this.stats.errors++;
        this.errors.push(`Row ${index + 1}: Category not found: ${record.category_slug}`);
        return null;
      }

      // Prepare product data
      const productData = {
        id: uuidv4(),
        sku: record.sku.toUpperCase(),
        name: record.name,
        name_ua: record.name_ua || null,
        name_pl: record.name_pl || null,
        description: record.description || null,
        description_ua: record.description_ua || null,
        description_pl: record.description_pl || null,
        price: parseFloat(record.price),
        original_price: record.original_price ? parseFloat(record.original_price) : null,
        cost_price: record.cost_price ? parseFloat(record.cost_price) : null,
        currency: record.currency || 'USD',
        stock_quantity: record.stock_quantity ? parseInt(record.stock_quantity) : 0,
        min_stock_level: record.min_stock_level ? parseInt(record.min_stock_level) : 0,
        brand: record.brand || null,
        model: record.model || null,
        weight: record.weight ? parseFloat(record.weight) : null,
        dimensions: record.dimensions ? JSON.parse(record.dimensions) : null,
        specifications: record.specifications ? JSON.parse(record.specifications) : null,
        category_id: categoryId,
        tags: record.tags ? record.tags.split(',').map(tag => tag.trim()) : [],
        main_image_url: record.main_image_url || null,
        images: record.images ? JSON.parse(record.images) : null,
        slug: record.slug || this.generateSlug(record.name),
        meta_title: record.meta_title || record.name,
        meta_description: record.meta_description || record.description,
        status: record.status || 'published',
        is_featured: record.is_featured === 'true' || record.is_featured === '1',
        is_on_sale: record.is_on_sale === 'true' || record.is_on_sale === '1',
        is_rental: record.is_rental === 'true' || record.is_rental === '1',
        rental_prices: record.rental_prices ? JSON.parse(record.rental_prices) : null,
        installation_available: record.installation_available === 'true' || record.installation_available === '1',
        installation_price: record.installation_price ? parseFloat(record.installation_price) : null
      };

      if (this.config.dryRun) {
        console.log(`✅ Would process: ${productData.name} (${productData.sku})`);
        this.stats.imported++;
        return productData;
      }

      // Check if product exists
      const existingProduct = await pool.query(
        'SELECT id FROM products WHERE sku = $1',
        [productData.sku]
      );

      if (existingProduct.rows.length > 0) {
        if (this.config.updateExisting) {
          // Update existing product
          await this.updateProduct(existingProduct.rows[0].id, productData);
          this.stats.updated++;
          if (this.config.verbose) {
            console.log(`🔄 Updated: ${productData.name} (${productData.sku})`);
          }
        } else {
          this.stats.skipped++;
          if (this.config.verbose) {
            console.log(`⏭️  Skipped (exists): ${productData.name} (${productData.sku})`);
          }
        }
      } else {
        // Insert new product
        await this.insertProduct(productData);
        this.stats.imported++;
        if (this.config.verbose) {
          console.log(`✅ Imported: ${productData.name} (${productData.sku})`);
        }
      }

      return productData;
    } catch (error) {
      this.stats.errors++;
      this.errors.push(`Row ${index + 1}: ${error.message}`);
      console.error(`❌ Error processing row ${index + 1}:`, error);
      return null;
    }
  }

  async insertProduct(productData) {
    const query = `
      INSERT INTO products (
        id, sku, name, name_ua, name_pl, description, description_ua, description_pl,
        price, original_price, cost_price, currency, stock_quantity, min_stock_level,
        brand, model, weight, dimensions, specifications, category_id, tags,
        main_image_url, images, slug, meta_title, meta_description, status,
        is_featured, is_on_sale, is_rental, rental_prices, installation_available,
        installation_price, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `;

    await pool.query(query, [
      productData.id, productData.sku, productData.name, productData.name_ua,
      productData.name_pl, productData.description, productData.description_ua,
      productData.description_pl, productData.price, productData.original_price,
      productData.cost_price, productData.currency, productData.stock_quantity,
      productData.min_stock_level, productData.brand, productData.model,
      productData.weight, productData.dimensions, productData.specifications,
      productData.category_id, productData.tags, productData.main_image_url,
      productData.images, productData.slug, productData.meta_title,
      productData.meta_description, productData.status, productData.is_featured,
      productData.is_on_sale, productData.is_rental, productData.rental_prices,
      productData.installation_available, productData.installation_price
    ]);
  }

  async updateProduct(productId, productData) {
    const query = `
      UPDATE products SET
        name = $1, name_ua = $2, name_pl = $3, description = $4, description_ua = $5,
        description_pl = $6, price = $7, original_price = $8, cost_price = $9,
        currency = $10, stock_quantity = $11, min_stock_level = $12, brand = $13,
        model = $14, weight = $15, dimensions = $16, specifications = $17,
        category_id = $18, tags = $19, main_image_url = $20, images = $21,
        slug = $22, meta_title = $23, meta_description = $24, status = $25,
        is_featured = $26, is_on_sale = $27, is_rental = $28, rental_prices = $29,
        installation_available = $30, installation_price = $31, updated_at = CURRENT_TIMESTAMP
      WHERE id = $32
    `;

    await pool.query(query, [
      productData.name, productData.name_ua, productData.name_pl,
      productData.description, productData.description_ua, productData.description_pl,
      productData.price, productData.original_price, productData.cost_price,
      productData.currency, productData.stock_quantity, productData.min_stock_level,
      productData.brand, productData.model, productData.weight, productData.dimensions,
      productData.specifications, productData.category_id, productData.tags,
      productData.main_image_url, productData.images, productData.slug,
      productData.meta_title, productData.meta_description, productData.status,
      productData.is_featured, productData.is_on_sale, productData.is_rental,
      productData.rental_prices, productData.installation_available,
      productData.installation_price, productId
    ]);
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  async run() {
    try {
      await this.init();
      
      // Read file
      console.log('📖 Reading file...');
      const records = await this.readFile();
      this.stats.total = records.length;
      console.log(`📊 Found ${records.length} records`);

      if (this.config.validateOnly) {
        console.log('🔍 Validation mode - checking records...');
        for (let i = 0; i < records.length; i++) {
          const errors = this.validateRecord(records[i], i);
          if (errors.length > 0) {
            console.log(`❌ Row ${i + 1}: ${errors.join(', ')}`);
            this.stats.errors++;
          } else {
            console.log(`✅ Row ${i + 1}: Valid`);
          }
        }
      } else {
        // Process records
        console.log('🔄 Processing records...');
        for (let i = 0; i < records.length; i++) {
          await this.processRecord(records[i], i);
          
          // Progress indicator
          if ((i + 1) % 10 === 0 || i === records.length - 1) {
            console.log(`📈 Progress: ${i + 1}/${records.length} (${Math.round(((i + 1) / records.length) * 100)}%)`);
          }
        }
      }

      // Final statistics
      console.log('\n📊 Import Statistics:');
      console.log(`📦 Total: ${this.stats.total}`);
      console.log(`✅ Imported: ${this.stats.imported}`);
      console.log(`🔄 Updated: ${this.stats.updated}`);
      console.log(`⏭️  Skipped: ${this.stats.skipped}`);
      console.log(`❌ Errors: ${this.stats.errors}`);

      if (this.stats.errors > 0) {
        console.log('\n❌ Errors:');
        this.errors.forEach(error => console.log(`  - ${error}`));
      }

      // Update import log
      if (!this.config.dryRun) {
        const status = this.stats.errors > 0 ? 'completed_with_errors' : 'completed';
        await this.updateImportLog(status, this.errors.length > 0 ? this.errors : null);
      }

      console.log('\n🎉 Import completed!');
      
      if (this.config.dryRun) {
        console.log('💡 This was a dry run. Use --dry-run=false to perform actual import.');
      }

    } catch (error) {
      console.error('❌ Import failed:', error);
      
      if (!this.config.dryRun) {
        await this.updateImportLog('failed', [error.message]);
      }
      
      process.exit(1);
    } finally {
      await pool.end();
    }
  }
}

// Create CSV template
function createCSVTemplate() {
  const templatePath = 'data/products_template.csv';
  const templateDir = path.dirname(templatePath);
  
  if (!fs.existsSync(templateDir)) {
    fs.mkdirSync(templateDir, { recursive: true });
  }

  const csvContent = CSV_TEMPLATE.headers.join(',') + '\n';
  fs.writeFileSync(templatePath, csvContent);
  
  console.log(`📄 CSV template created: ${templatePath}`);
  console.log('📝 Add your product data to this file and run the import script.');
}

// Main execution
if (require.main === module) {
  if (options['create-template']) {
    createCSVTemplate();
    process.exit(0);
  }

  const importer = new ProductImporter(config);
  importer.run();
}

module.exports = ProductImporter;
