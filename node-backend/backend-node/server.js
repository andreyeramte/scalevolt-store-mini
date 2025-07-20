// FILE: node-backend/backend-node/server.js
const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const path       = require('path');
const bodyParser = require('body-parser');
const fs         = require('fs');
const { Pool }   = require('pg');
const morgan     = require('morgan');

// Load .env from current directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const cableRoutes = require('./routes/cables');
const authRoutes = require('./routes/authRoutes');

// Database connection
let pool = null;

try {
  pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  });
  
  // Test the connection
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('❌ Database connection failed:', err);
      console.log('⚠️  Running in mock mode - database not connected');
      pool = null;
    } else {
      console.log('✅ Database connected successfully');
      console.log('📅 Database time:', res.rows[0].now);
    }
  });
  
} catch (err) {
  console.error('❌ Database connection failed:', err);
  console.log('⚠️  Running in mock mode - database not connected');
  pool = null;
}

// Make pool available to routes
app.locals.pool = pool;

const productRoutes   = require('./routes/productRoutes');
const translateRoutes = require('./routes/translateRoutes');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// mount your APIs
app.use('/api/products', productRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/cables', cableRoutes);
app.use('/api/auth', authRoutes);

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
app.get('/health', (req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date(),
    database:  pool ? 'connected' : 'disconnected (mock mode)'
  });
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