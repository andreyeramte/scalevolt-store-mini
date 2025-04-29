// utils/columnMapper.js
/**
 * Utility to help map Excel column names to database fields
 */
class ColumnMapper {
    constructor() {
      // Define common field mappings
      this.fieldMappings = {
        sku: ['SKU', 'sku', 'ProductCode', 'Product Code', 'ItemCode', 'Item Code', 'ProductID', 'Product ID'],
        name: ['Name', 'ProductName', 'Product Name', 'Title', 'ItemName', 'Item Name'],
        description: ['Description', 'Long Description', 'Details', 'Product Description', 'Full Description', 'Specs'],
        price: ['Price', 'Cost', 'Unit Price', 'Retail Price', 'MSRP', 'Price (USD)', 'SalePrice', 'Sale Price'],
        stock: ['Stock', 'Quantity', 'Inventory', 'QtyAvailable', 'Qty Available', 'Stock Level', 'QuantityInStock'],
        category: ['Category', 'ProductType', 'Product Type', 'Department', 'Group', 'ProductCategory'],
        brand: ['Brand', 'Manufacturer', 'Vendor', 'Producer', 'Make'],
        weight: ['Weight', 'ItemWeight', 'Product Weight', 'ShippingWeight', 'Shipping Weight'],
        dimensions: ['Dimensions', 'Size', 'ProductSize', 'Product Size', 'Measurements'],
        mpn: ['MPN', 'ManufacturerPartNumber', 'Manufacturer Part Number', 'PartNumber', 'Part Number'],
        upc: ['UPC', 'GTIN', 'EAN', 'Barcode'],
        status: ['Status', 'ProductStatus', 'Product Status', 'Availability', 'IsActive']
      };
    }
  
    /**
     * Analyze sample data to detect column mappings
     * @param {Array} sampleData - Sample rows from Excel
     * @returns {Object} - Detected mappings
     */
    detectMappings(sampleData) {
      if (!sampleData || sampleData.length === 0) {
        return {};
      }
  
      // Get all column headers from the first row
      const columns = Object.keys(sampleData[0]);
      const mappings = {};
  
      // For each database field
      Object.keys(this.fieldMappings).forEach(dbField => {
        // Check if any of the possible Excel column names exist
        const possibleNames = this.fieldMappings[dbField];
        
        // Find the first matching column name
        const match = columns.find(column => 
          possibleNames.some(name => 
            name.toLowerCase() === column.toLowerCase()
          )
        );
        
        if (match) {
          mappings[dbField] = match;
        }
      });
  
      return mappings;
    }
  
    /**
     * Map a single product using the provided mappings
     * @param {Object} row - Excel row data
     * @param {Object} mappings - Column mappings
     * @param {String} supplierName - Name of the supplier
     * @returns {Object} - Mapped product
     */
    mapProduct(row, mappings, supplierName) {
      const product = {
        supplier: supplierName,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        properties: {}
      };
  
      // Apply mappings
      Object.keys(mappings).forEach(dbField => {
        const excelColumn = mappings[dbField];
        product[dbField] = row[excelColumn];
  
        // Special case handling
        if (dbField === 'price' && product[dbField]) {
          product[dbField] = parseFloat(product[dbField]);
        }
        if (dbField === 'stock' && product[dbField]) {
          product[dbField] = parseInt(product[dbField], 10);
        }
      });
  
      // Generate SKU if not provided
      if (!product.sku) {
        const partNumber = product.mpn || Math.random().toString(36).substring(2, 10);
        product.sku = `${supplierName}-${partNumber}`.replace(/\s+/g, '-');
      }
  
      // Add remaining fields as properties
      Object.keys(row).forEach(column => {
        // Skip columns that are already mapped
        if (!Object.values(mappings).includes(column)) {
          product.properties[column] = row[column];
        }
      });
  
      return product;
    }
  
    /**
     * Map all products using the provided mappings
     * @param {Array} products - Excel rows data
     * @param {Object} mappings - Column mappings
     * @param {String} supplierName - Name of the supplier
     * @returns {Array} - Mapped products
     */
    mapProducts(products, mappings, supplierName) {
      return products.map(row => this.mapProduct(row, mappings, supplierName));
    }
  }
  
  module.exports = new ColumnMapper();