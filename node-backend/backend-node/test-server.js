const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test API working', timestamp: new Date() });
});

// Start server
const PORT = 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`❤️ Health check: http://localhost:${PORT}/health`);
  console.log(`📦 Test API: http://localhost:${PORT}/api/test`);
}).on('error', err => {
  console.error('Failed to start test server:', err);
  process.exit(1);
}); 