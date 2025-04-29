// scripts/generate-template.js
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

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
  { wch: 30 }, // DefaultName
  { wch: 10 }, // Price
  { wch: 10 }, // OriginalPrice
  { wch: 40 }, // Image
  { wch: 50 }, // Images
  { wch: 15 }, // Brand
  { wch: 15 }, // Type
  { wch: 15 }, // Model
  { wch: 15 }, // Quantity
  { wch: 10 }, // Stock
  { wch: 10 }, // Weight
  { wch: 20 }, // Dimensions
  { wch: 15 }, // Color
  { wch: 15 }, // Material
  { wch: 30 }, // Features
  { wch: 40 }, // Specifications
  { wch: 10 }, // Installation
  { wch: 30 }  // Warranty
];

worksheet['!cols'] = wscols;

// Create a directory for templates if it doesn't exist
const templatesDir = path.join(__dirname, '../templates');
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// Write the workbook to a file
const filePath = path.join(templatesDir, 'product_import_template.xlsx');
xlsx.writeFile(workbook, filePath);

console.log(`Template file created at: ${filePath}`);

// Create a README file with instructions
const readmePath = path.join(templatesDir, 'README.md');
const readmeContent = `# Product Import Template

This template provides a standardized format for importing products into the system.

## Instructions

1. **Required Fields:**
   - SKU: Unique product identifier
   - Title: Main product name
   - Price: Current selling price

2. **Important Fields:**
   - DefaultName: Name used in systems and backend
   - OriginalPrice: Original or MSRP price (if applicable)
   - Image: URL to main product image
   - Brand: Product manufacturer/brand
   - Type: Product category/type
   - Model: Model number or identifier
   - Stock: Available inventory quantity

3. **Image Guidelines:**
   - Image: URL to the main product image
   - Images: Comma-separated list or JSON array of additional image URLs

4. **Tips:**
   - Keep SKUs consistent and unique
   - Include as much information as possible
   - Follow exact format of sample data
   - Don't modify column headers

For assistance, contact the IT department.
`;

fs.writeFileSync(readmePath, readmeContent);
console.log(`README file created at: ${readmePath}`);

// Create a documentation file with field descriptions
const docsPath = path.join(templatesDir, 'FIELD_DESCRIPTIONS.md');
const docsContent = `# Field Descriptions

## Core Fields

| Field | Description | Required | Example |
|-------|-------------|----------|---------|
| SKU | Unique product identifier | Yes | SAMPLE-001 |
| Title | Main product name | Yes | Gaming Laptop 15" |
| DefaultName | Internal name | No | Gaming Laptop Model X |
| Price | Current selling price | Yes | 999.99 |
| OriginalPrice | Original/MSRP price | No | 1299.99 |
| Image | Main product image URL | No | https://example.com/image.jpg |
| Images | Additional image URLs (JSON array) | No | ["url1", "url2"] |
| Brand | Product manufacturer/brand | No | Dell |
| Type | Product category/type | No | Laptops |
| Model | Model number/identifier | No | XPS-15-2025 |
| Quantity | Quantity description | No | 1 piece |
| Stock | Available inventory | No | 10 |

## Additional Fields

| Field | Description | Required | Example |
|-------|-------------|----------|---------|
| Weight | Product weight | No | 4.5 |
| Dimensions | Product dimensions | No | 15 x 10 x 1 inches |
| Color | Product color | No | Black |
| Material | Product material | No | Aluminum |
| Features | Key product features | No | Backlit Keyboard, 4K Display |
| Specifications | Technical specifications | No | CPU: i7, RAM: 16GB |
| Installation | Installation available | No | Yes |
| Warranty | Warranty information | No | 2 Year Limited |

## Notes

- You can add additional columns for product-specific attributes
- All additional columns will be stored as product properties
- Date values should be in YYYY-MM-DD format
- Boolean values should be 'Yes'/'No' or 'true'/'false'
`;

fs.writeFileSync(docsPath, docsContent);
console.log(`Field descriptions documentation created at: ${docsPath}`) ;