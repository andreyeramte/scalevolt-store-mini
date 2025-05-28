// FILE: node-backend/backend-node/server.js
const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const path       = require('path');
const bodyParser = require('body-parser');
const fs         = require('fs');

// Load .env from your project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const cableRoutes = require('./routes/cables');

// ←– now requiring from your new local db folder
const { pool } = require('../db/pool.cjs');
const productRoutes   = require('./routes/productRoutes');
const translateRoutes = require('./routes/translateRoutes');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mount your APIs
app.use('/api/products', productRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/cables', cableRoutes);

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
    database:  pool ? 'connected' : 'disconnected'
  });
});

// error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'File too large' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ success: false, message: 'Unexpected upload field' });
  }
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
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

// test DB connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) console.error('❌ DB connection error:', err);
  else     console.log('✅ Database connected:', result.rows[0]);
});
