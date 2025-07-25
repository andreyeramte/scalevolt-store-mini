// routes/excelValidator.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');

// Set up multer for file uploads (temporary files for validation)
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/temp');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'validation-' + uniqueSuffix + path.extname(file.originalname));
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
 * @route POST /api/import/validate
 * @desc Validate Excel file and suggest column mappings
 * @access Private
 */
router.post('/validate', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
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
      return res.status(400).json({ success: false, error: 'No data found in the Excel file' });
    }
    
    // Get first few rows as sample data
    const sampleData = products.slice(0, 5);
    
    // Get all columns
    const columns = Object.keys(products[0]);
    
    // Suggest field mappings
    const suggestedMappings = {};
    
    // Default field mappings
    const defaultMappings = {
      sku: ['SKU', 'sku', 'ProductCode', 'Product Code', 'ItemCode', 'Item Code', 'ID', 'id'],
      title: ['Title', 'Name', 'ProductName', 'Product Name'],
      default_name: ['DefaultName', 'Default Name', 'Name', 'ProductName', 'Product Name'],
      price: ['Price', 'Cost', 'UnitPrice', 'Unit Price'],
      original_price: ['OriginalPrice', 'Original Price', 'MSRP', 'ListPrice', 'List Price'],
      image: ['Image', 'ImageURL', 'Image URL', 'PrimaryImage', 'Primary Image'],
      brand: ['Brand', 'Manufacturer', 'Make'],
      type: ['Type', 'Category', 'ProductType', 'Product Type'],
      model: ['Model', 'ModelNumber', 'Model Number', 'PartNumber', 'Part Number'],
      stock: ['Stock', 'Inventory', 'QuantityInStock', 'Quantity In Stock']
    };
    
    Object.entries(defaultMappings).forEach(([dbField, possibleColumns]) => {
      const matchingColumn = columns.find(column => 
        possibleColumns.some(possibleColumn => 
          possibleColumn.toLowerCase() === column.toLowerCase()
        )
      );
      
      if (matchingColumn) {
        suggestedMappings[dbField] = matchingColumn;
      }
    });
    
    // Clean up file
    fs.unlinkSync(req.file.path);
    
    return res.status(200).json({
      success: true,
      columns,
      sampleData,
      suggestedMappings,
      rowCount: products.length
    });
  } catch (error) {
    console.error('Error validating Excel file:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Validation failed',
      details: error.message 
    });
  }
});

module.exports = router;