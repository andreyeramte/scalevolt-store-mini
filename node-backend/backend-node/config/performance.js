// FILE: config/performance.js
// Backend performance optimizations

const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');

// Cache configuration
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes default
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false, // Better performance
  maxKeys: 1000 // Limit cache size
});

// Rate limiting configuration
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max, // Limit each IP to max requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// API rate limiter (more strict)
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes

// Search rate limiter (less strict for search)
const searchLimiter = createRateLimiter(15 * 60 * 1000, 200); // 200 requests per 15 minutes



// CORS configuration for better performance
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5177',
      'http://localhost:5178', 
      'http://localhost:5179',
      'http://localhost:5180',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:4242'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
};

// Compression options
const compressionOptions = {
  level: 6, // Good balance between compression and speed
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
};

// Cache middleware
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      res.send(cachedResponse);
      return;
    }
    
    res.sendResponse = res.send;
    res.send = (body) => {
      cache.set(key, body, duration);
      res.sendResponse(body);
    };
    next();
  };
};

// Database query optimization
const optimizeQuery = (query, params = []) => {
  // Add query timeout
  const timeout = 10000; // 10 seconds
  
  return {
    text: query,
    values: params,
    timeout: timeout
  };
};

// Response optimization
const optimizeResponse = (data, options = {}) => {
  const {
    compress = true,
    cache = true,
    cacheDuration = 300
  } = options;
  
  return {
    data,
    timestamp: new Date().toISOString(),
    compressed: compress,
    cached: cache,
    cacheDuration
  };
};

// Memory usage monitoring
const monitorMemoryUsage = () => {
  const used = process.memoryUsage();
  console.log('Memory usage:');
  console.log(`  RSS: ${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`);
  console.log(`  Heap Total: ${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`);
  console.log(`  Heap Used: ${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`);
  console.log(`  External: ${Math.round(used.external / 1024 / 1024 * 100) / 100} MB`);
};

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;
    
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration.toFixed(2)}ms`);
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`⚠️  Slow request: ${req.method} ${req.originalUrl} took ${duration.toFixed(2)}ms`);
    }
  });
  
  next();
};

// Database connection pooling optimization
const optimizeDatabasePool = (pool) => {
  if (!pool) return null;
  
  // Set optimal pool settings
  pool.on('connect', (client) => {
    client.query('SET statement_timeout = 10000'); // 10 second timeout
    client.query('SET idle_in_transaction_session_timeout = 30000'); // 30 second idle timeout
  });
  
  return pool;
};

// Cache cleanup
const cleanupCache = () => {
  const stats = cache.getStats();
  console.log('Cache stats:', stats);
  
  // Clear expired keys
  cache.flushAll();
  console.log('Cache cleaned');
};

// Setup periodic cleanup
setInterval(cleanupCache, 30 * 60 * 1000); // Every 30 minutes

// Setup memory monitoring
setInterval(monitorMemoryUsage, 5 * 60 * 1000); // Every 5 minutes

module.exports = {
  cache,
  apiLimiter,
  searchLimiter,
  corsOptions,
  compressionOptions,
  cacheMiddleware,
  optimizeQuery,
  optimizeResponse,
  performanceMonitor,
  optimizeDatabasePool,
  cleanupCache,
  monitorMemoryUsage
}; 