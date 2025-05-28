const fs = require('fs');
const pdfjsLib = require('pdfjs-dist');
const mysql = require('mysql2/promise');
const path = require('path');
const csv = require('csv-writer').createObjectCsvWriter;

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'tele_fonika_products',
  waitForConnections: true,
  connectionLimit: 10
};

// Path to your PDF catalog
const PDF_PATH = process.argv[2] || './Medium Voltage XLPE Power Cables - 2XS(F)2Y, XUHKXS.pdf';
const OUTPUT_CSV = path.join(__dirname, 'parsed_cables.csv');

/**
 * Main function to process the PDF and extract cable data
 */
async function processCableCatalog() {
  console.log(`Processing PDF catalog: ${PDF_PATH}`);
  
  try {
    // Load the PDF document
    const data = new Uint8Array(fs.readFileSync(PDF_PATH));
    const pdfDocument = await pdfjsLib.getDocument({ data }).promise;
    const numPages = pdfDocument.numPages;
    
    console.log(`PDF loaded successfully. Total pages: ${numPages}`);
    
    // Extract text content from all pages
    let textContent = '';
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      textContent += pageText + '\n';
    }
    
    // Parse the extracted text to find cable data
    const cables = parseCableData(textContent);
    console.log(`Extracted ${cables.length} cable specifications`);
    
    // Export to CSV first (as a backup and for verification)
    await exportToCsv(cables);
    console.log(`Data exported to CSV: ${OUTPUT_CSV}`);
    
    // Import to database
    await importToDatabase(cables);
    console.log('Data successfully imported to database');
    
  } catch (error) {
    console.error('Error processing PDF catalog:', error);
  }
}

/**
 * Parse the extracted text to identify cable specifications
 */
function parseCableData(textContent) {
  // This is a simplified parsing logic - would need to be customized based on the actual PDF structure
  const cables = [];
  
  // Regular expression to identify cable specifications (adjust based on actual format)
  // Example pattern for "1x35RMC 7.0 +0.15 4.5 17.2 16 21.3 26.9 860 1.75 0.40"
  const cablePattern = /1x(\d+)RMC\s+([0-9.+]+)\s+([0-9.]+)\s+([0-9.]+)\s+(\d+)\s+([0-9.]+)\s+([0-9.]+)\s+(\d+)\s+([0-9.]+)\s+([0-9.]+)/g;
  
  // Regular expression for electrical data rows
  const electricalPattern = /1x(\d+)RMC\/(\d+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9./]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)/g;
  
  let match;
  
  // Extract physical specifications
  while ((match = cablePattern.exec(textContent)) !== null) {
    const crossSection = match[1];
    const conductorDiameter = match[2].split('+')[0]; // Remove the tolerance
    const insulationThickness = match[3];
    const diameterOverInsulation = match[4];
    const screenCrossSection = match[5];
    const diameterOverScreen = match[6];
    const cableDiameter = match[7];
    const weight = match[8];
    const maxPullingForce = match[9];
    const minBendingRadius = match[10];
    
    cables.push({
      sku: `2XS(F)2Y-1x${crossSection}RMC`,
      model_number: `1x${crossSection}RMC`,
      name: `Medium Voltage XLPE Power Cable - 2XS(F)2Y ${crossSection}mm²`,
      description: `Copper conductor, XLPE insulated medium voltage power cable with ${crossSection}mm² cross-section`,
      category_id: 1, // Assuming 1 is Medium Voltage Power Cables
      conductor_type: 'RMC',
      conductor_material: 'Copper',
      conductor_cross_sectional_area: parseFloat(crossSection),
      insulation_type: 'XLPE',
      insulation_thickness: parseFloat(insulationThickness),
      voltage_rating: '8.7/15(17.5)kV',
      diameter: parseFloat(cableDiameter),
      weight_per_km: parseFloat(weight),
      min_bending_radius: parseFloat(minBendingRadius),
      max_pulling_force: parseFloat(maxPullingForce),
      metallic_screen_area: parseFloat(screenCrossSection),
      diameter_over_insulation: parseFloat(diameterOverInsulation),
      diameter_over_screen: parseFloat(diameterOverScreen),
      standards: 'IEC 60502-2:2005, BS 6622:2007, HD 620 S3:2023 Part 10 Section R',
      is_available_pl: true,
      price_pl: null, // Pricing would need to be added separately
      stock_status_pl: 'in_stock',
      lead_time_days_pl: 14,
      is_available_ua: false, // Default to not available in Ukraine
      price_ua: null,
      stock_status_ua: 'out_of_stock',
      lead_time_days_ua: null
    });
  }
  
  // Extract electrical data and match with physical specs
  // This would require more complex parsing logic to correctly associate the data
  
  return cables;
}

/**
 * Export parsed data to CSV
 */
async function exportToCsv(cables) {
  const csvWriter = csv({
    path: OUTPUT_CSV,
    header: [
      { id: 'sku', title: 'SKU' },
      { id: 'model_number', title: 'Model Number' },
      { id: 'name', title: 'Name' },
      { id: 'description', title: 'Description' },
      { id: 'category_id', title: 'Category ID' },
      { id: 'conductor_type', title: 'Conductor Type' },
      { id: 'conductor_material', title: 'Conductor Material' },
      { id: 'conductor_cross_sectional_area', title: 'Cross Sectional Area (mm²)' },
      { id: 'insulation_type', title: 'Insulation Type' },
      { id: 'insulation_thickness', title: 'Insulation Thickness (mm)' },
      { id: 'voltage_rating', title: 'Voltage Rating' },
      { id: 'diameter', title: 'Diameter (mm)' },
      { id: 'weight_per_km', title: 'Weight (kg/km)' },
      { id: 'min_bending_radius', title: 'Min Bending Radius (m)' },
      { id: 'max_pulling_force', title: 'Max Pulling Force (kN)' },
      { id: 'standards', title: 'Standards' },
      { id: 'is_available_pl', title: 'Available in Poland' },
      { id: 'price_pl', title: 'Price Poland' },
      { id: 'stock_status_pl', title: 'Stock Status Poland' },
      { id: 'lead_time_days_pl', title: 'Lead Time Days Poland' },
      { id: 'is_available_ua', title: 'Available in Ukraine' },
      { id: 'price_ua', title: 'Price Ukraine' },
      { id: 'stock_status_ua', title: 'Stock Status Ukraine' },
      { id: 'lead_time_days_ua', title: 'Lead Time Days Ukraine' }
    ]
  });
  
  return csvWriter.writeRecords(cables);
}

/**
 * Import the parsed data to the database
 */
async function importToDatabase(cables) {
  // Create a connection pool
  const pool = mysql.createPool(dbConfig);
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Get market IDs
    const [markets] = await connection.query('SELECT market_id, country_code FROM markets');
    const marketMap = markets.reduce((acc, market) => {
      acc[market.country_code] = market.market_id;
      return acc;
    }, {});
    
    const plMarketId = marketMap['PL'];
    const uaMarketId = marketMap['UA'];
    
    if (!plMarketId || !uaMarketId) {
      throw new Error('Market IDs for Poland or Ukraine not found');
    }
    
    for (const cable of cables) {
      // Insert or update product
      let productId;
      const [existingProducts] = await connection.query(
        'SELECT product_id FROM products WHERE sku = ?',
        [cable.sku]
      );
      
      if (existingProducts.length > 0) {
        // Update existing product
        productId = existingProducts[0].product_id;
        
        await connection.query(
          `UPDATE products SET 
            model_number = ?, 
            name = ?, 
            description = ?, 
            category_id = ?
          WHERE product_id = ?`,
          [cable.model_number, cable.name, cable.description, cable.category_id, productId]
        );
      } else {
        // Insert new product
        const [result] = await connection.query(
          `INSERT INTO products 
            (sku, model_number, name, description, category_id) 
          VALUES (?, ?, ?, ?, ?)`,
          [cable.sku, cable.model_number, cable.name, cable.description, cable.category_id]
        );
        
        productId = result.insertId;
      }
      
      // Insert or update cable specifications
      const [existingSpecs] = await connection.query(
        'SELECT product_id FROM cable_specifications WHERE product_id = ?',
        [productId]
      );
      
      if (existingSpecs.length > 0) {
        // Update existing specs
        await connection.query(
          `UPDATE cable_specifications SET 
            conductor_type = ?, 
            conductor_material = ?, 
            conductor_cross_sectional_area = ?, 
            insulation_type = ?, 
            insulation_thickness = ?,
            voltage_rating = ?,
            diameter = ?,
            weight_per_km = ?,
            min_bending_radius = ?,
            max_pulling_force = ?,
            standards = ?
          WHERE product_id = ?`,
          [
            cable.conductor_type, 
            cable.conductor_material, 
            cable.conductor_cross_sectional_area, 
            cable.insulation_type, 
            cable.insulation_thickness,
            cable.voltage_rating,
            cable.diameter,
            cable.weight_per_km,
            cable.min_bending_radius,
            cable.max_pulling_force,
            cable.standards,
            productId
          ]
        );
      } else {
        // Insert new specs
        await connection.query(
          `INSERT INTO cable_specifications 
            (product_id, conductor_type, conductor_material, conductor_cross_sectional_area, 
             insulation_type, insulation_thickness, voltage_rating, diameter, weight_per_km,
             min_bending_radius, max_pulling_force, standards) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            productId, 
            cable.conductor_type, 
            cable.conductor_material, 
            cable.conductor_cross_sectional_area, 
            cable.insulation_type, 
            cable.insulation_thickness,
            cable.voltage_rating,
            cable.diameter,
            cable.weight_per_km,
            cable.min_bending_radius,
            cable.max_pulling_force,
            cable.standards
          ]
        );
      }
      
      // Insert or update Poland market data
      const [existingPlData] = await connection.query(
        'SELECT * FROM product_market_data WHERE product_id = ? AND market_id = ?',
        [productId, plMarketId]
      );
      
      if (existingPlData.length > 0) {
        // Update existing data
        await connection.query(
          `UPDATE product_market_data SET 
            is_available = ?, 
            price = ?, 
            stock_status = ?, 
            lead_time_days = ?
          WHERE product_id = ? AND market_id = ?`,
          [
            cable.is_available_pl ? 1 : 0, 
            cable.price_pl, 
            cable.stock_status_pl, 
            cable.lead_time_days_pl, 
            productId, 
            plMarketId
          ]
        );
      } else {
        // Insert new data
        await connection.query(
          `INSERT INTO product_market_data 
            (product_id, market_id, is_available, price, stock_status, lead_time_days) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            productId, 
            plMarketId, 
            cable.is_available_pl ? 1 : 0, 
            cable.price_pl, 
            cable.stock_status_pl, 
            cable.lead_time_days_pl
          ]
        );
      }
      
      // Insert or update Ukraine market data
      const [existingUaData] = await connection.query(
        'SELECT * FROM product_market_data WHERE product_id = ? AND market_id = ?',
        [productId, uaMarketId]
      );
      
      if (existingUaData.length > 0) {
        // Update existing data
        await connection.query(
          `UPDATE product_market_data SET 
            is_available = ?, 
            price = ?, 
            stock_status = ?, 
            lead_time_days = ?
          WHERE product_id = ? AND market_id = ?`,
          [
            cable.is_available_ua ? 1 : 0, 
            cable.price_ua, 
            cable.stock_status_ua, 
            cable.lead_time_days_ua, 
            productId, 
            uaMarketId
          ]
        );
      } else {
        // Insert new data
        await connection.query(
          `INSERT INTO product_market_data 
            (product_id, market_id, is_available, price, stock_status, lead_time_days) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            productId, 
            uaMarketId, 
            cable.is_available_ua ? 1 : 0, 
            cable.price_ua, 
            cable.stock_status_ua, 
            cable.lead_time_days_ua
          ]
        );
      }
    }
    
    await connection.commit();
    console.log(`Successfully imported ${cables.length} cables`);
  } catch (error) {
    await connection.rollback();
    console.error('Error importing to database:', error);
    throw error;
  } finally {
    connection.release();
    pool.end();
  }
}

/**
 * Create a simple UI for managing the import process
 */
function createImportUI() {
  // This function would create a simple UI in the terminal
  // or could be replaced with a web-based interface
  console.log('\n===== TELE-FONIKA Cable Catalog Importer =====\n');
  console.log('This tool helps import cable catalog data from PDF into a structured database');
  console.log('Usage: node pdf-catalog-importer.js [path-to-pdf]\n');
  
  // Check if PDF path was provided
  if (process.argv.length < 3) {
    console.log(`No PDF path provided. Using default: ${PDF_PATH}`);
  } else {
    console.log(`Using provided PDF: ${PDF_PATH}`);
  }
  
  console.log('\nStarting import process...\n');
  processCableCatalog();
}

// Start the application
createImportUI();

module.exports = {
  processCableCatalog,
  parseCableData,
  exportToCsv,
  importToDatabase
};