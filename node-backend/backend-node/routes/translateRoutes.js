  const express = require('express');
  const router = express.Router();

  /**
   * Simple translation routes that return original text
   * TODO: Integrate with a translation service like Google Translate or DeepL
   */

  // Translate text endpoint
  router.post('/text', async (req, res) => {
    try {
      const { text, targetLanguage, sourceLanguage = 'en' } = req.body;
      
      if (!text || targetLanguage === sourceLanguage) {
        return res.json({ success: true, translatedText: text });
      }
      
      // For now, return the original text
      // TODO: Integrate with translation service
      console.log(`Translation requested: ${text} (${sourceLanguage} -> ${targetLanguage})`);
      
      res.json({ success: true, translatedText: text });
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({ success: false, error: 'Translation failed', details: error.message });
    }
  });

  // Translate product endpoint
  router.post('/product', async (req, res) => {
    try {
      const { product, targetLanguages = ['ua', 'pl'], sourceLanguage = 'en' } = req.body;
      
      if (!product) {
        return res.status(400).json({ success: false, error: 'Product is required' });
      }
      
      // For now, return the original product
      // TODO: Integrate with translation service
      console.log(`Product translation requested for languages: ${targetLanguages.join(', ')}`);
      
      res.json({ success: true, product });
    } catch (error) {
      console.error('Product translation error:', error);
      res.status(500).json({ success: false, error: 'Product translation failed', details: error.message });
    }
  });

  module.exports = router;