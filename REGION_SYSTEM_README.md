# Region-Aware Product Filtering System

This document describes the implementation of the region-aware product filtering system for ScaleVolt Store, supporting Poland (PL) and Ukraine (UA) markets.

## Overview

The system automatically detects user regions based on IP address and filters products accordingly. Users can manually override their region while maintaining language preferences.

## Architecture

### Backend Components

#### 1. Database Migration
- **File**: `node-backend/backend-node/db/migrations/20250101_add_available_regions_to_products.sql`
- **Purpose**: Adds `available_regions` column to products table
- **Schema**: `text[]` array with values 'PL', 'UA'
- **Default**: All products available in both regions initially

#### 2. Region Detection Middleware
- **File**: `node-backend/backend-node/middleware/regionDetect.js`
- **Features**:
  - IP-based region detection using geo IP services
  - Fallback to local IP mapping
  - Cookie-based region persistence (30 days)
  - Language detection with fallback to region defaults

#### 3. Region API Routes
- **File**: `node-backend/backend-node/routes/regionRoutes.js`
- **Endpoints**:
  - `GET /api/region-detect` - Detect user's region
  - `POST /api/region-set` - Manually set region/language
  - `GET /api/regions` - List available regions

#### 4. Updated Product Routes
- **File**: `node-backend/backend-node/routes/productRoutes.js`
- **Changes**:
  - Region filtering in `GET /api/products`
  - Region filtering in `GET /api/products/search`
  - Mock data includes `available_regions` field

### Frontend Components

#### 1. Region Context
- **File**: `src/contexts/RegionContext.jsx`
- **Features**:
  - Manages region and language state
  - Automatic region detection on first visit
  - Local storage persistence
  - API integration for region updates

#### 2. Region Banner
- **File**: `src/components/RegionBanner.jsx`
- **Purpose**: Notifies users when detected region differs from current
- **Actions**: Accept/Decline region switch

#### 3. Updated Components
- **LanguageSelector**: Now uses region context
- **ProductsView**: Passes region to API calls
- **SearchBar**: Includes region in navigation

## Configuration

### Environment Variables
```bash
# No additional environment variables required
# System uses free geo IP services by default
```

### Supported Regions
```javascript
const REGIONS = {
  PL: { code: 'PL', name: 'Poland', defaultLang: 'pl' },
  UA: { code: 'UA', name: 'Ukraine', defaultLang: 'ua' }
};
```

### Supported Languages
- `en` - English (available in all regions)
- `pl` - Polish (default for Poland)
- `ua` - Ukrainian (default for Ukraine)

## Usage

### Backend Setup

1. **Run Database Migration**:
   ```bash
   cd node-backend/backend-node
   # Execute the migration SQL file in your Supabase dashboard
   # Or run: psql -d your_db -f db/migrations/20250101_add_available_regions_to_products.sql
   ```

2. **Install Dependencies**:
   ```bash
   npm install axios cookie-parser
   ```

3. **Start Server**:
   ```bash
   npm start
   ```

### Frontend Setup

1. **Install Dependencies** (already included):
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Region Detection
```http
GET /api/region-detect
```

**Response**:
```json
{
  "success": true,
  "data": {
    "region": "PL",
    "regionName": "Poland",
    "defaultLang": "pl",
    "currentLang": "pl",
    "availableRegions": [
      {"code": "PL", "name": "Poland", "defaultLang": "pl"},
      {"code": "UA", "name": "Ukraine", "defaultLang": "ua"}
    ]
  }
}
```

### Set Region
```http
POST /api/region-set
Content-Type: application/json

{
  "region": "UA",
  "lang": "en"
}
```

### Products with Region Filtering
```http
GET /api/products?region=UA
GET /api/products/search?q=solar&region=UA
```

## Testing

### Manual Testing
1. Clear browser cookies/local storage
2. Visit site from different IP (or use VPN)
3. Verify region detection and product filtering
4. Test language switching within regions

### Automated Testing
```bash
cd node-backend
node test-region-detection.js
```

## Product Management

### Adding Products with Region Availability

#### Via API
```javascript
const product = {
  name: "Solar Panel 100W",
  available_regions: ["PL", "UA"], // Available in both regions
  // ... other fields
};
```

#### Via Database
```sql
INSERT INTO products (name, available_regions, ...) 
VALUES ('Product Name', ARRAY['PL'], ...);
```

### Region Availability Rules
- `available_regions = NULL` or `available_regions = '{}'` → Available everywhere
- `available_regions = ARRAY['PL']` → Available only in Poland
- `available_regions = ARRAY['PL', 'UA']` → Available in both regions

## Mobile Adaptivity

The system is fully responsive with:
- Mobile-optimized region banner
- Responsive language selector
- Mobile-friendly product filtering

## Security Considerations

- Region detection uses free, public geo IP services
- IP addresses are not logged or stored permanently
- Cookies are HTTP-only and secure in production
- CORS is configured for frontend domains only

## Performance

- GIN index on `available_regions` for fast filtering
- Region detection cached in cookies (30 days)
- Minimal API calls for region updates
- Efficient product filtering with Supabase

## Troubleshooting

### Common Issues

1. **Region not detected**:
   - Check geo IP service availability
   - Verify IP address format
   - Check firewall/proxy settings

2. **Products not filtering**:
   - Verify `available_regions` column exists
   - Check column data format (text array)
   - Verify region codes match exactly

3. **Frontend not updating**:
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check CORS configuration

### Debug Mode
Enable detailed logging by setting:
```javascript
console.log('Region detection:', req.region);
console.log('Language:', req.lang);
```

## Future Enhancements

1. **Additional Regions**: Support for more countries
2. **Advanced IP Mapping**: Custom IP range configurations
3. **Region Analytics**: Track region usage patterns
4. **A/B Testing**: Region-specific content variations
5. **CDN Integration**: Region-based content delivery

## Support

For technical support or questions about the region system, refer to the main project documentation or contact the development team.
