  const axios = require('axios');

// Region configuration
const REGIONS = {
  PL: { code: 'PL', name: 'Poland', defaultLang: 'pl' },
  UA: { code: 'UA', name: 'Ukraine', defaultLang: 'ua' }
};

// Default region fallback
const DEFAULT_REGION = 'PL';

// IP to region mapping (simplified - you can expand this)
const IP_REGION_MAP = {
  // Poland IP ranges (simplified examples)
  '185.': 'PL',
  '31.': 'PL',
  '83.': 'PL',
  '89.': 'PL',
  '91.': 'PL',
  '95.': 'PL',
  '178.': 'PL',
  '195.': 'PL',
  '212.': 'PL',
  
  // Ukraine IP ranges (simplified examples)
  '46.': 'UA',
  '62.': 'UA',
  '77.': 'UA',
  '91.': 'UA', // Note: 91. is in both, will use geo service
  '176.': 'UA',
  '178.': 'UA', // Note: 178. is in both, will use geo service
  '185.': 'UA', // Note: 185. is in both, will use geo service
  '195.': 'UA', // Note: 195. is in both, will use geo service
  '212.': 'UA'  // Note: 212. is in both, will use geo service
};

/**
 * Detect region from IP address using geo IP service
 */
async function detectRegionFromIP(ip) {
  try {
    // Try ipapi.co first (free tier)
    const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
      timeout: 5000
    });
    
    if (response.data && response.data.country_code) {
      const countryCode = response.data.country_code.toUpperCase();
      if (countryCode === 'PL') return 'PL';
      if (countryCode === 'UA') return 'UA';
    }
  } catch (error) {
    console.log('ipapi.co failed, trying ipwhois.io...');
    
    try {
      // Fallback to ipwhois.io
      const response = await axios.get(`https://ipwhois.app/json/${ip}`, {
        timeout: 5000
      });
      
      if (response.data && response.data.country_code) {
        const countryCode = response.data.country_code.toUpperCase();
        if (countryCode === 'PL') return 'PL';
        if (countryCode === 'UA') return 'UA';
      }
    } catch (fallbackError) {
      console.log('Both geo IP services failed:', fallbackError.message);
    }
  }
  
  return DEFAULT_REGION;
}

/**
 * Get region from IP address using local mapping first, then geo service
 */
async function getRegionFromIP(ip) {
  // Check local IP mapping first
  for (const [prefix, region] of Object.entries(IP_REGION_MAP)) {
    if (ip.startsWith(prefix)) {
      return region;
    }
  }
  
  // If no local match, use geo service
  return await detectRegionFromIP(ip);
}

/**
 * Get language from request (query param, header, or region default)
 */
function getLanguageFromRequest(req, region) {
  // Priority: query param > header > region default
  const queryLang = req.query.lang;
  const headerLang = req.headers['x-sv-lang'];
  
  if (queryLang && ['en', 'pl', 'ua'].includes(queryLang)) {
    return queryLang;
  }
  
  if (headerLang && ['en', 'pl', 'ua'].includes(headerLang)) {
    return headerLang;
  }
  
  // Return region default language
  return REGIONS[region].defaultLang;
}

/**
 * Region detection middleware
 */
async function regionDetect(req, res, next) {
  try {
    // Check for existing region cookie
    let region = req.cookies?.sv_region;
    
    if (!region || !REGIONS[region]) {
      // Get client IP
      const clientIP = req.ip || 
                      req.connection.remoteAddress || 
                      req.socket.remoteAddress ||
                      req.connection.socket?.remoteAddress ||
                      '127.0.0.1';
      
      // Clean IP address (remove IPv6 prefix if present)
      const cleanIP = clientIP.replace(/^::ffff:/, '');
      
      console.log(`Detecting region for IP: ${cleanIP}`);
      
      // Detect region from IP
      region = await getRegionFromIP(cleanIP);
      
      // Set region cookie (30 days)
      res.cookie('sv_region', region, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      console.log(`Region detected: ${region} for IP: ${cleanIP}`);
    }
    
    // Set region and language on request object
    req.region = region;
    req.lang = getLanguageFromRequest(req, region);
    
    // Add region info to response locals for frontend
    res.locals.region = {
      code: region,
      name: REGIONS[region].name,
      defaultLang: REGIONS[region].defaultLang
    };
    
    next();
  } catch (error) {
    console.error('Region detection error:', error);
    
    // Fallback to default region
    req.region = DEFAULT_REGION;
    req.lang = REGIONS[DEFAULT_REGION].defaultLang;
    
    res.locals.region = {
      code: DEFAULT_REGION,
      name: REGIONS[DEFAULT_REGION].name,
      defaultLang: REGIONS[DEFAULT_REGION].defaultLang
    };
    
    next();
  }
}

module.exports = {
  regionDetect,
  REGIONS,
  getRegionFromIP,
  getLanguageFromRequest
};
