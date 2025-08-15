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
  performanceMonitor,
  optimizeDatabasePool
} = require('./config/performance');

// Load .env from current directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const cableRoutes = require('./routes/cables');
const authRoutes = require('./routes/authRoutes');

// Import database configuration
const { initializeDatabase, getPool, isConnected } = require('./config/database');

// Initialize database connection
let pool = null;

// Initialize database
initializeDatabase()
  .then((success) => {
    if (success) {
      pool = getPool();
      // Optimize database pool
      optimizeDatabasePool(pool);
      console.log('✅ Database initialized successfully');
    } else {
      console.log('⚠️  Running in mock mode - database not connected');
    }
  })
  .catch((error) => {
    console.error('❌ Database initialization failed:', error);
    console.log('⚠️  Running in mock mode - database not connected');
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Make pool available to routes
app.locals.pool = pool;

const productRoutes   = require('./routes/productRoutes');
const translateRoutes = require('./routes/translateRoutes');
const chatbotRoutes   = require('./routes/chatbotRoutes');
const searchRoutes    = require('./routes/searchRoutes');

// Performance middleware
app.use(performanceMonitor);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5177', 'http://localhost:5178', 'http://localhost:5179', 'http://localhost:5180'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// mount your APIs with rate limiting
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/translate', apiLimiter, translateRoutes);
app.use('/api/cables', apiLimiter, cableRoutes);
app.use('/api/auth', apiLimiter, authRoutes);
app.use('/api/chatbot', apiLimiter, chatbotRoutes);
app.use('/api/search', apiLimiter, searchRoutes);

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
    // Test database connection
    if (pool) {
      const result = await pool.query('SELECT 1 as test');
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: 'connected',
        message: 'ScaleVolt API is running'
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

// Ensure users table exists
if (pool) {
  pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`).then(() => {
    console.log('✅ Users table ready');
  }).catch(err => {
    console.error('Error creating users table:', err);
  });
}

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
  console.log(`❤️ Health check:   http://localhost:${PORT}/health`);
}).on('error', err => {
  console.error('Failed to start:', err);
  process.exit(1);
});