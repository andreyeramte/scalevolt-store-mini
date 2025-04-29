const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import pool and other dependencies
const { pool } = require('../db/pool');
const productRoutes = require('./routes/productRoutes');
const translateRoutes = require('./routes/translateRoutes');

// Import routes for product import
// If routes don't exist yet, comment these out until you create them
// const productImportRoutes = require('./routes/productImport');
// const excelValidatorRoutes = require('./routes/excelValidator');

// Create the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create temp directory inside uploads
const tempDir = path.join(uploadsDir, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Static files - serve the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/translate', translateRoutes);

// Import routes - comment these out if routes don't exist yet
// app.use('/api/import', productImportRoutes);
// app.use('/api/import', excelValidatorRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('Server is running. Try /api/products to get the product list.');
});

// Admin interface for product imports
app.get('/admin/import', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/import.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date(),
    database: pool ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File is too large. Maximum size is 10MB.'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected field in form upload.'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Log the port the server is attempting to use
const PORT = process.env.PORT || 3002;
console.log(`Server is trying to start on port: ${PORT}`);

// Start the server and handle errors
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API available at: http://localhost:${PORT}/api/products`);
  console.log(`🔗 Admin import interface available at: http://localhost:${PORT}/admin/import`);
}).on('error', (err) => {
  console.error('Error starting the server:', err);
  process.exit(1); // Exit the process if there is an error
});

// Test database connection manually
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Database connected successfully');
  }
});