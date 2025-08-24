const express = require('express');
const { body, param, validationResult } = require('express-validator');
// Remove local pool import - will use the one from server
const { buildSearchableText } = require('../utils/helpers.cjs');
const { translateText, translateProduct, getTranslatedContent } = require('../utils/translationService.cjs');
const authenticateJWT = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Mock data for when database is not available - Mini Launch Products Only
let mockProducts = [
  {
    id: 'mini-solar-panel-001',
    name_en: 'Portable Solar Panel 100W',
    name_pl: 'Przenośny Panel Słoneczny 100W',
    description_en: 'High-efficiency portable solar panel perfect for camping, RVs, and emergency power needs. Lightweight and foldable design with built-in kickstand.',
    description_pl: 'Wysokowydajny przenośny panel słoneczny idealny do kempingu, kamperów i awaryjnych potrzeb energetycznych. Lekka i składana konstrukcja ze wbudowaną podpórką.',
    price: 299.99,
    currency: 'EUR',
    category: 'portable-solar',
    images: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400&h=300&fit=crop'
    ],
    specs: {
      power: '100W',
      voltage: '12V',
      efficiency: '22%',
      weight: '2.5kg',
      dimensions: '1200 x 540 x 25mm'
    },
    in_stock: true,
    featured: true,
    available_regions: ['PL', 'EN'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'mini-power-station-001',
    name_en: 'Portable Power Station 1000Wh',
    name_pl: 'Przenośna Stacja Energetyczna 1000Wh',
    description_en: 'Compact and powerful portable power station with 1000Wh capacity. Features multiple output ports, fast charging, and LCD display for easy monitoring.',
    description_pl: 'Kompaktowa i wydajna przenośna stacja energetyczna o pojemności 1000Wh. Posiada wiele portów wyjściowych, szybkie ładowanie i wyświetlacz LCD do łatwego monitorowania.',
    price: 899.99,
    currency: 'EUR',
    category: 'portable-power',
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop'
    ],
    specs: {
      capacity: '1000Wh',
      output_power: '1000W',
      ports: 'AC, DC, USB-C, USB-A',
      weight: '8.5kg',
      dimensions: '300 x 200 x 150mm'
    },
    in_stock: true,
    featured: true,
    available_regions: ['PL', 'EN'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'mini-powerwall-001',
    name_en: 'Home Battery Pack 10kWh',
    name_pl: 'Domowy Pakiet Baterii 10kWh',
    description_en: 'Professional home energy storage solution with 10kWh capacity. Seamlessly integrates with solar panels and provides backup power during outages.',
    description_pl: 'Profesjonalne rozwiązanie do magazynowania energii domowej o pojemności 10kWh. Bezproblemowo integruje się z panelami słonecznymi i zapewnia zasilanie awaryjne podczas przerw.',
    price: 4999.99,
    currency: 'EUR',
    category: 'home-battery',
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/products/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop'
    ],
    specs: {
      capacity: '10kWh',
      voltage: '48V',
      cycles: '6000+',
      warranty: '10 years',
      installation: 'Wall-mounted'
    },
    in_stock: true,
    featured: true,
    available_regions: ['PL', 'EN'],
    created_at: new Date(),
    updated_at: new Date()
  }
];

const router = express.Router();

// Multer setup for product images
const productImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `product-${req.params.id}-${Date.now()}${ext}`);
  }
});
const imageUpload = multer({
  storage: productImageStorage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Create a product
router.post('/', authenticateJWT, [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: 'Validation error', details: errors.array() });
  }
  const {
    name, price, description,
    name_ua, name_pl,
    description_ua, description_pl,
    auto_translate = true
  } = req.body;

  try {
    // Get pool from the server context
    const pool = req.app.locals.pool;
    
    if (!pool) {
      // Mock mode - return success without actually creating
      const newProduct = {
        id: Date.now(),
        name, price, description,
        name_ua, name_pl,
        description_ua, description_pl,
        created_at: new Date(),
        updated_at: new Date()
      };
      mockProducts.push(newProduct);
      return res.json(newProduct);
    }

    let productData = {
      name, price, description,
      name_ua, name_pl,
      description_ua, description_pl
    };

    if (auto_translate) {
      try {
        productData = await translateProduct(productData);
      } catch (err) {
        console.error('Auto-translation failed:', err);
      }
    }

    const searchable_text = buildSearchableText(productData);

    const result = await pool.query(
      `INSERT INTO products 
         (name, price, description, name_ua, name_pl, description_ua, description_pl, searchable_text) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        productData.name,
        price,
        productData.description,
        productData.name_ua,
        productData.name_pl,
        productData.description_ua,
        productData.description_pl,
        searchable_text
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error creating product', details: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/products called');
    
    // Get region from request (set by middleware)
    const region = req.region || req.query.region || 'PL';
    console.log(`🌍 Filtering products for region: ${region}`);
    
    // Get Supabase from the server context
    const supabase = req.app.locals.supabase;
    const supabaseConnected = req.app.locals.supabaseConnected;
    
    if (!supabase || !supabaseConnected) {
      console.log('⚠️ Supabase not connected, returning mock products');
      // Return mock products as fallback with region filtering
      let products = mockProducts;
      
      // Filter by region if available_regions is set
      if (region && region !== 'ALL') {
        products = products.filter(p => 
          !p.available_regions || 
          p.available_regions.length === 0 || 
          p.available_regions.includes(region)
        );
      }
      
      const filteredProducts = products.map(p => ({
        ...p,
        created_at: p.created_at instanceof Date ? p.created_at.toISOString() : p.created_at,
        updated_at: p.updated_at instanceof Date ? p.updated_at.toISOString() : p.updated_at
      }));
      
      console.log(`Returning ${filteredProducts.length} mock products for region ${region}`);
      return res.json(filteredProducts);
    }

    // Build Supabase query with region filtering
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    // Apply region filtering
    if (region && region !== 'ALL') {
      // Filter by available_regions: either NULL/empty (available everywhere) or contains current region
      query = query.or(`available_regions.is.null,available_regions.eq.{},available_regions.cs.{${region}}`);
    }
    
    // Execute query
    const { data, error } = await query.order('name', { ascending: true });
    
    if (error) {
      console.error('❌ Supabase query error:', error);
      throw error;
    }
    
    console.log(`✅ Supabase query successful, returning ${data.length} products for region ${region}`);
    res.json(data);
  } catch (err) {
    console.error('❌ Error in /api/products:', err);
    console.error('Error stack:', err.stack);
    
    // Fallback to mock products on error
    console.log('🔄 Falling back to mock products');
    const region = req.region || req.query.region || 'PL';
    
    let products = mockProducts;
    if (region && region !== 'ALL') {
      products = products.filter(p => 
        !p.available_regions || 
        p.available_regions.length === 0 || 
        p.available_regions.includes(region)
      );
    }
    
    const filteredProducts = products.map(p => ({
      ...p,
      created_at: p.created_at instanceof Date ? p.created_at.toISOString() : p.created_at,
      updated_at: p.updated_at instanceof Date ? p.updated_at.toISOString() : p.updated_at
    }));
    
    res.json(filteredProducts);
  }
});

// Search products
router.get('/search', async (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  const lang = req.query.lang || 'en';
  const region = req.region || req.query.region || 'PL';

  try {
    // Get pool from the server context
    const pool = req.app.locals.pool;
    
    if (!pool) {
      // Mock mode - filter mock products
      let products = [...mockProducts];
      
      // Apply region filtering first
      if (region && region !== 'ALL') {
        products = products.filter(p => 
          !p.available_regions || 
          p.available_regions.length === 0 || 
          p.available_regions.includes(region)
        );
      }
      
      if (query) {
        products = products.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
        );
      }
      
      // Apply language filtering
      if (lang === 'ua') {
        products = products.map(p => ({
          ...p,
          name: p.name_ua || p.name,
          description: p.description_ua || p.description
        }));
      } else if (lang === 'pl') {
        products = products.map(p => ({
          ...p,
          name: p.name_pl || p.name,
          description: p.description_pl || p.description
        }));
      }
      
      return res.json(products.slice(0, 20));
    }

    // Get Supabase from the server context
    const supabase = req.app.locals.supabase;
    const supabaseConnected = req.app.locals.supabaseConnected;
    
    if (supabase && supabaseConnected) {
      // Supabase mode with region filtering
      let supabaseQuery = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);
      
      // Apply region filtering
      if (region && region !== 'ALL') {
        // Filter by available_regions: either NULL/empty (available everywhere) or contains current region
        supabaseQuery = supabaseQuery.or(`available_regions.is.null,available_regions.eq.{},available_regions.cs.{${region}}`);
      }
      
      // Apply search filtering
      if (query) {
        // For now, we'll filter client-side since Supabase full-text search setup may vary
        // In production, you'd want to use proper full-text search with region filtering
        const { data, error } = await supabaseQuery;
        if (error) throw error;
        
        let filteredProducts = data.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.brand && p.brand.toLowerCase().includes(query))
        );
        
        // Apply language filtering
        filteredProducts = filteredProducts.map(prod => {
          if (lang === 'ua') {
            prod.name = prod.name_ua || prod.name;
            prod.description = prod.description_ua || prod.description;
          } else if (lang === 'pl') {
            prod.name = prod.name_pl || prod.name;
            prod.description = prod.description_pl || prod.description;
          }
          return prod;
        });
        
        return res.json(filteredProducts.slice(0, 20));
      } else {
        // No search query, just get products for region
        const { data, error } = await supabaseQuery.order('name', { ascending: true }).limit(20);
        if (error) throw error;
        
        // Apply language filtering
        let rows = data.map(prod => {
          if (lang === 'ua') {
            prod.name = prod.name_ua || prod.name;
            prod.description = prod.description_ua || prod.description;
          } else if (lang === 'pl') {
            prod.name = prod.name_pl || prod.name;
            prod.description = prod.description_pl || prod.description;
          }
          return prod;
        });
        
        return res.json(rows);
      }
    }
    
    // Fallback to pool query (legacy)
    let result;
    if (!query) {
      result = await pool.query('SELECT * FROM products ORDER BY name ASC LIMIT 20');
    } else {
      result = await pool.query(
        `SELECT * FROM products
         WHERE searchable_text ILIKE $1
         ORDER BY name ASC
         LIMIT 20`,
        [`%${query}%`]
      );
    }

    let rows = result.rows.map(prod => {
      // translate name/description fields based on lang
      if (lang === 'ua') {
        prod.name = prod.name_ua || prod.name;
        prod.description = prod.description_ua || prod.description;
      } else if (lang === 'pl') {
        prod.name = prod.name_pl || prod.name;
        prod.description = prod.description_pl || prod.description;
      }
      return prod;
    });

    res.json(rows);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Error searching products', message: err.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || 'en';

  try {
    // Get pool from the server context
    const pool = req.app.locals.pool;
    
    if (!pool) {
      // Mock mode - find product by ID
      const product = mockProducts.find(p => p.id == id);
      if (!product) {
        return res.status(404).send('Product not found');
      }
      
      let result = { ...product };
      if (lang === 'ua') {
        result.name = result.name_ua || result.name;
        result.description = result.description_ua || result.description;
      } else if (lang === 'pl') {
        result.name = result.name_pl || result.name;
        result.description = result.description_pl || result.description;
      }
      
      return res.json(result);
    }

    let result;
    if (lang === 'ua') {
      result = await pool.query(
        `SELECT id,
                COALESCE(name_ua, name) AS name,
                price,
                COALESCE(description_ua, description) AS description,
                created_at, updated_at
         FROM products WHERE id = $1`, [id]
      );
    } else if (lang === 'pl') {
      result = await pool.query(
        `SELECT id,
                COALESCE(name_pl, name) AS name,
                price,
                COALESCE(description_pl, description) AS description,
                created_at, updated_at
         FROM products WHERE id = $1`, [id]
      );
    } else {
      result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    }

    if (!result.rows.length) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error fetching product', details: err.message });
  }
});

// Update product
router.put('/:id', authenticateJWT, [
  param('id').isInt().withMessage('ID must be an integer'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: 'Validation error', details: errors.array() });
  }
  const {
    name, price, description,
    name_ua, name_pl,
    description_ua, description_pl,
    auto_translate = false
  } = req.body;
  const { id } = req.params;

  try {
    // Get pool from the server context
    const pool = req.app.locals.pool;
    
    if (!pool) {
      // Mock mode - update mock product
      const product = mockProducts.find(p => p.id == id);
      if (!product) return res.status(404).send('Product not found');

      if (name !== undefined)        product.name = name;
      if (price !== undefined)       product.price = price;
      if (description !== undefined) product.description = description;
      if (name_ua !== undefined)     product.name_ua = name_ua;
      if (name_pl !== undefined)     product.name_pl = name_pl;
      if (description_ua !== undefined) product.description_ua = description_ua;
      if (description_pl !== undefined) product.description_pl = description_pl;

      if (auto_translate && (name || description)) {
        try {
          const translated = await translateProduct({
            name: product.name,
            description: product.description
          });
          product.name_ua = product.name_ua || translated.name_ua;
          product.name_pl = product.name_pl || translated.name_pl;
          product.description_ua = product.description_ua || translated.description_ua;
          product.description_pl = product.description_pl || translated.description_pl;
        } catch (err) {
          console.error('Auto-translation failed during update:', err);
        }
      }

      product.updated_at = new Date();
      return res.json(product);
    }

    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (!rows.length) return res.status(404).json({ success: false, error: 'Product not found' });

    let product = { ...rows[0] };
    if (name !== undefined)        product.name = name;
    if (price !== undefined)       product.price = price;
    if (description !== undefined) product.description = description;
    if (name_ua !== undefined)     product.name_ua = name_ua;
    if (name_pl !== undefined)     product.name_pl = name_pl;
    if (description_ua !== undefined) product.description_ua = description_ua;
    if (description_pl !== undefined) product.description_pl = description_pl;

    if (auto_translate && (name || description)) {
      try {
        const translated = await translateProduct({
          name: product.name,
          description: product.description
        });
        product.name_ua = product.name_ua || translated.name_ua;
        product.name_pl = product.name_pl || translated.name_pl;
        product.description_ua = product.description_ua || translated.description_ua;
        product.description_pl = product.description_pl || translated.description_pl;
      } catch (err) {
        console.error('Auto-translation failed during update:', err);
      }
    }

    const searchable_text = buildSearchableText(product);

    const updateRes = await pool.query(
      `UPDATE products SET
         name = $1,
         price = $2,
         description = $3,
         name_ua = $4,
         name_pl = $5,
         description_ua = $6,
         description_pl = $7,
         searchable_text = $8
       WHERE id = $9
       RETURNING *`,
      [
        product.name,
        product.price,
        product.description,
        product.name_ua,
        product.name_pl,
        product.description_ua,
        product.description_pl,
        searchable_text,
        id
      ]
    );
    return res.json(updateRes.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error updating product', details: err.message });
  }
});

// Delete product
router.delete('/:id', authenticateJWT, [
  param('id').isInt().withMessage('ID must be an integer')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: 'Validation error', details: errors.array() });
  }
  try {
    // Get pool from the server context
    const pool = req.app.locals.pool;
    
    if (!pool) {
      // Mock mode - delete mock product
      const initialLength = mockProducts.length;
      mockProducts = mockProducts.filter(p => p.id != req.params.id);
      if (mockProducts.length === initialLength) {
        return res.status(404).send('Product not found');
      }
      return res.sendStatus(204);
    }

    const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, error: 'Product not found' });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error deleting product', details: err.message });
  }
});

// Auto-translate product
router.post('/:id/auto-translate', async (req, res) => {
  try {
    // Get pool from the server context
    const pool = req.app.locals.pool;
    
    if (!pool) {
      // Mock mode - auto-translate mock product
      const product = mockProducts.find(p => p.id == req.params.id);
      if (!product) return res.status(404).send('Product not found');

      const translated = await translateProduct(product);

      product.name_ua = product.name_ua || translated.name_ua;
      product.name_pl = product.name_pl || translated.name_pl;
      product.description_ua = product.description_ua || translated.description_ua;
      product.description_pl = product.description_pl || translated.description_pl;

      product.updated_at = new Date();
      return res.json(product);
    }

    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, error: 'Product not found' });

    const translated = await translateProduct(rows[0]);

    const searchable_text = buildSearchableText(translated);

    const upd = await pool.query(
      `UPDATE products SET
         name_ua = $1,
         name_pl = $2,
         description_ua = $3,
         description_pl = $4,
         searchable_text = $5
       WHERE id = $6 RETURNING *`,
      [
        translated.name_ua,
        translated.name_pl,
        translated.description_ua,
        translated.description_pl,
        searchable_text,
        req.params.id
      ]
    );
    return res.json(upd.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error auto-translating product', details: err.message });
  }
});

// Batch auto-translate products
router.post('/batch-auto-translate', async (req, res) => {
  const { productIds = [] } = req.body;
  try {
    // Get pool from the server context
    const pool = req.app.locals.pool;
    
    if (!pool) {
      // Mock mode - batch auto-translate mock products
      const results = [];
      for (const id of productIds) {
        const product = mockProducts.find(p => p.id == id);
        if (!product) {
          results.push({ id, success: false, message: 'Not found' });
          continue;
        }
        const translated = await translateProduct(product);
        product.name_ua = product.name_ua || translated.name_ua;
        product.name_pl = product.name_pl || translated.name_pl;
        product.description_ua = product.description_ua || translated.description_ua;
        product.description_pl = product.description_pl || translated.description_pl;
        product.updated_at = new Date();
        results.push({ id, success: true });
      }
      return res.json({ results });
    }

    const results = [];
    for (const id of productIds) {
      try {
        const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (!rows.length) {
          results.push({ id, success: false, message: 'Not found' });
          continue;
        }

        const translated = await translateProduct(rows[0]);
        const searchable_text = buildSearchableText(translated);

        await pool.query(
          `UPDATE products SET
             name_ua = $1,
             name_pl = $2,
             description_ua = $3,
             description_pl = $4,
             searchable_text = $5
           WHERE id = $6`,
          [
            translated.name_ua,
            translated.name_pl,
            translated.description_ua,
            translated.description_pl,
            searchable_text,
            id
          ]
        );
        results.push({ id, success: true });
      } catch (error) {
        results.push({ id, success: false, message: error.message });
      }
    }
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error batch auto-translating products', details: err.message });
  }
});

// Upload product image
router.post('/:id/image', authenticateJWT, imageUpload.single('image'), async (req, res) => {
  const { id } = req.params;
  const pool = req.app.locals.pool;
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }
  try {
    // Save image path to DB
    const imagePath = `/uploads/products/${req.file.filename}`;
    const result = await pool.query('UPDATE products SET image = $1 WHERE id = $2 RETURNING *', [imagePath, id]);
    if (!result.rows.length) {
      // Remove file if product not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ imageUrl: imagePath, product: result.rows[0] });
  } catch (err) {
    // Remove file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

module.exports = router;
