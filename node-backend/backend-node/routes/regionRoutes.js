const express = require('express');
const router = express.Router();
const { regionDetect, REGIONS } = require('../middleware/regionDetect');

/**
 * GET /api/region-detect
 * Detect user's region and return region info
 */
router.get('/region-detect', regionDetect, (req, res) => {
  try {
    const regionInfo = {
      region: req.region,
      regionName: REGIONS[req.region].name,
      defaultLang: REGIONS[req.region].defaultLang,
      currentLang: req.lang,
      availableRegions: Object.keys(REGIONS).map(code => ({
        code,
        name: REGIONS[code].name,
        defaultLang: REGIONS[code].defaultLang
      }))
    };
    
    res.json({
      success: true,
      data: regionInfo
    });
  } catch (error) {
    console.error('Region detection API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to detect region'
    });
  }
});

/**
 * POST /api/region-set
 * Allow user to manually set their region
 */
router.post('/region-set', (req, res) => {
  try {
    const { region, lang } = req.body;
    
    // Validate region
    if (!region || !REGIONS[region]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid region. Must be PL or UA.'
      });
    }
    
    // Validate language
    const validLangs = ['en', 'pl', 'ua'];
    if (lang && !validLangs.includes(lang)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid language. Must be en, pl, or ua.'
      });
    }
    
    // Set region cookie
    res.cookie('sv_region', region, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    // Set language cookie if provided
    if (lang) {
      res.cookie('sv_lang', lang, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
    
    res.json({
      success: true,
      data: {
        region,
        regionName: REGIONS[region].name,
        defaultLang: REGIONS[region].defaultLang,
        currentLang: lang || REGIONS[region].defaultLang
      }
    });
  } catch (error) {
    console.error('Region set API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set region'
    });
  }
});

/**
 * GET /api/regions
 * Get list of available regions
 */
router.get('/regions', (req, res) => {
  try {
    const regions = Object.keys(REGIONS).map(code => ({
      code,
      name: REGIONS[code].name,
      defaultLang: REGIONS[code].defaultLang
    }));
    
    res.json({
      success: true,
      data: regions
    });
  } catch (error) {
    console.error('Regions API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get regions'
    });
  }
});

module.exports = router;
