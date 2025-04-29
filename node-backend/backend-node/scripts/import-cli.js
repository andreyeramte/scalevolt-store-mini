#!/usr/bin/env node
// scripts/import-cli.js

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import our service
const productImportService = require('../services/productImportService');

// Setup command-line interface
program
  .name('product-import')
  .description('Import products from Excel files')
  .version('1.0.0');

// Import command
program
  .command('import <file>')
  .description('Import products from an Excel file')
  .option('-s, --supplier <name>', 'Specify supplier name')
  .option('-y, --yes', 'Skip confirmation')
  .option('-m, --mapping <file>', 'Use column mapping from JSON file')
  .action(async (file, options) => {
    try {
      // Check if file exists
      if (!fs.existsSync(file)) {
        console.error(chalk.red(`Error: File not found - ${file}`));
        process.exit(1);
      }

      // Display file info
      const stats = fs.statSync(file);
      console.log(chalk.cyan('File Information:'));
      console.log(`  Path: ${chalk.green(file)}`);
      console.log(`  Size: ${chalk.green(formatFileSize(stats.size))}`);
      console.log(`  Modified: ${chalk.green(stats.mtime.toLocaleString())}`);
      
      // Read file to analyze structure
      const spinner = ora('Analyzing file structure...').start();
      const workbook = xlsx.readFile(file, {
        cellStyles: true,
        cellDates: true,
        cellNF: true
      });
      
      // Get sheet info
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const products = xlsx.utils.sheet_to_json(worksheet);
      
      spinner.succeed(`Found ${chalk.green(products.length)} products in ${chalk.green(workbook.SheetNames.length)} sheets`);
      
      // Get supplier name if not provided
      let supplierName = options.supplier;
      if (!supplierName) {
        // Get list of existing suppliers
        const pool = new Pool({
          host: process.env.PGHOST || 'localhost',
          port: process.env.PGPORT || 5432,
          user: process.env.PGUSER || 'postgres',
          password: process.env.PGPASSWORD || 'your_password',
          database: process.env.PGDATABASE || 'scalevolt_store'
        });
        
        try {
          const result = await pool.query('SELECT name FROM suppliers ORDER BY name');
          const suppliers = result.rows.map(row => row.name);
          
          // Add option for new supplier
          suppliers.push('-- Add New Supplier --');
          
          const answer = await inquirer.prompt([
            {
              type: 'list',
              name: 'supplier',
              message: 'Select a supplier:',
              choices: suppliers
            }
          ]);
          
          if (answer.supplier === '-- Add New Supplier --') {
            const newSupplier = await inquirer.prompt([
              {
                type: 'input',
                name: 'name',
                message: 'Enter new supplier name:',
                validate: input => input.trim() !== '' ? true : 'Supplier name cannot be empty'
              }
            ]);
            
            supplierName = newSupplier.name;
            
            // Add new supplier to database
            await pool.query('INSERT INTO suppliers (name) VALUES ($1)', [supplierName]);
            console.log(chalk.green(`Added new supplier: ${supplierName}`));
          } else {
            supplierName = answer.supplier;
          }
        } catch (error) {
          console.error(chalk.yellow('Could not load suppliers from database, please enter manually.'));
          const answer = await inquirer.prompt([
            {
              type: 'input',
              name: 'supplier',
              message: 'Enter supplier name:',
              validate: input => input.trim() !== '' ? true : 'Supplier name cannot be empty'
            }
          ]);
          supplierName = answer.supplier;
        } finally {
          await pool.end();
        }
      }
      
      // Load column mappings
      let mappings = {};
      
      if (options.mapping) {
        // Load mappings from file
        if (fs.existsSync(options.mapping)) {
          try {
            const mappingContent = fs.readFileSync(options.mapping, 'utf8');
            mappings = JSON.parse(mappingContent);
            console.log(chalk.green('Using column mappings from file:'));
            Object.entries(mappings).forEach(([field, column]) => {
              console.log(`  ${chalk.cyan(field)} -> ${chalk.yellow(column)}`);
            });
          } catch (error) {
            console.error(chalk.red(`Error loading mapping file: ${error.message}`));
            process.exit(1);
          }
        } else {
          console.error(chalk.red(`Mapping file not found: ${options.mapping}`));
          process.exit(1);
        }
      } else {
        // Display column structure
        console.log(chalk.cyan('\nFile Column Structure:'));
        if (products.length > 0) {
          const columns = Object.keys(products[0]);
          columns.forEach(column => {
            const sampleValue = products[0][column];
            const valueType = typeof sampleValue;
            console.log(`  ${chalk.yellow(column)} (${chalk.green(valueType)}): ${truncate(String(sampleValue), 30)}`);
          });
          
          // Ask if user wants to create a mapping
          if (!options.yes) {
            const answer = await inquirer.prompt([
              {
                type: 'confirm',
                name: 'createMapping',
                message: 'Do you want to map columns to database fields?',
                default: true
              }
            ]);
            
            if (answer.createMapping) {
              // Database fields to map
              const dbFields = [
                { field: 'sku', label: 'SKU', required: true },
                { field: 'title', label: 'Product Name', required: true },
                { field: 'default_name', label: 'Default Name', required: false },
                { field: 'price', label: 'Price', required: true },
                { field: 'original_price', label: 'Original Price', required: false },
                { field: 'image', label: 'Image URL', required: false },
                { field: 'brand', label: 'Brand', required: false },
                { field: 'type', label: 'Type/Category', required: false },
                { field: 'model', label: 'Model', required: false },
                { field: 'stock', label: 'Stock Quantity', required: false },
                { field: 'weight', label: 'Weight', required: false },
                { field: 'dimensions', label: 'Dimensions', required: false }
              ];
              
              // For each field, ask for the column mapping
              for (const field of dbFields) {
                const answer = await inquirer.prompt([
                  {
                    type: 'list',
                    name: 'column',
                    message: `Select column for ${field.label}${field.required ? ' (required)' : ''}:`,
                    choices: ['-- Skip --', ...columns],
                    default: columns.find(col => col.toLowerCase() === field.field.toLowerCase()) || 0
                  }
                ]);
                
                if (answer.column !== '-- Skip --') {
                  mappings[field.field] = answer.column;
                }
              }
              
              console.log(chalk.green('\nColumn Mappings:'));
              Object.entries(mappings).forEach(([field, column]) => {
                console.log(`  ${chalk.cyan(field)} -> ${chalk.yellow(column)}`);
              });
              
              // Ask if user wants to save the mapping
              const saveAnswer = await inquirer.prompt([
                {
                  type: 'confirm',
                  name: 'saveMapping',
                  message: 'Do you want to save this mapping for future use?',
                  default: true
                }
              ]);
              
              if (saveAnswer.saveMapping) {
                const fileAnswer = await inquirer.prompt([
                  {
                    type: 'input',
                    name: 'filename',
                    message: 'Enter a filename for the mapping:',
                    default: `${supplierName.replace(/\s+/g, '_').toLowerCase()}_mapping.json`
                  }
                ]);
                
                const mappingDir = path.join(__dirname, '../mappings');
                if (!fs.existsSync(mappingDir)) {
                  fs.mkdirSync(mappingDir, { recursive: true });
                }
                
                const mappingPath = path.join(mappingDir, fileAnswer.filename);
                fs.writeFileSync(mappingPath, JSON.stringify(mappings, null, 2));
                console.log(chalk.green(`Mapping saved to: ${mappingPath}`));
              }
            }
          }
        }
      }
      
      // Confirm import
      if (!options.yes) {
        const answer = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: `Ready to import ${products.length} products from "${supplierName}"?`,
            default: true
          }
        ]);
        
        if (!answer.proceed) {
          console.log(chalk.yellow('Import cancelled.'));
          process.exit(0);
        }
      }
      
      // Start import
      console.log(chalk.cyan('\nStarting import process...'));
      const importSpinner = ora('Importing products...').start();
      
      const result = await productImportService.importProductsFromExcel(file, supplierName, mappings);
      
      if (result.success) {
        importSpinner.succeed(chalk.green('Import completed successfully!'));
        console.log(chalk.green(`\nImport Summary:`));
        console.log(`  Products Imported: ${chalk.green(result.importedCount)}`);
        console.log(`  Products Updated: ${chalk.cyan(result.updatedCount)}`);
        
        if (result.errorCount > 0) {
          console.log(`  Errors: ${chalk.red(result.errors.length)}`);
          console.log(chalk.yellow('\nErrors:'));
          result.errors.slice(0, 5).forEach((error, index) => {
            console.log(`  ${index + 1}. ${chalk.red(error.error)} - Product: ${error.product}`);
          });
          
          if (result.errors.length > 5) {
            console.log(chalk.yellow(`  ... and ${result.errors.length - 5} more errors`));
            
            // Ask if user wants to see all errors
            const answer = await inquirer.prompt([
              {
                type: 'confirm',
                name: 'showAllErrors',
                message: 'Do you want to see all errors?',
                default: false
              }
            ]);
            
            if (answer.showAllErrors) {
              console.log(chalk.yellow('\nAll Errors:'));
              result.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${chalk.red(error.error)} - Product: ${error.product}`);
              });
            }
          }
        }
      } else {
        importSpinner.fail(chalk.red('Import failed!'));
        console.error(chalk.red(`\nError: ${result.message}`));
      }
    } catch (error) {
      console.error(chalk.red('\nError:'), error);
      process.exit(1);
    }
  });

// Template command
program
  .command('template')
  .description('Generate a product import template Excel file')
  .option('-o, --output <path>', 'Output file path')
  .action((options) => {
    try {
      const outputPath = options.output || path.join(process.cwd(), 'product_import_template.xlsx');
      
      // Create a sample product data structure
      const sampleProducts = [
        {
          SKU: 'SAMPLE-001',
          Title: 'Sample Product 1',
          DefaultName: 'Sample Product One',
          Price: 99.99,
          OriginalPrice: 129.99,
          Image: 'https://example.com/image1.jpg',
          Images: JSON.stringify(['https://example.com/image1_1.jpg', 'https://example.com/image1_2.jpg']),
          Brand: 'Sample Brand',
          Type: 'Electronics',
          Model: 'SB-X100',
          Quantity: '1 piece',
          Stock: 25,
          Weight: 1.5,
          Dimensions: '10 x 5 x 2 inches',
          Color: 'Black',
          Material: 'Plastic',
          Features: 'Waterproof, Shockproof',
          Specifications: 'Power: 5V, Battery: 3000mAh',
          Installation: 'Yes',
          Warranty: '1 Year Manufacturer Warranty'
        },
        {
          SKU: 'SAMPLE-002',
          Title: 'Sample Product 2',
          DefaultName: 'Sample Product Two',
          Price: 49.99,
          OriginalPrice: 59.99,
          Image: 'https://example.com/image2.jpg',
          Images: JSON.stringify(['https://example.com/image2_1.jpg', 'https://example.com/image2_2.jpg']),
          Brand: 'Another Brand',
          Type: 'Accessories',
          Model: 'AB-Y200',
          Quantity: '1 piece',
          Stock: 50,
          Weight: 0.5,
          Dimensions: '5 x 3 x 1 inches',
          Color: 'White',
          Material: 'Metal',
          Features: 'Compact, Lightweight',
          Specifications: 'Capacity: 32GB, Speed: 100MB/s',
          Installation: 'No',
          Warranty: '6 Month Limited Warranty'
        }
      ];

      // Create a worksheet from the sample data
      const worksheet = xlsx.utils.json_to_sheet(sampleProducts);

      // Create a workbook
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');

      // Add column width information
      const wscols = [
        { wch: 15 }, // SKU
        { wch: 30 }, // Title
        { wch: