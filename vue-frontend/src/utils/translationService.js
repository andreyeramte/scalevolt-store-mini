// FILE: backend-node/utils/translationService.cjs

const axios = require('axios'); // ✅ CommonJS

/**
 * Translates a single piece of text
 * @param {string} text
 * @param {string} targetLanguage
 * @param {string} sourceLanguage
 * @returns {Promise<string>}
 */
async function translateText(text, targetLanguage, sourceLanguage = 'en') {
  try {
    if (!text || targetLanguage === sourceLanguage) {
      return text;
    }
    const { data } = await axios.post(
      'http://localhost:3002/api/translate/text',
      { text, targetLanguage, sourceLanguage }
    );
    return data.translatedText;
  } catch (err) {
    console.error('Translation error:', err);
    return text;
  }
}

/**
 * Translates all fields of a product object
 * @param {Object} product
 * @param {string[]} targetLanguages
 * @param {string} sourceLanguage
 * @returns {Promise<Object>}
 */
async function translateProduct(product, targetLanguages = ['ua', 'pl'], sourceLanguage = 'en') {
  try {
    const { data } = await axios.post(
      'http://localhost:3002/api/translate/product',
      { product, targetLanguages, sourceLanguage }
    );
    return data;
  } catch (err) {
    console.error('Product translation error:', err);
    return product;
  }
}

/**
 * Given a translation object or plain string, pick the right locale
 * @param {Object|string} content
 * @param {string} currentLocale
 * @returns {string}
 */
function getTranslatedContent(content, currentLocale = 'en') {
  if (typeof content === 'string') {
    return content;
  }
  if (content && typeof content === 'object') {
    if (content[currentLocale]) {
      return content[currentLocale];
    }
    if (content.ua) {
      return content.ua;
    }
    // Fallback to first available
    const firstKey = Object.keys(content)[0];
    return content[firstKey] || '';
  }
  return '';
}

// // module.exports = {
//   translateText,
//   translateProduct,
//   getTranslatedContent,
// };
