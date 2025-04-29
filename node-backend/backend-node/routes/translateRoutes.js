// FILE: backend/utils/translationService.js

const { Translate } = require('@google-cloud/translate').v2;
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

// Cache for translation results to reduce API calls
const translationCache = new Map();
const CACHE_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Initialize Google Translate client
 * Handles both service account file and environment variable auth methods
 */
function initTranslateClient() {
  try {
    // Check if service account credentials are provided as environment variables
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      // Create a temporary JSON file with the credentials
      const tempCredentialsPath = path.join(__dirname, '../', 'google-credentials-temp.json');
      fs.writeFileSync(tempCredentialsPath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      process.env.GOOGLE_APPLICATION_CREDENTIALS = tempCredentialsPath;
    }

    // Initialize with credentials from environment variable or file
    return new Translate();
  } catch (error) {
    console.error('Error initializing Google Translate client:', error);
    throw error;
  }
}

// Initialize the translate client
const translate = initTranslateClient();

/**
 * Translate text to target language
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code (optional)
 * @returns {Promise<string>} - Translated text
 */
async function translateText(text, targetLanguage, sourceLanguage = null) {
  if (!text) return '';
  
  // Convert to lowercase language codes
  targetLanguage = targetLanguage.toLowerCase();
  if (sourceLanguage) sourceLanguage = sourceLanguage.toLowerCase();
  
  // Convert ISO language codes if needed
  targetLanguage = convertLanguageCode(targetLanguage);
  if (sourceLanguage) sourceLanguage = convertLanguageCode(sourceLanguage);
  
  // Return original text if target and source languages are the same
  if (sourceLanguage && sourceLanguage === targetLanguage) {
    return text;
  }
  
  // Generate cache key
  const cacheKey = `${text}:${targetLanguage}:${sourceLanguage || 'auto'}`;
  
  // Check cache first
  if (translationCache.has(cacheKey)) {
    const cachedTranslation = translationCache.get(cacheKey);
    if (Date.now() - cachedTranslation.timestamp < CACHE_EXPIRY) {
      return cachedTranslation.translatedText;
    }
    // Cache expired, remove it
    translationCache.delete(cacheKey);
  }
  
  try {
    // Prepare translation options
    const options = { to: targetLanguage };
    if (sourceLanguage) {
      options.from = sourceLanguage;
    }
    
    // Call Google Translate API
    const [translation] = await translate.translate(text, options);
    
    // Cache the result
    translationCache.set(cacheKey, {
      translatedText: translation,
      timestamp: Date.now()
    });
    
    return translation;
  } catch (error) {
    console.error(`Translation error (${sourceLanguage} to ${targetLanguage}):`, error);
    return text; // Return original text in case of error
  }
}

/**
 * Translate product fields to multiple languages
 * @param {Object} product - Product object with name, description, etc.
 * @param {Array<string>} targetLanguages - Array of target language codes
 * @param {string} sourceLanguage - Source language code
 * @returns {Promise<Object>} - Product with translated fields
 */
async function translateProduct(product, targetLanguages = ['ua', 'pl'], sourceLanguage = 'en') {
  if (!product) return null;
  
  const fieldsToTranslate = ['name', 'description', 'shortDescription', 'features', 'specifications'];
  const result = { ...product };
  
  // Initialize translations object if it doesn't exist
  if (!result.translations) {
    result.translations = {};
  }
  
  // Add source language to translations if it doesn't exist
  const sourceCode = convertLanguageCode(sourceLanguage);
  if (!result.translations[sourceCode]) {
    result.translations[sourceCode] = {
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription || '',
      features: product.features || [],
      specifications: product.specifications || {}
    };
  }
  
  // Translate each field to each target language
  for (const language of targetLanguages) {
    const langCode = convertLanguageCode(language);
    
    // Skip if target language is the source language
    if (langCode === sourceCode) continue;
    
    // Initialize language object if it doesn't exist
    if (!result.translations[langCode]) {
      result.translations[langCode] = {};
    }
    
    // Translate text fields
    for (const field of ['name', 'description', 'shortDescription']) {
      if (product[field]) {
        result.translations[langCode][field] = await translateText(
          product[field],
          langCode,
          sourceCode
        );
      }
    }
    
    // Translate features array if it exists
    if (Array.isArray(product.features)) {
      result.translations[langCode].features = await Promise.all(
        product.features.map(feature => translateText(feature, langCode, sourceCode))
      );
    }
    
    // Translate specifications object if it exists
    if (product.specifications && typeof product.specifications === 'object') {
      result.translations[langCode].specifications = {};
      
      for (const [key, value] of Object.entries(product.specifications)) {
        // Translate the specification key
        const translatedKey = await translateText(key, langCode, sourceCode);
        
        // Translate the value if it's a string
        if (typeof value === 'string') {
          result.translations[langCode].specifications[translatedKey] = 
            await translateText(value, langCode, sourceCode);
        } else {
          // Keep non-string values as-is
          result.translations[langCode].specifications[translatedKey] = value;
        }
      }
    }
  }
  
  return result;
}

/**
 * Convert language codes between different standards
 * @param {string} code - Language code
 * @returns {string} - Converted language code
 */
function convertLanguageCode(code) {
  if (!code) return '';
  
  const codeMap = {
    // ISO 639-1 to Google Translate codes
    'ua': 'ua', // Ukrainian
    'ua': 'ua', // Ukrainian (common alias)
    'pl': 'pl', // Polish
    'en': 'en', // English
    // Add more mappings as needed
  };
  
  return codeMap[code.toLowerCase()] || code.toLowerCase();
}

module.exports = {
  translateText,
  translateProduct
};