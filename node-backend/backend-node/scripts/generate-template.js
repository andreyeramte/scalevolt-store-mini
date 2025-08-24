// scripts/generate-template.js
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

// Create a sample product data structure - Mini Launch Products Only
const sampleProducts = [
  {
    id: 'mini-solar-panel-001',
    name_en: 'Portable Solar Panel 100W',
    name_pl: 'Przenośny Panel Słoneczny 100W',
    description_en: 'High-efficiency portable solar panel perfect for camping, RVs, and emergency power needs.',
    description_pl: 'Wysokowydajny przenośny panel słoneczny idealny do kempingu, kamperów i awaryjnych potrzeb energetycznych.',
    price: 299.99,
    currency: 'EUR',
    category: 'portable-solar',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400&h=300&fit=crop'
    ]),
    specs: 'Power: 100W, Voltage: 12V, Efficiency: 22%',
    in_stock: true,
    featured: true
  },
  {
    id: 'mini-power-station-001',
    name_en: 'Portable Power Station 1000Wh',
    name_pl: 'Przenośna Stacja Energetyczna 1000Wh',
    description_en: 'Compact and powerful portable power station with 1000Wh capacity.',
    description_pl: 'Kompaktowa i wydajna przenośna stacja energetyczna o pojemności 1000Wh.',
    price: 899.99,
    currency: 'EUR',
    category: 'portable-power',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop'
    ]),
    specs: 'Capacity: 1000Wh, Output Power: 1000W, Ports: AC, DC, USB-C, USB-A',
    in_stock: true,
    featured: true
  },
  {
    id: 'mini-powerwall-001',
    name_en: 'Home Battery Pack 10kWh',
    name_pl: 'Domowy Pakiet Baterii 10kWh',
    description_en: 'Professional home energy storage solution with 10kWh capacity.',
    description_pl: 'Profesjonalne rozwiązanie do magazynowania energii domowej o pojemności 10kWh.',
    price: 4999.99,
    currency: 'EUR',
    category: 'home-battery',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop'
    ]),
    specs: 'Capacity: 10kWh, Voltage: 48V, Cycles: 6000+, Warranty: 10 years',
    in_stock: true,
    featured: true
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