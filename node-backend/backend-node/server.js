// FILE: node-backend/backend-node/server.js
const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const path       = require('path');
const bodyParser = require('body-parser');
const fs         = require('fs');
const morgan     = require('morgan');

// Performance optimizations
const {
  apiLimiter,
  searchLimiter,
  corsOptions,
  compressionOptions,
  performanceMonitor
} = require('./config/performance');

// Load .env from current directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const cableRoutes = require('./routes/cables');
const authRoutes = require('./routes/authRoutes');

// Import Supabase configuration
const { supabase, db, utils } = require('./config/supabase');

// Initialize Supabase connection
let supabaseConnected = false;

// Initialize Supabase
async function initializeSupabase() {
  try {
    console.log('🔧 Initializing Supabase connection...');
    
    // Test the connection
    const connectionTest = await utils.testConnection();
    if (connectionTest.connected) {
      supabaseConnected = true;
      console.log('✅ Supabase connected successfully');
    } else {
      console.log('⚠️  Supabase connection test failed, but continuing...');
      // Try to access products table directly
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);
      
      if (!error) {
        supabaseConnected = true;
        console.log('✅ Supabase products table accessible');
      } else {
        console.log('❌ Supabase products table not accessible:', error.message);
      }
    }
  } catch (error) {
    console.error('❌ Supabase initialization failed:', error);
  }
}

initializeSupabase();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Make Supabase available to routes
app.locals.supabase = supabase;
app.locals.db = db;
app.locals.supabaseConnected = supabaseConnected;

const productRoutes   = require('./routes/productRoutes');
const translateRoutes = require('./routes/translateRoutes');
const chatbotRoutes   = require('./routes/chatbotRoutes');
const searchRoutes    = require('./routes/searchRoutes');
const installationRoutes = require('./routes/installationRoutes');
const regionRoutes = require('./routes/regionRoutes');

// Performance middleware
app.use(performanceMonitor);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5177', 'http://localhost:5178', 'http://localhost:5179', 'http://localhost:5180'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Add cookie parser for region detection
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// mount your APIs with rate limiting
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/translate', apiLimiter, translateRoutes);
app.use('/api/cables', apiLimiter, cableRoutes);
app.use('/api/auth', apiLimiter, authRoutes);
app.use('/api/chatbot', apiLimiter, chatbotRoutes);
app.use('/api/search', apiLimiter, searchRoutes);
app.use('/api/installation-orders', apiLimiter, installationRoutes);
app.use('/api', apiLimiter, regionRoutes);

// Add a simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working', timestamp: new Date() });
});

// ensure upload dirs exist
const uploadsDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const tempDir = path.join(uploadsDir, 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// serve any static files out of public/
app.use(express.static(path.join(__dirname, 'public')));

// a simple root route
app.get('/', (req, res) => {
  res.send('Server is running. Try GET /api/products');
});

// health check
app.get('/health', async (req, res) => {
  try {
    // Test Supabase connection
    if (supabaseConnected) {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: 'connected (Supabase)',
        message: 'ScaleVolt API is running with Supabase'
      });
    } else {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: 'disconnected (mock mode)',
        message: 'ScaleVolt API is running in mock mode'
      });
    }
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// Note: Users table is managed by Supabase, no need to create manually
console.log('✅ Supabase handles user authentication and tables');

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: err.details || undefined
  });
});

// start it up
const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Products API:   http://localhost:${PORT}/api/products`);
  console.log(`🔤 Translate API:  http://localhost:${PORT}/api/translate`);
  console.log(`🔧 Installation API: http://localhost:${PORT}/api/installation-orders`);
  console.log(`❤️ Health check:   http://localhost:${PORT}/health`);
}).on('error', err => {
  console.error('Failed to start:', err);
  process.exit(1);
});