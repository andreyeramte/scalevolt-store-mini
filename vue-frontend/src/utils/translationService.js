// FILE: backend-node/utils/translationService.cjs

const axios = require('axios'); // ✅ Верно для CommonJS

/**
 * Translates text to the target language
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
    const response = await axios.post(
      'http://localhost:3002/api/translate/text',
      { text, targetLanguage, sourceLanguage }
    );
    return response.data.translatedText;
  } catch (err) {
    console.error('Translation error:', err);
    return text;
  }
}

/**
 * Translates all product fields
 * @param {Object} product
 * @param {Array<string>} targetLanguages
 * @param {string} sourceLanguage
 * @returns {Promise<Object>}
 */
async function translateProduct(product, targetLanguages = ['ua', 'pl'], sourceLanguage = 'en') {
  try {
    const response = await axios.post(
      'http://localhost:3002/api/translate/product',
      { product, targetLanguages, sourceLanguage }
    );
    return response.data;
  } catch (err) {
    console.error('Product translation error:', err);
    return product;
  }
}

/**
 * Picks the right translation from an object
 * @param {Object|string} content
 * @param {string} currentLocale
 * @returns {string}
 */
function getTranslatedContent(content, currentLocale = 'en') {
  if (typeof content === 'string') return content;
  if (content && typeof content === 'object') {
    if (content[currentLocale]) return content[currentLocale];
    if (content.ua)            return content.ua;
    const first = Object.keys(content)[0];
    return content[first] || '';
  }
  return '';
}

module.exports = {
  translateText,
  translateProduct,
  getTranslatedContent
};
