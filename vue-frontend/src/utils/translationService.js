import axios from 'axios';

// In Vite, environment variables are accessed via import.meta.env
// and must be prefixed with VITE_ in the .env file
const API_KEY = import.meta.env.VITE_TRANSLATION_API_KEY;
const TRANSLATION_API_URL = import.meta.env.VITE_TRANSLATION_API_URL || 'https://translation.googleapis.com/language/translate/v2';

/**
 * Translates text using an external translation API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'pl', 'uk')
 * @param {string} sourceLanguage - Source language code (default 'en' for English)
 * @returns {Promise<string>} - Translated text
 */
export async function translateText(text, targetLanguage, sourceLanguage = 'en') {
  if (!text || text.trim().length === 0) {
    return '';
  }
  
  try {
    // Using Google Translate API as an example
    const response = await axios.post(
      TRANSLATION_API_URL,
      {},
      {
        params: {
          q: text,
          target: targetLanguage,
          source: sourceLanguage,
          key: API_KEY
        }
      }
    );
    
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // Fallback to original text
  }
}

/**
 * Batch translate product fields
 * @param {Object} product - Product object with name and description
 * @param {Array<string>} targetLanguages - Array of target language codes
 * @param {string} sourceLanguage - Source language code
 * @returns {Promise<Object>} - Product with translated fields
 */
export async function translateProduct(product, targetLanguages = ['uk', 'pl'], sourceLanguage = 'en') {
  const translatedProduct = { ...product };
  
  try {
    // Translate to each target language
    for (const lang of targetLanguages) {
      if (lang === sourceLanguage) continue;
      
      // Translate name if it doesn't already exist
      if (!translatedProduct[`name_${lang}`] && translatedProduct.name) {
        translatedProduct[`name_${lang}`] = await translateText(
          translatedProduct.name, 
          lang, 
          sourceLanguage
        );
      }
      
      // Translate description if it doesn't already exist
      if (!translatedProduct[`description_${lang}`] && translatedProduct.description) {
        translatedProduct[`description_${lang}`] = await translateText(
          translatedProduct.description, 
          lang, 
          sourceLanguage
        );
      }
    }
    
    return translatedProduct;
  } catch (error) {
    console.error('Product translation failed:', error);
    return product;
  }
}