import axios from 'axios';

// Hardcode the API base URL since there's no .env in the frontend
const API_BASE_URL = 'http://localhost:3002/api';

/**
 * Translates text using the backend API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'pl', 'ua')
 * @param {string} sourceLanguage - Source language code (default 'en')
 * @returns {Promise<string>} - Translated text
 */
export async function translateText(text, targetLanguage, sourceLanguage = 'en') {
  if (!text || text.trim().length === 0) {
    return '';
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/translate/text`, {
      text,
      targetLanguage,
      sourceLanguage
    });
    return response.data.translatedText;
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // Fallback to original text
  }
}

/**
 * Translates product fields using the backend API
 * @param {Object} product - Product object with name and description
 * @param {Array<string>} targetLanguages - Array of target language codes
 * @param {string} sourceLanguage - Source language code
 * @returns {Promise<Object>} - Product with translated fields
 */
export async function translateProduct(product, targetLanguages = ['ua', 'pl'], sourceLanguage = 'en') {
  try {
    const response = await axios.post(`${API_BASE_URL}/translate/product`, {
      product,
      targetLanguages,
      sourceLanguage
    });
    return response.data;
  } catch (error) {
    console.error('Product translation failed:', error);
    return product;
  }
}